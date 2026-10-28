// scripts/backfill-vehicles-seed-details.ts
// Run with: npx tsx --env-file=.env.local scripts/backfill-vehicles-seed-details.ts [--dry-run]
//
// One-off (2026-10-28): the Vehicles seed posts predate the reworked forms
// and have none of their required details, so the Make, Listed By, Type and
// other search filters match none of them. This fills, from each ad's own
// title and text:
// - Listed By (a private seller is Owner / Private; a business Dealer,
//   Broker or Trade).
// - Make and Model (cars, motorcycles, vans, trucks), and each sub's type.
// - COE Expiry (Singapore): the year the ad gives, else a typical one.
// - Price Includes VAT (UK vans and trucks): trade sellers quote plus VAT.
// - Wanted: the kind of vehicle wanted.
// Each key is saved where the form saves it (a Post model path top-level,
// anything else under `attributes`). Only empty fields are filled, so it is
// safe to re-run.

import mongoose from "mongoose";
import dbConnect from "../src/lib/db";
import Post from "../src/models/post";

const DETAILS: Record<string, Record<string, string>> = {
  // ── Cars ──
  "veh-car-01": { listedBy: "Owner", make: "Toyota", model: "Camry Hybrid" },
  "veh-car-02": { listedBy: "Dealer", make: "BMW", model: "320d M Sport" },
  "veh-car-03": { listedBy: "Owner", make: "Tesla", model: "Model 3 Long Range" },
  "veh-in-car-01": { listedBy: "Owner", make: "Hyundai", model: "Creta SX(O) Diesel" },
  "veh-in-car-02": { listedBy: "Dealer", make: "Maruti Suzuki", model: "Baleno Alpha" },
  "veh-sg-car-01": { listedBy: "Owner", make: "Toyota", model: "Corolla Altis 1.6A", coeExpiry: "2031-06-30" },
  "veh-sg-car-02": { listedBy: "Dealer", make: "Honda", model: "Vezel Hybrid e:HEV", coeExpiry: "2032-06-30" },

  // ── Motorcycles ──
  "veh-moto-01": { listedBy: "Dealer", bikeType: "sports", make: "Honda", model: "CBR600RR" },
  "veh-moto-02": { listedBy: "Dealer", bikeType: "scooter", make: "Honda", model: "PCX125" },
  "veh-moto-03": { listedBy: "Owner", bikeType: "adventure", make: "Royal Enfield", model: "Himalayan 411" },
  "veh-in-moto-01": { listedBy: "Dealer", bikeType: "cruiser", make: "Royal Enfield", model: "Classic 350" },
  "veh-in-moto-02": { listedBy: "Dealer", bikeType: "scooter", make: "TVS", model: "Jupiter 125" },
  "veh-sg-moto-01": { listedBy: "Dealer", bikeType: "commuter", make: "Honda", model: "CB400 Super Four", coeExpiry: "2030-06-30" },
  "veh-sg-moto-02": { listedBy: "Dealer", bikeType: "scooter", make: "Yamaha", model: "NMAX 155", coeExpiry: "2031-12-31" },

  // ── Vans ──
  "veh-van-01": { listedBy: "Dealer", vanType: "panel", make: "Ford", model: "Transit Custom L2 H1", priceIncludesVat: "no" },
  "veh-van-02": { listedBy: "Owner", vanType: "minibus", make: "Volkswagen", model: "Transporter T6.1 Kombi", priceIncludesVat: "yes" },
  "veh-van-03": { listedBy: "Dealer", vanType: "refrigerated", make: "Renault", model: "Master L2H2", priceIncludesVat: "no" },
  "veh-in-van-01": { listedBy: "Dealer", vanType: "panel", make: "Maruti Suzuki", model: "Eeco Cargo" },
  "veh-in-van-02": { listedBy: "Dealer", vanType: "minibus", make: "Force", model: "Tempo Traveller" },
  "veh-sg-van-01": { listedBy: "Owner", vanType: "panel", make: "Toyota", model: "Hiace", coeExpiry: "2031-06-30" },
  "veh-sg-van-02": { listedBy: "Owner", vanType: "panel", make: "Maxus", model: "V80 High Roof", coeExpiry: "2030-06-30" },

  // ── Trucks ──
  "veh-truck-01": { listedBy: "Dealer", make: "DAF", model: "LF 250 7.5T", priceIncludesVat: "no" },
  "veh-truck-02": { listedBy: "Dealer", make: "Mercedes-Benz", model: "Sprinter 3.5T Tipper", priceIncludesVat: "no" },
  "veh-truck-03": { listedBy: "Dealer", make: "Iveco", model: "Daily 35C15", priceIncludesVat: "no" },
  "veh-in-truck-01": { listedBy: "Dealer", make: "Tata", model: "407 Gold", wheels: "6" },
  "veh-in-truck-02": { listedBy: "Dealer", make: "Ashok Leyland", model: "Dost+", wheels: "4" },
  "veh-sg-truck-01": { listedBy: "Owner", make: "Isuzu", model: "NKR 3-Tonne", coeExpiry: "2029-06-30" },
  "veh-sg-truck-02": { listedBy: "Owner", make: "Hino", model: "300 Flatbed", coeExpiry: "2030-06-30" },

  // ── Boats ──
  "veh-boat-01": { listedBy: "Owner", boatType: "motor" },
  "veh-boat-02": { listedBy: "Owner", boatType: "jetski" },
  "veh-boat-03": { listedBy: "Owner", boatType: "narrowboat" },
  "veh-in-boat-01": { listedBy: "Dealer", boatType: "houseboat" },
  "veh-in-boat-02": { listedBy: "Dealer", boatType: "fishing" },
  "veh-sg-boat-01": { listedBy: "Broker", boatType: "yacht" },
  "veh-sg-boat-02": { listedBy: "Broker", boatType: "jetski" },

  // ── Parts & Accessories ──
  "veh-parts-01": { listedBy: "Private", forVehicle: "car", partsCategory: "engine" },
  "veh-parts-02": { listedBy: "Private", forVehicle: "car", partsCategory: "tyres" },
  "veh-parts-03": { listedBy: "Private", forVehicle: "car", partsCategory: "brakes" },
  "veh-in-parts-01": { listedBy: "Trade", forVehicle: "car", partsCategory: "tyres" },
  "veh-in-parts-02": { listedBy: "Trade", forVehicle: "car", partsCategory: "electrical" },
  "veh-sg-parts-01": { listedBy: "Trade", forVehicle: "car", partsCategory: "tyres" },
  "veh-sg-parts-02": { listedBy: "Trade", forVehicle: "car", partsCategory: "electrical" },

  // ── Wanted ──
  "veh-want-01": { vehicleType: "car" },
  "veh-want-02": { vehicleType: "motorcycle" },
  "veh-want-03": { vehicleType: "van" },
  "veh-in-want-01": { vehicleType: "car" },
  "veh-in-want-02": { vehicleType: "motorcycle" },
  "veh-sg-want-01": { vehicleType: "car" },
  "veh-sg-want-02": { vehicleType: "motorcycle" },
};

const isEmpty = (v: unknown) => v == null || v === "" || (Array.isArray(v) && v.length === 0);

async function run() {
  const dryRun = process.argv.includes("--dry-run");
  await dbConnect();

  const posts = await Post.find({ category: "vehicles", adsId: { $in: Object.keys(DETAILS) } }).lean();
  const found = new Set(posts.map((p) => p.adsId));
  for (const id of Object.keys(DETAILS)) if (!found.has(id)) console.log(`${id}: no post`);

  for (const post of posts) {
    const doc = post as unknown as Record<string, unknown>;
    const $set: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(DETAILS[post.adsId!])) {
      const topLevel = Boolean(Post.schema.path(key));
      if (isEmpty(topLevel ? doc[key] : post.attributes?.[key])) $set[topLevel ? key : `attributes.${key}`] = value;
    }
    if (!Object.keys($set).length) continue;
    console.log(`${post.adsId} (${post.country}): ${dryRun ? "would apply" : "applied"} ${JSON.stringify({ $set })}`);
    if (!dryRun) await Post.updateOne({ _id: post._id }, { $set });
  }

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
