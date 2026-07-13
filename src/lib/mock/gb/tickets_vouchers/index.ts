import type { MockListing } from "../../mock-listing-schema";
export { TICKETS_EVENTS }      from './event-tickets';
export { TICKETS_SPORT }       from './sport-tickets';
export { TICKETS_GIFTCARDS }   from './gift-cards';
export { TICKETS_EXPERIENCES } from './experience-days';
export { TICKETS_TRAVEL }      from './travel-vouchers';

import { TICKETS_EVENTS }      from './event-tickets';
import { TICKETS_SPORT }       from './sport-tickets';
import { TICKETS_GIFTCARDS }   from './gift-cards';
import { TICKETS_EXPERIENCES } from './experience-days';
import { TICKETS_TRAVEL }      from './travel-vouchers';

export const ALL_TICKETS_VOUCHERS_LISTINGS: MockListing[] = [
  ...TICKETS_EVENTS,
  ...TICKETS_SPORT,
  ...TICKETS_GIFTCARDS,
  ...TICKETS_EXPERIENCES,
  ...TICKETS_TRAVEL,
];

export const GB_ALL_TICKETS_VOUCHERS_LISTINGS: MockListing[] = ALL_TICKETS_VOUCHERS_LISTINGS;
export const GB_TICKETS_VOUCHERS_SUBCATEGORY_MAP: Record<string, MockListing[]> = {
  event_tickets: TICKETS_EVENTS,
  sport_tickets: TICKETS_SPORT,
  gift_cards: TICKETS_GIFTCARDS,
  experience_days: TICKETS_EXPERIENCES,
  travel_vouchers: TICKETS_TRAVEL,
};
