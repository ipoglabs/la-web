// Default "Business" post-form schemas.
//
// Option values are what the Business search filters match
// (components/create-alert/config/business.ts, lib/postFilterQuery.ts
// BUSINESS_FORM_FILTERS). Prices are `salePrice`, the field listing prices and
// the price filter read; Partnership and Wanted keep `budgetAmount` and
// Franchise keeps `investmentRequired`, which their price filters read.

import type { FormFieldDef, FormSection } from "../types";
import { basics, pairs, YES_NO } from "./shared";

const salePrice = (label = "Price", required = false): FormFieldDef => ({
  key: "salePrice",
  type: "currency",
  label,
  required,
  min: required ? 1 : 0,
  width: "half",
});
const priceUnit = (entries: [string, string][], label = "Price Per"): FormFieldDef => ({
  key: "priceUnit",
  type: "select",
  label,
  options: pairs(entries),
  width: "half",
});
const listedBy = (entries: [string, string][], required = true): FormFieldDef => ({
  key: "listedBy",
  type: "select",
  label: "Listed By",
  required,
  options: pairs(entries),
});
const yesNo = (key: string, label: string): FormFieldDef => ({ key, type: "select", label, options: YES_NO, width: "half" });
const link = (label: string): FormFieldDef => ({ key: "website", type: "text", label, placeholder: "https://", format: "url", width: "half" });

/** Industries, matching the Startup Support / Partnership / Wanted Industry filters. */
const INDUSTRIES: [string, string][] = [
  ["tech", "Tech"],
  ["fnb", "F&B"],
  ["retail", "Retail"],
  ["services", "Services"],
  ["manufacturing", "Manufacturing"],
  ["healthcare", "Healthcare"],
  ["education", "Education"],
  ["other", "Other"],
];

/** Work fields, matching the Field filter (components/create-alert/config/shared.ts field). */
const WORK_FIELDS: [string, string][] = [
  ["it", "IT & Tech"],
  ["finance", "Finance"],
  ["sales", "Sales & Marketing"],
  ["engineering", "Engineering"],
  ["healthcare", "Healthcare"],
  ["education", "Education"],
  ["admin", "Admin & Ops"],
  ["creative", "Creative"],
  ["hospitality", "Hospitality"],
  ["other", "Other"],
];
const MODES = pairs([["inperson", "In-person"], ["online", "Online"], ["hybrid", "Hybrid"]]);

/** Company types in each market's own words; the values are shared. */
const LEGAL_STRUCTURES: Record<string, [string, string][]> = {
  IN: [["sole-proprietor", "Sole Proprietorship"], ["partnership", "Partnership"], ["private-limited", "Private Limited"], ["llp", "LLP"]],
  GB: [["sole-proprietor", "Sole Trader"], ["partnership", "Partnership"], ["private-limited", "Limited Company"], ["llp", "LLP"]],
  SG: [["sole-proprietor", "Sole Proprietorship"], ["partnership", "Partnership"], ["private-limited", "Pte Ltd"], ["llp", "LLP"]],
};

/** Loans, investment and insurance are licensed in every market; their adverts must name the regulator. */
const REGULATED = ["loans", "investment", "insurance"];
const REGULATORS: Record<string, [string, string][]> = {
  IN: [["sebi", "SEBI"], ["rbi", "RBI"], ["irdai", "IRDAI"], ["other", "Other"]],
  GB: [["fca", "FCA"], ["other", "Other"]],
  SG: [["mas", "MAS"], ["other", "Other"]],
};
const PROFESSIONAL_BODIES: Record<string, [string, string][]> = {
  IN: [["icai", "ICAI"], ["icsi", "ICSI"], ["other", "Other"]],
  GB: [["icaew", "ICAEW"], ["acca", "ACCA"], ["ciot", "CIOT"], ["aat", "AAT"], ["other", "Other"]],
  SG: [["isca", "ISCA"], ["acra", "ACRA filing agent"], ["other", "Other"]],
};

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

export function businessSections(subcategory: string, country: string): FormSection[] | null {
  switch (subcategory) {
    case "Business For Sale / Lease":
      return [
        basics,
        {
          title: "Business",
          fields: [
            { key: "listingType", type: "select", label: "Listing Type", required: true, options: pairs([["sale", "For Sale"], ["lease", "For Lease"]]) },
            listedBy([["owner", "Owner"], ["broker", "Broker"]]),
            {
              key: "businessType",
              type: "select",
              label: "Business Type",
              required: true,
              options: pairs([
                ["fnb", "F&B"],
                ["retail", "Retail"],
                ["ecommerce", "E-commerce"],
                ["services", "Services"],
                ["manufacturing", "Manufacturing"],
                ["healthcare", "Healthcare"],
                ["education", "Education"],
                ["tech", "Tech"],
                ["other", "Other"],
              ]),
            },
            {
              ...salePrice("Price", true),
              hint: "For a lease, the premium or the rent",
            },
            // A lease is priced as a one-off premium or a monthly rent.
            { ...priceUnit([["premium", "One-off premium"], ["month", "Per month"]]), showWhen: { field: "listingType", in: ["lease"] } },
            {
              key: "ownership",
              type: "select",
              label: "Legal Structure",
              options: pairs([...(LEGAL_STRUCTURES[country] ?? LEGAL_STRUCTURES.IN), ["other", "Other"]]),
            },
            { key: "annualTurnover", type: "currency", label: "Annual Turnover", hint: "0 if not trading yet", min: 0, width: "half" },
            { key: "netProfit", type: "currency", label: "Net Profit", hint: "Per year", min: 0, width: "half" },
            { key: "staffCount", type: "number", label: "Staff", hint: "0 if you run it alone", min: 0, max: 10_000, width: "half" },
            { key: "yearsEstablished", type: "number", label: "Years Established", min: 0, max: 200, width: "half" },
            {
              key: "premises",
              type: "select",
              label: "Premises",
              options: pairs([["leasehold", "Leasehold"], ["freehold", "Freehold"], ["home", "Home-based"], ["online", "Online only"]]),
            },
            {
              key: "leaseRemaining",
              type: "text",
              label: "Lease Remaining",
              placeholder: "e.g. 3 years, rent 22,000 a year",
              showWhen: { field: "premises", in: ["leasehold"] },
            },
            {
              key: "includedInSale",
              type: "multiselect",
              label: "Included in Sale",
              options: pairs([
                ["stock", "Stock"],
                ["equipment", "Equipment"],
                ["licences", "Licences"],
                ["staff", "Staff"],
                ["clients", "Client base"],
                ["website", "Website / Domain"],
                ["ip", "IP"],
              ]),
            },
            { key: "reasonForSale", type: "text", label: "Reason for Sale", maxLength: 100 },
          ],
        },
      ];

    case "B2B Service":
      return [
        basics,
        {
          title: "Service",
          fields: [
            listedBy([["individual", "Individual"], ["agency", "Agency"], ["company", "Company"]]),
            { key: "company", type: "text", label: "Business Name", required: true, width: "half" },
            {
              key: "serviceType",
              type: "select",
              label: "Service Type",
              required: true,
              options: pairs([
                ["it", "IT & Tech"],
                ["legal", "Legal"],
                ["accounting", "Accounting"],
                ["marketing", "Marketing"],
                ["logistics", "Logistics"],
                ["hr", "HR & Recruitment"],
                ["security", "Security"],
                ["consulting", "Consulting"],
                ["facility", "Facility Management"],
                ["other", "Other"],
              ]),
            },
            {
              key: "engagement",
              type: "select",
              label: "Engagement",
              options: pairs([["oneoff", "One-off"], ["project", "Project-based"], ["retainer", "Retainer"]]),
            },
            salePrice(),
            priceUnit([
              ["hour", "Per hour"],
              ["day", "Per day"],
              ["month", "Per month (retainer)"],
              ["project", "Per project"],
              ["unit", "Per unit"],
              ["from", "Starting from"],
              ["quote", "Price on request"],
            ]),
            { key: "coverage", type: "text", label: "Coverage", placeholder: "e.g. UK-wide (remote)", width: "half" },
            { key: "minimumContract", type: "text", label: "Minimum Contract", placeholder: "e.g. 12 months, 20 parcels a week", width: "half" },
            { key: "accreditations", type: "tags", label: "Accreditations", placeholder: "e.g. ISO 9001 — press Enter", maxItems: 10 },
            yesNo("insured", "Insured"),
            link("Website"),
          ],
        },
      ];

    case "B2C Service":
      return [
        basics,
        {
          title: "Service",
          fields: [
            listedBy([["individual", "Individual"], ["company", "Company"]]),
            {
              key: "serviceType",
              type: "select",
              label: "Service Type",
              required: true,
              options: pairs([
                ["home", "Home Services"],
                ["health", "Health & Beauty"],
                ["education", "Education"],
                ["events", "Events"],
                ["repairs", "Repairs"],
                ["delivery", "Delivery"],
                ["other", "Other"],
              ]),
            },
            {
              key: "serviceMode",
              type: "multiselect",
              label: "Service Mode",
              options: pairs([["inperson", "At my place"], ["homevisit", "Home visit"], ["online", "Online"]]),
            },
            { key: "availability", type: "text", label: "Availability", placeholder: "e.g. Mon–Sat, 9am–6pm", width: "half" },
            salePrice(),
            priceUnit([["visit", "Per visit"], ["hour", "Per hour"], ["job", "Per job"], ["month", "Per month"], ["from", "Starting from"]]),
            link("Website"),
          ],
        },
      ];

    case "Freelance Contractors":
      return [
        basics,
        {
          title: "Contractor",
          fields: [
            { key: "workField", type: "select", label: "Field", required: true, options: pairs(WORK_FIELDS) },
            { key: "skills", type: "tags", label: "Skills", placeholder: "Type a skill and press Enter" },
            {
              key: "experience",
              type: "select",
              label: "Experience Level",
              options: pairs([["entry", "Entry"], ["mid", "Mid"], ["senior", "Senior"], ["lead", "Lead"], ["manager", "Manager"]]),
            },
            { key: "yearsExperience", type: "number", label: "Years of Experience", min: 0, max: 50, width: "half" },
            {
              key: "workArrangement",
              type: "multiselect",
              label: "Work Arrangement",
              options: pairs([["onsite", "On-site"], ["hybrid", "Hybrid"], ["remote", "Remote"]]),
            },
            { key: "availableFrom", type: "date", label: "Available From", immediateOption: "Available now", width: "half" },
            ...(country === "GB"
              ? [
                  {
                    key: "ir35",
                    type: "select",
                    label: "IR35 Status",
                    options: pairs([["outside", "Outside IR35"], ["inside", "Inside IR35"], ["either", "Either"]]),
                    width: "half",
                  } satisfies FormFieldDef,
                ]
              : []),
            salePrice("Rate"),
            priceUnit([["hour", "Per hour"], ["day", "Per day"], ["project", "Per project"]], "Rate Per"),
            link("Portfolio"),
          ],
        },
      ];

    case "Partnership Opportunities":
      return [
        basics,
        {
          title: "Opportunity",
          fields: [
            {
              key: "lookingFor",
              type: "select",
              label: "Looking For",
              required: true,
              options: pairs([["cofounder", "Co-founder"], ["investor", "Investor"], ["partner", "Business Partner"], ["jv", "Joint Venture"], ["other", "Other"]]),
            },
            { key: "industry", type: "select", label: "Industry", required: true, options: pairs(INDUSTRIES) },
            {
              key: "stage",
              type: "select",
              label: "Stage",
              options: pairs([["idea", "Idea"], ["mvp", "MVP"], ["early", "Early Revenue"], ["growth", "Growth"], ["established", "Established"]]),
            },
            {
              key: "roleNeeded",
              type: "text",
              label: "Role Needed",
              placeholder: "e.g. CTO / Tech Co-Founder",
              width: "half",
              showWhen: { field: "lookingFor", in: ["cofounder", "partner"] },
            },
            {
              key: "commitment",
              type: "select",
              label: "Commitment",
              options: pairs([["fulltime", "Full-time"], ["parttime", "Part-time"], ["flexible", "Flexible"]]),
            },
            { key: "budgetAmount", type: "currency", label: "Investment Amount", min: 0, width: "half" },
            { key: "equityOffered", type: "number", label: "Equity Offered", unit: "%", min: 0, max: 100, width: "half" },
            {
              key: "offering",
              type: "multiselect",
              label: "Offering",
              options: pairs([["equity", "Equity"], ["profit_share", "Profit share"], ["revenue_share", "Revenue share"], ["salary", "Salary"]]),
            },
          ],
        },
      ];

    case "Equipment & Supplies":
      return [
        basics,
        {
          title: "Item",
          fields: [
            { key: "listingType", type: "select", label: "Listing Type", required: true, options: pairs([["sale", "For Sale"], ["rent", "For Rent / Lease"]]) },
            listedBy([["private", "Private"], ["dealer", "Dealer"]]),
            {
              key: "itemCategory",
              type: "select",
              label: "Item Category",
              required: true,
              options: pairs([
                ["industrial", "Industrial"],
                ["office", "Office"],
                ["kitchen", "Kitchen & F&B"],
                ["medical", "Medical & Lab"],
                ["construction", "Construction"],
                ["it", "IT & Tech"],
                ["retail", "Retail"],
                ["other", "Other"],
              ]),
            },
            {
              key: "condition",
              type: "select",
              label: "Condition",
              options: pairs([["new", "New"], ["like_new", "Like New"], ["used", "Used"], ["refurbished", "Refurbished"], ["for_parts", "For Parts"]]),
            },
            { key: "brand", type: "text", label: "Brand", width: "half" },
            { key: "model", type: "text", label: "Model", width: "half" },
            { key: "quantity", type: "number", label: "Quantity", min: 1, width: "half" },
            salePrice("Price", true),
            { ...priceUnit([["day", "Per day"], ["week", "Per week"], ["month", "Per month"]]), showWhen: { field: "listingType", in: ["rent"] } },
            {
              key: "delivery",
              type: "select",
              label: "Collection / Delivery",
              options: pairs([["collection", "Collection only"], ["delivery", "Delivery available"], ["installation", "Delivery & installation"]]),
            },
            yesNo("warranty", "Warranty"),
          ],
        },
      ];

    case "Startup Support":
      return [
        basics,
        {
          title: "Support",
          fields: [
            listedBy([["mentor", "Individual mentor"], ["organisation", "Organisation"], ["government", "Government programme"]]),
            {
              key: "serviceType",
              type: "select",
              label: "Support Type",
              required: true,
              options: pairs([
                ["mentoring", "Mentoring"],
                ["funding", "Funding"],
                ["incubator", "Incubator"],
                ["accelerator", "Accelerator"],
                ["coworking", "Co-working"],
                ["legal", "Legal"],
                ["networking", "Networking"],
                ["tech", "Tech Support"],
                ["other", "Other"],
              ]),
            },
            { key: "industries", type: "multiselect", label: "Industries Served", options: pairs([["all", "All industries"], ...INDUSTRIES]) },
            {
              key: "stages",
              type: "multiselect",
              label: "Stages Served",
              options: pairs([["idea", "Idea"], ["mvp", "MVP"], ["early", "Early Revenue"], ["growth", "Growth"]]),
            },
            { key: "format", type: "select", label: "Format", options: MODES },
            yesNo("takesEquity", "Takes Equity"),
            { ...salePrice(), hint: "0 if free" },
            priceUnit([["session", "Per session"], ["month", "Per month"], ["programme", "Per programme"], ["from", "Starting from"], ["equity", "Equity only"]]),
          ],
        },
      ];

    case "Training Opportunities":
      return [
        basics,
        {
          title: "Training",
          fields: [
            listedBy([["trainer", "Trainer"], ["company", "Training Company"], ["institution", "Institution"]]),
            { key: "workField", type: "select", label: "Field", required: true, options: pairs(WORK_FIELDS) },
            { key: "mode", type: "select", label: "Mode", required: true, options: MODES },
            {
              key: "duration",
              type: "select",
              label: "Duration",
              options: pairs([["1d", "Under 1 day"], ["3d", "1–3 days"], ["4w", "1–4 weeks"], ["3m", "1–3 months"], ["3mup", "Over 3 months"]]),
            },
            { key: "startDate", type: "date", label: "Start Date", immediateOption: "Ongoing / self-paced", width: "half" },
            { key: "seats", type: "number", label: "Seats", min: 1, max: 500, width: "half" },
            {
              key: "certificate",
              type: "select",
              label: "Certificate",
              options: pairs([["accredited", "Accredited certificate"], ["completion", "Certificate of completion"], ["none", "None"]]),
            },
            salePrice(),
            priceUnit([["person", "Per person"], ["group", "Per group"], ["course", "Full course"]]),
          ],
        },
      ];

    case "Franchise Opportunities":
      return [
        basics,
        {
          title: "Franchise",
          fields: [
            { key: "company", type: "text", label: "Business Name", required: true, width: "half" },
            {
              key: "franchiseCategory",
              type: "select",
              label: "Category",
              required: true,
              options: pairs([
                ["fnb", "F&B"],
                ["retail", "Retail"],
                ["education", "Education"],
                ["services", "Services"],
                ["fitness", "Fitness"],
                ["healthcare", "Healthcare"],
                ["beauty", "Beauty"],
                ["other", "Other"],
              ]),
            },
            {
              key: "franchiseType",
              type: "multiselect",
              label: "Franchise Type",
              required: true,
              options: pairs([["unit", "Unit Franchise"], ["master", "Master Franchise"], ["area", "Area Developer"]]),
            },
            { key: "investmentRequired", type: "currency", label: "Investment Required", required: true, min: 1, width: "half" },
            { key: "franchiseFee", type: "currency", label: "Franchise Fee", min: 0, width: "half" },
            { key: "royaltyFee", type: "number", label: "Royalty Fee", unit: "%", min: 0, max: 100, width: "half" },
            { key: "numberOfOutlets", type: "number", label: "Existing Outlets", min: 0, max: 100_000, width: "half" },
            { key: "spaceRequired", type: "number", label: "Space Required", unit: country === "SG" ? "sq m" : "sq ft", min: 0, max: 1_000_000, width: "half" },
            { key: "paybackMonths", type: "number", label: "Payback Period", unit: "months", min: 1, max: 120, width: "half" },
            yesNo("exclusiveTerritory", "Exclusive Territory"),
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
            {
              key: "eventType",
              type: "select",
              label: "Event Type",
              required: true,
              options: pairs([
                ["networking", "Networking"],
                ["conference", "Conference"],
                ["tradeshow", "Trade Show"],
                ["workshop", "Workshop"],
                ["webinar", "Webinar"],
                ["other", "Other"],
              ]),
            },
            { key: "mode", type: "select", label: "Mode", required: true, options: MODES },
            { key: "startDate", type: "date", label: "Start Date", required: true, width: "half" },
            { key: "endDate", type: "date", label: "End Date", hint: "For events over several days", width: "half" },
            { key: "startTime", type: "text", label: "Start Time", placeholder: "e.g. 6:30 pm", width: "half" },
            { key: "venue", type: "text", label: "Venue", required: true, width: "half", showWhen: { field: "mode", in: ["inperson", "hybrid"] } },
            { key: "capacity", type: "number", label: "Capacity", min: 1, max: 10_000, width: "half" },
            {
              key: "organisedBy",
              type: "select",
              label: "Organised By",
              options: pairs([["organiser", "Organiser"], ["venue", "Venue"], ["community", "Community group"], ["company", "Company"]]),
            },
            { ...salePrice("Entry Fee"), hint: "0 if free" },
            link("Registration Link"),
          ],
        },
      ];

    case "Financial Services":
      return [
        basics,
        {
          title: "Service",
          fields: [
            listedBy([["individual", "Individual"], ["company", "Firm"]]),
            {
              key: "serviceType",
              type: "select",
              label: "Service Type",
              required: true,
              options: pairs([
                ["loans", "Business Loans"],
                ["investment", "Investment"],
                ["insurance", "Insurance"],
                ["accounting", "Accounting"],
                ["tax", "Tax Advisory"],
                ["other", "Other"],
              ]),
            },
            { key: "company", type: "text", label: "Company Name", width: "half" },
            {
              key: "regulator",
              type: "select",
              label: "Regulated By",
              required: true,
              options: pairs(REGULATORS[country] ?? REGULATORS.IN),
              showWhen: { field: "serviceType", in: REGULATED },
            },
            { key: "licenseNumber", type: "text", label: "Licence / Registration No.", required: true, width: "half", showWhen: { field: "serviceType", in: REGULATED } },
            {
              key: "professionalBody",
              type: "select",
              label: "Professional Body",
              options: pairs(PROFESSIONAL_BODIES[country] ?? PROFESSIONAL_BODIES.IN),
              showWhen: { field: "serviceType", notIn: REGULATED },
            },
            { key: "membershipNumber", type: "text", label: "Membership No.", width: "half", showWhen: { field: "serviceType", notIn: REGULATED } },
            { key: "yearsExperience", type: "number", label: "Years of Experience", min: 0, max: 60, width: "half" },
            { key: "pricingModel", type: "select", label: "Pricing Model", options: pairs([["fixed", "Fixed"], ["hourly", "Hourly"], ["commission", "Commission"], ["custom", "Custom"]]) },
            salePrice(),
            priceUnit([["hour", "Per hour"], ["month", "Per month"], ["filing", "Per return / filing"], ["fixed", "Fixed fee"], ["from", "Starting from"]]),
            link("Website"),
          ],
        },
      ];

    case "Miscellaneous":
      return [
        basics,
        {
          title: "Details",
          fields: [
            listedBy([["individual", "Individual"], ["business", "Business"]], false),
            { key: "serviceType", type: "text", label: "What's Offered" },
            { key: "availability", type: "text", label: "Availability", width: "half" },
            salePrice(),
            priceUnit([["item", "Per item"], ["hour", "Per hour"], ["month", "Per month"], ["from", "Starting from"]]),
          ],
        },
      ];

    case "Wanted":
      return [
        basics,
        {
          title: "Looking For",
          fields: [
            {
              key: "lookingFor",
              type: "select",
              label: "Looking For",
              required: true,
              options: pairs([
                ["business", "Business to buy"],
                ["lease", "Business to lease"],
                ["equipment", "Equipment & supplies"],
                ["provider", "Service provider"],
                ["partner", "Partner / Investor"],
                ["franchise", "Franchise"],
                ["premises", "Commercial premises"],
                ["other", "Other"],
              ]),
            },
            { key: "industry", type: "select", label: "Industry", options: pairs(INDUSTRIES) },
            { key: "budgetAmount", type: "currency", label: "Budget", min: 0, width: "half" },
            {
              key: "urgency",
              type: "select",
              label: "Urgency",
              options: pairs([["immediate", "Immediate"], ["week", "This week"], ["month", "Within a month"], ["flexible", "Flexible"]]),
            },
          ],
        },
      ];

    default:
      return null;
  }
}
