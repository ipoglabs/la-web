/**
 * config/countries/gb.ts — United Kingdom country configuration.
 *
 * This file is the single source of truth for everything UK-specific.
 * Internal config key is "gb" (ISO 3166-1 alpha-2) — not "uk", which is not
 * a valid ISO code and was corrected app-wide during the 2026-07-13
 * architecture pass. See config/types.ts CountryCode for details.
 * To disable UK: remove it from COUNTRY_CONFIGS in config/index.ts.
 * To add a feature flag override: add it to the `features` block below.
 *
 * TODO [INTEGRATION]: Verify all fields below match production legal/finance data
 * before go-live. companyRegNo must be the actual Companies House number.
 */

import type { CountryConfig } from "@/config/types";

export const GB_CONFIG: CountryConfig = {

  // ── Identity ────────────────────────────────────────────────────────────────
  isoCode:     "GB",
  displayName: "United Kingdom",

  // ── Locale ──────────────────────────────────────────────────────────────────
  locationScope:  ["UK"],
  radiusUnit:     "mi",   // UK uses miles, not kilometres
  currency:       "GBP",
  currencySymbol: "£",
  // dateFormat not set — inherits GLOBAL_CONFIG.dateFormat (DD/MM/YYYY)

  // ── Legal ───────────────────────────────────────────────────────────────────
  companyName:  "Lokalads UK Ltd.",
  companyRegNo: "12345678",

  // ── Features ────────────────────────────────────────────────────────────────
  // No overrides — all flags inherit GLOBAL_CONFIG.features

  // ── Listings source switch by deployment stage ───────────────────────────
  listingsSourceByStage: {
    dev: "db",
    qa: "db",
    staging: "db",
    prod: "db",
  },

  // ── Enabled categories (ordered) ────────────────────────────────────────────
  // Note: "special_offers" not yet active in UK — omitted intentionally
  enabledCategories: [
    "property",
    "vehicles",
    "jobs",
    "services",
    "pets",
    "business",
    "community",
    "education",
    "health_beauty",
    "food_dining",
    "travel_stays",
    "baby_kids",
    "sports_outdoors",
    "electronics_tech",
    "home_furniture",
    "fashion_clothing",
    "musical_instruments",
    "books_media_collectibles",
    "tickets_vouchers",
    "free_giveaway",
  ],

};
