/**
 * lib/category-map.ts
 *
 * Derived label lookup tables for category + subcategory navigation.
 * Used by: LaSearchBar, useListingSearch, listings pages, search-keywords.
 *
 * SOURCE OF TRUTH: config/categories/  — add/rename categories there.
 * This file derives CATEGORY_LABELS and SUBCATEGORY_LABELS automatically.
 * Zero manual maintenance required here.
 */

import { CATEGORIES } from "@/config/categories";

// ── Category labels ───────────────────────────────────────────────────────────
// e.g. { property: "Property", vehicles: "Vehicles", ... }

export const CATEGORY_LABELS: Record<string, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c.label])
);

// ── Subcategory labels ────────────────────────────────────────────────────────
// e.g. { property: { to_rent: "To Rent", to_buy: "To Buy" }, ... }

export const SUBCATEGORY_LABELS: Record<string, Record<string, string>> = Object.fromEntries(
  CATEGORIES.map((c) => [
    c.id,
    Object.fromEntries(c.subcategories.map((s) => [s.id, s.label])),
  ])
);