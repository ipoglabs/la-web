// scripts/backfill-education-seed-details.ts
// Run with: npx tsx --env-file=.env.local scripts/backfill-education-seed-details.ts [--dry-run]
//
// One-off (2026-10-26): the Education seed posts were copied from the mock
// catalog (lib/mock) with only a title and a price, so the reworked Education
// search filters had nothing to match and every fee lost its "/ hr" or "/ term".
// This fills, from each post's mock listing (same id as the post's adsId), what
// the reworked forms ask:
// - Tutors & Coaching: Subjects, Level, Exam Board, Lesson Format, Service Mode, DBS, Free Trial, Fee Per
// - Courses: Category, Format, Duration, Certificate, Instalments, Refund Policy, Fee Per
// - Study Materials: Material Type, Level, Subject, Condition, Number of Items, Sold As, Edition
// - Schools & Colleges: Ad Type, Institution Type, Curriculum, Ages, Accreditation, Fees Per
// - Language Classes: Language, Level, Format, Exam Prep, Class Size, Schedule, Fee Per
// Detail fields are only filled where empty, so it is safe to re-run.
//
// The four IN / SG admissions-counselling and application-help seeds are
// consultancy services, not schools: they move to Services › Education &
// Learning. The GB sixth-form open evening moves a year on, with its title,
// so it doesn't drop out of search.

import mongoose from "mongoose";
import dbConnect from "../src/lib/db";
import Post from "../src/models/post";

interface SeedDetails {
  /** Post model paths the forms save top-level, filled where empty. */
  fields?: Record<string, unknown>;
  /** Everything else the forms save under `attributes`, filled where empty. */
  attributes?: Record<string, unknown>;
  /** Always written: moves. */
  set?: Record<string, unknown>;
  unset?: string[];
  /** Text swapped in the title and description (dates moved on). */
  text?: [string, string][];
}

// Values are the Education forms' (posting/form-schema/defaults/education.ts).
const counselling = (subject: string): SeedDetails => ({
  set: { category: "services", subcategory: "education_learning" },
  fields: { subject },
  attributes: { courseCategory: "other", courseFormat: "onetoone", serviceMode: ["inperson", "online"] },
});
const WEB_DEV: SeedDetails = { attributes: { courseCategory: "tech", deliveryFormat: "blended", certificate: "completion", priceUnit: "course" }, fields: { duration: "6m" } };
const DIGITAL_MARKETING: SeedDetails = { attributes: { courseCategory: "business", deliveryFormat: "live", priceUnit: "course" }, fields: { duration: "3m" } };
const FRENCH: SeedDetails = { attributes: { language: "french", classSize: "small", schedule: "3 months", priceUnit: "term" }, fields: { level: "beginner" } };
const JAPANESE: SeedDetails = { attributes: { language: "japanese", examPrep: "jlpt", priceUnit: "term" }, fields: { level: "beginner" } };

const DETAILS: Record<string, SeedDetails> = {
  // ── Tutors & Coaching
  "edu-in-tutors-01": {
    attributes: { subjects: ["maths", "science"], levels: ["middle", "secondary"], lessonFormat: ["one_to_one"], serviceMode: ["homevisit", "online"], priceUnit: "hour" },
  },
  "edu-in-tutors-02": { attributes: { subjects: ["english"], lessonFormat: ["one_to_one", "group"], priceUnit: "hour" } },
  "edu-tutor-01": {
    fields: { qualification: "MPhys Oxford, PGCE", availability: "Evenings & weekends" },
    attributes: {
      subjects: ["science"], levels: ["a_level"], curriculum: ["aqa", "ocr", "edexcel"], serviceMode: ["inperson", "online"],
      dbsChecked: "yes", freeTrial: "yes", priceUnit: "hour",
    },
  },
  "edu-tutor-02": {
    fields: { availability: "Weekends & school holidays" },
    attributes: {
      subjects: ["english", "maths", "other"], otherSubject: "11+ / 13+ verbal and non-verbal reasoning", levels: ["primary", "ks3"],
      dbsChecked: "yes", priceUnit: "hour",
    },
  },
  "edu-tutor-03": {
    fields: { qualification: "SENCO qualified, PGCE" },
    attributes: { subjects: ["english"], levels: ["primary"], serviceMode: ["homevisit", "online"], dbsChecked: "yes", freeTrial: "yes", priceUnit: "hour" },
  },
  "edu-sg-tutors-01": {
    attributes: { subjects: ["maths", "science"], levels: ["primary", "o_level"], lessonFormat: ["one_to_one"], serviceMode: ["homevisit", "online"], priceUnit: "hour" },
  },
  "edu-sg-tutors-02": { attributes: { subjects: ["english"], lessonFormat: ["one_to_one", "group"], priceUnit: "hour" } },

  // ── Courses
  "edu-in-online-01": WEB_DEV,
  "edu-in-online-02": DIGITAL_MARKETING,
  "edu-course-01": {
    fields: { duration: "6m" },
    attributes: { courseCategory: "tech", deliveryFormat: "blended", certificate: "accredited", instalments: "yes", refundPolicy: "7-day cooling-off period", priceUnit: "course" },
  },
  "edu-course-02": {
    fields: { duration: "selfpaced" },
    attributes: { courseCategory: "exam", deliveryFormat: "blended", certificate: "completion", refundPolicy: "14-day money-back", priceUnit: "course" },
  },
  "edu-course-03": {
    fields: { duration: "1m" },
    attributes: { courseCategory: "business", deliveryFormat: "inperson_online", certificate: "completion", refundPolicy: "7-day cooling-off period", priceUnit: "course" },
  },
  "edu-sg-online-01": WEB_DEV,
  "edu-sg-online-02": DIGITAL_MARKETING,

  // ── Study Materials
  "edu-in-materials-01": {
    fields: { level: "secondary", subject: "NCERT Grade 10, all subjects", condition: "like-new" },
    attributes: { materialType: "textbooks", quantity: 5, soldAs: "bundle" },
  },
  "edu-in-materials-02": {
    fields: { level: "competitive", subject: "JEE Main & Advanced", condition: "lightly-used" },
    attributes: { materialType: "guides", soldAs: "bundle" },
  },
  "edu-study-01": {
    fields: { level: "gcse", subject: "GCSE, all subjects", condition: "lightly-used" },
    attributes: { dealMethod: ["meetup", "delivery"], materialType: "guides", quantity: 10, soldAs: "bundle" },
  },
  "edu-study-02": {
    fields: { level: "university", subject: "Medicine", condition: "lightly-used" },
    attributes: { dealMethod: ["meetup", "delivery"], materialType: "textbooks", quantity: 8, soldAs: "bundle", edition: "2024–25" },
  },
  "edu-study-03": {
    fields: { subject: "ABRSM Piano Grades 3–5 + Theory", condition: "lightly-used", negotiable: "yes" },
    attributes: { dealMethod: ["meetup", "delivery"], materialType: "textbooks", quantity: 5, soldAs: "bundle", edition: "2023–24" },
  },
  "edu-sg-materials-01": {
    fields: { level: "primary", subject: "Primary 6, all subjects", condition: "like-new" },
    attributes: { materialType: "guides", soldAs: "bundle" },
  },
  "edu-sg-materials-02": {
    fields: { level: "a_level", subject: "A-Level H2 Maths & Physics", condition: "lightly-used" },
    attributes: { materialType: "guides", soldAs: "bundle" },
  },

  // ── Schools & Colleges
  "edu-in-schools-01": counselling("School Admissions Counselling"),
  "edu-in-schools-02": counselling("College Application & SOP Writing"),
  "edu-sg-schools-01": counselling("Primary School Admissions Counselling"),
  "edu-sg-schools-02": counselling("University Application & Personal Statement"),
  "edu-school-01": {
    fields: { providerName: "Weekend Drama & Performing Arts School" },
    attributes: { adType: "places", institutionType: "activity", ageRange: "Ages 5–18", accreditation: "Ofsted Good", priceUnit: "term" },
  },
  "edu-school-02": {
    attributes: { adType: "places", institutionType: "tuition", curriculum: ["national"], ageRange: "KS2 & KS3", priceUnit: "month" },
  },
  "edu-school-03": {
    fields: { startDate: "2027-07-01" },
    attributes: { adType: "openday", institutionType: "sixth", curriculum: ["national"], ageRange: "A-Level, T-Level, Vocational" },
    text: [["3 July 2026", "1 July 2027"], ["September 2026", "September 2027"]],
  },

  // ── Language Classes
  "edu-in-language-01": FRENCH,
  "edu-in-language-02": JAPANESE,
  "edu-lang-01": {
    fields: { level: "beginner", mode: "inperson" },
    attributes: { language: "mandarin", classSize: "small", schedule: "Evenings, 6 weeks", nativeSpeaker: "yes", priceUnit: "course" },
  },
  "edu-lang-02": {
    fields: { level: "advanced", mode: "online" },
    attributes: { language: "english", examPrep: "ielts", schedule: "8 weeks, self-paced + live", priceUnit: "course" },
  },
  "edu-lang-03": {
    fields: { level: "beginner", mode: "inperson" },
    attributes: { language: "bsl", schedule: "Tue evenings 6:30 pm, 10 weeks", nativeSpeaker: "yes", priceUnit: "course" },
  },
  "edu-sg-language-01": FRENCH,
  "edu-sg-language-02": JAPANESE,
};

function isEmpty(value: unknown): boolean {
  return value == null || value === "" || (Array.isArray(value) && value.length === 0);
}

async function run() {
  const dryRun = process.argv.includes("--dry-run");
  await dbConnect();

  // Moved seeds have left Education, so they're found by adsId alone.
  const posts = await Post.find({ adsId: { $in: Object.keys(DETAILS) } }).lean();
  const found = new Set(posts.map((p) => p.adsId));
  for (const id of Object.keys(DETAILS)) if (!found.has(id)) console.log(`${id}: no post`);

  for (const post of posts) {
    const id = post.adsId!;
    const details = DETAILS[id];
    const doc = post as unknown as Record<string, unknown>;
    const $set: Record<string, unknown> = {};
    const $unset: Record<string, ""> = {};
    for (const [key, value] of Object.entries(details.fields ?? {})) {
      if (isEmpty(doc[key])) $set[key] = value;
    }
    for (const [key, value] of Object.entries(details.attributes ?? {})) {
      if (isEmpty(post.attributes?.[key])) $set[`attributes.${key}`] = value;
    }
    for (const [key, value] of Object.entries(details.set ?? {})) {
      if (doc[key] !== value) $set[key] = value;
    }
    for (const key of details.unset ?? []) if (doc[key] != null) $unset[key] = "";
    for (const key of ["name", "description"] as const) {
      const before = post[key] ?? "";
      const after = (details.text ?? []).reduce((s, [from, to]) => s.split(from).join(to), before);
      if (after !== before) $set[key] = after;
    }

    if (!Object.keys($set).length && !Object.keys($unset).length) continue;
    const update = { ...(Object.keys($set).length ? { $set } : {}), ...(Object.keys($unset).length ? { $unset } : {}) };
    console.log(`${id} (${post.country}): ${dryRun ? "would apply" : "applied"} ${JSON.stringify(update)}`);
    if (!dryRun) await Post.updateOne({ _id: post._id }, update);
  }
}

run()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
