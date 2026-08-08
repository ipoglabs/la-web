import { NextRequest, NextResponse } from "next/server";
import { parseGoogleAddressComponents } from "@/lib/googlePlaceAddress";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  if (!lat || !lng) {
    return NextResponse.json({ error: "lat and lng required" }, { status: 400 });
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Maps API not configured" }, { status: 500 });
  }

  const res = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return NextResponse.json({ error: "Geocoding failed" }, { status: 502 });
  }

  const data = await res.json();
  const result = (data.results as any[])?.[0];
  const address = result?.formatted_address ?? null;

  // Structured components — used by callers (e.g. LocationPicker's "Current
  // Location" GPS button) that need a real city/state/country breakdown
  // rather than just a display string, since `formatted_address` is often
  // street-level and not reliably splittable by comma. Shared with
  // api/places/details (a searched-and-selected Places pick) so both paths
  // agree on what counts as "city" vs "state".
  const components: { long_name: string; types: string[] }[] = result?.address_components ?? [];
  const parsed = parseGoogleAddressComponents(components, address);

  return NextResponse.json({
    address,
    label: parsed.label || "Current Location",
    sublabel: parsed.sublabel,
    city: parsed.city,
    state: parsed.state,
    country: parsed.country,
  });
}
