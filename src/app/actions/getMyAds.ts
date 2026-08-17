"use server";

/**
 * getMyAds.ts
 *
 * Real data source for /my-ads — replaces getMyPosts.ts (kept no callers
 * after this port; see plan). Returns the exact MyAd shape MyAdCard.tsx
 * (ported from la-design-aug14) expects, built entirely from real Post
 * documents — no mock data.
 */
import connectDB from "@/lib/db";
import Post from "@/models/post";
import Favourite from "@/models/Favourite";
import Conversation from "@/models/Conversation";
import { getSession } from "@/lib/auth";
import { resolvePostId, resolvePrice, type LeanPost } from "@/lib/mapPostToFeaturedItem";
import { resolveMyAdStatus, getOpenReportAdIds, type MyAdStatus } from "@/lib/myAdsStatus";

export interface MyAd {
  id: string;
  image: { src: string; alt?: string };
  title: string;
  priceLabel: string;
  priceSuffix?: string;
  status: MyAdStatus;
  viewCount: number;
  favouriteCount: number;
  messageCount: number;
  publishedAt: number; // unix ms
  expiresAt: number | null; // unix ms
  bumpedAt: number | null; // unix ms
  moderationReason?: string;
}

const BLOCKED_REASON =
  "Suspended by an admin for a policy violation. Contact support if you believe this is a mistake.";
const UNDER_REVIEW_REASON =
  "A buyer reported this ad. We're reviewing it now, no action needed from you yet.";

function moderationReasonFor(status: MyAdStatus, rejectionReason?: string): string | undefined {
  if (status === "rejected") return rejectionReason || undefined;
  if (status === "blocked") return BLOCKED_REASON;
  if (status === "under-review") return UNDER_REVIEW_REASON;
  return undefined;
}

export async function getMyAds(): Promise<MyAd[]> {
  const session = await getSession();
  if (!session?.userId) return [];

  await connectDB();

  const posts = await Post.find({ ownerId: session.userId, status: { $ne: "deleted" } })
    .sort({ lastBumpedAt: -1, createdAt: -1 })
    .limit(200)
    .lean();

  if (posts.length === 0) return [];

  const ids = posts.map((p) => resolvePostId(p as LeanPost));

  const [favRows, msgRows, openReportIds] = await Promise.all([
    Favourite.aggregate([
      { $match: { listingId: { $in: ids } } },
      { $group: { _id: "$listingId", count: { $sum: 1 } } },
    ]),
    Conversation.aggregate([
      { $match: { adId: { $in: ids } } },
      { $group: { _id: "$adId", count: { $sum: 1 } } },
    ]),
    getOpenReportAdIds(ids),
  ]);

  const favCountById = new Map<string, number>(favRows.map((r) => [r._id, r.count]));
  const msgCountById = new Map<string, number>(msgRows.map((r) => [r._id, r.count]));

  return posts.map((post) => {
    const lean = post as LeanPost;
    const id = resolvePostId(lean);
    const { priceLabel, priceSuffix } = resolvePrice(lean);
    const status = resolveMyAdStatus(lean, openReportIds.has(id));

    return {
      id,
      image: { src: lean.images?.[0] ?? "/img/img1.jpg", alt: lean.name },
      title: lean.name,
      priceLabel,
      priceSuffix,
      status,
      viewCount: lean.viewCount ?? 0,
      favouriteCount: favCountById.get(id) ?? 0,
      messageCount: msgCountById.get(id) ?? 0,
      publishedAt: (lean.createdAt ?? new Date()).getTime(),
      expiresAt: lean.expiresAt ? lean.expiresAt.getTime() : null,
      bumpedAt: lean.lastBumpedAt ? lean.lastBumpedAt.getTime() : null,
      moderationReason: moderationReasonFor(status, lean.rejectionReason),
    };
  });
}
