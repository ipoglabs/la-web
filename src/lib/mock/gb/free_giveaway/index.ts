import type { MockListing } from "../../mock-listing-schema";
export { FREE_FURNITURE }   from './furniture-free';
export { FREE_CLOTHING }    from './clothing-free';
export { FREE_ELECTRONICS } from './electronics-free';
export { FREE_FOOD }        from './food-free';
export { FREE_KIDS }        from './kids-items';
export { FREE_GENERAL }     from './general-free';

import { FREE_FURNITURE }   from './furniture-free';
import { FREE_CLOTHING }    from './clothing-free';
import { FREE_ELECTRONICS } from './electronics-free';
import { FREE_FOOD }        from './food-free';
import { FREE_KIDS }        from './kids-items';
import { FREE_GENERAL }     from './general-free';

export const ALL_FREE_GIVEAWAY_LISTINGS: MockListing[] = [
  ...FREE_FURNITURE,
  ...FREE_CLOTHING,
  ...FREE_ELECTRONICS,
  ...FREE_FOOD,
  ...FREE_KIDS,
  ...FREE_GENERAL,
];

export const GB_ALL_FREE_GIVEAWAY_LISTINGS: MockListing[] = ALL_FREE_GIVEAWAY_LISTINGS;
export const GB_FREE_GIVEAWAY_SUBCATEGORY_MAP: Record<string, MockListing[]> = {
  furniture_free: FREE_FURNITURE,
  clothing_free: FREE_CLOTHING,
  electronics_free: FREE_ELECTRONICS,
  food_free: FREE_FOOD,
  kids_items: FREE_KIDS,
  general_free: FREE_GENERAL,
};
