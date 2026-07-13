import { INPropertyConfig } from "./IN";
import { SGPropertyConfig } from "./SG";
import { GBPropertyConfig } from "./GB";
import type { PropertyFormConfig } from "./types";

const CONFIGS: Record<string, PropertyFormConfig> = {
  IN: INPropertyConfig,
  SG: SGPropertyConfig,
  GB: GBPropertyConfig,
};

// Default to SG if country is unrecognised
const FALLBACK = SGPropertyConfig;

export function getPropertyConfig(countryCode: string): PropertyFormConfig {
  return CONFIGS[countryCode] ?? FALLBACK;
}

export type { PropertyFormConfig };
