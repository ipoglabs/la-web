/**
 * config/countries/in.ts — India country configuration.
 *
 * This file is the single source of truth for everything India-specific.
 * To disable India: remove it from COUNTRY_CONFIGS in config/index.ts.
 * To add a feature flag override: add it to the `features` block below.
 *
 * TODO [INTEGRATION]: Verify all fields below match production legal/finance data
 * before go-live. companyRegNo in particular must be the actual CIN number.
 */

import type { CountryConfig } from "@/config/types";

export const IN_CONFIG: CountryConfig = {

  // ── Identity ────────────────────────────────────────────────────────────────
  isoCode:     "IN",
  displayName: "India",

  // ── Locale ──────────────────────────────────────────────────────────────────
  locationScope:  ["IN"],
  radiusUnit:     "km",
  currency:       "INR",
  currencySymbol: "₹",
  // in.ts — use whatever matches your actual in.ts currencySymbol value there
locationPlaceholder: "e.g. Mumbai, Delhi, Bengaluru",
  // dateFormat not set — inherits GLOBAL_CONFIG.dateFormat (DD/MM/YYYY)

  // ── Legal ───────────────────────────────────────────────────────────────────
  companyName:  "Lokalads India Pvt. Ltd.",
  companyRegNo: "U74999KA2020PTC123456",

  // ── Features ────────────────────────────────────────────────────────────────
  features: {
    donationFooter: true, // Active donation campaign in India
  },

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
