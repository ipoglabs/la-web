// scripts/migrate-internship-posts.ts
// Run with: npx tsx --env-file=.env.local scripts/migrate-internship-posts.ts [--dry-run]
//
// One-off, for the reworked Jobs › Internship form (2026-10-21):
// - Seed posts saved their stipend as `salary`; it moves to Stipend (per
//   month) and marks the post Paid. GB seeds typed yearly figures (£22,000
//   pro-rata), so a GB stipend over 5,000 is divided by 12.
// - Stipend Type lost Salary, which was already searched as Paid: it becomes "stipend".
// - End Date was dropped (Start Date + Duration give it).
// - Duration and Job Category are read from the title where it says them;
//   anything else is only reported.

import mongoose from "mongoose";
import dbConnect from "../src/lib/db";
import Post from "../src/models/post";

const DURATIONS = ["1", "2", "3", "6", "12"];
const CATEGORY_BY_WORD: [RegExp, string][] = [
  [/software|engineer|developer|data/i, "it"],
  [/marketing|sales/i, "sales"],
  [/design/i, "creative"],
  [/finance|account/i, "finance"],
];

async function run() {
  const dryRun = process.argv.includes("--dry-run");
  await dbConnect();

  const posts = await Post.find({ category: { $regex: /^jobs$/i }, subcategory: { $in: ["internship", "Internship"] } })
    .select({ _id: 1, adsId: 1, country: 1, name: 1, salary: 1, stipendType: 1, stipendAmount: 1, duration: 1, endDate: 1, attributes: 1 })
    .lean();

  for (const post of posts) {
    const id = post.adsId || String(post._id);
    const $set: Record<string, unknown> = {};
    const $unset: Record<string, ""> = {};

    if (post.salary != null && post.stipendAmount == null) {
      let stipend = post.salary;
      if (post.country === "gb" && stipend > 5000) {
        const monthly = Math.round(stipend / 12);
        console.log(`${id}: stipend ${stipend} read as yearly, keeping ${monthly} per month`);
        stipend = monthly;
      }
      if (stipend > 0) {
        $set.stipendAmount = stipend;
        if (!post.stipendType) $set.stipendType = "stipend";
      } else console.log(`${id}: stipend ${stipend} dropped`);
      $unset.salary = "";
    }

    if (post.stipendType === "salary") $set.stipendType = "stipend";
    if (post.endDate) $unset.endDate = "";

    if (!post.duration) {
      const months = /(\d+)[\s-]*months?/i.exec(post.name ?? "")?.[1];
      if (months && DURATIONS.includes(months)) $set.duration = months;
      else console.log(`${id}: no Duration in the title — left for the seller to pick`);
    }

    if (post.attributes?.jobCategory == null) {
      const category = CATEGORY_BY_WORD.find(([word]) => word.test(post.name ?? ""))?.[1];
      if (category) $set["attributes.jobCategory"] = category;
      else console.log(`${id}: "${post.name}" has no clear Job Category — left for the seller to pick`);
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
