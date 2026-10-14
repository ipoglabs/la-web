// Default "Property" post-form schemas, one per subcategory × country.
//
// Same store keys as older Property posts, options from config/property/<CC>.ts. They are
// the seed for the `postformschemas` collection (scripts/seed-post-form-schemas.ts)
// and the fallback the API serves when no DB document exists yet. Once seeded,
// edit the DB documents — not this file — to change the live form.

import { getPropertyConfig } from "@/config/property";
import type { FormFieldDef, FormFieldOption, FormSection, PostFormSchemaData } from "../types";
import { GOOD_TO_KNOW_FIELD } from "./shared";

const CATEGORY = "Property";
export const PROPERTY_COUNTRIES = ["IN", "GB", "SG"] as const;

const opts = (values: string[]): FormFieldOption[] => values.map((v) => ({ value: v, label: v }));
const YES_NO = opts(["Yes", "No"]);
const FACILITIES_LIST = ["Lift", "Security", "Power Backup", "Water Supply", "Fire Safety"];
/** Joins option lists, dropping repeats (first spelling wins). */
const mergeLists = (...lists: string[][]): string[] => [...new Set(lists.flat())];

// ── To Buy ──────────────────────────────────────────────────────────────────
const PROPERTY_AGE: FormFieldOption[] = [
  { value: "UnderConstruction", label: "Under construction" },
  { value: "0-1", label: "New (0–1 yr)" },
  { value: "1-5", label: "1–5 yrs" },
  { value: "5-10", label: "5–10 yrs" },
  { value: "10-20", label: "10–20 yrs" },
  { value: "20+", label: "20+ yrs" },
];
const FACING = opts(["North", "South", "East", "West", "North-East", "North-West", "South-East", "South-West"]);
/** Same saved values everywhere ("Builder") so search can filter one way; GB/SG say "Developer". */
const listedByOptions = (country: string, { builder = true } = {}): FormFieldOption[] => [
  { value: "Owner", label: "Owner" },
  { value: "Agent", label: "Agent" },
  ...(builder ? [{ value: "Builder", label: country === "IN" ? "Builder" : "Developer" }] : []),
];
/** UK listings show the council tax band and EPC rating (Rightmove, Zoopla). */
const GB_RATINGS: FormFieldDef[] = [
  { key: "councilTaxBand", type: "select", label: "Council Tax Band", options: opts(["A", "B", "C", "D", "E", "F", "G", "H"]) },
  { key: "epcRating", type: "select", label: "EPC Rating", options: opts(["A", "B", "C", "D", "E", "F", "G"]) },
];
const RENT_PERIODS: FormFieldOption[] = [
  { value: "month", label: "Per month" },
  { value: "week", label: "Per week" },
];
/** How GB and SG commercial rents are quoted (IN is always per month). */
const COMMERCIAL_RENT_PERIODS: Record<string, (area: string) => FormFieldOption[]> = {
  GB: (area) => [
    { value: "month", label: "Per month" },
    { value: "year", label: "Per year" },
    { value: "areaYear", label: `Per ${area} per year` },
  ],
  SG: (area) => [
    { value: "month", label: "Per month" },
    { value: "areaMonth", label: `Per ${area} per month` },
  ],
};
// ── For Students ────────────────────────────────────────────────────────────
const studentListedByOptions = (country: string): FormFieldOption[] => [
  { value: "Owner", label: "Owner" },
  { value: "Agent", label: "Agent" },
  {
    value: "Operator",
    label: country === "IN" ? "PG / Hostel Operator" : country === "GB" ? "Accommodation Provider" : "Hostel Operator",
  },
  { value: "University", label: "University" },
];
/** Private vs shared bathroom (For Students, Room Rental). */
const bathroomOptions = (country: string): FormFieldOption[] => [
  { value: "Attached", label: country === "IN" ? "Attached" : "En-suite" },
  { value: "Shared", label: "Shared" },
];
/** Same saved values as To Rent's Bills Included, worded for students and rooms. */
const STUDENT_BILLS: FormFieldOption[] = [
  { value: "Yes", label: "All bills" },
  { value: "Some", label: "Some bills" },
  { value: "No", label: "None" },
];
const CONTRACT_LENGTHS: FormFieldOption[] = [
  { value: "term", label: "1 term" },
  { value: "semester", label: "1 semester" },
  { value: "6months", label: "6 months" },
  { value: "academicYear", label: "1 academic year (~44 weeks)" },
  { value: "year", label: "1 year" },
  { value: "flexible", label: "Flexible" },
];
const CAMPUS_DISTANCES: FormFieldOption[] = [
  { value: "walking", label: "Walking (< 1 km)" },
  { value: "1-3", label: "1–3 km" },
  { value: "3-5", label: "3–5 km" },
  { value: "5+", label: "5+ km" },
];
const COLLEGE_EXAMPLES: Record<string, string> = {
  IN: "e.g. Delhi University, IIT Bombay",
  GB: "e.g. University of Manchester",
  SG: "e.g. NUS, NTU",
};
// ── Room Rental ─────────────────────────────────────────────────────────────
/** The building the room is in — HDB and condo rooms price very differently in SG. */
const ROOM_PROPERTY_TYPES: Record<string, FormFieldOption[]> = {
  IN: opts(["Apartment", "House"]),
  GB: opts(["Flat", "House"]),
  SG: [
    { value: "HDB", label: "HDB" },
    { value: "Condo", label: "Condo" },
    { value: "Landed", label: "Landed" },
  ],
};
/** Room ads are often posted by a flatmate, not the owner. */
const ROOM_LISTED_BY: FormFieldOption[] = [
  { value: "Owner", label: "Owner / Live-in landlord" },
  { value: "Tenant", label: "Current tenant" },
  { value: "Agent", label: "Agent" },
];
/** Day counts, like Holiday Rental's Minimum Stay. */
const ROOM_MIN_STAYS: FormFieldOption[] = [
  { value: "30", label: "1 month" },
  { value: "90", label: "3 months" },
  { value: "180", label: "6 months" },
  { value: "365", label: "12 months" },
  { value: "flexible", label: "Flexible" },
];

// ── Land for Sale / Lease ───────────────────────────────────────────────────
const LAND_TYPES: Record<string, FormFieldOption[]> = {
  IN: [
    { value: "ResidentialPlot", label: "Residential Plot" },
    { value: "Agricultural", label: "Agricultural Land" },
    { value: "CommercialPlot", label: "Commercial Plot" },
    { value: "IndustrialPlot", label: "Industrial Plot" },
    { value: "FarmHousePlot", label: "Farm House Plot" },
  ],
  GB: [
    { value: "BuildingPlot", label: "Building Plot" },
    { value: "Agricultural", label: "Agricultural / Farmland" },
    { value: "Paddock", label: "Paddock" },
    { value: "Woodland", label: "Woodland" },
    { value: "Development", label: "Development Land" },
  ],
  SG: [
    { value: "LandedPlot", label: "Landed Plot" },
    { value: "Industrial", label: "Industrial Land" },
    { value: "Other", label: "Other" },
  ],
};
const LAND_AREA_UNITS: Record<string, FormFieldOption[]> = {
  IN: opts(["sq ft", "sq yd", "acre", "cent", "guntha", "bigha"]),
  GB: opts(["sq ft", "acre", "hectare"]),
  SG: opts(["sq ft", "sq m"]),
};
const LEASE_RENT_PERIODS: FormFieldOption[] = [
  { value: "month", label: "Per month" },
  { value: "year", label: "Per year" },
];
const LEASE_DURATIONS: FormFieldOption[] = [
  { value: "1", label: "1 year" },
  { value: "3", label: "3 years" },
  { value: "5", label: "5 years" },
  { value: "10", label: "10 years" },
  { value: "30", label: "30+ years" },
];
const LAND_APPROVALS: Record<string, FormFieldOption[]> = {
  IN: opts(["DTCP", "HMDA", "BDA / BMRDA", "RERA", "Panchayat", "Not approved"]),
  GB: opts(["Full planning permission", "Outline permission", "No permission"]),
};
/** Boundary wall has its own field, so it isn't repeated here. */
const LAND_FEATURES = opts(["Road Access", "Corner Plot", "Water Connection", "Electricity Connection", "Gated Community"]);

// ── New Projects / Off-Plan ─────────────────────────────────────────────────
/** New HDB flats are sold by HDB itself, so SG has no HDB option. */
const NEW_PROJECT_TYPES: Record<string, FormFieldOption[]> = {
  IN: [
    { value: "Apartment", label: "Apartment" },
    { value: "Villa", label: "Villa" },
    { value: "Plot", label: "Plot" },
    { value: "RowHouse", label: "Row House" },
  ],
  GB: [
    { value: "Flats", label: "Flats" },
    { value: "Houses", label: "Houses" },
    { value: "Mixed", label: "Mixed" },
  ],
  SG: [
    { value: "Condo", label: "Condominium" },
    { value: "ExecCondo", label: "Executive Condo" },
    { value: "Landed", label: "Landed" },
  ],
};
const unitConfigOptions = (country: string): FormFieldOption[] =>
  country === "IN"
    ? [...["1", "2", "3", "4"].map((n) => ({ value: n, label: `${n} BHK` })), { value: "5", label: "5+ BHK" }, { value: "Plots", label: "Plots" }]
    : [{ value: "0", label: "Studio" }, ...["1", "2", "3", "4"].map((n) => ({ value: n, label: `${n} bed` })), { value: "5", label: "5+ bed" }];
const CONSTRUCTION_STATUSES: FormFieldOption[] = [
  { value: "NewLaunch", label: "New launch" },
  { value: "UnderConstruction", label: "Under construction" },
  { value: "ReadyToMove", label: "Ready to move" },
];
/** Developers announce a month or quarter, not a day. Hidden when the project is ready to move. */
const POSSESSION_OPTIONS: FormFieldOption[] = [
  { value: "6months", label: "Within 6 months" },
  ...["2026", "2027", "2028", "2029", "2030"].map((y) => ({ value: y, label: y })),
];
const PROJECT_EXAMPLES: Record<string, string> = {
  IN: "e.g. Prestige Lakeside",
  GB: "e.g. Royal Wharf",
  SG: "e.g. The Continuum",
};

// ── Wanted ──────────────────────────────────────────────────────────────────
/** Which config/property wanted.propertyTypes values are rooms, plots and commercial units. */
const WANTED_TYPE_GROUPS: Record<string, { room: string[]; plot: string[]; commercial: string[] }> = {
  IN: { room: ["RoomPG"], plot: ["Plot"], commercial: ["Commercial"] },
  GB: { room: ["Room"], plot: [], commercial: ["Commercial"] },
  SG: { room: ["Room"], plot: [], commercial: ["Commercial"] },
};
const MOVE_IN_BY: FormFieldOption[] = [
  { value: "Immediately", label: "Immediately" },
  { value: "1month", label: "Within 1 month" },
  { value: "1-3months", label: "1–3 months" },
  { value: "3-6months", label: "3–6 months" },
  { value: "Flexible", label: "Flexible" },
];
const wantedFurnishing = (country: string): FormFieldOption[] => [
  { value: "Any", label: "Any" },
  { value: "Furnished", label: "Furnished" },
  { value: "Semi", label: country === "IN" ? "Semi-Furnished" : country === "GB" ? "Part Furnished" : "Partially Furnished" },
  { value: "Unfurnished", label: "Unfurnished" },
];

// ── Holiday Rental ──────────────────────────────────────────────────────────
/** Holiday lets are often run by a property manager rather than an agent. */
const HOLIDAY_LISTED_BY: FormFieldOption[] = [
  { value: "Owner", label: "Owner" },
  { value: "Agent", label: "Agent" },
  { value: "Manager", label: "Property Manager" },
];
const MIN_STAYS: FormFieldOption[] = [
  { value: "1", label: "1 night" },
  { value: "2", label: "2 nights" },
  { value: "3", label: "3 nights" },
  { value: "7", label: "7 nights" },
  { value: "30", label: "1 month" },
  { value: "90", label: "3 months" },
];
/** Whole hours from `from` to `to` (24h values, "2 pm" labels), plus Flexible. */
const hourOptions = (from: number, to: number): FormFieldOption[] => [
  ...Array.from({ length: to - from + 1 }, (_, i) => {
    const h = from + i;
    const label = h === 12 ? "12 pm" : h > 12 ? `${h - 12} pm` : `${h} am`;
    return { value: `${String(h).padStart(2, "0")}:00`, label };
  }),
  { value: "flexible", label: "Flexible" },
];
const ATTRACTION_EXAMPLES: Record<string, string> = {
  IN: "e.g. 5 min walk to Baga Beach",
  GB: "e.g. 10 min drive to Windermere",
};
/** Ownership values (config/property sale.ownershipTypes) that come with a lease term. */
const LEASEHOLDS: Record<string, string[]> = {
  GB: ["Leasehold", "SharedOwnership"],
  SG: ["Leasehold99", "Leasehold999"],
};

// ── Shared building blocks ──────────────────────────────────────────────────
const basics: FormSection = {
  fields: [
    { key: "name", type: "text", label: "Adv Title", required: true, format: "adTitle" },
    { key: "description", type: "richtext", label: "Adv Details", required: true },
    GOOD_TO_KNOW_FIELD,
  ],
};

/** Placeholder areas for Preferred Locations, per market. */
const AREA_EXAMPLES: Record<string, string> = {
  IN: "e.g. Andheri West, Koramangala…",
  GB: "e.g. Camden, Didsbury…",
  SG: "e.g. Tampines, Bukit Timah…",
};

// ── Count chips ─────────────────────────────────────────────────────────────
// Small counts are picked from chips, not typed. Values stay numeric strings
// (the Post paths are Numbers), and the last "n+" chip saves n — search's
// "5+ BR" / "8+ guests" / "high floor" buckets are all >= ranges.
const counts = (from: number, to: number, zeroLabel?: string): FormFieldOption[] => [
  ...Array.from({ length: to - from }, (_, i) => {
    const n = from + i;
    return { value: String(n), label: n === 0 && zeroLabel ? zeroLabel : String(n) };
  }),
  { value: String(to), label: `${to}+` },
];
const COUNT_1_TO_5 = counts(1, 5);
const COUNT_0_TO_5 = counts(0, 5, "None");

const BEDS: FormFieldDef = { key: "beds", type: "select", label: "Beds", options: COUNT_1_TO_5 };
const BATHS: FormFieldDef = { key: "baths", type: "select", label: "Baths", options: COUNT_1_TO_5 };
// Whole flats to rent/buy can be studios — saved as 0 beds, which is what
// search's "Studio" bedrooms filter matches.
const BEDS_WITH_STUDIO: FormFieldDef = { ...BEDS, options: counts(0, 5, "Studio") };
const bedsBaths = (opts: { studio?: boolean } = {}): FormFieldDef[] => [opts.studio ? BEDS_WITH_STUDIO : BEDS, BATHS];

const FLOOR_FIELDS: FormFieldDef[] = [
  { key: "floor", type: "select", label: "Floor", options: counts(0, 10, "Ground"), lteField: "totalFloors" },
  { key: "totalFloors", type: "select", label: "Total Floors", options: counts(1, 10) },
];

/** Lease lengths in months; 11 months is the standard Indian rental agreement. */
function leaseTermOptions(country: string): FormFieldOption[] {
  const months = country === "IN" ? [1, 3, 6, 11, 12, 24] : [1, 3, 6, 12, 24];
  return [
    ...months.map((m) => ({
      value: String(m),
      label: m === 12 ? "1 year" : m === 24 ? "2 years" : `${m} ${m === 1 ? "month" : "months"}`,
    })),
    { value: "36", label: "3+ years" },
  ];
}

function buildSections(subcategory: string, country: string): FormSection[] | null {
  const c = getPropertyConfig(country);
  const area = c.areaUnit;

  switch (subcategory) {
    case "To Buy":
      return [
        basics,
        {
          title: "Property",
          fields: [
            { key: "propertyType", type: "select", label: "Property Type", required: true, options: c.buy.propertyTypes },
            { key: "listedBy", type: "select", label: "Listed By", required: true, options: listedByOptions(country) },
            { key: "salePrice", type: "currency", label: "Sale Price", required: true, min: 1, width: "half" },
            { key: "negotiable", type: "select", label: "Negotiable", options: YES_NO, defaultValue: "No", width: "half" },
            // "Carpet area" is an Indian term; GB and SG listings show one floor area.
            ...(country === "IN"
              ? ([
                  { key: "builtup_area", type: "number", label: "Built-up Area", unit: area, min: 1, width: "half" },
                  { key: "carpet_area", type: "number", label: "Carpet Area", unit: area, min: 1, width: "half" },
                ] satisfies FormFieldDef[])
              : ([{ key: "builtup_area", type: "number", label: "Floor Area", unit: area, min: 1, width: "half" }] satisfies FormFieldDef[])),
            ...bedsBaths({ studio: true }),
            { key: "furnishing", type: "select", label: "Furnishing", options: c.rent.furnishingOptions },
            ...FLOOR_FIELDS,
            { key: "parkingSpaces", type: "select", label: "Parking Spaces", options: COUNT_0_TO_5 },
            ...(country === "IN"
              ? ([{ key: "facing", type: "select", label: "Facing", options: FACING }] satisfies FormFieldDef[])
              : []),
            { key: "age", type: "select", label: "Property Age", options: PROPERTY_AGE },
            { key: "ownership", type: "select", label: "Ownership", options: c.sale.ownershipTypes },
            ...(LEASEHOLDS[country]
              ? ([
                  {
                    key: "tenureRemaining",
                    type: "number",
                    label: "Tenure Remaining",
                    unit: "years",
                    min: 1,
                    max: 999,
                    width: "half",
                    showWhen: { field: "ownership", in: LEASEHOLDS[country] },
                  },
                ] satisfies FormFieldDef[])
              : []),
            ...(country === "GB" ? GB_RATINGS : []),
          ],
        },
        {
          title: "Features",
          fields: [
            // One list: sellers couldn't tell whether Lift or Gym was a
            // "facility" or an "amenity".
            { key: "amenities", type: "multiselect", label: "Amenities", options: opts(mergeLists(FACILITIES_LIST, c.buy.amenities)) },
          ],
        },
      ];

    case "To Rent":
      return [
        basics,
        {
          title: "Property",
          fields: [
            { key: "propertyType", type: "select", label: "Property Type", required: true, options: c.rent.propertyTypes },
            { key: "listedBy", type: "select", label: "Listed By", required: true, options: listedByOptions(country, { builder: false }) },
            // GB rents are quoted per week or per calendar month; IN and SG are always monthly.
            ...(country === "GB"
              ? ([
                  { key: "rentPrice", type: "currency", label: "Rent", required: true, min: 1, width: "half" },
                  { key: "rentPeriod", type: "select", label: "Rent Period", required: true, options: RENT_PERIODS, width: "half" },
                  { key: "deposit", type: "currency", label: "Deposit", min: 0, width: "half" },
                ] satisfies FormFieldDef[])
              : ([
                  { key: "rentPrice", type: "currency", label: "Rent", unit: "per month", required: true, min: 1, width: "half" },
                  { key: "deposit", type: "currency", label: "Deposit", min: 0, width: "half" },
                ] satisfies FormFieldDef[])),
            // Maintenance charges are an Indian concept; GB and SG renters ask about bills.
            ...(country === "IN"
              ? ([{ key: "maintenance", type: "currency", label: "Maintenance", min: 0, width: "half" }] satisfies FormFieldDef[])
              : ([{ key: "billsIncluded", type: "select", label: "Bills Included", options: opts(["Yes", "No", "Some"]) }] satisfies FormFieldDef[])),
            ...bedsBaths({ studio: true }),
            { key: "furnishing", type: "select", label: "Furnishing", options: c.rent.furnishingOptions },
            ...FLOOR_FIELDS,
            { key: "parkingSpaces", type: "select", label: "Parking Spaces", options: counts(0, 3, "None") },
            { key: "available_from", type: "date", label: "Available From", required: true, immediateOption: "Immediately" },
            { key: "leaseTerm", type: "select", label: "Lease Term", options: leaseTermOptions(country) },
            ...(country === "GB"
              ? []
              : ([
                  {
                    key: "preferred_tenants",
                    type: "select",
                    label: "Preferred Tenants",
                    options: opts(["Any", "Family", "Bachelors", "Working Professionals", "Students"]),
                  },
                ] satisfies FormFieldDef[])),
            { key: "petsAllowed", type: "select", label: "Pets Allowed", options: opts(["Yes", "No", "By arrangement"]) },
            ...(country === "GB" ? GB_RATINGS : []),
          ],
        },
        {
          title: "Features",
          fields: [
            { key: "amenities", type: "multiselect", label: "Amenities", options: opts(mergeLists(FACILITIES_LIST, c.rent.amenities)) },
          ],
        },
      ];

    case "Commercial": {
      const forRent = { field: "listingFor", in: ["Rent"] };
      const forSale = { field: "listingFor", in: ["Sale"] };
      const rentPeriods = COMMERCIAL_RENT_PERIODS[country];
      return [
        basics,
        {
          title: "Property",
          fields: [
            { key: "propertyType", type: "select", label: "Property Type", required: true, options: c.commercial.propertyTypes },
            { key: "listingFor", type: "select", label: "Listing For", required: true, options: opts(["Rent", "Sale"]) },
            { key: "listedBy", type: "select", label: "Listed By", required: true, options: listedByOptions(country) },
            // Rent — IN rents are always monthly; GB and SG pick how the rent is quoted.
            ...(rentPeriods
              ? ([
                  { key: "rentPrice", type: "currency", label: "Rent", required: true, min: 1, width: "half", showWhen: forRent },
                  {
                    key: "rentPeriod",
                    type: "select",
                    label: "Rent Period",
                    required: true,
                    options: rentPeriods(area),
                    width: "half",
                    showWhen: forRent,
                  },
                ] satisfies FormFieldDef[])
              : ([
                  { key: "rentPrice", type: "currency", label: "Rent", unit: "per month", required: true, min: 1, width: "half", showWhen: forRent },
                ] satisfies FormFieldDef[])),
            { key: "deposit", type: "currency", label: "Deposit", min: 0, width: "half", showWhen: forRent },
            // Sale
            { key: "salePrice", type: "currency", label: "Sale Price", required: true, min: 1, width: "half", showWhen: forSale },
            { key: "negotiable", type: "select", label: "Negotiable", options: YES_NO, defaultValue: "No", width: "half", showWhen: forSale },
            // Running costs — each market names them differently.
            ...(country === "IN"
              ? ([{ key: "maintenance", type: "currency", label: "Maintenance", unit: "per month", min: 0, width: "half" }] satisfies FormFieldDef[])
              : country === "GB"
                ? ([
                    { key: "serviceCharge", type: "currency", label: "Service Charge", unit: "per year", min: 0, width: "half" },
                    { key: "businessRates", type: "currency", label: "Business Rates", unit: "per year", min: 0, width: "half" },
                  ] satisfies FormFieldDef[])
                : ([{ key: "serviceCharge", type: "currency", label: "Service Charge", unit: "per month", min: 0, width: "half" }] satisfies FormFieldDef[])),
            // "Carpet area" is an Indian term; GB and SG listings show one floor area.
            ...(country === "IN"
              ? ([
                  { key: "builtup_area", type: "number", label: "Built-up Area", unit: area, min: 1, width: "half" },
                  { key: "carpet_area", type: "number", label: "Carpet Area", unit: area, min: 1, width: "half" },
                ] satisfies FormFieldDef[])
              : ([{ key: "builtup_area", type: "number", label: "Floor Area", unit: area, min: 1, width: "half" }] satisfies FormFieldDef[])),
            {
              key: "ceilingHeight",
              type: "number",
              label: "Ceiling Height",
              unit: "ft",
              min: 1,
              max: 200,
              width: "half",
              showWhen: { field: "propertyType", in: ["warehouse", "industrial", "workshop"] },
            },
            ...FLOOR_FIELDS,
            { key: "washrooms", type: "select", label: "Washrooms", options: COUNT_0_TO_5 },
            { key: "parkingSpaces", type: "select", label: "Parking Spaces", options: COUNT_0_TO_5 },
            // Fit-out levels, not home furnishing — same `furnishing` key so filters keep working.
            { key: "furnishing", type: "select", label: "Fit-out", options: opts(["Bare Shell", "Warm Shell", "Fully Fitted", "Plug and Play"]) },
            ...(country === "GB"
              ? ([
                  {
                    key: "useClass",
                    type: "select",
                    label: "Use Class",
                    options: [
                      { value: "E", label: "E (Commercial, business and service)" },
                      { value: "B2", label: "B2 (General industrial)" },
                      { value: "B8", label: "B8 (Storage or distribution)" },
                      { value: "SuiGeneris", label: "Sui Generis" },
                    ],
                  },
                ] satisfies FormFieldDef[])
              : []),
            ...(country === "SG"
              ? ([
                  { key: "zoning", type: "select", label: "Zoning", options: opts(["Commercial", "Industrial B1", "Industrial B2", "Business Park"]) },
                ] satisfies FormFieldDef[])
              : []),
            { key: "available_from", type: "date", label: "Available From", width: "half" },
            { key: "leaseTerm", type: "select", label: "Lease Term", options: leaseTermOptions(country), showWhen: forRent },
          ],
        },
        {
          title: "Features",
          fields: [
            // Pantry and Power Backup are ticks here, not separate Yes / No questions.
            { key: "facilities", type: "multiselect", label: "Facilities", options: opts(c.commercial.facilities) },
            { key: "amenities", type: "multiselect", label: "Amenities", options: opts(c.commercial.amenities) },
          ],
        },
      ];
    }

    case "For Students":
      return [
        basics,
        {
          title: "Property",
          fields: [
            { key: "propertyType", type: "select", label: "Property Type", required: true, options: c.student.propertyTypes },
            { key: "listedBy", type: "select", label: "Listed By", required: true, options: studentListedByOptions(country) },
            // UK student rent is quoted per week; IN and SG are always monthly.
            ...(country === "GB"
              ? ([
                  { key: "rentPrice", type: "currency", label: "Rent", required: true, min: 1, width: "half" },
                  { key: "rentPeriod", type: "select", label: "Rent Period", required: true, options: RENT_PERIODS, width: "half" },
                  { key: "deposit", type: "currency", label: "Deposit", min: 0, width: "half" },
                ] satisfies FormFieldDef[])
              : ([
                  { key: "rentPrice", type: "currency", label: "Rent", unit: "per month", required: true, min: 1, width: "half" },
                  { key: "deposit", type: "currency", label: "Deposit", min: 0, width: "half" },
                ] satisfies FormFieldDef[])),
            { key: "billsIncluded", type: "select", label: "Bills Included", options: STUDENT_BILLS },
            // Meals change the real price of a PG, so they're a field, not an amenity tick.
            ...(country === "GB"
              ? []
              : ([
                  { key: "mealsIncluded", type: "select", label: "Meals Included", options: opts(["None", "Breakfast", "Breakfast + Dinner", "All meals"]) },
                ] satisfies FormFieldDef[])),
            // Students rent a bed or a room, so a private bathroom matters more than counts.
            {
              key: "bathroom",
              type: "select",
              label: "Bathroom",
              options: bathroomOptions(country),
            },
            { key: "occupancy", type: "select", label: "Occupancy", options: c.student.occupancyTypes },
            {
              key: "gender_pref",
              type: "select",
              label: "Gender Preference",
              // Indian and Singapore PGs / hostels are usually single-gender.
              required: country !== "GB",
              options: [
                { value: "Boys", label: "Boys" },
                { value: "Girls", label: "Girls" },
                { value: "CoEd", label: "Co-ed" },
              ],
            },
            { key: "available_from", type: "date", label: "Available From", required: true, width: "half" },
            { key: "contractLength", type: "select", label: "Contract Length", options: CONTRACT_LENGTHS },
            {
              key: "nearbyCollege",
              type: "text",
              label: "Nearby College / University",
              placeholder: COLLEGE_EXAMPLES[country] ?? "e.g. the nearest college",
              maxLength: 100,
            },
            { key: "campusDistance", type: "select", label: "Distance to Campus", options: CAMPUS_DISTANCES },
          ],
        },
        {
          title: "Features",
          fields: [
            { key: "amenities", type: "multiselect", label: "Amenities", options: opts(mergeLists(c.student.facilities, c.student.amenities)) },
          ],
        },
      ];

    case "Holiday Rental": {
      // Private homes in Singapore can't be let for under 3 months (URA), so
      // SG listings are monthly only — no nightly or weekly rates.
      const monthlyOnly = country === "SG";
      return [
        basics,
        {
          title: "Property",
          fields: [
            { key: "holidayType", type: "select", label: "Holiday Property Type", required: true, options: c.holiday.propertyTypes },
            { key: "listedBy", type: "select", label: "Listed By", required: true, options: HOLIDAY_LISTED_BY },
            { key: "guests", type: "select", label: "Guests", options: counts(1, 16) },
            { key: "bedrooms", type: "select", label: "Bedrooms", options: COUNT_1_TO_5 },
            BEDS,
            BATHS,
            ...(monthlyOnly
              ? []
              : ([
                  {
                    key: "nearbyAttraction",
                    type: "text",
                    label: "Distance to Beach / Attraction",
                    placeholder: ATTRACTION_EXAMPLES[country] ?? "e.g. 5 min walk to the beach",
                    maxLength: 100,
                  },
                ] satisfies FormFieldDef[])),
          ],
        },
        {
          title: "Rates",
          fields: [
            ...(monthlyOnly
              ? ([
                  {
                    key: "rateMonthly",
                    type: "currency",
                    label: "Monthly",
                    required: true,
                    min: 1,
                    width: "half",
                    hint: "Homes in Singapore can't be let for less than 3 months.",
                  },
                ] satisfies FormFieldDef[])
              : ([
                  { key: "rateNightly", type: "currency", label: "Nightly", required: true, min: 1, width: "third" },
                  { key: "rateWeekly", type: "currency", label: "Weekly", min: 0, width: "third" },
                  { key: "rateMonthly", type: "currency", label: "Monthly", min: 0, width: "third" },
                ] satisfies FormFieldDef[])),
            { key: "cleaningFee", type: "currency", label: "Cleaning Fee", min: 0, width: "half" },
            { key: "deposit", type: "currency", label: "Security Deposit", min: 0, width: "half" },
          ],
        },
        {
          title: "Stay",
          fields: [
            ...(monthlyOnly
              ? []
              : ([{ key: "minStay", type: "select", label: "Minimum Stay", options: MIN_STAYS }] satisfies FormFieldDef[])),
            { key: "checkIn", type: "select", label: "Check-in Time", options: hourOptions(12, 20) },
            { key: "checkOut", type: "select", label: "Check-out Time", options: hourOptions(8, 12) },
          ],
        },
        {
          title: "Features",
          fields: [
            { key: "amenities", type: "multiselect", label: "Amenities", options: opts(c.holiday.amenities) },
            {
              key: "house_rules",
              type: "multiselect",
              label: "House Rules",
              options: opts(["Smoking Allowed", "Pets Allowed", "Parties Allowed", "Children Friendly"]),
            },
          ],
        },
      ];
    }

    case "Room Rental":
      return [
        basics,
        {
          title: "Room",
          fields: [
            { key: "type", type: "select", label: "Room Type", required: true, options: opts(c.roomRental.roomTypes) },
            { key: "propertyType", type: "select", label: "Property Type", options: ROOM_PROPERTY_TYPES[country] ?? [] },
            { key: "listedBy", type: "select", label: "Listed By", required: true, options: ROOM_LISTED_BY },
            // `rentPrice`, like the other rent forms, so search filters and sorts all rents together.
            ...(country === "GB"
              ? ([
                  { key: "rentPrice", type: "currency", label: "Rent", required: true, min: 1, width: "half" },
                  { key: "rentPeriod", type: "select", label: "Rent Period", required: true, options: RENT_PERIODS, width: "half" },
                  { key: "deposit", type: "currency", label: "Deposit", min: 0, width: "half" },
                ] satisfies FormFieldDef[])
              : ([
                  { key: "rentPrice", type: "currency", label: "Rent", unit: "per month", required: true, min: 1, width: "half" },
                  { key: "deposit", type: "currency", label: "Deposit", min: 0, width: "half" },
                ] satisfies FormFieldDef[])),
            { key: "billsIncluded", type: "select", label: "Bills Included", options: STUDENT_BILLS },
            { key: "bathroom", type: "select", label: "Bathroom", options: bathroomOptions(country) },
            { key: "furnishing", type: "select", label: "Furnishing", options: opts(["Furnished", "Unfurnished"]) },
            { key: "flatmates", type: "select", label: "Current Flatmates", options: counts(0, 5) },
            { key: "available_from", type: "date", label: "Available From", required: true, width: "half" },
            {
              key: "minStay",
              type: "select",
              label: "Minimum Stay",
              options: ROOM_MIN_STAYS,
              ...(country === "SG" ? { hint: "Rooms in HDB flats must be let for at least 6 months." } : {}),
            },
            {
              key: "preferred_tenants",
              type: "select",
              label: "Preferred Tenants",
              options: opts(["Any", "Students", "Working Professionals", "Family"]),
            },
            {
              key: "gender_pref",
              type: "select",
              label: "Gender Preference",
              options: [
                { value: "Any", label: "Any" },
                { value: "Male", label: "Male only" },
                { value: "Female", label: "Female only" },
                { value: "Couples", label: "Couples welcome" },
              ],
            },
          ],
        },
        {
          title: "Features",
          fields: [
            { key: "amenities", type: "multiselect", label: "Amenities", options: opts(c.roomRental.amenities) },
            {
              key: "rules",
              type: "multiselect",
              label: "House Rules",
              options: opts(["Smoking Allowed", "Pets Allowed", "Visitors Allowed", "Cooking Allowed"]),
            },
          ],
        },
      ];

    case "Land for Sale / Lease": {
      const forSale = { field: "listingFor", in: ["Sale"] };
      const forLease = { field: "listingFor", in: ["Lease"] };
      return [
        basics,
        {
          title: "Land",
          fields: [
            { key: "propertyType", type: "select", label: "Land Type", required: true, options: LAND_TYPES[country] ?? [] },
            { key: "listingFor", type: "select", label: "Listing For", required: true, options: opts(["Sale", "Lease"]) },
            { key: "listedBy", type: "select", label: "Listed By", required: true, options: listedByOptions(country) },
            // Land is sold in the market's own units (acres, cents, gunthas…), not converted to sq ft.
            { key: "plot_area", type: "number", label: "Plot Area", required: true, min: 0.01, width: "half" },
            { key: "plotAreaUnit", type: "select", label: "Area Unit", required: true, options: LAND_AREA_UNITS[country] ?? [], width: "half" },
            ...(country === "IN"
              ? ([
                  { key: "plotLength", type: "number", label: "Plot Length", unit: "ft", min: 1, max: 100_000, width: "half" },
                  { key: "plotWidth", type: "number", label: "Plot Width", unit: "ft", min: 1, max: 100_000, width: "half" },
                  { key: "facing", type: "select", label: "Facing", options: FACING },
                  { key: "roadWidth", type: "number", label: "Road Width", unit: "ft", min: 1, max: 1000, width: "half" },
                ] satisfies FormFieldDef[])
              : []),
            // Sale
            { key: "salePrice", type: "currency", label: "Expected Price", required: true, min: 1, width: "half", showWhen: forSale },
            { key: "negotiable", type: "select", label: "Negotiable", options: YES_NO, defaultValue: "No", width: "half", showWhen: forSale },
            // Lease
            { key: "rentPrice", type: "currency", label: "Lease Rent", required: true, min: 1, width: "half", showWhen: forLease },
            { key: "rentPeriod", type: "select", label: "Rent Period", required: true, options: LEASE_RENT_PERIODS, width: "half", showWhen: forLease },
            { key: "leaseDuration", type: "select", label: "Lease Period", options: LEASE_DURATIONS, showWhen: forLease },
            ...(LAND_APPROVALS[country]
              ? ([{ key: "approvalStatus", type: "select", label: "Approval Status", options: LAND_APPROVALS[country] }] satisfies FormFieldDef[])
              : []),
            { key: "ownership", type: "select", label: "Ownership", options: c.sale.ownershipTypes },
            { key: "boundaryWall", type: "select", label: "Boundary Wall / Fencing", options: YES_NO },
          ],
        },
        {
          title: "Features",
          fields: [{ key: "amenities", type: "multiselect", label: "Land Features", options: LAND_FEATURES }],
        },
      ];
    }

    case "New Projects / Off-Plan":
      return [
        basics,
        {
          title: "Project",
          fields: [
            { key: "projectName", type: "text", label: "Project Name", required: true, placeholder: PROJECT_EXAMPLES[country], maxLength: 100, width: "half" },
            { key: "developerName", type: "text", label: "Developer Name", required: true, width: "half" },
            {
              key: "listedBy",
              type: "select",
              label: "Listed By",
              required: true,
              // Saved as "Builder" like the other forms' Builder / Developer choice.
              options: [
                { value: "Builder", label: country === "IN" ? "Builder" : "Developer" },
                { value: "Agent", label: "Agent" },
              ],
            },
            // Indian law requires the RERA number on every new-project ad.
            ...(country === "IN"
              ? ([
                  { key: "reraNumber", type: "text", label: "RERA Number", required: true, placeholder: "e.g. P51800012345", maxLength: 50 },
                ] satisfies FormFieldDef[])
              : []),
            { key: "propertyType", type: "select", label: "Property Type", required: true, options: NEW_PROJECT_TYPES[country] ?? [] },
            { key: "unitConfigs", type: "multiselect", label: "Unit Configurations", required: true, options: unitConfigOptions(country) },
            { key: "constructionStatus", type: "select", label: "Construction Status", required: true, options: CONSTRUCTION_STATUSES },
            {
              key: "possession",
              type: "select",
              label: "Possession",
              options: POSSESSION_OPTIONS,
              showWhen: { field: "constructionStatus", notIn: ["ReadyToMove"] },
            },
            // A project sells many units, so price and area are ranges. Price From
            // stays `salePrice` so listing prices and search keep working.
            { key: "salePrice", type: "currency", label: "Price From", required: true, min: 1, width: "half" },
            { key: "salePriceTo", type: "currency", label: "Price To", min: 1, gteField: "salePrice", width: "half" },
            { key: "builtup_area", type: "number", label: "Area From", unit: area, min: 1, width: "half" },
            { key: "areaTo", type: "number", label: "Area To", unit: area, min: 1, gteField: "builtup_area", width: "half" },
            { key: "totalUnits", type: "number", label: "Total Units", min: 1, max: 100_000, width: "half" },
            {
              key: "ownership",
              type: "select",
              label: "Tenure",
              // Power of Attorney sales don't apply to a developer's new units.
              options: c.sale.ownershipTypes.filter((o) => o.value !== "PowerOfAttorney"),
            },
            ...(country === "GB"
              ? ([
                  { key: "buyerIncentives", type: "text", label: "Buyer Incentives", placeholder: "e.g. Stamp duty paid", maxLength: 100 },
                ] satisfies FormFieldDef[])
              : []),
          ],
        },
        {
          title: "Features",
          fields: [{ key: "amenities", type: "multiselect", label: "Amenities", options: opts(c.buy.amenities) }],
        },
      ];

    case "Wanted": {
      const toBuy = { field: "wantTo", in: ["Buy"] };
      const toRent = { field: "wantTo", in: ["Rent"] };
      const types = WANTED_TYPE_GROUPS[country] ?? { room: [], plot: [], commercial: [] };
      // Room, plot and commercial seekers can't answer bed counts.
      const hasBeds = { field: "propertyType", notIn: [...types.room, ...types.plot, ...types.commercial] };
      return [
        basics,
        {
          title: "Looking For",
          fields: [
            { key: "wantTo", type: "select", label: "Want To", required: true, options: opts(["Buy", "Rent"]) },
            { key: "propertyType", type: "select", label: "Looking For", required: true, options: c.wanted.propertyTypes },
            // Rent budgets are monthly, so they get their own (labelled) fields.
            { key: "minBudget", type: "currency", label: "Min Budget", min: 1, width: "half", showWhen: toBuy },
            { key: "maxBudget", type: "currency", label: "Max Budget", required: true, min: 1, gteField: "minBudget", width: "half", showWhen: toBuy },
            { key: "minRentBudget", type: "currency", label: "Min Budget (per month)", min: 1, width: "half", showWhen: toRent },
            {
              key: "maxRentBudget",
              type: "currency",
              label: "Max Budget (per month)",
              required: true,
              min: 1,
              gteField: "minRentBudget",
              width: "half",
              showWhen: toRent,
            },
            // No area for a room; land is asked for in the market's own units.
            {
              key: "minArea",
              type: "number",
              label: "Min Area",
              unit: area,
              min: 1,
              showWhen: { field: "propertyType", notIn: [...types.room, ...types.plot] },
            },
            ...(types.plot.length
              ? ([
                  { key: "minPlotArea", type: "number", label: "Min Plot Area", min: 0.01, width: "half", showWhen: { field: "propertyType", in: types.plot } },
                  {
                    key: "plotAreaUnit",
                    type: "select",
                    label: "Area Unit",
                    options: LAND_AREA_UNITS[country] ?? [],
                    width: "half",
                    showWhen: { field: "propertyType", in: types.plot },
                  },
                ] satisfies FormFieldDef[])
              : []),
            ...bedsBaths({ studio: true }).map((f) => ({ ...f, showWhen: hasBeds })),
            { key: "moveInBy", type: "select", label: "Move-in By", options: MOVE_IN_BY },
            { key: "furnishing", type: "select", label: "Furnishing", options: wantedFurnishing(country), showWhen: toRent },
            ...(country === "GB"
              ? []
              : ([
                  {
                    key: "tenantType",
                    type: "select",
                    label: "Tenant Type",
                    options: [
                      { value: "Family", label: "Family" },
                      { value: "Bachelors", label: "Bachelor(s)" },
                      { value: "WorkingProfessional", label: "Working Professional" },
                      { value: "Student", label: "Student" },
                      { value: "Couple", label: "Couple" },
                    ],
                    showWhen: toRent,
                  },
                ] satisfies FormFieldDef[])),
            {
              key: "pets",
              type: "select",
              label: "Pets",
              options: [
                { value: "None", label: "No pets" },
                { value: "Have", label: "Have pets" },
              ],
              showWhen: toRent,
            },
            {
              key: "preferred_locations",
              type: "tags",
              label: "Preferred Locations",
              placeholder: AREA_EXAMPLES[country] ?? "e.g. your preferred area…",
              hint: "Type an area and press Enter — add up to 5",
              format: "place",
              maxItems: 5,
            },
            // Seekers often want owners only.
            { key: "agentsMayContact", type: "select", label: "Agents May Contact", options: YES_NO },
          ],
        },
        {
          title: "Features",
          fields: [{ key: "amenities", type: "multiselect", label: "Preferred Amenities", options: opts(c.wanted.amenities) }],
        },
      ];
    }

    default:
      return null;
  }
}

export const PROPERTY_SUBCATEGORIES = [
  "To Buy",
  "To Rent",
  "Commercial",
  "For Students",
  "Holiday Rental",
  "Room Rental",
  "Land for Sale / Lease",
  "New Projects / Off-Plan",
  "Wanted",
] as const;

// ── Limits ───────────────────────────────────────────────────────────────────
// Sanity caps applied to a field wherever it appears, in every subcategory.
// They exist to catch typos and junk (999 beds, a 10-page title), not to make
// pricing decisions — so price caps are deliberately generous and the same
// in every currency.
const PRICE_MAX = 10_000_000_000; // 1,000 crore INR — well above any real listing
const AREA_MAX = 10_000_000; // sq ft (~230 acres) — covers large land parcels

const FIELD_LIMITS: Record<string, Partial<FormFieldDef>> = {
  name: { maxLength: 100 },
  description: { maxLength: 2000 }, // matches RichTextEditor's counter
  developerName: { maxLength: 100 },
  areaTo: { max: AREA_MAX },
  nearbyCollege: { maxLength: 100 },
  nearbyAttraction: { maxLength: 100 },

  builtup_area: { max: AREA_MAX },
  carpet_area: { max: AREA_MAX, lteField: "builtup_area" },
  plot_area: { max: AREA_MAX },
  minArea: { max: AREA_MAX },
  minPlotArea: { max: AREA_MAX },
};

function applyLimits(field: FormFieldDef): FormFieldDef {
  const limits = FIELD_LIMITS[field.key] ?? {};
  const priceCap = field.type === "currency" ? { max: PRICE_MAX } : {};
  return { ...field, ...priceCap, ...limits };
}

export function getDefaultPropertySchema(subcategory: string, country: string): PostFormSchemaData | null {
  const sections = buildSections(subcategory, country);
  if (!sections) return null;
  return {
    category: CATEGORY,
    subcategory,
    country,
    version: 2,
    sections: sections.map((section) => ({ ...section, fields: section.fields.map(applyLimits) })),
  };
}

export function getAllDefaultPropertySchemas(): PostFormSchemaData[] {
  return PROPERTY_COUNTRIES.flatMap((country) =>
    PROPERTY_SUBCATEGORIES.map((sub) => getDefaultPropertySchema(sub, country)!),
  );
}
