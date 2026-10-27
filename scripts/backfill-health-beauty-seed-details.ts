// scripts/backfill-health-beauty-seed-details.ts
// Run with: npx tsx --env-file=.env.local scripts/backfill-health-beauty-seed-details.ts [--dry-run]
//
// One-off (2026-10-27): the Health & Beauty seed posts have only a title, a
// description and a price, so the reworked search filters had nothing to
// match. This fills, from each ad's own text, what the reworked forms ask:
// Type (Services for salons), Mode, Price Per, provider and qualifications for
// services; Type, Condition, Brand and Receipt for beauty products. Detail
// fields are only filled where empty, so it is safe to re-run.
//
// Most Singapore seeds were word-for-word copies of India's; they get a local
// detail in their text.

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
const IN_PERSON = { consultationMode: "inperson" };

// Values are the Health & Beauty forms' (posting/form-schema/defaults/health-beauty.ts).
const DETAILS: Record<string, SeedDetails> = {
  // ── Beauty Products ──
  "hb-prod-01": { fields: { condition: "new" }, attributes: { itemType: "skincare", brand: "La Mer", receipt: "yes", dealMethod: BOTH } },
  "hb-prod-02": { fields: { condition: "lightly-used" }, attributes: { itemType: "hair_tools", brand: "Dyson", dealMethod: BOTH } },
  "hb-prod-03": { fields: { condition: "new" }, attributes: { itemType: "fragrance", brand: "Chanel", receipt: "yes", dealMethod: BOTH } },
  "health-in-beautyproducts-01": { fields: { condition: "new" }, attributes: { itemType: "skincare", dealMethod: BOTH } },
  "health-in-beautyproducts-02": { fields: { condition: "new" }, attributes: { itemType: "makeup", dealMethod: BOTH } },
  "health-sg-beautyproducts-01": {
    fields: { condition: "new" },
    attributes: { itemType: "skincare", dealMethod: BOTH },
    text: [["Suitable for all skin types.", "Suitable for all skin types. Sealed, bought at ION Orchard. Meet at Orchard MRT or delivery by Ninja Van."]],
  },
  "health-sg-beautyproducts-02": {
    fields: { condition: "new" },
    attributes: { itemType: "makeup", dealMethod: BOTH },
    text: [["a full set of brushes.", "a full set of brushes. Meet at Bugis MRT or delivery by Ninja Van."]],
  },

  // ── Fitness Classes & Training ──
  "hb-gym-01": { fields: { ...IN_PERSON, providerName: "IronCore Fitness" }, attributes: { itemType: "gym", priceUnit: "month" } },
  "hb-gym-02": { fields: { ...IN_PERSON }, attributes: { itemType: "yoga", priceUnit: "month" } },
  "hb-gym-03": { fields: { ...IN_PERSON }, attributes: { itemType: "crossfit", priceUnit: "month" } },
  "health-in-gyms-01": { fields: { ...IN_PERSON, providerName: "FitZone Gym & Fitness" }, attributes: { itemType: "gym", priceUnit: "month" } },
  "health-in-gyms-02": { fields: { ...IN_PERSON, providerName: "FitZone Gym & Fitness" }, attributes: { itemType: "yoga", priceUnit: "month" } },
  "health-sg-gyms-01": {
    fields: { ...IN_PERSON, providerName: "FitZone Gym & Fitness SG" },
    attributes: { itemType: "gym", priceUnit: "month" },
    text: [["2 personal training sessions per month.", "2 personal training sessions per month. Club at Tanjong Pagar, 3 minutes from the MRT."]],
  },
  "health-sg-gyms-02": {
    fields: { ...IN_PERSON, providerName: "FitZone Gym & Fitness SG" },
    attributes: { itemType: "yoga", priceUnit: "month" },
    text: [["suitable for all fitness levels.", "suitable for all fitness levels. 7am classes at our Tanjong Pagar studio."]],
  },

  // ── Medical & Therapy ──
  "hb-med-01": { fields: { ...IN_PERSON, qualification: "CQC registered" }, attributes: { itemType: "doctor", priceUnit: "visit" } },
  "hb-med-02": { fields: { ...IN_PERSON, qualification: "GDC registered" }, attributes: { itemType: "dentist", priceUnit: "visit" } },
  "hb-med-03": { fields: { ...IN_PERSON, qualification: "HCPC registered, MSc Physiotherapy" }, attributes: { itemType: "physio", priceUnit: "session" } },
  "health-in-medical-01": { fields: { ...IN_PERSON, providerName: "Dr. Sharma's Clinic" }, attributes: { itemType: "doctor", priceUnit: "visit" } },
  "health-in-medical-02": { fields: { ...IN_PERSON, providerName: "Dr. Sharma's Clinic" }, attributes: { itemType: "health_check", priceUnit: "package" } },
  "health-sg-medical-01": {
    fields: { ...IN_PERSON, providerName: "Dr. Tan's Clinic" },
    attributes: { itemType: "doctor", priceUnit: "visit" },
    text: [["common ailments and health checkups.", "common ailments and health checkups. CHAS card holders welcome. Clinic in Toa Payoh."]],
  },
  "health-sg-medical-02": {
    fields: { ...IN_PERSON, providerName: "Dr. Tan's Clinic" },
    attributes: { itemType: "health_check", priceUnit: "package" },
    text: [["blood work, ECG, and consultation.", "blood work, ECG, and consultation. Clinic in Toa Payoh; results in 3 working days."]],
  },

  // ── Salons & Spas ──
  "hb-salon-01": { fields: { ...IN_PERSON }, attributes: { services: ["massage", "skincare", "spa"], homeVisits: "no", priceUnit: "from" } },
  "hb-salon-02": { fields: { ...IN_PERSON }, attributes: { services: ["hair"], homeVisits: "no", priceUnit: "from" } },
  "hb-salon-03": { fields: { ...IN_PERSON }, attributes: { services: ["nails", "lashes_brows", "waxing"], homeVisits: "yes", priceUnit: "from" } },
  "health-in-salons-01": { fields: { ...IN_PERSON, providerName: "Glamour Salon & Spa" }, attributes: { services: ["spa", "massage"], homeVisits: "no", priceUnit: "package" } },
  "health-in-salons-02": { fields: { ...IN_PERSON, providerName: "Glamour Salon & Spa" }, attributes: { services: ["hair"], homeVisits: "no", priceUnit: "session" } },
  "health-sg-salons-01": {
    fields: { ...IN_PERSON, providerName: "Glamour Salon & Spa SG" },
    attributes: { services: ["spa", "massage"], homeVisits: "no", priceUnit: "package" },
    text: [["stress relief and muscle relaxation.", "stress relief and muscle relaxation. Spa at Tiong Bahru."]],
  },
  "health-sg-salons-02": {
    fields: { ...IN_PERSON, providerName: "Glamour Salon & Spa SG" },
    attributes: { services: ["hair"], homeVisits: "no", priceUnit: "session" },
    text: [["consultation included.", "consultation included. Salon at Tiong Bahru."]],
  },

  // ── Wellness & Nutrition ──
  "hb-well-01": { fields: { ...IN_PERSON }, attributes: { itemType: "meditation", priceUnit: "class" } },
  "hb-well-02": { fields: { ...IN_PERSON, qualification: "ANutr registered nutritionist" }, attributes: { itemType: "nutrition", priceUnit: "session" } },
  "hb-well-03": { fields: { ...IN_PERSON, qualification: "BAcC member" }, attributes: { itemType: "acupuncture", priceUnit: "session" } },
  "health-in-wellness-01": { fields: { ...IN_PERSON, providerName: "Ananda Wellness Retreat" }, attributes: { itemType: "ayurveda", priceUnit: "package" } },
  "health-in-wellness-02": { fields: { ...IN_PERSON, providerName: "Ananda Wellness Retreat" }, attributes: { itemType: "massage", priceUnit: "session" } },
  "health-sg-wellness-01": { fields: { ...IN_PERSON, providerName: "Serenity Wellness Retreat" }, attributes: { itemType: "retreat", priceUnit: "person" } },
  "health-sg-wellness-02": {
    fields: { ...IN_PERSON, providerName: "Serenity Wellness Retreat" },
    attributes: { itemType: "massage", priceUnit: "session" },
    text: [["performed by certified therapists.", "performed by certified therapists. Studio at Holland Village."]],
  },
};

function isEmpty(value: unknown): boolean {
  return value == null || value === "" || (Array.isArray(value) && value.length === 0);
}

async function run() {
  const dryRun = process.argv.includes("--dry-run");
  await dbConnect();

  const posts = await Post.find({ category: "health_beauty", adsId: { $in: Object.keys(DETAILS) } }).lean();
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
