type StoreState = {
  category: string;
  subcategory: string;
  name: string;
  description: string;
  location?: { address?: string; lat?: number; lng?: number };
  sellerInfo?: { name?: string; email?: string; phone?: string };
  images?: (File | string)[];

  [k: string]: any;
};

/** Allow date/boolean in addition to string/number/array */
type FieldScalar = "string" | "number" | "date" | "boolean";
type FieldSpec =
  | { key: string; type: FieldScalar }
  | { key: string; type: "array" };

type CategoryConfig = Record<
  string,
  Record<string, FieldSpec[]>
>;

/** ---- NORMALIZERS ---- **/
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
    // property
    "for students": "for students",
    "room rental": "room rental",
    "to buy": "to buy",
    "to rent": "to rent",
    commercial: "commercial",
    "for sale": "for sale",
    "to wanted": "to wanted",
    "holiday rental": "holiday rental",
    "land for sale/lease": "land for sale/lease",

    // jobs
    "full time": "full time",
    "part time": "part time",
    internship: "internship",
    freelance: "freelance",
    temporary: "temporary",
    wanted: "wanted",

    // vehicles
    car: "car",
    motorcycle: "motorcycle",
    bike: "motorcycle",
    van: "van",
    truck: "truck",
    parts: "parts",
    accessories: "parts",
    "parts & accessories": "parts",
    "vehicle wanted": "wanted",

    // pets
    adoption: "adoption",
    "lost & found": "lostfound",
    "lost and found": "lostfound",
    lostfound: "lostfound",
    services: "services",
    "pet services": "services",
    "pet accessories": "accessories",
    "pet wanted": "wanted",

    // services (explicit)
    education: "education",
    food: "food",
    health: "health",
    home: "home",
    other: "other",
    technology: "technology",
    travel: "travel",
    tutoring: "tutoring",
  };
  return aliases[raw] || raw;
}

/** ---- PER-SUBCATEGORY CONFIG (keys are LOWERCASE) ---- **/
export const CATEGORY_CONFIG: CategoryConfig = {
  property: {
    "for students": [
      { key: "propertyType", type: "string" },
      { key: "beds", type: "number" },
      { key: "baths", type: "number" },
      { key: "rentPrice", type: "number" },
      { key: "deposit", type: "number" },
      { key: "occupancy", type: "string" },
      { key: "gender_pref", type: "string" },
      { key: "facilities", type: "array" },
    ],
    "room rental": [
      { key: "type", type: "string" },
      { key: "rent", type: "number" },
      { key: "deposit", type: "number" },
      { key: "available_from", type: "string" },
      { key: "preferred_tenants", type: "string" },
      { key: "gender_pref", type: "string" },
      { key: "amenities", type: "array" },
      { key: "rules", type: "array" },
    ],
    "to buy": [
      { key: "budget", type: "number" },
      { key: "propertyType", type: "string" },
      { key: "preferred_locations", type: "array" },
    ],
    commercial: [
      { key: "propertyType", type: "string" },
      { key: "builtup_area", type: "number" },
      { key: "carpet_area", type: "number" },
      { key: "floor", type: "number" },
      { key: "totalFloors", type: "number" },
      { key: "furnishing", type: "string" },
      { key: "washrooms", type: "number" },
      { key: "pantry", type: "string" },
      { key: "parkingSpaces", type: "number" },
      { key: "rentPrice", type: "number" },
      { key: "deposit", type: "number" },
      { key: "maintenance", type: "number" },
      { key: "available_from", type: "string" },
      { key: "leaseTerm", type: "number" },
      { key: "powerBackup", type: "string" },
      { key: "facilities", type: "array" },
      { key: "amenities", type: "array" },
    ],
    "holiday rental": [
      { key: "holidayType", type: "string" },
      { key: "guests", type: "number" },
      { key: "beds", type: "number" },
      { key: "baths", type: "number" },
      { key: "amenities", type: "array" },
      { key: "house_rules", type: "array" },
      { key: "rateNightly", type: "number" },
      { key: "rateWeekly", type: "number" },
      { key: "rateMonthly", type: "number" },
    ],
    "for sale": [
      { key: "propertyType", type: "string" },
      { key: "salePrice", type: "number" },
      { key: "negotiable", type: "string" },
      { key: "builtup_area", type: "number" },
      { key: "carpet_area", type: "number" },
      { key: "plot_area", type: "number" },
      { key: "beds", type: "number" },
      { key: "baths", type: "number" },
      { key: "ownership", type: "string" },
      { key: "age", type: "string" },
      { key: "amenities", type: "array" },
    ],
    "to wanted": [
      { key: "propertyType", type: "string" },
      { key: "minBudget", type: "number" },
      { key: "maxBudget", type: "number" },
      { key: "minArea", type: "number" },
      { key: "beds", type: "number" },
      { key: "baths", type: "number" },
      { key: "preferred_locations", type: "array" },
      { key: "amenities", type: "array" },
    ],
  },

  job: {
    "full time": [
      { key: "jobType", type: "string" },
      { key: "company", type: "string" },
      { key: "salary", type: "number" },
      { key: "experience", type: "string" },
      { key: "skills", type: "array" },
      { key: "benefits", type: "array" },
      { key: "workMode", type: "string" },
    ],
    "part time": [
      { key: "company", type: "string" },
      { key: "hourlyRate", type: "number" },
      { key: "shifts", type: "array" },
      { key: "workMode", type: "string" },
      { key: "employmentType", type: "string" },
      { key: "applyLink", type: "string" },
      { key: "deadline", type: "string" },
    ],
    internship: [
      { key: "company", type: "string" },
      { key: "workMode", type: "string" },
      { key: "duration", type: "string" },
      { key: "startDate", type: "string" },
      { key: "stipendType", type: "string" },
      { key: "stipend", type: "number" },
      { key: "skills", type: "array" },
      { key: "employmentType", type: "string" },
      { key: "applyLink", type: "string" },
    ],
    freelance: [
      { key: "company", type: "string" },
      { key: "workMode", type: "string" },
      { key: "projectType", type: "string" },
      { key: "duration", type: "string" },
      { key: "budgetType", type: "string" },
      { key: "budgetAmount", type: "number" },
      { key: "skills", type: "array" },
      { key: "employmentType", type: "string" },
      { key: "applyLink", type: "string" },
    ],
    temporary: [
      { key: "company", type: "string" },
      { key: "workMode", type: "string" },
      { key: "workingHours", type: "string" },
      { key: "startDate", type: "string" },
      { key: "endDate", type: "string" },
      { key: "salary", type: "number" },
      { key: "skills", type: "array" },
      { key: "employmentType", type: "string" },
    ],
    wanted: [
      { key: "candidateName", type: "string" },
      { key: "employmentType", type: "string" },
      { key: "preferred_locations", type: "string" },
      { key: "available_from", type: "string" },
      { key: "salary", type: "number" },
      { key: "skills", type: "array" },
      { key: "experience", type: "string" },
    ],
  },

  vehicles: {
    car: [
      { key: "make", type: "string" },
      { key: "model", type: "string" },
      { key: "year", type: "number" },
      { key: "kms", type: "number" },
      { key: "fuelType", type: "string" },
      { key: "transmission", type: "string" },
      { key: "bodyType", type: "string" },
      { key: "color", type: "string" },
      { key: "ownerType", type: "string" },
      { key: "registrationNumber", type: "string" },
      { key: "insuranceValidTill", type: "date" },
      { key: "serviceHistory", type: "string" },
      { key: "features", type: "array" },
      { key: "salePrice", type: "number" },
    ],
    motorcycle: [
      { key: "make", type: "string" },
      { key: "model", type: "string" },
      { key: "year", type: "number" },
      { key: "kms", type: "number" },
      { key: "engineCapacity", type: "number" },
      { key: "fuelType", type: "string" },
      { key: "transmission", type: "string" },
      { key: "condition", type: "string" },
      { key: "ownerType", type: "string" },
      { key: "registrationNumber", type: "string" },
      { key: "insuranceValidTill", type: "date" },
      { key: "serviceHistory", type: "string" },
      { key: "color", type: "string" },
      { key: "features", type: "array" },
      { key: "salePrice", type: "number" },
    ],
    truck: [
      { key: "make", type: "string" },
      { key: "model", type: "string" },
      { key: "year", type: "number" },
      { key: "mileage", type: "number" },
      { key: "fuelType", type: "string" },
      { key: "transmission", type: "string" },
      { key: "condition", type: "string" },
      { key: "color", type: "string" },
      { key: "ownerType", type: "string" },
      { key: "registrationNumber", type: "string" },
      { key: "insuranceValidTill", type: "date" },
      { key: "serviceHistory", type: "string" },
      { key: "features", type: "array" },
      { key: "salePrice", type: "number" },
    ],
    van: [
      { key: "make", type: "string" },
      { key: "model", type: "string" },
      { key: "year", type: "number" },
      { key: "mileage", type: "number" },
      { key: "fuelType", type: "string" },
      { key: "transmission", type: "string" },
      { key: "seatingCapacity", type: "number" },
      { key: "color", type: "string" },
      { key: "condition", type: "string" },
      { key: "negotiable", type: "boolean" },
      { key: "ownerType", type: "string" },
      { key: "registrationNumber", type: "string" },
      { key: "insuranceValidTill", type: "date" },
      { key: "serviceHistory", type: "string" },
      { key: "features", type: "array" },
      { key: "salePrice", type: "number" },
    ],
    parts: [
      { key: "name", type: "string" },
      { key: "description", type: "string" },
      { key: "partsCategory", type: "string" },
      { key: "brand", type: "string" },
      { key: "condition", type: "string" },
      { key: "compatibility", type: "array" },
      { key: "salePrice", type: "number" },
    ],
    wanted: [
      { key: "vehicleType", type: "string" },
      { key: "make", type: "string" },
      { key: "model", type: "string" },
      { key: "year", type: "number" },
      { key: "fuelType", type: "string" },
      { key: "transmission", type: "string" },
      { key: "maxBudget", type: "number" },
      { key: "preferred_locations", type: "array" },
      { key: "description", type: "string" },
    ],
  },

  /** PET CATEGORY **/
  pet: {
    adoption: [
      { key: "petName", type: "string" },
      { key: "petType", type: "string" },
      { key: "breed", type: "string" },
      { key: "age", type: "string" },
      { key: "gender", type: "string" },
      { key: "vaccination", type: "string" },
      { key: "size", type: "string" },
      { key: "price", type: "number" },
      { key: "description", type: "string" },
    ],
    wanted: [
      { key: "wantedPetType", type: "string" },
      { key: "breedPreference", type: "string" },
      { key: "agePreference", type: "string" },
      { key: "genderPreference", type: "string" },
      { key: "sizePreference", type: "string" },
      { key: "budget", type: "number" },
      { key: "description", type: "string" },
    ],
    accessories: [
      { key: "accessoryName", type: "string" },
      { key: "partsCategory", type: "string" },
      { key: "brand", type: "string" },
      { key: "condition", type: "string" },
      { key: "salePrice", type: "number" },
      { key: "description", type: "string" },
    ],
    lostfound: [
      { key: "reportType", type: "string" },
      { key: "petType", type: "string" },
      { key: "breed", type: "string" },
      { key: "color", type: "string" },
      { key: "age", type: "string" },
      { key: "lastSeenLocation", type: "string" },
      { key: "date", type: "date" },
      { key: "description", type: "string" },
    ],
    services: [
      { key: "serviceType", type: "string" },
      { key: "petType", type: "string" },
      { key: "serviceProviderName", type: "string" },
      { key: "experience", type: "number" },
      { key: "location", type: "string" },
      { key: "availability", type: "string" },
      { key: "price", type: "number" },
      { key: "description", type: "string" },
    ],
  },

  /** SERVICES CATEGORY **/
  services: {
    education: [
      { key: "educationType", type: "string" },
      { key: "subject", type: "string" },
      { key: "mode", type: "string" },           // online/offline/both
      { key: "qualification", type: "string" },
      { key: "experience", type: "number" },
      { key: "availability", type: "string" },
      { key: "price", type: "number" },
      { key: "description", type: "string" },
    ],
    food: [
      { key: "serviceType", type: "string" },    // home-cooked/tiffin/etc.
      { key: "cuisineType", type: "string" },
      { key: "dietaryOptions", type: "array" },  // Vegetarian, Vegan, etc.
      { key: "price", type: "number" },
      { key: "deliveryAvailable", type: "string" }, // yes/no (or use boolean if you prefer)
      { key: "description", type: "string" },
    ],
    health: [
      { key: "serviceType", type: "string" },
      { key: "providerName", type: "string" },
      { key: "qualification", type: "string" },
      { key: "experience", type: "number" },
      { key: "consultationMode", type: "string" }, // Online/In-person/Both
      { key: "price", type: "number" },            // from consultationFee
      { key: "availability", type: "string" },
      { key: "description", type: "string" },
    ],
    home: [
      { key: "serviceType", type: "string" },   // cleaning/plumbing/etc.
      { key: "experience", type: "number" },
      { key: "availability", type: "string" },
      { key: "price", type: "number" },         // from serviceCharge
      { key: "description", type: "string" },
    ],
    other: [
      { key: "serviceType", type: "string" },
      { key: "price", type: "number" },
      { key: "availability", type: "string" },
      { key: "description", type: "string" },
    ],
    technology: [
      { key: "serviceType", type: "string" },
      { key: "skills", type: "array" },         // split CSV in UI/store
      { key: "experience", type: "number" },
      { key: "availability", type: "string" },  // full-time/part-time/etc.
      { key: "rateType", type: "string" },      // hourly/daily/monthly/project
      { key: "price", type: "number" },         // numeric rate
      { key: "description", type: "string" },
    ],
    travel: [
      { key: "serviceType", type: "string" },   // tour/package/guide/transport
      { key: "destination", type: "string" },
      { key: "packageDetails", type: "string" },
      { key: "duration", type: "string" },
      { key: "price", type: "number" },
      { key: "availability", type: "string" },
      { key: "agencyName", type: "string" },
      { key: "description", type: "string" },
    ],
    tutoring: [
      { key: "subject", type: "string" },
      { key: "level", type: "string" },         // primary/secondary/etc.
      { key: "mode", type: "string" },
      { key: "qualification", type: "string" },
      { key: "experience", type: "number" },
      { key: "availability", type: "string" },
      { key: "price", type: "number" },         // map hourlyRate to price in UI
      { key: "description", type: "string" },
    ],
    wanted: [
      { key: "serviceType", type: "string" },
      { key: "budgetAmount", type: "number" },  // numeric budget
      { key: "urgency", type: "string" },       // immediate/within-a-week/flexible
      { key: "description", type: "string" },
    ],
  },

  /** BUSINESS CATEGORY (for Business → Services form) **/
  business: {
    services: [
      { key: "businessType", type: "string" },
      { key: "experience", type: "number" },
      { key: "availability", type: "string" },
      { key: "price", type: "number" },
      { key: "description", type: "string" },
    ],
  },
};

/** ---- FALLBACK OPTIONAL FIELDS ---- **/
const FALLBACK_OPTIONAL_FIELDS: FieldSpec[] = [
  { key: "propertyType", type: "string" },
  { key: "beds", type: "number" },
  { key: "baths", type: "number" },
  { key: "rentPrice", type: "number" },
  { key: "deposit", type: "number" },
  { key: "occupancy", type: "string" },
  { key: "gender_pref", type: "string" },
  { key: "facilities", type: "array" },
  { key: "amenities", type: "array" },
  // common service fallbacks, just in case
  { key: "availability", type: "string" },
  { key: "price", type: "number" },
];

export function buildPostFormData(data: StoreState) {
  const fd = new FormData();

  // --- Required core fields ---
  fd.append("category", data.category || "");
  fd.append("subcategory", data.subcategory || "");
  fd.append("name", data.name || "");
  fd.append("description", data.description || "");

  // --- Nested/location & contact ---
  fd.append("locationData", JSON.stringify(data.location || {}));
  fd.append("seller_info.name", data.sellerInfo?.name || "");
  fd.append("seller_info.email", data.sellerInfo?.email || "");
  fd.append("seller_info.phone", data.sellerInfo?.phone || "");

  // --- Images: files and/or URLs ---
  (data.images || []).forEach((img, i) => {
    if (img instanceof File) {
      fd.append("images", img, img.name || `image-${i}.jpg`);
    } else if (typeof img === "string") {
      fd.append("imageUrl", img);
    }
  });

  // --- Category-specific optional fields ---
  const normCat = normalizeCategory(data.category);
  const normSub = normalizeSubcategory(data.subcategory);
  const spec = CATEGORY_CONFIG[normCat]?.[normSub];

  const applySpec = (fields?: FieldSpec[]) => {
    if (!fields) return;
    for (const field of fields) {
      const value = (data as any)[field.key];
      if (value === undefined || value === null || value === "") continue;

      if (field.type === "array") {
        fd.append(field.key, JSON.stringify(value));
      } else {
        // string | number | date | boolean → send as string; server parses as needed
        fd.append(field.key, String(value));
      }
    }
  };

  // 1) Apply specific config (if exists)
  applySpec(spec);

  // 2) Also apply general fallback
  applySpec(FALLBACK_OPTIONAL_FIELDS);

  return fd;
}
