// scripts/seed-tech-accessories-posts.ts
// Run with: npx tsx --env-file=.env.local scripts/seed-tech-accessories-posts.ts [--dry-run]
//
// One-off (2026-10-28): Tech Accessories had no posts at all, while every
// other Electronics & Tech sub has 7 seed samples (see
// backfill-electronics-tech-seed-details.ts). This adds IN 2, GB 3, SG 2,
// already filled in with the reworked form's fields, each owned by a mock
// seller account like the other seeds. Upserts by adsId / email, so safe to
// re-run.

import { randomBytes } from "crypto";
import { hash } from "bcryptjs";
import mongoose from "mongoose";
import dbConnect from "../src/lib/db";
import Post from "../src/models/post";
import User from "../src/models/user";

interface Seed {
  adsId: string;
  country: "in" | "gb" | "sg";
  seller: { name: string; slug: string; role: "individual" | "business"; phone: string };
  location: { address: string; lat: number; lng: number };
  image: string;
  name: string;
  description: string;
  salePrice: number;
  condition: string;
  attributes: Record<string, unknown>;
}

const BOTH = ["meetup", "delivery"];

// Values are the Tech Accessories form's (posting/form-schema/defaults/electronics-tech.ts).
const SEEDS: Seed[] = [
  {
    adsId: "tech-in-acc-01",
    country: "in",
    seller: { name: "Lamington Tech Accessories", slug: "lamington.tech", role: "business", phone: "+99800001001" },
    location: { address: "Lamington Road, Mumbai", lat: 18.958, lng: 72.82 },
    image: "/img/img5.jpg",
    name: "Xiaomi 20000mAh Power Bank — 22.5W Fast Charging, USB-C",
    description: "<p>Like-new <strong>Xiaomi 20000mAh power bank</strong> with 22.5W fast charging, USB-C in/out and two USB-A ports. Charges a phone four to five times. Box and cable included.</p>",
    salePrice: 1400,
    condition: "like-new",
    attributes: { itemType: "chargers", brand: "Xiaomi", compatibleWith: "USB-C and Micro-USB phones", dealMethod: BOTH },
  },
  {
    adsId: "tech-in-acc-02",
    country: "in",
    seller: { name: "Rohan Mehta", slug: "rohan.mehta", role: "individual", phone: "+99800001002" },
    location: { address: "Koramangala, Bengaluru", lat: 12.9352, lng: 77.6245 },
    image: "/img/img7.jpg",
    name: "Logitech MK270 Wireless Keyboard & Mouse Combo — Barely Used",
    description: "<p><strong>Logitech MK270 wireless keyboard and mouse</strong> with a single USB receiver. Used for two months at a home desk; all keys work, batteries included.</p>",
    salePrice: 1100,
    condition: "lightly-used",
    attributes: { itemType: "keyboards", brand: "Logitech", compatibleWith: "Windows, Mac, Chromebook (USB receiver)", dealMethod: BOTH },
  },
  {
    adsId: "tech-acc-01",
    country: "gb",
    seller: { name: "Tom Hartley", slug: "tom.hartley", role: "individual", phone: "+99800001003" },
    location: { address: "Headingley, Leeds", lat: 53.8236, lng: -1.577 },
    image: "/img/img6.jpg",
    name: "Anker 737 Power Bank 24,000mAh — 140W, Charges Laptops",
    description: "<p><strong>Anker 737 power bank</strong>, 24,000mAh with 140W USB-C output, enough to charge a MacBook Pro. Smart display shows charge and wattage. Like new, boxed with pouch and cable.</p>",
    salePrice: 55,
    condition: "like-new",
    attributes: { itemType: "chargers", brand: "Anker", compatibleWith: "USB-C laptops, iPhone 15, Android", dealMethod: BOTH },
  },
  {
    adsId: "tech-acc-02",
    country: "gb",
    seller: { name: "Ellie Morgan", slug: "ellie.morgan", role: "individual", phone: "+99800001004" },
    location: { address: "Kemptown, Brighton", lat: 50.8197, lng: -0.1246 },
    image: "/img/img2.jpg",
    name: "Apple Silicone Case with MagSafe, iPhone 15 Pro — Storm Blue, New",
    description: "<p>Genuine <strong>Apple silicone case with MagSafe</strong> for iPhone 15 Pro in Storm Blue. New and sealed; bought the wrong size. Can post first class.</p>",
    salePrice: 22,
    condition: "new",
    attributes: { itemType: "cases", brand: "Apple", compatibleWith: "iPhone 15 Pro", dealMethod: BOTH },
  },
  {
    adsId: "tech-acc-03",
    country: "gb",
    seller: { name: "Croydon Tech Exchange", slug: "croydon.tech.exchange", role: "business", phone: "+99800001005" },
    location: { address: "Croydon, London", lat: 51.3762, lng: -0.0982 },
    image: "/img/img9.jpg",
    name: "Samsung T7 Shield 2TB Portable SSD — USB-C, Rugged",
    description: "<p><strong>Samsung T7 Shield 2TB portable SSD</strong>, up to 1,050 MB/s over USB-C. Rubber shell, IP65 dust and water resistant. Wiped and tested; both cables included.</p>",
    salePrice: 95,
    condition: "lightly-used",
    attributes: { itemType: "drives", brand: "Samsung", compatibleWith: "USB-C / USB-A laptops, PS5, Xbox", dealMethod: BOTH },
  },
  {
    adsId: "tech-sg-acc-01",
    country: "sg",
    seller: { name: "Darren Tan", slug: "darren.tan", role: "individual", phone: "+99800001006" },
    location: { address: "Sengkang, Singapore", lat: 1.3917, lng: 103.895 },
    image: "/img/img8.jpg",
    name: "TP-Link Deco X20 Mesh Wi-Fi 6 — 3-Pack, Covers a 5-Room HDB",
    description: "<p><strong>TP-Link Deco X20 mesh Wi-Fi 6</strong>, 3-pack. Covered our whole 5-room HDB with no dead spots. Upgraded to 10Gbps fibre, so letting go. Self-collect at Sengkang or meet at Buangkok MRT.</p>",
    salePrice: 180,
    condition: "lightly-used",
    attributes: { itemType: "networking", brand: "TP-Link", compatibleWith: "Any fibre broadband (Singtel, StarHub, M1)", dealMethod: ["meetup"] },
  },
  {
    adsId: "tech-sg-acc-02",
    country: "sg",
    seller: { name: "Sim Lim Gadget Corner", slug: "simlim.gadget.corner", role: "business", phone: "+99800001007" },
    location: { address: "Sim Lim Square, Singapore", lat: 1.303, lng: 103.853 },
    image: "/img/img1.jpg",
    name: "Ugreen 100W 4-Port GaN Charger — UK/SG Plug, Like New",
    description: "<p><strong>Ugreen Nexode 100W GaN charger</strong> with three USB-C and one USB-A port. Charges a laptop, phone and earbuds at once. Local three-pin plug. Collect at Sim Lim Square or mail islandwide.</p>",
    salePrice: 45,
    condition: "like-new",
    attributes: { itemType: "chargers", brand: "Ugreen", compatibleWith: "USB-C laptops, iPhone, Android", dealMethod: BOTH },
  },
];

async function run() {
  const dryRun = process.argv.includes("--dry-run");
  await dbConnect();

  for (const seed of SEEDS) {
    const email = `${seed.seller.slug}@mock.lokalads.test`;
    let owner = await User.findOne({ email }).select({ _id: 1 }).lean();
    if (!owner && !dryRun) {
      // Mock seller accounts can't be logged into: the password is random and never shown.
      const created = await User.create({
        userId: `mock-${seed.adsId}`,
        fullName: seed.seller.name,
        dateOfBirth: new Date("1990-01-01"),
        locality: seed.location.address,
        email,
        isEmailVerified: true,
        primaryNumber: seed.seller.phone,
        isPrimaryNumberVerified: true,
        password: await hash(randomBytes(24).toString("hex"), 10),
        publicRole: seed.seller.role,
        intent: "both",
        provider: "credentials",
        accountStatus: "Active",
        isNewUser: false,
        isFullyRegistered: true,
        isTermsAndConditionAccepted: true,
        isPrivacyAndPolicyAccepted: true,
        isCookiesPolicyAccepted: true,
        image: seed.image,
      });
      owner = { _id: created._id };
    }

    const doc = {
      name: seed.name,
      description: seed.description,
      images: [seed.image],
      category: "electronics_tech",
      subcategory: "tech_accessories",
      country: seed.country,
      ownerId: owner?._id,
      adsId: seed.adsId,
      status: "active",
      location: seed.location,
      seller_info: { name: seed.seller.name, phone: "+00000000000", email },
      salePrice: seed.salePrice,
      condition: seed.condition,
      attributes: seed.attributes,
    };
    const exists = await Post.exists({ adsId: seed.adsId });
    console.log(`${seed.adsId} (${seed.country}): ${dryRun ? "would " : ""}${exists ? "update" : "create"} — ${seed.name}`);
    if (!dryRun) await Post.updateOne({ adsId: seed.adsId }, { $set: doc }, { upsert: true });
  }
}

run()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
