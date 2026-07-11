/**
 * report-ad/model.ts
 *
 * Mongoose schema + model for the `ad_reports` MongoDB collection.
 *
 * Import this wherever you need DB access (API routes only — never in client components):
 *   import AdReport from "@/components/report-ad/model";
 *
 * Always call dbConnect() before any query:
 *   import dbConnect from "@/lib/db";
 *   await dbConnect();
 */

import mongoose, { Schema, Document, Model } from "mongoose";
import { REPORT_ISSUE_OPTIONS, deriveReportPriority, type ReportIssue } from "./types";

// ── Document interface ────────────────────────────────────────────────────────

export interface IAdReport extends Document {
  // Ticket
  ticketId:      string;              // "RPT-2026-XXXXXX" — generated server-side

  // Ad snapshot (captured at report time so the record is self-contained)
  adId:          string;
  adTitle:       string;
  adThumbnail:   string;
  sellerName:    string;
  sellerId:      string;
  location:      string;

  // Reporter
  reporterId:    string | null;       // null for guest/anonymous
  reporterEmail: string | null;       // only stored if user consented (GDPR)
  hideIdentity:  boolean;             // true = never expose reporter to seller

  // Report content
  issues:        ReportIssue[];
  details:       string;              // free text, max 500 chars

  // Moderation
  status:        "pending" | "reviewed" | "actioned" | "dismissed";
  priority:      "low" | "medium" | "high";  // auto-derived from issues
  createdAt:     Date;
  reviewedAt:    Date | null;
  reviewedBy:    string | null;       // admin user ID
  resolution:    string | null;       // admin notes
}

// ── Schema ───────────────────────────────────────────────────────────────────

const VALID_ISSUES = REPORT_ISSUE_OPTIONS.map((o) => o.value);

const AdReportSchema = new Schema<IAdReport>(
  {
    // Ticket
    ticketId:      { type: String, required: true, unique: true, index: true },

    // Ad snapshot
    adId:          { type: String, required: true, index: true },
    adTitle:       { type: String, required: true },
    adThumbnail:   { type: String, default: "" },
    sellerName:    { type: String, required: true },
    sellerId:      { type: String, default: "" },
    location:      { type: String, default: "" },

    // Reporter
    reporterId:    { type: String, default: null, index: true },
    reporterEmail: { type: String, default: null },
    hideIdentity:  { type: Boolean, default: true },

    // Report content
    issues: {
      type:     [String],
      required: true,
      validate: {
        validator: (vals: string[]) =>
          vals.length > 0 && vals.every((v) => VALID_ISSUES.includes(v as ReportIssue)),
        message:  "issues must be a non-empty array of valid ReportIssue values",
      },
    },
    details: { type: String, default: "", maxlength: 500 },

    // Moderation
    status:     { type: String, enum: ["pending", "reviewed", "actioned", "dismissed"], default: "pending" },
    priority:   { type: String, enum: ["low", "medium", "high"],                        default: "low"     },
    reviewedAt: { type: Date,   default: null },
    reviewedBy: { type: String, default: null },
    resolution: { type: String, default: null },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: false },
  },
);

// Compound indexes
AdReportSchema.index({ status: 1, createdAt: -1 });           // admin review queue
AdReportSchema.index({ reporterId: 1, adId: 1, status: 1 });  // duplicate-report check

// ── Pre-save: derive priority server-side (client value is never trusted) ────

AdReportSchema.pre("save", function () {
  this.priority = deriveReportPriority(this.issues as ReportIssue[]);
});

// ── Ticket ID generator ───────────────────────────────────────────────────────

const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no ambiguous chars (0/O, 1/I)

export function generateTicketId(): string {
  const rand = Array.from(
    { length: 6 },
    () => CHARS[Math.floor(Math.random() * CHARS.length)],
  ).join("");
  return `RPT-${new Date().getFullYear()}-${rand}`;
}

// ── Model (singleton-safe for Next.js hot-reload) ────────────────────────────

const AdReport: Model<IAdReport> =
  (mongoose.models.AdReport as Model<IAdReport>) ??
  mongoose.model<IAdReport>("AdReport", AdReportSchema);

export default AdReport;

