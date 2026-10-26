// scripts/backfill-business-seed-details.ts
// Run with: npx tsx --env-file=.env.local scripts/backfill-business-seed-details.ts [--dry-run]
//
// One-off (2026-10-26): the Business seed posts were copied from the mock
// catalog (lib/mock) with only a title and a price, so the reworked Business
// search filters had nothing to match. This fills, from each post's mock
// listing (same id as the post's adsId), what the reworked forms ask:
// - Business For Sale: Listing Type, Listed By, Business Type, Turnover, Staff,
//   Years Established, Premises, Lease Remaining, Included in Sale, Reason
// - B2B Service: Listed By, Service Type, Engagement, Coverage, Price Per
// - Freelance Contractors: Field, Skills, Experience, Work Arrangement, IR35, Rate Per
// - Partnership: Looking For, Industry, Stage, Equity Offered, Commitment
// - Equipment & Supplies: Listing Type, Listed By, Category, Condition, Brand, Price Per
// - Startup Support: Listed By, Support Type, Industries, Stages, Format, Price Per
// Detail fields are only filled where empty, so it is safe to re-run.
//
// It also fixes the seed prices that kept only the number off the mock label
// ("₹35 Lakh" saved as 35, "Investment: £50K" as 50, "Quote on request" as 0)
// and moves Partnership's investment asks to Investment Amount (`budgetAmount`,
// what its price filter reads). The GB food franchise seed moves to Franchise
// Opportunities, with its fee as Investment Required.

import mongoose from "mongoose";
import dbConnect from "../src/lib/db";
import Post from "../src/models/post";

interface SeedDetails {
  /** Post model paths the Business forms save top-level, filled where empty. */
  fields?: Record<string, unknown>;
  /** Everything else the forms save under `attributes`, filled where empty. */
  attributes?: Record<string, unknown>;
  /** Always written: the corrected price fields. */
  set?: Record<string, unknown>;
  unset?: string[];
}

const LAKH = 100_000;

// Values are the Business forms' (posting/form-schema/defaults/business.ts).
const DETAILS: Record<string, SeedDetails> = {
  // ── Business For Sale / Lease
  "biz-in-sale-01": {
    attributes: {
      listingType: "sale", listedBy: "broker", businessType: "fnb", annualTurnover: 54 * LAKH, staffCount: 6,
      yearsEstablished: 3, premises: "leasehold", leaseRemaining: "5 years, transferable", includedInSale: ["equipment", "staff"],
    },
    set: { salePrice: 35 * LAKH },
  },
  "biz-in-sale-02": {
    attributes: { listingType: "sale", listedBy: "broker", businessType: "manufacturing", yearsEstablished: 5, includedInSale: ["equipment", "clients"] },
    set: { salePrice: 18 * LAKH },
  },
  "biz-sale-01": {
    attributes: {
      listingType: "sale", listedBy: "broker", businessType: "fnb", annualTurnover: 180_000, netProfit: 45_000, staffCount: 3,
      premises: "leasehold", leaseRemaining: "3 years, £22,000 a year", includedInSale: ["licences", "staff"], reasonForSale: "Retirement",
    },
  },
  "biz-sale-02": {
    attributes: {
      listingType: "sale", listedBy: "broker", businessType: "services", annualTurnover: 240_000, staffCount: 6,
      premises: "online", includedInSale: ["clients", "ip"], reasonForSale: "Owner retirement",
    },
  },
  "biz-sale-03": {
    attributes: {
      listingType: "sale", listedBy: "broker", businessType: "services", annualTurnover: 70_000, staffCount: 0,
      premises: "leasehold", leaseRemaining: "4 years, £18,000 a year", includedInSale: ["equipment"], reasonForSale: "Portfolio consolidation",
    },
  },
  "biz-sg-sale-01": {
    attributes: {
      listingType: "sale", listedBy: "broker", businessType: "fnb", annualTurnover: 336_000, staffCount: 5,
      yearsEstablished: 3, premises: "leasehold", leaseRemaining: "3 years, transferable", includedInSale: ["equipment", "staff"],
    },
  },
  "biz-sg-sale-02": {
    attributes: { listingType: "sale", listedBy: "broker", businessType: "manufacturing", yearsEstablished: 5, includedInSale: ["equipment", "clients"] },
  },

  // ── B2B Service
  "biz-in-b2b-01": {
    fields: { serviceType: "logistics" },
    attributes: { listedBy: "company", engagement: "retainer", coverage: "Pan-India + export", priceUnit: "unit" },
  },
  "biz-in-b2b-02": {
    fields: { serviceType: "other" },
    attributes: { listedBy: "company", engagement: "project", priceUnit: "quote" },
    unset: ["salePrice"],
  },
  "biz-b2b-01": {
    fields: { serviceType: "hr" },
    attributes: { listedBy: "company", engagement: "retainer", coverage: "UK-wide (remote)", minimumContract: "Monthly rolling", accreditations: ["CIPD Level 7"], insured: "yes", priceUnit: "month" },
  },
  "biz-b2b-02": {
    fields: { serviceType: "logistics" },
    attributes: { listedBy: "company", engagement: "retainer", coverage: "London to UK mainland", minimumContract: "20 parcels a week", insured: "yes", priceUnit: "unit" },
    set: { salePrice: 0.85 },
  },
  "biz-b2b-03": {
    fields: { serviceType: "facility" },
    attributes: {
      listedBy: "company", engagement: "retainer", coverage: "Greater London", minimumContract: "Monthly rolling",
      accreditations: ["ISO 9001", "Safe Contractor"], insured: "yes", priceUnit: "from",
    },
  },
  "biz-sg-b2b-01": {
    fields: { serviceType: "logistics" },
    attributes: { listedBy: "company", engagement: "retainer", coverage: "Regional + export", priceUnit: "quote" },
    unset: ["salePrice"],
  },
  "biz-sg-b2b-02": {
    fields: { serviceType: "other" },
    attributes: { listedBy: "company", engagement: "project", priceUnit: "quote" },
    unset: ["salePrice"],
  },

  // ── Freelance Contractors
  "biz-in-freelance-01": {
    fields: { experience: "senior", skills: ["IT Infrastructure"] },
    attributes: { workField: "it", yearsExperience: 12, workArrangement: ["onsite", "hybrid"], priceUnit: "hour" },
  },
  "biz-in-freelance-02": {
    fields: { skills: ["Startup Finance", "Fundraising"] },
    attributes: { workField: "finance", workArrangement: ["hybrid", "remote"], priceUnit: "hour" },
  },
  "biz-free-01": {
    fields: { experience: "senior", skills: ["React", "Node.js", "TypeScript", "AWS"] },
    attributes: { workField: "it", yearsExperience: 8, workArrangement: ["hybrid", "remote"], availableFrom: "2026-07-01", ir35: "outside", priceUnit: "day" },
  },
  "biz-free-02": {
    fields: { experience: "mid", skills: ["Brand", "Figma", "Motion"] },
    attributes: { workField: "creative", yearsExperience: 6, workArrangement: ["hybrid", "remote"], availableFrom: "Available now", ir35: "outside", priceUnit: "day" },
  },
  "biz-free-03": {
    fields: { experience: "lead", skills: ["Interim FD", "CFO", "ACA"] },
    attributes: { workField: "finance", yearsExperience: 15, workArrangement: ["hybrid"], availableFrom: "2026-08-01", ir35: "outside", priceUnit: "day" },
  },
  "biz-sg-freelance-01": {
    fields: { experience: "senior", skills: ["IT Infrastructure"] },
    attributes: { workField: "it", yearsExperience: 12, workArrangement: ["onsite", "hybrid"], priceUnit: "hour" },
  },
  "biz-sg-freelance-02": {
    fields: { skills: ["Startup Finance", "Fundraising"] },
    attributes: { workField: "finance", workArrangement: ["hybrid", "remote"], priceUnit: "hour" },
  },

  // ── Partnership Opportunities (investment asks move to Investment Amount)
  "biz-in-partner-01": {
    attributes: { lookingFor: "cofounder", industry: "retail", stage: "idea", offering: ["equity"] },
    set: { budgetAmount: 50 * LAKH },
    unset: ["salePrice"],
  },
  "biz-in-partner-02": {
    attributes: { lookingFor: "partner", industry: "fnb", stage: "growth", equityOffered: 30, offering: ["equity"] },
    set: { budgetAmount: 15 * LAKH },
    unset: ["salePrice"],
  },
  "biz-partner-01": {
    attributes: { lookingFor: "cofounder", industry: "healthcare", stage: "mvp", roleNeeded: "CTO / Tech Co-Founder", commitment: "fulltime", offering: ["equity"] },
    unset: ["salePrice"],
  },
  "biz-partner-03": {
    attributes: { lookingFor: "investor", industry: "education", stage: "early", equityOffered: 18, offering: ["equity"] },
    set: { budgetAmount: 50_000 },
    unset: ["salePrice"],
  },
  "biz-sg-partner-01": {
    attributes: { lookingFor: "cofounder", industry: "retail", stage: "idea", offering: ["equity"] },
    set: { budgetAmount: 200_000 },
    unset: ["salePrice"],
  },
  "biz-sg-partner-02": {
    attributes: { lookingFor: "partner", industry: "fnb", stage: "growth", equityOffered: 30, offering: ["equity"] },
    set: { budgetAmount: 80_000 },
    unset: ["salePrice"],
  },
  // A food franchise filed under Partnership: moves to Franchise Opportunities.
  "biz-partner-02": {
    attributes: { franchiseCategory: "fnb", franchiseType: ["unit"], franchiseFee: 25_000, exclusiveTerritory: "yes", locationAvailability: "3 London locations", trainingSupport: "Training + supply chain" },
    set: { subcategory: "franchise", "attributes.investmentRequired": 25_000 },
    unset: ["salePrice"],
  },

  // ── Equipment & Supplies
  "biz-in-equip-01": {
    fields: { condition: "refurbished" },
    attributes: { listingType: "sale", listedBy: "dealer", itemCategory: "kitchen", warranty: "yes" },
    set: { salePrice: 1.2 * LAKH },
  },
  "biz-in-equip-02": {
    attributes: { listingType: "sale", listedBy: "dealer", itemCategory: "office", quantity: 20, delivery: "delivery" },
  },
  "biz-equip-01": {
    fields: { condition: "used" },
    attributes: { listingType: "sale", listedBy: "private", itemCategory: "kitchen", brand: "Lincat / Falcon", delivery: "collection" },
  },
  "biz-equip-02": {
    fields: { condition: "like_new" },
    attributes: { listingType: "sale", listedBy: "private", itemCategory: "office", brand: "Steelcase / Herman Miller", quantity: 20, delivery: "collection" },
  },
  "biz-equip-03": {
    attributes: { listingType: "rent", listedBy: "dealer", itemCategory: "office", brand: "Canon, Konica Minolta", delivery: "installation", priceUnit: "month" },
  },
  "biz-sg-equip-01": {
    fields: { condition: "refurbished" },
    attributes: { listingType: "sale", listedBy: "dealer", itemCategory: "kitchen", warranty: "yes" },
  },
  "biz-sg-equip-02": {
    attributes: { listingType: "sale", listedBy: "dealer", itemCategory: "office", quantity: 20, delivery: "delivery" },
  },

  // ── Startup Support
  "biz-in-startup-01": {
    fields: { serviceType: "coworking" },
    attributes: { listedBy: "organisation", industries: ["all"], stages: ["idea", "mvp", "early"], format: "inperson", takesEquity: "no", priceUnit: "month" },
  },
  "biz-in-startup-02": {
    fields: { serviceType: "funding" },
    attributes: { listedBy: "organisation", industries: ["all"], stages: ["idea", "mvp"], format: "inperson", takesEquity: "no", priceUnit: "session" },
  },
  "biz-startup-01": {
    fields: { serviceType: "mentoring" },
    attributes: { listedBy: "organisation", industries: ["all"], stages: ["idea", "mvp", "early", "growth"], format: "hybrid", priceUnit: "month" },
  },
  "biz-startup-02": {
    fields: { serviceType: "coworking" },
    attributes: { listedBy: "organisation", industries: ["all"], format: "inperson", takesEquity: "no", priceUnit: "month" },
  },
  "biz-startup-03": {
    fields: { serviceType: "funding" },
    attributes: { listedBy: "government", industries: ["all"], format: "online", takesEquity: "no" },
  },
  "biz-sg-startup-01": {
    fields: { serviceType: "coworking" },
    attributes: { listedBy: "organisation", industries: ["all"], stages: ["idea", "mvp", "early"], format: "inperson", takesEquity: "no", priceUnit: "month" },
  },
  "biz-sg-startup-02": {
    fields: { serviceType: "funding" },
    attributes: { listedBy: "organisation", industries: ["all"], stages: ["idea", "mvp"], format: "inperson", takesEquity: "no", priceUnit: "session" },
  },
};

const isEmpty = (v: unknown) => v == null || v === "" || (Array.isArray(v) && v.length === 0);

async function run() {
  const dryRun = process.argv.includes("--dry-run");
  await dbConnect();

  const posts = await Post.find({ category: "business", adsId: { $in: Object.keys(DETAILS) } }).lean();
  const found = new Set(posts.map((p) => p.adsId));
  for (const id of Object.keys(DETAILS)) if (!found.has(id)) console.log(`${id}: no post`);

  for (const post of posts) {
    const id = post.adsId!;
    const details = DETAILS[id];
    const doc = post as unknown as Record<string, unknown>;
    const $set: Record<string, unknown> = {};
    const $unset: Record<string, ""> = {};
    for (const [key, value] of Object.entries(details.fields ?? {})) {
      if (isEmpty(doc[key])) $set[key] = value;
    }
    for (const [key, value] of Object.entries(details.attributes ?? {})) {
      if (isEmpty(post.attributes?.[key])) $set[`attributes.${key}`] = value;
    }
    for (const [key, value] of Object.entries(details.set ?? {})) {
      const current = key.startsWith("attributes.") ? post.attributes?.[key.slice(11)] : doc[key];
      if (current !== value) $set[key] = value;
    }
    for (const key of details.unset ?? []) if (doc[key] != null) $unset[key] = "";

    if (!Object.keys($set).length && !Object.keys($unset).length) continue;
    const update = { ...(Object.keys($set).length ? { $set } : {}), ...(Object.keys($unset).length ? { $unset } : {}) };
    console.log(`${id} (${post.country}): ${dryRun ? "would apply" : "applied"} ${JSON.stringify(update)}`);
    if (!dryRun) await Post.updateOne({ _id: post._id }, update);
  }
}

run()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
