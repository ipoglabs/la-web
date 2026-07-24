"use client";

import { useState } from "react";
import { Flag } from "lucide-react";
import { ReportAdPopup } from "@/components/report-ad";
import type { ReportAdTarget } from "@/components/report-ad";

interface ListingReportButtonProps {
  listingId: string;
  /**
   * TODO [INTEGRATION]: Populate from the listing API response.
   * Pass the real title, thumbnail, sellerName and location so the
   * ReportAdPopup can display the ad context card on Screen 1.
   */
  target?: Partial<ReportAdTarget>;
}

/**
 * ListingReportButton — opens the full ReportAdPopup 3-screen journey.
 *
 * TODO [INTEGRATION]: Pass target from the parent page:
 *   <ListingReportButton
 *     listingId={advId}
 *     target={{ adId: advId, title, thumbnail: images[0]?.src, sellerName: seller.name, location }}
 *   />
 *
 * TODO [INTEGRATION]: Wire the onSubmit prop to POST /api/reports:
 *   onSubmit={async (payload) => {
 *     const res = await fetch('/api/reports', { method: 'POST', body: JSON.stringify(payload) });
 *     const { ticketId } = await res.json();
 *     return { ticketId, status: 'pending', createdAt: new Date().toISOString() };
 *   }}
 *
 * TODO [INTEGRATION]: Guard behind auth — check session before setOpen(true),
 *   redirect to /login if user is not signed in.
 */
export default function ListingReportButton({ listingId, target }: ListingReportButtonProps) {
  const [open, setOpen] = useState(false);

  const resolvedTarget: ReportAdTarget = {
    adId:       target?.adId       ?? listingId,
    title:      target?.title      ?? "This listing",
    thumbnail:  target?.thumbnail,
    sellerName: target?.sellerName ?? "Seller",
    location:   target?.location   ?? "",
  };

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
      />
    </>
  );
}
