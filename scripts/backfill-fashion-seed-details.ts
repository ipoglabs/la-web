// scripts/backfill-fashion-seed-details.ts
// Run with: npx tsx --env-file=.env.local scripts/backfill-fashion-seed-details.ts [--dry-run]
//
// One-off (2026-10-26): the Fashion & Clothing seed posts have only a title, a
// description and a price, so the reworked search filters had nothing to
// match. This fills, from each ad's own text, what the reworked forms ask:
// Type for every sub, Condition, Size, Brand, Colour and For where the ad
// gives them, plus each sub's own fields (Occasion, Shoe Size, Metal,
// Movement, Box & Papers, Designer, Proof of Authenticity, Era). Detail fields
// are only filled where empty, so it is safe to re-run.
//
// The Louis Vuitton Speedy moves from Bags & Accessories to Designer &
// Luxury. The Singapore seeds were word-for-word copies of India's; they get
// local details in their text.

import mongoose from "mongoose";
import dbConnect from "../src/lib/db";
import Post from "../src/models/post";

interface SeedDetails {
  /** Post model paths the forms save top-level, filled where empty. */
  fields?: Record<string, unknown>;
  /** Everything else the forms save under `attributes`, filled where empty. */
  attributes?: Record<string, unknown>;
  /** Always written: moves. */
  set?: Record<string, unknown>;
  /** Text swapped in the title and description. */
  text?: [string, string][];
}

const MEETUP = ["meetup"];
const BOTH = ["meetup", "delivery"];

// Values are the Fashion & Clothing forms' (posting/form-schema/defaults/fashion.ts).
const DETAILS: Record<string, SeedDetails> = {
  // ── Men's Clothing ──
  "fash-mens-01": { fields: { condition: "lightly-used", size: "m" }, attributes: { itemType: "shirts", lotType: "bundle", brand: "Ted Baker", dealMethod: BOTH } },
  "fash-mens-02": { fields: { condition: "lightly-used", size: "l", color: "Black" }, attributes: { itemType: "jackets", lotType: "single", brand: "Canada Goose", dealMethod: BOTH } },
  "fash-mens-03": { fields: { condition: "like-new", size: "m", color: "Pillar Blue" }, attributes: { itemType: "jackets", lotType: "single", brand: "Arc'teryx", dealMethod: BOTH } },
  "fashion-in-mens-01": { fields: { condition: "like-new", size: "l", color: "Navy blue" }, attributes: { itemType: "suits", sizeDetails: "40", lotType: "single", dealMethod: BOTH } },
  "fashion-in-mens-02": { fields: { condition: "new", size: "m", color: "Dark wash" }, attributes: { itemType: "bottoms", sizeDetails: "Waist 32", lotType: "single", dealMethod: BOTH } },
  "fashion-sg-mens-01": {
    fields: { condition: "like-new", size: "l", color: "Navy blue" },
    attributes: { itemType: "suits", sizeDetails: "40", lotType: "single", dealMethod: BOTH },
    text: [["office and events.", "office and events. Meet at Bugis MRT or mail via SingPost."]],
  },
  "fashion-sg-mens-02": {
    fields: { condition: "new", size: "m", color: "Dark wash" },
    attributes: { itemType: "bottoms", sizeDetails: "Waist 32", lotType: "single", dealMethod: BOTH },
    text: [["tags still attached.", "tags still attached. Bought online, wrong fit. Meet at Bugis MRT."]],
  },

  // ── Women's Clothing ──
  "fash-wmns-01": { fields: { condition: "lightly-used", size: "s" }, attributes: { itemType: "dresses", sizeDetails: "UK 10", lotType: "bundle", brand: "Zara, & Other Stories", dealMethod: BOTH } },
  "fash-wmns-02": { fields: { condition: "like-new", size: "m", color: "Camel" }, attributes: { itemType: "jackets", sizeDetails: "IT 40 / UK 12", lotType: "single", brand: "Prada", dealMethod: BOTH } },
  "fash-wmns-03": { fields: { condition: "lightly-used", size: "m" }, attributes: { itemType: "workwear", sizeDetails: "UK 12", lotType: "bundle", brand: "Monsoon, White Stuff", dealMethod: BOTH } },
  "fashion-in-womens-01": { fields: { condition: "like-new", size: "m", color: "Floral" }, attributes: { itemType: "dresses", lotType: "single", material: "Cotton", dealMethod: BOTH } },
  "fashion-in-womens-02": { fields: { condition: "lightly-used", size: "s", color: "Blue denim" }, attributes: { itemType: "jackets", lotType: "single", material: "Denim", dealMethod: BOTH } },
  "fashion-sg-womens-01": {
    fields: { condition: "like-new", size: "m", color: "Floral" },
    attributes: { itemType: "dresses", lotType: "single", material: "Cotton", dealMethod: BOTH },
    text: [["worn only twice.", "worn only twice. Light enough for Singapore weather. Meet at Orchard MRT."]],
  },
  "fashion-sg-womens-02": {
    fields: { condition: "lightly-used", size: "s", color: "Blue denim" },
    attributes: { itemType: "jackets", lotType: "single", material: "Denim", dealMethod: BOTH },
    text: [["for all seasons.", "for air-conditioned offices. Meet at Orchard MRT."]],
  },

  // ── Traditional & Ethnic Wear ──
  "fash-eth-01": { fields: { condition: "like-new", size: "free", color: "Deep blue & gold", gender: "women" }, attributes: { itemType: "saree", occasion: "wedding", material: "Kanjivaram silk", dealMethod: BOTH } },
  "fash-eth-02": { fields: { condition: "like-new", size: "l", color: "Navy & gold", gender: "men" }, attributes: { itemType: "african", occasion: "wedding", dealMethod: BOTH } },
  "fash-eth-03": { fields: { condition: "like-new", size: "m", color: "Black & rose gold", gender: "women" }, attributes: { itemType: "abaya", occasion: "festive", sizeDetails: "UK 10–12", material: "Crepe", dealMethod: BOTH } },
  "fashion-in-ethnic-01": { fields: { condition: "lightly-used", size: "free", color: "Maroon", gender: "women" }, attributes: { itemType: "saree", occasion: "wedding", material: "Banarasi silk", dealMethod: BOTH } },
  "fashion-in-ethnic-02": { fields: { condition: "lightly-used", size: "l", color: "Cream", gender: "men" }, attributes: { itemType: "kurta", occasion: "festive", dealMethod: BOTH } },
  "fashion-sg-ethnic-01": {
    fields: { condition: "lightly-used", size: "free", color: "Maroon", gender: "women" },
    attributes: { itemType: "saree", occasion: "wedding", material: "Banarasi silk", dealMethod: BOTH },
    text: [["perfect for weddings.", "perfect for weddings and Deepavali. Collect in Little India."]],
  },
  "fashion-sg-ethnic-02": {
    fields: { condition: "lightly-used", size: "l", color: "Cream", gender: "men" },
    attributes: { itemType: "kurta", occasion: "festive", dealMethod: BOTH },
    text: [["festive occasions.", "festive occasions like Deepavali. Collect in Little India."]],
  },

  // ── Shoes & Footwear ──
  "fash-shoe-01": { fields: { condition: "like-new", gender: "men", color: "Black, red & white" }, attributes: { itemType: "trainers", shoeSize: "uk_9", sizeDetails: "UK 9 / EU 44", brand: "Nike", originalBox: "yes", dealMethod: BOTH } },
  "fash-shoe-02": { fields: { condition: "like-new", gender: "women", color: "Nude satin" }, attributes: { itemType: "heels", sizeDetails: "UK 5.5 / EU 38.5", brand: "Manolo Blahnik", originalBox: "yes", dealMethod: BOTH } },
  "fash-shoe-03": { fields: { condition: "like-new", gender: "men", color: "Marblehead grey" }, attributes: { itemType: "trainers", shoeSize: "uk_8", sizeDetails: "UK 8 / EU 42", brand: "New Balance", originalBox: "yes", dealMethod: BOTH } },
  "fashion-in-shoes-01": { fields: { condition: "lightly-used", gender: "men", color: "Black" }, attributes: { itemType: "formal", shoeSize: "uk_9", dealMethod: BOTH } },
  "fashion-in-shoes-02": { fields: { condition: "lightly-used", gender: "unisex", color: "White" }, attributes: { itemType: "trainers", shoeSize: "uk_8", dealMethod: BOTH } },
  "fashion-sg-shoes-01": {
    fields: { condition: "lightly-used", gender: "men", color: "Black" },
    attributes: { itemType: "formal", shoeSize: "eu_43", sizeDetails: "UK 9", dealMethod: BOTH },
    text: [["Black, Size 9", "Black, EU 43"], ["size 9,", "EU 43 (UK 9),"]],
  },
  "fashion-sg-shoes-02": {
    fields: { condition: "lightly-used", gender: "unisex", color: "White" },
    attributes: { itemType: "trainers", shoeSize: "eu_42", sizeDetails: "UK 8", dealMethod: BOTH },
    text: [["Size 8, Unisex", "EU 42, Unisex"], ["size 8,", "EU 42 (UK 8),"]],
  },

  // ── Bags & Accessories ──
  "fash-bag-02": { fields: { condition: "lightly-used", gender: "women", color: "Oak" }, attributes: { itemType: "tote", material: "leather", brand: "Mulberry", dealMethod: BOTH } },
  "fash-bag-03": { fields: { condition: "like-new", gender: "unisex", color: "Black" }, attributes: { itemType: "backpack", material: "nylon", brand: "Eastpak", dealMethod: BOTH } },
  "fashion-in-bags-01": { fields: { condition: "lightly-used", gender: "women", color: "Tan" }, attributes: { itemType: "handbag", material: "leather", dealMethod: BOTH } },
  "fashion-in-bags-02": { fields: { condition: "lightly-used", gender: "unisex" }, attributes: { itemType: "luggage", material: "nylon", dealMethod: BOTH } },
  "fashion-sg-bags-01": {
    fields: { condition: "lightly-used", gender: "women", color: "Tan" },
    attributes: { itemType: "handbag", material: "leather", dealMethod: BOTH },
    text: [["everyday accessory.", "everyday accessory. Meet at Raffles Place MRT after work."]],
  },
  "fashion-sg-bags-02": {
    fields: { condition: "lightly-used", gender: "unisex" },
    attributes: { itemType: "luggage", material: "nylon", dealMethod: BOTH },
    text: [["trips and commuting.", "trips and commuting. Good size for budget-airline cabin bags. Meet at Raffles Place MRT."]],
  },

  // ── Jewellery & Watches ──
  "fash-jew-01": { fields: { condition: "lightly-used", gender: "men" }, attributes: { itemType: "watch", metal: "steel", movement: "automatic", boxPapers: "both", brand: "Rolex", dealMethod: MEETUP } },
  "fash-jew-02": { fields: { condition: "lightly-used", gender: "women" }, attributes: { itemType: "bracelet", metal: "silver", brand: "Pandora", dealMethod: BOTH } },
  "fash-jew-03": { fields: { condition: "like-new", gender: "unisex" }, attributes: { itemType: "watch", metal: "steel", movement: "automatic", boxPapers: "both", brand: "Tissot", dealMethod: BOTH } },
  "fashion-in-jewellery-01": { fields: { condition: "like-new", gender: "women" }, attributes: { itemType: "necklace", metal: "silver", dealMethod: BOTH } },
  "fashion-in-jewellery-02": { fields: { condition: "lightly-used", gender: "men" }, attributes: { itemType: "watch", metal: "steel", movement: "automatic", boxPapers: "box", dealMethod: BOTH } },
  "fashion-sg-jewellery-01": {
    fields: { condition: "like-new", gender: "women" },
    attributes: { itemType: "necklace", metal: "silver", dealMethod: BOTH },
    text: [["hallmark certified.", "hallmark certified (925). Meet at Marina Bay."]],
  },
  "fashion-sg-jewellery-02": {
    fields: { condition: "lightly-used", gender: "men" },
    attributes: { itemType: "watch", metal: "steel", movement: "automatic", boxPapers: "box", dealMethod: BOTH },
    text: [["sapphire glass.", "sapphire glass. Original box included. Meet at Marina Bay."]],
  },

  // ── Designer & Luxury ──
  "fash-bag-01": {
    set: { subcategory: "designer_luxury" },
    fields: { condition: "lightly-used", gender: "women", size: "30 cm" },
    attributes: { itemType: "bag", brand: "lv", authenticity: "none", included: ["dust_bag"], dealMethod: MEETUP },
  },
  "fash-des-01": { fields: { condition: "lightly-used", gender: "women", size: "UK 14 Regular", color: "Honey" }, attributes: { itemType: "clothing", brand: "burberry", authenticity: "receipt", included: ["dust_bag", "receipt"], dealMethod: BOTH } },
  "fash-des-02": { fields: { condition: "like-new", gender: "women", color: "Dusty pink" }, attributes: { itemType: "bag", brand: "gucci", authenticity: "receipt", included: ["dust_bag", "receipt", "papers"], dealMethod: MEETUP } },
  "fash-des-03": { fields: { condition: "new", gender: "women", color: "Orange & pink" }, attributes: { itemType: "accessories", brand: "hermes", authenticity: "none", included: ["box"], dealMethod: BOTH } },
  "fashion-in-luxury-01": { fields: { condition: "lightly-used", gender: "women" }, attributes: { itemType: "bag", brand: "other", authenticity: "authenticated", included: ["dust_bag"], dealMethod: MEETUP } },
  "fashion-in-luxury-02": { fields: { condition: "lightly-used", gender: "unisex" }, attributes: { itemType: "accessories", brand: "other", authenticity: "none", included: ["box"], dealMethod: BOTH } },
  "fashion-sg-luxury-01": {
    fields: { condition: "lightly-used", gender: "women" },
    attributes: { itemType: "bag", brand: "other", authenticity: "authenticated", included: ["dust_bag"], dealMethod: MEETUP },
    text: [["original dust bag.", "original dust bag. Happy to meet at an authentication shop on Orchard Road."]],
  },
  "fashion-sg-luxury-02": {
    fields: { condition: "lightly-used", gender: "unisex" },
    attributes: { itemType: "accessories", brand: "other", authenticity: "none", included: ["box"], dealMethod: BOTH },
    text: [["cleaning cloth included.", "cleaning cloth included. Meet at Orchard MRT."]],
  },

  // ── Vintage & Preloved ──
  "fash-vin-01": { fields: { condition: "new", gender: "men", size: "m", color: "Stonewash blue" }, attributes: { era: "90s", itemType: "clothing", sizeDetails: "W32 L30", brand: "Levi's", dealMethod: BOTH } },
  "fash-vin-02": { fields: { condition: "used", gender: "men", size: "m", color: "Faded denim" }, attributes: { era: "80s", itemType: "clothing", brand: "Levi's", dealMethod: BOTH } },
  "fash-vin-03": { fields: { condition: "like-new", gender: "men", size: "l", color: "Midnight navy" }, attributes: { era: "preloved", itemType: "clothing", sizeDetails: "Jacket 40R, trousers 34W / 30L", brand: "Reiss", dealMethod: BOTH } },
  "fashion-in-vintage-01": { fields: { condition: "used", gender: "unisex", size: "m" }, attributes: { era: "90s", itemType: "clothing", dealMethod: BOTH } },
  "fashion-in-vintage-02": { fields: { condition: "used", gender: "unisex" }, attributes: { era: "preloved", itemType: "bags", dealMethod: BOTH } },
  "fashion-sg-vintage-01": {
    fields: { condition: "used", gender: "unisex", size: "m" },
    attributes: { era: "90s", itemType: "clothing", dealMethod: BOTH },
    text: [["well-preserved condition.", "well-preserved condition. Found at a thrift shop, collect in Tiong Bahru."]],
  },
  "fashion-sg-vintage-02": {
    fields: { condition: "used", gender: "unisex" },
    attributes: { era: "preloved", itemType: "bags", dealMethod: BOTH },
    text: [["minor wear.", "minor wear. Collect in Tiong Bahru."]],
  },
};

function isEmpty(value: unknown): boolean {
  return value == null || value === "" || (Array.isArray(value) && value.length === 0);
}

async function run() {
  const dryRun = process.argv.includes("--dry-run");
  await dbConnect();

  // Moved seeds have left their sub, so they're found by adsId alone.
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
