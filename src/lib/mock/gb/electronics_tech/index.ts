import type { MockListing } from "../../mock-listing-schema";
export { TECH_MOBILE } from './mobile-tablets';
export { TECH_LAPTOPS } from './laptops-computers';
export { TECH_TV_AUDIO } from './tvs-audio';
export { TECH_GAMING } from './gaming';
export { TECH_CAMERAS } from './cameras-photography';
export { TECH_PARTS } from './computer-parts';
export { TECH_WEARABLES } from './wearables-smart';

import { TECH_MOBILE } from './mobile-tablets';
import { TECH_LAPTOPS } from './laptops-computers';
import { TECH_TV_AUDIO } from './tvs-audio';
import { TECH_GAMING } from './gaming';
import { TECH_CAMERAS } from './cameras-photography';
import { TECH_PARTS } from './computer-parts';
import { TECH_WEARABLES } from './wearables-smart';

export const ALL_ELECTRONICS_TECH_LISTINGS: MockListing[] = [
  ...TECH_MOBILE,
  ...TECH_LAPTOPS,
  ...TECH_TV_AUDIO,
  ...TECH_GAMING,
  ...TECH_CAMERAS,
  ...TECH_PARTS,
  ...TECH_WEARABLES,
];

export const GB_ALL_ELECTRONICS_TECH_LISTINGS: MockListing[] = ALL_ELECTRONICS_TECH_LISTINGS;
export const GB_ELECTRONICS_TECH_SUBCATEGORY_MAP: Record<string, MockListing[]> = {
  mobile_tablets: TECH_MOBILE,
  laptops_computers: TECH_LAPTOPS,
  tvs_audio: TECH_TV_AUDIO,
  gaming: TECH_GAMING,
  cameras_photography: TECH_CAMERAS,
  computer_parts: TECH_PARTS,
  wearables_smart: TECH_WEARABLES,
};

