import { INCountryConfig } from "./IN";
import { SGCountryConfig } from "./SG";
import { GBCountryConfig } from "./GB";
import type { CountryConfig } from "./types";

const CONFIGS: Record<string, CountryConfig> = {
  IN: INCountryConfig,
  SG: SGCountryConfig,
  GB: GBCountryConfig,
};

export function getCountryConfig(countryCode: string): CountryConfig {
  return CONFIGS[countryCode] ?? SGCountryConfig;
}

export type { CountryConfig };
