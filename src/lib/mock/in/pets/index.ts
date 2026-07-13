import type { MockListing } from "@/lib/mock/mock-listing-schema";
import {
  IN_PETS_FOR_SALE,
  IN_PETS_ADOPTION,
  IN_PETS_SERVICE,
  IN_PETS_ACCESSORIES,
  IN_PETS_LOST_FOUND,
  IN_PETS_WANTED,
} from "./pets-data";

export {
  IN_PETS_FOR_SALE,
  IN_PETS_ADOPTION,
  IN_PETS_SERVICE,
  IN_PETS_ACCESSORIES,
  IN_PETS_LOST_FOUND,
  IN_PETS_WANTED,
};

export const IN_PETS_SUBCATEGORY_MAP: Record<string, MockListing[]> = {
  for_sale: IN_PETS_FOR_SALE,
  adoption: IN_PETS_ADOPTION,
  service: IN_PETS_SERVICE,
  accessories: IN_PETS_ACCESSORIES,
  lost_found: IN_PETS_LOST_FOUND,
  wanted: IN_PETS_WANTED,
};

export const IN_ALL_PETS_LISTINGS: MockListing[] = [
  ...IN_PETS_FOR_SALE,
  ...IN_PETS_ADOPTION,
  ...IN_PETS_SERVICE,
  ...IN_PETS_ACCESSORIES,
  ...IN_PETS_LOST_FOUND,
  ...IN_PETS_WANTED,
];
