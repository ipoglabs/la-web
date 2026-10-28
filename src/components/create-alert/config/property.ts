import type { FilterConfig, MainCategory } from "../types";
import { propertyFieldOptions } from "@/posting/form-schema/defaults/property";
import { listingType, bedrooms, furnishing, floorLevel } from "./shared";

// Type filters offer what the sub's post form saves (posting/form-schema/
// defaults/property.ts), every market's options together; lib/listing-filters.ts
// narrows them to each market's own list in its words, and lib/postFilterQuery.ts
// matches them exactly.
const formFilter = (id: string, label: string, subcategory: string, key: string): FilterConfig => {
  const all = new Map<string, string>();
  for (const entries of Object.values(propertyFieldOptions(subcategory, key))) {
    for (const [value, optionLabel] of entries) if (!all.has(value)) all.set(value, optionLabel);
  }
  return { id, label, type: "toggle", options: [...all].map(([value, optionLabel]) => ({ label: optionLabel, value })) };
};

export const property: MainCategory = {
  id: "property",
  label: "Property",
  description: "Find your perfect home, rental or commercial space.",
  icon: "building-2",
  iconBg: "bg-blue-100",
  iconColor: "text-blue-600",
  subcategories: [
    {
      id: "to_rent",
      label: "To Rent",
      icon: "key",
      filters: [
        formFilter("prop_type", "Property Type", "To Rent", "propertyType"),
        bedrooms,
        furnishing,
        floorLevel,
        {
          id: "listed_by",
          label: "Listed by",
          type: "toggle",
          options: [
            { label: "Owner", value: "owner" },
            { label: "Agent", value: "agent" },
          ],
        },
        // India only (lib/listing-filters.ts): owners' listings and agents charging none.
        {
          id: "brokerage",
          label: "Brokerage",
          type: "toggle",
          singleSelect: true,
          options: [{ label: "No brokerage", value: "none" }],
        },
      ],
    },
    {
      id: "to_buy",
      label: "To Buy",
      icon: "building-2",
      filters: [
        formFilter("prop_type", "Property Type", "To Buy", "propertyType"),
        bedrooms,
        floorLevel,
        {
          id: "sale_type",
          label: "New or Resale",
          type: "toggle",
          singleSelect: true,
          options: [
            { label: "New",    value: "new"    },
            { label: "Resale", value: "resale" },
          ],
        },
        // UK only (lib/listing-filters.ts).
        {
          id: "chain_free",
          label: "Chain",
          type: "toggle",
          singleSelect: true,
          options: [{ label: "Chain free", value: "yes" }],
        },
        {
          id: "tenure",
          label: "Tenure",
          type: "toggle",
          singleSelect: true,
          options: [
            { label: "Freehold",  value: "freehold"  },
            { label: "Leasehold", value: "leasehold" },
            { label: "Any",       value: "any"       },
          ],
        },
        {
          id: "listed_by",
          label: "Listed by",
          type: "toggle",
          options: [
            { label: "Owner",   value: "owner"   },
            { label: "Agent",   value: "agent"   },
            { label: "Builder", value: "builder" },
          ],
        },
      ],
    },
    {
      id: "room_rental",
      label: "Room Rental",
      icon: "door-open",
      filters: [
        formFilter("room_type", "Room Type", "Room Rental", "type"),
        furnishing,
        {
          id: "gender",
          label: "Preferred Tenant",
          type: "toggle",
          singleSelect: true,
          options: [
            { label: "Any",             value: "any"     },
            { label: "Male",            value: "male"    },
            { label: "Female",          value: "female"  },
            { label: "Couples welcome", value: "couples" },
          ],
        },
        {
          id: "listed_by",
          label: "Listed by",
          type: "toggle",
          options: [
            { label: "Owner / Live-in landlord", value: "owner"  },
            { label: "Current tenant",           value: "tenant" },
            { label: "Agent",                    value: "agent"  },
          ],
        },
      ],
    },
    {
      id: "for_students",
      label: "For Students",
      icon: "graduation-cap",
      filters: [
        formFilter("room_type", "Accommodation Type", "For Students", "propertyType"),
        {
          id: "gender",
          label: "Boys / Girls",
          type: "toggle",
          singleSelect: true,
          options: [
            { label: "Boys",  value: "boys"  },
            { label: "Girls", value: "girls" },
            { label: "Co-ed", value: "coed"  },
          ],
        },
        {
          id: "listed_by",
          label: "Listed by",
          type: "toggle",
          options: [
            { label: "Owner",                value: "owner"      },
            { label: "Agent",                value: "agent"      },
            { label: "Hostel / PG Operator", value: "operator"   },
            { label: "University",           value: "university" },
          ],
        },
      ],
    },
    {
      id: "commercial",
      label: "Commercial",
      icon: "landmark",
      filters: [
        listingType,
        formFilter("commercial_type", "Type", "Commercial", "propertyType"),
        {
          id: "listed_by",
          label: "Listed by",
          type: "toggle",
          options: [
            { label: "Owner",   value: "owner"   },
            { label: "Agent",   value: "agent"   },
            { label: "Builder", value: "builder" },
          ],
        },
      ],
    },
    {
      id: "holiday_rental",
      label: "Holiday Rental",
      icon: "palm-tree",
      filters: [
        formFilter("prop_type", "Property Type", "Holiday Rental", "holidayType"),
        {
          id: "guests",
          label: "Guests",
          type: "toggle",
          singleSelect: true,
          options: [
            { label: "Any", value: "any"  },
            { label: "1-2", value: "1to2" },
            { label: "3-4", value: "3to4" },
            { label: "5-8", value: "5to8" },
            { label: "8+",  value: "8up"  },
          ],
        },
        {
          id: "stay_length",
          label: "Stay Length",
          type: "toggle",
          singleSelect: true,
          options: [
            { label: "Any",     value: "any"     },
            { label: "Weekend", value: "weekend" },
            { label: "Weekly",  value: "weekly"  },
            { label: "Monthly", value: "monthly" },
          ],
        },
        {
          id: "listed_by",
          label: "Listed by",
          type: "toggle",
          options: [
            { label: "Owner",             value: "owner"   },
            { label: "Agent",              value: "agent"   },
            { label: "Property Manager",   value: "manager" },
          ],
        },
      ],
    },
    {
      id: "new_projects",
      label: "New Projects / Off-Plan",
      icon: "building",
      filters: [
        formFilter("prop_type", "Property Type", "New Projects / Off-Plan", "propertyType"),
        {
          id: "completion",
          label: "Completion",
          type: "toggle",
          singleSelect: true,
          options: [
            { label: "Any",          value: "any"         },
            { label: "Ready Now",    value: "ready"       },
            { label: "< 1 Year",     value: "sub1y"       },
            { label: "1–2 Years",    value: "1to2y"       },
            { label: "2 Years+",     value: "2yup"        },
          ],
        },
        {
          id: "listed_by",
          label: "Listed by",
          type: "toggle",
          options: [
            { label: "Developer", value: "developer" },
            { label: "Agent",     value: "agent"     },
          ],
        },
      ],
    },
    {
      id: "land",
      label: "Land for Sale / Lease",
      icon: "map",
      filters: [
        {
          id: "land_action",
          label: "Action",
          type: "toggle",
          singleSelect: true,
          options: [
            { label: "Any",       value: "any"   },
            { label: "For Sale",  value: "sale"  },
            { label: "For Lease", value: "lease" },
          ],
        },
        formFilter("land_type", "Land Type", "Land for Sale / Lease", "propertyType"),
        {
          id: "listed_by",
          label: "Listed by",
          type: "toggle",
          options: [
            { label: "Owner",   value: "owner"   },
            { label: "Agent",   value: "agent"   },
            { label: "Builder", value: "builder" },
          ],
        },
      ],
    },
    {
      id: "wanted",
      label: "Wanted",
      icon: "search",
      filters: [
        {
          id: "wanted_type",
          label: "Looking For",
          type: "toggle",
          singleSelect: true,
          options: [
            { label: "To Rent",     value: "rent"       },
            { label: "To Buy",      value: "buy"        },
            { label: "Room Rental", value: "room"       },
            { label: "Commercial",  value: "commercial" },
            { label: "Land",        value: "land"       },
          ],
        },
        formFilter("prop_type", "Property Type", "Wanted", "propertyType"),
      ],
    },
  ],
};
