// scripts/backfill-home-furniture-seed-details.ts
// Run with: npx tsx --env-file=.env.local scripts/backfill-home-furniture-seed-details.ts [--dry-run]
//
// One-off (2026-10-26): the Home & Furniture seed posts have only a title, a
// description and a price, so the reworked search filters had nothing to
// match. This fills, from each ad's own text, what the reworked forms ask:
// Type for every sub, Condition, Brand, Colour, Material, Dimensions and Deal
// Method where the ad gives them, plus each sub's own fields (Seats,
// Upholstery, Bed Size, Mattress Type, Model, Capacity, Energy Rating, Power
// Source, Batteries & Charger, Sold As, Number of Units). Detail fields are
// only filled where empty, so it is safe to re-run.
//
// The Singapore seeds were word-for-word copies of India's; they get local
// details in their text.

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

const MEETUP = ["meetup"];
const BOTH = ["meetup", "delivery"];

// Values are the Home & Furniture forms' (posting/form-schema/defaults/home-furniture.ts).
const DETAILS: Record<string, SeedDetails> = {
  // ── Sofas & Seating ──
  "home-sofa-01": { fields: { condition: "like-new", color: "Mid grey" }, attributes: { itemType: "corner", seats: "5plus", upholstery: "fabric", brand: "DFS", assembly: "dismantle", dealMethod: MEETUP } },
  "home-sofa-02": { fields: { condition: "lightly-used", color: "Light grey" }, attributes: { itemType: "sofa", seats: "3", upholstery: "fabric", brand: "IKEA", dealMethod: MEETUP } },
  "home-sofa-03": { fields: { condition: "like-new", color: "Mustard yellow" }, attributes: { itemType: "sofa", seats: "2", upholstery: "velvet", brand: "John Lewis", dimensions: "155 cm wide", assembly: "assembled", dealMethod: MEETUP } },
  "home-in-sofa-01": { fields: { condition: "lightly-used", color: "Grey" }, attributes: { itemType: "sofa", seats: "3", upholstery: "fabric", dealMethod: BOTH } },
  "home-in-sofa-02": { fields: { condition: "lightly-used", color: "Brown" }, attributes: { itemType: "recliner", seats: "1", upholstery: "faux_leather", dealMethod: MEETUP } },
  "home-sg-sofa-01": {
    fields: { condition: "lightly-used", color: "Grey" },
    attributes: { itemType: "sofa", seats: "3", upholstery: "fabric", assembly: "assembled", petSmokeFree: "yes", dealMethod: BOTH },
    text: [["no tears or stains.", "no tears or stains. From a non-smoking HDB flat in Tampines, lift to the floor. Can arrange delivery at cost."]],
  },
  "home-sg-sofa-02": {
    fields: { condition: "lightly-used", color: "Brown" },
    attributes: { itemType: "recliner", seats: "1", upholstery: "faux_leather", dealMethod: MEETUP },
    text: [["manual recline mechanism.", "manual recline mechanism. Self-collect from Tampines."]],
  },

  // ── Beds & Bedroom ──
  "home-bed-01": { fields: { condition: "like-new", color: "Grey" }, attributes: { itemType: "bed_frame", bedSize: "super_king", storageBed: "yes", material: "Velvet", assembly: "dismantle", dealMethod: MEETUP } },
  "home-bed-02": { fields: { condition: "like-new", color: "White" }, attributes: { itemType: "wardrobe", brand: "IKEA", dimensions: "300 cm wide", assembly: "dismantle", dealMethod: MEETUP } },
  "home-bed-03": { fields: { condition: "lightly-used" }, attributes: { itemType: "drawers", brand: "Oak Furnitureland", material: "Solid oak", dealMethod: MEETUP } },
  "home-in-bed-01": { fields: { condition: "lightly-used" }, attributes: { itemType: "bed_frame", bedSize: "queen", storageBed: "yes", material: "Solid wood", assembly: "dismantle", dealMethod: BOTH } },
  "home-in-bed-02": { fields: { condition: "lightly-used" }, attributes: { itemType: "mattress", bedSize: "queen", mattressType: "memory_foam", dimensions: "8 inch thick", dealMethod: BOTH } },
  "home-sg-bed-01": {
    fields: { condition: "lightly-used" },
    attributes: { itemType: "bed_frame", bedSize: "queen", storageBed: "yes", material: "Solid wood", assembly: "dismantle", dealMethod: MEETUP },
    text: [["under-bed storage drawers.", "under-bed storage drawers. Dismantled and ready for collection in Bedok."]],
  },
  "home-sg-bed-02": {
    fields: { condition: "lightly-used" },
    attributes: { itemType: "mattress", bedSize: "queen", mattressType: "memory_foam", dimensions: "8 inch thick", dealMethod: BOTH },
    text: [["excellent back support.", "excellent back support. Always used with a protector. Delivery within Bedok possible."]],
  },

  // ── Tables, Desks & Dining ──
  "home-table-01": { fields: { condition: "lightly-used", color: "Dusty pink chairs" }, attributes: { itemType: "dining_set", seats: "6", brand: "Barker & Stonehouse", material: "Marble-effect glass", dimensions: "180 x 90 cm", dealMethod: MEETUP } },
  "home-table-02": { fields: { condition: "lightly-used", color: "Slate grey chairs" }, attributes: { itemType: "dining_set", seats: "6", material: "Solid oak", dimensions: "160 x 90 cm", dealMethod: MEETUP } },
  "home-table-03": { fields: { condition: "like-new" }, attributes: { itemType: "desk", heightAdjustable: "yes", dimensions: "180 x 80 cm", assembly: "dismantle", dealMethod: MEETUP } },
  "home-in-dining-01": { fields: { condition: "lightly-used" }, attributes: { itemType: "dining_set", seats: "6", material: "Solid wood", dealMethod: BOTH } },
  "home-in-dining-02": { fields: { condition: "lightly-used" }, attributes: { itemType: "coffee", material: "Glass and metal", dealMethod: MEETUP } },
  "home-sg-dining-01": {
    fields: { condition: "lightly-used" },
    attributes: { itemType: "dining_set", seats: "6", material: "Solid wood", dealMethod: BOTH },
    text: [["sturdy build.", "sturdy build. Moving out of our Joo Chiat flat, delivery can be arranged."]],
  },
  "home-sg-dining-02": {
    fields: { condition: "lightly-used" },
    attributes: { itemType: "coffee", material: "Glass and metal", dealMethod: MEETUP },
    text: [["sturdy metal legs.", "sturdy metal legs. Self-collect from Joo Chiat."]],
  },

  // ── Kitchen & Appliances ──
  "home-kit-01": { fields: { condition: "like-new", color: "Empire Red", model: "Artisan 4.8L" }, attributes: { itemType: "small", brand: "KitchenAid", capacity: "4.8 L", dealMethod: BOTH } },
  "home-kit-02": { fields: { condition: "like-new", color: "Matte black", model: "Vertuo Next" }, attributes: { itemType: "small", brand: "Nespresso", dealMethod: BOTH } },
  "home-kit-03": { fields: { condition: "new", model: "Vortex Plus 10L" }, attributes: { itemType: "small", brand: "Instant", capacity: "10 L", dealMethod: BOTH } },
  "home-in-kitchen-01": { fields: { condition: "lightly-used" }, attributes: { itemType: "fridge", capacity: "300 L", energyRating: "3", dealMethod: MEETUP } },
  "home-in-kitchen-02": { fields: { condition: "lightly-used" }, attributes: { itemType: "microwave", capacity: "25 L", dealMethod: BOTH } },
  "home-sg-kitchen-01": {
    fields: { condition: "lightly-used" },
    attributes: { itemType: "fridge", capacity: "300 L", energyRating: "3", dealMethod: MEETUP },
    text: [["energy efficient and spacious.", "energy efficient and spacious (3 ticks). Buyer arranges transport from Jurong West."]],
  },
  "home-sg-kitchen-02": {
    fields: { condition: "lightly-used" },
    attributes: { itemType: "microwave", capacity: "25 L", dealMethod: BOTH },
    text: [["baking and reheating.", "baking and reheating. Collect in Jurong West or delivery by arrangement."]],
  },

  // ── Storage & Shelving ──
  "home-store-01": { fields: { condition: "lightly-used", color: "White" }, attributes: { itemType: "cube", brand: "IKEA", dimensions: "147 x 147 cm", assembly: "assembled", dealMethod: MEETUP } },
  "home-store-02": { fields: { condition: "lightly-used", color: "Chrome" }, attributes: { itemType: "rack", material: "Chrome wire", dimensions: "90 x 45 x 180 cm", assembly: "flatpack", dealMethod: MEETUP } },
  "home-store-03": { fields: { condition: "like-new", color: "White" }, attributes: { itemType: "bookcase", brand: "IKEA", dimensions: "80 x 28 x 202 cm each", quantity: 3, dealMethod: MEETUP } },
  "home-in-storage-01": { fields: { condition: "lightly-used" }, attributes: { itemType: "bookcase", material: "Engineered wood", assembly: "assembled", dealMethod: MEETUP } },
  "home-in-storage-02": { fields: { condition: "lightly-used" }, attributes: { itemType: "cabinet", assembly: "assembled", dealMethod: MEETUP } },
  "home-sg-storage-01": {
    fields: { condition: "lightly-used" },
    attributes: { itemType: "bookcase", material: "Engineered wood", assembly: "flatpack", dealMethod: MEETUP },
    text: [["easy to assemble.", "easy to assemble. Already flat-packed for collection in Toa Payoh."]],
  },
  "home-sg-storage-02": {
    fields: { condition: "lightly-used" },
    attributes: { itemType: "cabinet", assembly: "assembled", dealMethod: MEETUP },
    text: [["closets or utility rooms.", "closets or utility rooms. Fits the store room of a standard HDB flat. Collect in Toa Payoh."]],
  },

  // ── Home Decor & Accessories ──
  "home-decor-01": { fields: { condition: "like-new", color: "Ochre, teal & charcoal" }, attributes: { itemType: "art", soldAs: "single", dimensions: "120 x 80 cm", dealMethod: MEETUP } },
  "home-decor-02": { fields: { condition: "like-new", color: "White frames" }, attributes: { itemType: "art", soldAs: "set", dimensions: "A3", dealMethod: BOTH } },
  "home-decor-03": { fields: { condition: "lightly-used", color: "Brass, cream shades" }, attributes: { itemType: "lighting", soldAs: "pair", material: "Solid brass", dealMethod: BOTH } },
  "home-in-decor-01": { fields: { condition: "lightly-used" }, attributes: { itemType: "art", soldAs: "set", dealMethod: BOTH } },
  "home-in-decor-02": { fields: { condition: "lightly-used" }, attributes: { itemType: "lighting", soldAs: "single", material: "Ceramic", dealMethod: BOTH } },
  "home-sg-decor-01": {
    fields: { condition: "lightly-used" },
    attributes: { itemType: "art", soldAs: "set", dealMethod: BOTH },
    text: [["ready to hang.", "ready to hang. Can post by courier or meet near Novena MRT."]],
  },
  "home-sg-decor-02": {
    fields: { condition: "lightly-used" },
    attributes: { itemType: "lighting", soldAs: "single", material: "Ceramic", dealMethod: BOTH },
    text: [["any room.", "any room. Comes with a Singapore 3-pin plug. Meet near Novena MRT."]],
  },

  // ── Garden & Outdoor ──
  "home-garden-01": { fields: { condition: "like-new", color: "Black" }, attributes: { itemType: "bbq", bbqFuel: "charcoal", brand: "Weber", dimensions: "57 cm", dealMethod: MEETUP } },
  "home-garden-02": { fields: { condition: "used", color: "Dark brown, cream cushions" }, attributes: { itemType: "furniture", seats: "4", material: "Rattan", dealMethod: MEETUP } },
  "home-garden-03": { fields: { condition: "lightly-used" }, attributes: { itemType: "power", powerSource: "cordless", brand: "Bosch", dealMethod: MEETUP } },
  "home-in-garden-01": { fields: { condition: "lightly-used" }, attributes: { itemType: "pots", material: "Ceramic", dealMethod: BOTH } },
  "home-in-garden-02": { fields: { condition: "lightly-used" }, attributes: { itemType: "furniture", seats: "2", material: "Wood", dealMethod: MEETUP } },
  "home-sg-garden-01": {
    fields: { condition: "lightly-used" },
    attributes: { itemType: "pots", material: "Ceramic", dealMethod: BOTH },
    text: [["healthy plants.", "healthy plants. Good for HDB corridors and balconies. Collect in Yishun."]],
  },
  "home-sg-garden-02": {
    fields: { condition: "lightly-used" },
    attributes: { itemType: "furniture", seats: "2", material: "Wood", dealMethod: MEETUP },
    text: [["gardens or patios.", "balconies or patios. Self-collect from Yishun."]],
  },

  // ── DIY, Tools & Hardware ──
  "home-diy-01": { fields: { condition: "lightly-used", model: "DCD796 + DCF887" }, attributes: { itemType: "power", powerSource: "cordless", batteries: "included", brand: "DeWalt", dealMethod: BOTH } },
  "home-diy-02": { fields: { condition: "lightly-used", model: "K5 Full Control" }, attributes: { itemType: "power", powerSource: "corded", brand: "Kärcher", dealMethod: MEETUP } },
  "home-diy-03": { fields: { condition: "like-new", model: "GLL 3-80 CG" }, attributes: { itemType: "measuring", brand: "Bosch", dealMethod: BOTH } },
  "home-in-diy-01": { fields: { condition: "lightly-used" }, attributes: { itemType: "power", powerSource: "cordless", batteries: "included", dealMethod: BOTH } },
  "home-in-diy-02": { fields: { condition: "lightly-used" }, attributes: { itemType: "hand", dealMethod: BOTH } },
  "home-sg-diy-01": {
    fields: { condition: "lightly-used" },
    attributes: { itemType: "power", powerSource: "cordless", batteries: "included", dealMethod: BOTH },
    text: [["home DIY projects.", "home DIY projects. Comes with a Singapore 3-pin charger. Meet at Ubi MRT."]],
  },
  "home-sg-diy-02": {
    fields: { condition: "lightly-used" },
    attributes: { itemType: "hand", dealMethod: BOTH },
    text: [["DIY tasks.", "DIY tasks. Meet at Ubi MRT or courier at cost."]],
  },
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
