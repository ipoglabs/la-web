/**
 * models/PopularSearch.ts
 *
 * Materialized, ranked popular-searches list — the only thing the read API
 * (app/api/search/popular/route.ts) ever queries. One document per
 * `locationKey` ("IN" | "IN:Mumbai" | "GLOBAL"), upserted nightly by
 * lib/jobs/popular-search.job.ts. Never appended to — always overwritten.
 * See md/features/popular-searches.md Section 3.1.
 */

import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPopularSearchItem {
  keyword: string;
  category?: string;
  score: number;
  count: number;
}

export interface IPopularSearch extends Document {
  locationKey: string;
  items: IPopularSearchItem[];
  computedAt: Date;
}

const PopularSearchItemSchema = new Schema<IPopularSearchItem>(
  {
    keyword: { type: String, required: true, trim: true },
    category: { type: String, trim: true },
    score: { type: Number, required: true },
    count: { type: Number, required: true },
  },
  { _id: false },
);

const PopularSearchSchema = new Schema<IPopularSearch>(
  {
    locationKey: { type: String, required: true, unique: true, trim: true },
    items: { type: [PopularSearchItemSchema], default: [] },
    computedAt: { type: Date, required: true, default: Date.now },
  },
  { timestamps: false },
);

const PopularSearch: Model<IPopularSearch> =
  mongoose.models.PopularSearch ?? mongoose.model<IPopularSearch>("PopularSearch", PopularSearchSchema);

export default PopularSearch;
