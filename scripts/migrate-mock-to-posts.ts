// scripts/migrate-mock-to-posts.ts
// Run with: npx tsx --env-file=.env.local scripts/migrate-mock-to-posts.ts
//
// The real listings page (/api/listings/[category]) reads from the `Post`
// model (real user-submitted ads), not the `Listing` scaffold that
// scripts/migrate-mock-to-db.ts seeds — that script feeds a DB-backed API
// example that isn't actually wired into any page yet. This script instead
// transfers lib/mock/ into `Post` so /[country]/listings?cat=&sub= actually
// shows results in local dev (which defaults to the "db" listings source).
//
// Append-only — does NOT wipe the Post collection (there are a few real
// manually-created QA posts in there already). Idempotent via adsId: mock
// listing ids are already globally unique, so reruns upsert in place rather
// than duplicating.

import dbConnect from "../src/lib/db";
import User from "../src/models/user";
import Post from "../src/models/post";
import { ALL_MAP } from "../src/lib/mock/listing-map";
import { getSubcategoryIds, getListingsForMarket } from "../src/lib/mock/country-map";
import type { Listing as MockListing } from "../src/types/listing";
import type { CountryCode } from "../src/config";

const COUNTRIES: CountryCode[] = ["in", "gb", "sg"];

// Best-effort mapping of a mock listing's price onto Post's per-category
// price fields — mirrors the fallback chain resolvePrice() in
// lib/mapPostToFeaturedItem.ts reads back (rentPrice > salePrice > rent >
// rateNightly > rateMonthly > salary > hourlyRate > price > budget).
function derivePriceFields(mockCategoryId: string, subcategory: string, priceLabel: string, priceSuffix?: string) {
  const numeric = Math.round(parseFloat(priceLabel.replace(/[^0-9.]/g, "")) || 0);
  if (mockCategoryId === "property") {
    if (subcategory === "holiday_rental" || priceSuffix === "/ night") return { rateNightly: numeric };
    if (["to_buy", "land", "wanted"].includes(subcategory)) return { salePrice: numeric };
    return { rentPrice: numeric }; // to_rent, room_rental, for_students, commercial
  }
  if (mockCategoryId === "jobs") {
    if (priceSuffix === "/ hr") return { hourlyRate: numeric };
    return { salary: numeric };
  }
  return { salePrice: numeric }; // generic default: vehicles, services, pets, etc.
}

// Light best-effort extraction so the two categories mapPostToListing()
// special-cases (property, vehicles) show more than just Category/Subcategory
// in the key-details table. Not exhaustive — see KEY_DETAIL_FIELDS in
// lib/mapPostToListing.ts for the full whitelist this feeds.
function derivePropertyFields(detailsLabel: string) {
  const beds = detailsLabel.match(/(\d+)\s*(?:BHK|BED)/i);
  const baths = detailsLabel.match(/(\d+)\s*BATH/i);
  const typeMatch = detailsLabel.split("•").map((s) => s.trim()).pop();
  return {
    ...(beds ? { beds: Number(beds[1]) } : {}),
    ...(baths ? { baths: Number(baths[1]) } : {}),
    ...(typeMatch ? { propertyType: typeMatch } : {}),
  };
}

function deriveVehicleFields(title: string) {
  const year = title.match(/^(19|20)\d{2}/);
  return year ? { year: Number(year[0]) } : {};
}

async function main() {
  await dbConnect();

  // ── Reuse the User pool created by migrate-mock-to-db.ts (same mock
  // sellers, same names) — falls back to creating one if somehow missing ──
  const usersByName = new Map<string, { _id: unknown }>();
  for (const u of await User.find({}, "_id fullName").lean()) {
    usersByName.set(u.fullName, { _id: u._id });
  }

  type Row = { country: CountryCode; mockCategoryId: string; subcategory: string; listing: MockListing };
  const rows: Row[] = [];
  for (const mockCategoryId of Object.keys(ALL_MAP)) {
    const subs = getSubcategoryIds(mockCategoryId);
    for (const country of COUNTRIES) {
      for (const sub of subs) {
        const listings = getListingsForMarket(mockCategoryId, country, sub) as MockListing[];
        for (const listing of listings) rows.push({ country, mockCategoryId, subcategory: sub, listing });
      }
    }
  }
  console.log(`Found ${rows.length} mock listings to upsert into Post.`);

  let created = 0, updated = 0, skippedNoUser = 0;

  for (const { country, mockCategoryId, subcategory, listing } of rows) {
    const owner = usersByName.get(listing.seller.name);
    if (!owner) {
      skippedNoUser++;
      continue;
    }

    const priceFields = derivePriceFields(mockCategoryId, subcategory, listing.priceLabel, listing.priceSuffix);
    const extraFields =
      mockCategoryId === "property" ? derivePropertyFields(listing.detailsLabel)
      : mockCategoryId === "vehicles" ? deriveVehicleFields(listing.title)
      : {};

    const emailSlug = listing.seller.name.toLowerCase().replace(/[^a-z0-9]+/g, ".").replace(/^\.+|\.+$/g, "");

    const doc = {
      name: listing.title,
      description: listing.description,
      images: listing.images.map((img) => img.src),
      category: mockCategoryId,
      subcategory,
      country,
      ownerId: owner._id,
      adsId: listing.id,
      status: "active" as const,
      location: {
        address: listing.locationLabel,
        lat: listing.coordinates.lat,
        lng: listing.coordinates.lng,
      },
      seller_info: {
        name: listing.seller.name,
        phone: "+00000000000",
        email: `${emailSlug || "seller"}@mock.lokalads.test`,
      },
      ...priceFields,
      ...extraFields,
    };

    const result = await Post.updateOne({ adsId: listing.id }, { $set: doc }, { upsert: true });
    if (result.upsertedCount > 0) created++; else updated++;
  }

  console.log(`Done. Created: ${created}, updated: ${updated}, skipped (no matching user): ${skippedNoUser}.`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
