// scripts/seed-post-form-schemas.ts
// Run with: npx tsx --env-file=.env.local scripts/seed-post-form-schemas.ts [--force]
// Requires MONGODB_URI in your environment.
//
// Seeds the `postformschemas` collection (models/PostFormSchema.ts) with the
// default Property forms from src/posting/form-schema/defaults/property.ts —
// 9 subcategories × IN/GB/SG = 27 documents.
//
// By default only INSERTS missing documents, so hand edits made in the DB are
// never overwritten. Pass --force to reset every document back to the defaults.

import mongoose from "mongoose";
import dbConnect from "../src/lib/db";
import PostFormSchema from "../src/models/PostFormSchema";
import { getAllDefaultPropertySchemas } from "../src/posting/form-schema/defaults/property";

async function seed() {
  const force = process.argv.includes("--force");
  await dbConnect();
  await PostFormSchema.syncIndexes();

  let inserted = 0;
  let reset = 0;
  let skipped = 0;

  for (const schema of getAllDefaultPropertySchemas()) {
    const filter = { category: schema.category, subcategory: schema.subcategory, country: schema.country };

    if (force) {
      const res = await PostFormSchema.updateOne(
        filter,
        { $set: { ...schema, active: true } },
        { upsert: true },
      );
      if (res.upsertedCount) inserted++;
      else reset++;
      continue;
    }

    const res = await PostFormSchema.updateOne(
      filter,
      { $setOnInsert: { ...schema, active: true } },
      { upsert: true },
    );
    if (res.upsertedCount) inserted++;
    else skipped++;
  }

  console.log(`[seed-post-form-schemas] inserted=${inserted} reset=${reset} skipped(existing)=${skipped}`);
}

seed()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
