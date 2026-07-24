// scripts/migrate-mock-to-db.ts
// Run with: npx tsx --env-file=.env.local scripts/migrate-mock-to-db.ts
// Requires MONGODB_URI in your environment, pointing at lokalads-staging.
//
// Transfers the entire lib/mock/ dataset (3 countries x 21 categories, ~980
// listings) into MongoDB so DB-backed reads/writes have real data to check
// against instead of the in-memory mock arrays. Wipes the Listing and User
// collections first (same pattern as scripts/seed.ts) — this is the staging
// DB, safe to reset.

import dbConnect from "../src/lib/db";
import User from "../src/models/user";
import Listing from "../src/lib/db/models/Listing";
import { ADV_ID_RANGES } from "../src/lib/db/models/constants";
import { ALL_MAP } from "../src/lib/mock/listing-map";
import { getSubcategoryIds, getListingsForMarket } from "../src/lib/mock/country-map";
import type { Listing as MockListing, Seller as MockSeller, KeyValueRow } from "../src/types/listing";
import type { CountryCode } from "../src/config";
import { hash } from "bcryptjs";

const COUNTRIES: CountryCode[] = ["in", "gb", "sg"];

// Mock category ids are underscore-separated (e.g. "health_beauty"); the DB
// enum uses dashes (e.g. "health-beauty") — see constants.ts CATEGORIES.
function toDbCategory(mockCategoryId: string): string {
  return mockCategoryId.replace(/_/g, "-");
}

// Mock sellers carry a free-text `role` (275 distinct values — "Property
// Agent", "Vinyl Records Collector & Seller", …) but the DB's User.role only
// allows individual | business | agency | other. Best-effort classification —
// this is display/test data, not a field anything downstream branches on.
function classifyRole(role: string): "individual" | "business" | "agency" | "other" {
  const r = role.toLowerCase();
  if (/agen(t|cy)|broker|propnex|realtor/.test(r)) return "agency";
  if (/\b(private|owner|homeowner|resident|job seeker|parent|volunteer|musician|tech enthusiast|freelance|independent contractor|tenant)\b/.test(r)) {
    return "individual";
  }
  return "business";
}

// DB schema requires 4-6 keyDetails/goodToKnow rows; ~half the mock dataset
// has 1-3 (older categories were audited to 4-6, newer ones weren't). Pad
// with placeholder rows rather than dropping the listing.
function normalizeRows(rows: KeyValueRow[]): KeyValueRow[] {
  const out = rows.slice(0, 6);
  let filler = 1;
  while (out.length < 4) out.push({ key: `Note ${filler}`, value: "—" }), filler++;
  return out;
}

async function main() {
  await dbConnect();

  console.log("Wiping existing Listing/User collections...");
  await Listing.deleteMany({});
  await User.deleteMany({});

  // ── Pass 1: walk every country x category x subcategory, collect listings
  // and the set of unique sellers (deduped by display name) up front ──
  type Row = { country: CountryCode; dbCategory: string; subcategory: string; listing: MockListing };
  const rows: Row[] = [];
  const sellersByName = new Map<string, MockSeller>();

  for (const mockCategoryId of Object.keys(ALL_MAP)) {
    const dbCategory = toDbCategory(mockCategoryId);
    if (!(dbCategory in ADV_ID_RANGES)) {
      console.warn(`Skipping "${mockCategoryId}" — no matching DB category`);
      continue;
    }
    const subIds = getSubcategoryIds(mockCategoryId);
    for (const country of COUNTRIES) {
      for (const sub of subIds) {
        const listings = getListingsForMarket(mockCategoryId, country, sub) as MockListing[];
        for (const listing of listings) {
          rows.push({ country, dbCategory, subcategory: sub, listing });
          if (!sellersByName.has(listing.seller.name)) {
            sellersByName.set(listing.seller.name, listing.seller);
          }
        }
      }
    }
  }

  console.log(`Found ${rows.length} listings, ${sellersByName.size} unique sellers.`);

  // ── Pass 2: create one User per unique seller ──
  const hashedPassword = await hash("password123", 10);
  const userIdByName = new Map<string, { _id: unknown; fullName: string; role: string; locality?: string; image?: string; isEmailVerified: boolean; isPrimaryNumberVerified: boolean }>();

  let seq = 0;
  for (const [name, seller] of sellersByName) {
    seq++;
    const emailSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, ".").replace(/^\.+|\.+$/g, "") || `seller${seq}`;
    const user = await User.create({
      userId: `mock-${String(seq).padStart(6, "0")}`,
      fullName: name,
      dateOfBirth: new Date("1990-01-01"),
      locality: seller.location,
      email: `${emailSlug}.${seq}@mock.lokalads.test`,
      isEmailVerified: seller.verified,
      // Every mock user needs a distinct value here — primaryNumber has a
      // unique+sparse index, but an existing (pre-sparse) index build on
      // staging still collides multiple `null`s, so give each a synthetic
      // unique placeholder rather than omitting the field.
      primaryNumber: `+999${String(seq).padStart(8, "0")}`,
      isPrimaryNumberVerified: seller.verified,
      password: hashedPassword,
      role: classifyRole(seller.role),
      provider: "credentials",
      accountStatus: "Active",
      isNewUser: false,
      isTermsAndConditionAccepted: true,
      isPrivacyAndPolicyAccepted: true,
      isCookiesPolicyAccepted: true,
      image: seller.avatar,
    });
    userIdByName.set(name, {
      _id: user._id,
      fullName: user.fullName,
      role: user.role,
      locality: user.locality,
      image: user.image,
      isEmailVerified: user.isEmailVerified,
      isPrimaryNumberVerified: user.isPrimaryNumberVerified,
    });
  }
  console.log(`Created ${userIdByName.size} users.`);

  // ── Pass 3: build Listing docs — advId is regenerated per-category
  // (globally unique in DB; mock reuses the same numbers across countries) ──
  const advCounters: Record<string, number> = {};
  for (const [cat, [start]] of Object.entries(ADV_ID_RANGES)) advCounters[cat] = start;

  const docs = rows.map(({ country, dbCategory, subcategory, listing }) => {
    const sellerUser = userIdByName.get(listing.seller.name)!;
    const advId = String(advCounters[dbCategory]++);
    return {
      country,
      category: dbCategory,
      subcategory,
      id: listing.id,
      images: listing.images.map((img, i) => ({
        src: img.src,
        alt: img.alt || `${listing.title} — photo ${i + 1}`,
      })),
      priceLabel: listing.priceLabel,
      priceSuffix: listing.priceSuffix,
      title: listing.title,
      detailsLabel: listing.detailsLabel,
      locationLabel: listing.locationLabel,
      status: listing.status === "off-market" ? "off-market" : "active",
      listingType: subcategory === "wanted" ? "wanted" : "offer",
      advId,
      description: listing.description,
      keyDetails: normalizeRows(listing.keyDetails),
      goodToKnow: normalizeRows(listing.goodToKnow),
      coordinates: listing.coordinates,
      seller: {
        userId: sellerUser._id,
        fullName: sellerUser.fullName,
        role: sellerUser.role,
        locality: sellerUser.locality,
        image: sellerUser.image,
        isEmailVerified: sellerUser.isEmailVerified,
        isPrimaryNumberVerified: sellerUser.isPrimaryNumberVerified,
      },
    };
  });

  console.log(`Inserting ${docs.length} listings...`);
  const CHUNK = 200;
  let inserted = 0;
  for (let i = 0; i < docs.length; i += CHUNK) {
    const chunk = docs.slice(i, i + CHUNK);
    const result = await Listing.insertMany(chunk as never[], { ordered: false }).catch((err) => {
      console.error(`Chunk ${i}-${i + chunk.length} had errors:`, err.message);
      return err.insertedDocs ?? [];
    });
    inserted += Array.isArray(result) ? result.length : 0;
    console.log(`  ...${Math.min(i + CHUNK, docs.length)}/${docs.length}`);
  }

  console.log(`Done. Users: ${userIdByName.size}, Listings inserted: ${inserted}/${docs.length}.`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
