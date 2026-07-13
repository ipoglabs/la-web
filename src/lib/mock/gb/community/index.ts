import type { MockListing } from "../../mock-listing-schema";
export { COMMUNITY_LOST_FOUND } from './lost-found';
export { COMMUNITY_EVENTS } from './events';
export { COMMUNITY_VOLUNTEERING } from './volunteering';
export { COMMUNITY_ANNOUNCEMENT } from './announcement';
export { COMMUNITY_CHILD_FAMILY } from './child-family';
export { COMMUNITY_GENERAL } from './general-others';

import { COMMUNITY_LOST_FOUND } from './lost-found';
import { COMMUNITY_EVENTS } from './events';
import { COMMUNITY_VOLUNTEERING } from './volunteering';
import { COMMUNITY_ANNOUNCEMENT } from './announcement';
import { COMMUNITY_CHILD_FAMILY } from './child-family';
import { COMMUNITY_GENERAL } from './general-others';

export const ALL_COMMUNITY_LISTINGS: MockListing[] = [
  ...COMMUNITY_LOST_FOUND,
  ...COMMUNITY_EVENTS,
  ...COMMUNITY_VOLUNTEERING,
  ...COMMUNITY_ANNOUNCEMENT,
  ...COMMUNITY_CHILD_FAMILY,
  ...COMMUNITY_GENERAL,
];

export const GB_ALL_COMMUNITY_LISTINGS: MockListing[] = ALL_COMMUNITY_LISTINGS;
export const GB_COMMUNITY_SUBCATEGORY_MAP: Record<string, MockListing[]> = {
  lost_found: COMMUNITY_LOST_FOUND,
  events: COMMUNITY_EVENTS,
  volunteering: COMMUNITY_VOLUNTEERING,
  announcement: COMMUNITY_ANNOUNCEMENT,
  child_family: COMMUNITY_CHILD_FAMILY,
  general_others: COMMUNITY_GENERAL,
};

