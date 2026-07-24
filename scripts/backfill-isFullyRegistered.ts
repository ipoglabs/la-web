// scripts/backfill-isFullyRegistered.ts
// Run with: npx tsx --env-file=.env.local scripts/backfill-isFullyRegistered.ts
// Requires MONGODB_URI in your environment.
//
// One-off backfill for existing User documents created before the
// isFullyRegistered field existed (src/models/user.ts) — new/updated docs
// already get it set by the pre-validate hook there. Uses an aggregation
// pipeline update so it runs entirely in Mongo (no documents loaded into
// Node, no Mongoose validation re-run against legacy docs) — the boolean
// logic here must be kept identical to that hook's.

import dbConnect from "../src/lib/db";
import User from "../src/models/user";

async function backfill() {
  await dbConnect();

  const isSet = (field: string) => ({
    $and: [{ $ne: [`$${field}`, null] }, { $ne: [`$${field}`, ""] }],
  });

  const result = await User.updateMany(
    {},
    [
      {
        $set: {
          isFullyRegistered: {
            $and: [
              isSet("email"),
              isSet("primaryNumber"),
              { $ne: ["$dateOfBirth", null] },
              isSet("locality"),
            ],
          },
        },
      },
    ],
    { updatePipeline: true }
  );

  console.log(`Matched ${result.matchedCount}, modified ${result.modifiedCount} user document(s).`);
}

backfill()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Backfill failed:", err);
    process.exit(1);
  });
