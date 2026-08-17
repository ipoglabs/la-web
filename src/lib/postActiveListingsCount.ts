/**
 * lib/postActiveListingsCount.ts
 *
 * Batched "how many other publicly-visible posts does this seller have"
 * lookup — backs mapPostToListing.ts's `activeListingsCount` param (shown
 * as SellerCard's "N active listings"). One aggregation query per page of
 * results instead of one count query per listing, so /api/listings and
 * friends stay cheap regardless of how many distinct sellers are on a page.
 * Same "active + not suspended" definition as everywhere else that reads
 * Post publicly — see lib/postVisibility.ts's publicPostFilter().
 */
import { Types } from "mongoose";
import Post from "@/models/post";
import { publicPostFilter } from "@/lib/postVisibility";

export async function getActiveListingCountsByOwner(
  ownerIds: (unknown | null | undefined)[],
): Promise<Map<string, number>> {
  const ids = [
    ...new Set(
      ownerIds
        .filter((id): id is NonNullable<typeof id> => id != null)
        .map((id) => String(id)),
    ),
  ];
  if (ids.length === 0) return new Map();

  const rows: { _id: Types.ObjectId; count: number }[] = await Post.aggregate([
    { $match: { ownerId: { $in: ids.map((id) => new Types.ObjectId(id)) }, ...publicPostFilter() } },
    { $group: { _id: "$ownerId", count: { $sum: 1 } } },
  ]);

  return new Map(rows.map((r) => [String(r._id), r.count]));
}
