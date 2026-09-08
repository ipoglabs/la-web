// scripts/backfill-lastLoginAt.ts
// Run with: npx tsx --env-file=.env.local scripts/backfill-lastLoginAt.ts
// Requires MONGODB_URI in your environment.
//
// One-off backfill for the `lastLoginAt` field on User (src/models/user.ts).
// Going forward every login stamps it via createUserSession() in
// lib/userSession.ts, but existing users have no value — which would make the
// dormant-nudge job (lib/jobs/dormant-nudge.job.ts) ignore them entirely.
//
// Seeds `lastLoginAt` from the most recent Session activity we have for each
// user: max(lastActiveAt, createdAt) across all their Session docs. Users with
// no Session at all fall back to their account creation date (User.createdAt)
// so they still enter the dormancy funnel rather than being invisible forever.
//
// Idempotent-ish: only fills users that don't already have `lastLoginAt`.
// Re-running after more logins have happened is safe (those users are skipped).

import dbConnect from "../src/lib/db";
import User from "../src/models/user";
import Session from "../src/models/session";

async function backfill() {
  await dbConnect();

  // Latest known activity per user, from the Session collection.
  const perUser = await Session.aggregate<{ _id: unknown; lastSeen: Date }>([
    {
      $group: {
        _id: "$userId",
        lastSeen: { $max: { $ifNull: ["$lastActiveAt", "$createdAt"] } },
      },
    },
  ]);

  const seen = new Map<string, Date>();
  for (const row of perUser) {
    if (row._id && row.lastSeen) seen.set(String(row._id), row.lastSeen);
  }

  const users = await User.find({ lastLoginAt: { $exists: false } })
    .select("_id createdAt")
    .lean<{ _id: unknown; createdAt?: Date }[]>();

  let fromSession = 0;
  let fromCreatedAt = 0;
  const ops = users.map((u) => {
    const sessionSeen = seen.get(String(u._id));
    const value = sessionSeen ?? u.createdAt ?? new Date();
    if (sessionSeen) fromSession++;
    else fromCreatedAt++;
    return {
      updateOne: {
        filter: { _id: u._id },
        update: { $set: { lastLoginAt: value } },
      },
    };
  });

  if (ops.length === 0) {
    console.log("Nothing to backfill — every user already has lastLoginAt.");
    return;
  }

  const result = await User.bulkWrite(ops, { ordered: false });
  console.log(
    `Backfilled lastLoginAt on ${result.modifiedCount}/${ops.length} user(s) — ` +
      `${fromSession} from Session activity, ${fromCreatedAt} from account creation date.`,
  );
}

backfill()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Backfill failed:", err);
    process.exit(1);
  });
