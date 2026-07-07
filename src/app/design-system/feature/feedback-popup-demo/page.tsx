"use client";

import { useState } from "react";
import { FeedbackJourney } from "@/components/feedback";
import { LaButton, LaText } from "@/components/la";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function FeedbackPopupDemoPage() {
  const [open, setOpen] = useState(false);

  return (
    <main className="min-h-[70vh] bg-background px-6 py-16">
      <div className="mx-auto w-full max-w-3xl space-y-6 rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="space-y-2">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">Feature Demo</p>
          <LaText type="h2" className="text-2xl font-bold tracking-tight text-foreground">
            Post Action Feedback Popup
          </LaText>
          <LaText type="body" className="text-sm text-muted-foreground">
            This demo simulates case 2: after user completes an action, we ask for quick feedback in an overlay popup.
          </LaText>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <LaText type="label" as="p" className="text-sm font-medium text-slate-700">
            Simulate post completion
          </LaText>
          <LaText type="small" className="mt-1 text-sm text-muted-foreground">
            Example: after posting an ad, open this feedback capture dialog.
          </LaText>
          <div className="mt-4">
            <LaButton intent="primary-blue" size="default" onClick={() => setOpen(true)}>
              Complete action and open feedback popup
            </LaButton>
          </div>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[calc(100%-2rem)] rounded-2xl p-0 sm:max-w-4xl" showCloseButton>
          <DialogHeader className="sr-only">
            <DialogTitle>Feedback popup</DialogTitle>
            <DialogDescription>Share quick feedback after completing an action.</DialogDescription>
          </DialogHeader>
          <FeedbackJourney className="max-w-none rounded-none border-0 shadow-none" onComplete={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </main>
  );
}
