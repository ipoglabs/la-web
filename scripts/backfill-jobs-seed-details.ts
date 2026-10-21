// scripts/backfill-jobs-seed-details.ts
// Run with: npx tsx --env-file=.env.local scripts/backfill-jobs-seed-details.ts [--dry-run]
//
// One-off (2026-10-21): the Jobs seed posts were copied from the mock
// catalog (lib/mock) with little more than a title and a price, so the
// reworked Jobs search filters had nothing to match. This fills, from each
// post's mock listing (same id as the post's adsId), only what's empty:
// - Job Category, from the details label ("FULL TIME • HYBRID • SOFTWARE")
// - Work Mode (Wanted: Preferred Work Mode, from its Arrangement row)
// - Experience Level, from an "Experience" row given in years
// - Freelance Engagement, from the Contract row
// - Wanted Open To, from the title
// Anything that doesn't map is only reported.

import mongoose from "mongoose";
import dbConnect from "../src/lib/db";
import Post from "../src/models/post";
import { getListingsForMarket } from "../src/lib/mock/country-map";
import type { CountryCode } from "../src/config";

// Third part of the details label → Job Category (posting/form-schema/defaults/jobs.ts)
const CATEGORY_BY_LABEL: Record<string, string> = {
  SOFTWARE: "it",
  TECH: "it",
  "BACKEND DEV": "it",
  DATA: "it",
  "PRODUCT/ANALYTICS": "it",
  RETAIL: "retail",
  EDUCATION: "education",
  DESIGN: "creative",
  "PRODUCT DESIGN": "creative",
  CONTENT: "creative",
  VIDEO: "creative",
  MARKETING: "sales",
  FINANCE: "finance",
  HOSPITALITY: "hospitality",
  EVENTS: "hospitality",
  "F&B/EVENTS": "hospitality",
  LOGISTICS: "logistics",
  NURSING: "healthcare",
  NGO: "other",
  ENVIRONMENT: "other",
  "PROGRAMME MANAGEMENT": "other",
};
const WORK_MODE_BY_LABEL: Record<string, string> = { HYBRID: "hybrid", "ON-SITE": "onsite", REMOTE: "remote" };
const LEVELS = ["entry", "mid", "senior", "lead", "manager"];

function levelForYears(text: string): string | null {
  const years = /(\d+)\s*\+?\s*(?:years?|yrs?)/i.exec(text);
  if (!years) return null;
  const n = Number(years[1]);
  return n <= 1 ? "entry" : n <= 4 ? "mid" : n <= 9 ? "senior" : "lead";
}

/** "Remote / Hybrid" → ["remote", "hybrid"]. A vague row ("Any — flexible on shifts") gives none, so the label decides. */
function workModesIn(text: string): string[] {
  return [
    ...(/on-?site/i.test(text) ? ["onsite"] : []),
    ...(/hybrid/i.test(text) ? ["hybrid"] : []),
    ...(/remote/i.test(text) ? ["remote"] : []),
  ];
}

interface MockRow { key: string; value: string }
interface MockJob { id: string; detailsLabel?: string; keyDetails?: MockRow[]; goodToKnow?: MockRow[] }

async function run() {
  const dryRun = process.argv.includes("--dry-run");
  await dbConnect();

  const mocks = new Map<string, MockJob>();
  for (const country of ["in", "gb", "sg"] as CountryCode[]) {
    for (const listing of getListingsForMarket("jobs", country) as unknown as MockJob[]) mocks.set(listing.id, listing);
  }

  const posts = await Post.find({ category: { $in: ["jobs", "Jobs"] }, adsId: { $in: [...mocks.keys()] } })
    .select({ _id: 1, adsId: 1, country: 1, name: 1, subcategory: 1, experience: 1, workMode: 1, attributes: 1 })
    .lean();

  for (const post of posts) {
    const id = post.adsId!;
    const mock = mocks.get(id)!;
    const sub = String(post.subcategory);
    const rows = [...(mock.keyDetails ?? []), ...(mock.goodToKnow ?? [])];
    const row = (key: string) => rows.find((r) => r.key.toLowerCase() === key)?.value;
    const [, modeLabel = "", categoryLabel = ""] = (mock.detailsLabel ?? "").split("•").map((s) => s.trim());
    const $set: Record<string, unknown> = {};

    if (post.attributes?.jobCategory == null) {
      const category = CATEGORY_BY_LABEL[categoryLabel];
      if (category) $set["attributes.jobCategory"] = category;
      else console.log(`${id}: label "${categoryLabel}" has no Job Category`);
    }

    if (sub === "wanted") {
      if (post.attributes?.preferredWorkMode == null) {
        const modes = workModesIn(row("arrangement") ?? "");
        const fromLabel = WORK_MODE_BY_LABEL[modeLabel];
        if (modes.length) $set["attributes.preferredWorkMode"] = modes;
        else if (fromLabel) $set["attributes.preferredWorkMode"] = [fromLabel];
      }
      if (post.attributes?.employmentType == null) {
        const name = post.name ?? "";
        const type = /full-?time/i.test(name) ? "full-time" : /freelance/i.test(name) ? "freelance" : /interim|contract/i.test(name) ? "contract" : null;
        if (type) $set["attributes.employmentType"] = [type];
        else console.log(`${id}: no Open To in "${name}"`);
      }
    } else if (!post.workMode) {
      const mode = WORK_MODE_BY_LABEL[modeLabel];
      if (mode) $set.workMode = mode;
      else console.log(`${id}: label "${modeLabel}" has no Work Mode`);
    }

    // Experience Level is asked on Full Time, Part Time, Freelance and Wanted
    if (["full_time", "part_time", "freelance", "wanted"].includes(sub) && !LEVELS.includes(post.experience ?? "")) {
      const level = levelForYears(row("experience") ?? "");
      if (level) $set.experience = level;
      else if (row("experience")) console.log(`${id}: Experience "${row("experience")}" isn't in years`);
    }

    if (sub === "freelance" && post.attributes?.engagement == null) {
      const contract = row("contract") ?? "";
      const engagement = /ongoing/i.test(contract) ? "ongoing" : /project|\d+\s*(weeks?|months?)/i.test(contract) ? "project" : null;
      if (engagement) $set["attributes.engagement"] = engagement;
      else console.log(`${id}: Contract "${contract}" has no Engagement`);
    }

    if (!Object.keys($set).length) continue;
    console.log(`${id} (${post.country}, ${sub}): ${dryRun ? "would set" : "set"} ${JSON.stringify($set)}`);
    if (!dryRun) await Post.updateOne({ _id: post._id }, { $set });
  }
}

run()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
