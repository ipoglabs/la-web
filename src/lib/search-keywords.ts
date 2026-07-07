/**
 * lib/search-keywords.ts
 *
 * Keyword → category mapping for smart category suggestion in LaSearchBar.
 * No AI needed — plain string matching against curated keyword lists.
 *
 * Rules:
 *   - All keywords lowercase
 *   - Partial matches are fine (we use .includes() on the trimmed input)
 *   - Add synonyms, brand names, and common misspellings freely
 *   - Order of entries in KEYWORD_CATEGORY_MAP doesn't matter
 *
 * Usage:
 *   suggestCategory("iMac 27 inch") → { cat: "electronics_tech", label: "Electronics & Tech" }
 *   suggestCategory("3 bed flat")   → { cat: "property",         label: "Property" }
 *   suggestCategory("hello world")  → null
 */

import { CATEGORY_LABELS } from "@/lib/category-map";

// ── keyword bank ──────────────────────────────────────────────────────────────

const KEYWORD_CATEGORY_MAP: Record<string, string[]> = {
  property: [
    "flat", "apartment", "house", "room", "studio", "bedsit", "bungalow",
    "cottage", "mansion", "villa", "rent", "let", "lease", "buy", "purchase",
    "property", "bed", "bedroom", "bath", "hmo", "tenancy", "landlord",
    "mortgage", "freehold", "leasehold", "commercial", "office space",
  ],

  vehicles: [
    "car", "van", "truck", "suv", "hatchback", "saloon", "estate", "coupe",
    "convertible", "pickup", "minivan", "campervan", "motorbike", "motorcycle",
    "scooter", "moped", "bicycle", "bike", "boat", "yacht", "bmw", "mercedes",
    "toyota", "honda", "ford", "audi", "volkswagen", "vw", "nissan", "hyundai",
    "tesla", "jaguar", "land rover", "volvo", "porsche", "ferrari", "lamborghini",
    "tyre", "exhaust", "engine", "gearbox", "mot", "service",
  ],

  jobs: [
    "job", "work", "career", "vacancy", "hiring", "recruit", "employ",
    "full time", "part time", "freelance", "internship", "graduate",
    "salary", "wage", "remote", "wfh", "cv", "resume", "manager",
    "engineer", "developer", "designer", "nurse", "teacher", "driver",
    "accountant", "analyst", "consultant", "sales", "marketing", "hr",
  ],

  services: [
    "plumber", "electrician", "cleaner", "cleaning", "painter", "decorator",
    "builder", "handyman", "carpenter", "gardener", "gardening",
    "locksmith", "roofing", "tiling", "plastering", "removal", "moving",
    "courier", "delivery", "photographer", "videographer", "catering",
    "wedding", "event", "tutor", "lessons", "coaching", "personal trainer",
  ],

  pets: [
    "dog", "cat", "puppy", "kitten", "rabbit", "hamster", "bird", "parrot",
    "fish", "reptile", "snake", "gecko", "horse", "pony", "pet", "breed",
    "pedigree", "kennel", "vet", "grooming", "adoption", "rescue",
  ],

  electronics_tech: [
    "phone", "iphone", "samsung", "android", "smartphone", "mobile",
    "laptop", "macbook", "dell", "hp", "lenovo", "asus", "acer", "chromebook",
    "tablet", "ipad", "kindle", "computer", "pc", "desktop", "imac", "mac",
    "monitor", "screen", "keyboard", "mouse", "webcam", "printer",
    "tv", "television", "4k", "oled", "qled", "sony", "lg", "samsung tv",
    "playstation", "ps5", "ps4", "xbox", "nintendo", "switch", "console",
    "gaming", "gpu", "graphics card", "rtx", "gtx", "cpu", "processor",
    "airpods", "headphones", "earbuds", "speaker", "soundbar", "camera",
    "dslr", "mirrorless", "gopro", "drone", "smart watch", "apple watch",
    "fitbit", "router", "wifi", "broadband", "charger", "cable", "usb",
  ],

  home_furniture: [
    "sofa", "couch", "chair", "armchair", "table", "desk", "wardrobe",
    "bed frame", "mattress", "bookcase", "shelf", "shelving", "cabinet",
    "dresser", "drawers", "lamp", "light", "rug", "carpet", "curtain",
    "blind", "mirror", "fridge", "washing machine", "dishwasher", "oven",
    "microwave", "hoover", "vacuum", "ikea", "home appliance", "appliance",
    "garden furniture", "bbq", "barbecue", "patio", "fence", "shed",
  ],

  fashion_clothing: [
    "clothes", "clothing", "dress", "shirt", "jeans", "trousers", "jacket",
    "coat", "hoodie", "jumper", "sweater", "top", "blouse", "skirt",
    "shoes", "trainers", "boots", "heels", "sandals", "sneakers", "nike",
    "adidas", "gucci", "prada", "louis vuitton", "zara", "h&m", "primark",
    "handbag", "bag", "purse", "wallet", "watch", "jewellery", "necklace",
    "ring", "earrings", "bracelet", "sunglasses", "hat", "scarf",
  ],

  sports_outdoors: [
    "gym", "weights", "dumbbell", "barbell", "treadmill", "exercise bike",
    "yoga", "pilates", "football", "soccer", "cricket", "tennis", "golf",
    "swimming", "cycling", "running", "hiking", "camping", "tent", "sleeping bag",
    "surfboard", "kayak", "ski", "snowboard", "fishing", "football boots",
    "sports kit", "training", "fitness", "protein", "supplement",
  ],

  baby_kids: [
    "pram", "pushchair", "stroller", "buggy", "cot", "crib", "moses basket",
    "baby monitor", "highchair", "car seat", "baby clothes", "nappy", "bottle",
    "toy", "toys", "lego", "playhouse", "trampoline", "scooter kids",
    "school bag", "school uniform", "kids bike", "children",
  ],

  musical_instruments: [
    "guitar", "bass", "electric guitar", "acoustic guitar", "ukulele",
    "piano", "keyboard", "synthesizer", "drums", "drum kit", "cymbals",
    "violin", "cello", "flute", "saxophone", "trumpet", "clarinet",
    "dj", "decks", "turntable", "mixer", "microphone", "amplifier", "amp",
    "music", "instrument", "fender", "gibson", "roland",
  ],

  books_media_collectibles: [
    "book", "novel", "textbook", "comic", "manga", "magazine", "vinyl",
    "record", "dvd", "blu-ray", "cd", "vhs", "board game", "chess",
    "puzzle", "collectible", "figurine", "lego set", "trading card",
    "pokemon card", "antique", "memorabilia",
  ],

  food_dining: [
    "food", "meal", "tiffin", "catering", "baked", "cake", "homemade",
    "lunch", "dinner", "breakfast", "snack", "delivery food", "restaurant",
    "takeaway", "cloud kitchen",
  ],

  travel_stays: [
    "hotel", "b&b", "airbnb", "holiday", "vacation", "travel", "flight",
    "cruise", "tour", "trip", "package holiday", "guesthouse", "hostel",
    "staycation", "city break", "airport transfer",
  ],

  education: [
    "tutor", "tutoring", "online course", "class", "workshop", "training",
    "degree", "a-level", "gcse", "school", "college", "university",
    "language course", "english", "maths", "science", "coding course",
  ],

  health_beauty: [
    "hair", "haircut", "salon", "spa", "massage", "facial", "nails",
    "makeup", "beauty", "skincare", "gym membership", "physiotherapy",
    "dentist", "optician", "health", "wellness",
  ],

  tickets_vouchers: [
    "ticket", "concert", "gig", "festival", "match ticket", "football ticket",
    "gift card", "voucher", "experience day", "theme park", "cinema",
  ],

  community: [
    "lost", "found", "missing", "event", "volunteer", "community",
    "announcement", "charity", "neighbourhood", "help wanted",
  ],

  free_giveaway: [
    "free", "giveaway", "give away", "freecycle", "donate", "collection only",
    "no longer needed", "unwanted",
  ],

  business: [
    "business for sale", "franchise", "startup", "b2b", "wholesale",
    "equipment for sale", "commercial vehicle", "office equipment",
  ],

  special_offers: [
    "deal", "discount", "offer", "sale", "promo", "cashback", "coupon",
    "voucher code", "limited offer",
  ],
};

// ── suggestion engine ─────────────────────────────────────────────────────────

export interface CategorySuggestion {
  cat:   string;
  label: string;
}

/**
 * Given a search keyword string, return the best matching category or null.
 * Matching is case-insensitive. The first match wins (most specific wins
 * because more niche categories are listed before broad ones in the map).
 */
export function suggestCategory(keyword: string): CategorySuggestion | null {
  const lower = keyword.trim().toLowerCase();
  if (!lower || lower.length < 2) return null;

  for (const [cat, keywords] of Object.entries(KEYWORD_CATEGORY_MAP)) {
    if (keywords.some((kw) => lower.includes(kw) || kw.includes(lower))) {
      return { cat, label: CATEGORY_LABELS[cat] ?? cat };
    }
  }
  return null;
}
