import type { MockListing } from "@/lib/mock/mock-listing-schema";
import {
  SG_JOBS_FULL_TIME,
  SG_JOBS_PART_TIME,
  SG_JOBS_FREELANCE,
  SG_JOBS_INTERNSHIP,
  SG_JOBS_TEMP_SEASONAL,
  SG_JOBS_WANTED,
} from "./jobs-data";

export {
  SG_JOBS_FULL_TIME,
  SG_JOBS_PART_TIME,
  SG_JOBS_FREELANCE,
  SG_JOBS_INTERNSHIP,
  SG_JOBS_TEMP_SEASONAL,
  SG_JOBS_WANTED,
};

export const SG_JOBS_SUBCATEGORY_MAP: Record<string, MockListing[]> = {
  full_time: SG_JOBS_FULL_TIME,
  part_time: SG_JOBS_PART_TIME,
  freelance: SG_JOBS_FREELANCE,
  internship: SG_JOBS_INTERNSHIP,
  temp_seasonal: SG_JOBS_TEMP_SEASONAL,
  wanted: SG_JOBS_WANTED,
};

export const SG_ALL_JOBS_LISTINGS: MockListing[] = [
  ...SG_JOBS_FULL_TIME,
  ...SG_JOBS_PART_TIME,
  ...SG_JOBS_FREELANCE,
  ...SG_JOBS_INTERNSHIP,
  ...SG_JOBS_TEMP_SEASONAL,
  ...SG_JOBS_WANTED,
];
