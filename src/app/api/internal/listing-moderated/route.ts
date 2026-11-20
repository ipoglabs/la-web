/**
 * app/api/internal/listing-moderated/route.ts
 *
 * Called by the back office (lokalads-bo) right after a moderator approves or
 * rejects an ad, so the seller hears about it by email instead of only finding
 * out if they open My Ads. The emails themselves stay here, in the one email
 * engine:
 *   status "active"   → LISTING_LIVE ("your listing is live")
 *   status "rejected" → LISTING_STATUS rejected, with the moderator's reason
 *
 * Auth: `Authorization: Bearer $BO_NOTIFY_SECRET` (set in this project AND in
 * lokalads-bo, Production only). It is its own secret, separate from
 * CRON_SECRET / INTERNAL_SECRET, so a leak of one doesn't open the others.
 *
 * Body: { "postId": "<Mongo _id>" }. Everything else (status, reason, seller
 * address) is read from the database, so even a leaked secret can only send a
 * TRUE notice, and at most once per decision: rejectionEmailSentAt /
 * liveEmailSentAt is claimed atomically before sending (the back office clears
 * both whenever the ad's status changes again).
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
import { sendListingLiveEmail } from "@/lib/listings/sendListingLiveEmail";

function authorised(req: Request): boolean {
  const secret = process.env.BO_NOTIFY_SECRET;
  if (!secret || secret.length < 32) return false;
  const given = (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
  const a = Buffer.from(given);
  const b = Buffer.from(secret);
  return a.length === b.length && timingSafeEqual(a, b);
}

const json = (body: unknown, status = 200) => Response.json(body, { status });

// Which email each moderated status gets, and the field that records it was sent.
const NOTICES = {
  rejected: "rejectionEmailSentAt",
  active: "liveEmailSentAt",
} as const;
type NoticeStatus = keyof typeof NOTICES;

export async function POST(req: Request) {
  if (!authorised(req)) return json({ error: "unauthorised" }, 401);

  const body = (await req.json().catch(() => null)) as { postId?: unknown } | null;
  const postId = typeof body?.postId === "string" ? body.postId : "";
  if (!mongoose.Types.ObjectId.isValid(postId)) return json({ error: "postId required" }, 400);

  await dbConnect();

  const current = await Post.findById(postId).select("status").lean<{ status?: string }>();
  if (!current) return json({ sent: false, skipped: "no such ad" });
  const status = current.status as NoticeStatus;
  if (!(status in NOTICES)) return json({ sent: false, skipped: `nothing to send for status "${current.status}"` });
  const flag = NOTICES[status];

  // Claim the notice first so two calls can't both send. The status is part of
  // the claim, so a change in between can't send the wrong email.
  const post = await Post.findOneAndUpdate(
    { _id: postId, status, [flag]: { $exists: false } },
    { $set: { [flag]: new Date() } },
    { new: true, projection: { name: 1, adsId: 1, country: 1, rejectionReason: 1, ownerId: 1, "seller_info.email": 1 } },
  ).lean();

  if (!post) return json({ sent: false, skipped: "seller already emailed about this decision" });

  const release = () => Post.updateOne({ _id: postId }, { $unset: { [flag]: 1 } });

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

  const listingTitle = post.name ?? "your listing";
  const listingId = post.adsId ?? String(post._id);
  const result =
    status === "active"
      ? await sendListingLiveEmail({
          email: to,
          listingTitle,
          listingId,
          listingUrl: post.country ? `/${post.country}/listings/${post._id}` : `/listings/${post._id}`,
        })
      : await sendListingStatusEmail({
          email: to,
          listingTitle,
          listingId,
          status: "rejected",
          reason: post.rejectionReason || undefined,
        });

  if (!result.success) {
    await release();
    return json({ sent: false, error: "email provider failed" }, 502);
  }
  return json({ sent: true });
}
