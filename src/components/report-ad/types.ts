/**
 * report-ad/types.ts
 *
 * TypeScript types, constants, and utility functions for the Report Ad journey.
 * See model.ts for the MongoDB schema, REST API spec, and rate-limiting rules.
 */

// ── Issue categories ──────────────────────────────────────────────────────────

export type ReportIssue =
  | "scam_fraud"
  | "misleading"
  | "spam"
  | "prohibited_item"
  | "offensive"
  | "illegal_content"
  | "counterfeit"
  | "duplicate"
  | "wrong_category"
  | "already_sold";

export interface ReportIssueOption {
  value: ReportIssue;
  label: string;
  /** Short description shown below the label in the toggle chip */
  hint: string;
  /** Auto-derived priority for this issue */
  priority: "high" | "medium" | "low";
}

export const REPORT_ISSUE_OPTIONS: ReportIssueOption[] = [
  {
    value:    "scam_fraud",
    label:    "Scam / Fraud",
    hint:     "Fake listing, payment scam, or identity theft",
    priority: "high",
  },
  {
    value:    "illegal_content",
    label:    "Illegal Content",
    hint:     "Content that violates laws or regulations",
    priority: "high",
  },
  {
    value:    "counterfeit",
    label:    "Counterfeit Item",
    hint:     "Fake or counterfeit goods being sold",
    priority: "high",
  },
  {
    value:    "misleading",
    label:    "Misleading Info",
    hint:     "False price, specs, condition, or location",
    priority: "medium",
  },
  {
    value:    "prohibited_item",
    label:    "Prohibited Item",
    hint:     "Item not allowed on this platform",
    priority: "medium",
  },
  {
    value:    "offensive",
    label:    "Offensive / Hateful",
    hint:     "Discriminatory, abusive, or inappropriate content",
    priority: "medium",
  },
  {
    value:    "spam",
    label:    "Spam",
    hint:     "Unsolicited bulk posting or irrelevant content",
    priority: "low",
  },
  {
    value:    "duplicate",
    label:    "Duplicate Listing",
    hint:     "Same item posted multiple times",
    priority: "low",
  },
  {
    value:    "wrong_category",
    label:    "Wrong Category",
    hint:     "Listed under the wrong section",
    priority: "low",
  },
  {
    value:    "already_sold",
    label:    "Already Sold",
    hint:     "Item is no longer available but still listed",
    priority: "low",
  },
];

// ── Ad snapshot passed into the popup ────────────────────────────────────────

/** Snapshot of the ad being reported. Populated from the listing page context. */
export interface ReportAdTarget {
  /** The listing's display ID shown on the page (e.g. "10109") */
  adId:         string;
  title:        string;
  thumbnail?:   string;   // URL — optional, falls back to placeholder
  sellerName:   string;
  location:     string;
}

// ── Payload sent to POST /api/reports ────────────────────────────────────────

export interface ReportAdPayload {
  adId:         string;
  adTitle:      string;
  adThumbnail:  string;
  sellerName:   string;
  location:     string;

  issues:       ReportIssue[];
  details:      string;          // free text, max 500 chars
  hideIdentity: boolean;

  /** Populated server-side from session — not sent by client. Included here for schema docs. */
  reporterId?:  string | null;
}

// ── Ticket response from POST /api/reports ───────────────────────────────────

export interface ReportAdTicket {
  ticketId: string;   // e.g. "RPT-2026-A3F9K2"
  status:   "pending";
  createdAt: string;  // ISO date string
}

// ── Utility: derive priority from selected issues ────────────────────────────

export function deriveReportPriority(issues: ReportIssue[]): "high" | "medium" | "low" {
  const priorities = issues.map(
    (v) => REPORT_ISSUE_OPTIONS.find((o) => o.value === v)?.priority ?? "low",
  );
  if (priorities.includes("high"))   return "high";
  if (priorities.includes("medium")) return "medium";
  return "low";
}

/** Generate a demo ticket ID for the UI (server would generate the real one) */
export function generateDemoTicketId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no ambiguous chars (0/O, 1/I)
  const rand = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `RPT-${new Date().getFullYear()}-${rand}`;
}
