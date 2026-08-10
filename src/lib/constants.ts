/** Demo OTP — replace with real API verification in production */
export const VALID_OTP = "123456";

/** Max saved-search alerts a single user may have active at once — see
 * app/actions/createAlert.ts (server-enforced) and my-alerts/MyAlertsList.tsx
 * (client-side counter/disable so the user doesn't hit the error blind). */
export const MAX_ALERTS_PER_USER = 5;

/**
 * Canonical production site URL — single source for robots.ts, sitemap.ts,
 * and the root layout's metadataBase.
 *
 * Reads NEXT_PUBLIC_APP_URL — the same env var the email engine already
 * uses (see lib/email/templates/_base.tsx). Kept as a separate constant
 * here rather than importing from the email engine, to avoid coupling
 * SEO code to email-template internals.
 */
export const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
