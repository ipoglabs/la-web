// src/posting/config/normalize.ts
export function normalizeCategory(uiCategory: string) {
  const m: Record<string, string> = {
    Property: "property",
    Jobs: "job",
    Vehicles: "vehicles",
    Services: "services",
    Pets: "pet",
    "For Sale": "forsale",
    Business: "business",
    "Community & Events": "community",
    "Special Offers": "specialOffers",
  };
  const key = (uiCategory ?? "").trim();
  return m[key] || key.toLowerCase();
}

// Aliases are namespaced per category — the same raw subcategory string
// (e.g. "accessories") can mean different things in different categories,
// so a single flat table is unsafe (see: Pets > Accessories used to resolve
// to Vehicles' "parts" bucket).
const SUBCATEGORY_ALIASES: Record<string, Record<string, string>> = {
  property: {
    "for students": "for students",
    "room rental": "room rental",
    "to buy": "to buy",
    "to rent": "to rent",
    commercial: "commercial",
    "holiday rental": "holiday rental",
    "land for sale/lease": "land for sale/lease",
    "land for sale / lease": "land for sale/lease", // config/categories spells it with spaces
    "new projects / off-plan": "new projects / off-plan",
    wanted: "wanted",
  },

  job: {
    "full time": "full time",
    "part time": "part time",
    internship: "internship",
    freelance: "freelance",
    temporary: "temporary",
    "temporary & seasonal": "temporary",
    "temporary / seasonal": "temporary", // config/categories wording
    wanted: "wanted",
  },

  vehicles: {
    car: "car",
    cars: "car", // config/categories uses the plural "Cars"
    motorcycle: "motorcycle",
    bike: "motorcycle",
    van: "van",
    truck: "truck",
    parts: "parts",
    accessories: "parts",
    "parts & accessories": "parts",
    boats: "boats",
    "electric vehicles": "electric_vehicles",
    wanted: "wanted",
  },

  pet: {
    "for sale": "forsale",
    adoption: "adoption",
    service: "services",
    services: "services",
    "pet services": "services",
    "pet care": "services", // config/categories wording
    accessories: "accessories",
    "pet accessories": "accessories",
    "lost & found": "lostfound",
    "lost and found": "lostfound",
    lostfound: "lostfound",
    wanted: "wanted",
  },

  services: {
    "home services": "home",
    home: "home",
    "business services": "business",
    business: "business",
    "health & fitness": "health",
    health: "health",
    tutoring: "tutoring",
    "education & learning": "education",
    education: "education",
    "travel & tourism": "travel",
    travel: "travel",
    "food & dining": "food",
    food: "food",
    "technology & gadgets": "technology",
    technology: "technology",
    "other services": "other",
    other: "other",
    "creative services": "creative",
    wanted: "wanted",
  },

  forsale: {
    electronics: "electronics",
    "home & furniture": "home_furniture",
    "office supplies": "office_supplies",
    "fashion & accessories": "fashion",
    "sports & fitness": "sports",
    "toys & games": "toys",
    "book, music & media": "media",
    "baby & kids": "kids",
    "health & beauty": "health_beauty",
    "garden & outdoors": "garden",
    "hobies & collections": "hobbies",
    miscellaneous: "misc",
    wanted: "wanted",
  },

  business: {
    "business for sale/lease": "sale_lease",
    "business for sale / lease": "sale_lease", // config/categories spells it with spaces
    "b2b service": "b2b",
    "b2c service": "b2c",
    "freelance / contractors": "contractors",
    "freelance contractors": "contractors", // config/categories wording
    "partnership opportunities": "partnership",
    "equipment and supplies": "equipment",
    "equipment & supplies": "equipment", // config/categories wording
    "start-up support": "startup",
    "startup support": "startup", // config/categories wording
    "training opportunities": "training",
    "franchise opportunities": "franchise",
    "business events": "events",
    "financial services": "financial",
    miscellaneous: "misc",
    wanted: "wanted",
  },

  community: {
    "lost & found": "lostfound",
    events: "events",
    classes: "classes",
    "volunteering & charity": "volunteering",
    "classes & courses": "courses",
    announcement: "announcement",
    "child & family activities": "activities",
    "general / others": "general",
    "rideshare & carpool": "rideshare",
    wanted: "wanted",
  },

  specialOffers: {
    "banking & financial deals": "banking",
    "banking & finance": "banking", // config/categories wording

    "travel & tourism": "travel",
    "retail & shopping": "retail",
    "food & dining": "food",
    "electronics & gadgets": "electronics",
    "health & wellness": "health",
    "education & learning": "education",
    "holiday & seasonal offers": "holiday",
    entertainment: "entertainment",
    "home & living": "home",
    automotive: "automotive",
    miscellaneous: "misc",
  },
};

export function normalizeSubcategory(category: string, sub: string) {
  const cat = normalizeCategory(category);
  const raw = (sub ?? "").trim().toLowerCase();
  return SUBCATEGORY_ALIASES[cat]?.[raw] || raw;
}
