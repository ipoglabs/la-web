// scripts/backfill-tickets-vouchers-seed-details.ts
// Run with: npx tsx --env-file=.env.local scripts/backfill-tickets-vouchers-seed-details.ts [--dry-run]
//
// One-off (2026-10-28): the Tickets & Vouchers seed posts have only a title, a
// description and a price, so the reworked search filters had nothing to
// match, and the reworked search drops events without a date. This fills,
// from each ad's own text, what the reworked forms ask: the kind of event,
// sport, retailer, activity or voucher; the event date, venue, number of
// tickets and seats; the voucher's provider, value and Valid Until. Detail
// fields are only filled where empty, so it is safe to re-run.
//
// The UK ads dated earlier in 2026 move to the 2027 edition (Glastonbury
// didn't run in 2026). India's and Singapore's generic ads get a venue or
// provider and a date. Two UK ads change so they're lawful to sell: the
// Arsenal tickets are listed on the club's exchange (football tickets can
// only be resold through the club), and the London Marathon place, which
// can't be transferred, becomes two grandstand seats at the finish.

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
  /** Post model paths replaced outright (an ad rewritten). */
  set?: Record<string, unknown>;
}

// Values are the Tickets & Vouchers forms' (posting/form-schema/defaults/tickets-vouchers.ts).
const DETAILS: Record<string, SeedDetails> = {
  // ── Event Tickets ──
  "tick-evt-01": {
    fields: { startDate: "2027-06-23", endDate: "2027-06-27" },
    attributes: { itemType: "festival", venue: "Worthy Farm, Pilton, Somerset", quantity: 1, seating: "standing", seatDetails: "General admission with camping", transferMethod: "official", restrictions: "Photo-registered ticket; changes through the official resale only", faceValue: 290 },
    text: [["Glastonbury 2026", "Glastonbury 2027"]],
  },
  "tick-evt-02": {
    fields: { startDate: "2027-07-04" },
    attributes: { itemType: "music", venue: "Hyde Park, London", quantity: 2, seating: "standing", seatDetails: "Tier 1 General Admission floor", transferMethod: "official", faceValue: 185 },
    text: [["4 Jul 2026", "4 Jul 2027"], ["4 July 2026", "4 July 2027"]],
  },
  "tick-evt-03": {
    fields: { startDate: "2027-09-12" },
    attributes: { itemType: "music", venue: "The O2, London", quantity: 1, seating: "standing", seatDetails: "Standing, Block A2", transferMethod: "official", faceValue: 75 },
    text: [["12 September 2026", "12 September 2027"]],
  },
  "tickets-in-event-01": {
    fields: { startDate: "2027-02-20", endDate: "2027-02-21" },
    attributes: { itemType: "festival", venue: "Mahalaxmi Racecourse, Mumbai", quantity: 2, seating: "standing", seatDetails: "Front row, standing", transferMethod: "eticket" },
    text: [["transferable e-tickets.", "transferable e-tickets, for 20–21 February 2027 at Mahalaxmi Racecourse, Mumbai."]],
  },
  "tickets-in-event-02": {
    fields: { startDate: "2027-03-13" },
    attributes: { itemType: "comedy", venue: "Comedy club, Bandra, Mumbai", quantity: 1, seating: "seated", transferMethod: "eticket" },
    text: [["valid for this weekend.", "on Saturday 13 March 2027 at a comedy club in Bandra, Mumbai."]],
  },
  "tickets-sg-event-01": {
    fields: { startDate: "2027-02-20", endDate: "2027-02-21" },
    attributes: { itemType: "festival", venue: "Fort Canning Park, Singapore", quantity: 2, seating: "standing", seatDetails: "Front row, standing", transferMethod: "eticket" },
    text: [["transferable e-tickets.", "transferable e-tickets, for 20–21 February 2027 at Fort Canning Park."]],
  },
  "tickets-sg-event-02": {
    fields: { startDate: "2027-03-13" },
    attributes: { itemType: "comedy", venue: "Comedy club, Robertson Quay, Singapore", quantity: 1, seating: "seated", transferMethod: "eticket" },
    text: [["valid for this weekend.", "on Saturday 13 March 2027 at a comedy club on Robertson Quay."]],
  },

  // ── Sport Tickets ──
  "tick-sport-01": {
    fields: { startDate: "2027-03-13" },
    attributes: { itemType: "football", venue: "Emirates Stadium, London", quantity: 2, seating: "seated", seatDetails: "North Lower Block 8, Row 22, Seats 14–15", transferMethod: "official", restrictions: "Sold through Arsenal's Ticket Exchange; buyer needs an Arsenal membership", faceValue: 120 },
    text: [
      ["15 Aug 2026", "13 Mar 2027"],
      ["15 August 2026", "13 March 2027"],
      ["Face value. Friend pulled out last minute — need to sell as pair.", "Face value, listed on Arsenal's official Ticket Exchange — message me for the listing (you'll need an Arsenal membership to buy). Friend pulled out last minute — selling as a pair."],
    ],
  },
  "tick-sport-02": {
    fields: { startDate: "2027-07-08" },
    attributes: { itemType: "tennis", venue: "All England Club, Wimbledon", quantity: 1, seating: "hospitality", seatDetails: "Centre Court debenture seat, Row N", transferMethod: "paper", restrictions: "Debenture ticket: includes debenture lounge access", faceValue: 280 },
    text: [
      ["Wimbledon 2026 Day 10", "Wimbledon 2027 Day 11"],
      ["Wimbledon 2026 Centre Court Debenture ticket — Day 10</strong> (Ladies' Semi-finals + Men's Quarter-finals)", "Wimbledon 2027 Centre Court Debenture ticket — Day 11</strong> (Ladies' Semi-finals, Thursday 8 July)"],
    ],
  },
  "tick-sport-03": {
    fields: { startDate: "2027-04-25" },
    attributes: { itemType: "other", venue: "The Mall, London", quantity: 2, seating: "seated", seatDetails: "Grandstand, The Mall finish", transferMethod: "eticket", faceValue: 90 },
    set: {
      name: "TCS London Marathon 2027 — 2 Grandstand Seats at The Mall Finish",
      description: "<p>Two <strong>TCS London Marathon 2027 grandstand seats</strong> at The Mall finish — Sunday 25 April 2027, reserved seats opposite the finish line, ideal for cheering a runner home. Our runner has deferred to 2028, so we no longer need them. E-tickets sent by email. £90 each, face value.</p>",
      salePrice: 90,
    },
  },
  "tickets-in-sport-01": {
    fields: { startDate: "2027-01-23" },
    attributes: { itemType: "cricket", venue: "Wankhede Stadium, Mumbai", quantity: 2, seating: "seated", seatDetails: "Premium stand", transferMethod: "eticket" },
    text: [["great view of the pitch.", "great view of the pitch. Wankhede Stadium, Mumbai, Saturday 23 January 2027."]],
  },
  "tickets-in-sport-02": {
    fields: { startDate: "2027-01-17" },
    attributes: { itemType: "football", venue: "Salt Lake Stadium, Kolkata", quantity: 1, seating: "seated", transferMethod: "paper" },
    text: [["valid this month.", "on Sunday 17 January 2027 at the Salt Lake Stadium, Kolkata."]],
  },
  "tickets-sg-sport-01": {
    fields: { startDate: "2027-01-23" },
    attributes: { itemType: "football", venue: "Jalan Besar Stadium, Singapore", quantity: 2, seating: "seated", seatDetails: "Premium stand", transferMethod: "eticket" },
    text: [["great view of the pitch.", "great view of the pitch. Jalan Besar Stadium, Saturday 23 January 2027."]],
  },
  "tickets-sg-sport-02": {
    fields: { startDate: "2027-01-17" },
    attributes: { itemType: "rugby", venue: "National Stadium, Singapore", quantity: 1, seating: "seated", transferMethod: "eticket" },
    text: [["valid this month.", "on Sunday 17 January 2027 at the National Stadium."]],
  },

  // ── Gift Cards ──
  "tick-gift-01": { attributes: { brand: "John Lewis", itemType: "general", format: "physical", faceValue: 250 } },
  "tick-gift-02": { attributes: { brand: "Amazon UK", itemType: "general", format: "digital", faceValue: 100 } },
  "tick-gift-03": { attributes: { brand: "Tastecard", itemType: "food", format: "digital", faceValue: 34.99 } },
  "tickets-in-gift-01": {
    fields: { deadline: "2027-10-31" },
    attributes: { brand: "Phoenix Marketcity", itemType: "general", format: "physical", faceValue: 2000 },
    text: [["valid for 1 year.", "valid at Phoenix Marketcity, Mumbai, until October 2027."]],
  },
  "tickets-in-gift-02": {
    attributes: { brand: "Mainland China", itemType: "food", format: "physical", faceValue: 1000 },
    text: [["valid at all locations.", "valid at all Mainland China restaurants."]],
  },
  "tickets-sg-gift-01": {
    fields: { deadline: "2027-10-31" },
    attributes: { brand: "CapitaLand (CapitaVoucher)", itemType: "general", format: "physical", faceValue: 50 },
    text: [["valid for 1 year.", "valid at any CapitaLand mall until October 2027."]],
  },
  "tickets-sg-gift-02": {
    attributes: { brand: "Imperial Treasure", itemType: "food", format: "physical", faceValue: 25 },
    text: [["valid at all locations.", "valid at all Imperial Treasure restaurants."]],
  },

  // ── Experience Days ──
  "tick-exp-01": { fields: { providerName: "Silverstone Experiences", deadline: "2027-12-31" }, attributes: { itemType: "driving", forPeople: "1", format: "e_voucher" } },
  "tick-exp-02": { fields: { providerName: "Virgin Experience Days", deadline: "2028-03-31" }, attributes: { itemType: "flying", forPeople: "2", format: "e_voucher" } },
  "tick-exp-03": { fields: { providerName: "The Savoy", deadline: "2027-04-30" }, attributes: { itemType: "dining", forPeople: "2", format: "e_voucher", faceValue: 145 } },
  "tickets-in-exp-01": {
    fields: { providerName: "Sky Waltz", deadline: "2027-04-30" },
    attributes: { itemType: "flying", forPeople: "2", format: "e_voucher" },
    text: [["valid for 6 months.", "valid until April 2027, flying over Jaipur."]],
  },
  "tickets-in-exp-02": {
    fields: { deadline: "2027-03-31" },
    attributes: { itemType: "spa", forPeople: "1", format: "physical" },
    text: [["valid for 3 months.", "valid until March 2027 at a day spa in Bandra, Mumbai."]],
  },
  "tickets-sg-exp-01": {
    fields: { deadline: "2027-04-30" },
    attributes: { itemType: "flying", forPeople: "2", format: "e_voucher" },
    text: [["valid for 6 months.", "valid until April 2027, departing Seletar Airport."]],
  },
  "tickets-sg-exp-02": {
    fields: { deadline: "2027-03-31" },
    attributes: { itemType: "spa", forPeople: "1", format: "physical" },
    text: [["valid for 3 months.", "valid until March 2027 at a Sentosa resort spa."]],
  },

  // ── Travel Vouchers ──
  "tick-trav-01": {
    fields: { providerName: "Eurostar", destination: "short_haul", startDate: "2027-07-10" },
    attributes: { itemType: "rail", nameChange: "yes", format: "booking", faceValue: 180 },
    text: [["10/14 Jul 2026", "10/14 Jul 2027"], ["14 July return 2026", "14 July return 2027"]],
  },
  "tick-trav-02": { fields: { providerName: "British Airways", destination: "worldwide" }, attributes: { itemType: "flight", format: "e_voucher", faceValue: 300 } },
  "tick-trav-03": { fields: { providerName: "Premier Inn", destination: "domestic", deadline: "2027-12-31" }, attributes: { itemType: "hotel", format: "e_voucher" } },
  "tickets-in-travel-01": {
    fields: { providerName: "Novotel Goa Resort", destination: "domestic", deadline: "2027-10-31" },
    attributes: { itemType: "hotel", format: "e_voucher" },
    text: [["valid for 1 year,", "valid until October 2027,"]],
  },
  "tickets-in-travel-02": {
    fields: { providerName: "IndiGo", destination: "domestic", deadline: "2027-06-30" },
    attributes: { itemType: "flight", format: "e_voucher", faceValue: 5000 },
    text: [["expires in 8 months.", "valid until June 2027."]],
  },
  "tickets-sg-travel-01": {
    fields: { providerName: "Club Med Bintan Island", destination: "short_haul", deadline: "2027-10-31" },
    attributes: { itemType: "hotel", format: "e_voucher" },
    text: [["valid for 1 year,", "valid until October 2027,"]],
  },
  "tickets-sg-travel-02": {
    fields: { providerName: "Scoot", destination: "short_haul", deadline: "2027-06-30" },
    attributes: { itemType: "flight", format: "e_voucher", faceValue: 150 },
    text: [["expires in 8 months.", "valid until June 2027."]],
  },
};

function isEmpty(value: unknown): boolean {
  return value == null || value === "" || (Array.isArray(value) && value.length === 0);
}

/** The fields `details` fills on `post`: empty detail fields, rewrites, and the text swaps. */
function detailsSet(post: object, details: SeedDetails): Record<string, unknown> {
  const doc = post as Record<string, unknown> & { attributes?: Record<string, unknown> };
  const $set: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(details.fields ?? {})) {
    if (isEmpty(doc[key])) $set[key] = value;
  }
  for (const [key, value] of Object.entries(details.attributes ?? {})) {
    if (isEmpty(doc.attributes?.[key])) $set[`attributes.${key}`] = value;
  }
  for (const [key, value] of Object.entries(details.set ?? {})) {
    if (doc[key] !== value) $set[key] = value;
  }
  for (const key of ["name", "description"] as const) {
    if (details.set?.[key] !== undefined) continue;
    const before = (doc[key] as string | undefined) ?? "";
    // A swap whose result is already there was applied on an earlier run.
    const after = (details.text ?? []).reduce((s, [from, to]) => (s.includes(to) ? s : s.split(from).join(to)), before);
    if (after !== before) $set[key] = after;
  }
  return $set;
}

async function run() {
  const dryRun = process.argv.includes("--dry-run");
  await dbConnect();

  const posts = await Post.find({ category: "tickets_vouchers", adsId: { $in: Object.keys(DETAILS) } }).lean();
  const found = new Set(posts.map((p) => p.adsId));
  for (const id of Object.keys(DETAILS)) if (!found.has(id)) console.log(`${id}: no post`);

  for (const post of posts) {
    const id = post.adsId!;
    const $set = detailsSet(post, DETAILS[id]);
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
