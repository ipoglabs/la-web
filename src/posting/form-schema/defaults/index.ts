// Code-default post-form schemas for every category × subcategory × country.
// They seed the `postformschemas` collection (scripts/seed-post-form-schemas.ts)
// and are the fallback /api/post-form-schema serves when no DB document
// exists. Once seeded, edit the DB documents — not these files — to change
// the live form.
//
// The category/subcategory list comes from config/categories, the same
// source the category picker uses, so a subcategory can't exist there without
// a form here (scripts/seed-post-form-schemas.ts fails loudly if one does).

import { CATEGORIES } from "@/config/categories";
import type { FormSection, PostFormSchemaData } from "../types";
import { getDefaultPropertySchema } from "./property";
import { vehiclesSections } from "./vehicles";
import { jobsSections } from "./jobs";
import { servicesSections } from "./services";
import { petsSections } from "./pets";
import { businessSections } from "./business";
import { communitySections } from "./community";
import { specialOffersSections } from "./specialOffers";
import { MARKETPLACE_BUILDERS } from "./marketplace";
import { applyLimits, COUNTRIES } from "./shared";

/** Bump when the code defaults change shape, so seeded docs can be told apart. */
const DEFAULTS_VERSION = 1;

type SectionsBuilder = (subcategory: string, country: string) => FormSection[] | null;

const BUILDERS: Record<string, SectionsBuilder> = {
  Vehicles: vehiclesSections,
  Jobs: jobsSections,
  Services: (sub) => servicesSections(sub),
  Pets: (sub) => petsSections(sub),
  Business: (sub) => businessSections(sub),
  Community: (sub) => communitySections(sub),
  "Special Offers": specialOffersSections,
  ...Object.fromEntries(
    Object.entries(MARKETPLACE_BUILDERS).map(([cat, build]) => [cat, (sub: string) => build(sub)] as const),
  ),
};

export function getDefaultSchema(category: string, subcategory: string, country: string): PostFormSchemaData | null {
  // Property predates this registry and keeps its own limits/version.
  if (category === "Property") return getDefaultPropertySchema(subcategory, country);

  const sections = BUILDERS[category]?.(subcategory, country);
  if (!sections) return null;
  return {
    category,
    subcategory,
    country,
    version: DEFAULTS_VERSION,
    sections: sections.map((section) => ({ ...section, fields: section.fields.map(applyLimits) })),
  };
}

/** Every (category, subcategory) the category picker offers. */
export function listCategorySubcategories(): { category: string; subcategory: string }[] {
  return CATEGORIES.flatMap((c) => c.subcategories.map((s) => ({ category: c.label, subcategory: s.label })));
}

/** All defaults, plus the pairs that have no default form (should be empty). */
export function getAllDefaultSchemas(): { schemas: PostFormSchemaData[]; missing: string[] } {
  const schemas: PostFormSchemaData[] = [];
  const missing: string[] = [];
  for (const { category, subcategory } of listCategorySubcategories()) {
    for (const country of COUNTRIES) {
      const schema = getDefaultSchema(category, subcategory, country);
      if (schema) schemas.push(schema);
      else missing.push(`${category} › ${subcategory} (${country})`);
    }
  }
  return { schemas, missing };
}
