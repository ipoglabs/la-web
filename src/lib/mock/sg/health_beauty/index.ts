import type { MockListing } from "@/lib/mock/mock-listing-schema";
import {
  SG_HEALTH_GYMS_FITNESS,
  SG_HEALTH_SALONS_SPAS,
  SG_HEALTH_MEDICAL,
  SG_HEALTH_BEAUTY_PRODUCTS,
  SG_HEALTH_WELLNESS,
} from "./health_beauty-data";

export {
  SG_HEALTH_GYMS_FITNESS,
  SG_HEALTH_SALONS_SPAS,
  SG_HEALTH_MEDICAL,
  SG_HEALTH_BEAUTY_PRODUCTS,
  SG_HEALTH_WELLNESS,
};

export const SG_HEALTH_BEAUTY_SUBCATEGORY_MAP: Record<string, MockListing[]> = {
  gyms_fitness: SG_HEALTH_GYMS_FITNESS,
  salons_spas: SG_HEALTH_SALONS_SPAS,
  medical: SG_HEALTH_MEDICAL,
  beauty_products: SG_HEALTH_BEAUTY_PRODUCTS,
  wellness: SG_HEALTH_WELLNESS,
};

export const SG_ALL_HEALTH_BEAUTY_LISTINGS: MockListing[] = [
  ...SG_HEALTH_GYMS_FITNESS,
  ...SG_HEALTH_SALONS_SPAS,
  ...SG_HEALTH_MEDICAL,
  ...SG_HEALTH_BEAUTY_PRODUCTS,
  ...SG_HEALTH_WELLNESS,
];
