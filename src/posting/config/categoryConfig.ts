// src/posting/config/categoryConfig.ts
import type { CategoryConfig, FieldSpec } from "./types";

// bring your split configs
import { propertyConfig } from "./property";
import { jobConfig } from "./job";
import { vehiclesConfig } from "./vehicles";
import { petConfig } from "./pet";
import { servicesConfig } from "./services";

import { forsaleConfig } from "./forsale";
import { businessConfig } from "./business";
import { communityConfig } from "./community";
import { specialOffersConfig } from "./specialOffers";

export const CATEGORY_CONFIG: CategoryConfig = {
  property: propertyConfig,
  job: jobConfig,
  vehicles: vehiclesConfig,
  pet: petConfig,
  services: servicesConfig,

  forsale: forsaleConfig,
  business: businessConfig,
  community: communityConfig,
  specialOffers: specialOffersConfig,
};

export const FALLBACK_OPTIONAL_FIELDS: FieldSpec[] = [
  { key: "propertyType", type: "string", label: "Property Type" },
  { key: "beds", type: "number", label: "Beds" },
  { key: "baths", type: "number", label: "Baths" },
  { key: "rentPrice", type: "currency", label: "Rent Price (₹)" },
  { key: "salePrice", type: "currency", label: "Sale Price (₹)" },
  { key: "deposit", type: "currency", label: "Deposit (₹)" },
  { key: "occupancy", type: "string", label: "Occupancy" },
  { key: "gender_pref", type: "string", label: "Gender Preference" },
  { key: "facilities", type: "array", label: "Facilities" },
  { key: "amenities", type: "array", label: "Amenities" },
  { key: "availability", type: "string", label: "Availability" },
  { key: "price", type: "currency", label: "Price (₹)" },
];
