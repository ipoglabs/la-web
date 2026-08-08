"use server";

import connectDB from "@/lib/db";
import Alert from "@/models/Alert";
import { getSession } from "@/lib/auth";
import { logActivity } from "@/lib/activityLog";
import type { AlertPayload } from "@/components/create-alert/types";

export type CreateAlertResult =
  | { success: true; alertId: string }
  | { success: false; error: string };

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

  return { success: true, alertId: String(alert._id) };
}
