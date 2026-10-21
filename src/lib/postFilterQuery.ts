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
 * Property and Vehicles have full filter mappings. Other categories
 * only get the price range (see CATEGORY_PRICE_FIELD); their other filter
 * toggles are still UI-only.
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

// listed_by option -> saved Listed By value (each sub's options mirror its
// post form). "Builder" is shown as "Developer" in GB / SG but saved as
// "Builder" everywhere.
const LISTED_BY: Record<string, string> = {
  owner: "Owner",
  agent: "Agent",
  builder: "Builder",
  developer: "Builder",
  tenant: "Tenant",
  operator: "Operator",
  university: "University",
  manager: "Manager",
  dealer: "Dealer",
  broker: "Broker",
  private: "Private",
  trade: "Trade",
};

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
    listedBy: true,
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
    listedBy: true,
    priceField: "salePrice",
  },
};


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

// Outside Property, a post's price is its `salePrice` (Jobs: `salary`).
// Free / Giveaway and Community posts have no price to filter on.
const CATEGORY_PRICE_FIELD: Record<string, string | null> = {
  jobs: "salary",
  free_giveaway: null,
  community: null,
};
// Subs priced on another field than their category. Part Time jobs ask an
// hourly rate; part-time hours vary too much to turn it into a monthly figure,
// so it's compared per hour as entered.
const SUB_PRICE_FIELD: Record<string, string> = {
  "jobs/part_time": "hourlyRate",
  "jobs/freelance": "budgetAmount",
  "jobs/internship": "stipendAmount",
  // A Wanted ad's price is what the buyer will pay at most.
  "vehicles/wanted": "maxBudget",
};

/** A price range on `field`, also matching older seed posts that saved their pay as `salary` instead. */
function rangeWithSalaryFallback(field: string, range: Record<string, number>): Record<string, unknown> {
  return { $or: [{ [field]: range }, { [field]: { $exists: false }, salary: range }] };
}

/**
 * Jobs filters each sub's form saves (posting/form-schema/defaults/jobs.ts).
 * A filter a sub's form doesn't save yet is ignored, so it can't empty the results.
 */
const JOBS_FORM_FILTERS: Record<string, string[]> = {
  full_time: ["field", "experience", "work_arrangement"],
  part_time: ["field", "experience", "work_arrangement"],
  freelance: ["field", "experience", "work_arrangement"],
  internship: ["field", "work_arrangement"],
  temp_seasonal: ["field", "work_arrangement"],
  wanted: ["job_type", "field", "experience", "work_arrangement"],
};

// Wanted's Looking For values → the Open To values its form saves.
const WANTED_LOOKING_FOR: Record<string, string> = {
  fulltime: "full-time",
  parttime: "part-time",
  freelance: "freelance",
  intern: "internship",
  temp: "temporary",
};

function buildJobsFormClauses(sub: string, fv: Record<string, string[]>): Record<string, unknown>[] {
  const clauses: Record<string, unknown>[] = [];
  const saved = JOBS_FORM_FILTERS[sub] ?? [];
  const picked = (id: string) => (saved.includes(id) ? (fv[id] ?? []).filter((v) => v && v !== "any") : []);

  const field = picked("field");
  if (field.length) clauses.push({ "attributes.jobCategory": { $in: field } });
  const experience = picked("experience");
  if (experience.length) clauses.push({ experience: { $in: experience } });
  const workMode = picked("work_arrangement");
  // A Wanted seeker picks several work modes (Preferred Work Mode); job ads have one
  if (workMode.length) clauses.push({ [sub === "wanted" ? "attributes.preferredWorkMode" : "workMode"]: { $in: workMode } });
  const lookingFor = picked("job_type").map((v) => WANTED_LOOKING_FOR[v]).filter(Boolean);
  if (lookingFor.length) clauses.push({ "attributes.employmentType": { $in: lookingFor } });
  return clauses;
}

/**
 * Part Time pay per hour. GB and SG ask an Hourly Rate; IN asks Pay with a
 * Pay Period, turned hourly with the post's Hours per Week (20 when unset).
 */
function hourlyPayInRange(range: Record<string, number>): Record<string, unknown> {
  const hoursPerWeek = { $ifNull: ["$attributes.hoursPerWeek", 20] };
  const hourly = {
    $cond: [
      { $isNumber: "$hourlyRate" },
      "$hourlyRate",
      {
        $switch: {
          branches: [
            { case: { $eq: ["$attributes.salaryPeriod", "day"] }, then: { $divide: ["$salary", { $divide: [hoursPerWeek, 5] }] } },
            { case: { $eq: ["$attributes.salaryPeriod", "month"] }, then: { $divide: ["$salary", { $multiply: [hoursPerWeek, 52 / 12] }] } },
          ],
          default: "$salary",
        },
      },
    ],
  };
  const conditions: unknown[] = [{ $isNumber: hourly }];
  if (range.$gte !== undefined) conditions.push({ $gte: [hourly, range.$gte] });
  if (range.$lte !== undefined) conditions.push({ $lte: [hourly, range.$lte] });
  return { $expr: { $and: conditions } };
}

/** Jobs subs whose pay fields need more than a plain range. */
function buildJobsQuery(sub: string, fv: Record<string, string[]>, range: Record<string, number> | null): Record<string, unknown> | null {
  const clauses: Record<string, unknown>[] = [];
  if (sub === "part_time") {
    if (range) clauses.push(hourlyPayInRange(range));
  } else if (sub === "freelance") {
    // Freelance budgets are fixed or hourly (Budget Type); the toggle keeps the range comparing like with like.
    const engagement = fv.engagement?.[0];
    if (engagement && engagement !== "any") clauses.push({ "attributes.engagement": engagement });
    const type = fv.budget_type?.[0];
    if (type === "fixed") clauses.push({ budgetType: { $ne: "hourly" } });
    if (type === "hourly") clauses.push({ budgetType: "hourly" });
    if (range) clauses.push(rangeWithSalaryFallback("budgetAmount", range));
  } else if (sub === "internship") {
    const stipend = fv.stipend?.[0];
    if (stipend === "paid") clauses.push({ $or: [{ stipendType: { $in: ["stipend", "salary"] } }, { stipendAmount: { $gt: 0 } }] });
    if (stipend === "unpaid") clauses.push({ stipendType: "unpaid" });
    // Duration is saved in months ("1", "2", "3", "6", "12"); "3 months" covers anything up to 3.
    const months = { "3m": ["1", "2", "3"], "6m": ["6"], "12m": ["12"] }[fv.duration?.[0] ?? ""];
    if (months) clauses.push({ duration: { $in: months } });
    if (range) clauses.push(rangeWithSalaryFallback("stipendAmount", range));
  } else if (sub === "temp_seasonal") {
    // Duration is saved as the filter's own bucket ("1m", "3m", "6m", "12m")
    const duration = fv.duration?.[0];
    if (duration && duration !== "any") clauses.push({ duration });
    if (range) clauses.push(monthlySalaryInRange(range.$gte, range.$lte));
  } else {
    return null;
  }
  if (clauses.length === 0) return {};
  return clauses.length === 1 ? clauses[0] : { $and: clauses };
}

// ── Vehicles ─────────────────────────────────────────────────────────────────
// Values are what the post forms save (posting/form-schema/defaults/
// vehicles.ts, reworked 2026-10-18). Older posts typed some of them, so
// text matches ignore case. Filters a sub doesn't offer never arrive.

function exactInsensitive(value: string): RegExp {
  return new RegExp(`^${escapeRegex(value)}$`, "i");
}

// Owners: IN saves "First Owner"…, GB "1"–"4+", SG "1"–"3+".
const CAR_OWNERS: Record<string, string[]> = {
  "1": ["First Owner", "1"],
  "2": ["Second Owner", "2"],
  "3plus": ["Third Owner or more", "3", "4+", "3+"],
};

/** Range buckets (engine cc, truck tonnes, boat feet) are "min-max", open-ended as "min-". */
function bucketRange(value: string): Record<string, number> | null {
  const match = /^(\d+(?:\.\d+)?)-(\d+(?:\.\d+)?)?$/.exec(value);
  if (!match) return null;
  const range: Record<string, number> = { $gte: Number(match[1]) };
  if (match[2]) range.$lte = Number(match[2]);
  return range;
}

// GB Truck weight classes (posting/form-schema/defaults/vehicles.ts), saved as text.
const GB_GVW_CLASSES = ["3.5", "7.5", "12", "18", "26", "32", "44"];

// The top Seats option means "this many or more" (Cars 8+, Van 9+).
const SEATS_PLUS: Record<string, number> = { cars: 8, van: 9 };

function buildVehicleQuery(sub: string, fv: Record<string, string[]>): Record<string, unknown>[] {
  const clauses: Record<string, unknown>[] = [];
  const picked = (id: string) => (fv[id] ?? []).filter((v) => v && v !== "any");
  const first = (id: string) => picked(id)[0];

  const listedBy = [...new Set(picked("listed_by").map((v) => LISTED_BY[v]).filter(Boolean))];
  if (listedBy.length) clauses.push({ "attributes.listedBy": { $in: listedBy } });

  // Wanted: a buyer happy with Any condition / seller matches either choice.
  const condition = first("condition");
  if (condition) clauses.push({ condition: sub === "wanted" ? { $in: [condition, "any"] } : exactInsensitive(condition) });
  const buyingFrom = first("buying_from");
  if (buyingFrom) clauses.push({ "attributes.buyingFrom": { $in: [buyingFrom, "any"] } });
  const lookingFor = picked("vehicle_type");
  if (lookingFor.length) clauses.push({ "attributes.vehicleType": { $in: lookingFor } });
  const neededBy = picked("needed_by");
  if (neededBy.length) clauses.push({ "attributes.neededBy": { $in: neededBy } });

  const yearFrom = Number(first("year_from"));
  if (yearFrom) clauses.push({ year: { $gte: yearFrom } });

  // Mileage is saved in the market's unit (km, or miles in GB) and search is per market.
  const maxMileage = Number(first("max_mileage"));
  if (maxMileage) clauses.push({ kms: { $lte: maxMileage } });

  // Cars › Electric also finds electric cars posted under Electric Vehicles
  // (they have Vehicle Type = car and no Fuel Type); see carsAlsoSearchEv.
  const fuel = picked("fuel_type");
  if (sub === "cars" && fuel.includes("electric")) {
    clauses.push({ $or: [{ fuelType: { $in: fuel.map(exactInsensitive) } }, { "attributes.vehicleType": "car" }] });
  }

  for (const [id, field] of [
    ...(sub === "cars" && fuel.includes("electric") ? [] : ([["fuel_type", "fuelType"]] as const)),
    ["body_type", "bodyType"],
    ["bike_type", "attributes.bikeType"],
    ["van_type", "attributes.vanType"],
    ["wheelbase", "attributes.wheelbase"],
    ["roof_height", "attributes.roofHeight"],
    ["truck_type", "bodyType"],
    ["wheels", "attributes.wheels"],
    ["emission", "attributes.emissionStandard"],
    ["cab_type", "attributes.cabType"],
    ["permit", "attributes.permitType"],
    ["boat_type", "attributes.boatType"],
    ["hull", "attributes.hullMaterial"],
    ["engine_type", "attributes.engineType"],
    ["charging_port", "attributes.chargingPort"],
    ["color", "color"],
  ] as const) {
    const values = picked(id);
    if (values.length) clauses.push({ [field]: { $in: values.map(exactInsensitive) } });
  }

  // "auto" was the option value before the 2026-10-18 rework (saved alerts may still carry it).
  const transmission = first("transmission");
  if (transmission) clauses.push({ transmission: exactInsensitive(transmission === "auto" ? "automatic" : transmission) });

  const owners = picked("owners").flatMap((v) => CAR_OWNERS[v] ?? []);
  if (owners.length) clauses.push({ ownerType: { $in: owners } });

  const payloadMin = Number(first("payload_min"));
  if (payloadMin) clauses.push({ "attributes.payload": { $gte: payloadMin } });
  const lengths = picked("length_ft").map(bucketRange).filter((r): r is Record<string, number> => r !== null);
  if (lengths.length) clauses.push({ $or: lengths.map((r) => ({ "attributes.lengthFt": r })) });
  const maxEngineHours = Number(first("max_engine_hours"));
  if (maxEngineHours) clauses.push({ "attributes.engineHours": { $lte: maxEngineHours } });
  const berthsMin = Number(first("berths_min"));
  if (berthsMin) clauses.push({ "attributes.berths": { $gte: berthsMin } });
  // Parts: a vehicle type also finds Universal parts; "body" was the old Body & Exterior value.
  const forVehicle = picked("for_vehicle");
  if (forVehicle.length) clauses.push({ "attributes.forVehicle": { $in: [...forVehicle, "universal"] } });
  const partCategory = picked("part_category").map((v) => (v === "body" ? "exterior" : v));
  if (partCategory.length) clauses.push({ partsCategory: { $in: partCategory } });
  const origin = first("origin");
  if (origin) clauses.push({ "attributes.partOrigin": origin });
  if (first("delivery") === "yes") clauses.push({ "attributes.dealMethod": "delivery" });

  // EV: "scooter" was the old Type value for electric two-wheelers.
  const evType = picked("ev_type").map((v) => (v === "scooter" ? "motorcycle" : v));
  if (evType.length) clauses.push({ "attributes.vehicleType": { $in: evType } });
  // Range is saved in the market's unit (km, or miles in GB), like Mileage.
  const rangeMin = Number(first("range_min"));
  if (rangeMin) clauses.push({ "attributes.rangeKm": { $gte: rangeMin } });
  const healthMin = Number(first("battery_health_min"));
  if (healthMin) clauses.push({ "attributes.batteryHealth": { $gte: healthMin } });
  if (first("dc_fast") === "yes") clauses.push({ "attributes.dcFastCharging": "Yes" });
  if (first("charger") === "yes") clauses.push({ "attributes.chargerIncluded": "Yes" });

  if (first("trailer") === "yes") clauses.push({ "attributes.trailerIncluded": "Yes" });
  if (first("mooring") === "yes") clauses.push({ "attributes.mooringIncluded": "Yes" });

  const payloadTonnes = Number(first("payload_tonnes"));
  if (payloadTonnes) clauses.push({ "attributes.payloadCapacity": { $gte: payloadTonnes } });

  // Gross weight in tonnes: IN / SG type a number, GB picks a class saved as text ("7.5").
  const gvw = picked("gvw").map(bucketRange).filter((r): r is Record<string, number> => r !== null);
  if (gvw.length) {
    const inRange = (t: number, r: Record<string, number>) => t >= r.$gte && (r.$lte === undefined || t <= r.$lte);
    clauses.push({
      $or: gvw.flatMap((r) => [
        { "attributes.gvwr": r },
        { "attributes.gvwr": { $in: GB_GVW_CLASSES.filter((t) => inRange(Number(t), r)) } },
      ]),
    });
  }

  const seats = picked("seats").map(Number).filter((n) => n > 0);
  if (seats.length) {
    const plus = SEATS_PLUS[sub] ?? Infinity;
    const exact = seats.filter((n) => n < plus);
    const or: Record<string, unknown>[] = [];
    if (exact.length) or.push({ seatingCapacity: { $in: exact } });
    if (seats.some((n) => n >= plus)) or.push({ seatingCapacity: { $gte: plus } });
    clauses.push(or.length === 1 ? or[0] : { $or: or });
  }

  const engine = picked("engine_cc").map(bucketRange).filter((r): r is Record<string, number> => r !== null);
  if (engine.length) clauses.push(engine.length === 1 ? { engineCapacity: engine[0] } : { $or: engine.map((r) => ({ engineCapacity: r })) });

  if (first("ulez") === "yes") clauses.push({ "attributes.ulezCompliant": "Yes" });

  // COE Expiry is saved as YYYY-MM-DD, so ISO strings compare in date order.
  const coeYears = Number(first("coe_left"));
  if (coeYears) {
    const until = new Date();
    until.setFullYear(until.getFullYear() + coeYears);
    clauses.push({ "attributes.coeExpiry": { $gte: until.toISOString().slice(0, 10) } });
  }

  return clauses;
}

/**
 * Cars searched with Fuel Type = Electric also cover the Electric Vehicles
 * subcategory: the listings route widens its subcategory match to it, and
 * only that subcategory's cars (Vehicle Type = car) get through.
 */
export function carsAlsoSearchEv(category: string, sub: string, filterValues: Record<string, string[]>): boolean {
  return category === "vehicles" && sub === "cars" && (filterValues.fuel_type ?? []).includes("electric");
}

/** Whether a category / sub's search has a working price filter (the listings UI hides it otherwise). */
export function hasPriceFilter(category: string, sub: string): boolean {
  if (category === "property") return Boolean(PROPERTY_SUB_FILTERS[sub]?.priceField);
  return CATEGORY_PRICE_FIELD[category] !== null;
}

export function buildFilterQuery(
  category: string,
  sub: string,
  filterValues: Record<string, string[]>
): Record<string, unknown> {
  if (category === "property") return buildPropertyQuery(sub, filterValues);

  const field =
    SUB_PRICE_FIELD[`${category}/${sub}`] ??
    (CATEGORY_PRICE_FIELD[category] === undefined ? "salePrice" : CATEGORY_PRICE_FIELD[category]);
  const min = filterValues.price_min?.[0];
  const max = filterValues.price_max?.[0];

  if (category === "jobs") {
    const range: Record<string, number> = {};
    if (min) range.$gte = Number(min);
    if (max) range.$lte = Number(max);
    const clauses = buildJobsFormClauses(sub, filterValues);
    const pay =
      buildJobsQuery(sub, filterValues, min || max ? range : null) ??
      (!field || (!min && !max)
        ? {}
        : field === "salary"
          ? monthlySalaryInRange(min ? Number(min) : undefined, max ? Number(max) : undefined)
          : { [field]: range });
    if (Object.keys(pay).length) clauses.push(pay);
    if (clauses.length === 0) return {};
    return clauses.length === 1 ? clauses[0] : { $and: clauses };
  }

  if (category === "vehicles") {
    const clauses = buildVehicleQuery(sub, filterValues);
    if (field && (min || max)) {
      const range: Record<string, number> = {};
      if (min) range.$gte = Number(min);
      if (max) range.$lte = Number(max);
      clauses.push({ [field]: range });
    }
    if (clauses.length === 0) return {};
    return clauses.length === 1 ? clauses[0] : { $and: clauses };
  }

  if (!field || (!min && !max)) return {};
  if (field === "salary") return monthlySalaryInRange(min ? Number(min) : undefined, max ? Number(max) : undefined);
  const range: Record<string, number> = {};
  if (min) range.$gte = Number(min);
  if (max) range.$lte = Number(max);
  return { [field]: range };
}

/**
 * Salary filters compare pay per month. The seller picks a Pay Period
 * (`attributes.salaryPeriod`); hourly / daily pay assumes a full-time
 * 40-hour, 5-day week. Posts from before Pay Period existed count as monthly.
 * A Salary From – To range (Full Time, `attributes.salaryMax`) matches when
 * it overlaps the filter's range.
 */
function monthlySalaryInRange(min: number | undefined, max: number | undefined): Record<string, unknown> {
  const weeksPerMonth = 52 / 12;
  const monthly = (pay: unknown) => ({
    $switch: {
      branches: [
        { case: { $eq: ["$attributes.salaryPeriod", "hour"] }, then: { $multiply: [pay, 40 * weeksPerMonth] } },
        { case: { $eq: ["$attributes.salaryPeriod", "day"] }, then: { $multiply: [pay, 5 * weeksPerMonth] } },
        { case: { $eq: ["$attributes.salaryPeriod", "week"] }, then: { $multiply: [pay, weeksPerMonth] } },
        { case: { $eq: ["$attributes.salaryPeriod", "year"] }, then: { $divide: [pay, 12] } },
      ],
      default: pay,
    },
  });
  const from = monthly("$salary");
  const to = monthly({ $cond: [{ $isNumber: "$attributes.salaryMax" }, "$attributes.salaryMax", "$salary"] });
  const conditions: unknown[] = [{ $isNumber: from }];
  if (min !== undefined) conditions.push({ $gte: [to, min] });
  if (max !== undefined) conditions.push({ $lte: [from, max] });
  return { $expr: { $and: conditions } };
}
