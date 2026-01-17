import type { FieldSpec } from "./types";

const base: FieldSpec[] = [
  { key: "make", type: "string", label: "Make" },
  { key: "model", type: "string", label: "Model" },
  { key: "year", type: "number", label: "Year" },
  { key: "kms", type: "number", label: "KMs Driven", unit: "km" },
  { key: "fuelType", type: "string", label: "Fuel Type" },
  { key: "transmission", type: "string", label: "Transmission" },
  { key: "condition", type: "string", label: "Condition" },
  { key: "ownerType", type: "string", label: "Owner Type" },
  { key: "registrationNumber", type: "string", label: "Registration Number" },
  { key: "insuranceValidTill", type: "date", label: "Insurance Valid Till" },
  { key: "serviceHistory", type: "string", label: "Service History" },
  { key: "features", type: "array", label: "Features" },
];

export const vehiclesConfig: Record<string, FieldSpec[]> = {
  car: [
    ...base,
    { key: "bodyType", type: "string", label: "Body Type" },
    { key: "color", type: "string", label: "Color" },
    { key: "seatingCapacity", type: "number", label: "Seating Capacity" },
    { key: "engineCapacity", type: "number", label: "Engine Capacity", unit: "cc" },
    { key: "salePrice", type: "currency", label: "Price (₹)" },
  ],

  motorcycle: [
    ...base,
    { key: "engineCapacity", type: "number", label: "Engine Capacity", unit: "cc" },
    { key: "color", type: "string", label: "Color" },
    { key: "salePrice", type: "currency", label: "Price (₹)" },
  ],

  van: [
    ...base,
    { key: "seatingCapacity", type: "number", label: "Seating Capacity" },
    { key: "color", type: "string", label: "Color" },
    { key: "salePrice", type: "currency", label: "Price (₹)" },
  ],

  truck: [
    ...base,
    { key: "engineCapacity", type: "number", label: "Engine Capacity", unit: "cc" },
    { key: "color", type: "string", label: "Color" },
    { key: "salePrice", type: "currency", label: "Price (₹)" },
  ],

  parts: [
    { key: "partsCategory", type: "string", label: "Parts Category" },
    { key: "brand", type: "string", label: "Brand" },
    { key: "condition", type: "string", label: "Condition" },
    { key: "features", type: "array", label: "Compatibility / Features" },
    { key: "salePrice", type: "currency", label: "Price (₹)" },
  ],

  wanted: [
    { key: "make", type: "string", label: "Make" },
    { key: "model", type: "string", label: "Model" },
    { key: "year", type: "number", label: "Min Year" },
    { key: "fuelType", type: "string", label: "Fuel Type" },
    { key: "transmission", type: "string", label: "Transmission" },
    { key: "maxBudget", type: "currency", label: "Max Budget (₹)" },
    { key: "preferred_locations", type: "array", label: "Preferred Locations" },
  ],
};
