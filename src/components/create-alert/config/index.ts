/**
 * config/index.ts — assembles all category configs into ALERT_CONFIG.
 * Import from this barrel, not from individual category files.
 */
import type { MainCategory } from "../types";

import { property }      from "./property";
import { vehicles }      from "./vehicles";
import { jobs }          from "./jobs";
import { services }      from "./services";
import { pets }          from "./pets";
import { business }      from "./business";
import { community }     from "./community";
import { specialOffers } from "./special-offers";
import { education }      from "./education";
import { healthBeauty }   from "./health-beauty";
import { foodDining }     from "./food-dining";
import { travelStays }       from "./travel-stays";
import { babyKids }          from "./baby-kids";
import { sportsOutdoors }    from "./sports-outdoors";
import { electronicsTech }   from "./electronics-tech";
import { homeFurniture }     from "./home-furniture";
import { fashionClothing }        from "./fashion-clothing";
import { musicalInstruments }     from "./musical-instruments";
import { booksMediaCollectibles } from "./books-media-collectibles";
import { ticketsVouchers }        from "./tickets-vouchers";
import { freeGiveaway }           from "./free-giveaway";

export const ALERT_CONFIG: MainCategory[] = [
  property,
  vehicles,
  jobs,
  services,
  pets,
  business,
  community,
  specialOffers,
  education,
  healthBeauty,
  foodDining,
  travelStays,
  babyKids,
  sportsOutdoors,
  electronicsTech,
  homeFurniture,
  fashionClothing,
  musicalInstruments,
  booksMediaCollectibles,
  ticketsVouchers,
  freeGiveaway,
];
