// scripts/backfill-special-offers-seed-details.ts
// Run with: npx tsx --env-file=.env.local scripts/backfill-special-offers-seed-details.ts [--dry-run]
//
// One-off (2026-10-27): the Special Offers seed posts have only a title, a
// description and a `salePrice` that mostly holds the discount percentage
// (10 for "10% cashback", 14 for a 14-day trial), so cards showed "£10" and the
// reworked search filters had nothing to match. This fills, from each ad's own
// text, what the reworked forms ask: Type (`itemType`), Deal Type, Discount %,
// Redeem At, Valid Until and each sub's own fields, and removes `salePrice`
// where it isn't what the buyer pays. Detail fields are only filled where
// empty, so it is safe to re-run.
//
// Offers dated June/July 2026 have their dates moved to December 2026.

import mongoose from "mongoose";
import dbConnect from "../src/lib/db";
import Post from "../src/models/post";

interface SeedDetails {
  /** Post model paths the forms save top-level, filled where empty. */
  fields?: Record<string, unknown>;
  /** Everything else the forms save under `attributes`, filled where empty. */
  attributes?: Record<string, unknown>;
  /** `salePrice` held a discount or a count, not a price. */
  dropPrice?: boolean;
  /** Text swapped in the title and description. */
  text?: [string, string][];
}

const VALID = "2026-12-31";

// Values are the Special Offers forms' (posting/form-schema/defaults/specialOffers.ts).
const DETAILS: Record<string, SeedDetails> = {
  // ── Banking & Finance ──
  "offer-bank-01": { dropPrice: true, fields: { deadline: VALID }, attributes: { itemType: "credit_card", dealType: "instalments", redemption: "online", interestRate: "0% for 24 months, then 22.9% APR", tenure: "24 months" } },
  "offer-bank-02": { dropPrice: true, fields: { deadline: VALID }, attributes: { itemType: "savings", dealType: "special_rate", redemption: "online", interestRate: "5.2% AER variable" } },
  "offer-bank-03": { dropPrice: true, fields: { deadline: VALID }, attributes: { itemType: "current_account", dealType: "cashback", redemption: "online", tenure: "12 months free banking" } },
  "offers-in-banking-01": { dropPrice: true, fields: { deadline: VALID, providerName: "HDFC Bank" }, attributes: { itemType: "credit_card", dealType: "cashback", discountPct: 10, redemption: "online" } },
  "offers-in-banking-02": { dropPrice: true, fields: { deadline: VALID, providerName: "HDFC Bank" }, attributes: { itemType: "credit_card", dealType: "special_rate", redemption: "both" } },
  "offers-sg-banking-01": { dropPrice: true, fields: { deadline: VALID, providerName: "DBS Bank" }, attributes: { itemType: "credit_card", dealType: "cashback", discountPct: 10, redemption: "online" } },
  "offers-sg-banking-02": { dropPrice: true, fields: { deadline: VALID, providerName: "DBS Bank" }, attributes: { itemType: "credit_card", dealType: "special_rate", redemption: "both" } },

  // ── Travel & Tourism ──
  "offer-travel-01": {
    fields: { deadline: VALID, destination: "Barcelona, Rome, Lisbon" },
    attributes: { itemType: "flights", dealType: "flash", redemption: "online" },
    text: [["Travel Jul–Sep 2026. Book by 30 June", "Travel Apr–Sep 2027. Book by 31 December"]],
  },
  "offer-travel-02": { fields: { deadline: VALID, destination: "Westminster, London" }, attributes: { itemType: "hotels", dealType: "pct_off", discountPct: 30, originalPrice: 113, redemption: "online" } },
  "offer-travel-03": { fields: { deadline: VALID, destination: "Algarve, Portugal", durationText: "7 nights" }, attributes: { itemType: "packages", dealType: "bundle", redemption: "online" } },
  "offers-in-travel-01": { dropPrice: true, fields: { deadline: VALID, providerName: "MakeMyDeals India" }, attributes: { itemType: "flights", dealType: "flash", discountPct: 30, redemption: "online" } },
  "offers-in-travel-02": { dropPrice: true, fields: { deadline: VALID, destination: "Goa", providerName: "MakeMyDeals India" }, attributes: { itemType: "hotels", dealType: "flat_off", redemption: "online" } },
  "offers-sg-travel-01": { dropPrice: true, fields: { deadline: VALID, providerName: "Changi Travel Deals" }, attributes: { itemType: "flights", dealType: "flash", discountPct: 30, redemption: "online" } },
  "offers-sg-travel-02": { dropPrice: true, fields: { deadline: VALID, destination: "Bintan", providerName: "Changi Travel Deals" }, attributes: { itemType: "hotels", dealType: "flat_off", redemption: "online" } },

  // ── Retail & Shopping ──
  "offer-retail-01": { dropPrice: true, fields: { deadline: VALID }, attributes: { itemType: "fashion", dealType: "pct_off", discountPct: 50, redemption: "both" } },
  "offer-retail-02": {
    dropPrice: true,
    fields: { deadline: VALID, providerName: "Ember & Oak Boutique" },
    attributes: { itemType: "fashion", dealType: "pct_off", discountPct: 20, redemption: "instore" },
    text: [["throughout July 2026", "throughout December 2026"]],
  },
  "offer-retail-03": {
    dropPrice: true,
    fields: { deadline: "2026-12-06" },
    attributes: { itemType: "other", dealType: "cashback", redemption: "both" },
    text: [["(28–29 June 2026)", "(5–6 December 2026)"]],
  },
  "offers-in-retail-01": { dropPrice: true, fields: { deadline: VALID, providerName: "Big Bazaar" }, attributes: { itemType: "fashion", dealType: "pct_off", discountPct: 50, redemption: "instore" } },
  "offers-in-retail-02": { dropPrice: true, fields: { deadline: VALID, providerName: "Big Bazaar" }, attributes: { itemType: "groceries", dealType: "bogo", redemption: "instore" } },
  "offers-sg-retail-01": { dropPrice: true, fields: { deadline: VALID, providerName: "NTUC FairPrice" }, attributes: { itemType: "fashion", dealType: "pct_off", discountPct: 50, redemption: "instore" } },
  "offers-sg-retail-02": { dropPrice: true, fields: { deadline: VALID, providerName: "NTUC FairPrice" }, attributes: { itemType: "groceries", dealType: "bogo", redemption: "instore" } },

  // ── Food & Dining ──
  "offer-food-01": {
    dropPrice: true,
    fields: { deadline: VALID, providerName: "Saffron Home Kitchen, Clapham" },
    attributes: { itemType: "asian", mealType: ["dinein"], dealType: "bogo", redemption: "instore", openingHours: "Mon–Fri 12pm–3pm" },
    text: [["Valid through July 2026", "Valid through December 2026"]],
  },
  "offer-food-02": { dropPrice: true, fields: { deadline: VALID }, attributes: { itemType: "other", mealType: ["delivery"], dealType: "pct_off", discountPct: 50, redemption: "online" } },
  "offer-food-03": {
    dropPrice: true,
    fields: { deadline: VALID, providerName: "The Arch Café" },
    attributes: { itemType: "cafe", mealType: ["dinein", "takeaway"], dealType: "free_gift", redemption: "instore" },
    text: [["valid throughout July 2026", "valid throughout December 2026"]],
  },
  "offers-in-food-01": { dropPrice: true, fields: { deadline: VALID, providerName: "Swiggy" }, attributes: { itemType: "local", mealType: ["delivery"], dealType: "pct_off", discountPct: 40, redemption: "online" } },
  "offers-in-food-02": { dropPrice: true, fields: { deadline: VALID, providerName: "Swiggy" }, attributes: { itemType: "local", mealType: ["delivery"], dealType: "free_delivery", redemption: "online" } },
  "offers-sg-food-01": { dropPrice: true, fields: { deadline: VALID, providerName: "foodpanda" }, attributes: { itemType: "local", mealType: ["delivery"], dealType: "pct_off", discountPct: 40, redemption: "online" } },
  "offers-sg-food-02": { dropPrice: true, fields: { deadline: VALID, providerName: "foodpanda" }, attributes: { itemType: "local", mealType: ["delivery"], dealType: "free_delivery", redemption: "online" } },

  // ── Electronics & Gadgets ──
  "offer-tech-01": { dropPrice: true, fields: { deadline: VALID }, attributes: { itemType: "other", dealType: "pct_off", discountPct: 35, redemption: "both", warranty: "2 years" } },
  "offer-tech-02": { fields: { deadline: VALID, condition: "refurbished" }, attributes: { itemType: "phone", dealType: "flat_off", redemption: "online", brand: "Apple", warranty: "1 year" } },
  "offer-tech-03": { fields: { deadline: VALID, condition: "new" }, attributes: { itemType: "smart_home", dealType: "bundle", originalPrice: 209, redemption: "online" } },
  "offers-in-electronics-01": { dropPrice: true, fields: { deadline: VALID, providerName: "Croma" }, attributes: { itemType: "laptop", dealType: "tradein", redemption: "both" } },
  "offers-in-electronics-02": { dropPrice: true, fields: { deadline: VALID, providerName: "Croma" }, attributes: { itemType: "phone", dealType: "instalments", redemption: "both" } },
  "offers-sg-electronics-01": { dropPrice: true, fields: { deadline: VALID, providerName: "Courts" }, attributes: { itemType: "laptop", dealType: "tradein", redemption: "both" } },
  "offers-sg-electronics-02": { dropPrice: true, fields: { deadline: VALID, providerName: "Courts" }, attributes: { itemType: "phone", dealType: "instalments", redemption: "both" } },

  // ── Health & Wellness ──
  "offer-health-01": { fields: { deadline: VALID, consultationMode: "in-person" }, attributes: { itemType: "gym", dealType: "pct_off", discountPct: 43, originalPrice: 35, redemption: "instore" } },
  "offer-health-02": { fields: { deadline: VALID, consultationMode: "in-person" }, attributes: { itemType: "spa", dealType: "pct_off", discountPct: 59, originalPrice: 110, redemption: "instore" } },
  "offer-health-03": { dropPrice: true, fields: { deadline: VALID, consultationMode: "online" }, attributes: { itemType: "medical", dealType: "free_trial", redemption: "online" } },
  "offers-in-health-01": { dropPrice: true, fields: { deadline: VALID, providerName: "Cult.fit", consultationMode: "in-person" }, attributes: { itemType: "gym", dealType: "free_gift", redemption: "instore" } },
  "offers-in-health-02": { dropPrice: true, fields: { deadline: VALID, providerName: "Cult.fit", consultationMode: "in-person" }, attributes: { itemType: "classes", dealType: "pct_off", discountPct: 50, redemption: "instore" } },
  "offers-sg-health-01": { dropPrice: true, fields: { deadline: VALID, providerName: "Fitness First", consultationMode: "in-person" }, attributes: { itemType: "gym", dealType: "free_gift", redemption: "instore" } },
  "offers-sg-health-02": { dropPrice: true, fields: { deadline: VALID, providerName: "Fitness First", consultationMode: "in-person" }, attributes: { itemType: "classes", dealType: "pct_off", discountPct: 50, redemption: "instore" } },

  // ── Education & Learning ──
  "offer-edu-01": { fields: { deadline: VALID, mode: "online" }, attributes: { itemType: "online", dealType: "flash", originalPrice: 90, redemption: "online" } },
  "offer-edu-02": { dropPrice: true, fields: { deadline: VALID, mode: "online", durationText: "15 months" }, attributes: { itemType: "languages", dealType: "free_gift", redemption: "online" } },
  "offer-edu-03": {
    fields: { deadline: VALID, mode: "inperson", durationText: "1 day" },
    attributes: { itemType: "professional", dealType: "pct_off", discountPct: 20, redemption: "instore" },
    text: [["Next Date 12 July", "Next Date 12 December"]],
  },
  "offers-in-education-01": { dropPrice: true, fields: { deadline: VALID, mode: "online", providerName: "BYJU'S", durationText: "12 months" }, attributes: { itemType: "school", dealType: "pct_off", discountPct: 40, redemption: "online" } },
  "offers-in-education-02": { dropPrice: true, fields: { deadline: VALID, mode: "online", providerName: "BYJU'S", durationText: "14 days" }, attributes: { itemType: "school", dealType: "free_trial", redemption: "online" } },
  "offers-sg-education-01": { dropPrice: true, fields: { deadline: VALID, mode: "online", providerName: "MindChamps", durationText: "12 months" }, attributes: { itemType: "school", dealType: "pct_off", discountPct: 40, redemption: "online" } },
  "offers-sg-education-02": { dropPrice: true, fields: { deadline: VALID, mode: "online", providerName: "MindChamps", durationText: "14 days" }, attributes: { itemType: "school", dealType: "free_trial", redemption: "online" } },

  // ── Holiday & Seasonal Offers ──
  "offer-seasonal-01": { dropPrice: true, fields: { deadline: VALID }, attributes: { occasion: "summer", itemType: "home", dealType: "pct_off", discountPct: 60, redemption: "both" } },
  "offer-seasonal-02": { dropPrice: true, fields: { deadline: VALID }, attributes: { occasion: "backtoschool", itemType: "shopping", dealType: "pct_off", discountPct: 40, redemption: "both" } },
  "offer-seasonal-03": { dropPrice: true, fields: { deadline: VALID }, attributes: { occasion: "yearend", itemType: "home", dealType: "pct_off", discountPct: 70, redemption: "online" } },
  "offers-in-holiday-01": { dropPrice: true, fields: { deadline: VALID }, attributes: { occasion: "diwali", itemType: "shopping", dealType: "pct_off", discountPct: 60, redemption: "both" } },
  "offers-in-holiday-02": { dropPrice: true, fields: { deadline: VALID }, attributes: { occasion: "newyear", itemType: "shopping", dealType: "pct_off", discountPct: 25, redemption: "both" } },
  "offers-sg-holiday-01": { dropPrice: true, fields: { deadline: VALID }, attributes: { occasion: "diwali", itemType: "shopping", dealType: "pct_off", discountPct: 60, redemption: "both" } },
  "offers-sg-holiday-02": { dropPrice: true, fields: { deadline: VALID }, attributes: { occasion: "newyear", itemType: "shopping", dealType: "pct_off", discountPct: 25, redemption: "both" } },
};

function isEmpty(value: unknown): boolean {
  return value == null || value === "" || (Array.isArray(value) && value.length === 0);
}

async function run() {
  const dryRun = process.argv.includes("--dry-run");
  await dbConnect();

  const posts = await Post.find({ category: "special_offers", adsId: { $in: Object.keys(DETAILS) } }).lean();
  const found = new Set(posts.map((p) => p.adsId));
  for (const id of Object.keys(DETAILS)) if (!found.has(id)) console.log(`${id}: no post`);

  for (const post of posts) {
    const id = post.adsId!;
    const details = DETAILS[id];
    const doc = post as unknown as Record<string, unknown>;
    const $set: Record<string, unknown> = {};
    const $unset: Record<string, ""> = {};
    for (const [key, value] of Object.entries(details.fields ?? {})) {
      // Seed deadlines may be stale dates; Valid Until is always rewritten.
      if (key === "deadline" ? String(doc.deadline ?? "").slice(0, 10) !== value : isEmpty(doc[key])) $set[key] = value;
    }
    for (const [key, value] of Object.entries(details.attributes ?? {})) {
      if (isEmpty(post.attributes?.[key])) $set[`attributes.${key}`] = value;
    }
    if (details.dropPrice && doc.salePrice != null) $unset.salePrice = "";
    for (const key of ["name", "description"] as const) {
      const before = post[key] ?? "";
      // A swap whose result is already there was applied on an earlier run.
      const after = (details.text ?? []).reduce((s, [from, to]) => (s.includes(to) ? s : s.split(from).join(to)), before);
      if (after !== before) $set[key] = after;
    }

    if (!Object.keys($set).length && !Object.keys($unset).length) continue;
    const update = { ...(Object.keys($set).length ? { $set } : {}), ...(Object.keys($unset).length ? { $unset } : {}) };
    console.log(`${id} (${post.country}): ${dryRun ? "would apply" : "applied"} ${JSON.stringify(update)}`);
    if (!dryRun) await Post.updateOne({ _id: post._id }, update);
  }

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
