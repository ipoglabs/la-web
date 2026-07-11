"use client";

import { useState } from "react";
import { MessageSquarePlus } from "lucide-react";
import { FeedbackPopup } from "@/components/feedback";
import { LaButton } from "@/components/la";
import type { FeedbackPayload } from "@/components/feedback";

export default function FeedbackFeaturePage() {
  const [popupOpen, setPopupOpen] = useState(false);
  const [lastPayload, setLastPayload] = useState<FeedbackPayload | null>(null);

  const handleSubmit = (payload: FeedbackPayload) => {
    setLastPayload(payload);
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-xl px-5 py-16 space-y-12">

        {/* Page header */}
        <div>
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-slate-400 mb-2">Snippet</p>
          <h1 className="text-2xl font-bold text-slate-900">Feedback Journey</h1>
          <p className="mt-1 text-sm text-slate-500">
            Sentiment → reasons → open text. Bottom sheet on mobile, dialog on tablet+.
          </p>
        </div>

        {/* Trigger */}
        <section className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Popup trigger</p>
          <LaButton
            type="button"
            intent="secondary"
            size="default"
            onClick={() => setPopupOpen(true)}
          >
            <MessageSquarePlus className="h-4 w-4" />
            Improve Us / Feedback
          </LaButton>
          <FeedbackPopup
            open={popupOpen}
            onOpenChange={setPopupOpen}
            onSubmit={handleSubmit}
          />
        </section>

        {/* Last submitted payload preview */}
        {lastPayload && (
          <section className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Last submitted</p>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-2">
              <p className="text-sm font-semibold text-slate-900 capitalize">
                {lastPayload.sentiment}
              </p>
              <div className="space-y-1 text-xs text-slate-500 font-mono">
                {lastPayload.reasons.length > 0 && (
                  <p>reasons: [{lastPayload.reasons.join(", ")}]</p>
                )}
                {lastPayload.issueAndImprovement && (
                  <p>note: {lastPayload.issueAndImprovement}</p>
                )}
              </div>
            </div>
          </section>
        )}

      </div>
    </main>
  );
}

