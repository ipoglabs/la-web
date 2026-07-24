/**
 * config/global.ts — App-wide defaults that apply to ALL countries.
 *
 * These values drive:
 *   - Cookie durations (middleware + country-cookie.ts)
 *   - UI copy ("Your preference is saved for 30 days" in the overlay)
 *   - Default feature flags (merged with per-country overrides at runtime)
 *   - Default date format (overridable per country)
 *
 * Change ONE value here → every consumer updates automatically.
 * No magic numbers anywhere else in the codebase.
 */

import type { AppStage, CountryFeatures, ListingsDataSource, StageFeatures } from "@/config/types";

export const GLOBAL_CONFIG = {

  // ── Dates ───────────────────────────────────────────────────────────────────

  /**
   * Default date format — used across all countries unless a country
   * declares its own dateFormat in its config file.
   */
  dateFormat: "DD/MM/YYYY",

  // ── Cookie durations ────────────────────────────────────────────────────────

  /**
   * How long the countryContext cookie persists (days).
   * This is the user's "session" duration for their country selection.
   * Controls both the cookie max-age AND the "saved for X days" UI copy.
   *
   * Change here → middleware, cookie helper, overlay footer all update.
   */
  cookieMaxAgeDays: 30,

  /**
   * How long the countryBlocked cookie persists (hours).
   * Kept deliberately short — allows VPN users and travellers to
   * retry by selecting an allowed country manually.
   */
  blockedCookieMaxAgeHours: 1,

  // ── Feature flag defaults ───────────────────────────────────────────────────

  /**
   * Global default feature flags — apply to ALL countries.
   * Override individual flags per country via the `features` field
   * in each country config file (config/countries/*.ts).
   *
   * Use getFeatures(code) from config/index.ts to get the effective flags
   * for a country — it merges these defaults with per-country overrides.
   */
  features: {
    donationFooter: true,

    // ── Add future global feature defaults below ────────────────────────────
    // payments: false,
    // premiumListings: false,
    // chat: false,
  } satisfies CountryFeatures,

  // ── Listings data source defaults by stage ───────────────────────────────
  /**
   * Global source switch for listings data.
   * Country configs can override specific stages via listingsSourceByStage.
   */
  listingsSourceByStage: {
    dev: "db",
    qa: "db",
    staging: "db",
    prod: "db",
  } satisfies Record<AppStage, ListingsDataSource>,

  // ── Stage-gated feature flags ─────────────────────────────────────────────
  /**
   * Feature flags gated by deployment stage (not country).
   * Read via isStageFeatureEnabled(flag) from config/index.ts.
   *
   * twoFactorAuth: in-development security feature — only visible in dev so
   * it can be reviewed/demoed without exposing an unfinished flow in
   * qa/staging/prod.
   */
  stageFeatures: {
    dev: { twoFactorAuth: true },
    qa: { twoFactorAuth: false },
    staging: { twoFactorAuth: false },
    prod: { twoFactorAuth: false },
  } satisfies Record<AppStage, StageFeatures>,

  // ── CI/CD stage domains ───────────────────────────────────────────────────
  domainsByStage: {
    dev: "dev.lokalads.com",
    qa: "qa-lokalads.com",
    staging: "staging.lokalads.com",
    prod: "lokalads.com",
  } satisfies Record<AppStage, string>,

  // ── Add future global settings below ───────────────────────────────────────
  // timezone: "UTC",
  // defaultPageSize: 12,
  // searchRadiusDefault: 25,

};
