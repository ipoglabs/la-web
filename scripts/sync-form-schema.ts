// scripts/sync-form-schema.ts
// Run with:
//   npx tsx --env-file=.env.local scripts/sync-form-schema.ts "<Category>" "<Subcategory>" [--dry-run]
// e.g.
//   npx tsx --env-file=.env.local scripts/sync-form-schema.ts "Property" "To Buy"
//
// Replaces ONE subcategory's whole form in `postformschemas`, for every
// country, with the code default (src/posting/form-schema/defaults). Use it
// after reworking a form in code; any hand edits made in the DB to those
// documents are lost (sync-form-field.ts replaces a single field instead).
// Prints each document's field keys before and after.

import mongoose from "mongoose";
import dbConnect from "../src/lib/db";
import PostFormSchema from "../src/models/PostFormSchema";
import { getDefaultSchema } from "../src/posting/form-schema/defaults";
import { COUNTRIES } from "../src/posting/form-schema/defaults/shared";
import type { FormSection } from "../src/posting/form-schema/types";

const keys = (sections: FormSection[]) => sections.flatMap((s) => s.fields.map((f) => f.key)).join(", ");

async function run() {
  const args = process.argv.slice(2).filter((a) => !a.startsWith("--"));
  const dryRun = process.argv.includes("--dry-run");
  const [category, subcategory] = args;
  if (!category || !subcategory) {
    throw new Error('Usage: sync-form-schema.ts "<Category>" "<Subcategory>" [--dry-run]');
  }

  await dbConnect();

  for (const country of COUNTRIES) {
    const schema = getDefaultSchema(category, subcategory, country);
    if (!schema) throw new Error(`No default form for ${category} › ${subcategory} (${country})`);

    const doc = await PostFormSchema.findOne({ category, subcategory, country }).lean();
    console.log(`${country} before: ${doc ? keys(doc.sections as FormSection[]) : "(no document)"}`);
    console.log(`${country} after:  ${keys(schema.sections)}`);

    if (!dryRun) {
      await PostFormSchema.updateOne(
        { category, subcategory, country },
        { $set: { ...schema, active: true } },
        { upsert: true },
      );
    }
    console.log(`${country}: ${dryRun ? "would replace" : "replaced"}`);
  }
}

run()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
