// GET /api/post-form-schema?category=Property&subcategory=To%20Rent&country=IN
//
// Serves the DB-driven post form definition (models/PostFormSchema.ts).
// Falls back to the code defaults in posting/form-schema/defaults when the
// DB has no document yet (or no MONGODB_URI locally), and reports which one
// it used in `source`, so the form never breaks before seeding. The same
// lookup backs server-side validation in addPost / updatePost.

import { NextResponse, type NextRequest } from "next/server";
import { getPostFormSchema } from "@/posting/form-schema/getPostFormSchema";
import type { PostFormSchemaResponse } from "@/posting/form-schema/types";

const SUPPORTED_COUNTRIES = new Set(["IN", "GB", "SG"]);

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const category = params.get("category")?.trim() ?? "";
  const subcategory = params.get("subcategory")?.trim() ?? "";
  const country = (params.get("country") ?? "").trim().toUpperCase();

  if (!category || !subcategory || !SUPPORTED_COUNTRIES.has(country)) {
    return NextResponse.json({ error: "category, subcategory and a supported country are required" }, { status: 400 });
  }

  return NextResponse.json<PostFormSchemaResponse>(await getPostFormSchema(category, subcategory, country));
}
