// ── Email Engine — Subject Lines ──────────────────────────────────────────────
// Pure function — no react-dom/server import, safe to use in any context
// including Server Components and the design-system demo page.
// renderer.ts imports this so the subject logic stays single-source-of-truth.

import type { EmailEvent } from "./types";

export function getSubject(event: EmailEvent): string {
  switch (event.type) {
    case "OTP": {
      const labels: Record<typeof event.data.purpose, string> = {
        "login":          "Your LokalAds login code",
        "verify-email":   "Verify your email address",
        "verify-phone":   "Verify your phone number",
        "password-reset": "Reset your LokalAds password",
      };
      return labels[event.data.purpose];
    }
    case "ACCOUNT_CREATED":
      return `Welcome to LokalAds, ${event.data.firstName}!`;
    case "EMAIL_VERIFIED":
      return "Your email address is verified";
    case "PASSWORD_RESET":
      return "Reset your LokalAds password";
    case "PASSWORD_CHANGED":
      return "Your password has been changed";
    case "LISTING_LIVE":
      return `Your listing is live — ${event.data.listingTitle}`;
    case "ALERT_MATCH":
      return `${event.data.count} new ${event.data.count === 1 ? "listing" : "listings"} matching your alert`;
    case "REPORT_TICKET_CREATED":
      return `Report received — Ticket #${event.data.ticketId}`;
    case "REPORT_TICKET_UPDATED":
      return `Your report has been updated — Ticket #${event.data.ticketId}`;
    case "ACCOUNT_DELETED":
      return "Your LokalAds account has been deleted";
    // ── Login & Security ──────────────────────────────────────────────────────
    case "LOGIN_SECURITY":
      return event.data.event === "unrecognised_device"
        ? "New sign-in detected on your LokalAds account"
        : "Your LokalAds account has been locked";
    // ── Onboarding ────────────────────────────────────────────────────────────
    case "ONBOARDING_NUDGE":
      return event.data.dayNumber === 2
        ? "Ready to post your first listing?"
        : "Don't miss out — buyers are searching now";
    // ── Account ───────────────────────────────────────────────────────────────
    case "CONTACT_CHANGED":
      return event.data.field === "email"
        ? "Your email address has been changed"
        : "Your phone number has been changed";
    case "PROFILE_UPDATED":
      return "Your LokalAds profile has been updated";
    case "ACCOUNT_STATUS": {
      const statusLabels = {
        suspended: "Your LokalAds account has been suspended",
        reinstated: "Your LokalAds account has been reinstated",
        banned: "Your LokalAds account has been permanently closed",
      } as const;
      return statusLabels[event.data.status];
    }
    // ── Listings ──────────────────────────────────────────────────────────────
    case "LISTING_STATUS": {
      const listingLabels: Record<typeof event.data.status, string> = {
        under_review:     `Your listing is under review — ${event.data.listingTitle}`,
        rejected:         `Your listing was not approved — ${event.data.listingTitle}`,
        edited:           `Your listing has been updated — ${event.data.listingTitle}`,
        expiring_soon:    `Your listing is expiring soon — ${event.data.listingTitle}`,
        expired:          `Your listing has expired — ${event.data.listingTitle}`,
        removed_by_admin: `Your listing has been removed — ${event.data.listingTitle}`,
        marked_sold:      `Listing marked as sold — ${event.data.listingTitle}`,
      };
      return listingLabels[event.data.status];
    }
    case "LISTING_INQUIRY":
      return `New inquiry on your listing — ${event.data.listingTitle}`;
    case "LISTING_MILESTONE":
      return `Your listing has ${event.data.viewCount} views — ${event.data.listingTitle}`;
    case "LISTING_REPORTED":
      return `A report has been filed on your listing — ${event.data.listingTitle}`;
    // ── Alerts ────────────────────────────────────────────────────────────────
    case "ALERT_DIGEST": {
      const noun = event.data.count === 1 ? "listing" : "listings";
      const freq = event.data.frequency === "daily" ? "Daily" : "Weekly";
      return `${freq} digest: ${event.data.count} new ${noun} for "${event.data.alertName}"`;
    }
    case "ALERT_NO_MATCHES":
      return `No new matches for your alert "${event.data.alertName}"`;
    // ── Favourites ────────────────────────────────────────────────────────────
    case "FAVOURITE_UPDATE": {
      const favLabels = {
        price_drop:   `Price drop on a listing you saved — ${event.data.listingTitle}`,
        sold_removed: `A saved listing is no longer available — ${event.data.listingTitle}`,
        relisted:     `A listing you liked is back! — ${event.data.listingTitle}`,
      } as const;
      return favLabels[event.data.event];
    }
    // ── Chat ──────────────────────────────────────────────────────────────────
    case "CHAT_NOTIFICATION": {
      const chatLabels = {
        new_message:    `New message from ${event.data.senderName}`,
        reply_received: `${event.data.senderName} replied to your message`,
        deal_confirmed: `Deal confirmed with ${event.data.senderName} — ${event.data.listingTitle}`,
      } as const;
      return chatLabels[event.data.event];
    }
    // ── Trust & Safety ────────────────────────────────────────────────────────
    case "COUNTER_REPORT":
      return `Your report #${event.data.ticketId} has been disputed`;
    // ── Donations ─────────────────────────────────────────────────────────────
    case "DONATION_RECEIPT":
      return `Thank you for your donation — ${event.data.amount} ${event.data.currency}`;
    case "DONATION_FAILED":
      return `Your donation of ${event.data.amount} ${event.data.currency} could not be processed`;
    // ── Platform ──────────────────────────────────────────────────────────────
    case "PLATFORM_NOTICE": {
      const platformLabels = {
        tos:         "Important: Our Terms of Service have been updated",
        privacy:     "Important: Our Privacy Policy has been updated",
        maintenance: "Scheduled maintenance notice",
      } as const;
      return platformLabels[event.data.type];
    }
    // ── Admin ─────────────────────────────────────────────────────────────────
    case "ADMIN_MESSAGE":
      return `[LokalAds] ${event.data.subject}`;
    case "ID_VERIFICATION":
      return event.data.status === "requested"
        ? "Action required: ID verification needed"
        : "You're now a verified seller on LokalAds!";
    // ── Security ──────────────────────────────────────────────────────────────
    case "SECURITY_NOTICE":
      return event.data.event === "signed_out_all"
        ? "You've been signed out of all devices"
        : "A new device has been saved as trusted";
    // ── GDPR / Compliance ─────────────────────────────────────────────────────
    case "GDPR_NOTICE": {
      const gdprLabels = {
        data_export_ready: "Your LokalAds data export is ready to download",
        unsubscribed:      "You've been unsubscribed from marketing emails",
        resubscribed:      "You're back on our mailing list!",
      } as const;
      return gdprLabels[event.data.event];
    }
    // ── Listing Appeals ───────────────────────────────────────────────────────
    case "LISTING_APPEAL": {
      const appealLabels = {
        submitted: `Your appeal has been received — ${event.data.listingTitle}`,
        approved:  `Your appeal was approved — listing reinstated`,
        rejected:  `Your appeal has been reviewed — decision upheld`,
      } as const;
      return appealLabels[event.data.status];
    }
    // ── Seller Digest ─────────────────────────────────────────────────────────
    case "SELLER_DIGEST":
      return `Your LokalAds weekly digest — ${event.data.period}`;
    // ── Win-Back ──────────────────────────────────────────────────────────────
    case "WIN_BACK":
      return event.data.daysSince === 30
        ? "We miss you — come back to LokalAds!"
        : "Your LokalAds account is still here — log back in";
    // ── Milestones ────────────────────────────────────────────────────────────
    case "MILESTONE":
      return event.data.event === "first_sale"
        ? `Congratulations on your first sale, ${event.data.firstName}!`
        : `Your LokalAds profile is almost complete`;
    // ── Email Verification Reminder ───────────────────────────────────────────
    case "EMAIL_VERIFY_REMINDER":
      return `${event.data.firstName}, please verify your email address`;
    // ── Listing Renewal Confirmation ──────────────────────────────────────────
    case "LISTING_RENEWED":
      return `Your listing has been renewed — active until ${event.data.newExpiryDate}`;
    // ── Account Deletion Pending ──────────────────────────────────────────────
    case "ACCOUNT_DELETION_PENDING":
      return `Action required: your account is scheduled for deletion on ${event.data.deletionDate}`;
  }
}
