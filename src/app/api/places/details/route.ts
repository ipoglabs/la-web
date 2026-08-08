/**
 * /api/places/details — Google Place Details proxy
 *
 * Autocomplete (api/places/route.ts) only returns a free-text label/sublabel
 * pair — good enough for search, but not for anything that persists a real
 * city/state/country (e.g. profile residence, saved locations). This route
 * resolves a placeId from an Autocomplete pick into the same structured
 * address_components breakdown api/geo/reverse already produces for GPS
 * picks, via the shared parseGoogleAddressComponents helper — so both paths
 * agree on what counts as "city" vs "state" instead of a caller guessing by
 * splitting the display sublabel on commas (which breaks for POI results
 * like an airport, where the sublabel is the *locality*, not the state).
 *
 * USAGE: GET /api/places/details?placeId=<id>
 */

import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getClientIp, rateLimitResponse } from "@/lib/rate-limit";
import { parseGoogleAddressComponents } from "@/lib/googlePlaceAddress";

const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

// Same tighter budget as api/places/route.ts — each request forwards to a
// paid external API.
const RATE_LIMIT = 15;
const RATE_WINDOW_MS = 60_000;

export async function GET(req: NextRequest) {
  const ip = getClientIp(req);
  if (!checkRateLimit(`places-details:${ip}`, RATE_LIMIT, RATE_WINDOW_MS)) {
    return rateLimitResponse(60);
  }

  const placeId = req.nextUrl.searchParams.get("placeId");
  if (!placeId) {
    return NextResponse.json({ error: "placeId required" }, { status: 400 });
  }

  if (!GOOGLE_API_KEY) {
    return NextResponse.json(
      { error: "GOOGLE_MAPS_API_KEY is not configured in environment variables." },
      { status: 500 }
    );
  }

  const url = new URL("https://maps.googleapis.com/maps/api/place/details/json");
  url.searchParams.set("place_id", placeId);
  url.searchParams.set("fields", "address_component,formatted_address,geometry");
  url.searchParams.set("key", GOOGLE_API_KEY);

  const googleRes = await fetch(url.toString());
  if (!googleRes.ok) {
    return NextResponse.json({ error: "Google Place Details API error" }, { status: 502 });
  }

  const data = await googleRes.json();
  const result = data.result;
  if (!result) {
    return NextResponse.json({ error: "No result" }, { status: 404 });
  }

  const parsed = parseGoogleAddressComponents(result.address_components ?? [], result.formatted_address);
  const location = result.geometry?.location as { lat?: number; lng?: number } | undefined;

  return NextResponse.json({
    label: parsed.label,
    sublabel: parsed.sublabel,
    city: parsed.city,
    state: parsed.state,
    country: parsed.country,
    lat: location?.lat,
    lng: location?.lng,
  });
}
