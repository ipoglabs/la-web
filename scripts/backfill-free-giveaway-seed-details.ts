// scripts/backfill-free-giveaway-seed-details.ts
// Run with: npx tsx --env-file=.env.local scripts/backfill-free-giveaway-seed-details.ts [--dry-run]
//
// One-off (2026-10-26): the Free & Giveaway seed posts have only a title and
// a description, so the reworked search filters had nothing to match. This
// fills, from each ad's own text, what the reworked forms ask:
// - Furniture: Item Type, Condition, Dimensions, Collection Access
// - Clothing: For, Clothing Type, Size, Single or Bundle, Condition
// - Electronics: Item Type, Working Status, Condition, Brand, What's Included
// - Food: Food Type, Dietary, Amount, Best Before, Collection Method
// - Kids Items: Item Type, Age Group, Condition
// - General: Category, Condition, Amount
// plus Pickup / Collection Times for all. Detail fields are only filled where
// empty, so it is safe to re-run.
//
// The Singapore seeds were word-for-word copies of India's; they get local
// details in their text. The GB soil ad moved over from Community
// (comm-gen-01) repeats free-gen-02, so it is marked deleted.

import mongoose from "mongoose";
import dbConnect from "../src/lib/db";
import Post from "../src/models/post";

interface SeedDetails {
  /** Post model paths the forms save top-level, filled where empty. */
  fields?: Record<string, unknown>;
  /** Everything else the forms save under `attributes`, filled where empty. */
  attributes?: Record<string, unknown>;
  /** Always written. */
  set?: Record<string, unknown>;
  /** Text swapped in the title and description. */
  text?: [string, string][];
}

// Food seeds stay in search until their Best Before date.
const BEST_BEFORE = "2026-12-31";

// Values are the Free & Giveaway forms' (posting/form-schema/defaults/free-giveaway.ts).
const DETAILS: Record<string, SeedDetails> = {
  // ── Furniture ──
  "free-in-furniture-01": { fields: { condition: "used", availability: "Weekends, 10am–6pm" }, attributes: { itemType: "table", dimensions: "120 × 75 cm" } },
  "free-in-furniture-02": { fields: { condition: "lightly-used", availability: "Weekday evenings" }, attributes: { itemType: "storage", dimensions: "180 × 80 cm" } },
  "free-furn-01": { fields: { condition: "like-new", availability: "Evenings after 6pm" }, attributes: { itemType: "storage", dimensions: "147 × 147 cm", collectionAccess: "Ground floor" } },
  "free-furn-02": { fields: { condition: "heavily-used", availability: "Saturday mornings" }, attributes: { itemType: "seating", collectionAccess: "1st floor, no lift. Needs two people" } },
  "free-furn-03": { fields: { condition: "used", deadline: "2026-12-15", availability: "Any day before the move" }, attributes: { itemType: "table" } },
  "free-sg-furniture-01": {
    fields: { condition: "used", availability: "Weekends, 10am–6pm" },
    attributes: { itemType: "table", dimensions: "120 × 75 cm", collectionAccess: "HDB flat, lift to the floor" },
    text: [["Pickup only.", "Pickup only from my HDB flat in Bukit Timah, lift to the floor."]],
  },
  "free-sg-furniture-02": {
    fields: { condition: "lightly-used", availability: "Weekday evenings" },
    attributes: { itemType: "storage", dimensions: "180 × 80 cm", collectionAccess: "HDB flat, lift to the floor" },
    text: [["Pickup only.", "Pickup only from my HDB flat in Bukit Timah, lift to the floor."]],
  },

  // ── Clothing ──
  "free-in-clothing-01": { fields: { gender: "unisex", size: "Assorted (S–XL)", condition: "lightly-used", availability: "Evenings after 7pm" }, attributes: { clothingType: "outerwear", lotType: "bundle" } },
  "free-in-clothing-02": { fields: { gender: "women", size: "Free size", condition: "lightly-used", availability: "Weekends" }, attributes: { clothingType: "traditional", lotType: "bundle" } },
  "free-cloth-01": { fields: { gender: "men", size: "M / L", condition: "lightly-used", availability: "Weekday evenings" }, attributes: { clothingType: "mixed", lotType: "bundle" } },
  "free-cloth-02": { fields: { gender: "kids", size: "Age 2–4", condition: "used", availability: "Weekends" }, attributes: { clothingType: "mixed", lotType: "bundle" } },
  "free-cloth-03": { fields: { gender: "women", size: "UK 14", condition: "like-new", availability: "Weekday evenings" }, attributes: { clothingType: "mixed", lotType: "bundle" } },
  "free-sg-clothing-01": {
    fields: { gender: "unisex", size: "Assorted (S–XL)", condition: "lightly-used", availability: "Evenings after 7pm" },
    attributes: { clothingType: "outerwear", lotType: "bundle" },
    text: [["gently used.", "gently used. Bought for a winter trip, only worn twice. Collect near Tampines MRT."]],
  },
  "free-sg-clothing-02": {
    fields: { gender: "women", size: "S / M", condition: "lightly-used", availability: "Weekends" },
    attributes: { clothingType: "traditional", lotType: "bundle" },
    text: [
      ["Traditional Dress Collection", "Baju Kurung Collection"],
      ["6 traditional dresses", "6 baju kurung, worn for Hari Raya"],
    ],
  },

  // ── Electronics ──
  "free-in-electronics-01": { fields: { condition: "heavily-used", availability: "Weekends" }, attributes: { itemType: "tv", workingStatus: "working" } },
  "free-in-electronics-02": { fields: { condition: "heavily-used", availability: "Weekday evenings" }, attributes: { itemType: "laptop", workingStatus: "partly" } },
  "free-elec-01": { fields: { condition: "used", availability: "Evenings and weekends" }, attributes: { itemType: "tv", workingStatus: "working", brand: "Sony", included: "Remote" } },
  "free-elec-02": { fields: { condition: "used", availability: "Weekday evenings" }, attributes: { itemType: "laptop", workingStatus: "parts", brand: "Dell" } },
  "free-elec-03": { fields: { condition: "lightly-used", availability: "Evenings after 6pm" }, attributes: { itemType: "printer", workingStatus: "working", brand: "Epson", included: "Power cable, no ink" } },
  "free-sg-electronics-01": {
    fields: { condition: "heavily-used", availability: "Weekends" },
    attributes: { itemType: "tv", workingStatus: "working" },
    text: [["Pickup only.", "Pickup only, near Jurong East MRT. Bring a trolley, it's heavy."]],
  },
  "free-sg-electronics-02": {
    fields: { condition: "heavily-used", availability: "Weekday evenings" },
    attributes: { itemType: "laptop", workingStatus: "partly" },
    text: [["basic use.", "basic use. Hard disk wiped. Collect in Jurong East."]],
  },

  // ── Food ──
  "free-in-food-01": { fields: { deadline: BEST_BEFORE, availability: "Today, 6pm–9pm" }, attributes: { foodType: "cooked", dietary: ["vegetarian"], amount: "4 portions", collectionMethod: "arrange" } },
  "free-in-food-02": { fields: { deadline: BEST_BEFORE, availability: "Today, after 5pm" }, attributes: { foodType: "baked", dietary: ["vegetarian", "eggless"], allergens: "Contains gluten", amount: "3 loaves", collectionMethod: "arrange" } },
  "free-food-01": { fields: { deadline: BEST_BEFORE, availability: "Today, 4pm–8pm" }, attributes: { foodType: "packaged", amount: "8 tins, 1 loaf, mixed veg", collectionMethod: "arrange" } },
  "free-food-02": { fields: { deadline: BEST_BEFORE, availability: "Any time, from the front gate" }, attributes: { foodType: "fresh", dietary: ["vegetarian", "vegan", "gluten_free"], amount: "A box of courgettes and tomatoes", collectionMethod: "left_out" } },
  "free-food-03": { fields: { deadline: BEST_BEFORE, availability: "Today, 10am–4pm" }, attributes: { foodType: "fresh", dietary: ["vegetarian", "gluten_free"], allergens: "Eggs", amount: "12 eggs, kale, chard", collectionMethod: "arrange" } },
  "free-sg-food-01": {
    fields: { deadline: BEST_BEFORE, availability: "Today, 6pm–9pm" },
    attributes: { foodType: "cooked", dietary: ["halal"], allergens: "Contains peanuts, egg", amount: "4 packets", collectionMethod: "arrange" },
    text: [["homemade meals, halal,", "homemade nasi lemak, halal,"]],
  },
  "free-sg-food-02": {
    fields: { deadline: BEST_BEFORE, availability: "Today, after 5pm" },
    attributes: { foodType: "baked", dietary: ["halal"], allergens: "Contains gluten, dairy", amount: "3 loaves", collectionMethod: "arrange" },
    text: [["home bakery.", "home bakery. Collect at the void deck of my HDB block in Bedok."]],
  },

  // ── Kids Items ──
  "free-in-kids-01": { fields: { condition: "lightly-used", availability: "Weekends" }, attributes: { itemType: "toys", ageGroup: ["3_5", "6_12"] } },
  "free-in-kids-02": { fields: { condition: "used", availability: "Weekday evenings" }, attributes: { itemType: "gear", ageGroup: ["0_2", "3_5"] } },
  "free-kids-01": { fields: { condition: "lightly-used", availability: "Evenings after 6pm" }, attributes: { itemType: "nursery", ageGroup: ["0_2", "3_5"] } },
  "free-kids-02": { fields: { condition: "used", availability: "Weekends" }, attributes: { itemType: "gear", ageGroup: ["0_2", "3_5"] } },
  "free-kids-03": { fields: { condition: "lightly-used", availability: "Saturday mornings" }, attributes: { itemType: "books", ageGroup: ["3_5", "6_12"] } },
  "free-sg-kids-01": {
    fields: { condition: "lightly-used", availability: "Weekends" },
    attributes: { itemType: "toys", ageGroup: ["3_5", "6_12"] },
    text: [["all in good condition.", "all in good condition. Collect near Punggol MRT."]],
  },
  "free-sg-kids-02": {
    fields: { condition: "used", availability: "Weekday evenings" },
    attributes: { itemType: "gear", ageGroup: ["0_2", "3_5"] },
    text: [["functions well.", "functions well. Light enough for the MRT, collect in Punggol."]],
  },

  // ── General ──
  "free-in-general-01": { fields: { condition: "used", availability: "Weekends" }, attributes: { itemCategory: "household", amount: "1 large box" } },
  "free-in-general-02": { fields: { condition: "lightly-used", availability: "Weekday evenings" }, attributes: { itemCategory: "packing", amount: "15 boxes" } },
  "free-gen-01": { fields: { condition: "lightly-used", deadline: "2026-11-27", availability: "Evenings until Friday" }, attributes: { itemCategory: "packing", amount: "25 boxes" } },
  "free-gen-02": { fields: { availability: "Weekends preferred" }, attributes: { itemCategory: "garden", amount: "10 bags (~20 L each)" } },
  "free-gen-03": { fields: { condition: "lightly-used", availability: "Weekday evenings" }, attributes: { itemCategory: "books", amount: "20 volumes" } },
  "free-sg-general-01": {
    fields: { condition: "used", availability: "Weekends" },
    attributes: { itemCategory: "household", amount: "1 large box" },
    text: [["and more.", "and more. Clearing out before moving to a new BTO flat. Collect in Ang Mo Kio."]],
  },
  "free-sg-general-02": {
    fields: { condition: "lightly-used", availability: "Weekday evenings" },
    attributes: { itemCategory: "packing", amount: "15 boxes" },
    text: [["good condition.", "good condition. Collect from the void deck in Ang Mo Kio."]],
  },
  // The same Streatham soil ad as free-gen-02, moved over from Community.
  "comm-gen-01": { set: { status: "deleted" } },
};

function isEmpty(value: unknown): boolean {
  return value == null || value === "" || (Array.isArray(value) && value.length === 0);
}

async function run() {
  const dryRun = process.argv.includes("--dry-run");
  await dbConnect();

  const posts = await Post.find({ adsId: { $in: Object.keys(DETAILS) } }).lean();
  const found = new Set(posts.map((p) => p.adsId));
  for (const id of Object.keys(DETAILS)) if (!found.has(id)) console.log(`${id}: no post`);

  for (const post of posts) {
    const id = post.adsId!;
    const details = DETAILS[id];
    const doc = post as unknown as Record<string, unknown>;
    const $set: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(details.fields ?? {})) {
      if (isEmpty(doc[key])) $set[key] = value;
    }
    for (const [key, value] of Object.entries(details.attributes ?? {})) {
      if (isEmpty(post.attributes?.[key])) $set[`attributes.${key}`] = value;
    }
    for (const [key, value] of Object.entries(details.set ?? {})) {
      if (doc[key] !== value) $set[key] = value;
    }
    for (const key of ["name", "description"] as const) {
      const before = post[key] ?? "";
      // A swap whose result is already there was applied on an earlier run.
      const after = (details.text ?? []).reduce((s, [from, to]) => (s.includes(to) ? s : s.split(from).join(to)), before);
      if (after !== before) $set[key] = after;
    }

    if (!Object.keys($set).length) continue;
    console.log(`${id} (${post.country}): ${dryRun ? "would apply" : "applied"} ${JSON.stringify({ $set })}`);
    if (!dryRun) await Post.updateOne({ _id: post._id }, { $set });
  }
}

run()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
