// scripts/backfill-electronics-tech-seed-details.ts
// Run with: npx tsx --env-file=.env.local scripts/backfill-electronics-tech-seed-details.ts [--dry-run]
//
// One-off (2026-10-28): the Electronics & Tech seed posts have only a title, a
// description and a price, so the reworked search filters had nothing to
// match. This fills, from each ad's own text, what the reworked forms ask:
// Type, Brand, Model, Condition, Deal Method, and the specs each sub asks
// (storage, screen size, platform…). Detail fields are only filled where
// empty, so it is safe to re-run.
//
// India's and Singapore's generic ads ("Smartphone — 128GB") get a brand and
// model where the form now requires one, and the Singapore copies of India's
// ads get a local detail. tech-tv-03, a vinyl record collection filed under
// TVs & Audio, moves to Books, Media & Collectibles › Vinyl Records.

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
const MEETUP = ["meetup"];

// Values are the Electronics & Tech forms' (posting/form-schema/defaults/electronics-tech.ts).
const DETAILS: Record<string, SeedDetails> = {
  // ── Mobile Phones & Tablets ──
  "tech-mob-01": { fields: { condition: "like-new", model: "iPhone 16 Pro", color: "Natural Titanium" }, attributes: { itemType: "phone", brand: "apple", storage: "256", network: "unlocked", batteryHealth: "99%", dealMethod: BOTH } },
  "tech-mob-02": { fields: { condition: "like-new", model: "Galaxy Tab S9 FE", color: "Graphite" }, attributes: { itemType: "tablet", brand: "samsung", storage: "128", network: "wifi", dealMethod: BOTH } },
  "tech-mob-03": { fields: { condition: "lightly-used", model: "Pixel 7", color: "Obsidian" }, attributes: { itemType: "phone", brand: "google", storage: "128", network: "unlocked", batteryHealth: "94%", warranty: "extended", dealMethod: BOTH } },
  "tech-in-mobile-01": {
    fields: { condition: "lightly-used", model: "Galaxy A35" },
    attributes: { itemType: "phone", brand: "samsung", storage: "128", network: "unlocked", dealMethod: BOTH },
    text: [["Smartphone — 128GB", "Samsung Galaxy A35 — 128GB"], ["128GB smartphone with", "128GB Samsung Galaxy A35 smartphone with"]],
  },
  "tech-in-mobile-02": {
    fields: { condition: "lightly-used", model: "Tab M10" },
    attributes: { itemType: "tablet", brand: "other", otherBrand: "Lenovo", storage: "64", network: "unlocked", dealMethod: BOTH },
    text: [["10-inch Tablet — 64GB", "Lenovo Tab M10 — 64GB"], ["10-inch tablet with", "10-inch Lenovo Tab M10 with"]],
  },
  "tech-sg-mobile-01": {
    fields: { condition: "lightly-used", model: "Redmi Note 13" },
    attributes: { itemType: "phone", brand: "xiaomi", storage: "128", network: "unlocked", dealMethod: BOTH },
    text: [
      ["Smartphone — 128GB", "Xiaomi Redmi Note 13 — 128GB"],
      ["128GB smartphone with", "128GB Xiaomi Redmi Note 13 with"],
      ["and fast charging.", "and fast charging. Local set, works on Singtel, StarHub and M1. Meet at Tampines MRT."],
    ],
  },
  "tech-sg-mobile-02": {
    fields: { condition: "lightly-used", model: "Galaxy Tab A8" },
    attributes: { itemType: "tablet", brand: "samsung", storage: "64", network: "unlocked", dealMethod: BOTH },
    text: [
      ["10-inch Tablet — 64GB", "Samsung Galaxy Tab A8 — 64GB"],
      ["10-inch tablet with", "10.5-inch Samsung Galaxy Tab A8 with"],
      ["media and browsing.", "media and browsing. Mail islandwide or meet at Jurong East."],
    ],
  },

  // ── Laptops & Computers ──
  "tech-lap-01": { fields: { condition: "like-new", model: "XPS 15 9530" }, attributes: { itemType: "laptop", brand: "dell", processor: "Intel Core i9-13900H", ram: "32 GB", storage: "1 TB SSD", screenSize: "15.6 inch", dealMethod: BOTH } },
  "tech-lap-02": { fields: { condition: "like-new", model: "MacBook Pro 14 M3 Pro" }, attributes: { itemType: "laptop", brand: "apple", processor: "Apple M3 Pro", ram: "18 GB", storage: "512 GB SSD", screenSize: "14 inch", warranty: "extended", dealMethod: BOTH } },
  "tech-lap-03": { fields: { condition: "like-new", model: "IdeaPad 5 15" }, attributes: { itemType: "laptop", brand: "lenovo", processor: "AMD Ryzen 5 5500U", ram: "16 GB", storage: "512 GB SSD", screenSize: "15.6 inch", dealMethod: BOTH } },
  "tech-in-laptop-01": {
    fields: { condition: "lightly-used", model: "Latitude 5420" },
    attributes: { itemType: "laptop", brand: "dell", processor: "Intel Core i5", ram: "16 GB", storage: "512 GB SSD", screenSize: "14 inch", warranty: "under-warranty", dealMethod: BOTH },
    text: [["Refurbished Laptop — i5", "Refurbished Dell Latitude 5420 — i5"], ["Refurbished laptop with", "Refurbished Dell Latitude 5420 with"]],
  },
  "tech-in-laptop-02": {
    fields: { condition: "lightly-used" },
    attributes: { itemType: "desktop", brand: "other", otherBrand: "Custom build", processor: "AMD Ryzen 5", ram: "16 GB", dealMethod: MEETUP },
  },
  "tech-sg-laptop-01": {
    fields: { condition: "lightly-used", model: "EliteBook 840 G8" },
    attributes: { itemType: "laptop", brand: "hp", processor: "Intel Core i5", ram: "16 GB", storage: "512 GB SSD", screenSize: "14 inch", warranty: "under-warranty", dealMethod: BOTH },
    text: [
      ["Refurbished Laptop — i5", "Refurbished HP EliteBook 840 — i5"],
      ["Refurbished laptop with", "Refurbished HP EliteBook 840 G8 with"],
      ["6-month warranty included.", "6-month warranty included. Collect at Sim Lim Square or mail islandwide."],
    ],
  },
  "tech-sg-laptop-02": {
    fields: { condition: "lightly-used" },
    attributes: { itemType: "desktop", brand: "other", otherBrand: "Custom build", processor: "AMD Ryzen 5", ram: "16 GB", dealMethod: MEETUP },
    text: [["GTX 1660 graphics card.", "GTX 1660 graphics card. Self-collect from Bukit Batok; fits in a Grab car."]],
  },

  // ── TVs & Audio ──
  "tech-tv-01": { fields: { condition: "like-new", model: "HT-A7000" }, attributes: { itemType: "soundbar", brand: "Sony", dealMethod: BOTH } },
  "tech-tv-02": { fields: { condition: "like-new", model: "QN90A 65\"" }, attributes: { itemType: "tv", screenSize: "65plus", brand: "Samsung", dealMethod: MEETUP } },
  "tech-in-tv-01": { fields: { condition: "lightly-used" }, attributes: { itemType: "tv", screenSize: "50_65", dealMethod: MEETUP } },
  "tech-in-tv-02": { fields: { condition: "lightly-used" }, attributes: { itemType: "soundbar", dealMethod: BOTH } },
  "tech-sg-tv-01": {
    fields: { condition: "lightly-used" },
    attributes: { itemType: "tv", screenSize: "50_65", dealMethod: MEETUP },
    text: [["for streaming apps.", "for streaming apps. Self-collect from a Punggol HDB; lift landing."]],
  },
  "tech-sg-tv-02": {
    fields: { condition: "lightly-used" },
    attributes: { itemType: "soundbar", dealMethod: BOTH },
    text: [["for immersive audio.", "for immersive audio. Meet at Bishan MRT."]],
  },

  // ── Gaming ──
  "tech-game-01": { fields: { condition: "lightly-used", model: "PS5 Disc Edition" }, attributes: { itemType: "console", platform: "ps", brand: "Sony", dealMethod: BOTH } },
  "tech-game-02": { fields: { condition: "lightly-used", model: "Ryzen 7 7700X / RTX 4070 Ti Super" }, attributes: { itemType: "pc", platform: "pc", dealMethod: MEETUP } },
  "tech-game-03": { fields: { condition: "lightly-used", model: "Titan EVO 2022" }, attributes: { itemType: "chair", brand: "Secretlab", dealMethod: MEETUP } },
  "tech-in-gaming-01": {
    fields: { condition: "lightly-used", model: "PS5 Slim" },
    attributes: { itemType: "console", platform: "ps", brand: "Sony", dealMethod: BOTH },
    text: [["Gaming Console — 1TB", "PlayStation 5 Slim — 1TB"], ["1TB gaming console bundle", "1TB PlayStation 5 Slim bundle"]],
  },
  "tech-in-gaming-02": { fields: { condition: "lightly-used" }, attributes: { itemType: "accessory", platform: "pc", dealMethod: BOTH } },
  "tech-sg-gaming-01": {
    fields: { condition: "lightly-used", model: "Series X" },
    attributes: { itemType: "console", platform: "xbox", brand: "Microsoft", dealMethod: BOTH },
    text: [
      ["Gaming Console — 1TB", "Xbox Series X — 1TB"],
      ["1TB gaming console bundle", "1TB Xbox Series X bundle"],
      ["3 popular games included.", "3 popular games included. SG set with local warranty card; meet at Serangoon MRT."],
    ],
  },
  "tech-sg-gaming-02": {
    fields: { condition: "lightly-used" },
    attributes: { itemType: "accessory", platform: "pc", dealMethod: BOTH },
    text: [["noise-cancelling microphone.", "noise-cancelling microphone. Mail islandwide."]],
  },

  // ── Cameras & Photography ──
  "tech-cam-01": { fields: { condition: "lightly-used", model: "A7 IV" }, attributes: { itemType: "mirrorless", brand: "sony", shutterCount: "3,200", dealMethod: BOTH } },
  "tech-cam-02": { fields: { condition: "lightly-used", model: "AD200Pro" }, attributes: { itemType: "lighting", brand: "godox", dealMethod: BOTH } },
  "tech-cam-03": { fields: { condition: "like-new", model: "EOS M50 Mark II" }, attributes: { itemType: "mirrorless", brand: "canon", shutterCount: "Under 2,000", dealMethod: BOTH } },
  "tech-in-camera-01": {
    fields: { condition: "lightly-used", model: "ZV-E10" },
    attributes: { itemType: "mirrorless", brand: "sony", dealMethod: BOTH },
    text: [["Mirrorless Camera — 24MP", "Sony ZV-E10 Mirrorless — 24MP"], ["24MP mirrorless camera", "24MP Sony ZV-E10 mirrorless camera"]],
  },
  "tech-in-camera-02": { fields: { condition: "lightly-used" }, attributes: { itemType: "tripod", dealMethod: BOTH } },
  "tech-sg-camera-01": {
    fields: { condition: "lightly-used", model: "EOS R10" },
    attributes: { itemType: "mirrorless", brand: "canon", dealMethod: BOTH },
    text: [
      ["Mirrorless Camera — 24MP", "Canon EOS R10 Mirrorless — 24MP"],
      ["24MP mirrorless camera", "24MP Canon EOS R10 mirrorless camera"],
      ["kit lens included.", "kit lens included. Canon Singapore warranty card; meet at Raffles Place."],
    ],
  },
  "tech-sg-camera-02": {
    fields: { condition: "lightly-used" },
    attributes: { itemType: "tripod", dealMethod: BOTH },
    text: [["cameras and phones.", "cameras and phones. Used for a few Gardens by the Bay night shoots."]],
  },

  // ── Computer Parts & Components ──
  "tech-parts-01": { fields: { condition: "lightly-used", model: "RTX 3080 Founders Edition" }, attributes: { itemType: "gpu", brand: "NVIDIA", capacity: "10GB", dealMethod: BOTH } },
  "tech-parts-02": { fields: { condition: "new", model: "Vengeance DDR5 5600" }, attributes: { itemType: "ram", brand: "Corsair", capacity: "32GB (2×16GB)", dealMethod: BOTH } },
  "tech-parts-03": { fields: { condition: "new", model: "990 Pro" }, attributes: { itemType: "storage", brand: "Samsung", capacity: "2TB", dealMethod: BOTH } },
  "tech-in-parts-01": { fields: { condition: "lightly-used" }, attributes: { itemType: "gpu", capacity: "8GB", dealMethod: BOTH } },
  "tech-in-parts-02": { fields: { condition: "lightly-used" }, attributes: { itemType: "motherboard", capacity: "ATX, DDR4", dealMethod: BOTH } },
  "tech-sg-parts-01": {
    fields: { condition: "lightly-used" },
    attributes: { itemType: "gpu", capacity: "8GB", dealMethod: BOTH },
    text: [["gaming and video editing.", "gaming and video editing. Can test it at Sim Lim Square before you buy."]],
  },
  "tech-sg-parts-02": {
    fields: { condition: "lightly-used" },
    attributes: { itemType: "motherboard", capacity: "ATX, DDR4", dealMethod: BOTH },
    text: [["Bluetooth connectivity.", "Bluetooth connectivity. Mail islandwide or meet at Bugis."]],
  },

  // ── Wearables & Smart Devices ──
  "tech-wear-01": { fields: { condition: "like-new", model: "Watch Series 9", size: "45mm" }, attributes: { itemType: "smartwatch", brand: "Apple", warranty: "extended", dealMethod: BOTH } },
  "tech-wear-02": { fields: { condition: "lightly-used", model: "Forerunner 265" }, attributes: { itemType: "smartwatch", brand: "Garmin", dealMethod: BOTH } },
  "tech-wear-03": { fields: { condition: "lightly-used", model: "4.0" }, attributes: { itemType: "tracker", brand: "WHOOP", dealMethod: BOTH } },
  "tech-in-wearable-01": { fields: { condition: "lightly-used" }, attributes: { itemType: "smartwatch", dealMethod: BOTH } },
  "tech-in-wearable-02": { fields: { condition: "lightly-used" }, attributes: { itemType: "tracker", dealMethod: BOTH } },
  "tech-sg-wearable-01": {
    fields: { condition: "lightly-used" },
    attributes: { itemType: "smartwatch", dealMethod: BOTH },
    text: [["7-day battery life.", "7-day battery life. Synced with Healthy 365 for the National Steps Challenge."]],
  },
  "tech-sg-wearable-02": {
    fields: { condition: "lightly-used" },
    attributes: { itemType: "tracker", dealMethod: BOTH },
    text: [["and step counter.", "and step counter. Mail islandwide."]],
  },
};

/** Seed ads filed in the wrong place: adsId → where they belong. */
const MOVES: Record<string, { category: string; subcategory: string }> = {
  "tech-tv-03": { category: "books_media_collectibles", subcategory: "vinyl_records" },
};

function isEmpty(value: unknown): boolean {
  return value == null || value === "" || (Array.isArray(value) && value.length === 0);
}

async function run() {
  const dryRun = process.argv.includes("--dry-run");
  await dbConnect();

  for (const [id, to] of Object.entries(MOVES)) {
    const post = await Post.findOne({ adsId: id, category: "electronics_tech" }).select({ subcategory: 1 }).lean();
    if (!post) continue;
    console.log(`${id}: ${dryRun ? "would move" : "moved"} ${post.subcategory} → ${to.category} / ${to.subcategory}`);
    if (!dryRun) await Post.updateOne({ _id: post._id }, { $set: to });
  }

  const posts = await Post.find({ category: "electronics_tech", adsId: { $in: Object.keys(DETAILS) } }).lean();
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
