type GeoDefault = {
  lat: number;
  lng: number;
  address: string;
  countryCode: "IN" | "SG" | "GB";
};

const TIMEZONE_MAP: Record<string, GeoDefault> = {
  "Asia/Kolkata":    { lat: 20.5937,  lng: 78.9629,  address: "India",          countryCode: "IN" },
  "Asia/Calcutta":   { lat: 20.5937,  lng: 78.9629,  address: "India",          countryCode: "IN" },
  "Asia/Singapore":  { lat: 1.3521,   lng: 103.8198, address: "Singapore",      countryCode: "SG" },
  "Europe/London":   { lat: 51.5074,  lng: -0.1278,  address: "London, UK",     countryCode: "GB" },
  "Europe/Belfast":  { lat: 54.5973,  lng: -5.9301,  address: "Belfast, UK",    countryCode: "GB" },
  "Europe/Jersey":   { lat: 49.1880,  lng: -2.1041,  address: "Jersey, UK",     countryCode: "GB" },
  "Europe/Guernsey": { lat: 49.4657,  lng: -2.5853,  address: "Guernsey, UK",   countryCode: "GB" },
  "Europe/Isle_of_Man": { lat: 54.2361, lng: -4.5481, address: "Isle of Man, UK", countryCode: "GB" },
};

const DEFAULT: GeoDefault = {
  lat: 1.3521,
  lng: 103.8198,
  address: "Singapore",
  countryCode: "SG",
};

export function getTimezoneLocation(): GeoDefault {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return TIMEZONE_MAP[tz] ?? DEFAULT;
  } catch {
    return DEFAULT;
  }
}
