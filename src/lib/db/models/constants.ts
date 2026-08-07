// Mirrors the taxonomy in "LokalAds — Mock Data Backbone" §5 and the
// 2026-07-13 country-key correction (uk -> gb, ISO 3166-1).

export const COUNTRIES = ["in", "gb", "sg"] as const;
export type Country = (typeof COUNTRIES)[number];

// Ids mirror the canonical taxonomy in src/config/categories/ (snake_case).
// "for-sale" was a stray entry here with no corresponding top-level category
// in config/categories — removed. (Pets/Business each have their own
// "for_sale"/"biz_for_sale" *subcategory*, unrelated to this list.)
export const CATEGORIES = [
  "property",
  "vehicles",
  "jobs",
  "services",
  "pets",
  "business",
  "community",
  "special_offers",
  "education",
  "health_beauty",
  "food_dining",
  "travel_stays",
  "baby_kids",
  "sports_outdoors",
  "electronics_tech",
  "home_furniture",
  "fashion_clothing",
  "musical_instruments",
  "books_media_collectibles",
  "tickets_vouchers",
  "free_giveaway",
] as const;
export type Category = (typeof CATEGORIES)[number];

// advId ranges from §7 — used for validation, not generation.
// Generation should use a per-category counter (see Listing.ts pre-save hook).
export const ADV_ID_RANGES: Record<Category, [number, number]> = {
  property: [10001, 10999],
  vehicles: [20001, 20999],
  jobs: [30001, 30999],
  services: [40001, 40999],
  pets: [60001, 60999],
  business: [70001, 70999],
  community: [71001, 71999],
  special_offers: [72001, 72999],
  education: [73001, 73999],
  health_beauty: [74001, 74999],
  food_dining: [75001, 75999],
  travel_stays: [76001, 76999],
  baby_kids: [77001, 77999],
  sports_outdoors: [78001, 78999],
  electronics_tech: [79001, 79999],
  home_furniture: [80001, 80999],
  fashion_clothing: [81001, 81999],
  musical_instruments: [82001, 82999],
  books_media_collectibles: [83001, 83999],
  tickets_vouchers: [84001, 84999],
  free_giveaway: [85001, 85999],
};

export const ID_PREFIXES: Record<Category, string> = {
  property: "prop",
  vehicles: "veh",
  jobs: "job",
  services: "svc",
  pets: "pet",
  business: "biz",
  community: "comm",
  special_offers: "deal",
  education: "edu",
  health_beauty: "hb",
  food_dining: "food",
  travel_stays: "travel",
  baby_kids: "baby",
  sports_outdoors: "sport",
  electronics_tech: "tech",
  home_furniture: "home",
  fashion_clothing: "fashion",
  musical_instruments: "music",
  books_media_collectibles: "media",
  tickets_vouchers: "ticket",
  free_giveaway: "free",
};

export const STATUS_VALUES = [
  "active",
  "closed",
  "off-market",
  // Proposed future values from §12 — included now since the schema
  // is easier to extend before real data exists than after.
  "sold",
  "filled",
  "found",
] as const;
export type ListingStatus = (typeof STATUS_VALUES)[number];

export const LISTING_TYPE_VALUES = ["offer", "wanted"] as const;
export type ListingType = (typeof LISTING_TYPE_VALUES)[number];

export const PRICE_SUFFIXES = [
  "/ mo",
  "/ wk",
  "/ night",
  "/ hr",
  "/ yr",
  "/ day",
  "/ session",
] as const;
export type PriceSuffix = (typeof PRICE_SUFFIXES)[number];