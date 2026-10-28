// scripts/backfill-required-seed-fields.ts
// Run with: npx tsx --env-file=.env.local scripts/backfill-required-seed-fields.ts [--dry-run]
//
// One-off (2026-10-28): an audit of every live seed post against its form
// found required fields left empty by the earlier category reworks:
// - Food & Dining (UK), Travel & Stays: the provider name (Hotel / Tour
//   Operator / Restaurant name), which the ad's seller already shows.
// - Business B2B / Franchise: the business name, likewise.
// - Jobs: the company (from the ad's text where it names one, else the
//   seller) and Listed By / Posted By.
// - Pets Lost & Found (IN, SG): the last seen / found date.
// - Education Language Classes (IN, SG): the format.
// User posts (numeric ids) are left alone. Only empty fields are filled, so
// it is safe to re-run.

import mongoose from "mongoose";
import dbConnect from "../src/lib/db";
import Post from "../src/models/post";

/** Fields filled from the seller's name, by category/sub. */
const FROM_SELLER: Record<string, string> = {
  "food_dining/home_cooked": "providerName",
  "food_dining/tiffin_services": "providerName",
  "food_dining/restaurant_deals": "providerName",
  "food_dining/baked_goods": "providerName",
  "travel_stays/hotels_guesthouses": "providerName",
  "travel_stays/tour_packages": "providerName",
  "travel_stays/travel_services": "providerName",
  "business/b2b_service": "company",
  "business/franchise": "company",
  "jobs/full_time": "company",
  "jobs/part_time": "company",
  "jobs/internship": "company",
  "jobs/temp_seasonal": "company",
};

/** Per-post values: Post model paths top-level, the rest under `attributes`. */
const DETAILS: Record<string, { fields?: Record<string, unknown>; attributes?: Record<string, unknown> }> = {
  // ── Jobs: the company the ad names, and who is hiring ──
  "job-ft-01": { fields: { company: "Acme Tech Ltd" }, attributes: { listedBy: "Employer" } },
  "job-ft-02": { attributes: { listedBy: "Employer" } },
  "job-ft-03": { attributes: { listedBy: "Employer" } },
  "job-in-ft-01": { attributes: { listedBy: "Employer" } },
  "job-in-ft-02": { attributes: { listedBy: "Employer" } },
  "job-sg-ft-01": { attributes: { listedBy: "Employer" } },
  "job-sg-ft-02": { attributes: { listedBy: "Employer" } },
  "job-pt-01": { attributes: { listedBy: "Employer" } },
  "job-pt-02": { attributes: { listedBy: "Employer" } },
  "job-pt-03": { attributes: { listedBy: "Employer" } },
  "job-in-pt-01": { attributes: { listedBy: "Employer" } },
  // A parent hiring a tutor for their child.
  "job-in-pt-02": { fields: { company: "Private household" }, attributes: { listedBy: "Employer" } },
  "job-sg-pt-01": { attributes: { listedBy: "Employer" } },
  "job-sg-pt-02": { fields: { company: "Private household" }, attributes: { listedBy: "Employer" } },
  "job-temp-01": { attributes: { listedBy: "Employer" } },
  "job-temp-02": { attributes: { listedBy: "Employer" } },
  "job-temp-03": { attributes: { listedBy: "Agency" } },
  "job-in-temp-01": { attributes: { listedBy: "Agency" } },
  "job-in-temp-02": { attributes: { listedBy: "Agency" } },
  "job-sg-temp-01": { attributes: { listedBy: "Agency" } },
  "job-sg-temp-02": { attributes: { listedBy: "Agency" } },
  "job-free-01": { attributes: { listedBy: "Business" } },
  "job-free-02": { attributes: { listedBy: "Business" } },
  "job-free-03": { attributes: { listedBy: "Business" } },
  "job-in-free-01": { attributes: { listedBy: "Business" } },
  "job-in-free-02": { attributes: { listedBy: "Individual" } },
  "job-sg-free-01": { attributes: { listedBy: "Business" } },
  "job-sg-free-02": { attributes: { listedBy: "Individual" } },

  // ── Pets › Lost & Found: last seen / found, recently ──
  "pet-in-lost-01": { fields: { lfDate: "2026-10-26" } },
  "pet-in-lost-02": { fields: { lfDate: "2026-10-27" } },
  "pet-sg-lost-01": { fields: { lfDate: "2026-10-26" } },
  "pet-sg-lost-02": { fields: { lfDate: "2026-10-27" } },

  // ── Education › Language Classes: taught in a classroom ──
  "edu-in-language-01": { fields: { mode: "inperson" } },
  "edu-in-language-02": { fields: { mode: "inperson" } },
  "edu-sg-language-01": { fields: { mode: "inperson" } },
  "edu-sg-language-02": { fields: { mode: "inperson" } },
};

const isEmpty = (v: unknown) => v == null || v === "" || (Array.isArray(v) && v.length === 0);

async function run() {
  const dryRun = process.argv.includes("--dry-run");
  await dbConnect();

  const subs = Object.keys(FROM_SELLER).map((k) => {
    const [category, subcategory] = k.split("/");
    return { category, subcategory };
  });
  const posts = await Post.find({ $or: [...subs, { adsId: { $in: Object.keys(DETAILS) } }], adsId: { $not: /^\d+$/ }, status: { $ne: "deleted" } }).lean();
  const found = new Set(posts.map((p) => p.adsId));
  for (const id of Object.keys(DETAILS)) if (!found.has(id)) console.log(`${id}: no post`);

  for (const post of posts) {
    const doc = post as unknown as Record<string, unknown>;
    const details = DETAILS[post.adsId!] ?? {};
    const sellerField = FROM_SELLER[`${post.category}/${post.subcategory}`];
    const fields = { ...(sellerField && post.seller_info?.name ? { [sellerField]: post.seller_info.name } : {}), ...details.fields };
    const $set: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(fields)) if (isEmpty(doc[key])) $set[key] = value;
    for (const [key, value] of Object.entries(details.attributes ?? {})) if (isEmpty(post.attributes?.[key])) $set[`attributes.${key}`] = value;
    if (!Object.keys($set).length) continue;
    console.log(`${post.adsId} (${post.country}): ${dryRun ? "would apply" : "applied"} ${JSON.stringify({ $set })}`);
    if (!dryRun) await Post.updateOne({ _id: post._id }, { $set });
  }

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
