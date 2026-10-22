// Default "Services" post-form schemas.

import type { FormFieldDef, FormSection } from "../types";
import { basics, opts, pairs, YES_NO } from "./shared";

const availability: FormFieldDef = { key: "availability", type: "text", label: "Availability", placeholder: "e.g. Mon–Sat, 9am–6pm", width: "half" };
const qualification: FormFieldDef = { key: "qualification", type: "text", label: "Qualification", width: "half" };

// Option values are what the Services search
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

/** Dietary options per market: Jain and Eggless matter in IN, allergens in GB and SG. */
const DIETARY_OPTIONS: Record<string, [string, string][]> = {
  IN: [["veg", "Vegetarian"], ["vegan", "Vegan"], ["nonveg", "Non-Vegetarian"], ["jain", "Jain"], ["eggless", "Eggless"], ["gluten_free", "Gluten-Free"]],
  GB: [["veg", "Vegetarian"], ["vegan", "Vegan"], ["halal", "Halal"], ["gluten_free", "Gluten-Free"], ["dairy_free", "Dairy-Free"], ["nut_free", "Nut-Free"]],
  SG: [["veg", "Vegetarian"], ["vegan", "Vegan"], ["halal", "Halal"], ["gluten_free", "Gluten-Free"], ["dairy_free", "Dairy-Free"], ["nut_free", "Nut-Free"]],
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
          // Course Name, Duration and Start Date are Post paths (subject,
          // duration, startDate); the rest are saved in attributes.
          fields: [
            {
              key: "courseCategory",
              type: "select",
              label: "Category",
              required: true,
              options: pairs([
                ["languages", "Languages"],
                ["music", "Music"],
                ["arts", "Arts & Crafts"],
                ["dance", "Dance"],
                ["tech", "Tech & Coding"],
                ["cooking", "Cooking"],
                ["business", "Business Skills"],
                ["personal", "Personal Development"],
                ["exam", "Exam Coaching"],
                ["other", "Other"],
              ]),
            },
            { key: "subject", type: "text", label: "Course Name", required: true, placeholder: "e.g. IELTS Preparation, Beginner Guitar", width: "half" },
            { key: "courseFormat", type: "select", label: "Format", required: true, options: pairs([["class", "Class"], ["workshop", "Workshop"], ["course", "Course"], ["onetoone", "One-to-one"]]) },
            howServiceMode(),
            { key: "ageGroup", type: "multiselect", label: "Age Group", options: pairs([["kids", "Kids"], ["teens", "Teens"], ["adults", "Adults"], ["all", "All ages"]]) },
            { key: "duration", type: "text", label: "Duration", placeholder: "e.g. 8 weeks, 2 days", width: "half" },
            { key: "startDate", type: "date", label: "Start Date", immediateOption: "Ongoing", width: "half" },
            salePrice("Fees"),
            priceUnit([["class", "Per class"], ["month", "Per month"], ["course", "Full course"]]),
            { key: "certificate", type: "select", label: "Certificate", options: YES_NO, width: "half" },
            qualification,
            availability,
          ],
        },
      ];

    case "Travel & Tourism": {
      const tourPackage = { field: "serviceType", in: ["tour_package"] };
      return [
        basics,
        {
          title: "Travel",
          fields: [
            {
              key: "serviceType",
              type: "select",
              label: "Service Type",
              required: true,
              options: pairs([
                ["tour_package", "Tour Package"],
                ["tour_guide", "Tour Guide"],
                ["travel_agent", "Travel Agent / Bookings"],
                ["visa", "Visa Assistance"],
                ["transfer", "Airport Transfer"],
                ["car_hire", "Car / Coach Hire"],
                ["planning", "Trip Planning"],
                ["other", "Other"],
              ]),
            },
            { key: "destination", type: "text", label: "Destination", width: "half" },
            { key: "destinationType", type: "select", label: "Destination Type", options: pairs([["domestic", "Domestic"], ["international", "International"]]), width: "half" },
            { key: "nights", type: "number", label: "Nights", min: 0, max: 90, width: "half", showWhen: tourPackage },
            { key: "days", type: "number", label: "Days", min: 1, max: 90, gteField: "nights", width: "half", showWhen: tourPackage },
            {
              key: "inclusions",
              type: "multiselect",
              label: "Inclusions",
              options: pairs([["flights", "Flights"], ["hotel", "Hotel"], ["meals", "Meals"], ["transfers", "Transfers"], ["sightseeing", "Sightseeing"], ["guide", "Guide"]]),
              showWhen: tourPackage,
            },
            salePrice(),
            priceUnit([["person", "Per person"], ["group", "Per group"], ["day", "Per day"], ["trip", "Per trip"]]),
            ...(country === "GB" ? [{ key: "atolProtected", type: "select", label: "ATOL Protected", options: YES_NO, width: "half" } satisfies FormFieldDef] : []),
            ...(country === "SG" ? [{ key: "stbLicenceNo", type: "text", label: "STB Licence No.", width: "half" } satisfies FormFieldDef] : []),
            { key: "agencyName", type: "text", label: "Agency Name", width: "half" },
            { ...availability, label: "Travel Dates", placeholder: "e.g. Departures every Friday, Oct–Mar" },
          ],
        },
      ];
    }

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
              required: true,
              options: pairs([
                ["home_cooked", "Home Cooked Meals"],
                ["meal_prep", country === "IN" ? "Tiffin / Meal Subscription" : "Meal Prep"],
                ["catering", "Catering"],
                ["chef", "Personal Chef"],
                ["baking", "Baking & Cakes"],
                ["bartending", "Bartending"],
                ["other", "Other"],
              ]),
            },
            // A list, saved in attributes — Post.cuisineType is a single string.
            { key: "cuisines", type: "tags", label: "Cuisine Type", placeholder: "Type a cuisine and press Enter", maxItems: 5 },
            { key: "dietaryOptions", type: "multiselect", label: "Dietary Options", options: pairs(DIETARY_OPTIONS[country] ?? DIETARY_OPTIONS.IN) },
            { key: "occasions", type: "multiselect", label: "Occasions", options: pairs([["daily", "Daily Meals"], ["wedding", "Wedding"], ["corporate", "Corporate"], ["birthday", "Birthday"], ["party", "Party"]]) },
            { key: "deliveryOption", type: "select", label: "Delivery / Pickup", options: pairs([["delivery", "Delivery"], ["pickup", "Pickup"], ["both", "Both"]]) },
            salePrice(),
            priceUnit([["plate", "Per plate / person"], ["meal", "Per meal"], ["month", "Per month"], ["order", "Per order"]]),
            { key: "minOrder", type: "number", label: "Minimum Order", unit: "guests", min: 1, max: 10000, width: "half" },
            country === "GB"
              ? { key: "hygieneRating", type: "select", label: "Food Hygiene Rating", options: opts(["0", "1", "2", "3", "4", "5"]), width: "half" }
              : { key: "foodLicence", type: "text", label: country === "SG" ? "SFA Licence No." : "FSSAI Registration No.", width: "half" },
          ],
        },
      ];

    case "Technology & Gadgets": {
      const repair = { field: "serviceType", in: ["phone_repair", "laptop_repair", "data"] };
      return [
        basics,
        {
          title: "Service",
          fields: [
            providerListedBy([["individual", "Individual"], ["shop", "Shop / Company"]]),
            {
              key: "serviceType",
              type: "select",
              label: "Service Type",
              required: true,
              options: pairs([
                ["phone_repair", "Phone Repair"],
                ["laptop_repair", "Laptop / PC Repair"],
                ["smart_home", "Smart Home & CCTV"],
                ["networking", "Networking & Wi-Fi"],
                ["data", "Data Recovery"],
                ["it_support", "IT Support"],
                ["software", "Software & Web Development"],
                ["3d_print", "3D Printing"],
                ["other", "Other"],
              ]),
            },
            { key: "brands", type: "tags", label: "Brands / Devices", placeholder: "e.g. Apple, Samsung, Dell", maxItems: 10 },
            {
              key: "serviceMode",
              type: "multiselect",
              label: "Service Mode",
              options: pairs([["inperson", "Walk-in"], ["homevisit", "Doorstep"], ["online", "Remote"]]),
            },
            { key: "warranty", type: "select", label: "Warranty", options: pairs([["none", "None"], ["30d", "30 days"], ["90d", "90 days"], ["6m", "6 months+"]]), width: "half", showWhen: repair },
            { key: "turnaround", type: "select", label: "Turnaround", options: pairs([["same_day", "Same day"], ["1_2_days", "1–2 days"], ["3_days", "3+ days"]]), width: "half", showWhen: repair },
            salePrice(),
            { ...priceUnit([["repair", "Per repair"], ["hour", "Hourly"], ["day", "Daily"], ["project", "Per project"]]), label: "Rate Type" },
            availability,
          ],
        },
      ];
    }

    case "Creative Services":
      return [
        basics,
        {
          title: "Service",
          fields: [
            providerListedBy([["freelancer", "Freelancer"], ["studio", "Studio / Agency"]]),
            {
              key: "serviceType",
              type: "select",
              label: "Service Type",
              required: true,
              options: pairs([
                ["photography", "Photography"],
                ["videography", "Videography"],
                ["video_editing", "Video Editing"],
                ["graphic_design", "Graphic Design"],
                ["copywriting", "Copywriting"],
                ["social_media", "Social Media"],
                ["music_audio", "Music & Audio"],
                ["web_design", "Web Design"],
                ["other", "Other"],
              ]),
            },
            {
              key: "occasions",
              type: "multiselect",
              label: "Occasions",
              options: pairs([["wedding", "Wedding"], ["events", "Events"], ["portrait", "Portrait"], ["product", "Product"], ["real_estate", "Real Estate"], ["corporate", "Corporate"]]),
              showWhen: { field: "serviceType", in: ["photography", "videography"] },
            },
            {
              key: "serviceMode",
              type: "multiselect",
              label: "Service Mode",
              options: pairs([["homevisit", "On location"], ["inperson", "Studio"], ["online", "Remote"]]),
            },
            { key: "portfolioUrl", type: "text", label: "Portfolio Link", placeholder: "https://", format: "url" },
            { key: "skills", type: "tags", label: "Skills / Tools", placeholder: "Type a skill and press Enter" },
            salePrice(),
            { ...priceUnit([["hour", "Hourly"], ["day", "Per day"], ["project", "Per project"], ["event", "Per event"]]), label: "Rate Type" },
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
            providerListedBy([["individual", "Individual"], ["company", "Company"]]),
            {
              key: "serviceType",
              type: "select",
              label: "Service Type",
              options: pairs([
                ["moving", "Moving & Packing"],
                ["event_mgmt", "Event Planning"],
                ["laundry", "Laundry & Dry Cleaning"],
                ["tailoring", "Tailoring & Alterations"],
                ["driver", "Driver Hire"],
                ["courier", "Courier & Errands"],
                ["pet_care", "Pet Care"],
                ["repair", "Repair"],
                ["other", "Other"],
              ]),
            },
            howServiceMode(),
            salePrice(),
            priceUnit([["hour", "Per hour"], ["job", "Per job"], ["item", "Per item"], ["from", "Starting from"]]),
            yearsOfExperience,
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
            {
              key: "serviceCategory",
              type: "select",
              label: "Looking For",
              required: true,
              options: pairs([
                ["home", "Home Services"],
                ["business", "Business Services"],
                ["health", "Health & Fitness"],
                ["tutoring", "Tutoring"],
                ["education", "Education & Learning"],
                ["travel", "Travel & Tourism"],
                ["food", "Food & Dining"],
                ["tech", "Technology & Gadgets"],
                ["creative", "Creative Services"],
                ["other", "Other"],
              ]),
            },
            { key: "serviceType", type: "text", label: "What do you need?", placeholder: "e.g. Fix a leaking tap" },
            {
              key: "serviceMode",
              type: "multiselect",
              label: "Service Mode",
              options: pairs([["inperson", "At provider's place"], ["homevisit", "Home visit"], ["online", "Online"]]),
            },
            // Budget stays `budgetAmount`; the price filter reads it (SUB_PRICE_FIELD in lib/postFilterQuery.ts).
            { key: "budgetAmount", type: "currency", label: "Budget", min: 0, width: "half" },
            { ...priceUnit([["hour", "Per hour"], ["visit", "Per visit"], ["total", "Total"]]), label: "Budget Per" },
            { key: "neededBy", type: "date", label: "Needed By", immediateOption: "Immediately", width: "half" },
          ],
        },
      ];

    default:
      return null;
  }
}
