// ── Email Engine — Design System Demo ────────────────────────────────────────
// Server Component — displays all email templates via /api/email-preview iframes.
// react-dom/server is isolated in the API route; this page only imports
// preview-data (mock events) and subjects (pure function) — no react-dom/server
// in the import chain.

import { PREVIEW_DATA } from "@/lib/email/preview-data";
import { getSubject } from "@/lib/email/subjects";
import { LaText } from "@/components/la";

export default function EmailEngineDemoPage() {
  return (
    <main className="min-h-screen bg-background px-6 py-12">
      <div className="mx-auto w-full max-w-4xl space-y-6">

        {/* Page header */}
        <div className="space-y-2">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Feature Engine
          </p>
          <LaText type="h2" className="text-2xl font-bold tracking-tight text-foreground">
            Email Engine — Template Preview
          </LaText>
          <LaText type="body" className="text-sm text-slate-600">
            All {PREVIEW_DATA.length} transactional email templates rendered server-side via{" "}
            <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-sm text-slate-700">
              /api/email-preview
            </code>
            . Production wire-up:{" "}
            <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-sm text-slate-700">
              sendEmail(event)
            </code>{" "}
            in any{" "}
            <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-sm text-slate-700">
              app/api/
            </code>{" "}
            route handler. Provider: Resend (needs{" "}
            <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-sm text-slate-700">
              RESEND_API_KEY
            </code>
            ).
          </LaText>
        </div>

        {/* Quick stat pills */}
        <div className="flex flex-wrap gap-2">
          <span className="rounded-md bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700">
            {PREVIEW_DATA.length} templates
          </span>
          <span className="rounded-md bg-slate-100 px-3 py-1.5 font-mono text-sm font-medium text-slate-700">
            lib/email/
          </span>
          <span className="rounded-md bg-green-50 px-3 py-1.5 text-sm font-medium text-green-700">
            TypeScript strict · discriminated union
          </span>
          <span className="rounded-md bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-700">
            Resend provider · needs API key
          </span>
        </div>

        {/* Template previews */}
        <div className="space-y-10 pt-2">
          {PREVIEW_DATA.map(({ label, event }, index) => (
            <div
              key={label}
              className="overflow-hidden rounded-xl border border-border bg-card shadow-sm"
            >
              {/* Header bar */}
              <div className="flex items-start justify-between gap-4 border-b border-border bg-slate-50 px-4 py-3">
                <div className="min-w-0 space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="shrink-0 rounded bg-slate-200 px-1.5 py-0.5 font-mono text-xs text-slate-500">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className="text-sm font-semibold text-slate-800">{label}</p>
                  </div>
                  <p className="truncate text-sm text-slate-500">
                    <span className="font-medium text-slate-600">Subject: </span>
                    {getSubject(event)}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                  HTML
                </span>
              </div>

              {/* iframe — loaded from /api/email-preview?index=N */}
              <iframe
                src={`/api/email-preview?index=${index}`}
                title={`Email preview: ${label}`}
                className="block h-176 w-full border-0"
                sandbox="allow-same-origin"
              />
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
