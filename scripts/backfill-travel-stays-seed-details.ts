// scripts/backfill-travel-stays-seed-details.ts
// Run with: npx tsx --env-file=.env.local scripts/backfill-travel-stays-seed-details.ts [--dry-run]
//
// One-off (2026-10-27): the Travel & Stays seed posts have only a title, a
// description and a price, so the reworked search filters had nothing to
// match and stays showed no "/ night". This fills, from each ad's own text,
// what the reworked forms ask: Type, bedrooms, lets and amenities for stays;
// destination, tour type, days and inclusions for tours; Setting for
// staycations; Service for travel services; Type, Condition and cabin size for
// accessories; and Price Per everywhere. Detail fields are only filled where
// empty, so it is safe to re-run.
//
// The Singapore holiday rentals move overseas (Bintan, Batam): homes in
// Singapore can't be let for under 3 months. The other Singapore copies of
// India's ads get a local detail.

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

// Values are the Travel & Stays forms' (posting/form-schema/defaults/travel-stays.ts).
const DETAILS: Record<string, SeedDetails> = {
  // ── Holiday Rentals ──
  "travel-hr-01": { fields: { guests: 8, availability: "July–September", amenities: ["pool", "ac", "kitchen", "wifi"] }, attributes: { stayType: "villa", bedrooms: 4, stayLengths: ["weekly"], priceUnit: "week" } },
  "travel-hr-02": { fields: { amenities: ["kitchen", "wifi", "parking"] }, attributes: { stayType: "apartment", bedrooms: 2, stayLengths: ["nightly", "weekly"], priceUnit: "night" } },
  "travel-hr-03": { fields: { guests: 4, availability: "July–August", amenities: ["pool", "ac", "parking"] }, attributes: { stayType: "apartment", bedrooms: 2, stayLengths: ["weekly"], priceUnit: "week" } },
  "travel-in-rentals-01": { fields: { amenities: ["pool"] }, attributes: { stayType: "villa", bedrooms: 3, stayLengths: ["nightly"], priceUnit: "night" } },
  "travel-in-rentals-02": { attributes: { stayType: "apartment", bedrooms: 1, stayLengths: ["nightly"], priceUnit: "night" } },
  "travel-sg-rentals-01": {
    fields: { amenities: ["pool"] },
    attributes: { stayType: "villa", bedrooms: 3, stayLengths: ["nightly"], priceUnit: "night" },
    text: [["Private Pool, Sentosa", "Private Pool, Bintan"], ["from Palawan Beach.", "from the beach at Lagoi Bay, Bintan, a short ferry ride from Tanah Merah."]],
  },
  "travel-sg-rentals-02": {
    attributes: { stayType: "apartment", bedrooms: 1, stayLengths: ["nightly"], priceUnit: "night" },
    text: [["ideal for couples or solo travelers.", "ideal for couples or solo travelers. In Batam, an hour by ferry from HarbourFront."]],
  },

  // ── Hotels & Guesthouses ──
  "travel-hotel-01": { fields: { amenities: ["breakfast", "wifi"] }, attributes: { itemType: "hotel", starRating: "4", freeCancellation: "yes", priceUnit: "night" } },
  "travel-hotel-02": { fields: { amenities: ["breakfast"] }, attributes: { itemType: "bnb", roomTypes: ["double", "twin"], priceUnit: "night" } },
  "travel-hotel-03": { fields: { amenities: ["kitchen", "wifi"] }, attributes: { itemType: "serviced", priceUnit: "night" } },
  "travel-in-guesthouse-01": { fields: { amenities: ["ac", "breakfast"] }, attributes: { itemType: "guesthouse", priceUnit: "night" } },
  "travel-in-guesthouse-02": { attributes: { itemType: "guesthouse", priceUnit: "night" } },
  "travel-sg-guesthouse-01": { fields: { amenities: ["ac", "breakfast"] }, attributes: { itemType: "guesthouse", priceUnit: "night" } },
  "travel-sg-guesthouse-02": { attributes: { itemType: "guesthouse", priceUnit: "night" } },

  // ── Tour Packages ──
  "travel-tour-01": { fields: { destination: "Japan" }, attributes: { tripScope: "international", tourType: "group", durationDays: 10, departures: "Mar–Apr 2027", inclusions: ["flights", "hotels", "meals", "guide"], priceUnit: "person" } },
  "travel-tour-02": { fields: { destination: "Morocco" }, attributes: { tripScope: "international", tourType: "group", durationDays: 7, departures: "Monthly", inclusions: ["hotels", "activities"], priceUnit: "person" } },
  "travel-tour-03": { fields: { destination: "Iceland" }, attributes: { tripScope: "international", tourType: "group", durationDays: 5, departures: "Jan–Mar 2027", inclusions: ["flights", "hotels", "guide", "activities"], priceUnit: "person" } },
  "travel-in-tourpackage-01": { fields: { destination: "Himalayas" }, attributes: { tripScope: "domestic", tourType: "group", durationDays: 5, inclusions: ["meals", "guide", "activities"], priceUnit: "person" } },
  "travel-in-tourpackage-02": { fields: { destination: "Beas River, Manali" }, attributes: { tripScope: "domestic", tourType: "group", durationDays: 1, inclusions: ["guide", "activities"], priceUnit: "person" } },
  "travel-sg-tourpackage-01": { fields: { destination: "Bali" }, attributes: { tripScope: "international", tourType: "group", durationDays: 5, inclusions: ["meals", "guide"], priceUnit: "person" } },
  "travel-sg-tourpackage-02": { fields: { destination: "Bali" }, attributes: { tripScope: "international", tourType: "group", durationDays: 1, inclusions: ["guide", "activities"], priceUnit: "person" } },

  // ── Staycations & Day Trips ──
  "travel-stay-01": { fields: { guests: 6, amenities: ["pets", "hot_tub"] }, attributes: { itemType: "cottage", setting: ["lake", "mountains"], priceUnit: "night" } },
  "travel-stay-02": { fields: { guests: 2, amenities: ["hot_tub"] }, attributes: { itemType: "glamping", setting: ["nature"], nights: 2, inclusions: ["breakfast"], priceUnit: "night" } },
  "travel-stay-03": { fields: { guests: 6 }, attributes: { itemType: "boat", setting: ["lake", "nature"], priceUnit: "night" } },
  "travel-in-staycation-01": { attributes: { itemType: "resort", setting: ["mountains"], nights: 2, inclusions: ["breakfast", "pool"], priceUnit: "package" } },
  "travel-in-staycation-02": { fields: { guests: 2 }, attributes: { itemType: "spa", setting: ["mountains"], nights: 2, inclusions: ["spa"], priceUnit: "package" } },
  "travel-sg-staycation-01": { attributes: { itemType: "resort", setting: ["city"], nights: 2, inclusions: ["breakfast", "pool"], priceUnit: "package" } },
  "travel-sg-staycation-02": { fields: { guests: 2 }, attributes: { itemType: "spa", setting: ["beach"], nights: 2, inclusions: ["spa"], priceUnit: "package" } },

  // ── Travel Services ──
  "travel-svc-01": { fields: { serviceType: "insurance", consultationMode: "online" }, attributes: { countries: "Worldwide", priceUnit: "year" } },
  "travel-svc-02": { fields: { serviceType: "transfer", consultationMode: "inperson" }, attributes: { priceUnit: "trip" } },
  "travel-svc-03": { fields: { serviceType: "visa", consultationMode: "online" }, attributes: { countries: "US, Schengen, India, UAE, Canada", priceUnit: "application" } },
  "travel-in-services-01": { fields: { serviceType: "visa", consultationMode: "both" }, attributes: { countries: "Schengen", priceUnit: "application" } },
  "travel-in-services-02": { fields: { serviceType: "itinerary", consultationMode: "online" }, attributes: { priceUnit: "trip" } },
  "travel-sg-services-01": {
    fields: { serviceType: "visa", consultationMode: "both" },
    attributes: { countries: "Schengen", priceUnit: "application" },
    text: [["and appointment booking support.", "and appointment booking support. Meet us at our Raffles Place office or online."]],
  },
  "travel-sg-services-02": {
    fields: { serviceType: "itinerary", consultationMode: "online" },
    attributes: { priceUnit: "trip" },
    text: [["local transport for any destination.", "local transport for any destination. Popular for Japan, Korea and Europe trips from Changi."]],
  },

  // ── Travel Accessories ──
  "travel-acc-01": { fields: { condition: "like-new", size: "55cm + 69cm" }, attributes: { itemType: "suitcase", brand: "Samsonite", cabinSize: "yes", dealMethod: ["meetup"] } },
  "travel-acc-02": { fields: { condition: "new" }, attributes: { itemType: "comfort", dealMethod: BOTH } },
  "travel-acc-03": { fields: { condition: "like-new", size: "40L" }, attributes: { itemType: "backpack", brand: "Osprey", cabinSize: "yes", dealMethod: BOTH } },
  "travel-in-accessories-01": { fields: { condition: "lightly-used", size: "60L" }, attributes: { itemType: "backpack", cabinSize: "no", dealMethod: BOTH } },
  "travel-in-accessories-02": { fields: { condition: "lightly-used" }, attributes: { itemType: "suitcase", cabinSize: "yes", dealMethod: BOTH } },
  "travel-sg-accessories-01": {
    fields: { condition: "lightly-used", size: "60L" },
    attributes: { itemType: "backpack", cabinSize: "no", dealMethod: ["meetup"] },
    text: [["used for one trek trip only.", "used for one trek trip only. Meet at Bishan MRT."]],
  },
  "travel-sg-accessories-02": {
    fields: { condition: "lightly-used" },
    attributes: { itemType: "suitcase", cabinSize: "yes", dealMethod: BOTH },
    text: [["cabin-size compliant.", "cabin-size compliant. Meet at Tampines MRT or delivery islandwide."]],
  },
};

function isEmpty(value: unknown): boolean {
  return value == null || value === "" || (Array.isArray(value) && value.length === 0);
}

async function run() {
  const dryRun = process.argv.includes("--dry-run");
  await dbConnect();

  const posts = await Post.find({ category: "travel_stays", adsId: { $in: Object.keys(DETAILS) } }).lean();
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
