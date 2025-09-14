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
  },
  { timestamps: true }
);

const Post =
  mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema);
export default Post;
