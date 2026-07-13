import type { MockListing } from "@/lib/mock/mock-listing-schema";
import { SG_PROPERTY_RENT }      from "./to-rent";
import { SG_PROPERTY_BUY }       from "./to-buy";
import { SG_PROPERTY_ROOMS }     from "./room-rental";
import { SG_PROPERTY_STUDENTS }  from "./for-students";
import { SG_PROPERTY_COMMERCIAL } from "./commercial";
import { SG_PROPERTY_HOLIDAY }   from "./holiday-rental";
import { SG_PROPERTY_LAND }      from "./land";
import { SG_PROPERTY_WANTED }    from "./wanted";

export {
  SG_PROPERTY_RENT,
  SG_PROPERTY_BUY,
  SG_PROPERTY_ROOMS,
  SG_PROPERTY_STUDENTS,
  SG_PROPERTY_COMMERCIAL,
  SG_PROPERTY_HOLIDAY,
  SG_PROPERTY_LAND,
  SG_PROPERTY_WANTED,
};

export const SG_PROPERTY_SUBCATEGORY_MAP = {
  to_rent:        SG_PROPERTY_RENT,
  to_buy:         SG_PROPERTY_BUY,
  room_rental:    SG_PROPERTY_ROOMS,
  for_students:   SG_PROPERTY_STUDENTS,
  commercial:     SG_PROPERTY_COMMERCIAL,
  holiday_rental: SG_PROPERTY_HOLIDAY,
  land:           SG_PROPERTY_LAND,
  wanted:         SG_PROPERTY_WANTED,
} as const;

export const SG_ALL_PROPERTY_LISTINGS: MockListing[] = [
  ...SG_PROPERTY_RENT,
  ...SG_PROPERTY_BUY,
  ...SG_PROPERTY_ROOMS,
  ...SG_PROPERTY_STUDENTS,
  ...SG_PROPERTY_COMMERCIAL,
  ...SG_PROPERTY_HOLIDAY,
  ...SG_PROPERTY_LAND,
  ...SG_PROPERTY_WANTED,
];
