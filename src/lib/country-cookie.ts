// Client-side only — browser cookie helpers for country context
import {
  COUNTRY_COOKIE,
  PENDING_COOKIE,
  COOKIE_MAX_AGE,
  type SupportedCountry,
} from "@/lib/country-context";

/** Write countryContext cookie and clear the pending flag. */
export function commitCountry(code: SupportedCountry) {
  document.cookie = `${COUNTRY_COOKIE}=${code}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  document.cookie = `${PENDING_COOKIE}=; path=/; max-age=0`;
}

/** Clear all country cookies — used by the dev reset utility. */
export function clearCountryCookies() {
  document.cookie = `${COUNTRY_COOKIE}=; path=/; max-age=0`;
  document.cookie = `${PENDING_COOKIE}=; path=/; max-age=0`;
}
