import { COUNTRY_CONFIGS, getConfigByIso } from "@/config";
import type { CountryConfig, CountryCode } from "@/config";
import { useCountry } from "@/components/country/CountryProvider";

/**
 * Single source of truth for "what country config is active right now".
 *
 * IMPORTANT: this reads from `useCountry()` (the `countryContext` cookie /
 * CountryProvider context, set by proxy.ts middleware and country-prefixed
 * URLs) — NOT from the legacy `useCountryStore` Zustand store, which reads a
 * different, unrelated `user_country` cookie that the rest of the app never
 * writes to. That mismatch is why components reading the old store (e.g.
 * AppHeader) used to go stale on country switch while components fed by the
 * server layout (e.g. AppFooter) updated correctly.
 *
 * Must be called from a component rendered inside <CountryProvider>.
 */
export function useCountryConfig(): {
  countryConfig: CountryConfig;
  countryCode: CountryCode;
  config: CountryConfig;
} {
  const isoCode = useCountry();

  const countryCode: CountryCode =
    getConfigByIso(isoCode)?.code ?? "sg";

  const countryConfig =
    COUNTRY_CONFIGS[countryCode] ?? COUNTRY_CONFIGS.sg;

  return {
    countryConfig,
    countryCode,
    config: countryConfig,
  };
}