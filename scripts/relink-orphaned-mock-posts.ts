// scripts/relink-orphaned-mock-posts.ts
// Run with: npx tsx --env-file=.env.local scripts/relink-orphaned-mock-posts.ts
//
// Repairs Post.ownerId references broken by a later rerun of
// migrate-mock-to-db.ts, which wipes and recreates the User collection
// (see that script's own header comment) — the mock-seller users
// migrate-mock-to-posts.ts originally linked posts to got recreated with
// new _ids, orphaning every Post.ownerId that pointed at the old ones.
//
// SAFE BY CONSTRUCTION:
//   - Never touches a Post whose ownerId already resolves to a real,
//     currently-existing User.
//   - Only relinks a Post whose `adsId` matches a listing still present in
//     lib/mock/ (i.e. provably came from migrate-mock-to-posts.ts) — a
//     handful of orphaned posts belong to real users whose accounts were
//     later deleted (soft/hard-delete keeps a user's posts, unlinked, by
//     design — see project memory on account deletion). Those are left
//     alone; this script only reports their adsIds.
//   - Creates new mock-seller Users (never reuses/overwrites an existing
//     User document), same shape migrate-mock-to-db.ts used, with a fresh
//     `mock-NNNNNN` userId sequence and synthetic @mock.lokalads.test
//     emails — cannot collide with real accounts.
//
// Idempotent: rerunning after a successful pass finds zero orphaned posts
// left to relink (their ownerId now resolves to the just-created users).

import { hash } from "bcryptjs";
import type { Types } from "mongoose";
import dbConnect from "../src/lib/db";
import User from "../src/models/user";
import Post from "../src/models/post";
import { ALL_MAP } from "../src/lib/mock/listing-map";
import { getSubcategoryIds, getListingsForMarket } from "../src/lib/mock/country-map";
import type { Listing as MockListing, Seller as MockSeller } from "../src/types/listing";
import type { CountryCode } from "../src/config";

const COUNTRIES: CountryCode[] = ["in", "gb", "sg"];

// Mirrors migrate-mock-to-db.ts's classifyRole — kept identical so a
// relinked seller's publicRole matches what the original migration would
// have produced.
function classifyRole(role: string): "individual" | "business" | "agency" | "other" {
  const r = role.toLowerCase();
  if (/agen(t|cy)|broker|propnex|realtor/.test(r)) return "agency";
  if (/\b(private|owner|homeowner|resident|job seeker|parent|volunteer|musician|tech enthusiast|freelance|independent contractor|tenant)\b/.test(r)) {
    return "individual";
  }
  return "business";
}

async function main() {
  await dbConnect();

  // ── Rebuild adsId -> seller from lib/mock/, same traversal migrate-mock-
  // to-db.ts / migrate-mock-to-posts.ts used, so names match exactly ──
  const sellerByAdsId = new Map<string, MockSeller>();
  const sellersByName = new Map<string, MockSeller>();
  for (const mockCategoryId of Object.keys(ALL_MAP)) {
    const subs = getSubcategoryIds(mockCategoryId);
    for (const country of COUNTRIES) {
      for (const sub of subs) {
        const listings = getListingsForMarket(mockCategoryId, country, sub) as MockListing[];
        for (const listing of listings) {
          sellerByAdsId.set(listing.id, listing.seller);
          if (!sellersByName.has(listing.seller.name)) sellersByName.set(listing.seller.name, listing.seller);
        }
      }
    }
  }

  const realUserIds = new Set((await User.find({}, "_id").lean()).map((u) => String(u._id)));
  console.log(`Real users currently in DB: ${realUserIds.size}`);

  const posts = await Post.find({ ownerId: { $exists: true } }, { adsId: 1, ownerId: 1, seller_info: 1 }).lean();
  const orphaned = posts.filter((p) => !realUserIds.has(String(p.ownerId)));

  const inCatalog = orphaned.filter(
    (p): p is typeof p & { adsId: string } => p.adsId != null && sellerByAdsId.has(p.adsId),
  );
  const notInCatalog = orphaned.filter((p) => p.adsId == null || !sellerByAdsId.has(p.adsId));

  console.log(`Posts with an ownerId: ${posts.length}`);
  console.log(`Orphaned: ${orphaned.length} (relinkable via mock catalog: ${inCatalog.length}, left alone: ${notInCatalog.length})`);
  if (notInCatalog.length > 0) {
    console.log("Left alone (not in lib/mock/ — likely a real, since-deleted account):");
    for (const p of notInCatalog) console.log(`  - adsId=${p.adsId} seller_info.name=${p.seller_info?.name ?? "(none)"}`);
  }
  if (inCatalog.length === 0) {
    console.log("Nothing to relink. Done.");
    process.exit(0);
  }

  // ── Create one new User per distinct seller name actually needed ──
  const neededNames = new Set(inCatalog.map((p) => sellerByAdsId.get(p.adsId)!.name));
  const hashedPassword = await hash("password123", 10);
  const newUserIdByName = new Map<string, Types.ObjectId>();

  let seq = 0;
  for (const name of neededNames) {
    const seller = sellersByName.get(name)!;
    seq++;
    const emailSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, ".").replace(/^\.+|\.+$/g, "") || `seller${seq}`;
    const user = await User.create({
      userId: `mock-${String(seq).padStart(6, "0")}`,
      fullName: name,
      dateOfBirth: new Date("1990-01-01"),
      locality: seller.location,
      email: `${emailSlug}.${seq}@mock.lokalads.test`,
      isEmailVerified: seller.verified,
      primaryNumber: `+998${String(seq).padStart(8, "0")}`, // +998 (not +999) — migrate-mock-to-db.ts's prefix, avoids colliding if that script's users ever come back
      isPrimaryNumberVerified: seller.verified,
      password: hashedPassword,
      publicRole: classifyRole(seller.role),
      provider: "credentials",
      accountStatus: "Active",
      isNewUser: false,
      isTermsAndConditionAccepted: true,
      isPrivacyAndPolicyAccepted: true,
      isCookiesPolicyAccepted: true,
      image: seller.avatar,
    });
    newUserIdByName.set(name, user._id);
  }
  console.log(`Created ${newUserIdByName.size} mock-seller users.`);

  // ── Relink every orphaned-but-catalog-matched post ──
  const ops = inCatalog.map((p) => ({
    updateOne: {
      filter: { _id: p._id },
      update: { $set: { ownerId: newUserIdByName.get(sellerByAdsId.get(p.adsId)!.name) } },
    },
  }));

  const CHUNK = 200;
  let relinked = 0;
  for (let i = 0; i < ops.length; i += CHUNK) {
    const chunk = ops.slice(i, i + CHUNK);
    const result = await Post.bulkWrite(chunk, { ordered: false });
    relinked += result.modifiedCount ?? 0;
    console.log(`  ...${Math.min(i + CHUNK, ops.length)}/${ops.length}`);
  }

  console.log(`Done. Users created: ${newUserIdByName.size}, posts relinked: ${relinked}/${inCatalog.length}.`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Relink failed:", err);
  process.exit(1);
});
