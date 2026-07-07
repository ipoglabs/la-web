"use client";

import Link from "next/link";
import { LaButton, LaText } from "@/components/la";

export default function FeedbackRouteDemoPage() {
  return (
    <main className="min-h-[70vh] bg-background px-6 py-16">
      <div className="mx-auto w-full max-w-3xl space-y-6 rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="space-y-2">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">Feature Demo</p>
          <LaText type="h2" className="text-2xl font-bold tracking-tight text-foreground">
            Footer Link to Feedback Route
          </LaText>
          <LaText type="body" className="text-sm text-muted-foreground">
            This demo simulates case 1: user taps a feedback link in footer and lands on a dedicated route.
          </LaText>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <LaText type="label" as="p" className="text-sm font-medium text-slate-700">
            Mock footer
          </LaText>
          <div className="mt-3 flex items-center justify-between gap-3 border-t border-slate-200 pt-3">
            <LaText type="small" className="text-sm text-muted-foreground">
              Need to share experience?
            </LaText>
            <Link href="/feedback">
              <LaButton intent="primary-blue" size="compact">
                Give feedback
              </LaButton>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
