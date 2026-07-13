import type { MockListing } from "@/lib/mock/mock-listing-schema";
import {
  IN_BUSINESS_FOR_SALE,
  IN_BUSINESS_B2B,
  IN_BUSINESS_FREELANCE,
  IN_BUSINESS_PARTNERSHIP,
  IN_BUSINESS_EQUIPMENT,
  IN_BUSINESS_STARTUP,
} from "./business-data";

export {
  IN_BUSINESS_FOR_SALE,
  IN_BUSINESS_B2B,
  IN_BUSINESS_FREELANCE,
  IN_BUSINESS_PARTNERSHIP,
  IN_BUSINESS_EQUIPMENT,
  IN_BUSINESS_STARTUP,
};

export const IN_BUSINESS_SUBCATEGORY_MAP: Record<string, MockListing[]> = {
  biz_for_sale: IN_BUSINESS_FOR_SALE,
  b2b_service: IN_BUSINESS_B2B,
  freelance_contractors: IN_BUSINESS_FREELANCE,
  partnership: IN_BUSINESS_PARTNERSHIP,
  equipment_supplies: IN_BUSINESS_EQUIPMENT,
  startup_support: IN_BUSINESS_STARTUP,
};

export const IN_ALL_BUSINESS_LISTINGS: MockListing[] = [
  ...IN_BUSINESS_FOR_SALE,
  ...IN_BUSINESS_B2B,
  ...IN_BUSINESS_FREELANCE,
  ...IN_BUSINESS_PARTNERSHIP,
  ...IN_BUSINESS_EQUIPMENT,
  ...IN_BUSINESS_STARTUP,
];
