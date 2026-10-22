// Default "Services" post-form schemas.

import type { FormFieldDef, FormSection } from "../types";
import { basics, opts, pairs, YES_NO } from "./shared";

const price = (label = "Price", required = true): FormFieldDef => ({
  key: "price",
  type: "currency",
  label,
  required,
  min: required ? 1 : 0,
  width: "half",
});
const availability: FormFieldDef = { key: "availability", type: "text", label: "Availability", placeholder: "e.g. Mon–Sat, 9am–6pm", width: "half" };
const experience: FormFieldDef = { key: "experience", type: "text", label: "Experience", placeholder: "e.g. 5 years", width: "half" };
const qualification: FormFieldDef = { key: "qualification", type: "text", label: "Qualification", width: "half" };
const mode: FormFieldDef = { key: "mode", type: "select", label: "Mode", options: pairs([["online", "Online"], ["offline", "In Person"], ["both", "Both"]]) };
const rateType = (entries: [string, string][]): FormFieldDef => ({ key: "rateType", type: "select", label: "Rate Type", options: pairs(entries) });

// Reworked Services forms. Option values are what the Services search
// filters match (components/create-alert/config/services.ts,
// lib/postFilterQuery.ts). Price is `salePrice`, the field listing prices and
// the price filter read.
const salePrice = (label = "Price", required = true): FormFieldDef => ({
  key: "salePrice",
  type: "currency",
  label,
  required,
  min: required ? 1 : 0,
  width: "half",
});
const priceUnit = (entries: [string, string][]): FormFieldDef => ({ key: "priceUnit", type: "select", label: "Price Per", options: pairs(entries), width: "half" });
const yearsOfExperience: FormFieldDef = {
  key: "experience",
  type: "select",
  label: "Years of Experience",
  options: pairs([["0-1", "Under 1 year"], ["1-3", "1–3 years"], ["3-5", "3–5 years"], ["5-10", "5–10 years"], ["10+", "10+ years"]]),
};
const providerListedBy = (entries: [string, string][]): FormFieldDef => ({ key: "listedBy", type: "select", label: "Listed By", required: true, options: pairs(entries) });

/** Home Services types. AC Service in IN and SG, Heating & Boiler in GB. */
const homeServiceTypes = (country: string): [string, string][] => [
  ["cleaning", "Cleaning"],
  ["plumbing", "Plumbing"],
  ["electrical", "Electrical"],
  ["carpentry", "Carpentry"],
  ["painting", "Painting"],
  ["renovation", "Renovation"],
  ["pest", "Pest Control"],
  country === "GB" ? ["heating", "Heating & Boiler"] : ["ac", "AC Service"],
  ["appliance", "Appliance Repair"],
  ["landscaping", "Gardening / Landscaping"],
  ["handyman", "Handyman"],
  ["other", "Other"],
];

/** Service Mode for subs the How filter doesn't cover; values match its "inperson" / "online". */
const onlineOrInPerson: FormFieldDef = {
  key: "serviceMode",
  type: "multiselect",
  label: "Service Mode",
  options: pairs([["online", "Online"], ["inperson", "In-person"]]),
};

/** Service Mode matching the How filter (components/create-alert/config/shared.ts serviceMode). */
const howServiceMode = (homeVisitLabel = "Home visit"): FormFieldDef => ({
  key: "serviceMode",
  type: "multiselect",
  label: "Service Mode",
  options: pairs([["inperson", "At my place"], ["homevisit", homeVisitLabel], ["online", "Online"]]),
});

/** Tutoring levels in each market's words. Search groups them under the Level filter's
 *  Primary / Secondary / College / Adult (TUTORING_LEVELS in lib/postFilterQuery.ts). */
const TUTORING_LEVELS: Record<string, [string, string][]> = {
  IN: [["primary", "Primary"], ["middle", "Middle School"], ["secondary", "Secondary (10th)"], ["higher-secondary", "Higher Secondary (12th)"], ["college", "College"], ["competitive", "Competitive Exams"], ["adult", "Adult"]],
  GB: [["primary", "Primary"], ["ks3", "KS3"], ["gcse", "GCSE"], ["a_level", "A-Level"], ["university", "University"], ["adult", "Adult"]],
  SG: [["primary", "Primary (PSLE)"], ["o_level", "Secondary (O-Level)"], ["a_level", "JC (A-Level)"], ["ib", "IB"], ["university", "Poly / University"], ["adult", "Adult"]],
};
const CURRICULA: Record<string, [string, string][]> = {
  IN: [["cbse", "CBSE"], ["icse", "ICSE"], ["state", "State Board"], ["ib", "IB"], ["igcse", "IGCSE"]],
  GB: [["aqa", "AQA"], ["edexcel", "Edexcel"], ["ocr", "OCR"], ["ib", "IB"]],
  SG: [["moe", "MOE"], ["ib", "IB"], ["igcse", "IGCSE"]],
};

const BUSINESS_REG_LABEL: Record<string, string> = { IN: "GSTIN", GB: "Companies House No.", SG: "UEN" };

export const SERVICES_SUBCATEGORIES = [
  "Home Services",
  "Business Services",
  "Health & Fitness",
  "Tutoring",
  "Education & Learning",
  "Travel & Tourism",
  "Food & Dining",
  "Technology & Gadgets",
  "Creative Services",
  "Other Services",
  "Wanted",
];

export function servicesSections(subcategory: string, country: string): FormSection[] | null {
  switch (subcategory) {
    case "Home Services":
      return [
        basics,
        {
          title: "Service",
          fields: [
            providerListedBy([["individual", "Individual"], ["company", "Company"]]),
            { key: "serviceType", type: "select", label: "Service Type", required: true, options: pairs(homeServiceTypes(country)) },
            salePrice("Service Charge"),
            priceUnit([["visit", "Per visit"], ["hour", "Per hour"], ["day", "Per day"], ["job", "Per job"], ["from", "Starting from"]]),
            {
              key: "frequency",
              type: "multiselect",
              label: "Frequency",
              options: pairs([["once", "One-time"], ["weekly", "Weekly"], ["fortnightly", "Fortnightly"], ["monthly", "Monthly"]]),
            },
            { key: "emergency", type: "select", label: "Same-day / Emergency", options: YES_NO, width: "half" },
            { key: "insured", type: "select", label: "Insured", options: YES_NO, width: "half" },
            ...(country === "GB"
              ? [{ key: "registrationNo", type: "text", label: "Gas Safe / NICEIC No.", placeholder: "e.g. Gas Safe 123456", width: "half" } satisfies FormFieldDef]
              : []),
            yearsOfExperience,
            availability,
          ],
        },
      ];

    case "Business Services":
      return [
        basics,
        {
          title: "Service",
          fields: [
            providerListedBy([["freelancer", "Freelancer"], ["agency", "Agency"], ["company", "Company"]]),
            {
              key: "serviceType",
              type: "select",
              label: "Service Type",
              required: true,
              options: pairs([
                ["accounting", "Accounting & Tax"],
                ["legal", "Legal"],
                ["marketing", "Marketing"],
                ["it_support", "IT Support"],
                ["hr_payroll", "HR & Payroll"],
                ["company_registration", "Company Registration"],
                ["admin", "Virtual Assistant / Admin"],
                ["logistics", "Logistics"],
                ["security", "Security"],
                ["consulting", "Consulting"],
                ["printing", "Printing"],
                ["other", "Other"],
              ]),
            },
            // Many firms quote per job, so Price stays optional.
            salePrice("Price", false),
            priceUnit([["hour", "Per hour"], ["month", "Per month (retainer)"], ["project", "Per project"], ["fixed", "Fixed fee"]]),
            onlineOrInPerson,
            { key: "businessRegNo", type: "text", label: BUSINESS_REG_LABEL[country] ?? "Business Registration No.", width: "half" },
            yearsOfExperience,
            availability,
          ],
        },
      ];

    case "Health & Fitness":
      return [
        basics,
        {
          title: "Service",
          fields: [
            providerListedBy([["individual", "Individual"], ["studio", "Studio / Clinic"]]),
            {
              key: "serviceType",
              type: "select",
              label: "Service Type",
              required: true,
              options: pairs([
                ["pt", "Personal Training"],
                ["yoga", "Yoga / Pilates"],
                ["massage", "Massage"],
                ["spa", "Spa"],
                ["nutrition", "Nutrition"],
                ["physio", "Physiotherapy"],
                ["mental_health", "Mental Health"],
                ["meditation", "Meditation"],
                ["other", "Other"],
              ]),
            },
            howServiceMode(),
            salePrice("Consultation Fee"),
            priceUnit([["session", "Per session"], ["month", "Per month"], ["package", "Per package"]]),
            { key: "sessionLength", type: "select", label: "Session Length", options: pairs([["30", "30 min"], ["45", "45 min"], ["60", "60 min"], ["90", "90 min"]]), width: "half" },
            { key: "freeTrial", type: "select", label: "Free Trial", options: YES_NO, width: "half" },
            qualification,
            yearsOfExperience,
            availability,
          ],
        },
      ];

    case "Tutoring":
      return [
        basics,
        {
          title: "Tutoring",
          // Subjects / Levels are lists, saved in attributes — Post.subject and
          // Post.level are single strings.
          fields: [
            {
              key: "subjects",
              type: "multiselect",
              label: "Subjects",
              required: true,
              options: pairs([["maths", "Maths"], ["science", "Science"], ["english", "English"], ["languages", "Languages"], ["music", "Music"], ["coding", "Coding"], ["other", "Other"]]),
            },
            { key: "otherSubject", type: "text", label: "Other Subject", placeholder: "e.g. Economics, 11+ prep", showWhen: { field: "subjects", in: ["other"] } },
            { key: "levels", type: "multiselect", label: "Level", options: pairs(TUTORING_LEVELS[country] ?? TUTORING_LEVELS.IN) },
            { key: "curriculum", type: "multiselect", label: country === "GB" ? "Exam Board" : "Curriculum / Board", options: pairs(CURRICULA[country] ?? CURRICULA.IN) },
            { key: "lessonFormat", type: "multiselect", label: "Lesson Format", options: pairs([["one_to_one", "One-to-one"], ["group", "Small group"]]) },
            howServiceMode("Student's home"),
            {
              key: "tutorType",
              type: "select",
              label: "Tutor Type",
              options: pairs([["part_time", "Part-time tutor"], ["full_time", "Full-time tutor"], ["teacher", "Current / former school teacher"]]),
            },
            qualification,
            yearsOfExperience,
            salePrice("Fee"),
            priceUnit([["hour", "Per hour"], ["session", "Per session"], ["month", "Per month"]]),
            ...(country === "GB" ? [{ key: "dbsChecked", type: "select", label: "DBS Checked", options: YES_NO, width: "half" } satisfies FormFieldDef] : []),
            { key: "freeTrial", type: "select", label: "Free Trial Lesson", options: YES_NO, width: "half" },
            availability,
          ],
        },
      ];

    case "Education & Learning":
      return [
        basics,
        {
          title: "Course",
          fields: [
            {
              key: "educationType",
              type: "select",
              label: "Education Type",
              options: pairs([["tutoring", "Tutoring"], ["coaching", "Coaching"], ["online", "Online Course"], ["school", "School"], ["language", "Language"], ["professional", "Professional"]]),
            },
            { key: "subject", type: "text", label: "Subject / Course", width: "half" },
            qualification,
            mode,
            experience,
            price("Fees"),
            availability,
          ],
        },
      ];

    case "Travel & Tourism":
      return [
        basics,
        {
          title: "Travel",
          fields: [
            { key: "serviceType", type: "select", label: "Service Type", options: pairs([["tour", "Tour"], ["package", "Package"], ["guide", "Guide"], ["transport", "Transport"], ["other", "Other"]]) },
            { key: "destination", type: "text", label: "Destination", width: "half" },
            { key: "durationText", type: "text", label: "Duration", placeholder: "e.g. 3 nights / 4 days", width: "half" },
            { key: "packageDetails", type: "textarea", label: "Package Details" },
            { key: "agencyName", type: "text", label: "Agency Name", width: "half" },
            price(),
            availability,
          ],
        },
      ];

    case "Food & Dining":
      return [
        basics,
        {
          title: "Food",
          fields: [
            {
              key: "serviceType",
              type: "select",
              label: "Service Type",
              options: pairs([["home-cooked", "Home Cooked"], ["tiffin", "Tiffin"], ["catering", "Catering"], ["restaurant", "Restaurant"], ["cloud-kitchen", "Cloud Kitchen"]]),
            },
            { key: "cuisineType", type: "text", label: "Cuisine Type", width: "half" },
            price(),
            { key: "dietaryOptions", type: "multiselect", label: "Dietary Options", options: opts(["Vegetarian", "Vegan", "Non-Vegetarian", "Halal", "Jain", "Gluten-Free"]) },
            { key: "deliveryAvailable", type: "select", label: "Delivery Available", options: YES_NO },
          ],
        },
      ];

    case "Technology & Gadgets":
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
              options: pairs([["it-support", "IT Support"], ["software-development", "Software Development"], ["web-design", "Web Design"], ["networking", "Networking"], ["repair", "Repair"], ["consulting", "Consulting"], ["other", "Other"]]),
            },
            { key: "skills", type: "tags", label: "Skills / Tools", placeholder: "Type a skill and press Enter" },
            rateType([["hourly", "Hourly"], ["daily", "Daily"], ["monthly", "Monthly"], ["project", "Per Project"], ["negotiable", "Negotiable"]]),
            price(),
            availability,
          ],
        },
      ];

    case "Creative Services":
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
              options: pairs([["graphic-design", "Graphic Design"], ["photography", "Photography"], ["videography", "Videography"], ["writing", "Writing"], ["music-audio", "Music & Audio"], ["web-design", "Web Design"], ["other", "Other"]]),
            },
            { key: "skills", type: "tags", label: "Skills / Tools", placeholder: "Type a skill and press Enter" },
            rateType([["hourly", "Hourly"], ["per-project", "Per Project"], ["per-day", "Per Day"]]),
            price(),
            availability,
          ],
        },
      ];

    case "Other Services":
      return [
        basics,
        {
          title: "Service",
          fields: [
            { key: "serviceType", type: "select", label: "Service Type", options: pairs([["repair", "Repair"], ["consultancy", "Consultancy"], ["misc", "Miscellaneous"], ["other", "Other"]]) },
            price(),
            availability,
          ],
        },
      ];

    case "Wanted":
      return [
        basics,
        {
          title: "Service Needed",
          fields: [
            { key: "serviceType", type: "text", label: "Service Needed", required: true },
            { key: "budgetAmount", type: "currency", label: "Budget", min: 0, width: "half" },
            { key: "urgency", type: "select", label: "Urgency", options: pairs([["immediate", "Immediate"], ["within-a-week", "Within a Week"], ["flexible", "Flexible"]]) },
          ],
        },
      ];

    default:
      return null;
  }
}
