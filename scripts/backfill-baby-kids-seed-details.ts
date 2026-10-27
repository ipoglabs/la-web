// scripts/backfill-baby-kids-seed-details.ts
// Run with: npx tsx --env-file=.env.local scripts/backfill-baby-kids-seed-details.ts [--dry-run]
//
// One-off (2026-10-27): the Baby & Kids seed posts have only a title, a
// description and a price, so the reworked search filters had nothing to
// match and childcare showed no "/ hr". This fills, from each ad's own text,
// what the reworked forms ask: Type, Age, Condition, Brand and Deal Method for
// things; Care Type, Ages, Hours and checks for childcare; Activity, Ages and
// Mode for classes; and Price Per for services. Detail fields are only filled
// where empty, so it is safe to re-run.
//
// The Singapore copies of India's ads get a local detail.

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

// Values are the Baby & Kids forms' (posting/form-schema/defaults/baby-kids.ts).
const DETAILS: Record<string, SeedDetails> = {
  // ── Toys & Games ──
  "baby-toys-01": { fields: { condition: "lightly-used" }, attributes: { itemType: "baby_toddler", ageGroup: "0_2", brand: "ELC / Fisher-Price", dealMethod: ["meetup"] } },
  "baby-toys-02": { fields: { condition: "like-new" }, attributes: { itemType: "building", ageGroup: "10plus", brand: "LEGO", complete: "yes", dealMethod: BOTH } },
  "baby-toys-03": { fields: { condition: "lightly-used" }, attributes: { itemType: "dolls_figures", ageGroup: "3_5", brand: "Schleich", dealMethod: BOTH } },
  "kids-in-toys-01": { fields: { condition: "like-new" }, attributes: { itemType: "building", ageGroup: "3_5", complete: "yes", dealMethod: BOTH } },
  "kids-in-toys-02": { fields: { condition: "lightly-used" }, attributes: { itemType: "board_games", ageGroup: "6_9", complete: "yes", dealMethod: ["meetup"] } },
  "kids-sg-toys-01": {
    fields: { condition: "like-new" },
    attributes: { itemType: "building", ageGroup: "3_5", complete: "yes", dealMethod: BOTH },
    text: [["suitable for ages 4 and up.", "suitable for ages 4 and up. Meet at Punggol MRT or mail islandwide."]],
  },
  "kids-sg-toys-02": {
    fields: { condition: "lightly-used" },
    attributes: { itemType: "board_games", ageGroup: "6_9", complete: "yes", dealMethod: ["meetup"] },
    text: [["ages 6 and up.", "ages 6 and up. All pieces there. Meet at Jurong East MRT."]],
  },

  // ── Baby Gear & Equipment ──
  "baby-gear-01": { fields: { condition: "lightly-used" }, attributes: { itemType: "cot", brand: "John Lewis", ageRange: "Birth to 4 months", dealMethod: ["meetup"] } },
  "baby-gear-02": { fields: { condition: "like-new", model: "MBP36XL" }, attributes: { itemType: "monitor", brand: "Motorola", dealMethod: BOTH } },
  "baby-gear-03": { fields: { condition: "lightly-used", model: "Fox 3" }, attributes: { itemType: "pram", brand: "Bugaboo", ageRange: "Birth to 4 years", dealMethod: ["meetup"] } },
  "kids-in-babygear-01": { fields: { condition: "lightly-used" }, attributes: { itemType: "pram", dealMethod: BOTH } },
  "kids-in-babygear-02": { fields: { condition: "lightly-used" }, attributes: { itemType: "car_seat", carSeatStandard: "other", accidentFree: "yes", ageRange: "Birth to 4 years", dealMethod: BOTH } },
  "kids-sg-babygear-01": {
    fields: { condition: "lightly-used" },
    attributes: { itemType: "pram", dealMethod: BOTH },
    text: [["easy to carry while traveling.", "easy to carry while traveling. Folds small enough for the MRT and taxi boots."]],
  },
  "kids-sg-babygear-02": {
    fields: { condition: "lightly-used" },
    attributes: { itemType: "car_seat", carSeatStandard: "r44", accidentFree: "yes", ageRange: "Birth to 4 years", dealMethod: BOTH },
    text: [["ISOFIX compatible.", "ISOFIX compatible, ECE R44/04. Never in an accident."]],
  },

  // ── Baby & Kids Clothing ──
  "baby-cloth-01": { fields: { condition: "lightly-used", gender: "boy", size: "3–4 years" }, attributes: { itemType: "bundle", ageGroup: "toddler", brand: "Next / M&S", dealMethod: BOTH } },
  "baby-cloth-02": { fields: { condition: "like-new", gender: "girl", size: "6–7 years" }, attributes: { itemType: "dresses", ageGroup: "young", brand: "John Lewis / Monsoon", dealMethod: BOTH } },
  "baby-cloth-03": { fields: { condition: "lightly-used", gender: "unisex", size: "9–12 months" }, attributes: { itemType: "bundle", ageGroup: "infant", brand: "Joules", dealMethod: BOTH } },
  "kids-in-clothing-01": { fields: { condition: "lightly-used", gender: "unisex", size: "4–6 years" }, attributes: { itemType: "bundle", ageGroup: "young", dealMethod: BOTH } },
  "kids-in-clothing-02": { fields: { condition: "new", gender: "boy", size: "3–5 years" }, attributes: { itemType: "traditional", ageGroup: "toddler", dealMethod: BOTH } },
  "kids-sg-clothing-01": {
    fields: { condition: "lightly-used", gender: "unisex", size: "4–6 years" },
    attributes: { itemType: "bundle", ageGroup: "young", dealMethod: BOTH },
    text: [["gently used and in good condition.", "gently used and in good condition. Light cotton, good for Singapore weather."]],
  },
  "kids-sg-clothing-02": { fields: { condition: "new", gender: "boy", size: "3–5 years" }, attributes: { itemType: "traditional", ageGroup: "toddler", dealMethod: BOTH } },

  // ── School Supplies & Books ──
  "baby-school-01": { fields: { condition: "like-new" }, attributes: { itemType: "uniform", ageGroup: "3_5", brand: "John Lewis / M&S", school: "Reception / Year 1", dealMethod: BOTH } },
  "baby-school-02": { fields: { condition: "new" }, attributes: { itemType: "bags", ageGroup: "3_5", dealMethod: BOTH } },
  "baby-school-03": { fields: { condition: "new" }, attributes: { itemType: "stationery", ageGroup: "6_9", brand: "Faber-Castell", dealMethod: BOTH } },
  "kids-in-supplies-01": { fields: { condition: "new" }, attributes: { itemType: "bags", ageGroup: "6_9", dealMethod: BOTH } },
  "kids-in-supplies-02": { fields: { condition: "new" }, attributes: { itemType: "stationery", ageGroup: "10plus", dealMethod: BOTH } },
  "kids-sg-supplies-01": {
    fields: { condition: "new" },
    attributes: { itemType: "bags", ageGroup: "6_9", school: "Primary 1–3", dealMethod: BOTH },
    text: [["books, lunch box, and water bottle.", "books, lunch box, and water bottle. Fits a Primary school timetable's worth of books."]],
  },
  "kids-sg-supplies-02": { fields: { condition: "new" }, attributes: { itemType: "stationery", ageGroup: "10plus", dealMethod: BOTH } },

  // ── Childcare & Nurseries ──
  "baby-care-01": { attributes: { careType: "childminder", ages: ["0_2", "3_5"], hours: ["fullday", "halfday"], priceUnit: "hour" } },
  "baby-care-02": { fields: { qualification: "Norland diploma" }, attributes: { careType: "nanny", ages: ["0_2", "3_5", "6_9"], hours: ["fullday"], backgroundCheck: "yes", firstAid: "yes", priceUnit: "month" } },
  "baby-care-03": { fields: { availability: "Mon–Fri 3:15–6pm; full days in school holidays" }, attributes: { careType: "afterschool", ages: ["3_5", "6_9", "10plus"], hours: ["halfday", "fullday"], priceUnit: "session" } },
  "kids-in-childcare-01": { attributes: { careType: "nursery", ages: ["0_2", "3_5"], hours: ["fullday"], priceUnit: "month" } },
  "kids-in-childcare-02": { attributes: { careType: "afterschool", ages: ["6_9", "10plus"], hours: ["halfday"], priceUnit: "month" } },
  "kids-sg-childcare-01": {
    attributes: { careType: "nursery", ages: ["0_2", "3_5"], hours: ["fullday"], priceUnit: "month" },
    text: [["nap time, and structured activities.", "nap time, and structured activities. Bilingual English and Mandarin programme in Sengkang."]],
  },
  "kids-sg-childcare-02": {
    attributes: { careType: "afterschool", ages: ["6_9", "10plus"], hours: ["halfday"], priceUnit: "month" },
    text: [["supervised play until pickup.", "supervised play until pickup. Pick-up from nearby primary schools in Bukit Batok."]],
  },

  // ── Kids Classes & Activities ──
  "baby-act-01": { fields: { consultationMode: "inperson", qualification: "STA certified" }, attributes: { activityType: "swimming", ages: ["0_2", "3_5"], priceUnit: "term" } },
  "baby-act-02": { fields: { consultationMode: "inperson", qualification: "FA qualified", availability: "Saturdays 9–10:30am" }, attributes: { activityType: "sports", ages: ["3_5", "6_9"], priceUnit: "session" } },
  "baby-act-03": { fields: { consultationMode: "inperson", qualification: "Qualified primary computing teacher", availability: "Weekly" }, attributes: { activityType: "coding", ages: ["6_9", "10plus"], priceUnit: "class" } },
  "kids-in-activities-01": { fields: { consultationMode: "inperson", availability: "Weekends" }, attributes: { activityType: "arts", ages: ["3_5", "6_9"], priceUnit: "session" } },
  "kids-in-activities-02": { fields: { consultationMode: "inperson" }, attributes: { activityType: "camps", ages: ["6_9", "10plus"], priceUnit: "course" } },
  "kids-sg-activities-01": {
    fields: { consultationMode: "inperson", availability: "Weekends" },
    attributes: { activityType: "arts", ages: ["3_5", "6_9"], priceUnit: "session" },
    text: [["collage, and simple crafts.", "collage, and simple crafts. At our studio near Bishan MRT."]],
  },
  "kids-sg-activities-02": { fields: { consultationMode: "inperson" }, attributes: { activityType: "camps", ages: ["6_9", "10plus"], priceUnit: "course" } },
};

function isEmpty(value: unknown): boolean {
  return value == null || value === "" || (Array.isArray(value) && value.length === 0);
}

async function run() {
  const dryRun = process.argv.includes("--dry-run");
  await dbConnect();

  const posts = await Post.find({ category: "baby_kids", adsId: { $in: Object.keys(DETAILS) } }).lean();
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
