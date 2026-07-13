import type { MockListing } from "../../mock-listing-schema";
export { HOME_SOFAS } from './sofas-seating';
export { HOME_BEDS } from './beds-bedroom';
export { HOME_TABLES } from './tables-dining';
export { HOME_KITCHEN } from './kitchen-appliances';
export { HOME_STORAGE } from './storage-shelving';
export { HOME_DECOR } from './home-decor';
export { HOME_GARDEN } from './garden-outdoor';
export { HOME_DIY } from './diy-tools';

import { HOME_SOFAS } from './sofas-seating';
import { HOME_BEDS } from './beds-bedroom';
import { HOME_TABLES } from './tables-dining';
import { HOME_KITCHEN } from './kitchen-appliances';
import { HOME_STORAGE } from './storage-shelving';
import { HOME_DECOR } from './home-decor';
import { HOME_GARDEN } from './garden-outdoor';
import { HOME_DIY } from './diy-tools';

export const ALL_HOME_FURNITURE_LISTINGS: MockListing[] = [
  ...HOME_SOFAS,
  ...HOME_BEDS,
  ...HOME_TABLES,
  ...HOME_KITCHEN,
  ...HOME_STORAGE,
  ...HOME_DECOR,
  ...HOME_GARDEN,
  ...HOME_DIY,
];

export const GB_ALL_HOME_FURNITURE_LISTINGS: MockListing[] = ALL_HOME_FURNITURE_LISTINGS;
export const GB_HOME_FURNITURE_SUBCATEGORY_MAP: Record<string, MockListing[]> = {
  sofas_seating: HOME_SOFAS,
  beds_bedroom: HOME_BEDS,
  tables_dining: HOME_TABLES,
  kitchen_appliances: HOME_KITCHEN,
  storage_shelving: HOME_STORAGE,
  home_decor: HOME_DECOR,
  garden_outdoor: HOME_GARDEN,
  diy_tools: HOME_DIY,
};

