import { Types } from "mongoose";
import dbConnect from "@/lib/db";
import Post from "@/models/post";
import AdReport from "@/components/report-ad/model";
import { logActivity } from "@/lib/activityLog";
import type { ActivityAction } from "@/models/ActivityLog";

/**
 * Single source of truth for every moderation state transition — called by
 * both the /admin actions and the public report review endpoint, so a
 * decision always (a) updates the right document(s) and (b) lands in
 * ActivityLog the same way, once.
 */

/** Resolves a report's `adId` (client-supplied, same value as the listing
 * detail route param) back to a real Post — mirrors getPostByAdsId.ts. */
async function findPostByPublicId(adId: string) {
  const query = Types.ObjectId.isValid(adId)
    ? { $or: [{ adsId: adId }, { _id: adId }] }
    : { adsId: adId };
  return Post.findOne(query);
}

/** The 4 states the admin posts page toggles a post between. "banned" is
 * orthogonal to `status` in the schema (it's the `isSuspended` flag also
 * used by the report-review flow) — collapsed into one state machine here
 * so picking a new one always clears whichever of the two the old one set,
 * instead of leaving e.g. a "banned" flag lingering under an "active" status. */
export type PostStatusTarget = "active" | "rejected" | "pending" | "banned";

const STATUS_ACTIVITY_ACTION: Record<PostStatusTarget, ActivityAction> = {
  active: "AD_APPROVED",
  rejected: "AD_REJECTED",
  pending: "AD_SET_PENDING",
  banned: "AD_SUSPENDED",
};

export async function setPostStatus({
  postId,
  adminId,
  target,
  reason,
}: {
  postId: string;
  adminId: string;
  target: PostStatusTarget;
  reason?: string;
}) {
  await dbConnect();

  const update =
    target === "banned"
      ? {
          isSuspended: true,
          suspendedAt: new Date(),
          suspendedBy: new Types.ObjectId(adminId),
        }
      : {
          status: target,
          isSuspended: false,
          rejectionReason: target === "rejected" ? reason ?? null : null,
          $unset: { suspendedAt: "", suspendedBy: "" },
        };

  const post = await Post.findByIdAndUpdate(postId, update, { new: true });
  if (!post) throw new Error("post_not_found");

  if (post.ownerId) {
    await logActivity(
      post.ownerId,
      STATUS_ACTIVITY_ACTION[target],
      { postId: String(post._id), title: post.name, ...(reason ? { reason } : {}) },
      adminId
    );
  }
  return post;
}

export type ReportDecision = "reviewed" | "actioned" | "dismissed";

export async function reviewReport({
  ticketId,
  decision,
  resolution,
  adminId,
}: {
  ticketId: string;
  decision: ReportDecision;
  resolution?: string | null;
  adminId: string;
}) {
  await dbConnect();

  const report = await AdReport.findOneAndUpdate(
    { ticketId },
    { status: decision, resolution: resolution ?? null, reviewedAt: new Date(), reviewedBy: adminId },
    { new: true }
  );
  if (!report) throw new Error("report_not_found");

  // Best-effort — a report's adId can outlive its Post (deleted ad, or an
  // id from a mock/non-DB listing), in which case there's nothing to
  // suspend and no post-owner feed to log against.
  const post = await findPostByPublicId(report.adId);
  if (post && post.ownerId) {
    const metadata = { postId: String(post._id), title: post.name, ticketId, reason: resolution };
    if (decision === "actioned") {
      post.isSuspended = true;
      post.suspendedAt = new Date();
      post.suspendedBy = new Types.ObjectId(adminId);
      await post.save();
      await logActivity(post.ownerId, "AD_SUSPENDED", metadata, adminId);
    } else if (decision === "dismissed") {
      await logActivity(post.ownerId, "AD_REPORT_DISMISSED", metadata, adminId);
    } else {
      await logActivity(post.ownerId, "AD_REPORT_REVIEWED", metadata, adminId);
    }
  }

  return report;
}
