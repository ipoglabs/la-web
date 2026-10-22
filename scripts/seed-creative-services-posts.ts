// scripts/seed-creative-services-posts.ts
// Run with: npx tsx --env-file=.env.local scripts/seed-creative-services-posts.ts [--dry-run]
//
// One-off (2026-10-22): Creative Services had no posts at all, not even the
// seed samples every other Services sub got from lib/mock (see
// backfill-services-seed-details.ts). This adds IN 2, GB 3, SG 2, already
// filled in with the reworked form's fields, each owned by a mock seller
// account like the other seeds. Upserts by adsId / email, so safe to re-run.

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
  serviceType: string;
  skills: string[];
  attributes: Record<string, unknown>;
}

// Values are the Creative Services form's (posting/form-schema/defaults/services.ts).
const SEEDS: Seed[] = [
  {
    adsId: "svc-in-creative-01",
    country: "in",
    seller: { name: "Lens & Light Studio", slug: "lens.light.studio", role: "business", phone: "+99800000901" },
    location: { address: "Bandra West, Mumbai", lat: 19.0596, lng: 72.8295 },
    image: "/img/img3.jpg",
    name: "Wedding Photographer — Candid & Traditional, Mumbai",
    description: "<p>Candid and traditional <strong>wedding photography</strong> by a team of three. Full-day coverage, edited album of 300+ photos, and a highlights reel. Travel across Maharashtra.</p>",
    salePrice: 45000,
    serviceType: "photography",
    skills: ["Candid", "Drone", "Lightroom"],
    attributes: { listedBy: "studio", occasions: ["wedding", "events"], serviceMode: ["homevisit"], priceUnit: "event" },
  },
  {
    adsId: "svc-in-creative-02",
    country: "in",
    seller: { name: "Ananya Rao Design", slug: "ananya.rao.design", role: "individual", phone: "+99800000902" },
    location: { address: "Indiranagar, Bengaluru", lat: 12.9784, lng: 77.6408 },
    image: "/img/img7.jpg",
    name: "Logo & Brand Identity Design — Freelance Designer, Bengaluru",
    description: "<p>Freelance <strong>brand designer</strong> for startups and small shops. Logo, colour palette, business cards and social media kit, with three rounds of revisions.</p>",
    salePrice: 8000,
    serviceType: "graphic_design",
    skills: ["Illustrator", "Figma", "Branding"],
    attributes: { listedBy: "freelancer", serviceMode: ["online"], priceUnit: "project" },
  },
  {
    adsId: "svc-creative-01",
    country: "gb",
    seller: { name: "Reel Moments Films", slug: "reel.moments.films", role: "business", phone: "+99800000903" },
    location: { address: "Shoreditch, London", lat: 51.5265, lng: -0.0798 },
    image: "/img/img5.jpg",
    name: "Wedding & Event Videographer — Cinematic Films, London",
    description: "<p>Cinematic <strong>wedding and event films</strong> across London and the Home Counties. Two shooters, drone footage, a 5-minute highlights film and the full ceremony edit.</p>",
    salePrice: 1200,
    serviceType: "videography",
    skills: ["4K", "Drone", "Premiere Pro"],
    attributes: { listedBy: "studio", occasions: ["wedding", "events", "corporate"], serviceMode: ["homevisit"], priceUnit: "event" },
  },
  {
    adsId: "svc-creative-02",
    country: "gb",
    seller: { name: "Wordsmith Copy Co.", slug: "wordsmith.copy", role: "individual", phone: "+99800000904" },
    location: { address: "Clifton, Bristol", lat: 51.4545, lng: -2.6206 },
    image: "/img/img2.jpg",
    name: "Freelance Copywriter — Websites, Blogs & Product Copy",
    description: "<p>Experienced <strong>freelance copywriter</strong> writing website pages, SEO blog posts and product descriptions for UK small businesses. Quick turnaround, plain English.</p>",
    salePrice: 45,
    serviceType: "copywriting",
    skills: ["SEO", "Web copy", "Blogging"],
    attributes: { listedBy: "freelancer", serviceMode: ["online"], priceUnit: "hour" },
  },
  {
    adsId: "svc-creative-03",
    country: "gb",
    seller: { name: "Northlight Product Studio", slug: "northlight.studio", role: "business", phone: "+99800000905" },
    location: { address: "Northern Quarter, Manchester", lat: 53.4839, lng: -2.2367 },
    image: "/img/img8.jpg",
    name: "Product Photography for E-commerce — Studio Shoots, Manchester",
    description: "<p>White-background and lifestyle <strong>product photography</strong> for online shops. Send your products in or drop them off; edited images back within 3 working days.</p>",
    salePrice: 300,
    serviceType: "photography",
    skills: ["Packshots", "Photoshop"],
    attributes: { listedBy: "studio", occasions: ["product"], serviceMode: ["inperson"], priceUnit: "day" },
  },
  {
    adsId: "svc-sg-creative-01",
    country: "sg",
    seller: { name: "Marina Event Photos", slug: "marina.event.photos", role: "individual", phone: "+99800000906" },
    location: { address: "Marina Bay, Singapore", lat: 1.2834, lng: 103.8607 },
    image: "/img/img4.jpg",
    name: "Corporate Event Photographer — Conferences, Launches & Dinners",
    description: "<p>Freelance <strong>event photographer</strong> for conferences, product launches and company dinners. Same-day previews for social media and full edited set in 48 hours.</p>",
    salePrice: 150,
    serviceType: "photography",
    skills: ["Events", "Lightroom"],
    attributes: { listedBy: "freelancer", occasions: ["corporate", "events"], serviceMode: ["homevisit"], priceUnit: "hour" },
  },
  {
    adsId: "svc-sg-creative-02",
    country: "sg",
    seller: { name: "CutFrame Edits", slug: "cutframe.edits", role: "individual", phone: "+99800000907" },
    location: { address: "Tiong Bahru, Singapore", lat: 1.2847, lng: 103.8325 },
    image: "/img/img6.jpg",
    name: "Video Editing for YouTube & Reels — Fast Turnaround",
    description: "<p>Remote <strong>video editor</strong> for YouTube videos, Instagram Reels and TikToks. Cuts, captions, colour and music, delivered in 2 to 3 days.</p>",
    salePrice: 80,
    serviceType: "video_editing",
    skills: ["Premiere Pro", "After Effects", "CapCut"],
    attributes: { listedBy: "freelancer", serviceMode: ["online"], priceUnit: "project" },
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
      category: "services",
      subcategory: "creative_services",
      country: seed.country,
      ownerId: owner?._id,
      adsId: seed.adsId,
      status: "active",
      location: seed.location,
      seller_info: { name: seed.seller.name, phone: "+00000000000", email },
      salePrice: seed.salePrice,
      serviceType: seed.serviceType,
      skills: seed.skills,
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
