// scripts/backfill-property-sale-type.ts
// Run with: npx tsx --env-file=.env.local scripts/backfill-property-sale-type.ts [--dry-run]
//
// One-off (2026-10-28): the To Buy form now asks New or Resale (and Chain
// Free in the UK). This fills them on the seed posts from each ad's own text:
// the Whitefield under-construction flat and the Bow new build are new, the
// rest are resales, and the Hackney terrace says "No Chain". Only empty
// fields are filled, so it is safe to re-run.

import mongoose from "mongoose";
import dbConnect from "../src/lib/db";
import Post from "../src/models/post";

const NEW = new Set(["prop-in-buy-01", "prop-buy-02"]);
const RESALE = [
  "prop-in-buy-02", "prop-in-buy-03",
  "prop-buy-01", "prop-buy-03", "prop-buy-04", "prop-buy-05", "prop-buy-06", "prop-buy-07", "prop-buy-08", "prop-buy-09", "prop-buy-10", "prop-buy-11", "prop-buy-12",
  "prop-sg-buy-01", "prop-sg-buy-02", "prop-sg-buy-03",
];
const CHAIN_FREE = new Set(["prop-buy-03"]);

async function run() {
  const dryRun = process.argv.includes("--dry-run");
  await dbConnect();

  const ids = [...NEW, ...RESALE];
  const posts = await Post.find({ category: "property", subcategory: "to_buy", adsId: { $in: ids } }).lean();
  const found = new Set(posts.map((p) => p.adsId));
  for (const id of ids) if (!found.has(id)) console.log(`${id}: no post`);

  for (const post of posts) {
    const id = post.adsId!;
    const attributes: Record<string, string> = { saleType: NEW.has(id) ? "new" : "resale", ...(CHAIN_FREE.has(id) ? { chainFree: "Yes" } : {}) };
    const $set: Record<string, string> = {};
    for (const [key, value] of Object.entries(attributes)) {
      if (post.attributes?.[key] == null || post.attributes[key] === "") $set[`attributes.${key}`] = value;
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
