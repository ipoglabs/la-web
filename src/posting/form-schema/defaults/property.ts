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
const FACILITIES = opts(FACILITIES_LIST);
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
const listedByOptions = (country: string): FormFieldOption[] => [
  { value: "Owner", label: "Owner" },
  { value: "Agent", label: "Agent" },
  { value: "Builder", label: country === "IN" ? "Builder" : "Developer" },
];
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
            { key: "floor", type: "select", label: "Floor", options: counts(0, 10, "Ground"), lteField: "totalFloors" },
            { key: "totalFloors", type: "select", label: "Total Floors", options: counts(1, 10) },
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
            ...(country === "GB"
              ? ([
                  { key: "councilTaxBand", type: "select", label: "Council Tax Band", options: opts(["A", "B", "C", "D", "E", "F", "G", "H"]) },
                  { key: "epcRating", type: "select", label: "EPC Rating", options: opts(["A", "B", "C", "D", "E", "F", "G"]) },
                ] satisfies FormFieldDef[])
              : []),
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
            { key: "rentPrice", type: "currency", label: "Rent", required: true, min: 1, width: "third" },
            { key: "deposit", type: "currency", label: "Deposit", min: 0, width: "third" },
            { key: "maintenance", type: "currency", label: "Maintenance", min: 0, width: "third" },
            ...bedsBaths({ studio: true }),
            { key: "furnishing", type: "select", label: "Furnishing", options: c.rent.furnishingOptions },
            { key: "available_from", type: "date", label: "Available From", width: "half" },
            { key: "leaseTerm", type: "select", label: "Lease Term", options: leaseTermOptions(country) },
          ],
        },
        {
          title: "Features",
          fields: [
            { key: "facilities", type: "multiselect", label: "Facilities", options: FACILITIES },
            { key: "amenities", type: "multiselect", label: "Amenities", options: opts(c.rent.amenities) },
          ],
        },
      ];

    case "Commercial":
      return [
        basics,
        {
          title: "Property",
          fields: [
            { key: "propertyType", type: "select", label: "Property Type", required: true, options: c.commercial.propertyTypes },
            { key: "rentPrice", type: "currency", label: "Rent", required: true, min: 1, width: "third" },
            { key: "deposit", type: "currency", label: "Deposit", min: 0, width: "third" },
            { key: "maintenance", type: "currency", label: "Maintenance", min: 0, width: "third" },
            { key: "builtup_area", type: "number", label: "Built-up Area", unit: area, min: 1, width: "half" },
            { key: "carpet_area", type: "number", label: "Carpet Area", unit: area, min: 1, width: "half" },
            { key: "floor", type: "select", label: "Floor", options: counts(0, 10, "Ground"), lteField: "totalFloors" },
            { key: "totalFloors", type: "select", label: "Total Floors", options: counts(1, 10) },
            { key: "washrooms", type: "select", label: "Washrooms", options: COUNT_0_TO_5 },
            { key: "parkingSpaces", type: "select", label: "Parking Spaces", options: COUNT_0_TO_5 },
            { key: "furnishing", type: "select", label: "Furnishing", options: opts(["Furnished", "Semi-Furnished", "Unfurnished"]) },
            { key: "pantry", type: "select", label: "Pantry", options: YES_NO, width: "half" },
            { key: "powerBackup", type: "select", label: "Power Backup", options: YES_NO, width: "half" },
            { key: "available_from", type: "date", label: "Available From", width: "half" },
            { key: "leaseTerm", type: "select", label: "Lease Term", options: leaseTermOptions(country) },
          ],
        },
        {
          title: "Features",
          fields: [
            { key: "facilities", type: "multiselect", label: "Facilities", options: opts(c.commercial.facilities) },
            { key: "amenities", type: "multiselect", label: "Amenities", options: opts(c.commercial.amenities) },
          ],
        },
      ];

    case "For Students":
      return [
        basics,
        {
          title: "Property",
          fields: [
            { key: "propertyType", type: "select", label: "Property Type", required: true, options: c.student.propertyTypes },
            { key: "rentPrice", type: "currency", label: "Rent", required: true, min: 1, width: "half" },
            { key: "deposit", type: "currency", label: "Deposit", min: 0, width: "half" },
            ...bedsBaths(),
            { key: "occupancy", type: "select", label: "Occupancy", options: c.student.occupancyTypes },
            {
              key: "gender_pref",
              type: "select",
              label: "Gender Preference",
              options: [
                { value: "Boys", label: "Boys" },
                { value: "Girls", label: "Girls" },
                { value: "CoEd", label: "Co-ed" },
              ],
            },
          ],
        },
        {
          title: "Features",
          fields: [
            { key: "facilities", type: "multiselect", label: "Facilities", options: opts(c.student.facilities) },
            { key: "amenities", type: "multiselect", label: "Amenities", options: opts(c.student.amenities) },
          ],
        },
      ];

    case "Holiday Rental":
      return [
        basics,
        {
          title: "Property",
          fields: [
            { key: "holidayType", type: "select", label: "Holiday Property Type", required: true, options: c.holiday.propertyTypes },
            { key: "guests", type: "select", label: "Guests", options: counts(1, 8) },
            BEDS,
            BATHS,
          ],
        },
        {
          title: "Rates",
          fields: [
            { key: "rateNightly", type: "currency", label: "Nightly", required: true, min: 1, width: "third" },
            { key: "rateWeekly", type: "currency", label: "Weekly", min: 0, width: "third" },
            { key: "rateMonthly", type: "currency", label: "Monthly", min: 0, width: "third" },
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

    case "Room Rental":
      return [
        basics,
        {
          title: "Room",
          fields: [
            { key: "type", type: "select", label: "Room Type", required: true, options: opts(c.roomRental.roomTypes) },
            { key: "rent", type: "currency", label: "Rent", required: true, min: 1, width: "half" },
            { key: "deposit", type: "currency", label: "Deposit", min: 0, width: "half" },
            { key: "available_from", type: "date", label: "Available From", required: true, width: "half" },
            {
              key: "preferred_tenants",
              type: "select",
              label: "Preferred Tenants",
              options: opts(["Any", "Students", "Working Professionals", "Family"]),
            },
            { key: "gender_pref", type: "select", label: "Gender Preference", options: opts(["Any", "Male", "Female"]) },
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

    case "Land for Sale / Lease":
      return [
        basics,
        {
          title: "Land",
          fields: [
            { key: "propertyType", type: "select", label: "Property Type", options: c.sale.propertyTypes },
            { key: "plot_area", type: "number", label: "Plot Area", unit: area, required: true, min: 1, width: "half" },
            { key: "salePrice", type: "currency", label: "Expected Price", required: true, min: 1, width: "half" },
            { key: "negotiable", type: "select", label: "Negotiable", options: YES_NO, width: "half" },
            { key: "ownership", type: "select", label: "Ownership", options: c.sale.ownershipTypes },
          ],
        },
        {
          title: "Features",
          fields: [{ key: "amenities", type: "multiselect", label: "Amenities", options: opts(c.sale.amenities) }],
        },
      ];

    case "New Projects / Off-Plan":
      return [
        basics,
        {
          title: "Project",
          fields: [
            { key: "propertyType", type: "select", label: "Property Type", options: c.buy.propertyTypes },
            { key: "developerName", type: "text", label: "Developer Name", width: "half" },
            { key: "possessionDate", type: "date", label: "Possession Date", width: "half" },
            { key: "salePrice", type: "currency", label: "Starting Price", required: true, min: 1, width: "half" },
            { key: "builtup_area", type: "number", label: "Built-up Area", unit: area, min: 1, width: "half" },
          ],
        },
        {
          title: "Features",
          fields: [{ key: "amenities", type: "multiselect", label: "Amenities", options: opts(c.buy.amenities) }],
        },
      ];

    case "Wanted":
      return [
        basics,
        {
          title: "Looking For",
          fields: [
            { key: "propertyType", type: "select", label: "Looking For", required: true, options: c.wanted.propertyTypes },
            { key: "minBudget", type: "currency", label: "Min Budget", min: 1, width: "half" },
            { key: "maxBudget", type: "currency", label: "Max Budget", min: 1, gteField: "minBudget", width: "half" },
            { key: "minArea", type: "number", label: "Min Area", unit: area, min: 1 },
            ...bedsBaths(),
            {
              key: "preferred_locations",
              type: "tags",
              label: "Preferred Locations",
              placeholder: AREA_EXAMPLES[country] ?? "e.g. your preferred area…",
              hint: "Type an area and press Enter — add up to 5",
              format: "place",
              maxItems: 5,
            },
          ],
        },
        {
          title: "Features",
          fields: [{ key: "amenities", type: "multiselect", label: "Preferred Amenities", options: opts(c.wanted.amenities) }],
        },
      ];

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

  builtup_area: { max: AREA_MAX },
  carpet_area: { max: AREA_MAX, lteField: "builtup_area" },
  plot_area: { max: AREA_MAX },
  minArea: { max: AREA_MAX },
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
