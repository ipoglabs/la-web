import type { MockListing } from "../../mock-listing-schema";
export { VEHICLES_CARS } from './cars';
export { VEHICLES_MOTORCYCLE } from './motorcycle';
export { VEHICLES_VAN } from './van';
export { VEHICLES_TRUCK } from './truck';
export { VEHICLES_BOATS } from './boats';
export { VEHICLES_PARTS } from './parts-accessories';
export { VEHICLES_WANTED } from './wanted';

import { VEHICLES_CARS } from './cars';
import { VEHICLES_MOTORCYCLE } from './motorcycle';
import { VEHICLES_VAN } from './van';
import { VEHICLES_TRUCK } from './truck';
import { VEHICLES_BOATS } from './boats';
import { VEHICLES_PARTS } from './parts-accessories';
import { VEHICLES_WANTED } from './wanted';

export const ALL_VEHICLES_LISTINGS: MockListing[] = [
  ...VEHICLES_CARS,
  ...VEHICLES_MOTORCYCLE,
  ...VEHICLES_VAN,
  ...VEHICLES_TRUCK,
  ...VEHICLES_BOATS,
  ...VEHICLES_PARTS,
  ...VEHICLES_WANTED,
];

export const GB_ALL_VEHICLES_LISTINGS: MockListing[] = ALL_VEHICLES_LISTINGS;
export const GB_VEHICLES_SUBCATEGORY_MAP: Record<string, MockListing[]> = {
  cars: VEHICLES_CARS,
  motorcycle: VEHICLES_MOTORCYCLE,
  van: VEHICLES_VAN,
  truck: VEHICLES_TRUCK,
  boats: VEHICLES_BOATS,
  parts_accessories: VEHICLES_PARTS,
  wanted: VEHICLES_WANTED,
};

