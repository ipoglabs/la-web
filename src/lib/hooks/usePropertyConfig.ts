import { useCountryStore } from "@/store/countryStore";
import { getPropertyConfig } from "@/config/property";
import type { PropertyFormConfig } from "@/config/property";

export function usePropertyConfig(): PropertyFormConfig {
  const country = useCountryStore((s) => s.country);
  return getPropertyConfig(country?.code ?? "SG");
}
