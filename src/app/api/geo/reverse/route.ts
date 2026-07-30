import { NextRequest, NextResponse } from "next/server";

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
  // street-level and not reliably splittable by comma.
  const components: { long_name: string; types: string[] }[] = result?.address_components ?? [];
  const get = (type: string) =>
    components.find((c) => c.types.includes(type))?.long_name ?? "";

  const neighborhood = get("neighborhood") || get("sublocality_level_1") || get("sublocality");
  const locality = get("locality") || get("postal_town");
  const area = get("administrative_area_level_2"); // district
  const region = get("administrative_area_level_1"); // state
  const country = get("country");

  // label = most specific named place available; sublabel = broader context
  // (skipping any segment that duplicates the label) ending in country —
  // mirrors Google Places Autocomplete's own main_text/secondary_text split
  // so a GPS pick reads exactly as precisely as a searched-and-selected one.
  // `region` (state) is always kept in the chain — every downstream consumer
  // of a LocationValue's sublabel (ResidenceEditor, saved-location mapping)
  // treats its last comma segment as country and everything before it as
  // state, so dropping region here would silently corrupt that field.
  const label = neighborhood || locality || area || region || address || "Current Location";
  const sublabelParts = [
    neighborhood && locality !== label ? locality : null,
    area && area !== label && area !== locality ? area : null,
    region && region !== label ? region : null,
    country,
  ].filter(Boolean);
  const sublabel = sublabelParts.length > 0 ? sublabelParts.join(", ") : undefined;

  return NextResponse.json({
    address,
    label,
    sublabel,
    city: locality || area || null,
    state: region || null,
    country: country || null,
  });
}
