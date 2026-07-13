import type { MockListing } from "@/lib/mock/mock-listing-schema";
import {
  SG_PETS_FOR_SALE,
  SG_PETS_ADOPTION,
  SG_PETS_SERVICE,
  SG_PETS_ACCESSORIES,
  SG_PETS_LOST_FOUND,
  SG_PETS_WANTED,
} from "./pets-data";

export {
  SG_PETS_FOR_SALE,
  SG_PETS_ADOPTION,
  SG_PETS_SERVICE,
  SG_PETS_ACCESSORIES,
  SG_PETS_LOST_FOUND,
  SG_PETS_WANTED,
};

export const SG_PETS_SUBCATEGORY_MAP: Record<string, MockListing[]> = {
  for_sale: SG_PETS_FOR_SALE,
  adoption: SG_PETS_ADOPTION,
  service: SG_PETS_SERVICE,
  accessories: SG_PETS_ACCESSORIES,
  lost_found: SG_PETS_LOST_FOUND,
  wanted: SG_PETS_WANTED,
};

export const SG_ALL_PETS_LISTINGS: MockListing[] = [
  ...SG_PETS_FOR_SALE,
  ...SG_PETS_ADOPTION,
  ...SG_PETS_SERVICE,
  ...SG_PETS_ACCESSORIES,
  ...SG_PETS_LOST_FOUND,
  ...SG_PETS_WANTED,
];
