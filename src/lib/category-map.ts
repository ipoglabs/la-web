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

/**
 * Post.category/subcategory are stored as whatever the post wizard
 * submitted — in the data seen so far that's the display LABEL
 * ("Vehicles"), not the canonical id ("vehicles") the rest of the app
 * (breadcrumbs, CATEGORY_LABELS/SUBCATEGORY_LABELS lookups, similar-listings)
 * expects. Resolve whichever form is present back to a canonical id;
 * falls back to a best-effort slug if genuinely unrecognized rather than
 * throwing — a real but unmapped category shouldn't 404 the whole page.
 */
export function resolveCategoryId(raw: string): string {
  if (raw in CATEGORY_LABELS) return raw;
  const lower = raw.toLowerCase();
  const match = Object.entries(CATEGORY_LABELS).find(([, label]) => label.toLowerCase() === lower);
  return match ? match[0] : raw.toLowerCase().replace(/[^a-z0-9]+/g, "_");
}

export function resolveSubcategoryId(catId: string, raw: string): string {
  const subs = SUBCATEGORY_LABELS[catId];
  if (!subs) return raw.toLowerCase().replace(/[^a-z0-9]+/g, "_");
  if (raw in subs) return raw;
  const lower = raw.toLowerCase();
  const match = Object.entries(subs).find(([, label]) => label.toLowerCase() === lower);
  return match ? match[0] : raw.toLowerCase().replace(/[^a-z0-9]+/g, "_");
}
