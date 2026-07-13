import type { MockListing } from "@/lib/mock/mock-listing-schema";
import {
  IN_VEHICLES_CARS,
  IN_VEHICLES_MOTORCYCLE,
  IN_VEHICLES_VAN,
  IN_VEHICLES_TRUCK,
  IN_VEHICLES_BOATS,
  IN_VEHICLES_PARTS,
  IN_VEHICLES_WANTED,
} from "./vehicles-data";

export {
  IN_VEHICLES_CARS,
  IN_VEHICLES_MOTORCYCLE,
  IN_VEHICLES_VAN,
  IN_VEHICLES_TRUCK,
  IN_VEHICLES_BOATS,
  IN_VEHICLES_PARTS,
  IN_VEHICLES_WANTED,
};

export const IN_VEHICLES_SUBCATEGORY_MAP: Record<string, MockListing[]> = {
  cars: IN_VEHICLES_CARS,
  motorcycle: IN_VEHICLES_MOTORCYCLE,
  van: IN_VEHICLES_VAN,
  truck: IN_VEHICLES_TRUCK,
  boats: IN_VEHICLES_BOATS,
  parts_accessories: IN_VEHICLES_PARTS,
  wanted: IN_VEHICLES_WANTED,
};

export const IN_ALL_VEHICLES_LISTINGS: MockListing[] = [
  ...IN_VEHICLES_CARS,
  ...IN_VEHICLES_MOTORCYCLE,
  ...IN_VEHICLES_VAN,
  ...IN_VEHICLES_TRUCK,
  ...IN_VEHICLES_BOATS,
  ...IN_VEHICLES_PARTS,
  ...IN_VEHICLES_WANTED,
];
