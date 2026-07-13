import type { MockListing } from "@/lib/mock/mock-listing-schema";
import { IN_PROPERTY_RENT }      from "./to-rent";
import { IN_PROPERTY_BUY }       from "./to-buy";
import { IN_PROPERTY_ROOMS }     from "./room-rental";
import { IN_PROPERTY_STUDENTS }  from "./for-students";
import { IN_PROPERTY_COMMERCIAL } from "./commercial";
import { IN_PROPERTY_HOLIDAY }   from "./holiday-rental";
import { IN_PROPERTY_LAND }      from "./land";
import { IN_PROPERTY_WANTED }    from "./wanted";

export {
  IN_PROPERTY_RENT,
  IN_PROPERTY_BUY,
  IN_PROPERTY_ROOMS,
  IN_PROPERTY_STUDENTS,
  IN_PROPERTY_COMMERCIAL,
  IN_PROPERTY_HOLIDAY,
  IN_PROPERTY_LAND,
  IN_PROPERTY_WANTED,
};

export const IN_PROPERTY_SUBCATEGORY_MAP = {
  to_rent:        IN_PROPERTY_RENT,
  to_buy:         IN_PROPERTY_BUY,
  room_rental:    IN_PROPERTY_ROOMS,
  for_students:   IN_PROPERTY_STUDENTS,
  commercial:     IN_PROPERTY_COMMERCIAL,
  holiday_rental: IN_PROPERTY_HOLIDAY,
  land:           IN_PROPERTY_LAND,
  wanted:         IN_PROPERTY_WANTED,
} as const;

export const IN_ALL_PROPERTY_LISTINGS: MockListing[] = [
  ...IN_PROPERTY_RENT,
  ...IN_PROPERTY_BUY,
  ...IN_PROPERTY_ROOMS,
  ...IN_PROPERTY_STUDENTS,
  ...IN_PROPERTY_COMMERCIAL,
  ...IN_PROPERTY_HOLIDAY,
  ...IN_PROPERTY_LAND,
  ...IN_PROPERTY_WANTED,
];
