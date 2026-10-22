// scripts/backfill-services-seed-details.ts
// Run with: npx tsx --env-file=.env.local scripts/backfill-services-seed-details.ts [--dry-run]
//
// One-off per reworked Services sub: the Services seed posts were copied from
// the mock catalog (lib/mock) with only a title and a price, so the reworked
// Services search filters had nothing to match. This fills, from each post's
// mock listing (same id as the post's adsId), only what's empty, so it is safe
// to re-run as more subs are added.
// - Home Services (2026-10-22): Service Type, Listed By, Price Per, Frequency,
//   Same-day / Emergency, Insured, Gas Safe / NICEIC No. (GB), Years of Experience
// - Business Services (2026-10-22): Service Type, Listed By, Price Per,
//   Service Mode, Years of Experience
// - Health & Fitness (2026-10-22): Service Type, Listed By, Service Mode,
//   Price Per, Free Trial
// - Tutoring (2026-10-22): Subjects, Level, Curriculum, Service Mode, Price Per,
//   Tutor Type, DBS Checked (GB), Free Trial Lesson, Years of Experience
// - Education & Learning (2026-10-22): Category, Course Name, Format,
//   Service Mode, Age Group, Duration, Start Date, Price Per, Certificate

import mongoose from "mongoose";
import dbConnect from "../src/lib/db";
import Post from "../src/models/post";

interface SeedDetails {
  serviceType?: string;
  experience?: string;
  subject?: string;
  duration?: string;
  startDate?: string;
  attributes: Record<string, unknown>;
}

// Values are the Services forms' (posting/form-schema/defaults/services.ts).
const DETAILS: Record<string, SeedDetails> = {
  // ── Home Services
  // "Certified Electrician — Same-Day Callouts, Bengaluru", ₹299 / visit
  "svc-in-home-01": { serviceType: "electrical", attributes: { listedBy: "company", priceUnit: "visit", frequency: ["once"], emergency: "yes" } },
  // "Deep Home Cleaning — 2BHK/3BHK, Trained Staff", ₹1,499 / job
  "svc-in-home-02": { serviceType: "cleaning", attributes: { listedBy: "company", priceUnit: "job", frequency: ["once"] } },
  // "Gas Safe Plumber & Heating Engineer — 24/7 London", from £80 / job, Gas Safe #123456, £2M public liability
  "svc-home-01": {
    serviceType: "plumbing",
    attributes: { listedBy: "company", priceUnit: "job", frequency: ["once"], emergency: "yes", insured: "yes", registrationNo: "Gas Safe 123456" },
  },
  // "NICEIC Electrician — Rewires, Consumer Units, Certificates", £60 / hr, NICEIC #7654321, £2M public liability
  "svc-home-02": {
    serviceType: "electrical",
    attributes: { listedBy: "company", priceUnit: "hour", frequency: ["once"], insured: "yes", registrationNo: "NICEIC 7654321" },
  },
  // "Self-Employed Painter & Decorator", £180 / day, 18 years, £1M public liability
  "svc-home-03": { serviceType: "painting", experience: "10+", attributes: { listedBy: "individual", priceUnit: "day", frequency: ["once"], insured: "yes" } },
  // "Licensed Electrician — Same-Day Callouts, Singapore", S$50 / visit
  "svc-sg-home-01": { serviceType: "electrical", attributes: { listedBy: "company", priceUnit: "visit", frequency: ["once"], emergency: "yes" } },
  // "Deep Home Cleaning — HDB/Condo, Trained Staff", S$120 / job
  "svc-sg-home-02": { serviceType: "cleaning", attributes: { listedBy: "company", priceUnit: "job", frequency: ["once"] } },

  // ── Business Services
  // "GST Filing & Accounting — Monthly Retainer for SMEs", ₹5,000 / mo, pan-India remote
  "svc-in-biz-01": { serviceType: "accounting", attributes: { listedBy: "company", priceUnit: "month", serviceMode: ["online"] } },
  // "Private Limited Company Registration — End-to-End", ₹12,000 / job
  "svc-in-biz-02": { serviceType: "company_registration", attributes: { listedBy: "company", priceUnit: "fixed" } },
  // "Small Business Accountancy & Tax Returns — Cloud-Based", £150 / mo, UK-wide remote
  "svc-biz-01": { serviceType: "accounting", attributes: { listedBy: "company", priceUnit: "month", serviceMode: ["online"] } },
  // "SEO & Google Ads Management", £500 / mo, UK-wide remote
  "svc-biz-02": { serviceType: "marketing", attributes: { listedBy: "agency", priceUnit: "month", serviceMode: ["online"] } },
  // "Virtual PA & Executive Assistant", £25 / hr, remote, 10 years PA/EA
  "svc-biz-03": { serviceType: "admin", experience: "10+", attributes: { listedBy: "company", priceUnit: "hour", serviceMode: ["online"] } },
  // "GST Filing & Accounting — Monthly Retainer for SMEs", S$300 / mo
  "svc-sg-biz-01": { serviceType: "accounting", attributes: { listedBy: "company", priceUnit: "month" } },
  // "Private Limited Company Incorporation — ACRA End-to-End", S$600 / job
  "svc-sg-biz-02": { serviceType: "company_registration", attributes: { listedBy: "company", priceUnit: "fixed" } },

  // ── Health & Fitness
  // "Certified Personal Trainer — Home & Gym Sessions", ₹800 / session
  "svc-in-health-01": { serviceType: "pt", attributes: { listedBy: "individual", serviceMode: ["homevisit", "inperson"], priceUnit: "session" } },
  // "Home Yoga Instructor — Beginners to Advanced", ₹500 / session
  "svc-in-health-02": { serviceType: "yoga", attributes: { listedBy: "individual", serviceMode: ["homevisit"], priceUnit: "session" } },
  // "Personal Trainer — 1-to-1 & Online Coaching", £50 / session, free 30-min consultation
  "svc-hf-01": { serviceType: "pt", attributes: { listedBy: "individual", serviceMode: ["inperson", "online"], priceUnit: "session", freeTrial: "yes" } },
  // "Morning Yoga & Pilates Studio", £15 / session, first class free
  "svc-hf-02": { serviceType: "yoga", attributes: { listedBy: "studio", serviceMode: ["inperson"], priceUnit: "session", freeTrial: "yes" } },
  // "Online Nutrition Coaching & Meal Planning", £85 / mo, free 20-min consult
  "svc-hf-03": { serviceType: "nutrition", attributes: { listedBy: "individual", serviceMode: ["online"], priceUnit: "month", freeTrial: "yes" } },
  // "Certified Personal Trainer — Home & Gym Sessions", S$70 / session
  "svc-sg-health-01": { serviceType: "pt", attributes: { listedBy: "individual", serviceMode: ["homevisit", "inperson"], priceUnit: "session" } },
  // "Home Yoga Instructor — Beginners to Advanced", S$60 / session
  "svc-sg-health-02": { serviceType: "yoga", attributes: { listedBy: "individual", serviceMode: ["homevisit"], priceUnit: "session" } },

  // ── Tutoring
  // "Physics & Chemistry Tutor — CBSE/ICSE Class 9-12", ₹600 / hr, 10 years, home visit or online
  "svc-in-tutor-01": {
    experience: "10+",
    attributes: { subjects: ["science"], levels: ["secondary", "higher-secondary"], curriculum: ["cbse", "icse"], serviceMode: ["homevisit", "online"], priceUnit: "hour" },
  },
  // "Spoken English & Grammar Tutor — All Ages", ₹450 / hr, home visit or online
  "svc-in-tutor-02": { attributes: { subjects: ["english"], levels: ["primary", "secondary", "adult"], serviceMode: ["homevisit", "online"], priceUnit: "hour" } },
  // "GCSE & A-Level Maths Tutor — 10 Yrs Exp", £35 / hr, North London / Online, free taster, Enhanced DBS
  "svc-tutor-01": {
    experience: "10+",
    attributes: { subjects: ["maths"], levels: ["gcse", "a_level"], serviceMode: ["homevisit", "online"], priceUnit: "hour", freeTrial: "yes", dbsChecked: "yes" },
  },
  // "French & Spanish Language Tutor — All Levels, Exam Prep", £30 / hr, online, beginner to A-Level
  "svc-tutor-02": { attributes: { subjects: ["languages"], levels: ["gcse", "a_level", "adult"], serviceMode: ["online"], priceUnit: "hour" } },
  // "11+ & Common Entrance Exam Prep", £45 / hr, SW London / Online, Enhanced DBS
  "svc-tutor-03": {
    attributes: { subjects: ["maths", "english", "other"], otherSubject: "11+ / Common Entrance", levels: ["primary"], serviceMode: ["homevisit", "online"], priceUnit: "hour", dbsChecked: "yes" },
  },
  // "Maths & Science Tutor — PSLE & O-Level, MOE-Trained", S$60 / hr, 8 years, home visit or online
  "svc-sg-tutor-01": {
    experience: "5-10",
    attributes: { subjects: ["maths", "science"], levels: ["primary", "o_level"], curriculum: ["moe"], tutorType: "teacher", serviceMode: ["homevisit", "online"], priceUnit: "hour" },
  },
  // "English & Composition Tutor — Primary & Secondary", S$50 / hr, home visit or online
  "svc-sg-tutor-02": { attributes: { subjects: ["english"], levels: ["primary", "o_level"], serviceMode: ["homevisit", "online"], priceUnit: "hour" } },
  // ── Education & Learning
  // "JEE Main & Advanced Coaching — Structured Yearly Batch", ₹45,000 / yr, 12 months
  "svc-in-edu-01": {
    subject: "JEE Main & Advanced",
    duration: "12 months",
    attributes: { courseCategory: "exam", courseFormat: "course", serviceMode: ["inperson"], ageGroup: ["teens"], priceUnit: "course" },
  },
  // "NEET Biology & Chemistry Coaching — Weekend Batch", ₹50,000 / yr, weekends only
  "svc-in-edu-02": {
    subject: "NEET Biology & Chemistry",
    attributes: { courseCategory: "exam", courseFormat: "course", serviceMode: ["inperson"], ageGroup: ["teens"], priceUnit: "course" },
  },
  // "AWS Cloud Practitioner & Solutions Architect — Bootcamp", £199 / course, 12 weeks, live online
  "svc-edu-01": {
    subject: "AWS Cloud Practitioner & Solutions Architect",
    duration: "12 weeks",
    attributes: { courseCategory: "tech", courseFormat: "course", serviceMode: ["online"], ageGroup: ["adults"], priceUnit: "course" },
  },
  // "PRINCE2 Foundation Training — 2-Day Intensive, Central London", £595 / course, exam voucher included
  "svc-edu-02": {
    subject: "PRINCE2 Foundation",
    duration: "2 days",
    attributes: { courseCategory: "business", courseFormat: "course", serviceMode: ["inperson"], ageGroup: ["adults"], priceUnit: "course", certificate: "yes" },
  },
  // "IELTS & English Language Coaching — Guaranteed Band Improvement", £40 / hr, online or Central London
  "svc-edu-03": {
    subject: "IELTS & English",
    attributes: { courseCategory: "languages", courseFormat: "onetoone", serviceMode: ["online", "inperson"], ageGroup: ["adults"], priceUnit: "class" },
  },
  // "PSLE Preparation Programme — Small-Group Classes", S$400 / mo, ongoing
  "svc-sg-edu-01": {
    subject: "PSLE Preparation",
    startDate: "Ongoing",
    attributes: { courseCategory: "exam", courseFormat: "class", serviceMode: ["inperson"], ageGroup: ["kids"], priceUnit: "month" },
  },
  // "O-Level Science Coaching — Weekend Batch", S$450 / mo, weekends only
  "svc-sg-edu-02": {
    subject: "O-Level Science",
    attributes: { courseCategory: "exam", courseFormat: "class", serviceMode: ["inperson"], ageGroup: ["teens"], priceUnit: "month" },
  },
};

async function run() {
  const dryRun = process.argv.includes("--dry-run");
  await dbConnect();

  const posts = await Post.find({ category: { $in: ["services", "Services"] }, adsId: { $in: Object.keys(DETAILS) } })
    .select({ _id: 1, adsId: 1, country: 1, serviceType: 1, experience: 1, subject: 1, duration: 1, startDate: 1, attributes: 1 })
    .lean();
  const found = new Set(posts.map((p) => p.adsId));
  for (const id of Object.keys(DETAILS)) if (!found.has(id)) console.log(`${id}: no post`);

  for (const post of posts) {
    const id = post.adsId!;
    const details = DETAILS[id];
    const $set: Record<string, unknown> = {};
    if (details.serviceType && !post.serviceType) $set.serviceType = details.serviceType;
    if (details.experience && !post.experience) $set.experience = details.experience;
    if (details.subject && !post.subject) $set.subject = details.subject;
    if (details.duration && !post.duration) $set.duration = details.duration;
    if (details.startDate && !post.startDate) $set.startDate = details.startDate;
    for (const [key, value] of Object.entries(details.attributes)) {
      if (post.attributes?.[key] == null) $set[`attributes.${key}`] = value;
    }

    if (!Object.keys($set).length) continue;
    console.log(`${id} (${post.country}): ${dryRun ? "would set" : "set"} ${JSON.stringify($set)}`);
    if (!dryRun) await Post.updateOne({ _id: post._id }, { $set });
  }
}

run()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
