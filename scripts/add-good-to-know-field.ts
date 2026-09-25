// scripts/add-good-to-know-field.ts
// Run with: npx tsx --env-file=.env.local scripts/add-good-to-know-field.ts [--dry-run]
//
// Adds the common "Good To Know" field (posting/form-schema/defaults/shared.ts)
// right after Adv Details in every `postformschemas` document that doesn't
// have it yet. Documents that already have a goodToKnow field are left alone,
// so it's safe to re-run and never touches other hand edits.

import mongoose from "mongoose";
import dbConnect from "../src/lib/db";
import PostFormSchema from "../src/models/PostFormSchema";
import { GOOD_TO_KNOW_FIELD } from "../src/posting/form-schema/defaults/shared";
import type { FormSection } from "../src/posting/form-schema/types";

async function run() {
  const dryRun = process.argv.includes("--dry-run");
  await dbConnect();

  const docs = await PostFormSchema.find({}).select("category subcategory country sections").lean();
  let updated = 0;
  let skipped = 0;

  for (const doc of docs) {
    const sections = doc.sections as FormSection[];
    if (sections.some((s) => s.fields.some((f) => f.key === GOOD_TO_KNOW_FIELD.key))) {
      skipped++;
      continue;
    }

    // After Adv Details when present, else at the end of the first section.
    const si = Math.max(0, sections.findIndex((s) => s.fields.some((f) => f.key === "description")));
    const fields = [...(sections[si]?.fields ?? [])];
    const di = fields.findIndex((f) => f.key === "description");
    fields.splice(di === -1 ? fields.length : di + 1, 0, GOOD_TO_KNOW_FIELD);
    const next = sections.length ? sections.map((s, i) => (i === si ? { ...s, fields } : s)) : [{ fields }];

    if (!dryRun) await PostFormSchema.updateOne({ _id: doc._id }, { $set: { sections: next } });
    updated++;
  }

  console.log(`[add-good-to-know-field] ${dryRun ? "would update" : "updated"}=${updated} skipped(has field)=${skipped}`);
}

run()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
