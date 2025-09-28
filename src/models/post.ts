// src/models/post.ts
import mongoose, {
  Schema,
  models,
  model,
  type HydratedDocument,
  type Model,
} from "mongoose";

export interface IPost {
  name: string;
  description: string;
  images: string[];
  category: string;
  subcategory: string;

  location?: {
    address?: string;
    lat?: number;
    lng?: number;
  };

  seller_info: {
    name: string;
    phone: string;
    email: string;
  };

  /** ===== Property / Rental / Commercial ===== */
  propertyType?: string;
  beds?: number;
  baths?: number;
  rentPrice?: number;
  salePrice?: number;
  deposit?: number;
  facilities?: string[];
  amenities?: string[];
  occupancy?: string;
  gender_pref?: string;

  builtup_area?: number;
  carpet_area?: number;
  floor?: number;
  totalFloors?: number;
  furnishing?: string;
  washrooms?: number;
  pantry?: string;
  parkingSpaces?: number;
  maintenance?: number;
  available_from?: string;
  leaseTerm?: number;
  powerBackup?: string;

  holidayType?: string;
  guests?: number;
  house_rules?: string[];
  rateNightly?: number;
  rateWeekly?: number;
  rateMonthly?: number;

  type?: string;
  rent?: number;
  preferred_tenants?: string;
  rules?: string[];

  plot_area?: number;
  negotiable?: string;
  ownership?: string;
  age?: string;

  /** Search constraints (Wanted posts) */
  minBudget?: number;
  maxBudget?: number;
  minArea?: number;
  preferred_locations?: string[];

  /** ===== Jobs ===== */
  company?: string;
  clientName?: string;
  jobType?: string;
  workMode?: string;
  salary?: number;
  hourlyRate?: number;
  stipendType?: string;
  stipendAmount?: number;
  startDate?: string;
  endDate?: string;
  duration?: string;
  contractDuration?: string;
  workingHours?: string;
  deadline?: string;
  applyLink?: string;
  projectType?: string;
  budgetType?: string;
  budgetAmount?: number;
  experience?: string;
  skills?: string[];
  benefits?: string[];
  shifts?: string[];
  candidateName?: string;

  /** ===== Vehicles ===== */
  make?: string;
  model?: string;
  year?: number;
  kms?: number;
  fuelType?: string;
  transmission?: string;
  bodyType?: string;
  color?: string;
  condition?: string;
  ownerType?: string;
  registrationNumber?: string;
  insuranceValidTill?: string;
  serviceHistory?: string;
  features?: string[];

  /** ===== Pets ===== */
  // Adoption
  petName?: string;
  petType?: string;
  breed?: string;
  ageText?: string;
  gender?: string;
  vaccination?: string;
  size?: string;
  // Wanted
  wantedPetType?: string;
  breedPreference?: string;
  agePreference?: string;
  genderPreference?: string;
  sizePreference?: string;
  budget?: number;
  // Accessories
  accessoryName?: string;
  partsCategory?: string;
  // Lost & Found
  reportType?: string;
  lastSeenLocation?: string;
  lfDate?: string;
  // Services
  serviceType?: string;
  serviceProviderName?: string;
  availability?: string;

  /** ===== Services (new blocks) ===== */
  // Education
  educationType?: string;   // tutoring | coaching | online | school | language | professional
  subject?: string;
  mode?: string;            // online | offline | both
  qualification?: string;
  price?: number;           // generalized numeric price/fee

  // Food
  cuisineType?: string;
  dietaryOptions?: string[];    // Vegetarian, Vegan, Gluten-Free…
  deliveryAvailable?: string;   // yes | no

  // Health
  providerName?: string;
  consultationMode?: string;    // online | in-person | both

  // Home
  // reuse: serviceType | experience | availability | price

  // Other
  // reuse: serviceType | availability | price

  // Technology
  rateType?: string;            // hourly | daily | monthly | project | negotiable

  // Travel
  destination?: string;
  packageDetails?: string;
  agencyName?: string;
  durationText?: string;        // keep free text like "5D/4N" if you prefer

  // Tutoring
  level?: string;               // primary | secondary | higher-secondary | college | competitive

  // Service → Wanted
  urgency?: string;

  /** timestamps (added by Mongoose) */
  createdAt?: Date;
  updatedAt?: Date;
}

export type IPostDoc = HydratedDocument<IPost>;

const PostSchema = new Schema<IPost>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    images: { type: [String], default: [] },
    category: { type: String, required: true, index: true },
    subcategory: { type: String, required: true, index: true },

    // location is now optional to match forms that omit it
    location: {
      address: { type: String }, // removed `required: true`
      lat: Number,
      lng: Number,
    },

    seller_info: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, required: true },
    },

    /** ===== Property ===== */
    propertyType: String,
    beds: Number,
    baths: Number,
    rentPrice: Number,
    salePrice: Number,
    deposit: Number,
    facilities: { type: [String], default: [] },
    amenities: { type: [String], default: [] },
    occupancy: String,
    gender_pref: String,

    // Commercial
    builtup_area: Number,
    carpet_area: Number,
    floor: Number,
    totalFloors: Number,
    furnishing: String,
    washrooms: Number,
    pantry: String,
    parkingSpaces: Number,
    maintenance: Number,
    available_from: String,
    leaseTerm: Number,
    powerBackup: String,

    // Holiday
    holidayType: String,
    guests: Number,
    house_rules: { type: [String], default: [] },
    rateNightly: Number,
    rateWeekly: Number,
    rateMonthly: Number,

    // Room Rental
    type: String,
    rent: Number,
    preferred_tenants: String,
    rules: { type: [String], default: [] },

    plot_area: Number,
    negotiable: String,
    ownership: String,
    age: String,

    // Search constraints
    minBudget: Number,
    maxBudget: Number,
    minArea: Number,
    preferred_locations: { type: [String], default: [] },

    /** ===== Jobs ===== */
    company: String,
    clientName: String,
    jobType: String,
    workMode: String,
    salary: Number,
    hourlyRate: Number,
    stipendType: String,
    stipendAmount: Number,
    startDate: String,
    endDate: String,
    duration: String,
    contractDuration: String,
    workingHours: String,
    deadline: String,
    applyLink: String,
    projectType: String,
    budgetType: String,
    budgetAmount: Number,
    experience: String,
    skills: { type: [String], default: [] },
    benefits: { type: [String], default: [] },
    shifts: { type: [String], default: [] },

    candidateName: String,

    /** ===== Vehicles ===== */
    make: String,
    model: String,
    year: Number,
    kms: Number,
    fuelType: String,
    transmission: String,
    bodyType: String,
    color: String,
    condition: String,
    ownerType: String,
    registrationNumber: String,
    insuranceValidTill: String,
    serviceHistory: String,
    features: { type: [String], default: [] },

    /** ===== Pets ===== */
    // Adoption
    petName: String,
    petType: String,
    breed: String,
    ageText: String,
    gender: String,
    vaccination: String,
    size: String,
    // Wanted
    wantedPetType: String,
    breedPreference: String,
    agePreference: String,
    genderPreference: String,
    sizePreference: String,
    budget: Number,
    // Accessories
    accessoryName: String,
    partsCategory: String,
    // Lost & Found
    reportType: String,
    lastSeenLocation: String,
    lfDate: String,
    // Services
    serviceType: String,
    serviceProviderName: String,
    availability: String,

    /** ===== Services (new blocks) ===== */
    // Education
    educationType: String,
    subject: String,
    mode: String,
    qualification: String,
    price: Number,

    // Food
    cuisineType: String,
    dietaryOptions: { type: [String], default: [] },
    deliveryAvailable: String,

    // Health
    providerName: String,
    consultationMode: String,

    // Technology
    rateType: String,

    // Travel
    destination: String,
    packageDetails: String,
    agencyName: String,
    durationText: String,

    // Tutoring
    level: String,

    // Service wanted
    urgency: String,
  },
  { timestamps: true }
);

const Post: Model<IPost> =
  (models.Post as Model<IPost>) || model<IPost>("Post", PostSchema);

export type PostModel = typeof Post;
export type { IPost as PostDTO };
export default Post;
