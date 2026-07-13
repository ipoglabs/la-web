/**
 * config/countries/sg.ts — Singapore country configuration.
 *
 * This file is the single source of truth for everything Singapore-specific.
 * To disable Singapore: remove it from COUNTRY_CONFIGS in config/index.ts.
 * To add a feature flag override: add it to the `features` block below.
 *
 * TODO [INTEGRATION]: Verify all fields below match production legal/finance data
 * before go-live. companyRegNo must be the actual ACRA UEN number.
 */

import type { CountryConfig } from "@/config/types";

export const SG_CONFIG: CountryConfig = {

  // ── Identity ────────────────────────────────────────────────────────────────
  isoCode:     "SG",
  displayName: "Singapore",

  // ── Locale ──────────────────────────────────────────────────────────────────
  locationScope:  ["SG"],
  radiusUnit:     "km",
  currency:       "SGD",
  currencySymbol: "S$",
  // dateFormat not set — inherits GLOBAL_CONFIG.dateFormat (DD/MM/YYYY)

  // ── Legal ───────────────────────────────────────────────────────────────────
  companyName:  "Lokalads Singapore Pte. Ltd.",
  companyRegNo: "202012345G",

  // ── Features ────────────────────────────────────────────────────────────────
  // No overrides — all flags inherit GLOBAL_CONFIG.features

  // ── Listings source switch by deployment stage ───────────────────────────
  listingsSourceByStage: {
    dev: "mock",
    qa: "mock",
    staging: "mock",
    prod: "db",
  },

  // ── Enabled categories (ordered) ────────────────────────────────────────────
  enabledCategories: [
    "property",
    "vehicles",
    "jobs",
    "services",
    "pets",
    "business",
    "community",
    "special_offers",
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
