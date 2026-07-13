/**
 * config/types.ts — Core type definitions for the country configuration system.
 *
 * Pure types only — no runtime code, no imports from other files.
 * Every other config file imports from here.
 */

// ─── Country code ─────────────────────────────────────────────────────────────

/**
 * Internal config key for each supported country.
 * Deliberately lowercase and short — used as Record keys and URL params.
 *
 * HOW TO ADD A NEW COUNTRY:
 *   1. Add the code here:  "au" | "my" | ...
 *   2. Create /config/countries/au.ts
 *   3. Register it in /config/index.ts
 *   TypeScript will error on every missing required field — that's intentional.
 *
 * NOTE: Use ISO 3166-1 alpha-2 codes only (e.g. "gb", not "uk" — "UK" is not
 * a valid ISO code and breaks hreflang/Google indexing). Corrected app-wide
 * 2026-07-13 — see md/architecture/database/01-schema.md.
 */
export type CountryCode = "in" | "gb" | "sg";

/** Deployment stage used for runtime data-source switching. */
export type AppStage = "dev" | "qa" | "staging" | "prod";

/** Backing source for listings data. */
export type ListingsDataSource = "mock" | "db";

// ─── Feature flags ────────────────────────────────────────────────────────────

/**
 * Per-country feature flags.
 * Global defaults live in GLOBAL_CONFIG.features (config/global.ts).
 * Each country can override individual flags via its `features` field.
 *
 * HOW TO ADD A NEW FLAG:
 *   1. Add it here with its type.
 *   2. Add a global default in GLOBAL_CONFIG.features (config/global.ts).
 *   3. TypeScript immediately errors on every country entry missing a decision.
 */
export interface CountryFeatures {
  /** Show / hide the donation banner in the app footer. */
  donationFooter: boolean;

  // ── Add future flags below ──────────────────────────────────────────────────
  // payments: boolean;
  // premiumListings: boolean;
  // chat: boolean;
}

// ─── Stage feature flags ──────────────────────────────────────────────────────

/**
 * Deployment-stage feature flags — gate features by environment rather than
 * by country. Global values live in GLOBAL_CONFIG.stageFeatures
 * (config/global.ts), keyed by AppStage.
 *
 * Use this for features that are rolled out progressively across
 * dev → qa → staging → prod (e.g. in-development security features),
 * as opposed to CountryFeatures which varies by market.
 *
 * HOW TO ADD A NEW STAGE FLAG:
 *   1. Add it here with its type.
 *   2. Set its value for every stage in GLOBAL_CONFIG.stageFeatures (config/global.ts).
 *   3. Read it via isStageFeatureEnabled("flagName") from config/index.ts.
 */
export interface StageFeatures {
  /** Show the Two-Factor Authentication row in Profile → Account Settings. */
  twoFactorAuth: boolean;

  // ── Add future stage-gated flags below ──────────────────────────────────────
}

// ─── Country config shape ─────────────────────────────────────────────────────

/**
 * Full configuration for a single country.
 * Every field is required unless marked optional — no silent gaps.
 *
 * FIELD GROUPS:
 *   Identity    → isoCode, displayName
 *   Locale      → locationScope, radiusUnit, currency, currencySymbol, dateFormat
 *   Legal       → companyName, companyRegNo
 *   Features    → features (partial override of GLOBAL_CONFIG.features)
 *   Content     → enabledCategories
 */
export interface CountryConfig {

  // ── Identity ────────────────────────────────────────────────────────────────

  /**
   * ISO 3166-1 alpha-2 code (uppercase).
   * Bridges the internal config key (e.g. "gb") and the cookie / CF header value ("GB").
   * ALLOWED_COUNTRY_CODES is derived from this field — adding a country here
   * automatically lets it through the country gate.
   */
  isoCode: string;

  /**
   * Full display name shown in header, footer, overlays, and API calls.
   * e.g. "India", "United Kingdom", "Singapore"
   */
  displayName: string;

  // ── Locale ──────────────────────────────────────────────────────────────────

  /**
   * Country codes passed to LocationPicker.countryScope to restrict
   * location autocomplete to this country only.
   */
  locationScope: string[];

  /**
   * Distance unit for the radius picker.
   * UK uses miles; all others use kilometres.
   */
  radiusUnit: "km" | "mi";

  /** ISO 4217 currency code — e.g. "INR", "GBP", "SGD" */
  currency: string;

  /** Currency symbol — e.g. "₹", "£", "S$" */
  currencySymbol: string;

  /** Placeholder text shown in the location search input — e.g. "e.g. London, Manchester, Birmingham" */
  locationPlaceholder: string;
  /**
   * Country-specific date format override.
   * If omitted, GLOBAL_CONFIG.dateFormat is used.
   */
  dateFormat?: string;

  // ── Add future locale fields below ──────────────────────────────────────────
  // locale?: string;       // e.g. "en-IN", "en-GB", "en-SG"
  // timezone?: string;     // e.g. "Asia/Kolkata", "Europe/London"
  // phonePrefix?: string;  // e.g. "+91", "+44", "+65"

  // ── Legal ───────────────────────────────────────────────────────────────────

  /** Legal entity name — shown in footer and legal documents. */
  companyName: string;

  /** Company registration / incorporation number for this country. */
  companyRegNo: string;

  // ── Features ────────────────────────────────────────────────────────────────

  /**
   * Country-level feature flag overrides.
   * Only specify flags that differ from GLOBAL_CONFIG.features.
   * Merged at runtime by getFeatures(code) in config/index.ts.
   */
  features?: Partial<CountryFeatures>;

  /**
   * Optional per-country override for listings source by deployment stage.
   * Any missing stage falls back to GLOBAL_CONFIG.listingsSourceByStage.
   */
  listingsSourceByStage?: Partial<Record<AppStage, ListingsDataSource>>;

  // ── Content ─────────────────────────────────────────────────────────────────

  /**
   * Ordered list of category IDs enabled for this country.
   * Controls which categories appear on the landing page CategoryGrid and in
   * the listings page filter — and in what order.
   * Omit a category ID to hide it for this country.
   */
  enabledCategories: string[];

  // ── Add future config namespaces below ──────────────────────────────────────
  // footer?: FooterConfig;
  // header?: HeaderConfig;
  // payments?: PaymentsConfig;
}
