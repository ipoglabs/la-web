// scripts/migrate-to-buy-posts.ts
// Run with: npx tsx --env-file=.env.local scripts/migrate-to-buy-posts.ts [--dry-run]
//
// One-off, for the reworked Property › To Buy form (2026-10-14):
// - Facilities were merged into Amenities, so a post's facilities move into
//   its amenities (the merged list offers every old facility).
// - Property Age became a select, so a typed age ("5", "5 years") becomes
//   the matching bucket. Ages that aren't a number are left for the seller
//   to re-pick when they next edit.

import mongoose from "mongoose";
import dbConnect from "../src/lib/db";
import Post from "../src/models/post";

function ageBucket(age: string): string | null {
  const years = Number.parseFloat(age);
  if (!Number.isFinite(years) || years < 0) return null;
  if (years < 1) return "0-1";
  if (years <= 5) return "1-5";
  if (years <= 10) return "5-10";
  if (years <= 20) return "10-20";
  return "20+";
}

const AGE_VALUES = new Set(["UnderConstruction", "0-1", "1-5", "5-10", "10-20", "20+"]);

async function run() {
  const dryRun = process.argv.includes("--dry-run");
  await dbConnect();

  const posts = await Post.find({ category: "Property", subcategory: "To Buy" })
    .select({ _id: 1, adsId: 1, facilities: 1, amenities: 1, age: 1 })
    .lean();

  for (const post of posts) {
    const $set: Record<string, unknown> = {};
    const facilities = post.facilities ?? [];
    if (facilities.length) {
      $set.amenities = [...new Set([...(post.amenities ?? []), ...facilities])];
      $set.facilities = [];
    }
    if (post.age && !AGE_VALUES.has(post.age)) {
      const bucket = ageBucket(post.age);
      if (bucket) $set.age = bucket;
      else console.log(`${post.adsId ?? post._id}: age "${post.age}" isn't a number — left as is`);
    }
    if (!Object.keys($set).length) continue;

    console.log(`${post.adsId ?? post._id}: ${dryRun ? "would set" : "set"} ${JSON.stringify($set)}`);
    if (!dryRun) await Post.updateOne({ _id: post._id }, { $set });
  }
}

run()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
