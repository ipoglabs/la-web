import type { FieldSpec } from "./types";

export const petConfig: Record<string, FieldSpec[]> = {
  adoption: [
    { key: "petName", type: "string", label: "Pet Name" },
    { key: "petType", type: "string", label: "Pet Type" },
    { key: "breed", type: "string", label: "Breed" },
    { key: "ageText", type: "string", label: "Age" },
    { key: "gender", type: "string", label: "Gender" },
    { key: "vaccination", type: "string", label: "Vaccination" },
    { key: "size", type: "string", label: "Size" },
    { key: "price", type: "currency", label: "Adoption Fee (₹)" },
  ],

  wanted: [
    { key: "wantedPetType", type: "string", label: "Pet Type Wanted" },
    { key: "breedPreference", type: "string", label: "Breed Preference" },
    { key: "agePreference", type: "string", label: "Age Preference" },
    { key: "genderPreference", type: "string", label: "Gender Preference" },
    { key: "sizePreference", type: "string", label: "Size Preference" },
    { key: "budget", type: "currency", label: "Budget (₹)" },
  ],

  accessories: [
    { key: "accessoryName", type: "string", label: "Accessory Name" },
    { key: "partsCategory", type: "string", label: "Category" },
    { key: "condition", type: "string", label: "Condition" },
    { key: "price", type: "currency", label: "Price (₹)" },
  ],

  lostfound: [
    { key: "reportType", type: "string", label: "Report Type" }, // lost/found
    { key: "petType", type: "string", label: "Pet Type" },
    { key: "breed", type: "string", label: "Breed" },
    { key: "lfDate", type: "date", label: "Date" },
    { key: "lastSeenLocation", type: "string", label: "Last Seen Location" },
  ],

  services: [
    { key: "serviceType", type: "string", label: "Service Type" },
    { key: "serviceProviderName", type: "string", label: "Provider Name" },
    { key: "availability", type: "string", label: "Availability" },
    { key: "price", type: "currency", label: "Price (₹)" },
  ],
};
