"use client";

import LaSection from "@/components/la/la-section";
import { LaTokenRow, LaSeparator } from "@/components/la";

export default function SeperatorPage() {
  return (
    <>
    {/* ── Separator ────────────────────────────────────────────────────── */}
      <LaSection title="Separator">
        <LaTokenRow label="horizontal">
          <div className="w-full max-w-xs">
            <LaSeparator />
          </div>
        </LaTokenRow>
        <LaTokenRow label="with label">
          <div className="w-full max-w-xs">
            <LaSeparator label="or continue with" />
          </div>
        </LaTokenRow>
        <LaTokenRow label="vertical">
          <div className="flex items-center gap-4 h-8">
            <span className="text-sm text-slate-600">Left</span>
            <LaSeparator orientation="vertical" />
            <span className="text-sm text-slate-600">Right</span>
          </div>
        </LaTokenRow>
      </LaSection>
    </>
  );
}
