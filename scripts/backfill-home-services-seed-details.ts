// scripts/backfill-home-services-seed-details.ts
// Run with: npx tsx --env-file=.env.local scripts/backfill-home-services-seed-details.ts [--dry-run]
//
// One-off (2026-10-22): the 7 Services › Home Services seed posts were copied
// from the mock catalog (lib/mock) with only a title and a price, so the
// reworked Home Services search filters (Service, Frequency, Provider) had
// nothing to match. This fills, from each post's mock listing (same id as the
// post's adsId), only what's empty: Service Type, Listed By, Price Per,
// Frequency, Same-day / Emergency, Insured, Gas Safe / NICEIC No. (GB) and
// Years of Experience.

import mongoose from "mongoose";
import dbConnect from "../src/lib/db";
import Post from "../src/models/post";

interface SeedDetails {
  serviceType: string;
  experience?: string;
  attributes: Record<string, unknown>;
}

// Values are the Home Services form's (posting/form-schema/defaults/services.ts).
const DETAILS: Record<string, SeedDetails> = {
  // "Certified Electrician — Same-Day Callouts, Bengaluru", ₹299 / visit
  "svc-in-home-01": { serviceType: "electrical", attributes: { listedBy: "company", priceUnit: "visit", frequency: ["once"], emergency: "yes" } },
  // "Deep Home Cleaning — 2BHK/3BHK, Trained Staff", ₹1,499 / job
  "svc-in-home-02": { serviceType: "cleaning", attributes: { listedBy: "company", priceUnit: "job", frequency: ["once"] } },
  // "Gas Safe Plumber & Heating Engineer — 24/7 London", from £80 / job, Gas Safe #123456, £2M public liability
  "svc-home-01": {
    serviceType: "plumbing",
    attributes: { listedBy: "company", priceUnit: "job", frequency: ["once"], emergency: "yes", insured: "yes", registrationNo: "Gas Safe 123456" },
  },
  // "NICEIC Electrician — Rewires, Consumer Units, Certificates", £60 / hr, NICEIC #7654321, £2M public liability
  "svc-home-02": {
    serviceType: "electrical",
    attributes: { listedBy: "company", priceUnit: "hour", frequency: ["once"], insured: "yes", registrationNo: "NICEIC 7654321" },
  },
  // "Self-Employed Painter & Decorator", £180 / day, 18 years, £1M public liability
  "svc-home-03": { serviceType: "painting", experience: "10+", attributes: { listedBy: "individual", priceUnit: "day", frequency: ["once"], insured: "yes" } },
  // "Licensed Electrician — Same-Day Callouts, Singapore", S$50 / visit
  "svc-sg-home-01": { serviceType: "electrical", attributes: { listedBy: "company", priceUnit: "visit", frequency: ["once"], emergency: "yes" } },
  // "Deep Home Cleaning — HDB/Condo, Trained Staff", S$120 / job
  "svc-sg-home-02": { serviceType: "cleaning", attributes: { listedBy: "company", priceUnit: "job", frequency: ["once"] } },
};

async function run() {
  const dryRun = process.argv.includes("--dry-run");
  await dbConnect();

  const posts = await Post.find({ category: { $in: ["services", "Services"] }, adsId: { $in: Object.keys(DETAILS) } })
    .select({ _id: 1, adsId: 1, country: 1, serviceType: 1, experience: 1, attributes: 1 })
    .lean();
  const found = new Set(posts.map((p) => p.adsId));
  for (const id of Object.keys(DETAILS)) if (!found.has(id)) console.log(`${id}: no post`);

  for (const post of posts) {
    const id = post.adsId!;
    const details = DETAILS[id];
    const $set: Record<string, unknown> = {};
    if (!post.serviceType) $set.serviceType = details.serviceType;
    if (details.experience && !post.experience) $set.experience = details.experience;
    for (const [key, value] of Object.entries(details.attributes)) {
      if (post.attributes?.[key] == null) $set[`attributes.${key}`] = value;
    }

    if (!Object.keys($set).length) continue;
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
