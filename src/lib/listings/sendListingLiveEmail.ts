import { sendEmail } from "@/lib/email";

interface SendListingLiveEmailArgs {
  email: string;
  listingTitle: string;
  listingId: string;
  listingUrl: string;
}

/**
 * Wraps the LISTING_LIVE email event. There's no moderation/approval step
 * yet (see addPost.ts's query comment) — a post is live the moment it's
 * saved, so this is the "went live" trigger for now.
 */
export async function sendListingLiveEmail({
  email,
  listingTitle,
  listingId,
  listingUrl,
}: SendListingLiveEmailArgs) {
  const result = await sendEmail({
    type: "LISTING_LIVE",
    to: email,
    data: { listingTitle, listingId, listingUrl },
  });

  if (!result.success) {
    console.error("[sendListingLiveEmail] failed:", result.error);
  }

  return result;
}
