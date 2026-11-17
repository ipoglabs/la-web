/**
 * app/api/internal/listing-moderated/route.ts
 *
 * Called by the back office (lokalads-bo) right after a moderator rejects an
 * ad, so the seller is emailed the reason instead of only finding out if they
 * open My Ads. The emails themselves stay here, in the one email engine.
 *
 * Auth: `Authorization: Bearer $BO_NOTIFY_SECRET` (set in this project AND in
 * lokalads-bo, Production only). It is its own secret, separate from
 * CRON_SECRET / INTERNAL_SECRET, so a leak of one doesn't open the others.
 *
 * Body: { "postId": "<Mongo _id>" }. Everything else (status, reason, seller
 * address) is read from the database, so even a leaked secret can only send a
 * TRUE rejection notice, and at most once per rejection: rejectionEmailSentAt
 * is claimed atomically before sending (the back office clears it whenever the
 * ad's status changes again).
 *
 * Responses: 200 { sent: true } | 200 { sent: false, skipped: "<why>" } |
 * 401 bad secret | 400 bad body | 502 the email provider failed (claim released,
 * so a retry can send).
 */

import { timingSafeEqual } from "crypto";
import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import Post from "@/models/post";
import User from "@/models/user";
import { isEmailMutedUser } from "@/lib/emailMutedUsers";
import { sendListingStatusEmail } from "@/lib/listings/sendListingStatusEmail";

function authorised(req: Request): boolean {
  const secret = process.env.BO_NOTIFY_SECRET;
  if (!secret || secret.length < 32) return false;
  const given = (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
  const a = Buffer.from(given);
  const b = Buffer.from(secret);
  return a.length === b.length && timingSafeEqual(a, b);
}

const json = (body: unknown, status = 200) => Response.json(body, { status });

export async function POST(req: Request) {
  if (!authorised(req)) return json({ error: "unauthorised" }, 401);

  const body = (await req.json().catch(() => null)) as { postId?: unknown } | null;
  const postId = typeof body?.postId === "string" ? body.postId : "";
  if (!mongoose.Types.ObjectId.isValid(postId)) return json({ error: "postId required" }, 400);

  await dbConnect();

  // Claim the notice first so two calls can't both send.
  const post = await Post.findOneAndUpdate(
    { _id: postId, status: "rejected", rejectionEmailSentAt: { $exists: false } },
    { $set: { rejectionEmailSentAt: new Date() } },
    { new: true, projection: { name: 1, adsId: 1, rejectionReason: 1, ownerId: 1, "seller_info.email": 1 } },
  ).lean();

  if (!post) {
    const exists = await Post.exists({ _id: postId });
    return json({ sent: false, skipped: exists ? "not rejected, or seller already emailed" : "no such ad" });
  }

  const release = () => Post.updateOne({ _id: postId }, { $unset: { rejectionEmailSentAt: 1 } });

  if (isEmailMutedUser(post.ownerId)) return json({ sent: false, skipped: "test account (EMAIL_MUTED_USER_IDS)" });

  const owner = post.ownerId
    ? await User.findById(post.ownerId).select("email isDeleted").lean<{ email?: string; isDeleted?: boolean }>()
    : null;
  if (owner?.isDeleted) return json({ sent: false, skipped: "seller account deleted" });

  const to = post.seller_info?.email || owner?.email;
  if (!to) {
    await release();
    return json({ sent: false, skipped: "no email address for this seller" });
  }

  const result = await sendListingStatusEmail({
    email: to,
    listingTitle: post.name ?? "your listing",
    listingId: post.adsId ?? String(post._id),
    status: "rejected",
    reason: post.rejectionReason || undefined,
  });

  if (!result.success) {
    await release();
    return json({ sent: false, error: "email provider failed" }, 502);
  }
  return json({ sent: true });
}
