import type { MockListing } from "../../mock-listing-schema";
export { PROPERTY_RENT } from './to-rent';
export { PROPERTY_BUY } from './to-buy';
export { PROPERTY_ROOMS } from './room-rental';
export { PROPERTY_STUDENTS } from './for-students';
export { PROPERTY_COMMERCIAL } from './commercial';
export { PROPERTY_HOLIDAY } from './holiday-rental';
export { PROPERTY_LAND } from './land';
export { PROPERTY_WANTED } from './wanted';

import { PROPERTY_RENT } from './to-rent';
import { PROPERTY_BUY } from './to-buy';
import { PROPERTY_ROOMS } from './room-rental';
import { PROPERTY_STUDENTS } from './for-students';
import { PROPERTY_COMMERCIAL } from './commercial';
import { PROPERTY_HOLIDAY } from './holiday-rental';
import { PROPERTY_LAND } from './land';
import { PROPERTY_WANTED } from './wanted';

export const ALL_PROPERTY_LISTINGS: MockListing[] = [
  ...PROPERTY_RENT,
  ...PROPERTY_BUY,
  ...PROPERTY_ROOMS,
  ...PROPERTY_STUDENTS,
  ...PROPERTY_COMMERCIAL,
  ...PROPERTY_HOLIDAY,
  ...PROPERTY_LAND,
  ...PROPERTY_WANTED,
];

export const GB_ALL_PROPERTY_LISTINGS: MockListing[] = ALL_PROPERTY_LISTINGS;
export const GB_PROPERTY_SUBCATEGORY_MAP: Record<string, MockListing[]> = {
  to_rent: PROPERTY_RENT,
  to_buy: PROPERTY_BUY,
  room_rental: PROPERTY_ROOMS,
  for_students: PROPERTY_STUDENTS,
  commercial: PROPERTY_COMMERCIAL,
  holiday_rental: PROPERTY_HOLIDAY,
  land: PROPERTY_LAND,
  wanted: PROPERTY_WANTED,
};

