import type { MockListing } from "@/lib/mock/mock-listing-schema";
import {
  IN_FOOD_HOME_COOKED,
  IN_FOOD_CATERING,
  IN_FOOD_TIFFIN_SERVICES,
  IN_FOOD_RESTAURANT_DEALS,
  IN_FOOD_CLOUD_KITCHENS,
  IN_FOOD_BAKED_GOODS,
} from "./food_dining-data";

export {
  IN_FOOD_HOME_COOKED,
  IN_FOOD_CATERING,
  IN_FOOD_TIFFIN_SERVICES,
  IN_FOOD_RESTAURANT_DEALS,
  IN_FOOD_CLOUD_KITCHENS,
  IN_FOOD_BAKED_GOODS,
};

export const IN_FOOD_DINING_SUBCATEGORY_MAP: Record<string, MockListing[]> = {
  home_cooked: IN_FOOD_HOME_COOKED,
  catering: IN_FOOD_CATERING,
  tiffin_services: IN_FOOD_TIFFIN_SERVICES,
  restaurant_deals: IN_FOOD_RESTAURANT_DEALS,
  cloud_kitchens: IN_FOOD_CLOUD_KITCHENS,
  baked_goods: IN_FOOD_BAKED_GOODS,
};

export const IN_ALL_FOOD_DINING_LISTINGS: MockListing[] = [
  ...IN_FOOD_HOME_COOKED,
  ...IN_FOOD_CATERING,
  ...IN_FOOD_TIFFIN_SERVICES,
  ...IN_FOOD_RESTAURANT_DEALS,
  ...IN_FOOD_CLOUD_KITCHENS,
  ...IN_FOOD_BAKED_GOODS,
];
