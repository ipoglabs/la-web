"use server";

import { cookies } from "next/headers";
import connectDB from "@/lib/db";
import Alert from "@/models/Alert";
import User from "@/models/user";
import { getSession } from "@/lib/auth";
import { logActivity } from "@/lib/activityLog";
import { MAX_ALERTS_PER_USER } from "@/lib/constants";
import { COUNTRY_COOKIE, isAllowedCountry } from "@/lib/country-context";
import { isRangeFilter, resolveFilters } from "@/lib/listing-filters";
import { sendAlertCreatedEmail } from "@/lib/alerts/sendAlertCreatedEmail";
import type { AlertPayload } from "@/components/create-alert/types";

/** The submitted filter values the market's listings page offers; anything else is dropped. */
function validFilters(
  category: string,
  sub: string,
  country: string | undefined,
  values: Record<string, string[]>,
): Record<string, string[]> {
  const result: Record<string, string[]> = {};
  for (const filter of resolveFilters(category, sub, { country, values })) {
    if (isRangeFilter(filter)) {
      for (const key of [`${filter.id}_min`, `${filter.id}_max`]) {
        const v = values[key]?.[0];
        if (v && /^\d+$/.test(v)) result[key] = [v];
      }
      continue;
    }
    const allowed = new Set(filter.options.map((o) => o.value));
    const picked = (Array.isArray(values[filter.id]) ? values[filter.id] : []).filter((v) => allowed.has(v));
    if (picked.length) result[filter.id] = filter.singleSelect ? picked.slice(0, 1) : picked;
  }
  return result;
}

export type CreateAlertResult =
  | { success: true; alertId: string }
  | { success: false; error: string; code?: "limit_reached" };

/**
 * Persists a saved-search alert from the Create Alert wizard
 * (components/create-alert/CreateAlertJourney.tsx). Matched against real
 * Posts by lib/jobs/alert-match.job.ts (instant) and alert-digest.job.ts
 * (daily/weekly) — see findAlertMatches in lib/jobs/_utils.ts.
 *
 * The alert is saved in the viewer's market (the country cookie, as
 * addPost.ts saves a post's) with its filter values, which the match jobs
 * run through the listings page's own filter query. Only filters and
 * options the market's listings page offers (resolveFilters) are kept, and
 * price bounds must be whole numbers. `frequency` isn't collected by any step
 * in the wizard today — defaults to the schema's "instant".
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

  const rawCountry = (await cookies()).get(COUNTRY_COOKIE)?.value ?? "";
  const country = isAllowedCountry(rawCountry) ? rawCountry.toLowerCase() : undefined;
  const filters = validFilters(payload.mainCategory.id, payload.subCategory.id, country, payload.filterValues ?? {});

  const alert = await Alert.create({
    userId: session.userId,
    name,
    category: payload.mainCategory.id,
    subCategory: payload.subCategory.id,
    country,
    filters: Object.keys(filters).length ? filters : undefined,
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
