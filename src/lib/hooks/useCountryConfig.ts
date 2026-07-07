"use client";

/**
 * useCountryConfig — Standard hook for country-aware components and API calls.
 *
 * Returns the full CountryConfig for the active country, plus the ISO code and
 * internal CountryCode key. This is the ONLY import you need when a component
 * or page needs to be country-aware.
 *
 * ─── API ARCHITECTURE PATTERN ────────────────────────────────────────────────
 *
 * ALL API calls in this app must be country-scoped. Use this hook to get the
 * countryCode and pass it to every API call:
 *
 *   const { isoCode, countryCode, config } = useCountryConfig();
 *
 *   // Pass to API calls:
 *   fetch(`/api/listings?country=${isoCode}`)
 *   fetch(`/api/alerts?country=${isoCode}`)
 *
 *   // Use config for UI decisions:
 *   config.currency          → "INR", "GBP", "SGD"
 *   config.currencySymbol    → "₹", "£", "S$"
 *   config.locationScope     → ["IN"] / ["UK"] / ["SG"] — pass to LocationPicker
 *   config.radiusUnit        → "km" / "mi" — pass to LocationPicker
 *   config.displayName       → "India" / "United Kingdom" / "Singapore"
 *   config.enabledCategories → ordered category list for this country
 *
 * ─── NEVER hardcode country in a component ───────────────────────────────────
 *
 *   ❌  COUNTRY_CONFIGS["in"]              ← hardcoded, breaks other countries
 *   ❌  countryScope={["UK"]}              ← hardcoded
 *   ✅  const { config } = useCountryConfig()
 *       config.locationScope               ← driven by active session country
 *
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { getConfigByIso, type CountryCode, type CountryConfig } from "@/config";
import { useCountry } from "@/components/country/CountryProvider";

export interface ActiveCountry {
  /** ISO 3166-1 alpha-2 code — what Cloudflare injects and cookies store (e.g. "IN", "GB", "SG") */
  isoCode: string;
  /** Internal config key — e.g. "in", "uk", "sg" */
  countryCode: CountryCode;
  /** Full country config — currency, locationScope, radiusUnit, displayName, features, etc. */
  config: CountryConfig;
}

export function useCountryConfig(): ActiveCountry {
  const iso = useCountry();
  const result = getConfigByIso(iso);
  if (!result) {
    throw new Error(
      `useCountryConfig: no config found for ISO code "${iso}". ` +
      `Ensure COUNTRY_CONFIGS has an entry with isoCode: "${iso}".`
    );
  }
  return { isoCode: iso, countryCode: result.code, config: result.config };
}
