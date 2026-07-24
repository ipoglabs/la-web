// Example: app/api/listings/route.ts
// Shows the pattern — every server-side entry point (route handler, server
// action, or getServerSideProps-equivalent) calls dbConnect() first, then
// uses the Mongoose models normally.

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db"; // your real connection helper
import Listing from "@/lib/db/models/Listing";
import { Country, Category } from "@/lib/db/models/constants";

export async function GET(req: NextRequest) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const country = searchParams.get("country") as Country | null;
  const category = searchParams.get("category") as Category | null;
  const subcategory = searchParams.get("subcategory");
  const page = Number(searchParams.get("page") ?? "1");
  const limit = Number(searchParams.get("limit") ?? "20");

  if (!country || !category) {
    return NextResponse.json(
      { error: "country and category are required" },
      { status: 400 }
    );
  }

  const filter: Record<string, unknown> = { country, category, status: "active" };
  if (subcategory) filter.subcategory = subcategory;

  const [listings, total] = await Promise.all([
    Listing.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Listing.countDocuments(filter),
  ]);

  return NextResponse.json({ listings, total, page, limit });
}

// This is the direct replacement for lib/mock/country-map.ts's
// getListingsForMarket(country, category, subcategory) — same call shape,
// just backed by Mongo instead of an in-memory array. getFeaturedForMarket(),
// getSimilarListings(), and resolveListingContext() become equally small
// Listing.find(...) queries once you wire this in; happy to write those too.