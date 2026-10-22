// scripts/backfill-services-seed-details.ts
// Run with: npx tsx --env-file=.env.local scripts/backfill-services-seed-details.ts [--dry-run]
//
// One-off per reworked Services sub: the Services seed posts were copied from
// the mock catalog (lib/mock) with only a title and a price, so the reworked
// Services search filters had nothing to match. This fills, from each post's
// mock listing (same id as the post's adsId), only what's empty, so it is safe
// to re-run as more subs are added.
// - Home Services (2026-10-22): Service Type, Listed By, Price Per, Frequency,
//   Same-day / Emergency, Insured, Gas Safe / NICEIC No. (GB), Years of Experience
// - Business Services (2026-10-22): Service Type, Listed By, Price Per,
//   Service Mode, Years of Experience
// - Health & Fitness (2026-10-22): Service Type, Listed By, Service Mode,
//   Price Per, Free Trial

import mongoose from "mongoose";
import dbConnect from "../src/lib/db";
import Post from "../src/models/post";

interface SeedDetails {
  serviceType: string;
  experience?: string;
  attributes: Record<string, unknown>;
}

// Values are the Services forms' (posting/form-schema/defaults/services.ts).
const DETAILS: Record<string, SeedDetails> = {
  // ── Home Services
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

  // ── Business Services
  // "GST Filing & Accounting — Monthly Retainer for SMEs", ₹5,000 / mo, pan-India remote
  "svc-in-biz-01": { serviceType: "accounting", attributes: { listedBy: "company", priceUnit: "month", serviceMode: ["online"] } },
  // "Private Limited Company Registration — End-to-End", ₹12,000 / job
  "svc-in-biz-02": { serviceType: "company_registration", attributes: { listedBy: "company", priceUnit: "fixed" } },
  // "Small Business Accountancy & Tax Returns — Cloud-Based", £150 / mo, UK-wide remote
  "svc-biz-01": { serviceType: "accounting", attributes: { listedBy: "company", priceUnit: "month", serviceMode: ["online"] } },
  // "SEO & Google Ads Management", £500 / mo, UK-wide remote
  "svc-biz-02": { serviceType: "marketing", attributes: { listedBy: "agency", priceUnit: "month", serviceMode: ["online"] } },
  // "Virtual PA & Executive Assistant", £25 / hr, remote, 10 years PA/EA
  "svc-biz-03": { serviceType: "admin", experience: "10+", attributes: { listedBy: "company", priceUnit: "hour", serviceMode: ["online"] } },
  // "GST Filing & Accounting — Monthly Retainer for SMEs", S$300 / mo
  "svc-sg-biz-01": { serviceType: "accounting", attributes: { listedBy: "company", priceUnit: "month" } },
  // "Private Limited Company Incorporation — ACRA End-to-End", S$600 / job
  "svc-sg-biz-02": { serviceType: "company_registration", attributes: { listedBy: "company", priceUnit: "fixed" } },

  // ── Health & Fitness
  // "Certified Personal Trainer — Home & Gym Sessions", ₹800 / session
  "svc-in-health-01": { serviceType: "pt", attributes: { listedBy: "individual", serviceMode: ["homevisit", "inperson"], priceUnit: "session" } },
  // "Home Yoga Instructor — Beginners to Advanced", ₹500 / session
  "svc-in-health-02": { serviceType: "yoga", attributes: { listedBy: "individual", serviceMode: ["homevisit"], priceUnit: "session" } },
  // "Personal Trainer — 1-to-1 & Online Coaching", £50 / session, free 30-min consultation
  "svc-hf-01": { serviceType: "pt", attributes: { listedBy: "individual", serviceMode: ["inperson", "online"], priceUnit: "session", freeTrial: "yes" } },
  // "Morning Yoga & Pilates Studio", £15 / session, first class free
  "svc-hf-02": { serviceType: "yoga", attributes: { listedBy: "studio", serviceMode: ["inperson"], priceUnit: "session", freeTrial: "yes" } },
  // "Online Nutrition Coaching & Meal Planning", £85 / mo, free 20-min consult
  "svc-hf-03": { serviceType: "nutrition", attributes: { listedBy: "individual", serviceMode: ["online"], priceUnit: "month", freeTrial: "yes" } },
  // "Certified Personal Trainer — Home & Gym Sessions", S$70 / session
  "svc-sg-health-01": { serviceType: "pt", attributes: { listedBy: "individual", serviceMode: ["homevisit", "inperson"], priceUnit: "session" } },
  // "Home Yoga Instructor — Beginners to Advanced", S$60 / session
  "svc-sg-health-02": { serviceType: "yoga", attributes: { listedBy: "individual", serviceMode: ["homevisit"], priceUnit: "session" } },
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
