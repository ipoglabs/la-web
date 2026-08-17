/**
 * lib/geo.ts
 *
 * Haversine great-circle distance for the listings search's "near me"
 * radius filter + distance sort. Every Listing/MockListing already carries
 * `coordinates: {lat, lng}` (see mapPostToListing.ts, which defaults to the
 * post's country center when a real post has no location set), so filtering
 * and sorting by distance needs no null-coordinate handling on the item side.
 */

const EARTH_RADIUS_KM = 6371;
const KM_PER_MILE = 1.609344;

export type RadiusUnit = "km" | "mi";

function toRadians(deg: number): number {
  return (deg * Math.PI) / 180;
}

/** Great-circle distance between two lat/lng points, in kilometers. */
export function distanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) ** 2;
  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function toKm(radius: number, unit: RadiusUnit): number {
  return unit === "mi" ? radius * KM_PER_MILE : radius;
}

/** Parses a URL search param into a finite number, or null. */
export function parseCoord(raw: string | null | undefined): number | null {
  if (!raw) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

interface HasCoordinates {
  coordinates: { lat: number; lng: number };
}

/**
 * Filters to items within `radiusKm` of (lat, lng). No-op — returns items
 * unchanged — unless lat, lng, AND radiusKm are all present, so a bare
 * "near me" point with no chosen radius (LocationPicker's lat/lng-only
 * state) constrains nothing, only informs sortByDistance below.
 */
export function filterByRadius<T extends HasCoordinates>(
  items: T[],
  lat: number | null,
  lng: number | null,
  radiusKm: number | null,
): T[] {
  if (lat == null || lng == null || radiusKm == null) return items;
  return items.filter((item) => distanceKm(lat, lng, item.coordinates.lat, item.coordinates.lng) <= radiusKm);
}

/** Ascending distance from (lat, lng) — nearest first. */
export function sortByDistance<T extends HasCoordinates>(items: T[], lat: number, lng: number): T[] {
  return [...items].sort(
    (a, b) =>
      distanceKm(lat, lng, a.coordinates.lat, a.coordinates.lng) -
      distanceKm(lat, lng, b.coordinates.lat, b.coordinates.lng),
  );
}

export interface GeoParams {
  lat: number | null;
  lng: number | null;
  /** Radius already normalized to km, regardless of the request's `unit`. */
  radiusKm: number | null;
}

/** Reads raw lat/lng/radius/unit strings (an API route's searchParams.get()
 *  results, or useListingSearch.ts's ListingSearchParams fields — both are
 *  string | null | undefined) into normalized, ready-to-filter values. */
export function parseGeoParams(raw: {
  lat?: string | null;
  lng?: string | null;
  radius?: string | null;
  unit?: string | null;
}): GeoParams {
  const lat = parseCoord(raw.lat);
  const lng = parseCoord(raw.lng);
  const radiusRaw = parseCoord(raw.radius);
  const unit: RadiusUnit = raw.unit === "mi" ? "mi" : "km";
  const radiusKm = radiusRaw != null ? toKm(radiusRaw, unit) : null;
  return { lat, lng, radiusKm };
}

/**
 * True when a distance sort should override the requested `sort` — only
 * when the visitor has a location set AND hasn't asked for a specific
 * non-distance ordering (newest/oldest/price/top-picks all still win over
 * "near me" if explicitly chosen; "relevance"/unset is where distance is
 * the most useful default ranking).
 */
export function shouldSortByDistance(sort: string | null | undefined, lat: number | null, lng: number | null): boolean {
  return lat != null && lng != null && (!sort || sort === "relevance");
}
