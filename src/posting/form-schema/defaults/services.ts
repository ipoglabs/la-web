// Default "Services" post-form schemas — mirror components/form/services/*.

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

export function servicesSections(subcategory: string): FormSection[] | null {
  switch (subcategory) {
    case "Home Services":
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
              options: pairs([["cleaning", "Cleaning"], ["plumbing", "Plumbing"], ["electrical", "Electrical"], ["carpentry", "Carpentry"], ["pest-control", "Pest Control"], ["gardening", "Gardening"], ["painting", "Painting"], ["others", "Others"]]),
            },
            price("Service Charge"),
            experience,
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
            { key: "serviceType", type: "text", label: "Service Type", placeholder: "e.g. Accounting, Legal, Marketing" },
            price("Price (per hour / session)", false),
            experience,
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
            { key: "providerName", type: "text", label: "Provider Name", required: true, width: "half" },
            qualification,
            { key: "serviceType", type: "text", label: "Service Type", placeholder: "e.g. Physiotherapy, Personal Training" },
            { key: "consultationMode", type: "select", label: "Consultation Mode", options: pairs([["online", "Online"], ["in-person", "In Person"], ["both", "Both"]]) },
            price("Consultation Fee"),
            experience,
            availability,
          ],
        },
      ];

    case "Tutoring":
      return [
        basics,
        {
          title: "Tutoring",
          fields: [
            { key: "subject", type: "text", label: "Subject", required: true },
            {
              key: "level",
              type: "select",
              label: "Level",
              options: pairs([["primary", "Primary"], ["secondary", "Secondary"], ["higher-secondary", "Higher Secondary"], ["college", "College"], ["competitive", "Competitive Exams"]]),
            },
            mode,
            qualification,
            experience,
            price("Fee"),
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
