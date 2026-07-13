/**
 * lib/mock/footer-locations.ts
 *
 * Mock "Top Locations" shown in the app footer, keyed by country.
 *
 * POC scope: clicking one navigates to `/{country}/listings?loc={slug}` with
 * no category. useListingSearch() resolves that via getListingsForCity() in
 * lib/mock/country-map.ts — a cross-category substring match against each
 * listing's free-text `locationLabel`. Only list cities here that are known
 * to have real mock coverage in that country's data; a city with zero
 * matching listings will render a correct-but-empty "No listings found"
 * state, so don't advertise cities the mock data doesn't actually cover.
 *
 * TODO [INTEGRATION]: Replace with a real "top locations by country" API,
 * e.g. GET /api/v1/locations/top?country={isoCode} — ideally backed by
 * actual listing density per city, not a hand-picked list. When that lands,
 * each entry should carry lat/lng so the footer link can pass real geo
 * filters through (matching how LocationPicker builds /listings URLs).
 *
 * Singapore is intentionally omitted — it's a single city-state, so a "top
 * locations within the country" picker doesn't apply the way it does for
 * IN/GB. Add an "sg" entry here (e.g. neighbourhoods) only if that product
 * decision changes.
 */

import type { CountryCode } from "@/config/types";

export interface FooterLocation {
  label: string;
  /** Query-string value for `?loc=` — kept simple/URL-safe (lowercase, no spaces). */
  slug: string;
}

export const TOP_LOCATIONS_BY_COUNTRY: Partial<Record<CountryCode, FooterLocation[]>> = {
  in: [
    { label: "Bengaluru", slug: "bengaluru" },
    { label: "Mumbai", slug: "mumbai" },
    { label: "Delhi", slug: "delhi" },
    { label: "Chennai", slug: "chennai" },
    { label: "Hyderabad", slug: "hyderabad" },
  ],
  // Birmingham/Leeds/Glasgow removed — no mock listings anywhere reference
  // them (confirmed via grep across lib/mock/gb/**), so they'd always land
  // on an empty results page. London has broad coverage; Manchester has one
  // real listing (lib/mock/gb/property/holiday-rental.ts).
  gb: [
    { label: "London", slug: "london" },
    { label: "Manchester", slug: "manchester" },
  ],
};

