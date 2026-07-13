import type { MockListing } from "@/lib/mock/mock-listing-schema";
import {
  SG_VEHICLES_CARS,
  SG_VEHICLES_MOTORCYCLE,
  SG_VEHICLES_VAN,
  SG_VEHICLES_TRUCK,
  SG_VEHICLES_BOATS,
  SG_VEHICLES_PARTS,
  SG_VEHICLES_WANTED,
} from "./vehicles-data";

export {
  SG_VEHICLES_CARS,
  SG_VEHICLES_MOTORCYCLE,
  SG_VEHICLES_VAN,
  SG_VEHICLES_TRUCK,
  SG_VEHICLES_BOATS,
  SG_VEHICLES_PARTS,
  SG_VEHICLES_WANTED,
};

export const SG_VEHICLES_SUBCATEGORY_MAP: Record<string, MockListing[]> = {
  cars: SG_VEHICLES_CARS,
  motorcycle: SG_VEHICLES_MOTORCYCLE,
  van: SG_VEHICLES_VAN,
  truck: SG_VEHICLES_TRUCK,
  boats: SG_VEHICLES_BOATS,
  parts_accessories: SG_VEHICLES_PARTS,
  wanted: SG_VEHICLES_WANTED,
};

export const SG_ALL_VEHICLES_LISTINGS: MockListing[] = [
  ...SG_VEHICLES_CARS,
  ...SG_VEHICLES_MOTORCYCLE,
  ...SG_VEHICLES_VAN,
  ...SG_VEHICLES_TRUCK,
  ...SG_VEHICLES_BOATS,
  ...SG_VEHICLES_PARTS,
  ...SG_VEHICLES_WANTED,
];
