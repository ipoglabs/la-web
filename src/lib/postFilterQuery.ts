/**
 * Translates the listings-page filter sidebar's selected values (ids from
 * components/create-alert/config, threaded through as URL query params —
 * see lib/listing-filters.ts's URL FORMAT contract) into Mongo query
 * clauses against the real Post fields for a given category/subcategory.
 *
 * Field mappings below are grounded in actual Post documents (checked
 * directly against the DB), not just posting/config/property.ts's per-sub
 * FieldSpec list — that list turned out not to match what's really stored:
 * every property subcategory populates the same generic `propertyType`
 * field regardless of sub (not a per-sub field like `holidayType`), and
 * price lives on different fields per sub (rentPrice / salePrice /
 * rateNightly). Text fields are free-text (no constrained option list in
 * the posting wizard), so they're matched case-insensitively by whole word
 * rather than exact equality, to bridge casing/wording differences between
 * what a seller typed and the filter's canonical option value.
 *
 * Only `property` is wired today — every other category falls through to
 * {} (no-op), matching the previous "filters are UI-only" behavior so
 * nothing regresses elsewhere.
 */

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Word-boundary, not plain substring: "furnished" must NOT match inside
// "Unfurnished" (it would with a bare substring test, inverting the filter).
function containsInsensitive(value: string): RegExp {
  return new RegExp(`\\b${escapeRegex(value)}\\b`, "i");
}

const BEDROOM_TO_BEDS: Record<string, unknown> = {
  studio: 0,
  "1br": 1,
  "2br": 2,
  "3br": 3,
  "4br": 4,
  "5br": { $gte: 5 },
};

// No canonical floor-band definition exists elsewhere in the app — these
// boundaries are a reasonable default, not a confirmed product spec.
const FLOOR_LEVEL_TO_FLOOR: Record<string, unknown> = {
  ground: 0,
  low: { $gte: 1, $lte: 3 },
  mid: { $gte: 4, $lte: 8 },
  high: { $gte: 9 },
};

// Bucket labels are the ranges themselves ("1-2", "3-4", ...), so these are
// direct, not guessed.
const GUESTS_TO_COUNT: Record<string, unknown> = {
  "1to2": { $gte: 1, $lte: 2 },
  "3to4": { $gte: 3, $lte: 4 },
  "5to8": { $gte: 5, $lte: 8 },
  "8up": { $gte: 8 },
};

interface SubFilterMap {
  /** filter id -> Post text field, matched case-insensitively by whole word (multi-value = OR via $in) */
  text?: Record<string, string>;
  /** filter id -> { Post numeric field, bucket table } */
  bucket?: Record<string, { field: string; table: Record<string, unknown> }>;
  /** Post field the injected price_min/price_max filter range-queries — omitted where no single reliable price field exists for the sub */
  priceField?: string;
}

const PROPERTY_SUB_FILTERS: Record<string, SubFilterMap> = {
  to_rent: {
    text: { prop_type: "propertyType", furnishing: "furnishing" },
    bucket: {
      bedrooms: { field: "beds", table: BEDROOM_TO_BEDS },
      floor_level: { field: "floor", table: FLOOR_LEVEL_TO_FLOOR },
    },
    priceField: "rentPrice",
  },
  to_buy: {
    // tenure -> ownership: Post has an `ownership` field (posting/config's
    // "to buy" FieldSpec) that plausibly holds freehold/leasehold-style
    // text; no current sample data populates it, but the mapping is
    // structurally correct once a post does set it.
    text: { prop_type: "propertyType", tenure: "ownership" },
    bucket: {
      bedrooms: { field: "beds", table: BEDROOM_TO_BEDS },
      floor_level: { field: "floor", table: FLOOR_LEVEL_TO_FLOOR },
    },
    priceField: "salePrice",
  },
  room_rental: {
    text: { room_type: "propertyType", furnishing: "furnishing", gender: "gender_pref" },
    priceField: "rentPrice",
  },
  for_students: {
    text: { room_type: "propertyType", furnishing: "furnishing", gender: "gender_pref" },
    priceField: "rentPrice",
  },
  commercial: {
    // listing_type (rent/sale) has no backing field — every commercial post
    // sampled only ever has rentPrice, never a salePrice, so there's no
    // real distinction to query.
    text: { commercial_type: "propertyType" },
    priceField: "rentPrice",
  },
  holiday_rental: {
    text: { prop_type: "propertyType" },
    bucket: { guests: { field: "guests", table: GUESTS_TO_COUNT } },
    // Holiday posts store rateNightly (confirmed populated on every sample)
    // — rateWeekly/rateMonthly also exist on Post but the generic
    // price_min/price_max filter has no way to know which rate a seller
    // meant, so it applies to the nightly rate only.
    priceField: "rateNightly",
  },
  land: {
    // land_type's options (residential/commercial/agricultural/industrial/
    // mixed) match real propertyType values seen on land posts directly
    // ("RESIDENTIAL", "AGRICULTURAL", ...).
    text: { land_type: "propertyType" },
    priceField: "salePrice",
  },
  wanted: {
    text: { prop_type: "propertyType" },
    // No reliable single budget field: minBudget/maxBudget describe the
    // buyer's own acceptable range, which the generic price_min/price_max
    // filter would need to overlap-match rather than $gte/$lte a single
    // field — left unfiltered rather than guessed at.
  },
  // new_projects: posting/config/property.ts has no "new projects" entry at
  // all (unlike every other sub) — no posts have ever captured structured
  // fields for it, so there's nothing to filter on; falls through to {}.
};

// listed_by (every sub), land_action (land), stay_length (holiday_rental),
// completion (new_projects), wanted_type (wanted): no backing Post field
// exists anywhere in the schema for these — those filter toggles stay
// visible but inert, same as before this change, until a real field is
// added to capture them.

function buildPropertyQuery(sub: string, fv: Record<string, string[]>): Record<string, unknown> {
  const map = PROPERTY_SUB_FILTERS[sub];
  if (!map) return {};

  const clauses: Record<string, unknown>[] = [];

  for (const [filterId, field] of Object.entries(map.text ?? {})) {
    const values = (fv[filterId] ?? []).filter((v) => v !== "any");
    if (values.length > 0) clauses.push({ [field]: { $in: values.map(containsInsensitive) } });
  }

  for (const [filterId, { field, table }] of Object.entries(map.bucket ?? {})) {
    const values = (fv[filterId] ?? []).filter((v) => v !== "any" && v in table);
    if (values.length === 1) clauses.push({ [field]: table[values[0]] });
    else if (values.length > 1) clauses.push({ $or: values.map((v) => ({ [field]: table[v] })) });
  }

  if (map.priceField) {
    const priceMin = fv.price_min?.[0];
    const priceMax = fv.price_max?.[0];
    if (priceMin || priceMax) {
      const range: Record<string, number> = {};
      if (priceMin) range.$gte = Number(priceMin);
      if (priceMax) range.$lte = Number(priceMax);
      clauses.push({ [map.priceField]: range });
    }
  }

  if (clauses.length === 0) return {};
  return clauses.length === 1 ? clauses[0] : { $and: clauses };
}

export function buildFilterQuery(
  category: string,
  sub: string,
  filterValues: Record<string, string[]>
): Record<string, unknown> {
  if (category === "property") return buildPropertyQuery(sub, filterValues);
  return {};
}
