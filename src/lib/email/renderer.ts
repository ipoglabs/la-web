// ── Email Engine — Renderer ───────────────────────────────────────────────────
// Turns an EmailEvent into { subject, html, text }.
// Owns all subject line copy and template selection.
// Testable independently — no provider, no network, no side effects.

import type { EmailEvent, EmailRenderResult } from "./types";
import { getSubject } from "./subjects";

// ── Template imports — account/ ───────────────────────────────────────────────
import { OtpEmail, otpText } from "./templates/account/otp";
import { AccountCreatedEmail, accountCreatedText } from "./templates/account/account-created";
import { EmailVerifiedEmail, emailVerifiedText } from "./templates/account/email-verified";
import { PasswordResetEmail, passwordResetText } from "./templates/account/password-reset";
import { PasswordChangedEmail, passwordChangedText } from "./templates/account/password-changed";
import { EmailVerifyReminderEmail, emailVerifyReminderText } from "./templates/account/email-verify-reminder";
import { ContactChangedEmail, contactChangedText } from "./templates/account/contact-changed";
import { ProfileUpdatedEmail, profileUpdatedText } from "./templates/account/profile-updated";
import { AccountStatusEmail, accountStatusText } from "./templates/account/account-status";
import { AccountDeletedEmail, accountDeletedText } from "./templates/account/account-deleted";
import { AccountDeletionPendingEmail, accountDeletionPendingText } from "./templates/account/account-deletion-pending";
import { SecurityNoticeEmail, securityNoticeText } from "./templates/account/security-notice";
import { LoginSecurityEmail, loginSecurityText } from "./templates/account/login-security";
import { IdVerificationEmail, idVerificationText } from "./templates/account/id-verification";
// ── Template imports — listings/ ─────────────────────────────────────────────
import { ListingLiveEmail, listingLiveText } from "./templates/listings/listing-live";
import { ListingStatusEmail, listingStatusText } from "./templates/listings/listing-status";
import { ListingInquiryEmail, listingInquiryText } from "./templates/listings/listing-inquiry";
import { ListingMilestoneEmail, listingMilestoneText } from "./templates/listings/listing-milestone";
import { ListingReportedEmail, listingReportedText } from "./templates/listings/listing-reported";
import { ListingAppealEmail, listingAppealText } from "./templates/listings/listing-appeal";
import { ListingRenewedEmail, listingRenewedText } from "./templates/listings/listing-renewed";
import { FavouriteUpdateEmail, favouriteUpdateText } from "./templates/listings/favourite-update";
// ── Template imports — alerts/ ────────────────────────────────────────────────
import { AlertMatchEmail, alertMatchText } from "./templates/alerts/alert-match";
import { AlertDigestEmail, alertDigestText } from "./templates/alerts/alert-digest";
import { AlertNoMatchesEmail, alertNoMatchesText } from "./templates/alerts/alert-no-matches";
// ── Template imports — reports/ ───────────────────────────────────────────────
import { ReportTicketCreatedEmail, reportTicketCreatedText } from "./templates/reports/report-ticket-created";
import { ReportTicketUpdatedEmail, reportTicketUpdatedText } from "./templates/reports/report-ticket-updated";
import { CounterReportEmail, counterReportText } from "./templates/reports/counter-report";
import { ChatNotificationEmail, chatNotificationText } from "./templates/reports/chat-notification";
// ── Template imports — engagement/ ───────────────────────────────────────────
import { OnboardingNudgeEmail, onboardingNudgeText } from "./templates/engagement/onboarding-nudge";
import { SellerDigestEmail, sellerDigestText } from "./templates/engagement/seller-digest";
import { WinBackEmail, winBackText } from "./templates/engagement/win-back";
import { MilestoneEmail, milestoneText } from "./templates/engagement/milestone";
import { DonationReceiptEmail, donationReceiptText } from "./templates/engagement/donation-receipt";
import { DonationFailedEmail, donationFailedText } from "./templates/engagement/donation-failed";
// ── Template imports — platform/ ─────────────────────────────────────────────
import { GdprNoticeEmail, gdprNoticeText } from "./templates/platform/gdpr-notice";
import { PlatformNoticeEmail, platformNoticeText } from "./templates/platform/platform-notice";
import { AdminMessageEmail, adminMessageText } from "./templates/platform/admin-message";

// ── Renderer ──────────────────────────────────────────────────────────────────

export function renderEmail(event: EmailEvent): EmailRenderResult {
  const subject = getSubject(event);

  let html: string;
  let text: string;

  switch (event.type) {
    case "OTP":
      html = OtpEmail(event.data);
      text    = otpText(event.data);
      break;
    case "ACCOUNT_CREATED":
      html = AccountCreatedEmail(event.data);
      text    = accountCreatedText(event.data);
      break;
    case "EMAIL_VERIFIED":
      html = EmailVerifiedEmail(event.data);
      text    = emailVerifiedText(event.data);
      break;
    case "PASSWORD_RESET":
      html = PasswordResetEmail(event.data);
      text    = passwordResetText(event.data);
      break;
    case "PASSWORD_CHANGED":
      html = PasswordChangedEmail(event.data);
      text    = passwordChangedText(event.data);
      break;
    case "LISTING_LIVE":
      html = ListingLiveEmail(event.data);
      text    = listingLiveText(event.data);
      break;
    case "ALERT_MATCH":
      html = AlertMatchEmail(event.data);
      text    = alertMatchText(event.data);
      break;
    case "REPORT_TICKET_CREATED":
      html = ReportTicketCreatedEmail(event.data);
      text    = reportTicketCreatedText(event.data);
      break;
    case "REPORT_TICKET_UPDATED":
      html = ReportTicketUpdatedEmail(event.data);
      text    = reportTicketUpdatedText(event.data);
      break;
    case "ACCOUNT_DELETED":
      html = AccountDeletedEmail(event.data);
      text    = accountDeletedText(event.data);
      break;
    case "LOGIN_SECURITY":
      html = LoginSecurityEmail(event.data);
      text    = loginSecurityText(event.data);
      break;
    case "ONBOARDING_NUDGE":
      html = OnboardingNudgeEmail(event.data);
      text    = onboardingNudgeText(event.data);
      break;
    case "CONTACT_CHANGED":
      html = ContactChangedEmail(event.data);
      text    = contactChangedText(event.data);
      break;
    case "PROFILE_UPDATED":
      html = ProfileUpdatedEmail(event.data);
      text    = profileUpdatedText(event.data);
      break;
    case "ACCOUNT_STATUS":
      html = AccountStatusEmail(event.data);
      text    = accountStatusText(event.data);
      break;
    case "LISTING_STATUS":
      html = ListingStatusEmail(event.data);
      text    = listingStatusText(event.data);
      break;
    case "LISTING_INQUIRY":
      html = ListingInquiryEmail(event.data);
      text    = listingInquiryText(event.data);
      break;
    case "LISTING_MILESTONE":
      html = ListingMilestoneEmail(event.data);
      text    = listingMilestoneText(event.data);
      break;
    case "LISTING_REPORTED":
      html = ListingReportedEmail(event.data);
      text    = listingReportedText(event.data);
      break;
    case "ALERT_DIGEST":
      html = AlertDigestEmail(event.data);
      text    = alertDigestText(event.data);
      break;
    case "ALERT_NO_MATCHES":
      html = AlertNoMatchesEmail(event.data);
      text    = alertNoMatchesText(event.data);
      break;
    case "FAVOURITE_UPDATE":
      html = FavouriteUpdateEmail(event.data);
      text    = favouriteUpdateText(event.data);
      break;
    case "CHAT_NOTIFICATION":
      html = ChatNotificationEmail(event.data);
      text    = chatNotificationText(event.data);
      break;
    case "COUNTER_REPORT":
      html = CounterReportEmail(event.data);
      text    = counterReportText(event.data);
      break;
    case "DONATION_RECEIPT":
      html = DonationReceiptEmail(event.data);
      text    = donationReceiptText(event.data);
      break;
    case "DONATION_FAILED":
      html = DonationFailedEmail(event.data);
      text    = donationFailedText(event.data);
      break;
    case "PLATFORM_NOTICE":
      html = PlatformNoticeEmail(event.data);
      text    = platformNoticeText(event.data);
      break;
    case "ADMIN_MESSAGE":
      html = AdminMessageEmail(event.data);
      text    = adminMessageText(event.data);
      break;
    case "ID_VERIFICATION":
      html = IdVerificationEmail(event.data);
      text    = idVerificationText(event.data);
      break;
    case "SECURITY_NOTICE":
      html = SecurityNoticeEmail(event.data);
      text    = securityNoticeText(event.data);
      break;
    case "GDPR_NOTICE":
      html = GdprNoticeEmail(event.data);
      text    = gdprNoticeText(event.data);
      break;
    case "LISTING_APPEAL":
      html = ListingAppealEmail(event.data);
      text    = listingAppealText(event.data);
      break;
    case "SELLER_DIGEST":
      html = SellerDigestEmail(event.data);
      text    = sellerDigestText(event.data);
      break;
    case "WIN_BACK":
      html = WinBackEmail(event.data);
      text    = winBackText(event.data);
      break;
    case "MILESTONE":
      html = MilestoneEmail(event.data);
      text    = milestoneText(event.data);
      break;
    case "EMAIL_VERIFY_REMINDER":
      html = EmailVerifyReminderEmail(event.data);
      text    = emailVerifyReminderText(event.data);
      break;
    case "LISTING_RENEWED":
      html = ListingRenewedEmail(event.data);
      text    = listingRenewedText(event.data);
      break;
    case "ACCOUNT_DELETION_PENDING":
      html = AccountDeletionPendingEmail(event.data);
      text    = accountDeletionPendingText(event.data);
      break;
  }

  return { subject, html, text };
}
