// Client-side only — browser cookie helpers for country context
import {
  COUNTRY_COOKIE,
  PENDING_COOKIE,
  BLOCKED_COOKIE,
  COOKIE_MAX_AGE,
  BLOCKED_COOKIE_MAX_AGE,
} from "@/lib/country-context";

/** Write countryContext cookie and clear pending + blocked flags. */
export function commitCountry(code: string) {
  document.cookie = `${COUNTRY_COOKIE}=${code}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  document.cookie = `${PENDING_COOKIE}=; path=/; max-age=0`;
  document.cookie = `${BLOCKED_COOKIE}=; path=/; max-age=0`;
}

/**
 * Write countryBlocked cookie and clear the pending flag.
 * Called when IP detection resolves a country that is not in the allowed list.
 */
export function commitBlockedCountry(code: string) {
  document.cookie = `${BLOCKED_COOKIE}=${code}; path=/; max-age=${BLOCKED_COOKIE_MAX_AGE}; SameSite=Lax`;
  document.cookie = `${PENDING_COOKIE}=; path=/; max-age=0`;
}

/** Clear all country cookies — used by the dev reset utility. */
export function clearCountryCookies() {
  document.cookie = `${COUNTRY_COOKIE}=; path=/; max-age=0`;
  document.cookie = `${PENDING_COOKIE}=; path=/; max-age=0`;
  document.cookie = `${BLOCKED_COOKIE}=; path=/; max-age=0`;
}
