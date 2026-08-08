"use client";

import { useState } from "react";
import { LaCard, LaBadge, LaButton, LaSkeleton, LaTextarea } from "@/components/la";
import { listReportedAds } from "@/app/actions/admin/listReportedAds";
import { reviewReportAction } from "@/app/actions/admin/reviewReport";
import { useAsyncList } from "@/lib/hooks/useAsyncList";
import { toast } from "sonner";

const PRIORITY_INTENT: Record<string, "danger" | "warning" | "neutral"> = {
  high: "danger",
  medium: "warning",
  low: "neutral",
};

export default function AdminReportsPanel() {
  const { data: reports, error, refresh } = useAsyncList(listReportedAds, []);
  const [removedTickets, setRemovedTickets] = useState<Set<string>>(new Set());
  const [busyTicket, setBusyTicket] = useState<string | null>(null);
  const [suspendingTicket, setSuspendingTicket] = useState<string | null>(null);
  const [reason, setReason] = useState("");

  const visibleReports = reports?.filter((r) => !removedTickets.has(r.ticketId)) ?? null;

  async function handleDecision(ticketId: string, decision: "dismissed" | "actioned", resolution?: string) {
    setBusyTicket(ticketId);
    try {
      const res = await reviewReportAction(ticketId, decision, resolution);
      if (res.ok) {
        toast.success(decision === "actioned" ? "Ad suspended." : "Report dismissed.");
        setRemovedTickets((prev) => new Set(prev).add(ticketId));
        setSuspendingTicket(null);
        setReason("");
      } else {
        toast.error("Action failed.");
      }
    } finally {
      setBusyTicket(null);
    }
  }

  if (error) {
    return (
      <div className="flex flex-col items-start gap-2 p-4">
        <p className="text-sm text-rose-600">{error}</p>
        <LaButton intent="outline" size="compact" onClick={refresh}>
          Retry
        </LaButton>
      </div>
    );
  }

  if (visibleReports === null) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <LaSkeleton key={i} shape="block" className="h-24 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (visibleReports.length === 0) {
    return <p className="text-sm text-slate-500 p-4">No open reports.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {visibleReports.map((r) => (
        <LaCard key={r.ticketId} className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-16 h-16 rounded-md overflow-hidden bg-slate-100 shrink-0">
              {r.adThumbnail ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={r.adThumbnail} alt={r.adTitle} className="w-full h-full object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-sm text-slate-400">No image</div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-slate-900 truncate">{r.adTitle}</p>
                <LaBadge intent={PRIORITY_INTENT[r.priority] ?? "neutral"} variant="soft">
                  {r.priority}
                </LaBadge>
              </div>
              <p className="text-sm text-slate-500">
                {r.ticketId} · {r.sellerName} · {new Date(r.createdAt).toLocaleString()}
              </p>
              <p className="text-sm text-slate-700 mt-1">{r.issues.join(", ")}</p>
              {r.details && <p className="text-sm text-slate-500 mt-1">{r.details}</p>}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <LaButton
                intent="outline"
                size="compact"
                disabled={busyTicket === r.ticketId}
                onClick={() => handleDecision(r.ticketId, "dismissed")}
              >
                Dismiss
              </LaButton>
              <LaButton
                intent="danger"
                size="compact"
                disabled={busyTicket === r.ticketId}
                onClick={() => setSuspendingTicket(suspendingTicket === r.ticketId ? null : r.ticketId)}
              >
                Suspend ad
              </LaButton>
            </div>
          </div>

          {suspendingTicket === r.ticketId && (
            <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col gap-2">
              <LaTextarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Resolution notes (why this ad is being suspended)…"
                rows={2}
              />
              <div className="flex justify-end gap-2">
                <LaButton intent="ghost" size="compact" onClick={() => setSuspendingTicket(null)}>
                  Cancel
                </LaButton>
                <LaButton
                  intent="danger"
                  size="compact"
                  disabled={busyTicket === r.ticketId}
                  onClick={() => handleDecision(r.ticketId, "actioned", reason.trim())}
                >
                  Confirm suspend
                </LaButton>
              </div>
            </div>
          )}
        </LaCard>
      ))}
    </div>
  );
}
