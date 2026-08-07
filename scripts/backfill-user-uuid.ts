// scripts/backfill-user-uuid.ts
// Run with: npx tsx --env-file=.env.local scripts/backfill-user-uuid.ts
// Requires MONGODB_URI in your environment.
//
// One-off backfill for existing User documents created before the internal
// `uuid` field existed (src/models/user.ts) — new docs already get one from
// the schema's `default: randomUUID`. Random per-document values can't be
// generated inside a Mongo aggregation pipeline, so this loads ids only
// (uuid is `select: false`, and this query doesn't ask for it either) and
// assigns one per document via bulkWrite.

import { randomUUID } from "crypto";
import dbConnect from "../src/lib/db";
import User from "../src/models/user";

async function backfill() {
  await dbConnect();

  const missing = await User.find({ uuid: { $exists: false } })
    .select("_id")
    .lean();

  if (missing.length === 0) {
    console.log("No user documents are missing uuid.");
    return;
  }

  const ops = missing.map((doc) => ({
    updateOne: {
      filter: { _id: doc._id },
      update: { $set: { uuid: randomUUID() } },
    },
  }));

  const result = await User.bulkWrite(ops);
  console.log(`Matched ${missing.length}, modified ${result.modifiedCount} user document(s).`);
}

backfill()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Backfill failed:", err);
    process.exit(1);
  });
