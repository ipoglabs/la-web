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

type FieldSpec =
  | { key: string; type: 'string' | 'number' }
  | { key: string; type: 'array' };

type CategoryConfig = Record<
  string,   // normalized category, e.g. "property"
  Record<
    string, // normalized subcategory (lowercase), e.g. "commercial"
    FieldSpec[]
  >
>;

/** ---- NORMALIZERS ---- **/
export function normalizeCategory(uiCategory: string) {
  const m: Record<string, string> = {
    Property: 'property',
    Jobs: 'job',
    Vehicles: 'vehicles',
    Services: 'services',
    Pets: 'pet',
    'For Sale': 'forsale',
    Business: 'business',
    'Community & Events': 'community',
    'Special Offers': 'specialOffers',
  };
  const key = (uiCategory ?? '').trim();
  return m[key] || key.toLowerCase();
}

export function normalizeSubcategory(sub: string) {
  const raw = (sub ?? '').trim().toLowerCase();
  const aliases: Record<string, string> = {
    'for students': 'for students',
    'room rental': 'room rental',
    'to buy': 'to buy',
    'to rent': 'to rent',
    'commercial': 'commercial',
    "for sale": "for sale",
    "to wanted": "to wanted",
    "holiday rental": "holiday rental",
    'land for sale/lease': 'land for sale/lease',
    'full time': 'full time',
    'part time': 'part time',
  };
  return aliases[raw] || raw;
}

/** ---- PER-SUBCATEGORY CONFIG (keys are LOWERCASE) ---- **/
export const CATEGORY_CONFIG: CategoryConfig = {
  property: {
    'for students': [
      { key: 'propertyType', type: 'string' },
      { key: 'beds', type: 'number' },
      { key: 'baths', type: 'number' },
      { key: 'rentPrice', type: 'number' },
      { key: 'deposit', type: 'number' },
      { key: 'occupancy', type: 'string' },
      { key: 'gender_pref', type: 'string' },
      { key: 'facilities', type: 'array' },
    ],
    'room rental': [
      { key: 'type', type: 'string' },
      { key: 'rent', type: 'number' },
      { key: 'deposit', type: 'number' },
      { key: 'available_from', type: 'string' },
      { key: 'preferred_tenants', type: 'string' },
      { key: 'gender_pref', type: 'string' },
      { key: 'amenities', type: 'array' },
      { key: 'rules', type: 'array' },
    ],
    'to buy': [
      { key: 'budget', type: 'number' },
      { key: 'propertyType', type: 'string' },
      { key: 'preferred_locations', type: 'array' },
    ],
    'commercial': [
      { key: 'propertyType', type: 'string' },
      { key: 'builtup_area', type: 'number' },
      { key: 'carpet_area', type: 'number' },
      { key: 'floor', type: 'number' },
      { key: 'totalFloors', type: 'number' },
      { key: 'furnishing', type: 'string' },
      { key: 'washrooms', type: 'number' },
      { key: 'pantry', type: 'string' },
      { key: 'parkingSpaces', type: 'number' },
      { key: 'rentPrice', type: 'number' },
      { key: 'deposit', type: 'number' },
      { key: 'maintenance', type: 'number' },
      { key: 'available_from', type: 'string' },
      { key: 'leaseTerm', type: 'number' },
      { key: 'powerBackup', type: 'string' },
      { key: 'facilities', type: 'array' },
      { key: 'amenities', type: 'array' }, // include if you collect them
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

     'for sale': [
      { key: 'propertyType', type: 'string' },
      { key: 'salePrice', type: 'number' },
      { key: 'negotiable', type: 'string' },
      { key: 'builtup_area', type: 'number' },
      { key: 'carpet_area', type: 'number' },
      { key: 'plot_area', type: 'number' },
      { key: 'beds', type: 'number' },
      { key: 'baths', type: 'number' },
      { key: 'ownership', type: 'string' },
      { key: 'age', type: 'string' },
      { key: 'amenities', type: 'array' },
    ],

    
  'to wanted': [
    { key: 'propertyType', type: 'string' },
    // if you prefer one number, keep { key: 'budget', type: 'number' } instead
    { key: 'minBudget', type: 'number' },
    { key: 'maxBudget', type: 'number' },

    { key: 'minArea', type: 'number' },
    { key: 'beds', type: 'number' },
    { key: 'baths', type: 'number' },

    { key: 'preferred_locations', type: 'array' },
    { key: 'amenities', type: 'array' },
  ],
  },

  job: {
     "full time": [
      { key: "jobType", type: "string" },   // "Full Time"
      { key: "company", type: "string" },
      { key: "salary", type: "number" },
      { key: "experience", type: "string" },
      { key: "skills", type: "array" },
      { key: "benefits", type: "array" },
      { key: "workMode", type: "string" },  // Onsite/Hybrid/Remote
    ],
    'part time': [
      { key: 'company', type: 'string' },
      { key: 'hourlyRate', type: 'number' },
      { key: 'shifts', type: 'array' },
      { key: 'workMode', type: 'string' },
      // optional:
      { key: 'employmentType', type: 'string' },
      { key: 'applyLink', type: 'string' },
      { key: 'deadline', type: 'string' },
    ],
    'internship': [
      { key: 'company', type: 'string' },
      { key: 'workMode', type: 'string' },
      { key: 'duration', type: 'string' },
      { key: 'startDate', type: 'string' },
      { key: 'stipendType', type: 'string' }, // unpaid | stipend | salary
      { key: 'stipend', type: 'number' },     // amount if stipend/salary
      { key: 'skills', type: 'array' },
      { key: 'employmentType', type: 'string' }, // "Internship"
      { key: 'applyLink', type: 'string' },
    ],

    'freelance': [
      { key: 'company', type: 'string' },
      { key: 'workMode', type: 'string' },
      { key: 'projectType', type: 'string' },
      { key: 'duration', type: 'string' },
      { key: 'budgetType', type: 'string' },   // fixed | hourly
      { key: 'budgetAmount', type: 'number' }, // amount / hourly rate
      { key: 'skills', type: 'array' },
      { key: 'employmentType', type: 'string' }, // "Freelance"
      { key: 'applyLink', type: 'string' },
    ],

     'temporary': [
      { key: 'company', type: 'string' },
      { key: 'workMode', type: 'string' },
      { key: 'workingHours', type: 'string' },
      { key: 'startDate', type: 'string' },
      { key: 'endDate', type: 'string' },
      { key: 'salary', type: 'number' },
      { key: 'skills', type: 'array' },
      { key: 'employmentType', type: 'string' }, // preset "Temporary"
      // add "applyLink" here if you add that field to the UI later
    ],

     "wanted": [
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
    'car': [
      { key: 'make', type: 'string' },
      { key: 'model', type: 'string' },
      { key: 'year', type: 'number' },
      { key: 'kms', type: 'number' },
      { key: 'features', type: 'array' },
      { key: 'price', type: 'number' },
    ],
  },
};

/** ---- FALLBACK OPTIONAL FIELDS ---- **/
const FALLBACK_OPTIONAL_FIELDS: FieldSpec[] = [
  { key: 'propertyType', type: 'string' },
  { key: 'beds', type: 'number' },
  { key: 'baths', type: 'number' },
  { key: 'rentPrice', type: 'number' },
  { key: 'deposit', type: 'number' },
  { key: 'occupancy', type: 'string' },
  { key: 'gender_pref', type: 'string' },
  { key: 'facilities', type: 'array' },
  { key: 'amenities', type: 'array' }, // added so it always flows through
];

export function buildPostFormData(data: StoreState) {
  const fd = new FormData();

  // --- Required core fields ---
  fd.append('category', data.category || '');
  fd.append('subcategory', data.subcategory || '');
  fd.append('name', data.name || '');
  fd.append('description', data.description || '');

  // --- Nested/location & contact ---
  fd.append('locationData', JSON.stringify(data.location || {}));
  fd.append('seller_info.name', data.sellerInfo?.name || '');
  fd.append('seller_info.email', data.sellerInfo?.email || '');
  fd.append('seller_info.phone', data.sellerInfo?.phone || '');

  // --- Images: files and/or URLs ---
  (data.images || []).forEach((img, i) => {
    if (img instanceof File) {
      fd.append('images', img, img.name || `image-${i}.jpg`);
    } else if (typeof img === 'string') {
      fd.append('imageUrl', img);
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
      if (value === undefined || value === null || value === '') continue;

      if (field.type === 'array') {
        fd.append(field.key, JSON.stringify(value));
      } else {
        fd.append(field.key, String(value)); // server converts numbers back
      }
    }
  };

  // 1) Apply specific config (if exists)
  applySpec(spec);

  // 2) Also apply general fallback
  applySpec(FALLBACK_OPTIONAL_FIELDS);

  return fd;
}
