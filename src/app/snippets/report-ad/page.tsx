"use client";

/**
 * /snippets/report-ad — Demo page
 *
 * Shows the Report Ad journey trigger in context:
 *   • The Ad ID + Report banner (copied from the listing detail page)
 *   • The full ReportAdPopup journey (Drawer on mobile / Dialog on tablet+)
 *   • Last submitted payload preview (for developer reference)
 *   • API + MongoDB schema notes inline
 */

import { useState } from "react";
import { Flag } from "lucide-react";
import { ReportAdPopup } from "@/components/report-ad";
import type { ReportAdPayload, ReportAdTarget } from "@/components/report-ad";

// ── Demo ad context ───────────────────────────────────────────────────────────
// Mirrors the shape that the real listing detail page would pass in.

const DEMO_TARGET: ReportAdTarget = {
  adId:        "10109",
  title:       "2BR Apartment for Rent in Orchard Road — Fully Furnished",
  thumbnail:   "/img/img1.jpg",
  sellerName:  "Sarah Tan",
  location:    "Orchard Road, Singapore",
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ReportAdSnippetPage() {
  const [open, setOpen]           = useState(false);
  const [lastPayload, setLastPayload] = useState<ReportAdPayload | null>(null);

  const handleSubmit = (payload: ReportAdPayload) => {
    setLastPayload(payload);
    // TODO [INTEGRATION]: POST to /api/reports
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-xl px-5 py-16 space-y-12">

        {/* Page header */}
        <div>
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-slate-400 mb-2">Snippet</p>
          <h1 className="text-2xl font-bold text-slate-900">Report Ad Journey</h1>
          <p className="mt-1 text-sm text-slate-500">
            3-step report flow: issue selection → detail → confirmation with ticket ID.
            Bottom sheet on mobile, dialog on tablet+.
          </p>
        </div>

        {/* ── Banner trigger (exact replica of listing detail page) ── */}
        <section className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Banner trigger</p>
          <p className="text-xs text-slate-500">
            This is the exact component that appears at the bottom of the listing detail page.
          </p>

          {/* Ad ID + Report row — copied from ListingDetailPage */}
          <div className="bg-white px-4 py-3.5 border border-slate-200 rounded-xl flex items-center gap-3 shadow-sm">
            <p className="text-sm text-slate-500 flex-1">
              Ad ID: <span className="font-semibold text-slate-800">{DEMO_TARGET.adId}</span>
            </p>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="shrink-0 flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 rounded-full text-white px-3 py-1 transition-colors"
            >
              <Flag className="size-3.5" aria-hidden />
              <span className="text-sm font-medium">Report</span>
            </button>
          </div>
        </section>

        {/* ── Report popup ── */}
        <ReportAdPopup
          open={open}
          onOpenChange={setOpen}
          target={DEMO_TARGET}
          onSubmit={handleSubmit}
        />

        {/* ── Last submitted payload ── */}
        {lastPayload && (
          <section className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Last submitted payload
            </p>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-2">
              <p className="text-xs font-semibold text-slate-700">ReportAdPayload</p>
              <pre className="text-xs text-slate-500 font-mono whitespace-pre-wrap break-all leading-relaxed">
                {JSON.stringify(lastPayload, null, 2)}
              </pre>
            </div>
          </section>
        )}

        {/* ── API + Schema reference ── */}
        <section className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            API + Schema Reference
          </p>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 divide-y divide-slate-200 overflow-hidden">

            <div className="px-4 py-3.5 space-y-1">
              <p className="text-xs font-bold text-slate-700">POST /api/reports</p>
              <p className="text-xs text-slate-500">Body: ReportAdPayload → Response 201: {"{ ticketId }"}</p>
              <p className="text-xs text-slate-500">Rate limit: max 1 active report per user per ad</p>
            </div>

            <div className="px-4 py-3.5 space-y-1">
              <p className="text-xs font-bold text-slate-700">MongoDB collection: ad_reports</p>
              <p className="text-xs text-slate-500">
                ticketId (unique) · adId · issues[] · details · hideIdentity · status · priority · createdAt
              </p>
              <p className="text-xs text-slate-500">
                Priority auto-set: high (scam/illegal/counterfeit) · medium (misleading/prohibited/offensive) · low (spam/duplicate/wrong-category)
              </p>
            </div>

            <div className="px-4 py-3.5 space-y-1">
              <p className="text-xs font-bold text-slate-700">Full schema + developer notes</p>
              <p className="text-xs text-slate-500">
                See <code className="bg-slate-200 px-1 rounded">components/report-ad/model.ts</code> for the Mongoose schema, indexes, REST API spec, rate limiting, and priority rules. Frontend types are in <code className="bg-slate-200 px-1 rounded">components/report-ad/types.ts</code>.
              </p>
            </div>

          </div>
        </section>

      </div>
    </main>
  );
}
