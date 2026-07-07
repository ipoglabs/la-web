"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetCloseButton,
} from "@/components/ui/sheet";
import Timeline from "@/components/timeline/Timeline";
import { TIMELINE_EVENTS } from "@/lib/data/timeline-events";

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TimelinePage() {
  const [open, setOpen] = useState(false);

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-3 px-6">
      <p className="text-xs font-mono uppercase tracking-[0.2em] text-slate-400">Snippet</p>
      <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Timeline</h1>
      <p className="text-sm text-slate-500 text-center max-w-xs leading-relaxed">
        Release history, milestones and product journey — last 5&nbsp;years.
      </p>

      <button
        onClick={() => setOpen(true)}
        className="mt-3 inline-flex items-center gap-2 bg-slate-900 text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow hover:bg-slate-700 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="size-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
        Timeline
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent>
          <SheetHeader>
            <div>
              <SheetTitle>Product Timeline</SheetTitle>
              <SheetDescription>5 years · releases, features &amp; milestones</SheetDescription>
            </div>
            <SheetCloseButton />
          </SheetHeader>

          {/* Scrollable timeline body */}
          <div className="flex-1 overflow-y-auto overscroll-contain">
            <Timeline events={TIMELINE_EVENTS} />
          </div>
        </SheetContent>
      </Sheet>
    </main>
  );
}
