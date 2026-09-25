// Default "Business" post-form schemas.

import type { FormFieldDef, FormSection } from "../types";
import { basics, pairs } from "./shared";

const website: FormFieldDef = { key: "website", type: "text", label: "Website", placeholder: "https://", width: "half" };
const availability: FormFieldDef = { key: "availability", type: "text", label: "Availability", width: "half" };
const price = (label: string, required = false): FormFieldDef => ({
  key: "price",
  type: "currency",
  label,
  required,
  min: required ? 1 : 0,
  width: "half",
});

/** The simple "service" shape most business subcategories share. */
const service = (typeLabel: string, priceLabel: string, typeRequired = true): FormSection[] => [
  basics,
  {
    title: "Details",
    fields: [
      { key: "serviceType", type: "text", label: typeLabel, required: typeRequired },
      availability,
      price(priceLabel),
    ],
  },
];

export const BUSINESS_SUBCATEGORIES = [
  "Business For Sale / Lease",
  "B2B Service",
  "B2C Service",
  "Freelance Contractors",
  "Partnership Opportunities",
  "Equipment & Supplies",
  "Startup Support",
  "Training Opportunities",
  "Franchise Opportunities",
  "Business Events",
  "Financial Services",
  "Miscellaneous",
  "Wanted",
];

export function businessSections(subcategory: string): FormSection[] | null {
  switch (subcategory) {
    case "Business For Sale / Lease":
      return [
        basics,
        {
          title: "Business",
          fields: [
            price("Asking Price", true),
            {
              key: "ownership",
              type: "select",
              label: "Ownership",
              options: pairs([["sole-proprietor", "Sole Proprietor"], ["partnership", "Partnership"], ["private-limited", "Private Limited"], ["llp", "LLP"], ["other", "Other"]]),
            },
          ],
        },
      ];

    case "B2B Service":
      return [
        basics,
        {
          title: "Service",
          fields: [
            { key: "company", type: "text", label: "Business Name", required: true, width: "half" },
            {
              key: "industry",
              type: "select",
              label: "Industry",
              options: pairs([["manufacturing", "Manufacturing"], ["logistics", "Logistics"], ["wholesale", "Wholesale"], ["consulting", "Consulting"], ["it-services", "IT Services"], ["other", "Other"]]),
            },
            price("Price / Rate"),
            website,
          ],
        },
      ];

    case "B2C Service":
      return [
        basics,
        {
          title: "Service",
          fields: [
            { key: "targetAudience", type: "text", label: "Target Audience", width: "half" },
            availability,
            price("Price / Rate"),
            website,
          ],
        },
      ];

    case "Freelance Contractors":
      return [
        basics,
        {
          title: "Service",
          fields: [
            { key: "serviceType", type: "text", label: "Service Type", required: true },
            { key: "skills", type: "tags", label: "Skills", placeholder: "Type a skill and press Enter" },
            availability,
            price("Service Price"),
          ],
        },
      ];

    case "Partnership Opportunities":
      return [
        basics,
        {
          title: "Opportunity",
          fields: [
            { key: "projectType", type: "text", label: "Project Type", required: true, width: "half" },
            { key: "budgetAmount", type: "currency", label: "Budget", min: 0, width: "half" },
          ],
        },
      ];

    case "Equipment & Supplies":
      return [
        basics,
        {
          title: "Item",
          fields: [
            {
              key: "itemCategory",
              type: "select",
              label: "Item Category",
              options: pairs([["machinery", "Machinery"], ["tools", "Tools"], ["office_supplies", "Office Supplies"], ["construction_equipment", "Construction Equipment"], ["other", "Other"]]),
            },
            { key: "condition", type: "select", label: "Condition", options: pairs([["new", "New"], ["used", "Used"], ["refurbished", "Refurbished"]]) },
            { key: "brand", type: "text", label: "Brand", width: "half" },
            { key: "model", type: "text", label: "Model", width: "half" },
            { key: "quantity", type: "number", label: "Quantity", min: 1, width: "half" },
            price("Price", true),
          ],
        },
      ];

    case "Startup Support":
      return service("Support Type", "Price / Funding Required");

    case "Training Opportunities":
      return service("Training Type", "Price");

    case "Franchise Opportunities":
      return [
        basics,
        {
          title: "Franchise",
          fields: [
            { key: "company", type: "text", label: "Business Name", required: true, width: "half" },
            { key: "industry", type: "text", label: "Industry", required: true, width: "half" },
            { key: "investmentRequired", type: "currency", label: "Investment Required", required: true, min: 1, width: "half" },
            { key: "franchiseFee", type: "currency", label: "Franchise Fee", min: 0, width: "half" },
            { key: "royaltyFee", type: "number", label: "Royalty Fee", unit: "%", min: 0, max: 100, width: "half" },
            { key: "numberOfOutlets", type: "number", label: "Existing Outlets", min: 0, max: 100_000, width: "half" },
            { key: "locationAvailability", type: "text", label: "Location Availability" },
            { key: "trainingSupport", type: "textarea", label: "Training & Support" },
          ],
        },
      ];

    case "Business Events":
      return [
        basics,
        {
          title: "Event",
          fields: [
            { key: "startDate", type: "date", label: "Event Date", required: true, width: "half" },
            { key: "venue", type: "text", label: "Venue", required: true, width: "half" },
            price("Entry Fee"),
            website,
          ],
        },
      ];

    case "Financial Services":
      return [
        basics,
        {
          title: "Service",
          fields: [
            {
              key: "serviceType",
              type: "select",
              label: "Service Type",
              required: true,
              options: pairs([["accounting", "Accounting"], ["tax", "Tax"], ["investment", "Investment"], ["loan", "Loan"], ["insurance", "Insurance"], ["other", "Other"]]),
            },
            { key: "company", type: "text", label: "Company Name", width: "half" },
            { key: "licenseNumber", type: "text", label: "License / Registration No.", width: "half" },
            { key: "experience", type: "text", label: "Years of Experience", width: "half" },
            { key: "pricingModel", type: "select", label: "Pricing Model", options: pairs([["fixed", "Fixed"], ["hourly", "Hourly"], ["commission", "Commission"], ["custom", "Custom"]]) },
            website,
          ],
        },
      ];

    case "Miscellaneous":
      return service("Service Type", "Price", false);

    case "Wanted":
      return [
        basics,
        {
          title: "Looking For",
          fields: [
            { key: "budgetAmount", type: "currency", label: "Budget", min: 0, width: "half" },
            { key: "urgency", type: "select", label: "Urgency", options: pairs([["immediate", "Immediate"], ["within-month", "Within a Month"], ["flexible", "Flexible"]]) },
          ],
        },
      ];

    default:
      return null;
  }
}
