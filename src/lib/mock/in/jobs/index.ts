import type { MockListing } from "@/lib/mock/mock-listing-schema";
import {
  IN_JOBS_FULL_TIME,
  IN_JOBS_PART_TIME,
  IN_JOBS_FREELANCE,
  IN_JOBS_INTERNSHIP,
  IN_JOBS_TEMP_SEASONAL,
  IN_JOBS_WANTED,
} from "./jobs-data";

export {
  IN_JOBS_FULL_TIME,
  IN_JOBS_PART_TIME,
  IN_JOBS_FREELANCE,
  IN_JOBS_INTERNSHIP,
  IN_JOBS_TEMP_SEASONAL,
  IN_JOBS_WANTED,
};

export const IN_JOBS_SUBCATEGORY_MAP: Record<string, MockListing[]> = {
  full_time: IN_JOBS_FULL_TIME,
  part_time: IN_JOBS_PART_TIME,
  freelance: IN_JOBS_FREELANCE,
  internship: IN_JOBS_INTERNSHIP,
  temp_seasonal: IN_JOBS_TEMP_SEASONAL,
  wanted: IN_JOBS_WANTED,
};

export const IN_ALL_JOBS_LISTINGS: MockListing[] = [
  ...IN_JOBS_FULL_TIME,
  ...IN_JOBS_PART_TIME,
  ...IN_JOBS_FREELANCE,
  ...IN_JOBS_INTERNSHIP,
  ...IN_JOBS_TEMP_SEASONAL,
  ...IN_JOBS_WANTED,
];
