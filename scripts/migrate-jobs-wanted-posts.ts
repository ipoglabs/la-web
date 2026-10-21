// scripts/migrate-jobs-wanted-posts.ts
// Run with: npx tsx --env-file=.env.local scripts/migrate-jobs-wanted-posts.ts [--dry-run]
//
// One-off, for the reworked Jobs › Wanted form (2026-10-21):
// - Your Name was dropped from the form; the saved name is removed too, so
//   it stops showing on public ads.
// - Employment Type became multi-choice "Open To": a single value becomes a list.
// - Experience became an Experience Level choice: "3 years" style values
//   map by years (0–1 Entry, 2–4 Mid, 5–9 Senior, 10+ Lead); others are only reported.
// - A salary typed as a run-together range (4500055000 = £45,000–55,000)
//   keeps its lower end.
// - Work Mode saved on a seed post becomes Preferred Work Mode.

import mongoose from "mongoose";
import dbConnect from "../src/lib/db";
import Post from "../src/models/post";

const LEVELS = ["entry", "mid", "senior", "lead", "manager"];
const WORK_MODES: Record<string, string> = { "on-site": "onsite", onsite: "onsite", hybrid: "hybrid", remote: "remote" };

/** 4500055000 → 45000 when it reads as two run-together numbers, the second one bigger. */
function lowerOfRange(n: number): number | null {
  const digits = String(n);
  if (digits.length < 4 || digits.length % 2 !== 0) return null;
  const from = Number(digits.slice(0, digits.length / 2));
  const to = Number(digits.slice(digits.length / 2));
  return to > from ? from : null;
}

function levelForYears(text: string): string | null {
  if (/fresher|graduate|entry/i.test(text)) return "entry";
  const years = /(\d+)\s*\+?\s*(?:years?|yrs?)/i.exec(text);
  if (!years) return null;
  const n = Number(years[1]);
  return n <= 1 ? "entry" : n <= 4 ? "mid" : n <= 9 ? "senior" : "lead";
}

async function run() {
  const dryRun = process.argv.includes("--dry-run");
  await dbConnect();

  const posts = await Post.find({ category: { $regex: /^jobs$/i }, subcategory: { $in: ["wanted", "Wanted"] } })
    .select({ _id: 1, adsId: 1, country: 1, salary: 1, experience: 1, candidateName: 1, workMode: 1, attributes: 1 })
    .lean();

  for (const post of posts) {
    const id = post.adsId || String(post._id);
    const $set: Record<string, unknown> = {};
    const $unset: Record<string, ""> = {};

    if (post.candidateName) $unset.candidateName = "";

    const type = post.attributes?.employmentType;
    if (typeof type === "string" && type) $set["attributes.employmentType"] = [type];

    if (post.experience && !LEVELS.includes(post.experience)) {
      const level = levelForYears(post.experience);
      if (level) $set.experience = level;
      else console.log(`${id}: Experience "${post.experience}" isn't a level — left for the seller to re-pick`);
    }

    if (post.salary != null) {
      const lower = lowerOfRange(post.salary);
      if (lower !== null) {
        console.log(`${id}: salary ${post.salary} read as ${lower}–${String(post.salary).slice(String(lower).length)}, keeping ${lower}`);
        $set.salary = lower;
      }
    }

    if (post.workMode && post.attributes?.preferredWorkMode == null) {
      const mode = WORK_MODES[post.workMode.toLowerCase()];
      if (mode) {
        $set["attributes.preferredWorkMode"] = [mode];
        $unset.workMode = "";
      }
    }

    if (!Object.keys($set).length && !Object.keys($unset).length) continue;
    console.log(`${id} (${post.country}): ${dryRun ? "would set" : "set"} ${JSON.stringify($set)}${Object.keys($unset).length ? ` unset ${Object.keys($unset).join(", ")}` : ""}`);
    if (!dryRun) await Post.updateOne({ _id: post._id }, { ...(Object.keys($set).length ? { $set } : {}), ...(Object.keys($unset).length ? { $unset } : {}) });
  }
}

run()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
