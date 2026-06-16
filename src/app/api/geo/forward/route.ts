import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get("address");

  if (!address?.trim()) {
    return NextResponse.json({ error: "address required" }, { status: 400 });
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Maps API not configured" }, { status: 500 });
  }

  const res = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return NextResponse.json({ error: "Geocoding failed" }, { status: 502 });
  }

  const data = await res.json();
  const result = (data.results as any[])?.[0];
  if (!result) {
    return NextResponse.json({ error: "No results" }, { status: 404 });
  }

  const { lat, lng } = result.geometry.location;
  const formattedAddress: string = result.formatted_address ?? address;

  return NextResponse.json({ lat, lng, address: formattedAddress });
}
