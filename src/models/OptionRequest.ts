/**
 * models/OptionRequest.ts
 *
 * Back-office queue of dropdown values sellers typed that aren't options in
 * their post form (e.g. a car make we don't list) — see CUSTOM_OPTION in
 * posting/form-schema/types.ts. One document per
 * (category, subcategory, country, field, value); every post that uses the
 * value is added to `postIds`. Recorded by addPost / updatePost, reviewed in
 * /admin → Option requests: "added" puts the value into that form's options
 * in `postformschemas` (and sync-form-schema.ts re-applies it after a sync),
 * "dismissed" leaves the form alone — the posts keep the typed value either way.
 */

import mongoose, { Schema, Document, Model, Types } from "mongoose";

export type OptionRequestStatus = "pending" | "added" | "dismissed";

export interface IOptionRequest extends Document {
  category: string;
  subcategory: string;
  country: string;
  fieldKey: string;
  fieldLabel: string;
  /** As the first seller typed it — becomes the option's value and label. */
  value: string;
  /** Lower-cased `value`, so "bmw" and "BMW" are one request. */
  valueKey: string;
  postIds: Types.ObjectId[];
  status: OptionRequestStatus;
  reviewedAt?: Date;
  reviewedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OptionRequestSchema = new Schema<IOptionRequest>(
  {
    category: { type: String, required: true },
    subcategory: { type: String, required: true },
    country: { type: String, required: true },
    fieldKey: { type: String, required: true },
    fieldLabel: { type: String, required: true },
    value: { type: String, required: true, trim: true },
    valueKey: { type: String, required: true },
    postIds: { type: [Schema.Types.ObjectId], default: [] },
    status: { type: String, enum: ["pending", "added", "dismissed"], default: "pending", index: true },
    reviewedAt: Date,
    reviewedBy: String,
  },
  { timestamps: true },
);

OptionRequestSchema.index({ category: 1, subcategory: 1, country: 1, fieldKey: 1, valueKey: 1 }, { unique: true });

const OptionRequest: Model<IOptionRequest> =
  mongoose.models.OptionRequest ?? mongoose.model<IOptionRequest>("OptionRequest", OptionRequestSchema);

export default OptionRequest;
