/**
 * models/SearchEvent.ts
 *
 * Append-only log — one document per search submission (guest or signed-in).
 * Deliberately thin; exists only to feed the nightly popular-search
 * aggregation (lib/jobs/popular-search.job.ts), not for user-facing display.
 * See md/features/popular-searches.md Section 3.1.
 */

import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISearchEvent extends Document {
  keyword: string;
  category?: string;
  country: string;
  city?: string;
  searchedAt: Date;
}

const SearchEventSchema = new Schema<ISearchEvent>(
  {
    keyword: { type: String, required: true, trim: true },
    category: { type: String, trim: true },
    country: { type: String, required: true, uppercase: true, trim: true },
    city: { type: String, trim: true },
    searchedAt: { type: Date, required: true, default: Date.now },
  },
  { timestamps: false },
);

// Covers the nightly aggregation query (group by country/city, filter by
// searchedAt window) and the retention prune (searchedAt cutoff).
SearchEventSchema.index({ country: 1, city: 1, searchedAt: -1 });

const SearchEvent: Model<ISearchEvent> =
  mongoose.models.SearchEvent ?? mongoose.model<ISearchEvent>("SearchEvent", SearchEventSchema);

export default SearchEvent;
