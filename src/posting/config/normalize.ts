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

export function normalizeSubcategory(sub: string) {
  const raw = (sub ?? "").trim().toLowerCase();

  const aliases: Record<string, string> = {
    // --- property ---
    "for students": "for students",
    "room rental": "room rental",
    "to buy": "to buy",
    "to rent": "to rent",
    commercial: "commercial",
    "holiday rental": "holiday rental",
    "land for sale/lease": "land for sale/lease",
    wanted: "wanted",

    // --- jobs ---
    "full time": "full time",
    "part time": "part time",
    internship: "internship",
    freelance: "freelance",
    temporary: "temporary",

    // --- vehicles ---
    car: "car",
    motorcycle: "motorcycle",
    bike: "motorcycle",
    van: "van",
    truck: "truck",
    parts: "parts",
    accessories: "parts",
    "parts & accessories": "parts",

    // --- pets ---
    adoption: "adoption",
    "lost & found": "lostfound",
    "lost and found": "lostfound",
    lostfound: "lostfound",
    services: "services",
    "pet services": "services",
    "pet accessories": "accessories",
    "pet wanted": "wanted",

    // --- services ---
    education: "education",
    food: "food",
    health: "health",
    home: "home",
    other: "other",
    technology: "technology",
    travel: "travel",
    tutoring: "tutoring",

    // --- For Sale ---
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
    "for sale wanted": "wanted",

    // --- Business ---
    "business for sale/lease": "sale_lease",
    "b2b service": "b2b",
    "b2c service": "b2c",
    "freelance / contractors": "contractors",
    "partnership opportunities": "partnership",
    "equipment and supplies": "equipment",
    "start-up support": "startup",
    "training opportunities": "training",
    "franchise opportunities": "franchise",
    "business events": "events",
    "financial services": "financial",
    "business miscellaneous": "misc",
    "business wanted": "wanted",

    // --- Community & Events ---
    "community lost & found": "lostfound",
    events: "events",
    classes: "classes",
    "volunteering & charity": "volunteering",
    "classes & courses": "courses",
    announcement: "announcement",
    "child & family activities": "activities",
    "general / others": "general",
    "community wanted": "wanted",

    // --- Special Offers ---
    "banking & financial deals": "banking",
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
    "special offers miscellaneous": "misc",
  };

  return aliases[raw] || raw;
}
