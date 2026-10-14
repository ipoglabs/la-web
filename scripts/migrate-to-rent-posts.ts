// scripts/migrate-to-rent-posts.ts
// Run with: npx tsx --env-file=.env.local scripts/migrate-to-rent-posts.ts [--dry-run]
//
// One-off, for the reworked Property › To Rent form (2026-10-14):
// - Facilities were merged into Amenities, so a post's facilities move into
//   its amenities (the merged list offers every old facility).
// - "Pets Allowed" left the GB amenities for its own Pets Allowed field, so
//   that tick becomes petsAllowed = "Yes".
// - "Studio" left Property Type (Beds = Studio covers it). Such posts are
//   only reported — the seller re-picks the type on their next edit.

import mongoose from "mongoose";
import dbConnect from "../src/lib/db";
import Post from "../src/models/post";

async function run() {
  const dryRun = process.argv.includes("--dry-run");
  await dbConnect();

  const posts = await Post.find({ category: "Property", subcategory: "To Rent" })
    .select({ _id: 1, adsId: 1, propertyType: 1, facilities: 1, amenities: 1, attributes: 1 })
    .lean();

  for (const post of posts) {
    const id = post.adsId || String(post._id);
    if (post.propertyType === "Studio") console.log(`${id}: property type "Studio" — left for the seller to re-pick`);

    const $set: Record<string, unknown> = {};
    let amenities = [...new Set([...(post.amenities ?? []), ...(post.facilities ?? [])])];
    if (amenities.includes("Pets Allowed")) {
      amenities = amenities.filter((a) => a !== "Pets Allowed");
      $set["attributes.petsAllowed"] = "Yes";
    }
    if (post.facilities?.length) $set.facilities = [];
    if (post.facilities?.length || "attributes.petsAllowed" in $set) $set.amenities = amenities;
    if (!Object.keys($set).length) continue;

    console.log(`${id}: ${dryRun ? "would set" : "set"} ${JSON.stringify($set)}`);
    if (!dryRun) await Post.updateOne({ _id: post._id }, { $set });
  }
}

run()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
