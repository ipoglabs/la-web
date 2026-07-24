// ── Email Engine — Types ──────────────────────────────────────────────────────
// Single source of truth for all email event shapes.
// Every caller uses sendEmail(event: EmailEvent) — TypeScript enforces correct
// data per type at build time. Wrong shape = compile error, not runtime failure.

export type EmailEvent =
  | {
      type: "OTP";
      to: string;
      data: {
        code: string;
        expiresInMinutes: number;
        purpose: "login" | "verify-email" | "verify-phone" | "password-reset";
      };
    }
  | {
      type: "ACCOUNT_CREATED";
      to: string;
      data: { firstName: string; country: string };
    }
  | {
      type: "EMAIL_VERIFIED";
      to: string;
      data: { firstName: string };
    }
  | {
      type: "PASSWORD_RESET";
      to: string;
      data: { resetUrl: string; expiresInMinutes: number };
    }
  | {
      type: "PASSWORD_CHANGED";
      to: string;
      data: { firstName: string };
    }
  | {
      type: "LISTING_LIVE";
      to: string;
      data: { listingTitle: string; listingUrl: string; listingId: string };
    }
  | {
      type: "ALERT_MATCH";
      to: string;
      data: { alertName: string; count: number; previewUrl: string };
    }
  | {
      type: "REPORT_TICKET_CREATED";
      to: string;
      data: { ticketId: string; reason: string; listingTitle: string };
    }
  | {
      type: "REPORT_TICKET_UPDATED";
      to: string;
      data: { ticketId: string; newStatus: string; resolution?: string };
    }
  | {
      type: "ACCOUNT_DELETED";
      to: string;
      data: { firstName: string };
    }
  // ── Login & Security ────────────────────────────────────────────────────────
  | {
      type: "LOGIN_SECURITY";
      to: string;
      data: {
        event: "unrecognised_device" | "account_locked";
        ip?: string;
        device?: string;
      };
    }
  // ── Onboarding ──────────────────────────────────────────────────────────────
  | {
      type: "ONBOARDING_NUDGE";
      to: string;
      data: { firstName: string; dayNumber: 2 | 3 };
    }
  // ── Account ─────────────────────────────────────────────────────────────────
  | {
      type: "CONTACT_CHANGED";
      to: string;
      data: { firstName: string; field: "email" | "phone" };
    }
  | {
      type: "PROFILE_UPDATED";
      to: string;
      data: { firstName: string };
    }
  | {
      type: "ACCOUNT_STATUS";
      to: string;
      data: {
        firstName: string;
        status: "suspended" | "reinstated" | "banned";
        reason?: string;
      };
    }
  // ── Listings ─────────────────────────────────────────────────────────────────
  | {
      type: "LISTING_STATUS";
      to: string;
      data: {
        listingTitle: string;
        listingId: string;
        status:
          | "under_review"
          | "rejected"
          | "edited"
          | "expiring_soon"
          | "expired"
          | "removed_by_admin"
          | "marked_sold";
        reason?: string;
        expiresIn?: string;
        listingUrl?: string;
      };
    }
  | {
      type: "LISTING_INQUIRY";
      to: string;
      data: {
        listingTitle: string;
        listingId: string;
        buyerName: string;
        message: string;
        replyUrl: string;
      };
    }
  | {
      type: "LISTING_MILESTONE";
      to: string;
      data: {
        listingTitle: string;
        listingId: string;
        viewCount: number;
        listingUrl: string;
      };
    }
  | {
      type: "LISTING_REPORTED";
      to: string;
      data: { listingTitle: string; listingId: string };
    }
  // ── Alerts ───────────────────────────────────────────────────────────────────
  | {
      type: "ALERT_DIGEST";
      to: string;
      data: {
        alertName: string;
        count: number;
        previewUrl: string;
        frequency: "daily" | "weekly";
      };
    }
  | {
      type: "ALERT_NO_MATCHES";
      to: string;
      data: { alertName: string; alertId: string };
    }
  // ── Favourites ───────────────────────────────────────────────────────────────
  | {
      type: "FAVOURITE_UPDATE";
      to: string;
      data: {
        firstName: string;
        listingTitle: string;
        listingUrl: string;
        event: "price_drop" | "sold_removed" | "relisted";
        oldPrice?: string;
        newPrice?: string;
      };
    }
  // ── Chat ─────────────────────────────────────────────────────────────────────
  | {
      type: "CHAT_NOTIFICATION";
      to: string;
      data: {
        firstName: string;
        senderName: string;
        listingTitle: string;
        previewText: string;
        chatUrl: string;
        event: "new_message" | "reply_received" | "deal_confirmed";
      };
    }
  // ── Trust & Safety ───────────────────────────────────────────────────────────
  | {
      type: "COUNTER_REPORT";
      to: string;
      data: { ticketId: string; listingTitle: string };
    }
  // ── Donations ────────────────────────────────────────────────────────────────
  | {
      type: "DONATION_RECEIPT";
      to: string;
      data: {
        firstName: string;
        amount: string;
        currency: string;
        reference: string;
      };
    }
  | {
      type: "DONATION_FAILED";
      to: string;
      data: { firstName: string; amount: string; currency: string };
    }
  // ── Platform ─────────────────────────────────────────────────────────────────
  | {
      type: "PLATFORM_NOTICE";
      to: string;
      data: {
        type: "tos" | "privacy" | "maintenance";
        effectiveDate?: string;
        maintenanceWindow?: string;
        maintenanceDate?: string;
      };
    }
  // ── Admin ────────────────────────────────────────────────────────────────────
  | {
      type: "ADMIN_MESSAGE";
      to: string;
      data: {
        firstName: string;
        subject: string;
        body: string;
        actionUrl?: string;
        actionLabel?: string;
      };
    }
  | {
      type: "ID_VERIFICATION";
      to: string;
      data: {
        firstName: string;
        status: "requested" | "approved";
        reason?: string;
        actionUrl?: string;
      };
    }
  // ── Security ─────────────────────────────────────────────────────────────────
  | {
      type: "SECURITY_NOTICE";
      to: string;
      data: {
        firstName: string;
        event: "signed_out_all" | "device_trusted";
        device?: string;
      };
    }
  // ── GDPR / Compliance ────────────────────────────────────────────────────────
  | {
      type: "GDPR_NOTICE";
      to: string;
      data: {
        firstName: string;
        event: "data_export_ready" | "unsubscribed" | "resubscribed";
        downloadUrl?: string;
        expiresIn?: string;
      };
    }
  // ── Listing Appeals ──────────────────────────────────────────────────────────
  | {
      type: "LISTING_APPEAL";
      to: string;
      data: {
        listingTitle: string;
        listingId: string;
        status: "submitted" | "approved" | "rejected";
        reason?: string;
        listingUrl?: string;
      };
    }
  // ── Seller Digest ────────────────────────────────────────────────────────────
  | {
      type: "SELLER_DIGEST";
      to: string;
      data: {
        firstName: string;
        period: string;
        stats: { views: number; saves: number; inquiries: number };
        activeListings: number;
        topListingTitle?: string;
        topListingUrl?: string;
      };
    }
  // ── Win-Back ─────────────────────────────────────────────────────────────────
  | {
      type: "WIN_BACK";
      to: string;
      data: {
        firstName: string;
        daysSince: 30 | 60;
      };
    }
  // ── Milestones ───────────────────────────────────────────────────────────────
  | {
      type: "MILESTONE";
      to: string;
      data: {
        firstName: string;
        event: "first_sale" | "profile_reminder";
        listingTitle?: string;
        completionPercent?: number;
        profileUrl?: string;
      };
    }
  // ── Email Verification Reminder ───────────────────────────────────────────
  | {
      type: "EMAIL_VERIFY_REMINDER";
      to: string;
      data: { firstName: string };
    }
  // ── Listing Renewal Confirmation ──────────────────────────────────────────
  | {
      type: "LISTING_RENEWED";
      to: string;
      data: {
        listingTitle: string;
        listingId: string;
        listingUrl: string;
        newExpiryDate: string;
      };
    }
  // ── Account Deletion Pending (GDPR cooling-off) ───────────────────────────
  | {
      type: "ACCOUNT_DELETION_PENDING";
      to: string;
      data: {
        firstName: string;
        coolOffDays: number;
        deletionDate: string;
        cancelUrl: string;
      };
    };

// Return type for sendEmail() — callers always know if it succeeded or why it failed.
export type EmailSendResult =
  | { success: true }
  | { success: false; error: string };

// Internal render output — passed from renderer.ts → provider.ts
export type EmailRenderResult = {
  subject: string;
  html: string;
  text: string;
};
