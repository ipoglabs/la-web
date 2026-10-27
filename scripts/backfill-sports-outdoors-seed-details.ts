// scripts/backfill-sports-outdoors-seed-details.ts
// Run with: npx tsx --env-file=.env.local scripts/backfill-sports-outdoors-seed-details.ts [--dry-run]
//
// One-off (2026-10-27): the Sports & Outdoors seed posts have only a title, a
// description and a price, so the reworked search filters had nothing to
// match and coaching showed no "/ session". This fills, from each ad's own
// text, what the reworked forms ask: Type, Sport or Activity, Condition,
// Brand, sizes and Deal Method for gear; Type, Mode and Levels for coaching;
// and Price Per for coaching. Detail fields are only filled where empty, so it
// is safe to re-run.
//
// The Singapore copies of India's ads get a local detail.

import mongoose from "mongoose";
import dbConnect from "../src/lib/db";
import Post from "../src/models/post";

interface SeedDetails {
  /** Post model paths the forms save top-level, filled where empty. */
  fields?: Record<string, unknown>;
  /** Everything else the forms save under `attributes`, filled where empty. */
  attributes?: Record<string, unknown>;
  /** Text swapped in the title and description. */
  text?: [string, string][];
}

const BOTH = ["meetup", "delivery"];
const ALL_LEVELS = ["beginner", "intermediate", "advanced"];

// Values are the Sports & Outdoors forms' (posting/form-schema/defaults/sports-outdoors.ts).
const DETAILS: Record<string, SeedDetails> = {
  // ── Fitness Equipment ──
  "sport-gym-01": { fields: { condition: "used", model: "M3" }, attributes: { itemType: "bench", brand: "Mirafit", weight: "150kg plate set", collectionOnly: "yes", dealMethod: ["meetup"] } },
  "sport-gym-02": { fields: { condition: "lightly-used", model: "Model D" }, attributes: { itemType: "rower", brand: "Concept2", dealMethod: ["meetup"] } },
  "sport-gym-03": { fields: { condition: "like-new", model: "Bike+" }, attributes: { itemType: "bike", brand: "Peloton", dealMethod: BOTH } },
  "sports-in-gym-01": { fields: { condition: "lightly-used" }, attributes: { itemType: "weights", weight: "5–25kg, pair", dealMethod: BOTH } },
  "sports-in-gym-02": { fields: { condition: "lightly-used" }, attributes: { itemType: "treadmill", collectionOnly: "yes", dealMethod: ["meetup"] } },
  "sports-sg-gym-01": {
    fields: { condition: "lightly-used" },
    attributes: { itemType: "weights", weight: "5–25kg, pair", dealMethod: BOTH },
    text: [["ideal for home strength training.", "ideal for home strength training. Compact enough for an HDB flat; meet at Woodlands MRT."]],
  },
  "sports-sg-gym-02": {
    fields: { condition: "lightly-used" },
    attributes: { itemType: "treadmill", collectionOnly: "yes", dealMethod: ["meetup"] },
    text: [["great for home cardio.", "great for home cardio. Self-collect from Hougang; fits in a lift once folded."]],
  },

  // ── Team Sports ──
  "sport-team-01": { fields: { condition: "like-new", size: "UK 10" }, attributes: { sport: "football", itemType: "footwear", brand: "Nike", dealMethod: BOTH } },
  "sport-team-02": { fields: { condition: "like-new", size: "Harrow" }, attributes: { sport: "cricket", itemType: "bundle", brand: "Gray-Nicolls", dealMethod: BOTH } },
  "sport-team-03": { fields: { condition: "lightly-used" }, attributes: { sport: "basketball", itemType: "goals_nets", dealMethod: ["meetup"] } },
  "sports-in-team-01": { fields: { condition: "lightly-used" }, attributes: { sport: "cricket", itemType: "bundle", dealMethod: BOTH } },
  "sports-in-team-02": { fields: { condition: "new", size: "Size 5" }, attributes: { sport: "football", itemType: "ball", dealMethod: BOTH } },
  "sports-sg-team-01": { fields: { condition: "new", size: "Size 7" }, attributes: { sport: "basketball", itemType: "ball", dealMethod: BOTH } },
  "sports-sg-team-02": {
    fields: { condition: "new", size: "Size 5" },
    attributes: { sport: "football", itemType: "ball", dealMethod: BOTH },
    text: [["league matches and training sessions.", "league matches and training sessions. Meet at Jalan Besar or mail islandwide."]],
  },

  // ── Outdoor & Adventure ──
  "sport-outdoor-01": { fields: { condition: "like-new", model: "Odyssey Air 600" }, attributes: { activity: "camping", itemType: "tent", brand: "Vango", capacity: "6-person", dealMethod: BOTH } },
  "sport-outdoor-02": { fields: { condition: "used", model: "Marlin 7" }, attributes: { activity: "cycling", itemType: "bike", bikeType: "mountain", frameSize: "Medium", wheelSize: "27.5", brand: "Trek", dealMethod: ["meetup"] } },
  "sport-outdoor-03": { fields: { condition: "like-new", model: "Helium 400" }, attributes: { activity: "camping", itemType: "sleeping", brand: "Mountain Equipment", capacity: "-7°C", dealMethod: BOTH } },
  "sports-in-outdoor-01": { fields: { condition: "lightly-used" }, attributes: { activity: "camping", itemType: "tent", capacity: "4-person", dealMethod: BOTH } },
  "sports-in-outdoor-02": { fields: { condition: "lightly-used" }, attributes: { activity: "hiking", itemType: "backpack", capacity: "60L", dealMethod: BOTH } },
  "sports-sg-outdoor-01": {
    fields: { condition: "lightly-used" },
    attributes: { activity: "camping", itemType: "tent", capacity: "4-person", dealMethod: BOTH },
    text: [["ideal for weekend camping trips.", "ideal for weekend camping trips. Used twice at Pulau Ubin."]],
  },
  "sports-sg-outdoor-02": {
    fields: { condition: "lightly-used" },
    attributes: { activity: "hiking", itemType: "backpack", capacity: "60L", dealMethod: BOTH },
    text: [["suitable for multi-day treks.", "suitable for multi-day treks. Used on one Mount Kinabalu climb."]],
  },

  // ── Water Sports ──
  "sport-water-01": { fields: { condition: "like-new", size: "10'8\"" }, attributes: { activity: "paddleboarding", itemType: "board", brand: "Red Paddle Co", inflatable: "yes", dealMethod: BOTH } },
  "sport-water-02": { fields: { condition: "like-new", size: "Men's MS" }, attributes: { activity: "surfing", itemType: "wetsuit", brand: "Rip Curl", dealMethod: BOTH } },
  "sport-water-03": { fields: { condition: "lightly-used", size: "2-person" }, attributes: { activity: "kayaking", itemType: "kayak", inflatable: "yes", dealMethod: BOTH } },
  "sports-in-water-01": { fields: { condition: "lightly-used", size: "7ft" }, attributes: { activity: "surfing", itemType: "board", dealMethod: ["meetup"] } },
  "sports-in-water-02": { fields: { condition: "lightly-used", size: "1-person" }, attributes: { activity: "kayaking", itemType: "kayak", inflatable: "no", dealMethod: ["meetup"] } },
  "sports-sg-water-01": { fields: { condition: "lightly-used", size: "7ft" }, attributes: { activity: "surfing", itemType: "board", dealMethod: ["meetup"] } },
  "sports-sg-water-02": {
    fields: { condition: "lightly-used", size: "1-person" },
    attributes: { activity: "kayaking", itemType: "kayak", inflatable: "no", dealMethod: ["meetup"] },
    text: [["great for calm-water paddling.", "great for calm-water paddling at Pasir Ris or Kallang Basin. Self-collect only."]],
  },

  // ── Sportswear & Footwear ──
  "sport-wear-01": { fields: { condition: "like-new", gender: "women", size: "8 / XS–S" }, attributes: { itemType: "bundle", brand: "Lululemon", dealMethod: BOTH } },
  "sport-wear-02": { fields: { condition: "like-new", gender: "men", size: "M" }, attributes: { itemType: "bundle", brand: "Nike", dealMethod: BOTH } },
  "sport-wear-03": { fields: { condition: "new", gender: "unisex", size: "XS–2XL" }, attributes: { itemType: "bundle", dealMethod: BOTH } },
  "sports-in-wear-01": { fields: { condition: "like-new", gender: "unisex", size: "UK 9" }, attributes: { itemType: "shoes", dealMethod: BOTH } },
  "sports-in-wear-02": { fields: { condition: "lightly-used", gender: "women", size: "M" }, attributes: { itemType: "bundle", dealMethod: BOTH } },
  "sports-sg-wear-01": {
    fields: { condition: "like-new", gender: "unisex", size: "UK 9" },
    attributes: { itemType: "shoes", dealMethod: BOTH },
    text: [["size 9, barely used.", "size 9, barely used. Ran one Sundown Marathon. Meet at Tanjong Pagar MRT."]],
  },
  "sports-sg-wear-02": {
    fields: { condition: "lightly-used", gender: "women", size: "M" },
    attributes: { itemType: "bundle", dealMethod: BOTH },
    text: [["moisture-wicking fabric.", "moisture-wicking fabric. Good for hot yoga. Mail islandwide."]],
  },

  // ── Fitness Classes & Coaching ──
  "sport-coach-01": { fields: { consultationMode: "both", qualification: "UK Athletics qualified" }, attributes: { itemType: "running", levels: ALL_LEVELS, priceUnit: "session" } },
  "sport-coach-02": { fields: { consultationMode: "inperson", qualification: "LTA Level 3" }, attributes: { itemType: "sports", levels: ALL_LEVELS, priceUnit: "hour" } },
  "sport-coach-03": { fields: { consultationMode: "both", qualification: "NASM certified" }, attributes: { itemType: "pt", levels: ALL_LEVELS, priceUnit: "session" } },
  "sports-in-coach-01": { fields: { consultationMode: "inperson" }, attributes: { itemType: "pt", levels: ["beginner", "intermediate"], priceUnit: "session" } },
  "sports-in-coach-02": { fields: { consultationMode: "inperson" }, attributes: { itemType: "sports", levels: ["intermediate", "advanced"], priceUnit: "month" } },
  "sports-sg-coach-01": {
    fields: { consultationMode: "inperson" },
    attributes: { itemType: "pt", levels: ["beginner", "intermediate"], priceUnit: "session" },
    text: [["strength building and weight loss goals.", "strength building and weight loss goals. At your condo gym or ActiveSG gyms in the east."]],
  },
  "sports-sg-coach-02": {
    fields: { consultationMode: "inperson" },
    attributes: { itemType: "sports", levels: ["intermediate", "advanced"], priceUnit: "month" },
    text: [["tailored to athletic goals.", "tailored to athletic goals. Sessions at Kallang and Bishan stadiums."]],
  },
};

function isEmpty(value: unknown): boolean {
  return value == null || value === "" || (Array.isArray(value) && value.length === 0);
}

async function run() {
  const dryRun = process.argv.includes("--dry-run");
  await dbConnect();

  const posts = await Post.find({ category: "sports_outdoors", adsId: { $in: Object.keys(DETAILS) } }).lean();
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

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
