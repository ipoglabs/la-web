import type { MockListing } from "../../mock-listing-schema";
export { TRAVEL_HOLIDAY_RENTALS } from './holiday-rentals';
export { TRAVEL_HOTELS } from './hotels-guesthouses';
export { TRAVEL_TOURS } from './tour-packages';
export { TRAVEL_STAYCATIONS } from './staycations';
export { TRAVEL_SERVICES } from './travel-services';
export { TRAVEL_ACCESSORIES } from './travel-accessories';

import { TRAVEL_HOLIDAY_RENTALS } from './holiday-rentals';
import { TRAVEL_HOTELS } from './hotels-guesthouses';
import { TRAVEL_TOURS } from './tour-packages';
import { TRAVEL_STAYCATIONS } from './staycations';
import { TRAVEL_SERVICES } from './travel-services';
import { TRAVEL_ACCESSORIES } from './travel-accessories';

export const ALL_TRAVEL_STAYS_LISTINGS: MockListing[] = [
  ...TRAVEL_HOLIDAY_RENTALS,
  ...TRAVEL_HOTELS,
  ...TRAVEL_TOURS,
  ...TRAVEL_STAYCATIONS,
  ...TRAVEL_SERVICES,
  ...TRAVEL_ACCESSORIES,
];

export const GB_ALL_TRAVEL_STAYS_LISTINGS: MockListing[] = ALL_TRAVEL_STAYS_LISTINGS;
export const GB_TRAVEL_STAYS_SUBCATEGORY_MAP: Record<string, MockListing[]> = {
  holiday_rentals: TRAVEL_HOLIDAY_RENTALS,
  hotels_guesthouses: TRAVEL_HOTELS,
  tour_packages: TRAVEL_TOURS,
  staycations: TRAVEL_STAYCATIONS,
  travel_services: TRAVEL_SERVICES,
  travel_accessories: TRAVEL_ACCESSORIES,
};

