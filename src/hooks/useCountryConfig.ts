import { useCountryStore } from "@/store/countryStore";
import { COUNTRY_CONFIGS } from "@/config";
import type { CountryConfig } from "@/config";

export function useCountryConfig(): CountryConfig {
  const country = useCountryStore((s) => s.country);
  const code = (country?.code ?? "sg").toLowerCase() as keyof typeof COUNTRY_CONFIGS;
  return COUNTRY_CONFIGS[code] ?? COUNTRY_CONFIGS.sg;
}