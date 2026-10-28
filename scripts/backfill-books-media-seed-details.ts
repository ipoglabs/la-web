// scripts/backfill-books-media-seed-details.ts
// Run with: npx tsx --env-file=.env.local scripts/backfill-books-media-seed-details.ts [--dry-run]
//
// One-off (2026-10-28): the Books, Media & Collectibles seed posts have only a
// title, a description and a price, so the reworked search filters had
// nothing to match. This fills, from each ad's own text, what the reworked
// forms ask: Type or Genre, Format, Condition (a Goldmine grade for vinyl),
// players and pieces for games, and Deal Method. Detail fields are only
// filled where empty, so it is safe to re-run.
//
// The Singapore copies of India's ads get a local detail. India's and
// Singapore's "Vintage Turntable" ads move to Electronics & Tech › TVs &
// Audio, filled in with that form's fields.

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

// Values are the Books, Media & Collectibles forms' (posting/form-schema/defaults/books-media.ts).
const DETAILS: Record<string, SeedDetails> = {
  // ── Books & Comics ──
  "media-book-01": { fields: { condition: "used" }, attributes: { quantity: 41, genre: "fiction", authorArtist: "Terry Pratchett", format: "set", language: "english", dealMethod: BOTH } },
  "media-book-02": { fields: { condition: "lightly-used" }, attributes: { quantity: 18, genre: "academic", authorArtist: "CGP / Oxford Revision Guides", format: "paperback", language: "english", dealMethod: BOTH } },
  "media-book-03": { fields: { condition: "lightly-used" }, attributes: { quantity: 60, genre: "comics", authorArtist: "Dark Horse", format: "issues", language: "english", dealMethod: BOTH } },
  "books-in-books-01": { fields: { condition: "lightly-used" }, attributes: { quantity: 10, genre: "fiction", format: "set", language: "english", dealMethod: BOTH } },
  "books-in-books-02": { fields: { condition: "lightly-used" }, attributes: { quantity: 15, genre: "comics", format: "issues", language: "english", dealMethod: BOTH } },
  "books-sg-books-01": {
    fields: { condition: "lightly-used" },
    attributes: { quantity: 10, genre: "fiction", format: "set", language: "english", dealMethod: BOTH },
    text: [["great starter collection.", "great starter collection. Meet at Bras Basah Complex."]],
  },
  "books-sg-books-02": {
    fields: { condition: "lightly-used" },
    attributes: { quantity: 15, genre: "comics", format: "issues", language: "english", dealMethod: BOTH },
    text: [["well preserved condition.", "well preserved condition. Mail islandwide."]],
  },

  // ── Vinyl Records ──
  "media-vinyl-01": { fields: { condition: "good-plus" }, attributes: { quantity: 120, genre: "rock", format: "collection", pressing: "original", dealMethod: MEETUP } },
  "media-vinyl-02": { fields: { condition: "vg-plus" }, attributes: { quantity: 1, genre: "rnb", authorArtist: "Sade", format: "lp", pressing: "original", sleeveGrade: "vg", dealMethod: BOTH } },
  "media-vinyl-03": { fields: { condition: "vg" }, attributes: { quantity: 200, genre: "rnb", format: "collection", pressing: "original", dealMethod: MEETUP } },
  "tech-tv-03": { fields: { condition: "vg-plus" }, attributes: { quantity: 200, genre: "rnb", format: "collection", pressing: "mixed", dealMethod: MEETUP } },
  "books-in-vinyl-01": { fields: { condition: "near-mint" }, attributes: { quantity: 1, genre: "rock", format: "lp", pressing: "original", dealMethod: BOTH } },
  "books-sg-vinyl-01": {
    fields: { condition: "near-mint" },
    attributes: { quantity: 1, genre: "rock", format: "lp", pressing: "original", dealMethod: BOTH },
    text: [["near mint condition, collector's item.", "near mint condition, collector's item. Meet at Esplanade MRT."]],
  },

  // ── DVDs & Blu-ray ──
  "media-dvd-01": { fields: { condition: "lightly-used" }, attributes: { quantity: 23, format: "bluray", genre: "action", dealMethod: BOTH } },
  "media-dvd-02": { fields: { condition: "like-new" }, attributes: { quantity: 11, format: "bluray", genre: "tv", dealMethod: BOTH } },
  "media-dvd-03": { fields: { condition: "used" }, attributes: { quantity: 150, format: "dvd", genre: "world", dealMethod: MEETUP } },
  "books-in-dvd-01": { fields: { condition: "like-new" }, attributes: { quantity: 3, format: "bluray", genre: "action", dealMethod: BOTH } },
  "books-in-dvd-02": { fields: { condition: "used" }, attributes: { quantity: 20, format: "dvd", genre: "other", dealMethod: BOTH } },
  "books-sg-dvd-01": {
    fields: { condition: "like-new" },
    attributes: { quantity: 3, format: "bluray", genre: "action", dealMethod: BOTH },
    text: [["special features and artwork.", "special features and artwork. Meet at Bugis MRT."]],
  },
  "books-sg-dvd-02": {
    fields: { condition: "used" },
    attributes: { quantity: 20, format: "dvd", genre: "other", dealMethod: BOTH },
    text: [["all in working condition.", "all in working condition. Mail islandwide."]],
  },

  // ── Board Games & Puzzles ──
  "media-game-01": { fields: { condition: "like-new" }, attributes: { itemType: "board_game", brand: "Catan Studio", players: "4up", ageGroup: "10+", complete: "yes", dealMethod: BOTH } },
  "media-game-02": { fields: { condition: "lightly-used" }, attributes: { itemType: "board_game", brand: "Cephalofair Games", players: "2_4", ageGroup: "14+", complete: "yes", dealMethod: BOTH } },
  "media-game-03": { fields: { condition: "new" }, attributes: { itemType: "puzzle", brand: "Jumbo", pieces: "1000", complete: "yes", dealMethod: BOTH } },
  "books-in-board-01": { fields: { condition: "lightly-used" }, attributes: { itemType: "board_game", players: "2_4", ageGroup: "12+", complete: "yes", dealMethod: BOTH } },
  "books-in-board-02": { fields: { condition: "new" }, attributes: { itemType: "puzzle", pieces: "1000", complete: "yes", dealMethod: BOTH } },
  "books-sg-board-01": {
    fields: { condition: "lightly-used" },
    attributes: { itemType: "board_game", players: "2_4", ageGroup: "12+", complete: "yes", dealMethod: BOTH },
    text: [["all pieces included.", "all pieces included. Meet at Tampines Hub."]],
  },
  "books-sg-board-02": {
    fields: { condition: "new" },
    attributes: { itemType: "puzzle", pieces: "1000", complete: "yes", dealMethod: BOTH },
    text: [["unopened box.", "unopened box. Mail islandwide."]],
  },

  // ── Collectibles & Memorabilia ──
  "media-coll-01": { fields: { condition: "lightly-used" }, attributes: { quantity: 66, itemType: "coins", era: "To 2025", dealMethod: BOTH } },
  "media-coll-02": { fields: { condition: "used" }, attributes: { quantity: 8, itemType: "sports", era: "1966", dealMethod: BOTH } },
  "media-coll-03": { fields: { condition: "lightly-used" }, attributes: { quantity: 1, itemType: "toys", era: "2007", dealMethod: MEETUP } },
  "books-in-collect-01": { fields: { condition: "lightly-used" }, attributes: { quantity: 25, itemType: "coins", dealMethod: BOTH } },
  "books-in-collect-02": { fields: { condition: "like-new" }, attributes: { quantity: 1, itemType: "sports", authenticated: "yes", dealMethod: MEETUP } },
  "books-sg-collect-01": {
    fields: { condition: "lightly-used" },
    attributes: { quantity: 25, itemType: "coins", dealMethod: BOTH },
    text: [["presented in a collector's album.", "presented in a collector's album. Meet at Chinatown MRT."]],
  },
  "books-sg-collect-02": {
    fields: { condition: "like-new" },
    attributes: { quantity: 1, itemType: "sports", authenticated: "yes", dealMethod: MEETUP },
    text: [["great collector's item.", "great collector's item. Self-collect from Serangoon."]],
  },
};

/** Seed ads filed in the wrong place: adsId → where they belong, with that form's details. */
const MOVES: Record<string, { category: string; subcategory: string; details: SeedDetails }> = {
  // Turntables are hi-fi kit (Electronics & Tech › TVs & Audio), not records.
  "books-in-vinyl-02": { category: "electronics_tech", subcategory: "tvs_audio", details: { fields: { condition: "lightly-used" }, attributes: { itemType: "hifi", dealMethod: BOTH } } },
  "books-sg-vinyl-02": {
    category: "electronics_tech",
    subcategory: "tvs_audio",
    details: { fields: { condition: "lightly-used" }, attributes: { itemType: "hifi", dealMethod: MEETUP }, text: [["fully functional and cleaned.", "fully functional and cleaned. Self-collect from Queenstown."]] },
  },
};

function isEmpty(value: unknown): boolean {
  return value == null || value === "" || (Array.isArray(value) && value.length === 0);
}

/** The fields `details` fills on `post`: empty detail fields, and the text swaps. */
function detailsSet(post: object, details: SeedDetails): Record<string, unknown> {
  const doc = post as Record<string, unknown> & { attributes?: Record<string, unknown> };
  const $set: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(details.fields ?? {})) {
    if (isEmpty(doc[key])) $set[key] = value;
  }
  for (const [key, value] of Object.entries(details.attributes ?? {})) {
    if (isEmpty(doc.attributes?.[key])) $set[`attributes.${key}`] = value;
  }
  for (const key of ["name", "description"] as const) {
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

  for (const [id, { details, ...to }] of Object.entries(MOVES)) {
    const post = await Post.findOne({ adsId: id, category: "books_media_collectibles" }).lean();
    if (!post) continue;
    const $set = { ...to, ...detailsSet(post, details) };
    console.log(`${id}: ${dryRun ? "would move" : "moved"} ${post.subcategory} → ${to.category} / ${to.subcategory} ${JSON.stringify({ $set })}`);
    if (!dryRun) await Post.updateOne({ _id: post._id }, { $set });
  }

  const posts = await Post.find({ category: "books_media_collectibles", adsId: { $in: Object.keys(DETAILS) } }).lean();
  const found = new Set(posts.map((p) => p.adsId));
  for (const id of Object.keys(DETAILS)) if (!found.has(id)) console.log(`${id}: no post`);

  for (const post of posts) {
    const id = post.adsId!;
    const details = DETAILS[id];
    const $set = detailsSet(post, details);

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
