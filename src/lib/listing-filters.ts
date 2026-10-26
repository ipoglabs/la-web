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
import { hasPriceFilter } from "@/lib/postFilterQuery";

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
  /** What one price covers, e.g. "per month" — shown in the label and the active-filter chip */
  unit?: string;
  /** Country code ("in" | "gb" | "sg") — picks the number style (₹ lakh / crore in India) */
  country?: string;
}

/**
 * A price as the filter shows it: "₹50 L" / "₹1.5 Cr" in India (how Indian
 * buyers read property prices), "£1.5M" from a million elsewhere, else the
 * full amount with grouping ("£1,250", "₹40,000").
 */
export function formatPrice(n: number, filter: Pick<RangeFilterConfig, "prefix" | "country">): string {
  const prefix = filter.prefix ?? "";
  const short = (v: number) => Number(v.toFixed(2)).toString();
  if (filter.country?.toLowerCase() === "in") {
    if (n >= 10_000_000) return `${prefix}${short(n / 10_000_000)} Cr`;
    if (n >= 100_000) return `${prefix}${short(n / 100_000)} L`;
    return `${prefix}${n.toLocaleString("en-IN")}`;
  }
  if (n >= 1_000_000) return `${prefix}${short(n / 1_000_000)}M`;
  return `${prefix}${n.toLocaleString("en-GB")}`;
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

// Property prices differ by orders of magnitude between markets (a ₹ rent
// vs a £ rent) and between rents and sale prices, so property steps are per
// market and per kind of price. Rents are per month (see priceUnit).
type PropertyPriceKind = "rent" | "room" | "holiday" | "sale" | "commercialRent";
const PROPERTY_STEPS: Record<string, Record<PropertyPriceKind, readonly number[]>> = {
  in: {
    rent: [2000, 5000, 7500, 10000, 15000, 20000, 25000, 30000, 40000, 50000, 75000, 100000, 150000, 200000, 300000, 500000],
    room: [2000, 3000, 4000, 5000, 6000, 8000, 10000, 12000, 15000, 20000, 25000, 30000, 40000, 50000],
    holiday: [500, 1000, 1500, 2000, 3000, 4000, 5000, 7500, 10000, 15000, 20000, 30000, 50000, 100000],
    sale: [500000, 1000000, 2000000, 3000000, 4000000, 5000000, 7500000, 10000000, 15000000, 20000000, 30000000, 50000000, 100000000, 200000000],
    commercialRent: [10000, 20000, 30000, 50000, 75000, 100000, 150000, 200000, 300000, 500000, 1000000, 2000000],
  },
  gb: {
    rent: [300, 500, 750, 1000, 1250, 1500, 1750, 2000, 2500, 3000, 4000, 5000, 7500, 10000, 15000],
    room: [300, 400, 500, 600, 700, 800, 900, 1000, 1250, 1500, 2000, 2500, 3000],
    holiday: [50, 75, 100, 150, 200, 250, 300, 400, 500, 750, 1000, 1500, 2000],
    sale: [50000, 75000, 100000, 150000, 200000, 250000, 300000, 400000, 500000, 750000, 1000000, 1500000, 2000000, 3000000, 5000000, 10000000],
    commercialRent: [500, 1000, 2000, 3000, 5000, 7500, 10000, 15000, 20000, 30000, 50000, 100000],
  },
  sg: {
    rent: [1000, 1500, 2000, 2500, 3000, 3500, 4000, 5000, 6000, 7500, 10000, 15000, 20000],
    room: [500, 700, 800, 900, 1000, 1200, 1500, 1800, 2000, 2500, 3000, 4000],
    // SG holiday lets are monthly-only
    holiday: [1000, 1500, 2000, 2500, 3000, 3500, 4000, 5000, 6000, 7500, 10000, 15000, 20000],
    sale: [300000, 400000, 500000, 600000, 800000, 1000000, 1250000, 1500000, 2000000, 2500000, 3000000, 4000000, 5000000, 10000000, 20000000],
    commercialRent: [1000, 2000, 3000, 5000, 7500, 10000, 15000, 20000, 30000, 50000, 100000],
  },
};

/** Which kind of price a property sub's filter compares; Commercial and Land follow their Rent / Sale toggle. */
function propertyPriceKind(sub: string, values: Record<string, string[]>): PropertyPriceKind | undefined {
  switch (sub) {
    case "to_rent":
      return "rent";
    case "room_rental":
    case "for_students":
      return "room";
    case "holiday_rental":
      return "holiday";
    case "to_buy":
    case "new_projects":
      return "sale";
    case "commercial":
      return values.listing_type?.[0] === "sale" ? "sale" : "commercialRent";
    case "land":
      return values.land_action?.[0] === "lease" ? "commercialRent" : "sale";
    default:
      return undefined;
  }
}

// Every other category: one of four step sets per market, by how much its
// things usually cost. Jobs filter on the salary per month (see
// monthlySalaryInRange in lib/postFilterQuery.ts).
type CategoryPriceTier = "small" | "goods" | "big" | "salary" | "hourly" | "stipend" | "budget";
const CATEGORY_STEPS: Record<string, Record<CategoryPriceTier, readonly number[]>> = {
  in: {
    small: [100, 250, 500, 1000, 2000, 3000, 5000, 7500, 10000, 20000, 50000],
    goods: [500, 1000, 2000, 5000, 10000, 20000, 30000, 50000, 75000, 100000, 200000, 500000],
    big: [50000, 100000, 200000, 300000, 500000, 750000, 1000000, 1500000, 2000000, 3000000, 5000000, 10000000],
    salary: [5000, 10000, 15000, 20000, 25000, 30000, 40000, 50000, 75000, 100000, 150000, 200000, 300000, 500000, 1000000],
    hourly: [50, 75, 100, 150, 200, 250, 300, 400, 500, 750, 1000, 1500, 2000],
    stipend: [2000, 5000, 7500, 10000, 15000, 20000, 25000, 30000, 40000, 50000, 75000, 100000],
    budget: [1000, 2500, 5000, 10000, 25000, 50000, 75000, 100000, 200000, 500000, 1000000],
  },
  gb: {
    small: [5, 10, 20, 30, 50, 75, 100, 150, 200, 300, 500, 1000],
    goods: [10, 25, 50, 100, 200, 300, 500, 750, 1000, 1500, 2000, 3000, 5000],
    big: [500, 1000, 2000, 3000, 5000, 7500, 10000, 15000, 20000, 30000, 50000, 100000],
    salary: [500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 5000, 6000, 7500, 10000, 15000],
    hourly: [5, 8, 10, 11, 12, 13, 14, 15, 18, 20, 25, 30, 40, 50, 75, 100],
    stipend: [200, 500, 750, 1000, 1250, 1500, 1750, 2000, 2500, 3000],
    budget: [50, 100, 250, 500, 1000, 2000, 3000, 5000, 10000, 20000, 50000],
  },
  sg: {
    small: [5, 10, 20, 30, 50, 75, 100, 150, 200, 300, 500, 1000],
    goods: [10, 25, 50, 100, 200, 300, 500, 750, 1000, 1500, 2000, 3000, 5000],
    big: [5000, 10000, 20000, 30000, 50000, 75000, 100000, 150000, 200000, 300000, 500000],
    salary: [500, 1000, 1500, 2000, 3000, 4000, 5000, 6000, 8000, 10000, 15000, 20000, 30000],
    hourly: [5, 8, 10, 12, 15, 18, 20, 25, 30, 40, 50, 75, 100],
    stipend: [200, 300, 500, 800, 1000, 1200, 1500, 2000, 2500, 3000, 4000],
    budget: [50, 100, 250, 500, 1000, 2000, 3000, 5000, 10000, 20000, 50000],
  },
};

const CATEGORY_TIER: Record<string, CategoryPriceTier> = {
  vehicles: "big",
  jobs: "salary",
  books_media_collectibles: "small",
  food_dining: "small",
  tickets_vouchers: "small",
  health_beauty: "small",
  special_offers: "small",
  community: "small",
  // everything else ("goods"): electronics, furniture, fashion, sports, music, baby, pets, services, education, travel, business
};
/** Subs priced unlike their category. */
const SUB_TIER: Record<string, CategoryPriceTier> = {
  "jobs/part_time": "hourly",
  "jobs/internship": "stipend",
  "vehicles/parts_accessories": "goods",
  "business/biz_for_sale": "big",
};

function categoryTier(cat: string, sub: string, values: Record<string, string[]>): CategoryPriceTier {
  if (cat === "jobs" && sub === "freelance") return values.budget_type?.[0] === "hourly" ? "hourly" : "budget";
  return SUB_TIER[`${cat}/${sub}`] ?? CATEGORY_TIER[cat] ?? "goods";
}

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

// ── Price unit ───────────────────────────────────────────────────────────────

/**
 * What the price filter's numbers mean for this sub, so buyers and renters
 * aren't left guessing. Mirrors lib/postFilterQuery.ts: rents are compared
 * per month (whatever period the seller quoted), holiday lets per night
 * (SG holiday lets are monthly-only), sale prices need no unit. Where a
 * Rent / Sale toggle decides it, `values` (the selected filters) is read.
 */
export function priceUnit(
  cat: string,
  sub: string,
  country: string | undefined,
  values: Record<string, string[]> = {}
): string | undefined {
  if (cat === "jobs") {
    if (sub === "part_time") return "per hour";
    if (sub === "freelance") return values.budget_type?.[0] === "hourly" ? "per hour" : undefined;
    return "per month"; // salaries and internship stipends
  }
  if (cat !== "property") return undefined;
  switch (sub) {
    case "to_rent":
    case "room_rental":
    case "for_students":
      return "per month";
    case "holiday_rental":
      return country?.toLowerCase() === "sg" ? "per month" : "per night";
    case "commercial":
      return values.listing_type?.[0] === "rent" ? "per month" : undefined;
    case "land":
      return values.land_action?.[0] === "lease" ? "per month" : undefined;
    default:
      return undefined;
  }
}

/** "Salary per month", "Pay per hour", "Stipend per month", "Budget" / "Budget per hour". */
function jobsPriceLabel(sub: string, unit: string | undefined): string {
  const word = sub === "part_time" ? "Pay" : sub === "internship" ? "Stipend" : sub === "freelance" ? "Budget" : "Salary";
  return unit ? `${word} ${unit}` : word;
}

// ── Per-market options ───────────────────────────────────────────────────────

type FilterTweak = { label?: string; drop?: string[]; relabel?: Record<string, string>; suffix?: string };
type MarketTweaks = Record<string, FilterTweak | null>;

// GB A1 is the learner category (125cc); A2 is set by power (35 kW), which
// lands around 500cc. SG classes 2B / 2A / 2 are set by cc.
const ENGINE_CC_BY_MARKET: Record<string, FilterTweak> = {
  in: { drop: ["0-200", "126-500", "501-"] },
  gb: {
    label: "Licence Class",
    drop: ["126-200", "201-400", "401-", "0-200"],
    relabel: { "0-125": "A1 / learner (up to 125cc)", "126-500": "A2 (126–500cc)", "501-": "A (over 500cc)" },
  },
  sg: {
    label: "Licence Class",
    drop: ["0-125", "126-200", "126-500", "501-"],
    relabel: { "0-200": "Class 2B (up to 200cc)", "201-400": "Class 2A (201–400cc)", "401-": "Class 2 (over 400cc)" },
  },
};

const REVENUE_BANDS_IN = ["in_sub25l", "in_1cr", "in_5cr", "in_5crup"];
const INVESTMENT_BANDS_IN = ["in_sub10l", "in_50l", "in_1cr", "in_1crup"];

const OWNERS_IN: FilterTweak ={ relabel: { "1": "First Owner", "2": "Second Owner", "3plus": "Third or more" } };

/**
 * Vehicles and Services: the post forms differ by market (posting/form-schema/
 * defaults/vehicles.ts, services.ts), so the filters show only what that market's
 * sellers can pick, in its words. Business shows money bands in the market's
 * own scale. A filter set to null is hidden there.
 */
const BY_MARKET: Record<string, Record<string, MarketTweaks>> = {
  "vehicles/cars": {
    in: { fuel_type: { drop: ["lpg"] }, owners: OWNERS_IN, max_mileage: { suffix: " km" }, ulez: null, coe_left: null },
    gb: {
      fuel_type: { drop: ["cng"] },
      transmission: { drop: ["amt"] },
      body_type: { drop: ["muv"], relabel: { sedan: "Saloon" } },
      max_mileage: { suffix: " miles" },
      coe_left: null,
    },
    sg: { fuel_type: { drop: ["lpg"] }, transmission: { drop: ["amt"] }, body_type: { drop: ["muv"] }, max_mileage: { suffix: " km" }, ulez: null },
  },
  "vehicles/motorcycle": {
    in: {
      owners: OWNERS_IN,
      transmission: { relabel: { manual: "Geared", automatic: "Gearless" } },
      engine_cc: ENGINE_CC_BY_MARKET.in,
      max_mileage: { suffix: " km" },
      coe_left: null,
    },
    gb: { engine_cc: ENGINE_CC_BY_MARKET.gb, max_mileage: { suffix: " miles" }, coe_left: null },
    sg: { engine_cc: ENGINE_CC_BY_MARKET.sg, max_mileage: { suffix: " km" } },
  },
  "vehicles/van": {
    in: { fuel_type: { drop: ["lpg"] }, owners: OWNERS_IN, max_mileage: { suffix: " km" }, wheelbase: null, roof_height: null, coe_left: null },
    gb: { fuel_type: { drop: ["cng"] }, transmission: { drop: ["amt"] }, max_mileage: { suffix: " miles" }, coe_left: null },
    sg: { fuel_type: { drop: ["lpg"] }, transmission: { drop: ["amt"] }, max_mileage: { suffix: " km" }, wheelbase: null, roof_height: null },
  },
  "vehicles/truck": {
    in: { emission: { drop: ["euro4", "euro5", "euro6"] }, owners: OWNERS_IN, max_mileage: { suffix: " km" }, coe_left: null },
    gb: { fuel_type: { drop: ["cng"] }, emission: { drop: ["bs4", "bs6"] }, max_mileage: { suffix: " miles" }, wheels: null, permit: null, coe_left: null },
    sg: { emission: { drop: ["bs4", "bs6"] }, max_mileage: { suffix: " km" }, wheels: null, permit: null },
  },
  "vehicles/electric_vehicles": {
    in: { charging_port: { drop: ["chademo"] }, owners: OWNERS_IN, max_mileage: { suffix: " km" }, range_min: { suffix: " km" }, coe_left: null },
    gb: { ev_type: { drop: ["three_wheeler"] }, charging_port: { drop: ["bharat"] }, max_mileage: { suffix: " miles" }, range_min: { suffix: " miles" }, coe_left: null },
    sg: { ev_type: { drop: ["three_wheeler"] }, charging_port: { drop: ["bharat"] }, max_mileage: { suffix: " km" }, range_min: { suffix: " km" } },
  },
  "vehicles/boats": {
    in: { boat_type: { drop: ["narrowboat"] }, mooring: null },
    sg: { boat_type: { drop: ["narrowboat"] } },
  },
  "services/home_services": {
    in: { service_type: { drop: ["heating"] } },
    gb: { service_type: { drop: ["ac"] } },
    sg: { service_type: { drop: ["heating"] } },
  },
  "services/tutoring": {
    gb: { level: { relabel: { college: "University" } } },
    sg: { level: { relabel: { college: "Poly / University" } } },
  },
  "services/food_dining": {
    in: { service_type: { relabel: { meal_prep: "Tiffin / Meal Prep" } } },
  },
  // Business money bands: IN in Lakh / Crore, GB and SG in thousands.
  "business/biz_for_sale": {
    in: { annual_revenue: { drop: ["sub100", "500k", "1m", "1mup"] } },
    gb: { annual_revenue: { drop: REVENUE_BANDS_IN } },
    sg: { annual_revenue: { drop: REVENUE_BANDS_IN } },
  },
  "business/franchise": {
    in: { investment_level: { drop: ["sub50", "200k", "500k", "500kup"] } },
    gb: { investment_level: { drop: INVESTMENT_BANDS_IN } },
    sg: { investment_level: { drop: INVESTMENT_BANDS_IN } },
  },
  // "Outstation" is Indian English; GB and SG say long distance.
  "community/rideshare_carpool": {
    gb: { route_type: { relabel: { outstation: "Long Distance" } } },
    sg: { route_type: { relabel: { outstation: "Long Distance" } } },
  },
};

function forMarket(cat: string, sub: string, market: string, filters: FilterConfig[]): FilterConfig[] {
  const tweaks = BY_MARKET[`${cat}/${sub}`]?.[market];
  if (!tweaks) return filters;
  return filters.flatMap((f) => {
    if (!(f.id in tweaks)) return [f];
    const tweak = tweaks[f.id];
    if (!tweak) return [];
    const options = f.options
      .filter((o) => !tweak.drop?.includes(o.value))
      .map((o) => {
        const label = tweak.relabel?.[o.value] ?? o.label;
        return { ...o, label: tweak.suffix && o.value !== "any" ? `${label}${tweak.suffix}` : label };
      });
    return [{ ...f, label: tweak.label ?? f.label, options }];
  });
}

// ── Core resolver ─────────────────────────────────────────────────────────────

/**
 * Returns the ListingFilterConfig[] for the given cat + sub pair.
 * Injects a price range filter first wherever the sub has a price to filter on.
 * Returns [] when cat or sub is empty (sub-picker / uncategorised state).
 */
export function resolveFilters(
  cat: string,
  sub: string,
  opts: {
    /** Country code ("in" | "gb" | "sg") — decides the price unit where it differs by market */
    country?: string;
    /** The market's currency symbol, e.g. "\u20b9" */
    currencySymbol?: string;
    /** Currently selected filter values (a Rent / Sale toggle can change the price unit) */
    values?: Record<string, string[]>;
  } = {}
): ListingFilterConfig[] {
  if (!cat || !sub) return [];
  const mainCat = ALERT_CONFIG.find((c) => c.id === cat);
  if (!mainCat) return [];
  const subCat = mainCat.subcategories.find((s) => s.id === sub);
  if (!subCat) return [];

  const market = opts.country?.toLowerCase() ?? "";
  const subFilters = forMarket(cat, sub, market, [...(subCat.filters as FilterConfig[])]);

  // Inject price range as the first filter — always present for every sub
  // No price to filter on (Free / Giveaway, most Community subs, Property Wanted) → no price filter.
  if (!hasPriceFilter(cat, sub)) return subFilters;

  const kind = cat === "property" ? propertyPriceKind(sub, opts.values ?? {}) : undefined;
  const marketSteps = kind
    ? PROPERTY_STEPS[market]?.[kind]
    : cat !== "property" ? CATEGORY_STEPS[market]?.[categoryTier(cat, sub, opts.values ?? {})] : undefined;
  const spec = marketSteps ? { steps: marketSteps } : PRICE_SPECS[`${cat}/${sub}`] ?? { steps: GENERAL_STEPS };
  const unit = priceUnit(cat, sub, opts.country, opts.values);
  const priceFilter: RangeFilterConfig = {
    type: "range",
    id: "price",
    // Vehicles › Wanted is priced on the buyer's Max Budget.
    label: cat === "jobs" ? jobsPriceLabel(sub, unit) : cat === "vehicles" && sub === "wanted" ? "Max Budget" : unit ? `Price ${unit}` : "Price",
    steps: spec.steps,
    prefix: opts.currencySymbol ?? "£",
    unit,
    country: opts.country,
  };

  return [priceFilter, ...subFilters];
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
      const fmt = (v: string) => formatPrice(Number(v), filter);
      const range = minVal && maxVal
        ? `${fmt(minVal)} \u2013 ${fmt(maxVal)}`
        : minVal ? `${fmt(minVal)}+`
        : `Under ${fmt(maxVal!)}`;
      chips.push({ id: `${filter.id}__range`, label: filter.unit ? `${range} ${filter.unit}` : range });
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
