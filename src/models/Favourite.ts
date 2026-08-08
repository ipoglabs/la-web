/**
 * models/Favourite.ts
 *
 * Server-side persistence for the favourites feature. The client-side
 * source of truth is still `lib/stores/favouritesStore.ts` (Zustand +
 * localStorage, works for guests) — this collection is what lets a signed-in
 * user's favourites follow them across devices/sessions. Denormalized
 * display snapshot (image/price/etc.) mirrors `FavItem` exactly so a
 * `getMyFavourites()` read can feed `syncFromServer()` with zero mapping.
 */

import mongoose, { Schema, Document, Model, Types } from "mongoose";
import type { ListingStatus } from "@/types/listing";

export interface IFavourite extends Document {
  userId: Types.ObjectId;
  listingId: string; // matches FavItem.id — resolvePostId() output (adsId or Post._id string)
  image: { src: string; alt?: string };
  priceLabel: string;
  priceSuffix?: string;
  title: string;
  detailsLabel: string;
  locationLabel: string;
  postedAt: number; // unix ms, matches FavItem
  status?: ListingStatus;
  createdAt: Date;
}

const FavouriteSchema = new Schema<IFavourite>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    listingId: { type: String, required: true, index: true },
    image: {
      src: { type: String, required: true },
      alt: { type: String },
    },
    priceLabel: { type: String, required: true },
    priceSuffix: { type: String },
    title: { type: String, required: true },
    detailsLabel: { type: String, default: "" },
    locationLabel: { type: String, default: "" },
    postedAt: { type: Number, required: true },
    status: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// One favourite per (user, listing) — addFavourite upserts against this.
FavouriteSchema.index({ userId: 1, listingId: 1 }, { unique: true });

const Favourite: Model<IFavourite> =
  mongoose.models.Favourite ?? mongoose.model<IFavourite>("Favourite", FavouriteSchema);

export default Favourite;
