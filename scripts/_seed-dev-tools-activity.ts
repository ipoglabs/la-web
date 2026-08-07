// Temporary — seeds a spread of ActivityLog entries for the most recently
// seeded dev-tools smoke users (see _seed-dev-tools-smoke.ts) so the Audit
// History tab has real diff/non-diff/actor data to page through across all
// four range buckets (24h/7d/30d/all).
// Run with: npx tsx --env-file=.env.local scripts/_seed-dev-tools-activity.ts

import dbConnect from "../src/lib/db";
import User from "../src/models/user";
import ActivityLog, { type ActivityAction } from "../src/models/ActivityLog";

const DAY = 24 * 60 * 60 * 1000;
const hoursAgo = (h: number) => new Date(Date.now() - h * 60 * 60 * 1000);
const daysAgo = (d: number) => new Date(Date.now() - d * DAY);

async function main() {
  await dbConnect();

  const smokeUsers = await User.find({ userId: /devtoolssmoke/ })
    .sort({ createdAt: -1 })
    .limit(2)
    .lean();

  const seller = smokeUsers.find((u) => u.userId.endsWith("-seller"));
  const buyer = smokeUsers.find((u) => u.userId.endsWith("-buyer"));

  if (!seller || !buyer) {
    console.error("No smoke seller/buyer found — run _seed-dev-tools-smoke.ts first.");
    process.exit(1);
  }

  const admin = await User.findOne({ email: "admin@lokalads.com" }).lean();

  type Entry = { userId: unknown; action: ActivityAction; metadata?: Record<string, unknown>; actorId?: unknown; createdAt: Date };

  const entries: Entry[] = [
    // Buyer — spread across all four range buckets, mix of diff and non-diff actions.
    { userId: buyer._id, action: "REGISTERED", metadata: { method: "credentials" }, createdAt: daysAgo(45) },
    { userId: buyer._id, action: "LOGIN", createdAt: daysAgo(20) },
    { userId: buyer._id, action: "EMAIL_CHANGED", metadata: { from: "old.buyer@example.com", to: buyer.email }, createdAt: daysAgo(10) },
    { userId: buyer._id, action: "LOGIN", createdAt: daysAgo(3) },
    { userId: buyer._id, action: "NAME_CHANGED", metadata: { from: "Test Buyer", to: buyer.fullName }, createdAt: hoursAgo(30) },
    { userId: buyer._id, action: "MESSAGE_SENT", metadata: { conversationId: "smoke-convo" }, createdAt: hoursAgo(5) },
    { userId: buyer._id, action: "LOGIN", createdAt: hoursAgo(1) },

    // Seller — includes an admin-actor moderation event to exercise the "By" column.
    { userId: seller._id, action: "REGISTERED", metadata: { method: "credentials" }, createdAt: daysAgo(40) },
    { userId: seller._id, action: "POST_CREATED", metadata: { title: "Smoke Test Listing (old bike)" }, createdAt: daysAgo(9) },
    ...(admin
      ? [{ userId: seller._id, action: "AD_APPROVED" as ActivityAction, metadata: { title: "Smoke Test Listing (old bike)" }, actorId: admin._id, createdAt: daysAgo(8) }]
      : []),
    { userId: seller._id, action: "PASSWORD_CHANGED", createdAt: daysAgo(2) },
    { userId: seller._id, action: "LOGIN", createdAt: hoursAgo(12) },
  ];

  const result = await ActivityLog.insertMany(entries);
  console.log(`Inserted ${result.length} ActivityLog entries.`);
  console.log(`Buyer:  ${buyer.userId} (${buyer._id})`);
  console.log(`Seller: ${seller.userId} (${seller._id})`);
  if (!admin) console.log("(No admin@lokalads.com found — skipped the actor-attributed AD_APPROVED entry.)");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  });
