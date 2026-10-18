// scripts/migrate-car-posts.ts
// Run with: npx tsx --env-file=.env.local scripts/migrate-car-posts.ts [--dry-run]
//
// One-off, for the reworked Vehicles › Cars form (2026-10-18):
// - Posts saved under the old subcategory name "Car" move to "Cars".
// - Make, Transmission, Body Type and Color became choices, so typed values
//   are matched to an option ignoring case ("Automatic" → "automatic").
//   A make not on the country's list becomes Make = Other + Other Make.
//   Other unmatched values are only reported — the seller re-picks them on
//   their next edit.

import mongoose from "mongoose";
import dbConnect from "../src/lib/db";
import Post from "../src/models/post";
import { getDefaultSchema } from "../src/posting/form-schema/defaults";
import type { FormFieldDef } from "../src/posting/form-schema/types";

const MATCHED = ["transmission", "bodyType", "color"] as const;

async function run() {
  const dryRun = process.argv.includes("--dry-run");
  await dbConnect();

  const posts = await Post.find({ category: "Vehicles", subcategory: { $in: ["Car", "Cars"] } })
    .select({ _id: 1, adsId: 1, subcategory: 1, country: 1, make: 1, transmission: 1, bodyType: 1, color: 1 })
    .lean();

  for (const post of posts) {
    const id = post.adsId || String(post._id);
    const $set: Record<string, unknown> = {};
    if (post.subcategory === "Car") $set.subcategory = "Cars";

    const country = (post.country ?? "").toUpperCase();
    const schema = country ? getDefaultSchema("Vehicles", "Cars", country) : null;
    if (!schema) {
      console.log(`${id}: no country — values left as they are`);
    } else {
      const fields = new Map<string, FormFieldDef>(schema.sections.flatMap((s) => s.fields).map((f) => [f.key, f]));
      const match = (key: string, value: unknown) =>
        fields.get(key)?.options?.find((o) => o.value.toLowerCase() === String(value).trim().toLowerCase())?.value;

      if (post.make) {
        const make = match("make", post.make);
        if (!make) {
          $set.make = "Other";
          $set["attributes.makeOther"] = post.make;
        } else if (make !== post.make) $set.make = make;
      }
      for (const key of MATCHED) {
        const value = post[key];
        if (!value) continue;
        const option = match(key, value);
        if (!option) console.log(`${id}: ${key} "${value}" matches no option — left for the seller to re-pick`);
        else if (option !== value) $set[key] = option;
      }
    }
    if (!Object.keys($set).length) continue;

    console.log(`${id}: ${dryRun ? "would set" : "set"} ${JSON.stringify($set)}`);
    if (!dryRun) await Post.updateOne({ _id: post._id }, { $set });
  }
}

run()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
