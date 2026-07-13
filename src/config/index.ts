/**
 * config/index.ts — The single entry point for all country configuration.
 *
 * This is the ONLY file consumers import from:
 *   import { COUNTRY_CONFIGS, GLOBAL_CONFIG, getConfigByIso } from "@/config";
 *
 * ─── HOW TO ADD A NEW COUNTRY ────────────────────────────────────────────────
 *   1. Create /config/countries/au.ts  (copy sg.ts as a template)
 *   2. Add "au" to CountryCode in /config/types.ts
 *   3. Import AU_CONFIG below and add it to COUNTRY_CONFIGS
 *   TypeScript will immediately error on any missing required field.
 *   No other file needs to change — the gate, context, hooks, and API calls
 *   all derive from COUNTRY_CONFIGS automatically.
 *
 * ─── HOW TO ADD A NEW FEATURE FLAG ──────────────────────────────────────────
 *   1. Add the flag to CountryFeatures in /config/types.ts
 *   2. Add a global default in GLOBAL_CONFIG.features in /config/global.ts
 *   3. Override per country in the relevant /config/countries/*.ts file
 *
 * ─── CONSUMERS — use these imports everywhere ─────────────────────────────────
 *   COUNTRY_CONFIGS    → record of all active country configs
 *   GLOBAL_CONFIG      → app-wide defaults (cookie durations, date format, features)
 *   getConfigByIso()   → look up config by ISO code (e.g. "IN", "GB") — server + middleware
 *   getFeatures()      → resolved feature flags for a country (global + overrides merged)
 *   getDateFormat()    → resolved date format for a country (country override or global)
 *   CountryCode        → type — "in" | "gb" | "sg"
 *   CountryConfig      → type — full config shape
 *   CountryFeatures    → type — feature flag shape
 */

// ─── Re-export types (consumers get everything from one import) ───────────────
export type {
  AppStage,
  CountryCode,
  CountryConfig,
  CountryFeatures,
  ListingsDataSource,
  StageFeatures,
} from "@/config/types";

// ─── Internal imports — used by helpers defined below ────────────────────────
import type {
  AppStage,
  CountryCode,
  CountryConfig,
  CountryFeatures,
  ListingsDataSource,
  StageFeatures,
} from "@/config/types";
import { GLOBAL_CONFIG } from "@/config/global";
import { IN_CONFIG } from "@/config/countries/in";
import { GB_CONFIG } from "@/config/countries/gb";
import { SG_CONFIG } from "@/config/countries/sg";

// Re-export GLOBAL_CONFIG so consumers get it from @/config (one import path)
export { GLOBAL_CONFIG };

/**
 * The master record of all active countries.
 * The country gate (middleware + country-context.ts) derives ALLOWED_COUNTRY_CODES
 * from this record — adding a country here automatically allows it through the gate.
 *
 * TODO [INTEGRATION]: When adding a new country, also ensure:
 *   1. Backend API supports the new isoCode in country-scoped queries
 *      (e.g. /api/listings?country=AU must return results, not a 400)
 *   2. Legal HTML files exist at /public/html/{code}/privacy-policy.html etc.
 *   3. A flag image exists at /public/flags/{isoCode.toLowerCase()}.svg
 *   4. COUNTRY_HEADER env or Cloudflare WAF updated if geo-routing rules exist
 */
export const COUNTRY_CONFIGS: Record<CountryCode, CountryConfig> = {
  in: IN_CONFIG,
  gb: GB_CONFIG,
  sg: SG_CONFIG,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Look up config by ISO 3166-1 alpha-2 code (e.g. "IN", "GB", "SG").
 * Returns the internal CountryCode key + full CountryConfig, or null if not found.
 *
 * Use this in server components and middleware where you have an ISO code
 * (from the cookie or Cloudflare header) and need the full config:
 *
 *   const entry = getConfigByIso(raw);   // raw = cookie value e.g. "GB"
 *   entry?.code    → "gb"
 *   entry?.config  → GB_CONFIG
 */
export function getConfigByIso(
  isoCode: string,
): { code: CountryCode; config: CountryConfig } | null {
  const entry = Object.entries(COUNTRY_CONFIGS).find(
    ([, cfg]) => cfg.isoCode === isoCode,
  );
  if (!entry) return null;
  return { code: entry[0] as CountryCode, config: entry[1] };
}

/**
 * Returns the effective feature flags for a country.
 * Merges GLOBAL_CONFIG.features with any per-country overrides.
 *
 *   const flags = getFeatures("gb");
 *   flags.donationFooter  → true (global default, no override)
 */
export function getFeatures(code: CountryCode): CountryFeatures {
  return { ...GLOBAL_CONFIG.features, ...(COUNTRY_CONFIGS[code].features ?? {}) };
}

/**
 * Returns the effective date format for a country.
 * Uses the country's own dateFormat if set, otherwise falls back to GLOBAL_CONFIG.dateFormat.
 *
 *   getDateFormat("in")  → "DD/MM/YYYY"  (global default — India has no override)
 */
export function getDateFormat(code: CountryCode): string {
  return COUNTRY_CONFIGS[code].dateFormat ?? GLOBAL_CONFIG.dateFormat;
}

/** Resolve current runtime stage from public env var, defaulting to dev. */
export function getAppStage(): AppStage {
  const raw = (process.env.NEXT_PUBLIC_APP_STAGE ?? "dev").toLowerCase();
  if (raw === "qa" || raw === "staging" || raw === "prod") return raw;
  return "dev";
}

/** Effective listings source for a country + stage (country override > global default). */
export function getListingsDataSource(code: CountryCode, stage: AppStage): ListingsDataSource {
  return COUNTRY_CONFIGS[code].listingsSourceByStage?.[stage]
    ?? GLOBAL_CONFIG.listingsSourceByStage[stage];
}

/**
 * Whether a stage-gated feature flag is enabled for the current (or given) stage.
 *
 *   isStageFeatureEnabled("twoFactorAuth")          → true only in dev
 *   isStageFeatureEnabled("twoFactorAuth", "prod")   → false
 */
export function isStageFeatureEnabled(
  flag: keyof StageFeatures,
  stage: AppStage = getAppStage(),
): boolean {
  return GLOBAL_CONFIG.stageFeatures[stage][flag];
}
