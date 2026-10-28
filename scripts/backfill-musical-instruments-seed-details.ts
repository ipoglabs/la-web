// scripts/backfill-musical-instruments-seed-details.ts
// Run with: npx tsx --env-file=.env.local scripts/backfill-musical-instruments-seed-details.ts [--dry-run]
//
// One-off (2026-10-28): the Musical Instruments seed posts have only a title,
// a description and a price, so the reworked search filters had nothing to
// match. This fills, from each ad's own text, what the reworked forms ask:
// Type, Brand, Model, Condition, Deal Method, and the details each sub asks
// (keys, size, strings…). Detail fields are only filled where empty, so it is
// safe to re-run.
//
// India's and Singapore's generic guitars get a brand and model, as the
// Guitars form now requires one, and the Singapore copies of India's ads get
// a local detail.

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
const MEETUP = ["meetup"];

// Values are the Musical Instruments forms' (posting/form-schema/defaults/musical-instruments.ts).
const DETAILS: Record<string, SeedDetails> = {
  // ── Guitars & Bass ──
  "music-guitar-01": { fields: { condition: "lightly-used", model: "Player Stratocaster" }, attributes: { itemType: "electric", brand: "fender", strings: "6", leftHanded: "no", included: "Locking tuners fitted", dealMethod: BOTH } },
  "music-guitar-02": { fields: { condition: "lightly-used", model: "D-10E" }, attributes: { itemType: "electro_acoustic", brand: "martin", strings: "6", leftHanded: "no", included: "Hard case", dealMethod: BOTH } },
  "music-guitar-03": { fields: { condition: "like-new", model: "Pacifica 112V" }, attributes: { itemType: "electric", brand: "yamaha", strings: "6", leftHanded: "no", included: "15W amp, lead, stand, tuner, strap", dealMethod: BOTH } },
  "music-in-guitar-01": {
    fields: { condition: "lightly-used", model: "FS800" },
    attributes: { itemType: "acoustic", brand: "yamaha", strings: "6", leftHanded: "no", included: "Gig bag", dealMethod: BOTH },
    text: [["Acoustic Guitar — Solid Top", "Yamaha FS800 Acoustic — Solid Top"], ["Solid top acoustic guitar", "Yamaha FS800 solid top acoustic guitar"]],
  },
  "music-in-guitar-02": {
    fields: { condition: "lightly-used", model: "GSR180" },
    attributes: { itemType: "bass", brand: "ibanez", strings: "4", leftHanded: "no", included: "Practice amp", dealMethod: BOTH },
    text: [["4-String Electric Bass Guitar — With Amp", "Ibanez GSR180 4-String Bass — With Amp"], ["4-string electric bass guitar bundled", "4-string Ibanez GSR180 bass guitar bundled"]],
  },
  "music-sg-guitar-01": {
    fields: { condition: "lightly-used", model: "Earth 70" },
    attributes: { itemType: "acoustic", brand: "cort", strings: "6", leftHanded: "no", included: "Gig bag", dealMethod: BOTH },
    text: [
      ["Acoustic Guitar — Solid Top", "Cort Earth 70 Acoustic — Solid Top"],
      ["Solid top acoustic guitar", "Cort Earth 70 solid top acoustic guitar"],
      ["includes padded gig bag for transport.", "includes padded gig bag for transport. Meet at Bishan MRT; happy for you to play it first."],
    ],
  },
  "music-sg-guitar-02": {
    fields: { condition: "lightly-used", model: "Affinity Precision Bass" },
    attributes: { itemType: "bass", brand: "squier", strings: "4", leftHanded: "no", included: "Practice amp", dealMethod: BOTH },
    text: [
      ["4-String Electric Bass Guitar — With Amp", "Squier Affinity P-Bass — With Amp"],
      ["4-string electric bass guitar bundled", "4-string Squier Affinity Precision Bass bundled"],
      ["great for beginners.", "great for beginners. Collect from Tampines; the amp has a local three-pin plug."],
    ],
  },

  // ── Keyboards & Piano ──
  "music-keys-01": { fields: { condition: "like-new", model: "RD-88" }, attributes: { itemType: "stage", brand: "Roland", keys: "88", weighted: "yes", dealMethod: BOTH } },
  "music-keys-02": { fields: { condition: "like-new", model: "P-125" }, attributes: { itemType: "digital", brand: "Yamaha", keys: "88", weighted: "yes", dealMethod: BOTH } },
  "music-keys-03": { fields: { condition: "like-new", model: "Stage 3 88" }, attributes: { itemType: "stage", brand: "Nord", keys: "88", weighted: "yes", dealMethod: BOTH } },
  "music-in-keys-01": { fields: { condition: "lightly-used" }, attributes: { itemType: "digital", keys: "88", weighted: "yes", dealMethod: MEETUP } },
  "music-in-keys-02": { fields: { condition: "lightly-used" }, attributes: { itemType: "keyboard", keys: "61", weighted: "no", dealMethod: BOTH } },
  "music-sg-keys-01": {
    fields: { condition: "lightly-used" },
    attributes: { itemType: "digital", keys: "88", weighted: "yes", dealMethod: MEETUP },
    text: [["includes matching stand.", "includes matching stand. Self-collect from a Clementi HDB; it needs two people to carry."]],
  },
  "music-sg-keys-02": {
    fields: { condition: "lightly-used" },
    attributes: { itemType: "keyboard", keys: "61", weighted: "no", dealMethod: BOTH },
    text: [["great for beginners.", "great for beginners. Meet at Toa Payoh or mail islandwide."]],
  },

  // ── Drums & Percussion ──
  "music-drum-01": { fields: { condition: "lightly-used", model: "Export EXX" }, attributes: { itemType: "acoustic", brand: "Pearl", pieces: "5-piece: 22\" bass, 10\"/12\" toms, 16\" floor, 14\" snare", dealMethod: MEETUP } },
  "music-drum-02": { fields: { condition: "lightly-used", model: "TD-07DMK" }, attributes: { itemType: "electronic", brand: "Roland", dealMethod: MEETUP } },
  "music-drum-03": { fields: { condition: "used", model: "A Custom" }, attributes: { itemType: "cymbals", brand: "Zildjian", pieces: "14\" hi-hats, 16\" crash, 20\" ride", dealMethod: BOTH } },
  "music-in-drums-01": { fields: { condition: "lightly-used" }, attributes: { itemType: "acoustic", pieces: "5-piece with cymbals and throne", dealMethod: MEETUP } },
  "music-in-drums-02": { fields: { condition: "lightly-used" }, attributes: { itemType: "indian", dealMethod: BOTH } },
  "music-sg-drums-01": {
    fields: { condition: "lightly-used" },
    attributes: { itemType: "acoustic", pieces: "5-piece with cymbals and throne", dealMethod: MEETUP },
    text: [["drummer's throne included.", "drummer's throne included. Self-collect from Yishun; played in a soundproofed room."]],
  },
  "music-sg-drums-02": {
    fields: { condition: "lightly-used" },
    attributes: { itemType: "indian", dealMethod: BOTH },
    text: [["includes carrying bag.", "includes carrying bag. Bought in Little India; tuning hammer included."]],
  },

  // ── DJ & Audio Gear ──
  "music-dj-01": { fields: { condition: "like-new", model: "DDJ-800" }, attributes: { itemType: "controller", brand: "Pioneer DJ", dealMethod: BOTH } },
  "music-dj-02": { fields: { condition: "lightly-used", model: "SL-1200MK2 pair + Vestax PMC-05 Pro III" }, attributes: { itemType: "turntable", brand: "Technics", dealMethod: MEETUP } },
  "music-dj-03": { fields: { condition: "new", model: "Scarlett 2i2 Studio Gen 4" }, attributes: { itemType: "interface", brand: "Focusrite", dealMethod: BOTH } },
  "music-in-dj-01": { fields: { condition: "lightly-used" }, attributes: { itemType: "controller", dealMethod: BOTH } },
  "music-in-dj-02": { fields: { condition: "lightly-used" }, attributes: { itemType: "speakers", dealMethod: MEETUP } },
  "music-sg-dj-01": {
    fields: { condition: "lightly-used" },
    attributes: { itemType: "controller", dealMethod: BOTH },
    text: [["great for beginners and semi-pros.", "great for beginners and semi-pros. Meet at Clarke Quay MRT."]],
  },
  "music-sg-dj-02": {
    fields: { condition: "lightly-used" },
    attributes: { itemType: "speakers", dealMethod: MEETUP },
    text: [["ideal for events and gigs.", "ideal for events and gigs. Self-collect from Jurong West."]],
  },

  // ── Wind, Brass & Strings ──
  "music-wind-01": { fields: { condition: "lightly-used", model: "YFL-222" }, attributes: { itemType: "flute", brand: "Yamaha", pitch: "C", dealMethod: BOTH } },
  "music-wind-02": { fields: { condition: "like-new", model: "Prelude CL711" }, attributes: { itemType: "clarinet", brand: "Conn-Selmer", pitch: "Bb", dealMethod: BOTH } },
  "music-wind-03": { fields: { condition: "lightly-used", size: "3/4" }, attributes: { itemType: "violin", dealMethod: BOTH } },
  "music-in-wind-01": { fields: { condition: "lightly-used", size: "4/4" }, attributes: { itemType: "violin", dealMethod: BOTH } },
  "music-in-wind-02": { fields: { condition: "like-new" }, attributes: { itemType: "bansuri", dealMethod: BOTH } },
  "music-sg-wind-01": {
    fields: { condition: "lightly-used", size: "4/4" },
    attributes: { itemType: "violin", dealMethod: BOTH },
    text: [["suitable for students and intermediate players.", "suitable for students and intermediate players. Used for SYF practice; meet at Dhoby Ghaut."]],
  },
  "music-sg-wind-02": {
    fields: { condition: "like-new" },
    attributes: { itemType: "bansuri", dealMethod: BOTH },
    text: [["suitable for performances.", "suitable for performances. Mail islandwide."]],
  },

  // ── Accessories ──
  "music-acc-01": { fields: { condition: "lightly-used" }, attributes: { itemType: "sheet_music", forInstrument: "keys", brand: "ABRSM", dealMethod: BOTH } },
  "music-acc-02": { fields: { condition: "lightly-used" }, attributes: { itemType: "stands", forInstrument: "guitar", brand: "Hercules", dealMethod: MEETUP } },
  "music-acc-03": { fields: { condition: "lightly-used" }, attributes: { itemType: "stands", forInstrument: "general", brand: "K&M", dealMethod: BOTH } },
  "music-in-acc-01": { fields: { condition: "new" }, attributes: { itemType: "strings", forInstrument: "guitar", dealMethod: BOTH } },
  "music-in-acc-02": { fields: { condition: "lightly-used" }, attributes: { itemType: "cases", forInstrument: "guitar", dealMethod: BOTH } },
  "music-sg-acc-01": {
    fields: { condition: "new" },
    attributes: { itemType: "strings", forInstrument: "guitar", dealMethod: BOTH },
    text: [["suitable for acoustic and electric guitars.", "suitable for acoustic and electric guitars. Mail islandwide."]],
  },
  "music-sg-acc-02": {
    fields: { condition: "lightly-used" },
    attributes: { itemType: "cases", forInstrument: "guitar", dealMethod: BOTH },
    text: [["fits dreadnought-size acoustic guitars.", "fits dreadnought-size acoustic guitars. Collect at Peace Centre."]],
  },
};

function isEmpty(value: unknown): boolean {
  return value == null || value === "" || (Array.isArray(value) && value.length === 0);
}

async function run() {
  const dryRun = process.argv.includes("--dry-run");
  await dbConnect();

  const posts = await Post.find({ category: "musical_instruments", adsId: { $in: Object.keys(DETAILS) } }).lean();
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
