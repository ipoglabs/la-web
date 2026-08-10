"use server";

import connectDB from "@/lib/db";
import Alert from "@/models/Alert";
import User from "@/models/user";
import { getSession } from "@/lib/auth";
import { logActivity } from "@/lib/activityLog";
import { MAX_ALERTS_PER_USER } from "@/lib/constants";
import { sendAlertCreatedEmail } from "@/lib/alerts/sendAlertCreatedEmail";
import type { AlertPayload } from "@/components/create-alert/types";

export type CreateAlertResult =
  | { success: true; alertId: string }
  | { success: false; error: string; code?: "limit_reached" };

/**
 * Persists a saved-search alert from the Create Alert wizard
 * (components/create-alert/CreateAlertJourney.tsx). Matched against real
 * Posts by lib/jobs/alert-match.job.ts (instant) and alert-digest.job.ts
 * (daily/weekly) — see findAlertMatches in lib/jobs/_utils.ts.
 *
 * AlertPayload's richer per-category `filterValues` (toggle selections like
 * fuel type, EV range, etc.) aren't persisted — the match jobs don't
 * implement matching against them, so storing them would just be more dead
 * data. Only the fields the model + match jobs actually use are saved:
 * category, subCategory, keywords, location, notifyVia. `frequency` isn't
 * collected by any step in the wizard today — defaults to the schema's
 * "instant".
 */
export async function createAlert(payload: AlertPayload): Promise<CreateAlertResult> {
  const session = await getSession();
  if (!session?.userId) {
    return { success: false, error: "unauthenticated" };
  }

  if (!payload?.mainCategory?.id || !payload?.subCategory?.id) {
    return { success: false, error: "Missing category" };
  }

  await connectDB();

  const existingCount = await Alert.countDocuments({ userId: session.userId });
  if (existingCount >= MAX_ALERTS_PER_USER) {
    return {
      success: false,
      code: "limit_reached",
      error: `You've reached the limit of ${MAX_ALERTS_PER_USER} alerts. Delete an old one from Manage Alerts to create a new one.`,
    };
  }

  const name =
    [payload.subCategory.label, payload.location?.label].filter(Boolean).join(" in ") ||
    payload.mainCategory.label;

  const alert = await Alert.create({
    userId: session.userId,
    name,
    category: payload.mainCategory.id,
    subCategory: payload.subCategory.id,
    keywords: payload.keywords?.length ? payload.keywords : undefined,
    location: payload.location?.label || undefined,
    notifyVia: payload.notifyChannels?.length ? payload.notifyChannels : ["email"],
  });

  await logActivity(session.userId, "ALERT_CREATED", {
    alertId: String(alert._id),
    title: name,
    category: payload.mainCategory.id,
  });

  // Confirmation email — fresh DB read rather than the (possibly stale,
  // up-to-7-day-old) session JWT email claim. Best-effort: a failed send
  // here shouldn't fail alert creation, which already succeeded above.
  const user = await User.findById(session.userId).select("email").lean<{ email?: string } | null>();
  if (user?.email) {
    await sendAlertCreatedEmail({
      email: user.email,
      alertName: name,
      categoryLabel: payload.mainCategory.label,
      subCategoryLabel: payload.subCategory.label,
      keywords: payload.keywords,
      locationLabel: payload.location?.label,
      notifyVia: payload.notifyChannels?.length ? payload.notifyChannels : ["email"],
    });
  }

  return { success: true, alertId: String(alert._id) };
}
