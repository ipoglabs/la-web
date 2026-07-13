import type { MockListing } from "@/lib/mock/mock-listing-schema";
import {
  IN_KIDS_TOYS_GAMES,
  IN_KIDS_BABY_GEAR,
  IN_KIDS_CLOTHING,
  IN_KIDS_CHILDCARE,
  IN_KIDS_SCHOOL_SUPPLIES,
  IN_KIDS_ACTIVITIES,
} from "./baby_kids-data";

export {
  IN_KIDS_TOYS_GAMES,
  IN_KIDS_BABY_GEAR,
  IN_KIDS_CLOTHING,
  IN_KIDS_CHILDCARE,
  IN_KIDS_SCHOOL_SUPPLIES,
  IN_KIDS_ACTIVITIES,
};

export const IN_BABY_KIDS_SUBCATEGORY_MAP: Record<string, MockListing[]> = {
  toys_games: IN_KIDS_TOYS_GAMES,
  baby_gear: IN_KIDS_BABY_GEAR,
  kids_clothing: IN_KIDS_CLOTHING,
  childcare: IN_KIDS_CHILDCARE,
  school_supplies: IN_KIDS_SCHOOL_SUPPLIES,
  kids_activities: IN_KIDS_ACTIVITIES,
};

export const IN_ALL_BABY_KIDS_LISTINGS: MockListing[] = [
  ...IN_KIDS_TOYS_GAMES,
  ...IN_KIDS_BABY_GEAR,
  ...IN_KIDS_CLOTHING,
  ...IN_KIDS_CHILDCARE,
  ...IN_KIDS_SCHOOL_SUPPLIES,
  ...IN_KIDS_ACTIVITIES,
];
