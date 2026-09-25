// scripts/sync-form-field.ts
// Run with:
//   npx tsx --env-file=.env.local scripts/sync-form-field.ts "<Category>" "<Subcategory>" <fieldKey> [--dry-run]
// e.g.
//   npx tsx --env-file=.env.local scripts/sync-form-field.ts "Property" "Wanted" preferred_locations
//
// Copies ONE field's definition from the code defaults
// (src/posting/form-schema/defaults) into the matching `postformschemas`
// documents for every country, replacing that field in place. Everything
// else in those documents — including other hand edits — is left untouched.
// Documents that don't have the field yet are reported and skipped.

import mongoose from "mongoose";
import dbConnect from "../src/lib/db";
import PostFormSchema from "../src/models/PostFormSchema";
import { getDefaultSchema } from "../src/posting/form-schema/defaults";
import { COUNTRIES } from "../src/posting/form-schema/defaults/shared";
import type { FormSection } from "../src/posting/form-schema/types";

async function run() {
  const args = process.argv.slice(2).filter((a) => !a.startsWith("--"));
  const dryRun = process.argv.includes("--dry-run");
  const [category, subcategory, key] = args;
  if (!category || !subcategory || !key) {
    throw new Error('Usage: sync-form-field.ts "<Category>" "<Subcategory>" <fieldKey> [--dry-run]');
  }

  await dbConnect();

  for (const country of COUNTRIES) {
    const field = getDefaultSchema(category, subcategory, country)
      ?.sections.flatMap((s) => s.fields)
      .find((f) => f.key === key);
    if (!field) throw new Error(`No default field "${key}" for ${category} › ${subcategory} (${country})`);

    const doc = await PostFormSchema.findOne({ category, subcategory, country }).lean();
    if (!doc) {
      console.log(`${country}: no DB document — skipped`);
      continue;
    }

    const sections = doc.sections as FormSection[];
    if (!sections.some((s) => s.fields.some((f) => f.key === key))) {
      console.log(`${country}: DB form has no "${key}" field — skipped`);
      continue;
    }

    const next = sections.map((s) => ({ ...s, fields: s.fields.map((f) => (f.key === key ? field : f)) }));
    if (!dryRun) await PostFormSchema.updateOne({ _id: doc._id }, { $set: { sections: next } });
    console.log(`${country}: ${dryRun ? "would update" : "updated"} "${key}"`);
  }
}

run()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
