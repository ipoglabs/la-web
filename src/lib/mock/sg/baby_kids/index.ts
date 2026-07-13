import type { MockListing } from "@/lib/mock/mock-listing-schema";
import {
  SG_KIDS_TOYS_GAMES,
  SG_KIDS_BABY_GEAR,
  SG_KIDS_CLOTHING,
  SG_KIDS_CHILDCARE,
  SG_KIDS_SCHOOL_SUPPLIES,
  SG_KIDS_ACTIVITIES,
} from "./baby_kids-data";

export {
  SG_KIDS_TOYS_GAMES,
  SG_KIDS_BABY_GEAR,
  SG_KIDS_CLOTHING,
  SG_KIDS_CHILDCARE,
  SG_KIDS_SCHOOL_SUPPLIES,
  SG_KIDS_ACTIVITIES,
};

export const SG_BABY_KIDS_SUBCATEGORY_MAP: Record<string, MockListing[]> = {
  toys_games: SG_KIDS_TOYS_GAMES,
  baby_gear: SG_KIDS_BABY_GEAR,
  kids_clothing: SG_KIDS_CLOTHING,
  childcare: SG_KIDS_CHILDCARE,
  school_supplies: SG_KIDS_SCHOOL_SUPPLIES,
  kids_activities: SG_KIDS_ACTIVITIES,
};

export const SG_ALL_BABY_KIDS_LISTINGS: MockListing[] = [
  ...SG_KIDS_TOYS_GAMES,
  ...SG_KIDS_BABY_GEAR,
  ...SG_KIDS_CLOTHING,
  ...SG_KIDS_CHILDCARE,
  ...SG_KIDS_SCHOOL_SUPPLIES,
  ...SG_KIDS_ACTIVITIES,
];
