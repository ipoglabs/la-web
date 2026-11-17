import { sendEmail } from "@/lib/email";

type ListingStatus =
  | "under_review"
  | "rejected"
  | "edited"
  | "expiring_soon"
  | "expired"
  | "removed_by_admin"
  | "marked_sold";

interface SendListingStatusEmailArgs {
  email: string;
  listingTitle: string;
  listingId: string;
  status: ListingStatus;
  reason?: string;
  expiresIn?: string;
  listingUrl?: string;
}

/**
 * Wraps the LISTING_STATUS email event (7 lifecycle sub-states).
 * Triggers today: "edited" (updatePost.ts, every successful edit) and
 * "rejected" (the back office calls /api/internal/listing-moderated after a
 * moderator rejects an ad). The other 5 states (under_review, expiring_soon,
 * expired, removed_by_admin, marked_sold) need moderation/expiry-cron/
 * mark-as-sold features that don't exist in this codebase yet; wire those up
 * here once the underlying action exists rather than guessing at one.
 */
export async function sendListingStatusEmail({
  email,
  listingTitle,
  listingId,
  status,
  reason,
  expiresIn,
  listingUrl,
}: SendListingStatusEmailArgs) {
  const result = await sendEmail({
    type: "LISTING_STATUS",
    to: email,
    data: { listingTitle, listingId, status, reason, expiresIn, listingUrl },
  });

  if (!result.success) {
    console.error("[sendListingStatusEmail] failed:", result.error);
  }

  return result;
}
