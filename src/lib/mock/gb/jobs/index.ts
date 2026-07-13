import type { MockListing } from "../../mock-listing-schema";
export { JOBS_FULL_TIME } from './full-time';
export { JOBS_PART_TIME } from './part-time';
export { JOBS_FREELANCE } from './freelance';
export { JOBS_INTERNSHIP } from './internship';
export { JOBS_TEMP_SEASONAL } from './temp-seasonal';
export { JOBS_WANTED } from './wanted';

import { JOBS_FULL_TIME } from './full-time';
import { JOBS_PART_TIME } from './part-time';
import { JOBS_FREELANCE } from './freelance';
import { JOBS_INTERNSHIP } from './internship';
import { JOBS_TEMP_SEASONAL } from './temp-seasonal';
import { JOBS_WANTED } from './wanted';

export const ALL_JOBS_LISTINGS: MockListing[] = [
  ...JOBS_FULL_TIME,
  ...JOBS_PART_TIME,
  ...JOBS_FREELANCE,
  ...JOBS_INTERNSHIP,
  ...JOBS_TEMP_SEASONAL,
  ...JOBS_WANTED,
];

export const GB_ALL_JOBS_LISTINGS: MockListing[] = ALL_JOBS_LISTINGS;
export const GB_JOBS_SUBCATEGORY_MAP: Record<string, MockListing[]> = {
  full_time: JOBS_FULL_TIME,
  part_time: JOBS_PART_TIME,
  freelance: JOBS_FREELANCE,
  internship: JOBS_INTERNSHIP,
  temp_seasonal: JOBS_TEMP_SEASONAL,
  wanted: JOBS_WANTED,
};

