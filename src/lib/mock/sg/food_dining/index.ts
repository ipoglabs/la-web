import type { MockListing } from "@/lib/mock/mock-listing-schema";
import {
  SG_FOOD_HOME_COOKED,
  SG_FOOD_CATERING,
  SG_FOOD_TIFFIN_SERVICES,
  SG_FOOD_RESTAURANT_DEALS,
  SG_FOOD_CLOUD_KITCHENS,
  SG_FOOD_BAKED_GOODS,
} from "./food_dining-data";

export {
  SG_FOOD_HOME_COOKED,
  SG_FOOD_CATERING,
  SG_FOOD_TIFFIN_SERVICES,
  SG_FOOD_RESTAURANT_DEALS,
  SG_FOOD_CLOUD_KITCHENS,
  SG_FOOD_BAKED_GOODS,
};

export const SG_FOOD_DINING_SUBCATEGORY_MAP: Record<string, MockListing[]> = {
  home_cooked: SG_FOOD_HOME_COOKED,
  catering: SG_FOOD_CATERING,
  tiffin_services: SG_FOOD_TIFFIN_SERVICES,
  restaurant_deals: SG_FOOD_RESTAURANT_DEALS,
  cloud_kitchens: SG_FOOD_CLOUD_KITCHENS,
  baked_goods: SG_FOOD_BAKED_GOODS,
};

export const SG_ALL_FOOD_DINING_LISTINGS: MockListing[] = [
  ...SG_FOOD_HOME_COOKED,
  ...SG_FOOD_CATERING,
  ...SG_FOOD_TIFFIN_SERVICES,
  ...SG_FOOD_RESTAURANT_DEALS,
  ...SG_FOOD_CLOUD_KITCHENS,
  ...SG_FOOD_BAKED_GOODS,
];
