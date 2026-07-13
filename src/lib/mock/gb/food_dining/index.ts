import type { MockListing } from "../../mock-listing-schema";
export { FOOD_HOME_COOKED } from './home-cooked';
export { FOOD_CATERING } from './catering';
export { FOOD_TIFFIN } from './tiffin-services';
export { FOOD_RESTAURANT_DEALS } from './restaurant-deals';
export { FOOD_CLOUD_KITCHENS } from './cloud-kitchens';
export { FOOD_BAKED } from './baked-goods';

import { FOOD_HOME_COOKED } from './home-cooked';
import { FOOD_CATERING } from './catering';
import { FOOD_TIFFIN } from './tiffin-services';
import { FOOD_RESTAURANT_DEALS } from './restaurant-deals';
import { FOOD_CLOUD_KITCHENS } from './cloud-kitchens';
import { FOOD_BAKED } from './baked-goods';

export const ALL_FOOD_DINING_LISTINGS: MockListing[] = [
  ...FOOD_HOME_COOKED,
  ...FOOD_CATERING,
  ...FOOD_TIFFIN,
  ...FOOD_RESTAURANT_DEALS,
  ...FOOD_CLOUD_KITCHENS,
  ...FOOD_BAKED,
];

export const GB_ALL_FOOD_DINING_LISTINGS: MockListing[] = ALL_FOOD_DINING_LISTINGS;
export const GB_FOOD_DINING_SUBCATEGORY_MAP: Record<string, MockListing[]> = {
  home_cooked: FOOD_HOME_COOKED,
  catering: FOOD_CATERING,
  tiffin_services: FOOD_TIFFIN,
  restaurant_deals: FOOD_RESTAURANT_DEALS,
  cloud_kitchens: FOOD_CLOUD_KITCHENS,
  baked_goods: FOOD_BAKED,
};

