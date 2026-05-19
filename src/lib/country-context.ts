// Cookie names
export const COUNTRY_COOKIE      = "countryContext";
export const PENDING_COOKIE      = "countryPending";
export const COOKIE_MAX_AGE      = 60 * 60 * 24 * 30; // 30 days
export const PENDING_MAX_AGE     = 60 * 5;            //  5 min — bridges first load only

// Detection config
export const IPINFO_URL          = "https://ipinfo.io/json";
export const DETECTION_TIMEOUT   = 5_000;             //  5 seconds

// Countries this app serves
export const SUPPORTED_CODES = ["SG", "IN", "US", "GB", "AU", "MY", "CA", "NZ", "CH", "FR", "AE", "DE", "AT"] as const;
export type SupportedCountry = (typeof SUPPORTED_CODES)[number];

export function isSupportedCountry(code: string): code is SupportedCountry {
  return (SUPPORTED_CODES as readonly string[]).includes(code);
}
