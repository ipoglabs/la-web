// Server-side schema lookup shared by /api/post-form-schema and the
// addPost / updatePost actions: the active DB document first
// (models/PostFormSchema.ts), else the code defaults, so the form the user
// sees and the rules the server enforces always come from the same place.

import dbConnect from "@/lib/db";
import PostFormSchema from "@/models/PostFormSchema";
import { getDefaultSchema } from "./defaults";
import type { PostFormSchemaData, PostFormSchemaResponse } from "./types";

export async function getPostFormSchema(
  category: string,
  subcategory: string,
  country: string,
): Promise<PostFormSchemaResponse> {
  const cc = country.toUpperCase();

  try {
    await dbConnect();
    const doc = await PostFormSchema.findOne({ category, subcategory, country: cc, active: true })
      .select("category subcategory country version sections -_id")
      .lean<PostFormSchemaData>();
    if (doc) return { schema: doc, source: "db" };
  } catch (err) {
    console.error("[post-form-schema] DB lookup failed, using defaults:", err);
  }

  const fallback = getDefaultSchema(category, subcategory, cc);
  return { schema: fallback, source: fallback ? "default" : "none" };
}
