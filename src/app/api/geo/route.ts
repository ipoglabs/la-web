import { NextRequest, NextResponse } from "next/server";

export type GeoResult = {
  lat: number;
  lng: number;
  address: string;
  city: string;
  country: string;
  countryCode: string;
  accuracy: "approximate";
};

async function fromIpinfo(ip: string): Promise<GeoResult | null> {
  const token = process.env.IPINFO_TOKEN;
  const url = token
    ? `https://ipinfo.io/${ip}/json?token=${token}`
    : `https://ipinfo.io/${ip}/json`;

  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) return null;

  const d = await res.json();
  if (!d.loc || d.bogon) return null;

  const [lat, lng] = (d.loc as string).split(",").map(Number);
  const city = d.city ?? "";
  const region = d.region ?? "";
  const country = d.country ?? "";

  return {
    lat,
    lng,
    address: [city, region, country].filter(Boolean).join(", "),
    city,
    country,
    countryCode: country,
    accuracy: "approximate",
  };
}

async function fromIpwho(ip: string): Promise<GeoResult | null> {
  const res = await fetch(`https://ipwho.is/${ip}`, { next: { revalidate: 3600 } });
  if (!res.ok) return null;

  const d = await res.json();
  if (!d.success || typeof d.latitude !== "number") return null;

  const city = d.city ?? "";
  const region = d.region ?? "";
  const country = d.country ?? "";

  return {
    lat: d.latitude,
    lng: d.longitude,
    address: [city, region, country].filter(Boolean).join(", "),
    city,
    country,
    countryCode: d.country_code ?? "",
    accuracy: "approximate",
  };
}


export async function GET(req: NextRequest) {
  const rawIp =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "";

  // Local development — no real IP, let the client fall back to timezone detection
  const isLocal = !rawIp || rawIp === "::1" || rawIp.startsWith("127.");
  if (isLocal) {
    return NextResponse.json(null, { status: 404 });
  }

  try {
    // Race both providers in parallel — first non-null result wins
    const toRace = (p: Promise<GeoResult | null>) =>
      p.then((r) => r ?? Promise.reject(new Error("no result")));

    const result = await Promise.any([
      toRace(fromIpinfo(rawIp)),
      toRace(fromIpwho(rawIp)),
    ]).catch(() => null);

    if (!result) return NextResponse.json(null, { status: 502 });
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(null, { status: 500 });
  }
}
