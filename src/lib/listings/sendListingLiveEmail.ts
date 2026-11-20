import { sendEmail } from "@/lib/email";

interface SendListingLiveEmailArgs {
  email: string;
  listingTitle: string;
  listingId: string;
  listingUrl: string;
}

/**
 * Wraps the LISTING_LIVE email event. Sent when the back office approves an
 * ad (pending → active), via api/internal/listing-moderated — never on
 * submit, because new and edited ads wait for review first.
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
