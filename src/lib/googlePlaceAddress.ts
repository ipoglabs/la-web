/**
 * Shared parser for Google's `address_components` array — turns the raw
 * Geocoding/Place-Details response shape into the same label/sublabel/
 * city/state/country breakdown, so a GPS reverse-geocode (api/geo/reverse)
 * and a searched-and-selected Places pick (api/places/details) always agree
 * on what counts as "city" vs "state" instead of each guessing from a
 * comma-split display string.
 */

export type GoogleAddressComponent = { long_name: string; types: string[] };

export type ParsedGoogleAddress = {
  label: string;
  sublabel?: string;
  city: string | null;
  state: string | null;
  country: string | null;
};

export function parseGoogleAddressComponents(
  components: GoogleAddressComponent[],
  fallbackAddress?: string | null
): ParsedGoogleAddress {
  const get = (type: string) =>
    components.find((c) => c.types.includes(type))?.long_name ?? "";

  const neighborhood = get("neighborhood") || get("sublocality_level_1") || get("sublocality");
  const locality = get("locality") || get("postal_town");
  const area = get("administrative_area_level_2"); // district
  const region = get("administrative_area_level_1"); // state
  const country = get("country");

  // label = most specific named place available; sublabel = broader context
  // (skipping any segment that duplicates the label) ending in country.
  const label = neighborhood || locality || area || region || fallbackAddress || "";
  const sublabelParts = [
    neighborhood && locality !== label ? locality : null,
    area && area !== label && area !== locality ? area : null,
    region && region !== label ? region : null,
    country,
  ].filter((p): p is string => Boolean(p));
  const sublabel = sublabelParts.length > 0 ? sublabelParts.join(", ") : undefined;

  return {
    label,
    sublabel,
    city: locality || area || null,
    state: region || null,
    country: country || null,
  };
}
