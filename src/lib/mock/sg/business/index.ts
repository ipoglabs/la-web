import type { MockListing } from "@/lib/mock/mock-listing-schema";
import {
  SG_BUSINESS_FOR_SALE,
  SG_BUSINESS_B2B,
  SG_BUSINESS_FREELANCE,
  SG_BUSINESS_PARTNERSHIP,
  SG_BUSINESS_EQUIPMENT,
  SG_BUSINESS_STARTUP,
} from "./business-data";

export {
  SG_BUSINESS_FOR_SALE,
  SG_BUSINESS_B2B,
  SG_BUSINESS_FREELANCE,
  SG_BUSINESS_PARTNERSHIP,
  SG_BUSINESS_EQUIPMENT,
  SG_BUSINESS_STARTUP,
};

export const SG_BUSINESS_SUBCATEGORY_MAP: Record<string, MockListing[]> = {
  biz_for_sale: SG_BUSINESS_FOR_SALE,
  b2b_service: SG_BUSINESS_B2B,
  freelance_contractors: SG_BUSINESS_FREELANCE,
  partnership: SG_BUSINESS_PARTNERSHIP,
  equipment_supplies: SG_BUSINESS_EQUIPMENT,
  startup_support: SG_BUSINESS_STARTUP,
};

export const SG_ALL_BUSINESS_LISTINGS: MockListing[] = [
  ...SG_BUSINESS_FOR_SALE,
  ...SG_BUSINESS_B2B,
  ...SG_BUSINESS_FREELANCE,
  ...SG_BUSINESS_PARTNERSHIP,
  ...SG_BUSINESS_EQUIPMENT,
  ...SG_BUSINESS_STARTUP,
];
