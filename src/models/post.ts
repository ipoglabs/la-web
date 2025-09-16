import mongoose, { Schema, Document } from "mongoose";

export interface IPost extends Document {
  name: string;
  description: string;
  images: string[];
  category: string;
  subcategory: string;
  location: {
    address: string;
    lat?: number;
    lng?: number;
  };
  seller_info: {
    name: string;
    phone: string;
    email: string;
  };

  // ===== Optional fields (Property / Commercial / etc.) =====
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

  // Commercial extras
  builtup_area?: number;
  carpet_area?: number;
  floor?: number;
  totalFloors?: number;
  furnishing?: string;
  washrooms?: number;
  pantry?: string;
  parkingSpaces?: number;
  maintenance?: number;
  available_from?: string; // or Date if preferred
  leaseTerm?: number;
  powerBackup?: string;

  // src/models/post.ts (optional additions)
holidayType?: string;
guests?: number;
house_rules?: string[];
rateNightly?: number;
rateWeekly?: number;
rateMonthly?: number;

// Room Rental
  type?: string;                     // ← NEW
  rent?: number;                     // ← NEW
  preferred_tenants?: string;        // ← NEW
  rules?: string[]; 

  // in models/post.ts, under optional fields
minBudget: { type: Number },
maxBudget: { type: Number },
minArea: { type: Number },
preferred_locations: { type: [String], default: [] },

  plot_area?: number;
  negotiable?: string;
  ownership?: string;
  age?: string;

  // ===== Job category fields (covering all subcategories) =====
  company?: string;            // Company / Employer
  clientName?: string;         // For freelance posts if different than company
  jobType?: string;            // Employment type (Full Time, Part Time, Internship, Freelance, Temporary, Contract)
  workMode?: string;           // On-site / Remote / Hybrid
  salary?: number;             // Monthly / annual or expected for Job Wanted
  hourlyRate?: number;         // For hourly roles or freelance
  stipendType?: string;        // internship: "unpaid" | "stipend" | "salary"
  stipendAmount?: number;      // numeric stipend/salary (optional)
  startDate?: string;          // start date
  endDate?: string;            // end date (temporary/contract)
  duration?: string;           // general duration text (internship/freelance)
  contractDuration?: string;   // explicit contract duration (part-time/temporary)
  workingHours?: string;       // shift/hours description
  deadline?: string;           // application deadline (YYYY-MM-DD string)
  applyLink?: string;          // external apply URL
  projectType?: string;        // freelance: web-dev, design, etc.
  budgetType?: string;         // freelance: fixed | hourly
  budgetAmount?: number;       // freelance budget number
  experience?: string;         // "2-4 years", "Fresher", etc.
  skills?: string[];           // normalized as array
  benefits?: string[];         // perks, benefits
  shifts?: string[];           // optional: morning/evening/weekend

  // Job Wanted extras
  candidateName?: string;


  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    images: { type: [String], default: [] },
    category: { type: String, required: true, index: true },
    subcategory: { type: String, required: true, index: true },

    location: {
      address: { type: String, required: true },
      lat: Number,
      lng: Number,
    },

    seller_info: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, required: true },
    },

    // ===== Optional fields =====
    propertyType: { type: String },
    beds: { type: Number },
    baths: { type: Number },
    rentPrice: { type: Number },
    salePrice: { type: Number },
    deposit: { type: Number },
    facilities: { type: [String], default: [] },
    amenities: { type: [String], default: [] },
    occupancy: { type: String },
    gender_pref: { type: String },

    // Commercial extras
    builtup_area: { type: Number },
    carpet_area: { type: Number },
    floor: { type: Number },
    totalFloors: { type: Number },
    furnishing: { type: String },
    washrooms: { type: Number },
    pantry: { type: String },
    parkingSpaces: { type: Number },
    maintenance: { type: Number },
    available_from: { type: String }, // or Date
    leaseTerm: { type: Number },
    powerBackup: { type: String },

    holidayType: { type: String },
guests: { type: Number },
house_rules: { type: [String], default: [] },
rateNightly: { type: Number },
rateWeekly: { type: Number },
rateMonthly: { type: Number },

// Room Rental
    type: String,                     // ← NEW
    rent: Number,                     // ← NEW
    preferred_tenants: String,        // ← NEW
    rules: { type: [String], default: [] }, // ← NEW

    plot_area: { type: Number },
negotiable: { type: String },
ownership: { type: String },
age: { type: String },     

// ===== Job category fields =====
    company: { type: String },
    clientName: { type: String },
    jobType: { type: String },
    workMode: { type: String },
    salary: { type: Number },
    hourlyRate: { type: Number },
    stipendType: { type: String },
    stipendAmount: { type: Number },
    startDate: { type: String },
    endDate: { type: String },
    duration: { type: String },
    contractDuration: { type: String },
    workingHours: { type: String },
    deadline: { type: String },
    applyLink: { type: String },
    projectType: { type: String },
    budgetType: { type: String },
    budgetAmount: { type: Number },
    experience: { type: String },
    skills: { type: [String], default: [] },
    benefits: { type: [String], default: [] },
    shifts: { type: [String], default: [] },

    // Job Wanted
    candidateName: { type: String },
    preferred_locations: { type: [String], default: [] },

  },
  { timestamps: true }
);

const Post =
  mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema);
export default Post;
