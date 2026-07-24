// ── Email Engine — Preview Mock Data ─────────────────────────────────────────
// Shared by the design-system demo page and the /api/email-preview route.
// No react-dom/server import — safe to use in Server Components.
// 56 entries — one per use case (55 in coverage map + 1 admin-triggered reset variant).

import type { EmailEvent } from "./types";

export type PreviewEntry = { label: string; event: EmailEvent };

export const PREVIEW_DATA: PreviewEntry[] = [
  // ── 🔐 Login ──────────────────────────────────────────────────────────────
  {
    label: "Login — OTP",
    event: {
      type: "OTP",
      to: "preview@example.com",
      data: { code: "482917", expiresInMinutes: 10, purpose: "login" },
    },
  },
  {
    label: "Login — Unrecognised Device",
    event: {
      type: "LOGIN_SECURITY",
      to: "preview@example.com",
      data: { event: "unrecognised_device", device: "Chrome on Windows 11", ip: "203.0.113.42" },
    },
  },
  {
    label: "Login — Account Locked",
    event: {
      type: "LOGIN_SECURITY",
      to: "preview@example.com",
      data: { event: "account_locked", ip: "203.0.113.42" },
    },
  },
  // ── 📝 Register ───────────────────────────────────────────────────────────
  {
    label: "Register — Welcome / Account Created",
    event: {
      type: "ACCOUNT_CREATED",
      to: "preview@example.com",
      data: { firstName: "Gopi", country: "United Kingdom" },
    },
  },
  {
    label: "Register — Verify Email OTP",
    event: {
      type: "OTP",
      to: "preview@example.com",
      data: { code: "738261", expiresInMinutes: 10, purpose: "verify-email" },
    },
  },
  {
    label: "Register — Verify Phone OTP",
    event: {
      type: "OTP",
      to: "preview@example.com",
      data: { code: "193857", expiresInMinutes: 5, purpose: "verify-phone" },
    },
  },
  {
    label: "Register — Email Verified Confirmation",
    event: {
      type: "EMAIL_VERIFIED",
      to: "preview@example.com",
      data: { firstName: "Gopi" },
    },
  },
  {
    label: "Register — Onboarding Nudge (Day 2)",
    event: {
      type: "ONBOARDING_NUDGE",
      to: "preview@example.com",
      data: { firstName: "Gopi", dayNumber: 2 },
    },
  },
  {
    label: "Register — Onboarding Nudge (Day 3)",
    event: {
      type: "ONBOARDING_NUDGE",
      to: "preview@example.com",
      data: { firstName: "Gopi", dayNumber: 3 },
    },
  },
  // ── 🔑 Password ───────────────────────────────────────────────────────────
  {
    label: "Password — OTP Reset",
    event: {
      type: "OTP",
      to: "preview@example.com",
      data: { code: "629041", expiresInMinutes: 30, purpose: "password-reset" },
    },
  },
  {
    label: "Password — Reset Link",
    event: {
      type: "PASSWORD_RESET",
      to: "preview@example.com",
      data: {
        resetUrl: "http://localhost:3000/reset?token=abc123def456gh789",
        expiresInMinutes: 30,
      },
    },
  },
  {
    label: "Password — Changed Confirmation",
    event: {
      type: "PASSWORD_CHANGED",
      to: "preview@example.com",
      data: { firstName: "Gopi" },
    },
  },
  {
    label: "Password — Admin-Triggered Reset (reuses reset link template)",
    event: {
      type: "PASSWORD_RESET",
      to: "preview@example.com",
      data: {
        resetUrl: "http://localhost:3000/reset?token=admin-triggered-xyz999",
        expiresInMinutes: 60,
      },
    },
  },
  // ── ⚙️ Account ────────────────────────────────────────────────────────────
  {
    label: "Account — Email Address Changed",
    event: {
      type: "CONTACT_CHANGED",
      to: "preview@example.com",
      data: { firstName: "Gopi", field: "email" },
    },
  },
  {
    label: "Account — Phone Number Changed",
    event: {
      type: "CONTACT_CHANGED",
      to: "preview@example.com",
      data: { firstName: "Gopi", field: "phone" },
    },
  },
  {
    label: "Account — Profile Updated",
    event: {
      type: "PROFILE_UPDATED",
      to: "preview@example.com",
      data: { firstName: "Gopi" },
    },
  },
  {
    label: "Account — Deleted",
    event: {
      type: "ACCOUNT_DELETED",
      to: "preview@example.com",
      data: { firstName: "Gopi" },
    },
  },
  {
    label: "Account — Suspended",
    event: {
      type: "ACCOUNT_STATUS",
      to: "preview@example.com",
      data: {
        firstName: "Gopi",
        status: "suspended",
        reason: "Multiple reports of misleading listings from other users.",
      },
    },
  },
  {
    label: "Account — Reinstated",
    event: {
      type: "ACCOUNT_STATUS",
      to: "preview@example.com",
      data: { firstName: "Gopi", status: "reinstated" },
    },
  },
  {
    label: "Account — Permanently Banned",
    event: {
      type: "ACCOUNT_STATUS",
      to: "preview@example.com",
      data: {
        firstName: "Gopi",
        status: "banned",
        reason: "Repeated violations of our Terms of Service after previous suspension.",
      },
    },
  },
  // ── 📢 Listing / Seller ───────────────────────────────────────────────────
  {
    label: "Listing — Live",
    event: {
      type: "LISTING_LIVE",
      to: "preview@example.com",
      data: {
        listingTitle: "iPhone 14 Pro Max — Midnight Black",
        listingUrl: "http://localhost:3000/listings/LA-20260708-001",
        listingId: "LA-20260708-001",
      },
    },
  },
  {
    label: "Listing — Under Review",
    event: {
      type: "LISTING_STATUS",
      to: "preview@example.com",
      data: {
        listingTitle: "iPhone 14 Pro Max — Midnight Black",
        listingId: "LA-20260708-001",
        status: "under_review",
      },
    },
  },
  {
    label: "Listing — Rejected",
    event: {
      type: "LISTING_STATUS",
      to: "preview@example.com",
      data: {
        listingTitle: "Replica Handbag Collection",
        listingId: "LA-20260708-002",
        status: "rejected",
        reason: "Listing contains counterfeit or replica goods, which are prohibited on LokalAds.",
      },
    },
  },
  {
    label: "Listing — Edited & Re-submitted",
    event: {
      type: "LISTING_STATUS",
      to: "preview@example.com",
      data: {
        listingTitle: "iPhone 14 Pro Max — Midnight Black",
        listingId: "LA-20260708-001",
        status: "edited",
        listingUrl: "http://localhost:3000/listings/LA-20260708-001",
      },
    },
  },
  {
    label: "Listing — Expiring Soon",
    event: {
      type: "LISTING_STATUS",
      to: "preview@example.com",
      data: {
        listingTitle: "Sony WH-1000XM5 Headphones",
        listingId: "LA-20260708-003",
        status: "expiring_soon",
        expiresIn: "7 days (15 July 2026)",
      },
    },
  },
  {
    label: "Listing — Expired",
    event: {
      type: "LISTING_STATUS",
      to: "preview@example.com",
      data: {
        listingTitle: "Sony WH-1000XM5 Headphones",
        listingId: "LA-20260708-003",
        status: "expired",
      },
    },
  },
  {
    label: "Listing — Removed by Admin",
    event: {
      type: "LISTING_STATUS",
      to: "preview@example.com",
      data: {
        listingTitle: "Free iPhone 15 — Claim Now",
        listingId: "LA-20260708-004",
        status: "removed_by_admin",
        reason: "Listing was flagged as spam/scam and violates our content guidelines.",
      },
    },
  },
  {
    label: "Listing — Marked Sold",
    event: {
      type: "LISTING_STATUS",
      to: "preview@example.com",
      data: {
        listingTitle: "iPhone 14 Pro Max — Midnight Black",
        listingId: "LA-20260708-001",
        status: "marked_sold",
      },
    },
  },
  {
    label: "Listing — New Inquiry from Buyer",
    event: {
      type: "LISTING_INQUIRY",
      to: "preview@example.com",
      data: {
        listingTitle: "Sony WH-1000XM5 Headphones",
        listingId: "LA-20260708-003",
        buyerName: "Priya S.",
        message: "Hi! Is this still available? Would you accept £180 for a quick sale?",
        replyUrl: "http://localhost:3000/chat?thread=abc123",
      },
    },
  },
  {
    label: "Listing — High-Views Milestone",
    event: {
      type: "LISTING_MILESTONE",
      to: "preview@example.com",
      data: {
        listingTitle: "iPhone 14 Pro Max — Midnight Black",
        listingId: "LA-20260708-001",
        viewCount: 250,
        listingUrl: "http://localhost:3000/listings/LA-20260708-001",
      },
    },
  },
  // ── 🔍 Alerts / Buyer ─────────────────────────────────────────────────────
  {
    label: "Alert — Match (Instant)",
    event: {
      type: "ALERT_MATCH",
      to: "preview@example.com",
      data: {
        alertName: "iPhone deals in London",
        count: 3,
        previewUrl: "http://localhost:3000/listings?alert=abc123",
      },
    },
  },
  {
    label: "Alert — Daily Digest",
    event: {
      type: "ALERT_DIGEST",
      to: "preview@example.com",
      data: {
        alertName: "MacBook Pro under £1200",
        count: 7,
        previewUrl: "http://localhost:3000/listings?alert=def456",
        frequency: "daily",
      },
    },
  },
  {
    label: "Alert — Weekly Digest",
    event: {
      type: "ALERT_DIGEST",
      to: "preview@example.com",
      data: {
        alertName: "Vintage vinyl records London",
        count: 12,
        previewUrl: "http://localhost:3000/listings?alert=ghi789",
        frequency: "weekly",
      },
    },
  },
  {
    label: "Alert — No Matches (14-day nudge)",
    event: {
      type: "ALERT_NO_MATCHES",
      to: "preview@example.com",
      data: {
        alertName: "Rare vintage Leica M3 camera",
        alertId: "ALT-20260601-001",
      },
    },
  },
  // ── ❤️ Favourites ─────────────────────────────────────────────────────────
  {
    label: "Favourites — Price Drop",
    event: {
      type: "FAVOURITE_UPDATE",
      to: "preview@example.com",
      data: {
        firstName: "Gopi",
        listingTitle: "Sony WH-1000XM5 Headphones",
        listingUrl: "http://localhost:3000/listings/LA-20260708-003",
        event: "price_drop",
        oldPrice: "£220",
        newPrice: "£175",
      },
    },
  },
  {
    label: "Favourites — Listing Sold / Removed",
    event: {
      type: "FAVOURITE_UPDATE",
      to: "preview@example.com",
      data: {
        firstName: "Gopi",
        listingTitle: "Vintage Leica M3 Camera",
        listingUrl: "http://localhost:3000/listings/LA-20260615-001",
        event: "sold_removed",
      },
    },
  },
  {
    label: "Favourites — Listing Relisted",
    event: {
      type: "FAVOURITE_UPDATE",
      to: "preview@example.com",
      data: {
        firstName: "Gopi",
        listingTitle: "Vintage Leica M3 Camera",
        listingUrl: "http://localhost:3000/listings/LA-20260708-005",
        event: "relisted",
      },
    },
  },
  // ── 💬 Chat ───────────────────────────────────────────────────────────────
  {
    label: "Chat — New Message",
    event: {
      type: "CHAT_NOTIFICATION",
      to: "preview@example.com",
      data: {
        firstName: "Gopi",
        senderName: "Priya S.",
        listingTitle: "Sony WH-1000XM5 Headphones",
        previewText: "Hi! Is this still available? Would you accept £180?",
        chatUrl: "http://localhost:3000/chat?thread=abc123",
        event: "new_message",
      },
    },
  },
  {
    label: "Chat — Reply Received",
    event: {
      type: "CHAT_NOTIFICATION",
      to: "preview@example.com",
      data: {
        firstName: "Gopi",
        senderName: "Priya S.",
        listingTitle: "Sony WH-1000XM5 Headphones",
        previewText: "Sure, I can do £185 — can we meet this weekend?",
        chatUrl: "http://localhost:3000/chat?thread=abc123",
        event: "reply_received",
      },
    },
  },
  {
    label: "Chat — Deal Confirmed",
    event: {
      type: "CHAT_NOTIFICATION",
      to: "preview@example.com",
      data: {
        firstName: "Gopi",
        senderName: "Priya S.",
        listingTitle: "Sony WH-1000XM5 Headphones",
        previewText: "Great, see you at Liverpool Street on Saturday at 2pm!",
        chatUrl: "http://localhost:3000/chat?thread=abc123",
        event: "deal_confirmed",
      },
    },
  },
  // ── 🚩 Trust & Safety ─────────────────────────────────────────────────────
  {
    label: "Report — Ticket Created",
    event: {
      type: "REPORT_TICKET_CREATED",
      to: "preview@example.com",
      data: {
        ticketId: "RPT-20260708-001",
        reason: "Spam or scam",
        listingTitle: "Free iPhone 15 — Too Good to Be True",
      },
    },
  },
  {
    label: "Report — Ticket Under Review",
    event: {
      type: "REPORT_TICKET_UPDATED",
      to: "preview@example.com",
      data: { ticketId: "RPT-20260708-001", newStatus: "under_review" },
    },
  },
  {
    label: "Report — Ticket Resolved",
    event: {
      type: "REPORT_TICKET_UPDATED",
      to: "preview@example.com",
      data: {
        ticketId: "RPT-20260708-001",
        newStatus: "resolved",
        resolution: "The listing has been removed for violating our spam policy.",
      },
    },
  },
  {
    label: "Report — Ticket Dismissed",
    event: {
      type: "REPORT_TICKET_UPDATED",
      to: "preview@example.com",
      data: {
        ticketId: "RPT-20260708-002",
        newStatus: "dismissed",
        resolution: "After review, the listing was found to comply with our guidelines.",
      },
    },
  },
  {
    label: "Report — Ticket Escalated",
    event: {
      type: "REPORT_TICKET_UPDATED",
      to: "preview@example.com",
      data: {
        ticketId: "RPT-20260708-003",
        newStatus: "escalated",
        resolution: "This case has been escalated to our senior moderation team for further review.",
      },
    },
  },
  {
    label: "Report — Your Listing Was Reported",
    event: {
      type: "LISTING_REPORTED",
      to: "preview@example.com",
      data: {
        listingTitle: "Free iPhone 15 — Limited Offer",
        listingId: "LA-20260708-004",
      },
    },
  },
  {
    label: "Report — Counter-Report (Disputed by Seller)",
    event: {
      type: "COUNTER_REPORT",
      to: "preview@example.com",
      data: {
        ticketId: "RPT-20260708-002",
        listingTitle: "Samsung Galaxy S24 Ultra",
      },
    },
  },
  // ── 💝 Donations ──────────────────────────────────────────────────────────
  {
    label: "Donation — Receipt",
    event: {
      type: "DONATION_RECEIPT",
      to: "preview@example.com",
      data: {
        firstName: "Gopi",
        amount: "10.00",
        currency: "GBP",
        reference: "DON-20260708-001",
      },
    },
  },
  {
    label: "Donation — Payment Failed",
    event: {
      type: "DONATION_FAILED",
      to: "preview@example.com",
      data: { firstName: "Gopi", amount: "10.00", currency: "GBP" },
    },
  },
  // ── 📜 Platform ───────────────────────────────────────────────────────────
  {
    label: "Platform — Terms of Service Updated",
    event: {
      type: "PLATFORM_NOTICE",
      to: "preview@example.com",
      data: { type: "tos", effectiveDate: "1 August 2026" },
    },
  },
  {
    label: "Platform — Privacy Policy Updated",
    event: {
      type: "PLATFORM_NOTICE",
      to: "preview@example.com",
      data: { type: "privacy", effectiveDate: "1 August 2026" },
    },
  },
  {
    label: "Platform — Scheduled Maintenance",
    event: {
      type: "PLATFORM_NOTICE",
      to: "preview@example.com",
      data: {
        type: "maintenance",
        maintenanceDate: "Saturday, 12 July 2026",
        maintenanceWindow: "2:00 AM – 4:00 AM BST (approx. 2 hours)",
      },
    },
  },
  // ── 🛡️ Admin ──────────────────────────────────────────────────────────────
  {
    label: "Admin — Manual Message",
    event: {
      type: "ADMIN_MESSAGE",
      to: "preview@example.com",
      data: {
        firstName: "Gopi",
        subject: "A note about your recent listing",
        body: "We noticed your recent listing may benefit from a clearer description and additional photos.\n\nListings with detailed descriptions and 3+ photos receive significantly more inquiries from buyers.\n\nIf you have any questions, please don't hesitate to reach out.",
        actionUrl: "/myads",
        actionLabel: "Edit My Listing",
      },
    },
  },
  {
    label: "Admin — ID Verification Requested",
    event: {
      type: "ID_VERIFICATION",
      to: "preview@example.com",
      data: {
        firstName: "Gopi",
        status: "requested",
        reason: "Your account has been flagged for verification as part of our seller trust programme.",
        actionUrl: "/profile",
      },
    },
  },
  {
    label: "Admin — ID Verification Approved",
    event: {
      type: "ID_VERIFICATION",
      to: "preview@example.com",
      data: { firstName: "Gopi", status: "approved" },
    },
  },
  // ── 🔐 Security ───────────────────────────────────────────────────────────
  {
    label: "Security — All-Device Sign-Out Confirmation",
    event: {
      type: "SECURITY_NOTICE",
      to: "preview@example.com",
      data: { firstName: "Gopi", event: "signed_out_all" },
    },
  },
  {
    label: "Security — New Device Trusted",
    event: {
      type: "SECURITY_NOTICE",
      to: "preview@example.com",
      data: { firstName: "Gopi", event: "device_trusted", device: "Chrome on MacBook Pro (macOS 15)" },
    },
  },
  // ── ⚖️ GDPR / Compliance ──────────────────────────────────────────────────
  {
    label: "GDPR — Data Export Ready",
    event: {
      type: "GDPR_NOTICE",
      to: "preview@example.com",
      data: {
        firstName: "Gopi",
        event: "data_export_ready",
        downloadUrl: "http://localhost:3000/profile/data-export?token=abc123",
        expiresIn: "72 hours (expires 11 July 2026)",
      },
    },
  },
  {
    label: "GDPR — Unsubscribe Confirmation",
    event: {
      type: "GDPR_NOTICE",
      to: "preview@example.com",
      data: { firstName: "Gopi", event: "unsubscribed" },
    },
  },
  {
    label: "GDPR — Re-subscribe Confirmation",
    event: {
      type: "GDPR_NOTICE",
      to: "preview@example.com",
      data: { firstName: "Gopi", event: "resubscribed" },
    },
  },
  // ── 📋 Listing Appeals ────────────────────────────────────────────────────
  {
    label: "Appeal — Submitted",
    event: {
      type: "LISTING_APPEAL",
      to: "preview@example.com",
      data: {
        listingTitle: "Free iPhone 15 — Claim Now",
        listingId: "LA-20260708-004",
        status: "submitted",
      },
    },
  },
  {
    label: "Appeal — Approved (Listing Reinstated)",
    event: {
      type: "LISTING_APPEAL",
      to: "preview@example.com",
      data: {
        listingTitle: "iPhone 14 Pro Max — Midnight Black",
        listingId: "LA-20260708-001",
        status: "approved",
        listingUrl: "http://localhost:3000/listings/LA-20260708-001",
        reason: "After review, we found the listing complies with our guidelines.",
      },
    },
  },
  {
    label: "Appeal — Rejected",
    event: {
      type: "LISTING_APPEAL",
      to: "preview@example.com",
      data: {
        listingTitle: "Free iPhone 15 — Claim Now",
        listingId: "LA-20260708-004",
        status: "rejected",
        reason: "The listing was confirmed to contain misleading content and violates our spam policy. This decision is final.",
      },
    },
  },
  // ── 📊 Seller Digest ──────────────────────────────────────────────────────
  {
    label: "Seller — Weekly Digest",
    event: {
      type: "SELLER_DIGEST",
      to: "preview@example.com",
      data: {
        firstName: "Gopi",
        period: "30 June – 6 July 2026",
        stats: { views: 1240, saves: 38, inquiries: 12 },
        activeListings: 4,
        topListingTitle: "iPhone 14 Pro Max — Midnight Black",
        topListingUrl: "http://localhost:3000/listings/LA-20260708-001",
      },
    },
  },
  // ── 💌 Win-Back ───────────────────────────────────────────────────────────
  {
    label: "Win-Back — 30-Day Inactivity",
    event: {
      type: "WIN_BACK",
      to: "preview@example.com",
      data: { firstName: "Gopi", daysSince: 30 },
    },
  },
  {
    label: "Win-Back — 60-Day Final Nudge",
    event: {
      type: "WIN_BACK",
      to: "preview@example.com",
      data: { firstName: "Gopi", daysSince: 60 },
    },
  },
  // ── 🏆 Milestones ─────────────────────────────────────────────────────────
  {
    label: "Milestone — First Sale Congratulations",
    event: {
      type: "MILESTONE",
      to: "preview@example.com",
      data: {
        firstName: "Gopi",
        event: "first_sale",
        listingTitle: "Sony WH-1000XM5 Headphones",
      },
    },
  },
  {
    label: "Milestone — Profile Completion Reminder",
    event: {
      type: "MILESTONE",
      to: "preview@example.com",
      data: {
        firstName: "Gopi",
        event: "profile_reminder",
        completionPercent: 65,
        profileUrl: "/profile",
      },
    },
  },
  // ── 📝 G1 — Email Verification Reminder ──────────────────────────────────
  {
    label: "Register — Email Verification Reminder (24h nudge)",
    event: {
      type: "EMAIL_VERIFY_REMINDER",
      to: "preview@example.com",
      data: { firstName: "Gopi" },
    },
  },
  // ── 📢 G2 — Listing Renewal Confirmation ─────────────────────────────────
  {
    label: "Listing — Renewal Confirmation",
    event: {
      type: "LISTING_RENEWED",
      to: "preview@example.com",
      data: {
        listingTitle: "Sony WH-1000XM5 Headphones",
        listingId: "LA-20260708-003",
        listingUrl: "http://localhost:3000/listings/LA-20260708-003",
        newExpiryDate: "8 August 2026",
      },
    },
  },
  // ── ⚠️ G4 — Account Deletion Pending (GDPR cooling-off) ──────────────────
  {
    label: "Account — Deletion Pending (GDPR cooling-off notice)",
    event: {
      type: "ACCOUNT_DELETION_PENDING",
      to: "preview@example.com",
      data: {
        firstName: "Gopi",
        coolOffDays: 14,
        deletionDate: "22 July 2026",
        cancelUrl: "http://localhost:3000/profile/cancel-deletion?token=abc123",
      },
    },
  },
];
