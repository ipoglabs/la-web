import type { MockListing } from "../../mock-listing-schema";
export { SPECIAL_OFFERS_BANKING } from './banking-finance';
export { SPECIAL_OFFERS_TRAVEL } from './travel-tourism';
export { SPECIAL_OFFERS_RETAIL } from './retail-shopping';
export { SPECIAL_OFFERS_FOOD } from './food-dining';
export { SPECIAL_OFFERS_ELECTRONICS } from './electronics-gadgets';
export { SPECIAL_OFFERS_HEALTH } from './health-wellness';
export { SPECIAL_OFFERS_EDUCATION } from './education-learning';
export { SPECIAL_OFFERS_SEASONAL } from './holiday-seasonal';

import { SPECIAL_OFFERS_BANKING } from './banking-finance';
import { SPECIAL_OFFERS_TRAVEL } from './travel-tourism';
import { SPECIAL_OFFERS_RETAIL } from './retail-shopping';
import { SPECIAL_OFFERS_FOOD } from './food-dining';
import { SPECIAL_OFFERS_ELECTRONICS } from './electronics-gadgets';
import { SPECIAL_OFFERS_HEALTH } from './health-wellness';
import { SPECIAL_OFFERS_EDUCATION } from './education-learning';
import { SPECIAL_OFFERS_SEASONAL } from './holiday-seasonal';

export const ALL_SPECIAL_OFFERS_LISTINGS: MockListing[] = [
  ...SPECIAL_OFFERS_BANKING,
  ...SPECIAL_OFFERS_TRAVEL,
  ...SPECIAL_OFFERS_RETAIL,
  ...SPECIAL_OFFERS_FOOD,
  ...SPECIAL_OFFERS_ELECTRONICS,
  ...SPECIAL_OFFERS_HEALTH,
  ...SPECIAL_OFFERS_EDUCATION,
  ...SPECIAL_OFFERS_SEASONAL,
];

export const GB_ALL_SPECIAL_OFFERS_LISTINGS: MockListing[] = ALL_SPECIAL_OFFERS_LISTINGS;
export const GB_SPECIAL_OFFERS_SUBCATEGORY_MAP: Record<string, MockListing[]> = {
  banking_finance: SPECIAL_OFFERS_BANKING,
  travel_tourism: SPECIAL_OFFERS_TRAVEL,
  retail_shopping: SPECIAL_OFFERS_RETAIL,
  food_dining: SPECIAL_OFFERS_FOOD,
  electronics_gadgets: SPECIAL_OFFERS_ELECTRONICS,
  health_wellness: SPECIAL_OFFERS_HEALTH,
  education_learning: SPECIAL_OFFERS_EDUCATION,
  holiday_seasonal: SPECIAL_OFFERS_SEASONAL,
};

