import type { LocationValue } from "@/components/location-picker";

/** Shared cap on saved locations — enforced both client-side (instant feedback
 *  in LocationPicker/SavedLocationSection) and server-side (addSavedLocation),
 *  so it holds regardless of which surface a save comes from. */
export const MAX_SAVED_LOCATIONS = 10;

/** Shared message text so the client-side check and the server action's
 *  thrown error read identically no matter which path triggered it. */
export const SAVED_LOCATIONS_LIMIT_MESSAGE = `You can save up to ${MAX_SAVED_LOCATIONS} locations. Remove one to save a new location.`;

/**
 * Normalizes a free-text country token (from a Google Places sublabel, or a
 * raw search string) into a canonical display name + flag code. Shared by
 * every place that turns a `LocationValue` into a real saved-location DB
 * write (see `addSavedLocation.ts`) — originally lived only in
 * `SavedLocationSection.tsx`, pulled out here once `useSavedLocations.ts`
 * needed the same normalizing outside the profile route group.
 */
export function countryFromToken(token: string): { country: string; flagCode: string } {
  const lower = token.trim().toLowerCase();
  if (["uk", "united kingdom", "england", "scotland", "wales", "gb"].includes(lower))
    return { country: "United Kingdom", flagCode: "gb" };
  if (["sg", "singapore"].includes(lower))
    return { country: "Singapore", flagCode: "sg" };
  if (["in", "india"].includes(lower))
    return { country: "India", flagCode: "in" };
  return { country: token.trim(), flagCode: "un" };
}

/**
 * Resolves a Places Autocomplete pick's placeId into a real city/state/
 * country breakdown via /api/places/details — the same address_components
 * parsing api/geo/reverse already uses for GPS picks. Returns null on any
 * failure so callers can fall back to their existing sublabel-parsing
 * instead of blocking the save.
 */
export async function fetchPlaceDetails(
  placeId: string
): Promise<{ city: string; state: string; country: string } | null> {
  try {
    const res = await fetch(`/api/places/details?placeId=${encodeURIComponent(placeId)}`);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.city || !data.country) return null;
    return { city: data.city, state: data.state ?? "", country: data.country };
  } catch {
    return null;
  }
}

/**
 * `LocationValue` (whatever LocationPicker just emitted) → the shape
 * addSavedLocation() expects. Prefers a value's own structured city/state/
 * country when present (a GPS pick, or a search pick already upgraded via
 * fetchPlaceDetails) — only falls back to comma-splitting `sublabel` when
 * neither is available, which mis-parses POI results (e.g. an airport,
 * where the sublabel is the *locality* the airport sits in, not a state).
 */
export async function locationValueToSavedLocationInput(
  v: LocationValue
): Promise<{ flagCode: string; city: string; region: string; country: string }> {
  if (v.city && v.country) {
    const flag = countryFromToken(v.country).flagCode;
    return { flagCode: flag, city: v.city, region: v.state ?? "", country: v.country };
  }

  if (v.placeId) {
    const details = await fetchPlaceDetails(v.placeId);
    if (details) {
      const flag = countryFromToken(details.country).flagCode;
      return { flagCode: flag, city: details.city, region: details.state, country: details.country };
    }
  }

  const parts = (v.sublabel ?? "")
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);

  let country = "";
  let region = "";

  if (parts.length >= 2) {
    country = countryFromToken(parts[parts.length - 1]).country;
    region = parts.slice(0, -1).join(", ");
  } else if (parts.length === 1) {
    country = countryFromToken(parts[0]).country;
  } else {
    country = countryFromToken(v.label).country;
  }

  const flag = countryFromToken(country).flagCode;
  return { flagCode: flag, city: v.label, region, country };
}
