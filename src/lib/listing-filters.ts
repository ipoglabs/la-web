/**
 * lib/listing-filters.ts
 *
 * Bridge between create-alert config data and the listing filter UI.
 *
 * ─── INDEPENDENCE CONTRACT ───────────────────────────────────────────────────
 * This is the ONLY file in the project that imports from create-alert config.
 * All filter UI components import ONLY from here — never from create-alert/*.
 * Reason: if the config source changes (real API, separate package, etc.),
 * only this file needs updating. Zero UI components change.
 *
 * ─── URL FORMAT ──────────────────────────────────────────────────────────────
 * Filter values are serialised as comma-separated params:
 *   ?cat=property&sub=to_rent&prop_type=apartment,condo&beds=2,3
 *   Range filters use separate _min/_max params:
 *   ?cat=property&sub=to_rent&price_min=500&price_max=2000
 *
 * Rules:
 *   - cat + sub are NEVER part of filterValues — they are separate URL params
 *   - filter ids never collide with "cat", "sub", "q", "sort", "page"
 *   - empty arrays are omitted from the URL entirely
 *   - order of values in the comma list is not significant
 */

import { ALERT_CONFIG } from "@/components/create-alert/config";
import type { FilterConfig } from "@/components/create-alert/types";

// Re-export so callers only import from this file
export type { FilterConfig };

// ── Range filter config ───────────────────────────────────────────────────────
// Defined here (not in create-alert/types) — range filters are a listing-UI
// concern only. CreateAlertJourney never sees them.

export interface RangeFilterConfig {
  type: "range";
  id: string;
  label: string;
  /** Ordered numeric breakpoints — lowest to highest */
  steps: readonly number[];
  /** Currency / unit prefix, e.g. "\u00a3" */
  prefix?: string;
}

/** Union of all filter config types used by the listing UI */
export type ListingFilterConfig = FilterConfig | RangeFilterConfig;

/** Type guard — distinguishes RangeFilterConfig from options-based FilterConfig */
export function isRangeFilter(f: ListingFilterConfig): f is RangeFilterConfig {
  return "steps" in f;
}

// ── Price range step sets ─────────────────────────────────────────────────────

const RENT_STEPS    = [200, 400, 600, 800, 1000, 1250, 1500, 2000, 2500, 3000, 4000, 5000, 7500, 10000, 15000, 20000, 30000, 50000] as const;
const BUY_STEPS     = [5000, 10000, 25000, 50000, 75000, 100000, 150000, 200000, 300000, 400000, 500000, 750000, 1000000, 1500000, 2000000, 5000000] as const;
const ROOM_STEPS    = [100, 150, 200, 300, 400, 500, 600, 750, 1000, 1500, 2000, 3000, 5000, 10000, 50000] as const;
const VEHICLE_STEPS = [500, 1000, 2000, 3000, 5000, 7500, 10000, 15000, 20000, 30000, 50000] as const;
const GENERAL_STEPS = [10, 25, 50, 100, 200, 400, 600, 800, 1000, 1500, 2000, 3000, 5000, 7500, 10000, 20000, 50000] as const;

type PriceSpec = { steps: readonly number[] };

// Keyed as "cat/sub" — falls back to GENERAL_STEPS if not found
const PRICE_SPECS: Record<string, PriceSpec> = {
  "property/to_rent":       { steps: RENT_STEPS    },
  "property/to_buy":        { steps: BUY_STEPS     },
  "property/room_rental":   { steps: ROOM_STEPS    },
  "property/for_students":  { steps: ROOM_STEPS    },
  "property/commercial":    { steps: RENT_STEPS    },
  "vehicles/cars":          { steps: VEHICLE_STEPS },
  "vehicles/motorbikes":    { steps: VEHICLE_STEPS },
  "vehicles/vans":          { steps: VEHICLE_STEPS },
  "vehicles/trucks":        { steps: VEHICLE_STEPS },
};

/** Reserved params that are never treated as filter values */
const RESERVED_PARAMS = new Set(["cat", "sub", "q", "sort", "page", "lat", "lng", "radius", "unit", "loc", "price_min", "price_max"]);

// G3: Dev-time guard — warn if any filter id collides with a reserved URL param.
// Runs once on module load (tree-shaken in production if console is removed).
if (process.env.NODE_ENV !== "production") {
  ALERT_CONFIG.forEach((cat) =>
    cat.subcategories.forEach((sub) =>
      sub.filters.forEach((f) => {
        if (RESERVED_PARAMS.has(f.id)) {
          console.warn(
            `[listing-filters] Filter id "${f.id}" in ${cat.id}/${sub.id} collides with a reserved URL param. Rename it.`
          );
        }
      })
    )
  );
}

// ── Core resolver ─────────────────────────────────────────────────────────────

/**
 * Returns the ListingFilterConfig[] for the given cat + sub pair.
 * Always injects a price range filter first.
 * Returns [] when cat or sub is empty (sub-picker / uncategorised state).
 */
export function resolveFilters(cat: string, sub: string): ListingFilterConfig[] {
  if (!cat || !sub) return [];
  const mainCat = ALERT_CONFIG.find((c) => c.id === cat);
  if (!mainCat) return [];
  const subCat = mainCat.subcategories.find((s) => s.id === sub);
  if (!subCat) return [];

  // Inject price range as the first filter — always present for every sub
  const spec = PRICE_SPECS[`${cat}/${sub}`] ?? { steps: GENERAL_STEPS };
  const priceFilter: RangeFilterConfig = {
    type: "range",
    id: "price",
    label: "Price",
    steps: spec.steps,
    prefix: "£",
  };

  return [priceFilter, ...(subCat.filters as FilterConfig[])];
}

// ── URL serialisation ─────────────────────────────────────────────────────────

/**
 * Parses filter values from URLSearchParams.
 * Skips reserved params (cat, sub, q, sort, page, location, price_min, price_max).
 * Splits comma-separated values into arrays.
 * Range params (price_min, price_max) are parsed separately as single values.
 *
 * TODO [INTEGRATION]: when connecting a real API, pass price_min / price_max
 * directly to the API query string (they are already in the URL). Remove the
 * mock resolver and wire to: GET /api/v1/listings?price_min=500&price_max=2000
 *
 * @example
 * // URL: ?cat=property&sub=to_rent&prop_type=apartment,condo&price_min=500&price_max=2000
 * parseFilterValues(searchParams)
 * // → { prop_type: ["apartment","condo"], price_min: ["500"], price_max: ["2000"] }
 */
export function parseFilterValues(
  searchParams: URLSearchParams
): Record<string, string[]> {
  const result: Record<string, string[]> = {};

  // Range params — single value, not comma-split
  const priceMin = searchParams.get("price_min");
  const priceMax = searchParams.get("price_max");
  if (priceMin) result["price_min"] = [priceMin];
  if (priceMax) result["price_max"] = [priceMax];

  // Options params — comma-separated values
  searchParams.forEach((value, key) => {
    if (RESERVED_PARAMS.has(key)) return;
    const parts = value
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
    if (parts.length > 0) result[key] = parts;
  });
  return result;
}

/**
 * Builds a full URL string from cat, sub, and filter values.
 * Empty arrays are omitted. Preserves q / sort / page if passed in extras.
 *
 * @example
 * buildFilterURL("property", "to_rent", { prop_type: ["apartment","condo"], beds: ["2"] })
 * // → "?cat=property&sub=to_rent&prop_type=apartment,condo&beds=2"
 */
export function buildFilterURL(
  cat: string,
  sub: string,
  filterValues: Record<string, string[]>,
  extras: Record<string, string> = {}
): string {
  // P1 FIX: Build the query string manually for filter values so commas are
  // NOT percent-encoded (%2C). URLSearchParams.set() always encodes commas,
  // making URLs unreadable. Reserved params (cat, sub, q, sort, page) are
  // safe to URLSearchParams-encode — they never contain commas.
  const base = new URLSearchParams();
  if (cat) base.set("cat", cat);
  if (sub) base.set("sub", sub);
  Object.entries(extras).forEach(([k, v]) => { if (v) base.set(k, v); });

  const basePart = base.toString();

  // Filter values appended as raw key=val1,val2 pairs.
  // Range params (price_min / price_max) are always single values — no comma join needed.
  const filterParts = Object.entries(filterValues)
    .filter(([, vals]) => vals.length > 0)
    .map(([key, vals]) => `${encodeURIComponent(key)}=${vals.map(encodeURIComponent).join(",")}`);

  const allParts = [...(basePart ? [basePart] : []), ...filterParts];
  return allParts.length > 0 ? `?${allParts.join("&")}` : "";
}

// ── Chip helpers ──────────────────────────────────────────────────────────────

export interface FilterChip {
  /** Encoded as "filterId__value" so removeChip knows exactly what to strip */
  id: string;
  label: string;
}

/**
 * Derives the active filter chips array from current filter values + config.
 * Each selected option becomes one chip.
 * Label is resolved from the FilterConfig options for human-readable display.
 *
 * @example
 * // filterValues = { prop_type: ["apartment","condo"] }
 * // filters = [{ id: "prop_type", options: [{value:"apartment", label:"Apartment"}, ...] }]
 * deriveActiveChips(filterValues, filters)
 * // → [{ id: "prop_type__apartment", label: "Apartment" }, { id: "prop_type__condo", label: "Condo" }]
 */
export function deriveActiveChips(
  filterValues: Record<string, string[]>,
  filters: ListingFilterConfig[]
): FilterChip[] {
  const chips: FilterChip[] = [];
  filters.forEach((filter) => {
    if (isRangeFilter(filter)) {
      // Range filter — one chip covering both min and max
      const minVal = filterValues[`${filter.id}_min`]?.[0];
      const maxVal = filterValues[`${filter.id}_max`]?.[0];
      if (!minVal && !maxVal) return;
      const fmt = (v: string) =>
        `${filter.prefix ?? ""}${Number(v).toLocaleString()}`;
      const label = minVal && maxVal
        ? `${fmt(minVal)} \u2013 ${fmt(maxVal)}`
        : minVal ? `${fmt(minVal)}+`
        : `Under ${fmt(maxVal!)}`;
      chips.push({ id: `${filter.id}__range`, label });
    } else {
      const selected = filterValues[filter.id] ?? [];
      selected.forEach((val) => {
        const option = filter.options.find((o) => o.value === val);
        chips.push({ id: `${filter.id}__${val}`, label: option?.label ?? val });
      });
    }
  });
  return chips;
}

/**
 * Removes one chip from filterValues by its encoded id.
 * Returns a new filterValues object (immutable).
 *
 * @example
 * removeChipFromValues("prop_type__apartment", { prop_type: ["apartment","condo"] })
 * // → { prop_type: ["condo"] }
 */
export function removeChipFromValues(
  chipId: string,
  filterValues: Record<string, string[]>
): Record<string, string[]> {
  // P2 FIX: use indexOf + slice so option values containing "__" don't break the split
  const sep = chipId.indexOf("__");
  if (sep === -1) return filterValues;
  const filterId = chipId.slice(0, sep);
  const value = chipId.slice(sep + 2);
  if (!filterId || !value) return filterValues;

  // Range chip — clear both _min and _max in one action
  if (value === "range") {
    const updated = { ...filterValues };
    delete updated[`${filterId}_min`];
    delete updated[`${filterId}_max`];
    return updated;
  }

  // Options chip — existing logic
  const current = filterValues[filterId] ?? [];
  const next = current.filter((v) => v !== value);
  const updated = { ...filterValues };
  if (next.length === 0) {
    delete updated[filterId];
  } else {
    updated[filterId] = next;
  }
  return updated;
}
