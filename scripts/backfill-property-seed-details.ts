// scripts/backfill-property-seed-details.ts
// Run with: npx tsx --env-file=.env.local scripts/backfill-property-seed-details.ts [--dry-run]
//
// One-off (2026-10-28): the Property seed posts predate the reworked forms.
// An audit found them missing what every form requires (Listed By, each
// sub's type, Rent Period, Available From, Listing For, Plot Area, Want To)
// and holding old free-text types ("APARTMENT", "FITTED", "OUTLINE PP")
// that no form option or search filter matches. This sets, from each ad's
// own text:
// - the form's own type value (replacing the old text);
// - Listed By: a person is the Owner, an agency the Agent, a developer the
//   Builder, a PG / student-housing company the Operator;
// - Commercial: the old type was the fit-out, now saved as Fit-out;
// - prices saved in lakh / crore units as rupees (₹65 → ₹65 lakh);
// - Singapore Holiday Rentals: a monthly rate instead of the nightly one
//   (stays under 3 months aren't allowed there, so the form is monthly-only);
// - Wanted: the budget moves from Sale Price to Max Budget (buying) or Max
//   Budget per month (renting), which the form asks.
// Each key is saved where the form saves it (a Post model path top-level,
// anything else under `attributes`). `fill` only fills empty fields; `set`
// always writes. Safe to re-run.

import mongoose from "mongoose";
import dbConnect from "../src/lib/db";
import Post from "../src/models/post";

interface SeedDetails {
  fill?: Record<string, unknown>;
  set?: Record<string, unknown>;
  unset?: string[];
  text?: [string, string][];
}

const LAKH = 100_000;
const CRORE = 10_000_000;
const NOW = "Immediately";

const DETAILS: Record<string, SeedDetails> = {
  // ── To Buy ──
  "prop-in-buy-01": { fill: { listedBy: "Builder" }, set: { propertyType: "Apartment", salePrice: 1 * CRORE } },
  "prop-in-buy-02": { fill: { listedBy: "Owner" }, set: { propertyType: "Apartment", salePrice: 2 * CRORE } },
  "prop-in-buy-03": { fill: { listedBy: "Owner" }, set: { propertyType: "IndependentHouse", salePrice: 2 * CRORE } },
  "prop-buy-01": { fill: { listedBy: "Owner" }, set: { propertyType: "Detached" } },
  "prop-buy-02": { fill: { listedBy: "Builder" }, set: { propertyType: "Flat" } },
  "prop-buy-03": { fill: { listedBy: "Owner" }, set: { propertyType: "Terraced" } },
  "prop-buy-04": { fill: { listedBy: "Owner" }, set: { propertyType: "SemiDetached" } },
  "prop-buy-05": { fill: { listedBy: "Owner" }, set: { propertyType: "Flat" } },
  "prop-buy-06": { fill: { listedBy: "Owner" }, set: { propertyType: "Other" } },
  "prop-buy-07": { fill: { listedBy: "Owner" }, set: { propertyType: "Bungalow" } },
  "prop-buy-08": { fill: { listedBy: "Owner" }, set: { propertyType: "Terraced" } },
  "prop-buy-09": { fill: { listedBy: "Owner" }, set: { propertyType: "Flat" } },
  "prop-buy-10": { fill: { listedBy: "Owner" }, set: { propertyType: "Flat" } },
  "prop-buy-11": { fill: { listedBy: "Owner" }, set: { propertyType: "Maisonette" } },
  "prop-buy-12": { fill: { listedBy: "Owner" }, set: { propertyType: "Detached" } },
  "prop-sg-buy-01": { fill: { listedBy: "Owner" }, set: { propertyType: "Condo" } },
  "prop-sg-buy-02": { fill: { listedBy: "Owner" }, set: { propertyType: "HDB" } },
  "prop-sg-buy-03": { fill: { listedBy: "Owner" }, set: { propertyType: "Landed" } },

  // ── To Rent ──
  "prop-in-rent-01": { fill: { listedBy: "Owner", available_from: NOW }, set: { propertyType: "Apartment" } },
  "prop-in-rent-02": { fill: { listedBy: "Owner", available_from: NOW }, set: { propertyType: "Apartment" } },
  "prop-in-rent-03": { fill: { listedBy: "Owner", available_from: NOW }, set: { propertyType: "Apartment" } },
  "prop-rent-01": { fill: { listedBy: "Owner", rentPeriod: "month", available_from: NOW }, set: { propertyType: "Flat" } },
  "prop-rent-02": { fill: { listedBy: "Owner", rentPeriod: "month", available_from: NOW }, set: { propertyType: "Flat" } },
  "prop-rent-03": { fill: { listedBy: "Owner", rentPeriod: "month", available_from: NOW }, set: { propertyType: "Flat" } },
  "prop-rent-04": { fill: { listedBy: "Owner", rentPeriod: "month", available_from: NOW }, set: { propertyType: "SemiDetached" } },
  "prop-rent-05": { fill: { listedBy: "Owner", rentPeriod: "month", available_from: NOW }, set: { propertyType: "Flat" } },
  "prop-rent-06": { fill: { listedBy: "Owner", rentPeriod: "month", available_from: NOW }, set: { propertyType: "Terraced" } },
  "prop-rent-07": { fill: { listedBy: "Owner", rentPeriod: "month", available_from: NOW }, set: { propertyType: "Terraced" } },
  "prop-rent-08": { fill: { listedBy: "Owner", rentPeriod: "month", available_from: NOW }, set: { propertyType: "Flat" } },
  "prop-rent-09": { fill: { listedBy: "Owner", rentPeriod: "month", available_from: NOW }, set: { propertyType: "Flat" } },
  "prop-rent-10": { fill: { listedBy: "Owner", rentPeriod: "month", available_from: NOW }, set: { propertyType: "Flat" } },
  "prop-rent-11": { fill: { listedBy: "Owner", rentPeriod: "month", available_from: NOW }, set: { propertyType: "Bungalow" } },
  "prop-rent-12": { fill: { listedBy: "Owner", rentPeriod: "month", available_from: NOW }, set: { propertyType: "Flat" } },
  "prop-sg-rent-01": { fill: { listedBy: "Owner", available_from: NOW }, set: { propertyType: "Condo" } },
  "prop-sg-rent-02": { fill: { listedBy: "Owner", available_from: NOW }, set: { propertyType: "HDB" } },
  "prop-sg-rent-03": { fill: { listedBy: "Agent", available_from: NOW }, set: { propertyType: "Condo" } },

  // ── Room Rental ──
  "prop-in-room-01": { fill: { type: "Single Room", listedBy: "Owner", available_from: "2026-11-01", gender_pref: "Female" }, set: { propertyType: "House" } },
  "prop-in-room-02": { fill: { type: "Shared Room", listedBy: "Agent", available_from: "2026-11-01" }, set: { propertyType: "Apartment" } },
  "prop-room-01": { fill: { type: "En-Suite Room", listedBy: "Owner", rentPeriod: "month", available_from: "2026-11-01" }, set: { propertyType: "House" } },
  "prop-room-02": { fill: { type: "Double Room", listedBy: "Owner", rentPeriod: "month", available_from: "2026-11-01" }, set: { propertyType: "House" } },
  "prop-room-03": { fill: { type: "Single Room", listedBy: "Owner", rentPeriod: "month", available_from: "2026-11-01", gender_pref: "Female" }, set: { propertyType: "House" } },
  "prop-room-04": { fill: { type: "Other", listedBy: "Owner", rentPeriod: "month", available_from: "2026-11-01" }, set: { propertyType: "House" } },
  "prop-room-05": { fill: { type: "En-Suite Room", listedBy: "Owner", rentPeriod: "month", available_from: "2026-11-01" }, set: { propertyType: "House" } },
  "prop-room-06": { fill: { type: "Double Room", listedBy: "Owner", rentPeriod: "month", available_from: "2026-11-01" }, set: { propertyType: "Flat" } },
  "prop-sg-room-01": { fill: { type: "Common Room", listedBy: "Owner", available_from: "2026-11-01" }, set: { propertyType: "HDB" } },
  "prop-sg-room-02": { fill: { type: "Master Room", listedBy: "Owner", available_from: "2026-11-01" }, set: { propertyType: "Condo" } },

  // ── For Students ──
  "prop-in-stu-01": { fill: { listedBy: "Operator", gender_pref: "CoEd", available_from: "2026-11-15" }, set: { propertyType: "PG" } },
  "prop-in-stu-02": { fill: { listedBy: "Operator", gender_pref: "Boys", available_from: "2026-11-15" }, set: { propertyType: "Hostel" } },
  "prop-stu-01": { fill: { listedBy: "Operator", rentPeriod: "week", available_from: "2026-11-15" }, set: { propertyType: "StudioFlat" } },
  "prop-stu-02": { fill: { listedBy: "Operator", rentPeriod: "week", available_from: "2026-11-15" }, set: { propertyType: "EnSuiteRoom" } },
  "prop-stu-03": { fill: { listedBy: "Owner", rentPeriod: "week", available_from: "2026-11-15" }, set: { propertyType: "SharedHouse" } },
  "prop-stu-04": { fill: { listedBy: "Operator", rentPeriod: "week", available_from: "2026-11-15" }, set: { propertyType: "StudentHalls" } },
  "prop-sg-stu-01": { fill: { listedBy: "Operator", gender_pref: "CoEd", available_from: "2026-11-15" }, set: { propertyType: "StudentHostel" } },
  "prop-sg-stu-02": { fill: { listedBy: "Operator", gender_pref: "CoEd", available_from: "2026-11-15" }, set: { propertyType: "StudentHostel" } },

  // ── Commercial: all to rent; the old type was the fit-out ──
  "prop-com-01": { fill: { listingFor: "Rent", listedBy: "Agent", rentPeriod: "month", furnishing: "Fully Fitted" }, set: { propertyType: "office" } },
  "prop-com-02": { fill: { listingFor: "Rent", listedBy: "Agent", rentPeriod: "month", furnishing: "Bare Shell" }, set: { propertyType: "retail" } },
  "prop-com-03": { fill: { listingFor: "Rent", listedBy: "Agent", rentPeriod: "month", furnishing: "Bare Shell" }, set: { propertyType: "warehouse" } },
  "prop-com-04": { fill: { listingFor: "Rent", listedBy: "Agent", rentPeriod: "month", furnishing: "Fully Fitted" }, set: { propertyType: "retail" } },
  "prop-in-com-01": { fill: { listingFor: "Rent", listedBy: "Agent", furnishing: "Fully Fitted" }, set: { propertyType: "office" } },
  "prop-in-com-02": { fill: { listingFor: "Rent", listedBy: "Owner", furnishing: "Bare Shell" }, set: { propertyType: "shop" } },
  "prop-sg-com-01": { fill: { listingFor: "Rent", listedBy: "Agent", rentPeriod: "month", furnishing: "Fully Fitted" }, set: { propertyType: "office" } },
  "prop-sg-com-02": { fill: { listingFor: "Rent", listedBy: "Agent", rentPeriod: "month", furnishing: "Bare Shell" }, set: { propertyType: "retail" } },

  // ── Holiday Rental ──
  "prop-hol-01": { fill: { holidayType: "Cottage", listedBy: "Owner" } },
  "prop-hol-02": { fill: { holidayType: "Other", listedBy: "Owner" } },
  "prop-hol-03": { fill: { holidayType: "CountryHome", listedBy: "Owner" } },
  "prop-hol-04": { fill: { holidayType: "Other", listedBy: "Owner" } },
  "prop-in-hol-01": { fill: { holidayType: "Villa", listedBy: "Owner" } },
  "prop-in-hol-02": { fill: { holidayType: "Cottage", listedBy: "Owner" } },
  "prop-sg-hol-01": { fill: { holidayType: "Villa", listedBy: "Owner" }, set: { rateMonthly: 12000 }, unset: ["rateNightly"] },
  "prop-sg-hol-02": { fill: { holidayType: "ServicedApt", listedBy: "Agent" }, set: { rateMonthly: 7500 }, unset: ["rateNightly"] },

  // ── Land: all for sale ──
  "prop-in-land-01": {
    fill: { listingFor: "Sale", listedBy: "Owner", plot_area: 1200, plotAreaUnit: "sq ft" },
    set: { propertyType: "ResidentialPlot", salePrice: 65 * LAKH },
    text: [["BMRDA-approved plot", "BMRDA-approved 30×40 (1,200 sq ft) plot"]],
  },
  "prop-in-land-02": { fill: { listingFor: "Sale", listedBy: "Owner", plot_area: 2, plotAreaUnit: "acre" }, set: { propertyType: "Agricultural", salePrice: 28 * LAKH } },
  "prop-land-02": { fill: { listingFor: "Sale", listedBy: "Owner", plot_area: 12, plotAreaUnit: "acre" }, set: { propertyType: "Agricultural" } },
  "prop-land-03": { fill: { listingFor: "Sale", listedBy: "Agent", plot_area: 0.8, plotAreaUnit: "acre" }, set: { propertyType: "Development" } },
  "prop-sg-land-01": {
    fill: { listingFor: "Sale", listedBy: "Owner", plot_area: 4000, plotAreaUnit: "sq ft" },
    set: { propertyType: "LandedPlot" },
    text: [["Freehold residential plot with", "Freehold residential plot of about 4,000 sq ft with"]],
  },
  "prop-sg-land-02": {
    fill: { listingFor: "Sale", listedBy: "Agent", plot_area: 25000, plotAreaUnit: "sq ft" },
    set: { propertyType: "Other" },
    text: [["redevelopment site in District 15", "redevelopment site of about 25,000 sq ft in District 15"]],
  },

  // ── Wanted: the budget the form asks ──
  "prop-in-want-01": { fill: { wantTo: "Buy", maxBudget: 90 * LAKH }, set: { propertyType: "Apartment" }, unset: ["salePrice"] },
  "prop-in-want-02": { fill: { wantTo: "Rent", maxRentBudget: 100000 }, set: { propertyType: "Commercial" }, unset: ["salePrice"] },
  "prop-want-01": { fill: { wantTo: "Buy", maxBudget: 500000 }, set: { propertyType: "Flat" }, unset: ["salePrice"] },
  "prop-want-02": { fill: { wantTo: "Buy", maxBudget: 800000 }, set: { propertyType: "Detached" }, unset: ["salePrice"] },
  "prop-want-03": { fill: { wantTo: "Buy", maxBudget: 400000 }, set: { propertyType: "Other" }, unset: ["salePrice"] },
  "prop-sg-want-01": { fill: { wantTo: "Buy", maxBudget: 550000 }, set: { propertyType: "HDB" }, unset: ["salePrice"] },
  "prop-sg-want-02": { fill: { wantTo: "Rent", maxRentBudget: 9000 }, set: { propertyType: "Commercial" }, unset: ["salePrice"] },
};

const isEmpty = (v: unknown) => v == null || v === "" || (Array.isArray(v) && v.length === 0);

async function run() {
  const dryRun = process.argv.includes("--dry-run");
  await dbConnect();

  const posts = await Post.find({ category: "property", adsId: { $in: Object.keys(DETAILS) } }).lean();
  const found = new Set(posts.map((p) => p.adsId));
  for (const id of Object.keys(DETAILS)) if (!found.has(id)) console.log(`${id}: no post`);

  for (const post of posts) {
    const doc = post as unknown as Record<string, unknown>;
    const details = DETAILS[post.adsId!];
    const path = (key: string) => (Post.schema.path(key) ? key : `attributes.${key}`);
    const current = (key: string) => (Post.schema.path(key) ? doc[key] : post.attributes?.[key]);
    const $set: Record<string, unknown> = {};
    const $unset: Record<string, ""> = {};
    for (const [key, value] of Object.entries(details.fill ?? {})) if (isEmpty(current(key))) $set[path(key)] = value;
    for (const [key, value] of Object.entries(details.set ?? {})) if (current(key) !== value) $set[path(key)] = value;
    for (const key of details.unset ?? []) if (current(key) != null) $unset[path(key)] = "";
    for (const key of ["name", "description"] as const) {
      const before = post[key] ?? "";
      // A swap whose result is already there was applied on an earlier run.
      const after = (details.text ?? []).reduce((s, [from, to]) => (s.includes(to) ? s : s.split(from).join(to)), before);
      if (after !== before) $set[key] = after;
    }

    if (!Object.keys($set).length && !Object.keys($unset).length) continue;
    const update = { ...(Object.keys($set).length ? { $set } : {}), ...(Object.keys($unset).length ? { $unset } : {}) };
    console.log(`${post.adsId} (${post.country}): ${dryRun ? "would apply" : "applied"} ${JSON.stringify(update)}`);
    if (!dryRun) await Post.updateOne({ _id: post._id }, update);
  }

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
