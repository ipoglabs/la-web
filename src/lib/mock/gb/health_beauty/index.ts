import type { MockListing } from "../../mock-listing-schema";
export { HEALTH_GYMS } from './gyms-fitness';
export { HEALTH_SALONS } from './salons-spas';
export { HEALTH_MEDICAL } from './medical';
export { HEALTH_BEAUTY_PRODUCTS } from './beauty-products';
export { HEALTH_WELLNESS } from './wellness';

import { HEALTH_GYMS } from './gyms-fitness';
import { HEALTH_SALONS } from './salons-spas';
import { HEALTH_MEDICAL } from './medical';
import { HEALTH_BEAUTY_PRODUCTS } from './beauty-products';
import { HEALTH_WELLNESS } from './wellness';

export const ALL_HEALTH_BEAUTY_LISTINGS: MockListing[] = [
  ...HEALTH_GYMS,
  ...HEALTH_SALONS,
  ...HEALTH_MEDICAL,
  ...HEALTH_BEAUTY_PRODUCTS,
  ...HEALTH_WELLNESS,
];

export const GB_ALL_HEALTH_BEAUTY_LISTINGS: MockListing[] = ALL_HEALTH_BEAUTY_LISTINGS;
export const GB_HEALTH_BEAUTY_SUBCATEGORY_MAP: Record<string, MockListing[]> = {
  gyms_fitness: HEALTH_GYMS,
  salons_spas: HEALTH_SALONS,
  medical: HEALTH_MEDICAL,
  beauty_products: HEALTH_BEAUTY_PRODUCTS,
  wellness: HEALTH_WELLNESS,
};

