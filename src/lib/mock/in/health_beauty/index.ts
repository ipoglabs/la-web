import type { MockListing } from "@/lib/mock/mock-listing-schema";
import {
  IN_HEALTH_GYMS_FITNESS,
  IN_HEALTH_SALONS_SPAS,
  IN_HEALTH_MEDICAL,
  IN_HEALTH_BEAUTY_PRODUCTS,
  IN_HEALTH_WELLNESS,
} from "./health_beauty-data";

export {
  IN_HEALTH_GYMS_FITNESS,
  IN_HEALTH_SALONS_SPAS,
  IN_HEALTH_MEDICAL,
  IN_HEALTH_BEAUTY_PRODUCTS,
  IN_HEALTH_WELLNESS,
};

export const IN_HEALTH_BEAUTY_SUBCATEGORY_MAP: Record<string, MockListing[]> = {
  gyms_fitness: IN_HEALTH_GYMS_FITNESS,
  salons_spas: IN_HEALTH_SALONS_SPAS,
  medical: IN_HEALTH_MEDICAL,
  beauty_products: IN_HEALTH_BEAUTY_PRODUCTS,
  wellness: IN_HEALTH_WELLNESS,
};

export const IN_ALL_HEALTH_BEAUTY_LISTINGS: MockListing[] = [
  ...IN_HEALTH_GYMS_FITNESS,
  ...IN_HEALTH_SALONS_SPAS,
  ...IN_HEALTH_MEDICAL,
  ...IN_HEALTH_BEAUTY_PRODUCTS,
  ...IN_HEALTH_WELLNESS,
];
