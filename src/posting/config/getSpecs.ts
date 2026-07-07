// src/posting/config/getSpecs.ts
import { CATEGORY_CONFIG, FALLBACK_OPTIONAL_FIELDS } from "./categoryConfig";
import { normalizeCategory, normalizeSubcategory } from "./normalize";
import type { FieldSpec } from "./types";

export function getSpecs(category: string, subcategory: string): FieldSpec[] {
  const cat = normalizeCategory(category);
  const sub = normalizeSubcategory(subcategory);

  const byCat = CATEGORY_CONFIG[cat];
  const specs = byCat?.[sub];

  // If unknown, return a safe fallback so preview still shows something
  return Array.isArray(specs) ? specs : FALLBACK_OPTIONAL_FIELDS;
}
