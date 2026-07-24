import { Schema, model, models, Types, Document } from "mongoose";
import {
  COUNTRIES,
  CATEGORIES,
  STATUS_VALUES,
  LISTING_TYPE_VALUES,
  Country,
  Category,
  ListingStatus,
  ListingType,
} from "./constants";

/**
 * Denormalized snapshot of the seller, embedded on the listing so cards can
 * render without populating User on every list query. Source of truth is
 * still the User doc — refresh this snapshot when the user's profile changes
 * (e.g. in a post-save hook on User, or a background job).
 */
export interface ISellerSnapshot {
  userId: Types.ObjectId;
  fullName: string; // matches real user.ts's `fullName` field directly
  role: string;
  locality?: string;
  image?: string; // matches real user.ts's `image` field (avatar)
  isEmailVerified: boolean;
  isPrimaryNumberVerified: boolean;
}

const SellerSnapshotSchema = new Schema<ISellerSnapshot>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    fullName: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: ["individual", "business", "agency", "other"], // confirmed from registration validation.ts
    },
    locality: { type: String },
    image: { type: String },
    isEmailVerified: { type: Boolean, default: false },
    isPrimaryNumberVerified: { type: Boolean, default: false },
  },
  { _id: false }
);

export interface IKeyValue {
  key: string;
  value: string;
}

const KeyValueSchema = new Schema<IKeyValue>(
  { key: { type: String, required: true }, value: { type: String, required: true } },
  { _id: false }
);

export interface IListing extends Document {
  _id: Types.ObjectId;
  // Market + taxonomy — these replace the folder structure (in/uk/sg × category)
  country: Country;
  category: Category;
  subcategory: string; // free-form, validated at the app layer per category

  // Thumbnail card fields
  id: string; // human-readable slug, e.g. "prop-rent-01" style but real-data safe
  images: { src: string; alt: string }[];
  priceLabel: string;
  // Free-form — mock data alone produces 70+ distinct suffix strings
  // ("/ session", "(was £80)", "for 24 months", …), so this is display text,
  // not a controlled vocabulary. See constants.ts PRICE_SUFFIXES for the
  // handful of common ones the post-ad form may still offer as presets.
  priceSuffix?: string;
  title: string;
  detailsLabel: string;
  locationLabel: string;
  status: ListingStatus;
  listingType: ListingType;

  // Detail page fields
  advId: string;
  description: string;
  keyDetails: IKeyValue[];
  goodToKnow: IKeyValue[];
  coordinates: { lat: number; lng: number };
  seller: ISellerSnapshot;

  createdAt: Date;
  updatedAt: Date;
}

const ListingSchema = new Schema<IListing>(
  {
    country: { type: String, enum: COUNTRIES, required: true, index: true },
    category: { type: String, enum: CATEGORIES, required: true, index: true },
    subcategory: { type: String, required: true, index: true },

    id: { type: String, required: true, unique: true },
    images: {
      type: [{ src: { type: String, required: true }, alt: { type: String, required: true } }],
      validate: (v: unknown[]) => Array.isArray(v) && v.length >= 1,
    },
    priceLabel: { type: String, required: true },
    priceSuffix: { type: String },
    title: { type: String, required: true, maxlength: 80 },
    detailsLabel: { type: String, required: true },
    locationLabel: { type: String, required: true },
    status: { type: String, enum: STATUS_VALUES, default: "active", index: true },
    listingType: { type: String, enum: LISTING_TYPE_VALUES, default: "offer" },

    advId: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    keyDetails: {
      type: [KeyValueSchema],
      validate: (v: unknown[]) => v.length >= 4 && v.length <= 6,
    },
    goodToKnow: {
      type: [KeyValueSchema],
      validate: (v: unknown[]) => v.length >= 4 && v.length <= 6,
    },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    seller: { type: SellerSnapshotSchema, required: true },
  },
  { timestamps: true }
);

// Compound index for the primary query pattern: browsing a market's category
ListingSchema.index({ country: 1, category: 1, subcategory: 1, status: 1, createdAt: -1 });
// Text index for search (title + description)
ListingSchema.index({ title: "text", description: "text" });

export default models.Listing || model<IListing>("Listing", ListingSchema);