import type { FieldSpec } from "./types";

export const servicesConfig: Record<string, FieldSpec[]> = {
  education: [
    { key: "educationType", type: "string", label: "Education Type" },
    { key: "subject", type: "string", label: "Subject" },
    { key: "mode", type: "string", label: "Mode" },
    { key: "qualification", type: "string", label: "Qualification" },
    { key: "price", type: "currency", label: "Price (₹)" },
    { key: "availability", type: "string", label: "Availability" },
  ],

  food: [
    { key: "cuisineType", type: "string", label: "Cuisine Type" },
    { key: "dietaryOptions", type: "array", label: "Dietary Options" },
    { key: "deliveryAvailable", type: "string", label: "Delivery Available" },
    { key: "price", type: "currency", label: "Price (₹)" },
  ],

  health: [
    { key: "providerName", type: "string", label: "Provider Name" },
    { key: "consultationMode", type: "string", label: "Consultation Mode" },
    { key: "qualification", type: "string", label: "Qualification" },
    { key: "price", type: "currency", label: "Price (₹)" },
  ],

  home: [
    { key: "serviceType", type: "string", label: "Service Type" },
    { key: "availability", type: "string", label: "Availability" },
    { key: "price", type: "currency", label: "Price (₹)" },
  ],

  other: [
    { key: "serviceType", type: "string", label: "Service Type" },
    { key: "availability", type: "string", label: "Availability" },
    { key: "price", type: "currency", label: "Price (₹)" },
  ],

  technology: [
    { key: "serviceType", type: "string", label: "Service Type" },
    { key: "skills", type: "array", label: "Skills" },
    { key: "rateType", type: "string", label: "Rate Type" },
    { key: "price", type: "currency", label: "Price (₹)" },
    { key: "availability", type: "string", label: "Availability" },
  ],

  travel: [
    { key: "destination", type: "string", label: "Destination" },
    { key: "packageDetails", type: "string", label: "Package Details" },
    { key: "durationText", type: "string", label: "Duration" },
    { key: "agencyName", type: "string", label: "Agency Name" },
    { key: "price", type: "currency", label: "Price (₹)" },
  ],

  tutoring: [
    { key: "subject", type: "string", label: "Subject" },
    { key: "level", type: "string", label: "Level" },
    { key: "mode", type: "string", label: "Mode" },
    { key: "qualification", type: "string", label: "Qualification" },
    { key: "price", type: "currency", label: "Fee (₹)" },
    { key: "availability", type: "string", label: "Availability" },
  ],

  wanted: [
    { key: "serviceType", type: "string", label: "Service Needed" },
    { key: "budgetAmount", type: "currency", label: "Budget (₹)" },
    { key: "urgency", type: "string", label: "Urgency" },
  ],
};
