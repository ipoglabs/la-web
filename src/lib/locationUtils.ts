import type { LocationValue } from "@/components/location-picker";

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

/** `LocationValue` (whatever LocationPicker just emitted) → the shape addSavedLocation() expects. */
export function locationValueToSavedLocationInput(
  v: LocationValue
): { flagCode: string; city: string; region: string; country: string } {
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
