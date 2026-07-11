"use client";

import { FeedbackJourney } from "@/components/feedback";

export default function FeedbackSnippetPage() {
  return (
    <main className="min-h-screen bg-slate-100 flex items-start justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <FeedbackJourney />
      </div>
    </main>
  );
}

