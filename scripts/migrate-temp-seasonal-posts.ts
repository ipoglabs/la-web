// scripts/migrate-temp-seasonal-posts.ts
// Run with: npx tsx --env-file=.env.local scripts/migrate-temp-seasonal-posts.ts [--dry-run]
//
// One-off, for the reworked Jobs › Temporary / Seasonal form (2026-10-21):
// - The form only asks Pay + Pay Period, so a pay saved as `hourlyRate`
//   (seed posts quoted "/ hr") moves to Pay per hour.
// - A Pay with no Pay Period was quoted per day (IN) or per hour (GB, SG)
//   in the seeds; small figures get that period, others are only reported.
// - Working Hours became Hours per Week (a number): one plain number is
//   copied across; anything else is only reported.
// - Duration (weeks, months or a month range like "Nov–Jan") and Job
//   Category are read from the title where it says them;
//   anything else is only reported.

import mongoose from "mongoose";
import dbConnect from "../src/lib/db";
import Post from "../src/models/post";

const CATEGORY_BY_WORD: [RegExp, string][] = [
  [/retail|store|shop/i, "retail"],
  [/bar|f&b|event|wedding|festival|hotel|restaurant/i, "hospitality"],
  [/warehouse|picker|packer|driver|delivery/i, "logistics"],
];

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
const MONTH = `(${MONTHS.join("|")})[a-z]*`;

/** "Dec–Feb" → 3: months from one named month to another, both counted. */
function monthSpan(title: string): number | null {
  const range = new RegExp(`\\b${MONTH}\\s*[–-]\\s*${MONTH}\\b`, "i").exec(title);
  if (!range) return null;
  const from = MONTHS.indexOf(range[1].toLowerCase());
  const to = MONTHS.indexOf(range[2].toLowerCase());
  return ((to - from + 12) % 12) + 1;
}

/** "4 Weeks" → "1m", "8–16 weeks" → "6m", "Nov–Jan" → "3m": the Duration bucket the longest figure falls in. */
function durationBucket(title: string): string | null {
  const weeks = /(\d+)(?:\s*[–-]\s*(\d+))?\s*weeks?/i.exec(title);
  const months = /(\d+)(?:\s*[–-]\s*(\d+))?\s*months?/i.exec(title);
  const m = weeks ? Number(weeks[2] ?? weeks[1]) / (52 / 12) : months ? Number(months[2] ?? months[1]) : monthSpan(title);
  if (m == null) return null;
  if (m < 1) return "1m";
  if (m <= 3) return "3m";
  if (m <= 6) return "6m";
  if (m <= 12) return "12m";
  return null;
}

async function run() {
  const dryRun = process.argv.includes("--dry-run");
  await dbConnect();

  const posts = await Post.find({ category: { $regex: /^jobs$/i }, subcategory: { $in: ["temp_seasonal", "Temporary / Seasonal"] } })
    .select({ _id: 1, adsId: 1, country: 1, name: 1, salary: 1, hourlyRate: 1, workingHours: 1, duration: 1, attributes: 1 })
    .lean();

  for (const post of posts) {
    const id = post.adsId || String(post._id);
    const $set: Record<string, unknown> = {};
    const $unset: Record<string, ""> = {};

    if (post.hourlyRate != null && post.salary == null) {
      $set.salary = post.hourlyRate;
      $set["attributes.salaryPeriod"] = "hour";
      $unset.hourlyRate = "";
    } else if (post.salary != null && post.attributes?.salaryPeriod == null) {
      const [period, under] = post.country === "in" ? ["day", 5000] : ["hour", 100];
      if (post.salary < under) $set["attributes.salaryPeriod"] = period;
      else console.log(`${id}: Pay ${post.salary} has no Pay Period — left as per month`);
    }

    if (post.workingHours && post.attributes?.hoursPerWeek == null) {
      const hours = /^\s*(\d+)\s*(h|hrs?|hours?)?\s*(\/|per)?\s*(week|wk)?\s*$/i.exec(post.workingHours);
      if (hours) $set["attributes.hoursPerWeek"] = Number(hours[1]);
      else console.log(`${id}: Working Hours "${post.workingHours}" isn't one number — left for the seller to fill Hours per Week`);
    }

    if (!post.duration) {
      const bucket = durationBucket(post.name ?? "");
      if (bucket) $set.duration = bucket;
      else console.log(`${id}: no Duration in "${post.name}" — left for the seller to pick`);
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
