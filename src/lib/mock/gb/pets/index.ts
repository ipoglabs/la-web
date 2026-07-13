import type { MockListing } from "../../mock-listing-schema";
export { PETS_FOR_SALE } from './for-sale';
export { PETS_ADOPTION } from './adoption';
export { PETS_SERVICE } from './service';
export { PETS_ACCESSORIES } from './accessories';
export { PETS_LOST_FOUND } from './lost-found';
export { PETS_WANTED } from './wanted';

import { PETS_FOR_SALE } from './for-sale';
import { PETS_ADOPTION } from './adoption';
import { PETS_SERVICE } from './service';
import { PETS_ACCESSORIES } from './accessories';
import { PETS_LOST_FOUND } from './lost-found';
import { PETS_WANTED } from './wanted';

export const ALL_PETS_LISTINGS: MockListing[] = [
  ...PETS_FOR_SALE,
  ...PETS_ADOPTION,
  ...PETS_SERVICE,
  ...PETS_ACCESSORIES,
  ...PETS_LOST_FOUND,
  ...PETS_WANTED,
];

export const GB_ALL_PETS_LISTINGS: MockListing[] = ALL_PETS_LISTINGS;
export const GB_PETS_SUBCATEGORY_MAP: Record<string, MockListing[]> = {
  for_sale: PETS_FOR_SALE,
  adoption: PETS_ADOPTION,
  service: PETS_SERVICE,
  accessories: PETS_ACCESSORIES,
  lost_found: PETS_LOST_FOUND,
  wanted: PETS_WANTED,
};

