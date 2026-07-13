import type { MockListing } from "@/lib/mock/mock-listing-schema";
import {
  SG_FREE_FURNITURE_FREE,
  SG_FREE_CLOTHING_FREE,
  SG_FREE_ELECTRONICS_FREE,
  SG_FREE_FOOD_FREE,
  SG_FREE_KIDS_ITEMS,
  SG_FREE_GENERAL_FREE,
} from "./free_giveaway-data";

export {
  SG_FREE_FURNITURE_FREE,
  SG_FREE_CLOTHING_FREE,
  SG_FREE_ELECTRONICS_FREE,
  SG_FREE_FOOD_FREE,
  SG_FREE_KIDS_ITEMS,
  SG_FREE_GENERAL_FREE,
};

export const SG_FREE_GIVEAWAY_SUBCATEGORY_MAP: Record<string, MockListing[]> = {
  furniture_free: SG_FREE_FURNITURE_FREE,
  clothing_free: SG_FREE_CLOTHING_FREE,
  electronics_free: SG_FREE_ELECTRONICS_FREE,
  food_free: SG_FREE_FOOD_FREE,
  kids_items: SG_FREE_KIDS_ITEMS,
  general_free: SG_FREE_GENERAL_FREE,
};

export const SG_ALL_FREE_GIVEAWAY_LISTINGS: MockListing[] = [
  ...SG_FREE_FURNITURE_FREE,
  ...SG_FREE_CLOTHING_FREE,
  ...SG_FREE_ELECTRONICS_FREE,
  ...SG_FREE_FOOD_FREE,
  ...SG_FREE_KIDS_ITEMS,
  ...SG_FREE_GENERAL_FREE,
];
