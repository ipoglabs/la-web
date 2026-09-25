/**
 * models/PostFormSchema.ts
 *
 * DB-driven post-ad form definitions. One document per
 * (category, subcategory, country) — e.g. ("Property", "To Rent", "IN").
 * Served by app/api/post-form-schema/route.ts and rendered by
 * app/(main)/post/details/DynamicPostForm.tsx. Seed/refresh with
 * scripts/seed-post-form-schemas.ts. Shape: posting/form-schema/types.ts.
 */

import mongoose, { Schema, Document, Model } from "mongoose";
import type { FormFieldDef, FormSection } from "@/posting/form-schema/types";

export interface IPostFormSchema extends Document {
  category: string;
  subcategory: string;
  country: string;
  version: number;
  active: boolean;
  sections: FormSection[];
  createdAt: Date;
  updatedAt: Date;
}

const OptionSchema = new Schema(
  {
    value: { type: String, required: true },
    label: { type: String, required: true },
  },
  { _id: false },
);

const FieldSchema = new Schema<FormFieldDef>(
  {
    key: { type: String, required: true, trim: true },
    type: {
      type: String,
      required: true,
      enum: ["text", "richtext", "textarea", "number", "currency", "date", "select", "multiselect", "tags"],
    },
    label: { type: String, required: true },
    required: Boolean,
    placeholder: String,
    hint: String,
    unit: String,
    options: { type: [OptionSchema], default: undefined },
    min: Number,
    max: Number,
    gteField: String,
    lteField: String,
    maxLength: Number,
    format: { type: String, enum: ["adTitle"] },
    width: { type: String, enum: ["full", "half", "third"] },
  },
  { _id: false },
);

const SectionSchema = new Schema<FormSection>(
  {
    title: String,
    fields: { type: [FieldSchema], default: [] },
  },
  { _id: false },
);

const PostFormSchemaSchema = new Schema<IPostFormSchema>(
  {
    category: { type: String, required: true, trim: true },
    subcategory: { type: String, required: true, trim: true },
    country: { type: String, required: true, uppercase: true, trim: true },
    version: { type: Number, required: true, default: 1 },
    active: { type: Boolean, default: true },
    sections: { type: [SectionSchema], default: [] },
  },
  { timestamps: true },
);

PostFormSchemaSchema.index({ category: 1, subcategory: 1, country: 1 }, { unique: true });

const PostFormSchema: Model<IPostFormSchema> =
  mongoose.models.PostFormSchema ?? mongoose.model<IPostFormSchema>("PostFormSchema", PostFormSchemaSchema);

export default PostFormSchema;
