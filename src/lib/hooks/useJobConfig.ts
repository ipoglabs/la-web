import { useCountryStore } from "@/store/countryStore";
import { getJobConfig } from "@/config/job";
import type { JobFormConfig } from "@/config/job";

export function useJobConfig(): JobFormConfig {
  const country = useCountryStore((s) => s.country);
  return getJobConfig(country?.code ?? "SG");
}
