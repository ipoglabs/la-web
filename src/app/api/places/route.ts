/**
 * /api/places — Google Places Autocomplete proxy
 *
 * Keeps the Google API key server-side only (never exposed to the browser).
 *
 * SETUP:
 *   1. Uses the same key as GOOGLE_MAPS_API_KEY (geo/reverse, geo/forward routes) —
 *      just make sure Places API is enabled for it in Google Cloud Console,
 *      alongside Geocoding API.
 *   2. This route accepts: GET /api/places?input=<query>
 *   3. In LocationSearch.tsx uncomment realGoogleSearch() and
 *      replace the mockGoogleSearch() call with it.
 *
 * USAGE (from LocationSearch):
 *   const res = await fetch(`/api/places?input=${encodeURIComponent(query)}`);
 *   const data = await res.json();
 *   // data.predictions → array of normalised SearchSuggestion
 */

import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getClientIp, rateLimitResponse } from "@/lib/rate-limit";

const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

// Tighter than the other public routes — each request forwards to a paid
// external API, so abuse here has a direct cost, not just a load concern.
const RATE_LIMIT = 15;
const RATE_WINDOW_MS = 60_000;

export async function GET(req: NextRequest) {
  const ip = getClientIp(req);
  if (!checkRateLimit(`places:${ip}`, RATE_LIMIT, RATE_WINDOW_MS)) {
    return rateLimitResponse(60);
  }

  const input = req.nextUrl.searchParams.get("input");

  if (!input || input.trim().length < 2) {
    return NextResponse.json({ predictions: [] });
  }

  if (!GOOGLE_API_KEY) {
    return NextResponse.json(
      { error: "GOOGLE_MAPS_API_KEY is not configured in environment variables." },
      { status: 500 }
    );
  }

  const url = new URL("https://maps.googleapis.com/maps/api/place/autocomplete/json");
  url.searchParams.set("input", input);
  url.searchParams.set("key", GOOGLE_API_KEY);
  url.searchParams.set("types", "(cities)"); // restrict to cities — remove for full address search

  const googleRes = await fetch(url.toString());

  if (!googleRes.ok) {
    return NextResponse.json({ error: "Google Places API error" }, { status: 502 });
  }

  const raw = await googleRes.json();

  // Normalise to the shape LocationSearch expects
  const predictions = (raw.predictions ?? []).map((p: {
    place_id: string;
    structured_formatting: { main_text: string; secondary_text: string };
  }) => ({
    label: p.structured_formatting.main_text,
    sublabel: p.structured_formatting.secondary_text,
    placeId: p.place_id,
    // lat/lng not available from autocomplete — fetch via Place Details if needed:
    // GET /api/places/details?placeId=<id>
  }));

  return NextResponse.json({ predictions });
}