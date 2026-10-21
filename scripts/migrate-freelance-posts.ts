// scripts/migrate-freelance-posts.ts
// Run with: npx tsx --env-file=.env.local scripts/migrate-freelance-posts.ts [--dry-run]
//
// One-off, for the reworked Jobs › Freelance form (2026-10-21):
// - Seed posts saved their budget as `salary`; it moves to Budget. A budget
//   typed as a run-together range (400600 = £400–600) keeps its lower end,
//   and a 0 budget is dropped.
// - Project Type gave way to Job Category: each old value maps across.
// - Contract Duration became a choice: typed values are only reported.

import mongoose from "mongoose";
import dbConnect from "../src/lib/db";
import Post from "../src/models/post";

const CATEGORY_BY_PROJECT_TYPE: Record<string, string> = {
  "web-development": "it",
  design: "creative",
  writing: "creative",
  marketing: "sales",
  other: "other",
};
const DURATIONS = ["under-1w", "1-4w", "1-3m", "3-6m", "6m-plus"];

/** 400600 → 400 when it reads as two run-together numbers, the second one bigger. */
function lowerOfRange(n: number): number | null {
  const digits = String(n);
  if (digits.length < 4 || digits.length % 2 !== 0) return null;
  const from = Number(digits.slice(0, digits.length / 2));
  const to = Number(digits.slice(digits.length / 2));
  return to > from ? from : null;
}

async function run() {
  const dryRun = process.argv.includes("--dry-run");
  await dbConnect();

  const posts = await Post.find({ category: { $regex: /^jobs$/i }, subcategory: { $in: ["freelance", "Freelance"] } })
    .select({ _id: 1, adsId: 1, country: 1, salary: 1, budgetAmount: 1, projectType: 1, contractDuration: 1, attributes: 1 })
    .lean();

  for (const post of posts) {
    const id = post.adsId || String(post._id);
    const $set: Record<string, unknown> = {};
    const $unset: Record<string, ""> = {};

    if (post.salary != null && post.budgetAmount == null) {
      let budget = post.salary;
      const lower = lowerOfRange(budget);
      if (lower !== null) {
        console.log(`${id}: budget ${budget} read as ${lower}–${String(budget).slice(String(lower).length)}, keeping ${lower}`);
        budget = lower;
      }
      if (budget > 0) $set.budgetAmount = budget;
      else console.log(`${id}: budget ${budget} dropped`);
      $unset.salary = "";
    }

    if (post.projectType && post.attributes?.jobCategory == null) {
      const category = CATEGORY_BY_PROJECT_TYPE[post.projectType];
      if (category) $set["attributes.jobCategory"] = category;
      else console.log(`${id}: Project Type "${post.projectType}" has no Job Category — left for the seller to pick`);
    }

    if (post.contractDuration && !DURATIONS.includes(post.contractDuration)) {
      console.log(`${id}: Contract Duration "${post.contractDuration}" isn't an option — left for the seller to re-pick`);
    }

    if (!Object.keys($set).length && !Object.keys($unset).length) continue;
    console.log(`${id} (${post.country}): ${dryRun ? "would set" : "set"} ${JSON.stringify($set)}${Object.keys($unset).length ? ` unset ${Object.keys($unset).join(", ")}` : ""}`);
    if (!dryRun) await Post.updateOne({ _id: post._id }, { $set, ...(Object.keys($unset).length ? { $unset } : {}) });
  }
}

run()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
