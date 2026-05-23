import { INJobConfig } from "./IN";
import { SGJobConfig } from "./SG";
import { GBJobConfig } from "./GB";
import type { JobFormConfig } from "./types";

const CONFIGS: Record<string, JobFormConfig> = {
  IN: INJobConfig,
  SG: SGJobConfig,
  GB: GBJobConfig,
};

export function getJobConfig(countryCode: string): JobFormConfig {
  return CONFIGS[countryCode] ?? SGJobConfig;
}

export type { JobFormConfig };
