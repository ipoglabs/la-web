// Default "Property" post-form schemas, one per subcategory × country.
//
// These mirror the hand-built forms in components/form/property/* field for
// field (same store keys, same options from config/property/<CC>.ts). They are
// the seed for the `postformschemas` collection (scripts/seed-post-form-schemas.ts)
// and the fallback the API serves when no DB document exists yet. Once seeded,
// edit the DB documents — not this file — to change the live form.

import { getPropertyConfig } from "@/config/property";
import type { FormFieldDef, FormFieldOption, FormSection, PostFormSchemaData } from "../types";

const CATEGORY = "Property";
export const PROPERTY_COUNTRIES = ["IN", "GB", "SG"] as const;

const opts = (values: string[]): FormFieldOption[] => values.map((v) => ({ value: v, label: v }));
const YES_NO = opts(["Yes", "No"]);
const FACILITIES = opts(["Lift", "Security", "Power Backup", "Water Supply", "Fire Safety"]);

// ── Shared building blocks ──────────────────────────────────────────────────
const basics: FormSection = {
  fields: [
    { key: "name", type: "text", label: "Adv Title", required: true, format: "adTitle" },
    { key: "description", type: "richtext", label: "Adv Details", required: true },
  ],
};

const bedsBaths = (): FormFieldDef[] => [
  { key: "beds", type: "number", label: "Beds", min: 1, width: "half" },
  { key: "baths", type: "number", label: "Baths", min: 1, width: "half" },
];

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
            { key: "salePrice", type: "currency", label: "Sale Price", required: true, min: 1, width: "half" },
            { key: "negotiable", type: "select", label: "Negotiable", options: YES_NO, width: "half" },
            { key: "builtup_area", type: "number", label: "Built-up Area", unit: area, min: 1, width: "half" },
            { key: "carpet_area", type: "number", label: "Carpet Area", unit: area, min: 1, width: "half" },
            ...bedsBaths(),
            { key: "age", type: "text", label: "Property Age", placeholder: "e.g. 5 years", width: "half" },
            { key: "ownership", type: "select", label: "Ownership", options: c.sale.ownershipTypes },
          ],
        },
        {
          title: "Features",
          fields: [
            { key: "facilities", type: "multiselect", label: "Facilities", options: FACILITIES },
            { key: "amenities", type: "multiselect", label: "Amenities", options: opts(c.buy.amenities) },
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
            ...bedsBaths(),
            { key: "furnishing", type: "select", label: "Furnishing", options: c.rent.furnishingOptions },
            { key: "available_from", type: "date", label: "Available From", width: "half" },
            { key: "leaseTerm", type: "number", label: "Lease Term", unit: "months", min: 1, width: "half" },
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
            { key: "floor", type: "number", label: "Floor", min: 0, width: "half" },
            { key: "totalFloors", type: "number", label: "Total Floors", min: 1, width: "half" },
            { key: "washrooms", type: "number", label: "Washrooms", min: 0, width: "half" },
            { key: "parkingSpaces", type: "number", label: "Parking Spaces", min: 0, width: "half" },
            { key: "furnishing", type: "select", label: "Furnishing", options: opts(["Furnished", "Semi-Furnished", "Unfurnished"]) },
            { key: "pantry", type: "select", label: "Pantry", options: YES_NO, width: "half" },
            { key: "powerBackup", type: "select", label: "Power Backup", options: YES_NO, width: "half" },
            { key: "available_from", type: "date", label: "Available From", width: "half" },
            { key: "leaseTerm", type: "number", label: "Lease Term", unit: "months", min: 1, width: "half" },
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
            { key: "guests", type: "number", label: "Guests", min: 1, width: "third" },
            { key: "beds", type: "number", label: "Beds", min: 1, width: "third" },
            { key: "baths", type: "number", label: "Baths", min: 1, width: "third" },
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
              placeholder: "Type a location and press Enter",
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
  age: { maxLength: 30 },
  developerName: { maxLength: 100 },

  beds: { max: 50 },
  baths: { max: 50 },
  guests: { max: 100 },
  washrooms: { max: 100 },
  parkingSpaces: { max: 1000 },
  floor: { max: 200, lteField: "totalFloors" },
  totalFloors: { max: 200 },
  leaseTerm: { max: 120 }, // months = 10 years

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
