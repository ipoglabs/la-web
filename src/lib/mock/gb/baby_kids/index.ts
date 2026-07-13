import type { MockListing } from "../../mock-listing-schema";
export { BABY_TOYS } from './toys-games';
export { BABY_GEAR } from './baby-gear';
export { BABY_CLOTHING } from './kids-clothing';
export { BABY_CHILDCARE } from './childcare';
export { BABY_SCHOOL_SUPPLIES } from './school-supplies';
export { BABY_ACTIVITIES } from './kids-activities';

import { BABY_TOYS } from './toys-games';
import { BABY_GEAR } from './baby-gear';
import { BABY_CLOTHING } from './kids-clothing';
import { BABY_CHILDCARE } from './childcare';
import { BABY_SCHOOL_SUPPLIES } from './school-supplies';
import { BABY_ACTIVITIES } from './kids-activities';

export const ALL_BABY_KIDS_LISTINGS: MockListing[] = [
  ...BABY_TOYS,
  ...BABY_GEAR,
  ...BABY_CLOTHING,
  ...BABY_CHILDCARE,
  ...BABY_SCHOOL_SUPPLIES,
  ...BABY_ACTIVITIES,
];

export const GB_ALL_BABY_KIDS_LISTINGS: MockListing[] = ALL_BABY_KIDS_LISTINGS;
export const GB_BABY_KIDS_SUBCATEGORY_MAP: Record<string, MockListing[]> = {
  toys_games: BABY_TOYS,
  baby_gear: BABY_GEAR,
  kids_clothing: BABY_CLOTHING,
  childcare: BABY_CHILDCARE,
  school_supplies: BABY_SCHOOL_SUPPLIES,
  kids_activities: BABY_ACTIVITIES,
};

