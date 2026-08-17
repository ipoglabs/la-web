/**
 * lib/myAdsStatus.ts
 *
 * Resolves a Post's real lifecycle fields (status, isSuspended, open reports)
 * into the seller-facing status shown on /my-ads. Builds on mapStatus()
 * (mapPostToFeaturedItem.ts), which already covers active/off-market/
 * expired/closed/pending/rejected/deleted/blocked — this adds the one thing
 * mapStatus() can't see on its own: "under-review", which isn't a Post.status
 * value at all, it's inferred from an open (status:"pending") AdReport
 * ticket against the ad (see lib/moderation.ts's reviewReport()).
 */
import AdReport from "@/components/report-ad/model";
import { mapStatus } from "@/lib/mapPostToFeaturedItem";
import type { IPost } from "@/models/post";
import type { ListingStatus } from "@/types/listing";

/** The 8 statuses /my-ads can show a seller — mapStatus()'s full output
 *  range, minus "draft"/"deleted" (never shown here; deleted posts are
 *  excluded from the query, drafts don't exist yet — see plan). */
export type MyAdStatus = Exclude<ListingStatus, "draft" | "deleted">;

/** Batched "does this ad have an open report" lookup — one query for a
 *  whole /my-ads page load instead of one per ad. */
export async function getOpenReportAdIds(adIds: string[]): Promise<Set<string>> {
  if (adIds.length === 0) return new Set();
  const reports = await AdReport.find(
    { adId: { $in: adIds }, status: "pending" },
    { adId: 1 },
  ).lean();
  return new Set(reports.map((r) => r.adId));
}

/**
 * Resolves the real status to show for one ad. `hasOpenReport` should come
 * from getOpenReportAdIds() above. Suspended (mapStatus → "blocked") always
 * wins; a report only surfaces as "under-review" while the ad would
 * otherwise show as active/off-market — a closed/expired/rejected/pending
 * ad keeps its own status regardless of report state.
 */
export function resolveMyAdStatus(
  post: Pick<IPost, "status" | "isSuspended">,
  hasOpenReport: boolean,
): MyAdStatus {
  const status = mapStatus(post.status, post.isSuspended) as MyAdStatus;
  if (hasOpenReport && (status === "active" || status === "off-market")) {
    return "under-review";
  }
  return status;
}
