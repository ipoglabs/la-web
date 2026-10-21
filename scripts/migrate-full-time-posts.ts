// scripts/migrate-full-time-posts.ts
// Run with: npx tsx --env-file=.env.local scripts/migrate-full-time-posts.ts [--dry-run]
//
// One-off, for the reworked Jobs › Full Time form (2026-10-21), which asks
// Salary From – To. Some seed posts typed a range into the one Salary box
// (S$6,500 – S$8,500 saved as 65008500). A salary whose digits split evenly
// into two numbers, the second one bigger, becomes Salary From + Salary To.
// Anything else is only reported.

import mongoose from "mongoose";
import dbConnect from "../src/lib/db";
import Post from "../src/models/post";

/** 65008500 → [6500, 8500]; null when it doesn't read as two run-together numbers. */
function splitRange(salary: number): [number, number] | null {
  const digits = String(salary);
  if (digits.length < 6 || digits.length % 2 !== 0) return null;
  const from = Number(digits.slice(0, digits.length / 2));
  const to = Number(digits.slice(digits.length / 2));
  return to > from ? [from, to] : null;
}

async function run() {
  const dryRun = process.argv.includes("--dry-run");
  await dbConnect();

  const posts = await Post.find({ category: { $regex: /^jobs$/i }, subcategory: { $in: ["full_time", "Full Time"] } })
    .select({ _id: 1, adsId: 1, country: 1, salary: 1, attributes: 1 })
    .lean();

  for (const post of posts) {
    const id = post.adsId || String(post._id);
    if (post.salary == null || post.attributes?.salaryMax != null) continue;
    const range = splitRange(post.salary);
    if (!range) {
      if (post.salary >= 1_000_000) console.log(`${id}: salary ${post.salary} looks wrong but doesn't split — left as it is`);
      continue;
    }

    const $set = { salary: range[0], "attributes.salaryMax": range[1] };
    console.log(`${id} (${post.country}): ${dryRun ? "would set" : "set"} ${JSON.stringify($set)}`);
    if (!dryRun) await Post.updateOne({ _id: post._id }, { $set });
  }
}

run()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
