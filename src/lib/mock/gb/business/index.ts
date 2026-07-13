import type { MockListing } from "../../mock-listing-schema";
export { BUSINESS_FOR_SALE } from './biz-for-sale';
export { BUSINESS_B2B } from './b2b-service';
export { BUSINESS_FREELANCE } from './freelance-contractors';
export { BUSINESS_PARTNERSHIP } from './partnership';
export { BUSINESS_EQUIPMENT } from './equipment-supplies';
export { BUSINESS_STARTUP } from './startup-support';

import { BUSINESS_FOR_SALE } from './biz-for-sale';
import { BUSINESS_B2B } from './b2b-service';
import { BUSINESS_FREELANCE } from './freelance-contractors';
import { BUSINESS_PARTNERSHIP } from './partnership';
import { BUSINESS_EQUIPMENT } from './equipment-supplies';
import { BUSINESS_STARTUP } from './startup-support';

export const ALL_BUSINESS_LISTINGS: MockListing[] = [
  ...BUSINESS_FOR_SALE,
  ...BUSINESS_B2B,
  ...BUSINESS_FREELANCE,
  ...BUSINESS_PARTNERSHIP,
  ...BUSINESS_EQUIPMENT,
  ...BUSINESS_STARTUP,
];

export const GB_ALL_BUSINESS_LISTINGS: MockListing[] = ALL_BUSINESS_LISTINGS;
export const GB_BUSINESS_SUBCATEGORY_MAP: Record<string, MockListing[]> = {
  biz_for_sale: BUSINESS_FOR_SALE,
  b2b_service: BUSINESS_B2B,
  freelance_contractors: BUSINESS_FREELANCE,
  partnership: BUSINESS_PARTNERSHIP,
  equipment_supplies: BUSINESS_EQUIPMENT,
  startup_support: BUSINESS_STARTUP,
};

