/**
 * app/api/search/popular/route.ts
 *
 * GET /api/search/popular?country=IN&city=Mumbai
 *
 * Pure read against the nightly-materialized PopularSearch collection — no
 * aggregation ever runs on the request path (see md/features/popular-searches.md
 * Section 3.5). Falls back city → country → global so a new/low-traffic city
 * inherits its country's ranking, and a brand-new deployment (before the
 * first nightly run) degrades to an empty list rather than an error.
 *
 * Response: 200 { items: { keyword, category?, score, count }[] }
 */

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import PopularSearch from "@/models/PopularSearch";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const country = (searchParams.get("country") ?? "").trim().toUpperCase();
  const city = (searchParams.get("city") ?? "").trim();

  if (!country) {
    return NextResponse.json({ error: "country is required." }, { status: 400 });
  }

  const candidateKeys = [city ? `${country}:${city}` : null, country, "GLOBAL"].filter(
    (k): k is string => Boolean(k),
  );

  try {
    await connectDB();

    for (const locationKey of candidateKeys) {
      const doc = await PopularSearch.findOne({ locationKey }).lean();
      if (doc && doc.items.length > 0) {
        return NextResponse.json({ items: doc.items });
      }
    }
  } catch (err) {
    // Cold-start / no DB configured — degrade to an empty list, same as any
    // other empty-state (RecentSearches.tsx already no-ops on items: []).
    console.error("[api/search/popular] failed to read popular searches:", err);
  }

  return NextResponse.json({ items: [] });
}
