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
  /** filter id -> option value -> Mongo clause; several picked = OR, options with no clause are ignored */
  choice?: Record<string, Record<string, () => Record<string, unknown>>>;
  /** The sub's post form asks Listed By (`attributes.listedBy`), so the listed_by filter applies */
  listedBy?: boolean;
  /** Post field the injected price_min/price_max filter range-queries — omitted where no single reliable price field exists for the sub */
  priceField?: string;
  /**
   * A rent-or-sale toggle backed by `attributes.listingFor`. `priceField`
   * is then the rent, and sale listings are priced on `salePrice`. Posts
   * from before the field existed count as `legacy`.
   */
  listingFor?: {
    filterId: string;
    rent: { option: string; stored: string };
    sale: { option: string; stored: string };
    legacy: "rent" | "sale";
  };
}

// listed_by option -> saved Listed By value. "Builder" is shown as
// "Developer" in GB / SG but saved as "Builder" everywhere. "Helping Hand"
// and "Property Manager" have no matching Listed By choice on any form.
const LISTED_BY: Record<string, string> = { owner: "Owner", agent: "Agent", builder: "Builder", developer: "Builder" };

// Holiday Rental: Minimum Stay is saved in nights ("1", "2", "3", "7", "30",
// "90"). A stay of a weekend / week / month fits listings whose minimum is
// no longer. SG listings are monthly-only (no nightly rate, no Minimum
// Stay), so they fit only a monthly stay.
const nightly = { rateNightly: { $exists: true, $ne: null } };
const minStayUpTo = (nights: string[]) => ({
  $and: [nightly, { $or: [{ "attributes.minStay": { $in: nights } }, { "attributes.minStay": { $exists: false } }] }],
});
const STAY_LENGTH: Record<string, () => Record<string, unknown>> = {
  weekend: () => minStayUpTo(["1", "2"]),
  weekly: () => minStayUpTo(["1", "2", "3", "7"]),
  monthly: () => ({ $or: [minStayUpTo(["1", "2", "3", "7", "30"]), { rateNightly: { $exists: false } }, { rateNightly: null }] }),
};

// New Projects: Possession is "6months" or a year, read as "by the end of
// that year" and bucketed by how far that is from today.
function possessionWithin(minMonths: number, maxMonths: number): Record<string, unknown> {
  const now = new Date();
  const values: string[] = minMonths === 0 ? ["6months"] : [];
  for (let year = now.getFullYear(); year <= now.getFullYear() + 15; year++) {
    const monthsAway = (year - now.getFullYear()) * 12 + (12 - (now.getMonth() + 1));
    if (monthsAway >= minMonths && monthsAway < maxMonths) values.push(String(year));
  }
  return { "attributes.constructionStatus": { $ne: "ReadyToMove" }, "attributes.possession": { $in: values } };
}
const COMPLETION: Record<string, () => Record<string, unknown>> = {
  ready: () => ({ "attributes.constructionStatus": "ReadyToMove" }),
  sub1y: () => possessionWithin(0, 12),
  "1to2y": () => possessionWithin(12, 24),
  "2yup": () => possessionWithin(24, Infinity),
};

// Wanted: buy / rent come from Want To; room / commercial / land from the
// Looking For type (config/property wanted.propertyTypes).
const WANTED_TYPE: Record<string, () => Record<string, unknown>> = {
  rent: () => ({ "attributes.wantTo": "Rent" }),
  buy: () => ({ "attributes.wantTo": "Buy" }),
  room: () => ({ propertyType: { $in: ["RoomPG", "Room"] } }),
  commercial: () => ({ propertyType: "Commercial" }),
  land: () => ({ propertyType: "Plot" }),
};

const PROPERTY_SUB_FILTERS: Record<string, SubFilterMap> = {
  to_rent: {
    text: { prop_type: "propertyType", furnishing: "furnishing" },
    bucket: {
      bedrooms: { field: "beds", table: BEDROOM_TO_BEDS },
      floor_level: { field: "floor", table: FLOOR_LEVEL_TO_FLOOR },
    },
    priceField: "rentPrice",
    listedBy: true,
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
    listedBy: true,
  },
  room_rental: {
    text: { room_type: "propertyType", furnishing: "furnishing", gender: "gender_pref" },
    priceField: "rentPrice",
    listedBy: true,
  },
  for_students: {
    text: { room_type: "propertyType", furnishing: "furnishing", gender: "gender_pref" },
    priceField: "rentPrice",
    listedBy: true,
  },
  commercial: {
    text: { commercial_type: "propertyType" },
    priceField: "rentPrice",
    listedBy: true,
    // Listing For on the Commercial post form (since 2026-10-14).
    listingFor: {
      filterId: "listing_type",
      rent: { option: "rent", stored: "Rent" },
      sale: { option: "sale", stored: "Sale" },
      legacy: "rent",
    },
  },
  holiday_rental: {
    text: { prop_type: "propertyType" },
    bucket: { guests: { field: "guests", table: GUESTS_TO_COUNT } },
    choice: { stay_length: STAY_LENGTH },
    // The nightly rate where a listing has one. SG holiday listings are
    // monthly-only (no nightly rate), and search is scoped to one country,
    // so in SG the range applies to the monthly rate instead.
    priceField: "rateNightly",
  },
  land: {
    // land_type's options (residential/commercial/agricultural/industrial/
    // mixed) match real propertyType values seen on land posts directly
    // ("RESIDENTIAL", "AGRICULTURAL", ...).
    text: { land_type: "propertyType" },
    priceField: "rentPrice",
    listedBy: true,
    // Listing For on the Land post form (since 2026-10-14); older land posts were sale-only.
    listingFor: {
      filterId: "land_action",
      rent: { option: "lease", stored: "Lease" },
      sale: { option: "sale", stored: "Sale" },
      legacy: "sale",
    },
  },
  wanted: {
    text: { prop_type: "propertyType" },
    choice: { wanted_type: WANTED_TYPE },
    // No reliable single budget field: minBudget/maxBudget describe the
    // buyer's own acceptable range, which the generic price_min/price_max
    // filter would need to overlap-match rather than $gte/$lte a single
    // field — left unfiltered rather than guessed at.
  },
  new_projects: {
    // Mirrors "to_buy": propertyType is the only structured text field
    // posting/config/property.ts's "new projects / off-plan" FieldSpec
    // captures that has a matching filter here.
    text: { prop_type: "propertyType" },
    choice: { completion: COMPLETION },
    priceField: "salePrice",
  },
};

// listed_by on Holiday Rental and New Projects stays inert: neither form
// asks Listed By (New Projects records the developer's name instead).

/**
 * Rent filters compare the rent per month. Some forms let the seller quote
 * it another way (Rent Period, saved as `attributes.rentPeriod` — see
 * posting/form-schema/defaults/property.ts), so the stored `rentPrice` is
 * converted first: per week × 52 / 12, per year / 12, and per-sq-ft rents
 * × `builtup_area`. A per-sq-ft rent with no floor area has no monthly
 * figure and is left out of a price-filtered search.
 */
function monthlyRentInRange(min: number | undefined, max: number | undefined): Record<string, unknown> {
  const monthly = {
    $switch: {
      branches: [
        { case: { $eq: ["$attributes.rentPeriod", "week"] }, then: { $divide: [{ $multiply: ["$rentPrice", 52] }, 12] } },
        { case: { $eq: ["$attributes.rentPeriod", "year"] }, then: { $divide: ["$rentPrice", 12] } },
        {
          case: { $eq: ["$attributes.rentPeriod", "areaYear"] },
          then: { $divide: [{ $multiply: ["$rentPrice", "$builtup_area"] }, 12] },
        },
        { case: { $eq: ["$attributes.rentPeriod", "areaMonth"] }, then: { $multiply: ["$rentPrice", "$builtup_area"] } },
      ],
      default: "$rentPrice",
    },
  };
  // $isNumber first: in $expr a missing value sorts below every number, so a
  // bare $lte would let posts with no rent through.
  const conditions: unknown[] = [{ $isNumber: monthly }];
  if (min !== undefined) conditions.push({ $gte: [monthly, min] });
  if (max !== undefined) conditions.push({ $lte: [monthly, max] });
  return { $expr: { $and: conditions } };
}

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

  for (const [filterId, options] of Object.entries(map.choice ?? {})) {
    const picked = (fv[filterId] ?? []).filter((v) => v in options).map((v) => options[v]());
    if (picked.length === 1) clauses.push(picked[0]);
    else if (picked.length > 1) clauses.push({ $or: picked });
  }

  if (map.listedBy) {
    const stored = [...new Set((fv.listed_by ?? []).map((v) => LISTED_BY[v]).filter(Boolean))];
    if (stored.length > 0) clauses.push({ "attributes.listedBy": { $in: stored } });
  }

  const priceMin = fv.price_min?.[0] ? Number(fv.price_min[0]) : undefined;
  const priceMax = fv.price_max?.[0] ? Number(fv.price_max[0]) : undefined;
  const hasPrice = priceMin !== undefined || priceMax !== undefined;
  const priceClause = (field: string): Record<string, unknown> => {
    if (field === "rentPrice") return monthlyRentInRange(priceMin, priceMax);
    const range: Record<string, number> = {};
    if (priceMin !== undefined) range.$gte = priceMin;
    if (priceMax !== undefined) range.$lte = priceMax;
    if (field === "rateNightly") {
      return { $or: [{ rateNightly: range }, { rateNightly: { $in: [null] }, rateMonthly: range }] };
    }
    return { [field]: range };
  };

  if (map.listingFor && map.priceField) {
    const { filterId, rent, sale, legacy } = map.listingFor;
    // Posts from before the field existed have none; they count as `legacy`.
    const forRent = { "attributes.listingFor": legacy === "rent" ? { $ne: sale.stored } : rent.stored };
    const forSale = { "attributes.listingFor": legacy === "sale" ? { $ne: rent.stored } : sale.stored };
    const picked = (fv[filterId] ?? []).find((v) => v === rent.option || v === sale.option);
    if (picked === rent.option) clauses.push(forRent, ...(hasPrice ? [priceClause(map.priceField)] : []));
    else if (picked === sale.option) clauses.push(forSale, ...(hasPrice ? [priceClause("salePrice")] : []));
    else if (hasPrice) {
      clauses.push({ $or: [{ $and: [forRent, priceClause(map.priceField)] }, { $and: [forSale, priceClause("salePrice")] }] });
    }
  } else if (map.priceField && hasPrice) {
    clauses.push(priceClause(map.priceField));
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
