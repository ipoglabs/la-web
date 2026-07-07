import { useCountryStore } from "@/store/countryStore";
import { getCountryConfig } from "@/config/countries";
import type { CountryConfig } from "@/config/countries";

export function useCountryConfig(): CountryConfig {
  const country = useCountryStore((s) => s.country);
  return getCountryConfig(country?.code ?? "SG");
}
