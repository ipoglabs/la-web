// scripts/backfill-community-seed-details.ts
// Run with: npx tsx --env-file=.env.local scripts/backfill-community-seed-details.ts [--dry-run]
//
// One-off (2026-10-26): the Community seed posts were copied from the mock
// catalog (lib/mock) with only a title and a price, so the reworked Community
// search filters had nothing to match. This fills, from each post's mock
// listing (same id as the post's adsId), what the reworked forms ask:
// - Lost & Found: Report Type, Item, Date, Location, Reward
// - Events: Event Type, Format, Event Date, Repeats, Start Time, Venue, Suitable For, Booking
// - Volunteering: Cause, Commitment, Format, When Needed, Skills, Minimum Age, Training, Background Check
// - Announcement: Type, Posted By, Urgency, From / Until Date, Reference
// - Child & Family: Activity Type, Age Group, Format, How Often, Time, Booking, Fee Per
// - General / Others: Topic, Post Type
// Detail fields are only filled where empty, so it is safe to re-run.
//
// It also moves the seeds filed in the wrong place: the IN and SG carpool groups
// to Rideshare & Carpool, the IN and SG found golden retrievers to Pets › Lost &
// Found, and the GB free soil to Free / Giveaway. The GB £50 wallet reward moves
// off the price. Events and notices dated in the past are moved a year on, with
// their title and description, so they don't drop out of search.

import mongoose from "mongoose";
import dbConnect from "../src/lib/db";
import Post from "../src/models/post";

interface SeedDetails {
  /** Post model paths the forms save top-level, filled where empty. */
  fields?: Record<string, unknown>;
  /** Everything else the forms save under `attributes`, filled where empty. */
  attributes?: Record<string, unknown>;
  /** Always written: moves and corrected prices. */
  set?: Record<string, unknown>;
  unset?: string[];
  /** Text swapped in the title and description (dates moved on). */
  text?: [string, string][];
}

const WEEKDAYS = ["mon", "tue", "wed", "thu", "fri"];

// Values are the Community forms' (posting/form-schema/defaults/community.ts).
const VOLUNTEER_CLEANUP: SeedDetails = {
  fields: { mode: "inperson", availability: "Every Saturday, 7 am" },
  attributes: { cause: "environment", commitment: "recurring", backgroundCheck: "none" },
};
const VOLUNTEER_TUTORS: SeedDetails = {
  fields: { mode: "inperson", availability: "2 hours each weekend" },
  attributes: { cause: "education", commitment: "recurring", skillsNeeded: ["teaching"], trainingProvided: "yes" },
};
const NEW_PARENTS: SeedDetails = {
  fields: { mode: "inperson" },
  attributes: { activityType: "support", ageGroup: ["parents"], frequency: "weekly", startTime: "Sundays, 10 am", bookingNeeded: "no" },
};
const BABYSITTING_CIRCLE: SeedDetails = {
  fields: { mode: "inperson" },
  attributes: { activityType: "other", ageGroup: ["parents"], frequency: "weekly", bookingNeeded: "yes" },
};
const BOOK_CLUB: SeedDetails = { attributes: { topic: "clubs", postType: "offering" } };
const carpool = (from: string, to: string): SeedDetails => ({
  set: { subcategory: "rideshare_carpool" },
  unset: ["salePrice"],
  attributes: {
    rideType: "offering", routeType: "commute", fromLocation: from, toLocation: to,
    days: WEEKDAYS, departureTime: "8 am, back at 6 pm", returnTrip: "yes",
  },
});
const foundRetriever = (lfDate: string, place: string): SeedDetails => ({
  set: { category: "pets", subcategory: "lost_found" },
  unset: ["salePrice"],
  fields: { reportType: "found", petType: "dog", breed: "Golden Retriever", color: "Golden", size: "large", lfDate, lastSeenLocation: place },
});

const DETAILS: Record<string, SeedDetails> = {
  // ── Lost & Found
  "community-in-lostfound-01": {
    fields: { reportType: "lost", lfDate: "2026-10-20", lastSeenLocation: "Vasant Kunj Metro Station" },
    attributes: { itemCategory: "bag", reward: 1000 },
    unset: ["salePrice"],
  },
  "community-in-lostfound-02": foundRetriever("2026-10-22", "Kothrud, Pune"),
  "comm-lost-01": {
    fields: { reportType: "found", lfDate: "2026-06-26", lastSeenLocation: "Clapham Common Station (south side)" },
    attributes: { itemCategory: "keys" },
    unset: ["salePrice"],
  },
  "comm-lost-02": {
    fields: { reportType: "lost", lfDate: "2026-06-25", lastSeenLocation: "Victoria Station area" },
    attributes: { itemCategory: "bag", reward: 50 },
    unset: ["salePrice"],
  },
  "comm-lost-03": {
    fields: { reportType: "found", lfDate: "2026-06-08", lastSeenLocation: "Kennington Park Road, SE11" },
    attributes: { itemCategory: "vehicle" },
    unset: ["salePrice"],
  },
  "community-sg-lostfound-01": {
    fields: { reportType: "lost", lfDate: "2026-10-20", lastSeenLocation: "Bishan MRT Station" },
    attributes: { itemCategory: "bag", reward: 50 },
    unset: ["salePrice"],
  },
  "community-sg-lostfound-02": foundRetriever("2026-10-22", "Yishun, Singapore"),

  // ── Events
  "community-in-events-01": {
    fields: { mode: "inperson", startDate: "2026-11-08" },
    attributes: { eventType: "community", frequency: "once", startTime: "5 pm", venue: "Koregaon Park grounds", suitableFor: "all", bookingNeeded: "no" },
    text: [["Diwali Mela 2025", "Diwali Mela 2026"]],
  },
  "community-in-events-02": {
    fields: { mode: "inperson", startDate: "2026-11-15" },
    attributes: { eventType: "sports", frequency: "once", startTime: "6 am", venue: "Koregaon Park, Pune", suitableFor: "all", bookingNeeded: "yes" },
  },
  "comm-event-01": {
    fields: { mode: "inperson", startDate: "2027-07-10" },
    attributes: { eventType: "community", frequency: "once", startTime: "11 am – 6 pm", venue: "Windrush Square, SW2", suitableFor: "all", bookingNeeded: "no" },
    text: [["12 July 2026", "10 July 2027"], ["12 Jul", "10 Jul"]],
  },
  "comm-event-02": {
    fields: { mode: "inperson", startDate: "2027-07-18" },
    attributes: { eventType: "arts", frequency: "once", startTime: "Bar 7 pm, film about 9:15 pm", venue: "Bold Tendencies, SE15", bookingNeeded: "yes" },
    text: [["19 July 2026", "18 July 2027"], ["19 Jul", "18 Jul"]],
  },
  "comm-event-03": {
    fields: { mode: "inperson", startDate: "2026-10-28" },
    attributes: { eventType: "community", frequency: "weekly", startTime: "Wednesdays, 7–9 pm", venue: "Soho, Central London", suitableFor: "adults", bookingNeeded: "no" },
  },
  "community-sg-events-01": {
    fields: { mode: "inperson", startDate: "2026-11-08" },
    attributes: { eventType: "community", frequency: "once", startTime: "5 pm", venue: "Tampines Community Plaza", suitableFor: "all", bookingNeeded: "no" },
  },
  "community-sg-events-02": {
    fields: { mode: "inperson", startDate: "2026-11-15" },
    attributes: { eventType: "sports", frequency: "once", startTime: "6 am", venue: "Tampines, Singapore", suitableFor: "all", bookingNeeded: "yes" },
  },

  // ── Volunteering & Charity
  "community-in-volunteer-01": VOLUNTEER_CLEANUP,
  "community-in-volunteer-02": VOLUNTEER_TUTORS,
  "comm-vol-01": {
    fields: { mode: "inperson", availability: "One weekend shift a month" },
    attributes: { cause: "poverty", commitment: "recurring", minAge: 18, trainingProvided: "yes", backgroundCheck: "provided" },
  },
  "comm-vol-02": {
    fields: { mode: "inperson", availability: "Every 2nd Sunday, 9:30–11 am" },
    attributes: { cause: "environment", commitment: "recurring", backgroundCheck: "none" },
  },
  "comm-vol-03": {
    fields: { mode: "inperson", availability: "2 hours a week" },
    attributes: { cause: "elderly", commitment: "recurring", skillsNeeded: ["tech"], minAge: 18, trainingProvided: "yes", backgroundCheck: "provided" },
  },
  "community-sg-volunteer-01": VOLUNTEER_CLEANUP,
  "community-sg-volunteer-02": VOLUNTEER_TUTORS,

  // ── Announcement
  "community-in-announce-01": {
    fields: { urgency: "normal", startDate: "2026-11-12", endDate: "2026-11-12" },
    attributes: { annType: "infra", postedBy: "member" },
  },
  "community-in-announce-02": {
    fields: { urgency: "normal", startDate: "2026-11-20", endDate: "2026-11-20" },
    attributes: { annType: "community", postedBy: "member" },
  },
  "comm-ann-01": {
    fields: { urgency: "normal", startDate: "2027-07-05", endDate: "2027-07-07" },
    attributes: { annType: "road", postedBy: "authority" },
    text: [["July 2026", "July 2027"]],
  },
  "comm-ann-02": {
    fields: { urgency: "normal", endDate: "2027-07-10" },
    attributes: { annType: "government", postedBy: "authority", reference: "26/AP/1234" },
    text: [["July 2026", "July 2027"]],
  },
  "comm-ann-03": {
    fields: { urgency: "normal", startDate: "2027-07-26", endDate: "2027-07-28" },
    attributes: { annType: "government", postedBy: "authority" },
    text: [["July 2026", "July 2027"]],
  },
  "community-sg-announce-01": {
    fields: { urgency: "normal", startDate: "2026-11-12", endDate: "2026-11-12" },
    attributes: { annType: "infra", postedBy: "member" },
  },
  "community-sg-announce-02": {
    fields: { urgency: "normal", startDate: "2026-11-20", endDate: "2026-11-20" },
    attributes: { annType: "community", postedBy: "member" },
  },

  // ── Child & Family Activities
  "community-in-childfamily-01": NEW_PARENTS,
  "community-in-childfamily-02": BABYSITTING_CIRCLE,
  "comm-child-01": {
    fields: { mode: "inperson" },
    attributes: { activityType: "playdate", ageGroup: ["baby", "3to5"], frequency: "weekly", startTime: "Tues & Thurs, 9:30–11:30 am", bookingNeeded: "no", priceUnit: "session" },
  },
  "comm-child-02": {
    fields: { mode: "inperson" },
    attributes: { activityType: "arts", ageGroup: ["3to5", "6to9", "10to12"], frequency: "weekly", startTime: "Fridays, 3:30–5 pm", bookingNeeded: "yes", priceUnit: "session" },
  },
  "comm-child-03": {
    fields: { mode: "inperson" },
    attributes: { activityType: "support", ageGroup: ["parents"], frequency: "monthly", startTime: "Last Saturday, 10 am – 12 pm", bookingNeeded: "no" },
  },
  "community-sg-childfamily-01": NEW_PARENTS,
  "community-sg-childfamily-02": BABYSITTING_CIRCLE,

  // ── General / Others
  "community-in-general-01": BOOK_CLUB,
  "community-in-general-02": carpool("Adyar", "OMR"),
  "comm-gen-01": {
    set: { category: "free_giveaway", subcategory: "general_free" },
    fields: { availability: "Weekends preferred" },
  },
  "comm-gen-02": { attributes: { topic: "swap", postType: "offering" } },
  "comm-gen-03": { attributes: { topic: "neighbourhood", postType: "asking" } },
  "community-sg-general-01": BOOK_CLUB,
  "community-sg-general-02": carpool("Toa Payoh", "Raffles Place"),
};

function isEmpty(value: unknown): boolean {
  return value == null || value === "" || (Array.isArray(value) && value.length === 0);
}

async function run() {
  const dryRun = process.argv.includes("--dry-run");
  await dbConnect();

  // Moved seeds have left Community, so they're found by adsId alone.
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
