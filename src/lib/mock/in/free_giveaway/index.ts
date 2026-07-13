import type { MockListing } from "@/lib/mock/mock-listing-schema";
import {
  IN_FREE_FURNITURE_FREE,
  IN_FREE_CLOTHING_FREE,
  IN_FREE_ELECTRONICS_FREE,
  IN_FREE_FOOD_FREE,
  IN_FREE_KIDS_ITEMS,
  IN_FREE_GENERAL_FREE,
} from "./free_giveaway-data";

export {
  IN_FREE_FURNITURE_FREE,
  IN_FREE_CLOTHING_FREE,
  IN_FREE_ELECTRONICS_FREE,
  IN_FREE_FOOD_FREE,
  IN_FREE_KIDS_ITEMS,
  IN_FREE_GENERAL_FREE,
};

export const IN_FREE_GIVEAWAY_SUBCATEGORY_MAP: Record<string, MockListing[]> = {
  furniture_free: IN_FREE_FURNITURE_FREE,
  clothing_free: IN_FREE_CLOTHING_FREE,
  electronics_free: IN_FREE_ELECTRONICS_FREE,
  food_free: IN_FREE_FOOD_FREE,
  kids_items: IN_FREE_KIDS_ITEMS,
  general_free: IN_FREE_GENERAL_FREE,
};

export const IN_ALL_FREE_GIVEAWAY_LISTINGS: MockListing[] = [
  ...IN_FREE_FURNITURE_FREE,
  ...IN_FREE_CLOTHING_FREE,
  ...IN_FREE_ELECTRONICS_FREE,
  ...IN_FREE_FOOD_FREE,
  ...IN_FREE_KIDS_ITEMS,
  ...IN_FREE_GENERAL_FREE,
];
