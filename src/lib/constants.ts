/** Demo OTP — replace with real API verification in production */
export const VALID_OTP = "123456";

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
