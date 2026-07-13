import type { MockListing } from "../../mock-listing-schema";
export { SPORTS_GYM_EQUIPMENT } from './gym-fitness-equipment';
export { SPORTS_TEAM } from './team-sports';
export { SPORTS_OUTDOOR } from './outdoor-adventure';
export { SPORTS_WATER } from './water-sports';
export { SPORTS_WEAR } from './sportswear';
export { SPORTS_COACHING } from './fitness-coaching';

import { SPORTS_GYM_EQUIPMENT } from './gym-fitness-equipment';
import { SPORTS_TEAM } from './team-sports';
import { SPORTS_OUTDOOR } from './outdoor-adventure';
import { SPORTS_WATER } from './water-sports';
import { SPORTS_WEAR } from './sportswear';
import { SPORTS_COACHING } from './fitness-coaching';

export const ALL_SPORTS_OUTDOORS_LISTINGS: MockListing[] = [
  ...SPORTS_GYM_EQUIPMENT,
  ...SPORTS_TEAM,
  ...SPORTS_OUTDOOR,
  ...SPORTS_WATER,
  ...SPORTS_WEAR,
  ...SPORTS_COACHING,
];

export const GB_ALL_SPORTS_OUTDOORS_LISTINGS: MockListing[] = ALL_SPORTS_OUTDOORS_LISTINGS;
export const GB_SPORTS_OUTDOORS_SUBCATEGORY_MAP: Record<string, MockListing[]> = {
  gym_fitness_equipment: SPORTS_GYM_EQUIPMENT,
  team_sports: SPORTS_TEAM,
  outdoor_adventure: SPORTS_OUTDOOR,
  water_sports: SPORTS_WATER,
  sportswear: SPORTS_WEAR,
  fitness_coaching: SPORTS_COACHING,
};

