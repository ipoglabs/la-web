// Mirrors the taxonomy in "LokalAds — Mock Data Backbone" §5 and the
// 2026-07-13 country-key correction (uk -> gb, ISO 3166-1).

export const COUNTRIES = ["in", "gb", "sg"] as const;
export type Country = (typeof COUNTRIES)[number];

export const CATEGORIES = [
  "property",
  "vehicles",
  "jobs",
  "services",
  "for-sale",
  "pets",
  "business",
  "community",
  "special-offers",
  "education",
  "health-beauty",
  "food-dining",
  "travel-stays",
  "baby-kids",
  "sports-outdoors",
  "electronics-tech",
  "home-furniture",
  "fashion-clothing",
  // Added when the full lib/mock/ dataset (21 categories) was migrated into
  // Mongo — these 4 exist in mock data but hadn't been added here yet.
  "musical-instruments",
  "books-media-collectibles",
  "tickets-vouchers",
  "free-giveaway",
] as const;
export type Category = (typeof CATEGORIES)[number];

// advId ranges from §7 — used for validation, not generation.
// Generation should use a per-category counter (see Listing.ts pre-save hook).
export const ADV_ID_RANGES: Record<Category, [number, number]> = {
  property: [10001, 10999],
  vehicles: [20001, 20999],
  jobs: [30001, 30999],
  services: [40001, 40999],
  "for-sale": [50001, 50999],
  pets: [60001, 60999],
  business: [70001, 70999],
  community: [71001, 71999],
  "special-offers": [72001, 72999],
  education: [73001, 73999],
  "health-beauty": [74001, 74999],
  "food-dining": [75001, 75999],
  "travel-stays": [76001, 76999],
  "baby-kids": [77001, 77999],
  "sports-outdoors": [78001, 78999],
  "electronics-tech": [79001, 79999],
  "home-furniture": [80001, 80999],
  "fashion-clothing": [81001, 81999],
  "musical-instruments": [82001, 82999],
  "books-media-collectibles": [83001, 83999],
  "tickets-vouchers": [84001, 84999],
  "free-giveaway": [85001, 85999],
};

export const ID_PREFIXES: Record<Category, string> = {
  property: "prop",
  vehicles: "veh",
  jobs: "job",
  services: "svc",
  "for-sale": "sale",
  pets: "pet",
  business: "biz",
  community: "comm",
  "special-offers": "deal",
  education: "edu",
  "health-beauty": "hb",
  "food-dining": "food",
  "travel-stays": "travel",
  "baby-kids": "baby",
  "sports-outdoors": "sport",
  "electronics-tech": "tech",
  "home-furniture": "home",
  "fashion-clothing": "fashion",
  "musical-instruments": "music",
  "books-media-collectibles": "media",
  "tickets-vouchers": "ticket",
  "free-giveaway": "free",
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