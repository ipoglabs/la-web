import { INVehicleConfig } from "./IN";
import { SGVehicleConfig } from "./SG";
import { GBVehicleConfig } from "./GB";
import type { VehicleFormConfig } from "./types";

const CONFIGS: Record<string, VehicleFormConfig> = {
  IN: INVehicleConfig,
  SG: SGVehicleConfig,
  GB: GBVehicleConfig,
};

export function getVehicleConfig(countryCode: string): VehicleFormConfig {
  return CONFIGS[countryCode] ?? SGVehicleConfig;
}

export type { VehicleFormConfig };
