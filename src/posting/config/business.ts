// src/posting/config/categories/business.ts
import type { FieldSpec } from "./types";

const serviceCommon: FieldSpec[] = [
  { key: "serviceType", type: "string", label: "Service Type" },
  { key: "availability", type: "string", label: "Availability" },
  { key: "price", type: "currency", label: "Price (₹)" },
  { key: "description", type: "string", label: "Description" },
];

export const businessConfig: Record<string, FieldSpec[]> = {
  sale_lease: [
    { key: "ownership", type: "string", label: "Ownership" },
    { key: "price", type: "currency", label: "Asking Price (₹)" },
    { key: "locationText", type: "string", label: "Location" },
  ],
  b2b: serviceCommon,
  b2c: serviceCommon,
  contractors: serviceCommon,
  partnership: [
    { key: "projectType", type: "string", label: "Project Type" },
    { key: "budgetAmount", type: "currency", label: "Budget (₹)" },
    { key: "description", type: "string", label: "Proposal Details" },
  ],
  equipment: [
    { key: "price", type: "currency", label: "Price (₹)" },
    { key: "condition", type: "string", label: "Condition" },
    { key: "description", type: "string", label: "Description" },
  ],
  startup: serviceCommon,
  training: serviceCommon,
  franchise: serviceCommon,
  events: [
    { key: "date", type: "date", label: "Event Date" },
    { key: "locationText", type: "string", label: "Location" },
    { key: "description", type: "string", label: "Details" },
  ],
  financial: serviceCommon,
  misc: serviceCommon,
  wanted: [
    { key: "budgetAmount", type: "currency", label: "Budget (₹)" },
    { key: "urgency", type: "string", label: "Urgency" },
    { key: "description", type: "string", label: "Wanted Details" },
  ],
};
