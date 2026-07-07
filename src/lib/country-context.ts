import { COUNTRY_CONFIGS, GLOBAL_CONFIG } from "@/config";

// ── Cookie names ────────────────────────────────────────────────────────────
export const COUNTRY_COOKIE         = "countryContext";
export const PENDING_COOKIE         = "countryPending";
export const BLOCKED_COOKIE         = "countryBlocked";

// ── Cookie max-ages — driven from GLOBAL_CONFIG (no magic numbers in code) ──
export const COOKIE_MAX_AGE         = GLOBAL_CONFIG.cookieMaxAgeDays * 86_400;
export const BLOCKED_COOKIE_MAX_AGE = GLOBAL_CONFIG.blockedCookieMaxAgeHours * 3_600;
export const PENDING_MAX_AGE        = 60 * 5; // 5 min — intentionally short, not user-configurable

// ── Detection config ────────────────────────────────────────────────────────
export const IPINFO_URL        = "https://ipinfo.io/json";
export const DETECTION_TIMEOUT = 5_000; // 5 seconds

// ── Gate: countries the app is actively available in ────────────────────────
// Derived from COUNTRY_CONFIGS.isoCode — single source of truth.
// Adding a country to COUNTRY_CONFIGS with an isoCode automatically allows it here.
export const ALLOWED_COUNTRY_CODES: string[] = Object.values(COUNTRY_CONFIGS).map(c => c.isoCode);

export function isAllowedCountry(code: string): boolean {
  return ALLOWED_COUNTRY_CODES.includes(code);
}

// ── Phone input: broader list of countries we accept numbers from ────────────
// Keep separate — SUPPORTED_CODES / isSupportedCountry are used by PhoneNumberInput.
// Do NOT merge with ALLOWED_COUNTRY_CODES.
export const SUPPORTED_CODES = ["SG", "IN", "US", "GB", "AU", "MY", "CA", "NZ", "CH", "FR", "AE", "DE", "AT"] as const;
export type SupportedCountry = (typeof SUPPORTED_CODES)[number];

export function isSupportedCountry(code: string): code is SupportedCountry {
  return (SUPPORTED_CODES as readonly string[]).includes(code);
}
