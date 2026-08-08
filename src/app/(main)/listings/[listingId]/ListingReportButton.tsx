"use client";

import { useState } from "react";
import { Flag } from "lucide-react";
import { ReportAdPopup } from "@/components/report-ad";
import type { ReportAdTarget, ReportAdPayload, ReportAdTicket } from "@/components/report-ad";

interface ListingReportButtonProps {
  listingId: string;
  target?: Partial<ReportAdTarget>;
  isAuthenticated?: boolean;
}

/**
 * ListingReportButton — opens the full ReportAdPopup 3-screen journey and
 * submits real reports to POST /api/reports (reporterId is derived
 * server-side from the session there — never sent from here). Anonymous/
 * guest reporting is intentionally allowed (models/report-ad's `reporterId:
 * string | null // null for guest/anonymous`), so this doesn't gate opening
 * the popup behind auth.
 */
export default function ListingReportButton({ listingId, target, isAuthenticated }: ListingReportButtonProps) {
  const [open, setOpen] = useState(false);

  const resolvedTarget: ReportAdTarget = {
    adId:       target?.adId       ?? listingId,
    title:      target?.title      ?? "This listing",
    thumbnail:  target?.thumbnail,
    sellerName: target?.sellerName ?? "Seller",
    sellerId:   target?.sellerId,
    location:   target?.location   ?? "",
  };

  async function handleSubmit(payload: ReportAdPayload): Promise<ReportAdTicket> {
    const res = await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body?.error ?? "submit_failed");
    }

    const { ticketId } = await res.json();
    return { ticketId, status: "pending", createdAt: new Date().toISOString() };
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="shrink-0 flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 rounded-full text-white px-3 py-1 transition-colors"
      >
        <Flag className="size-3.5" aria-hidden />
        <span className="text-sm font-medium">Report</span>
      </button>

      <ReportAdPopup
        open={open}
        onOpenChange={setOpen}
        target={resolvedTarget}
        onSubmit={handleSubmit}
        isAuthenticated={isAuthenticated}
      />
    </>
  );
}
