// src/posting/config/categories/forsale.ts
import type { FieldSpec } from "./types";

const common: FieldSpec[] = [
  { key: "price", type: "currency", label: "Price (₹)" },
  { key: "condition", type: "string", label: "Condition" },
  { key: "features", type: "array", label: "Features" },
  { key: "brand", type: "string", label: "Brand" },
];

export const forsaleConfig: Record<string, FieldSpec[]> = {
  electronics: [
    ...common,
    { key: "model", type: "string", label: "Model" },
  ],
  home_furniture: [
    ...common,
    { key: "material", type: "string", label: "Material" },
    { key: "size", type: "string", label: "Size" },
  ],
  office_supplies: [...common],
  fashion: [
    ...common,
    { key: "size", type: "string", label: "Size" },
  ],
  sports: [...common],
  toys: [...common],
  media: [...common],
  kids: [...common],
  health_beauty: [...common],
  garden: [...common],
  hobbies: [...common],
  misc: [...common],
  wanted: [
    { key: "minBudget", type: "currency", label: "Min Budget (₹)" },
    { key: "maxBudget", type: "currency", label: "Max Budget (₹)" },
    { key: "description", type: "string", label: "Wanted Details" },
  ],
};
