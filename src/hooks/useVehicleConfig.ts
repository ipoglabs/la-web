import { useCountryStore } from "@/store/countryStore";
import { getVehicleConfig } from "@/config/vehicle";
import type { VehicleFormConfig } from "@/config/vehicle";

export function useVehicleConfig(): VehicleFormConfig {
  const country = useCountryStore((s) => s.country);
  return getVehicleConfig(country?.code ?? "SG");
}
