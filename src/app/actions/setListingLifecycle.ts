"use server";

/**
 * setListingLifecycle.ts
 *
 * One action for every seller-triggered ad lifecycle transition on
 * /my-ads — pause/resume/renew/close/delete. Mirrors the transition table
 * from md/api-contracts/myads.md (la-design-aug14, PATCH /api/listings/[id]/
 * status), adapted to our real Post schema (status/isSuspended, not their
 * hypothetical Listing model).
 *
 * Delete is a soft-delete (status: "deleted") — never a literal Mongo
 * delete. Every public read path already filters to status:"active"/
 * publicPostFilter(), so a deleted post is already invisible everywhere
 * else with no further changes needed.
 */
import { revalidatePath } from "next/cache";
import { Types } from "mongoose";
import connectDB from "@/lib/db";
import Post from "@/models/post";
import { getSession } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { deleteImageVariants } from "@/lib/media/imageVariants";
import { logActivity } from "@/lib/activityLog";
import { resolveMyAdStatus, getOpenReportAdIds } from "@/lib/myAdsStatus";
import { MAX_ACTIVE_ADS } from "@/lib/myAdsConstants";
import { resolvePostId, type LeanPost } from "@/lib/mapPostToFeaturedItem";

export type LifecycleAction = "pause" | "resume" | "renew" | "close" | "delete";

type Result = { ok: true } | { ok: false; error: string };

const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 60_000;
const RENEW_PERIOD_MS = 60 * 24 * 60 * 60 * 1000;

function findByPublicId(postId: string) {
  const query = Types.ObjectId.isValid(postId)
    ? { $or: [{ adsId: postId }, { _id: postId }] }
    : { adsId: postId };
  return Post.findOne(query);
}

export async function setListingLifecycle(postId: string, action: LifecycleAction): Promise<Result> {
  const session = await getSession();
  if (!session?.userId) return { ok: false, error: "Sign in required." };

  if (!checkRateLimit(`listing-lifecycle:${session.userId}`, RATE_LIMIT, RATE_WINDOW_MS)) {
    return { ok: false, error: "Too many requests — please wait a moment and try again." };
  }

  await connectDB();

  const post = await findByPublicId(postId);
  if (!post) return { ok: false, error: "Ad not found." };

  if (String(post.ownerId) !== String(session.userId)) {
    return { ok: false, error: "Not allowed." };
  }

  // Same status the seller sees on the card — guarantees the server only
  // ever allows a transition the UI actually offered (report-aware).
  const adId = resolvePostId(post as unknown as LeanPost);
  const hasOpenReport = (await getOpenReportAdIds([adId])).has(adId);
  const currentStatus = resolveMyAdStatus(post, hasOpenReport);

  async function underQuota(): Promise<boolean> {
    const activeCount = await Post.countDocuments({ ownerId: post!.ownerId, status: "active" });
    return activeCount < MAX_ACTIVE_ADS;
  }

  switch (action) {
    case "pause": {
      if (currentStatus !== "active") return { ok: false, error: "This ad can't be paused right now." };
      post.status = "off";
      break;
    }
    case "resume": {
      if (currentStatus !== "off-market") return { ok: false, error: "This ad can't be resumed right now." };
      if (!(await underQuota())) {
        return { ok: false, error: `You can have up to ${MAX_ACTIVE_ADS} active ads at once. Pause or close another ad first.` };
      }
      post.status = "active";
      break;
    }
    case "renew": {
      if (currentStatus !== "expired") return { ok: false, error: "This ad can't be renewed right now." };
      if (!(await underQuota())) {
        return { ok: false, error: `You can have up to ${MAX_ACTIVE_ADS} active ads at once. Pause or close another ad first.` };
      }
      post.status = "active";
      post.expiresAt = new Date(Date.now() + RENEW_PERIOD_MS);
      break;
    }
    case "close": {
      if (currentStatus !== "active" && currentStatus !== "off-market") {
        return { ok: false, error: "This ad can't be closed right now." };
      }
      post.status = "closed";
      post.expiresAt = null;
      break;
    }
    case "delete": {
      if (post.status === "deleted") return { ok: false, error: "This ad is already deleted." };
      const imageUrls = (post.images ?? []) as string[];
      if (imageUrls.length > 0) {
        deleteImageVariants(imageUrls).catch((e) => console.error("R2 cleanup error during setListingLifecycle delete:", e));
      }
      post.status = "deleted";
      post.deletedAt = new Date();
      break;
    }
    default:
      return { ok: false, error: "Unknown action." };
  }

  await post.save();

  if (post.ownerId) {
    await logActivity(
      post.ownerId,
      action === "delete" ? "POST_DELETED" : "POST_UPDATED",
      { postId: String(post._id), title: post.name, lifecycleAction: action },
    );
  }

  revalidatePath("/my-ads");
  return { ok: true };
}
