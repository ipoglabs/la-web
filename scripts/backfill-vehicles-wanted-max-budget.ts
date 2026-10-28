// scripts/backfill-vehicles-wanted-max-budget.ts
// Run with: npx tsx --env-file=.env.local scripts/backfill-vehicles-wanted-max-budget.ts [--dry-run]
//
// One-off (2026-10-28): the Vehicles › Wanted seed posts saved the buyer's
// budget as `salePrice`, but the Wanted form saves it as Max Budget
// (`maxBudget`), which the price filter and the listing card read. This
// moves each budget to `maxBudget` and drops the `salePrice` the form never
// asks. India's petrol hatchback had ₹6 for "up to ₹6 lakh". Only posts with
// no Max Budget yet are touched, so it is safe to re-run.

import mongoose from "mongoose";
import dbConnect from "../src/lib/db";
import Post from "../src/models/post";

/** Budgets the seed got wrong: adsId → the budget its description gives. */
const CORRECTED: Record<string, number> = { "veh-in-want-01": 600000 };

async function run() {
  const dryRun = process.argv.includes("--dry-run");
  await dbConnect();

  const posts = await Post.find({ category: "vehicles", subcategory: "wanted", maxBudget: null, salePrice: { $ne: null } }).lean();
  for (const post of posts) {
    const maxBudget = CORRECTED[post.adsId!] ?? post.salePrice;
    console.log(`${post.adsId} (${post.country}): ${dryRun ? "would set" : "set"} maxBudget ${maxBudget} (was salePrice ${post.salePrice})`);
    if (!dryRun) await Post.updateOne({ _id: post._id }, { $set: { maxBudget }, $unset: { salePrice: "" } });
  }

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
