/**
 * lib/models/Alert.ts
 *
 * Mongoose model for user-saved search alerts.
 * The batch runner reads this collection to find alerts to match against live listings.
 */

import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAlert extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  category: string;
  subCategory?: string;
  keywords?: string[];
  location?: string;
  priceMin?: number;
  priceMax?: number;
  frequency: "instant" | "daily" | "weekly";
  notifyVia: string[];                   // ["email"] v1 — placeholder for SMS/WhatsApp
  lastNotifiedAt?: Date;
  lastMatchedListingIds: mongoose.Types.ObjectId[];  // pruned to last 500 entries
  noMatchSince?: Date;                   // set when 0 matches found; used by no-match nudge
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AlertSchema = new Schema<IAlert>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User", index: true },
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true },
    subCategory: { type: String },
    keywords: [{ type: String }],
    location: { type: String },
    priceMin: { type: Number, min: 0 },
    priceMax: { type: Number, min: 0 },
    frequency: {
      type: String,
      required: true,
      enum: ["instant", "daily", "weekly"],
      default: "instant",
    },
    notifyVia: [{ type: String }],
    lastNotifiedAt: { type: Date },
    lastMatchedListingIds: [{ type: Schema.Types.ObjectId }],
    noMatchSince: { type: Date },
    isActive: { type: Boolean, required: true, default: true, index: true },
  },
  { timestamps: true },
);

// Index to efficiently fetch active alerts by frequency during cron runs
AlertSchema.index({ isActive: 1, frequency: 1 });

const Alert: Model<IAlert> =
  mongoose.models.Alert ?? mongoose.model<IAlert>("Alert", AlertSchema);

export default Alert;
