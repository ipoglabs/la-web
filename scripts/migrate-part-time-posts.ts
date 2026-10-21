// scripts/migrate-part-time-posts.ts
// Run with: npx tsx --env-file=.env.local scripts/migrate-part-time-posts.ts [--dry-run]
//
// One-off, for the reworked Jobs › Part Time form (2026-10-21):
// - IN now asks Pay + Pay Period, so an IN Hourly Rate becomes Pay per hour.
// - GB and SG keep Hourly Rate. A pay saved as `salary` moves there, and a
//   rate typed as a run-together range (1822 = £18–22) keeps its lower end.
// - Shifts lost Weekend, which moves to the new Days field.
// - Work Mode saved as its label ("On-site") becomes the option value.
// - Working Hours became Hours per Week (a number): one plain number is
//   copied across; anything else is only reported.

import mongoose from "mongoose";
import dbConnect from "../src/lib/db";
import Post from "../src/models/post";

const WORK_MODES: Record<string, string> = { "on-site": "onsite", onsite: "onsite", hybrid: "hybrid", remote: "remote" };

/** 1822 → 18 when it reads as two run-together numbers, the second one bigger. */
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

  const posts = await Post.find({ category: { $regex: /^jobs$/i }, subcategory: { $in: ["part_time", "Part Time"] } })
    .select({ _id: 1, adsId: 1, country: 1, salary: 1, hourlyRate: 1, workingHours: 1, shifts: 1, workMode: 1, attributes: 1 })
    .lean();

  for (const post of posts) {
    const id = post.adsId || String(post._id);
    const $set: Record<string, unknown> = {};
    const $unset: Record<string, ""> = {};

    if (post.country === "in") {
      if (post.hourlyRate != null && post.salary == null) {
        $set.salary = post.hourlyRate;
        $set["attributes.salaryPeriod"] = "hour";
        $unset.hourlyRate = "";
      }
    } else {
      let rate = post.hourlyRate ?? post.salary;
      if (rate != null) {
        const lower = lowerOfRange(rate);
        if (lower !== null) {
          console.log(`${id}: rate ${rate} read as ${lower}–${String(rate).slice(String(lower).length)}, keeping ${lower}`);
          rate = lower;
        }
        if (rate !== post.hourlyRate) $set.hourlyRate = rate;
        if (post.salary != null) $unset.salary = "";
      }
    }

    const shifts = post.shifts ?? [];
    if (shifts.includes("Weekend")) {
      $set.shifts = shifts.filter((s) => s !== "Weekend");
      $set["attributes.workDays"] = ["Weekends"];
    }

    if (post.workMode) {
      const mode = WORK_MODES[post.workMode.toLowerCase()];
      if (mode && mode !== post.workMode) $set.workMode = mode;
    }

    if (post.workingHours && post.attributes?.hoursPerWeek == null) {
      const hours = /^\s*(\d+)\s*(h|hrs?|hours?)?\s*(\/|per)?\s*(week|wk)?\s*$/i.exec(post.workingHours);
      if (hours) $set["attributes.hoursPerWeek"] = Number(hours[1]);
      else console.log(`${id}: Working Hours "${post.workingHours}" isn't one number — left for the seller to fill Hours per Week`);
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
