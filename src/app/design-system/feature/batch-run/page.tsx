// ── Batch Run Engine — Design System Demo ────────────────────────────────────
// Server Component — no DB, no external imports with side effects.
// Mirrors the email-engine demo: one card per job, each showing inputs,
// listing evaluations, simulated trace log, and the JobRun DB record.

import type React from "react";
import { JOB_PREVIEW_DATA } from "@/lib/jobs/preview-data";
import type { JobPreviewEntry, MockListingEval, TraceLine } from "@/lib/jobs/preview-data";
import { LaText } from "@/components/la";

export default function BatchRunDemoPage() {
  return (
    <main className="min-h-screen bg-background px-6 py-12">
      <div className="mx-auto w-full max-w-4xl space-y-6">

        {/* ── Page header ─────────────────────────────────────────────────── */}
        <div className="space-y-2">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Feature Engine
          </p>
          <LaText type="h2" className="text-2xl font-bold tracking-tight text-foreground">
            Batch Run Engine — Simulated Preview
          </LaText>
          <LaText type="body" className="text-slate-600">
            {JOB_PREVIEW_DATA.length} cron jobs registered via{" "}
            <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-sm text-slate-700">node-cron</code>{" "}
            in{" "}
            <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-sm text-slate-700">instrumentation.ts</code>.{" "}
            Each card shows mock input alerts, listing evaluation results, a simulated run trace,
            and the{" "}
            <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-sm text-slate-700">JobRun</code>{" "}
            record written to DB. Wire{" "}
            <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-sm text-slate-700">MONGODB_URI</code>{" "}
            + trigger via{" "}
            <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-sm text-slate-700">POST /api/jobs/trigger</code>{" "}
            to run for real.
          </LaText>
        </div>

        {/* ── Stat pills ──────────────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-2">
          <span className="rounded-md bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700">
            {JOB_PREVIEW_DATA.length} cron jobs
          </span>
          <span className="rounded-md bg-slate-100 px-3 py-1.5 font-mono text-sm font-medium text-slate-700">
            lib/jobs/ + lib/models/
          </span>
          <span className="rounded-md bg-green-50 px-3 py-1.5 text-sm font-medium text-green-700">
            3 email types wired
          </span>
          <span className="rounded-md bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-700">
            POC — needs MONGODB_URI to run
          </span>
        </div>

        {/* ── Job cards ───────────────────────────────────────────────────── */}
        <div className="space-y-10 pt-2">
          {JOB_PREVIEW_DATA.map((job, index) => (
            <JobCard key={job.jobName} job={job} index={index} />
          ))}
        </div>

        {/* ── Developer Guide ─────────────────────────────────────────────── */}
        <div className="rounded-xl border border-blue-100 bg-blue-50 px-6 py-5 space-y-4">
          <div className="space-y-0.5">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-blue-400">Developer Guide</p>
            <p className="text-base font-semibold text-blue-900">How to run the Batch Engine for real</p>
          </div>

          <ol className="space-y-3 text-sm text-blue-800">
            <li className="flex gap-3">
              <span className="shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-blue-200 font-semibold text-blue-700">1</span>
              <span>
                <span className="font-medium">Add env vars</span> — set{" "}
                <code className="rounded bg-blue-100 px-1 py-0.5 font-mono text-slate-700">MONGODB_URI</code>,{" "}
                <code className="rounded bg-blue-100 px-1 py-0.5 font-mono text-slate-700">RESEND_API_KEY</code>, and{" "}
                <code className="rounded bg-blue-100 px-1 py-0.5 font-mono text-slate-700">CRON_SECRET</code> in{" "}
                <code className="rounded bg-blue-100 px-1 py-0.5 font-mono text-slate-700">.env.local</code>.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-blue-200 font-semibold text-blue-700">2</span>
              <span>
                <span className="font-medium">Start the dev server</span> —{" "}
                <code className="rounded bg-blue-100 px-1 py-0.5 font-mono text-slate-700">npm run dev</code>{" "}
                from the project root. Wait for{" "}
                <code className="rounded bg-blue-100 px-1 py-0.5 font-mono text-slate-700">✓ Ready on http://localhost:3000</code>.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-blue-200 font-semibold text-blue-700">3</span>
              <span>
                <span className="font-medium">Trigger a job manually</span> — send a POST request with your{" "}
                <code className="rounded bg-blue-100 px-1 py-0.5 font-mono text-slate-700">CRON_SECRET</code>:
                <pre className="mt-2 rounded-lg bg-slate-800 px-4 py-3 font-mono text-sm text-slate-100 overflow-x-auto whitespace-pre-wrap break-all">
{`curl -X POST http://localhost:3000/api/jobs/trigger \\
  -H "x-cron-secret: <your CRON_SECRET>" \\
  -H "Content-Type: application/json" \\
  -d '{"job":"alert-match"}'`}
                </pre>
              </span>
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-blue-200 font-semibold text-blue-700">4</span>
              <span>
                <span className="font-medium">Check the terminal</span> — job logs print to the Next.js server console.
                Each run writes a{" "}
                <code className="rounded bg-blue-100 px-1 py-0.5 font-mono text-slate-700">JobRun</code>{" "}
                record to MongoDB — query{" "}
                <code className="rounded bg-blue-100 px-1 py-0.5 font-mono text-slate-700">JobRun.find().sort(&#123;startedAt:-1&#125;)</code>{" "}
                to see results.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-blue-200 font-semibold text-blue-700">5</span>
              <span>
                <span className="font-medium">Cron auto-runs in production</span> — jobs are scheduled via{" "}
                <code className="rounded bg-blue-100 px-1 py-0.5 font-mono text-slate-700">node-cron</code>{" "}
                inside{" "}
                <code className="rounded bg-blue-100 px-1 py-0.5 font-mono text-slate-700">instrumentation.ts</code>.{" "}
                No extra setup needed — they fire automatically once env vars are in place.
              </span>
            </li>
          </ol>

          <p className="text-sm text-blue-600 border-t border-blue-100 pt-3">
            All job source files live in{" "}
            <code className="rounded bg-blue-100 px-1 py-0.5 font-mono text-slate-700">lib/jobs/</code>.
            Replace the mock data in{" "}
            <code className="rounded bg-blue-100 px-1 py-0.5 font-mono text-slate-700">lib/jobs/preview-data.ts</code>{" "}
            with a real{" "}
            <code className="rounded bg-blue-100 px-1 py-0.5 font-mono text-slate-700">JobRun.find()</code>{" "}
            query once{" "}
            <code className="rounded bg-blue-100 px-1 py-0.5 font-mono text-slate-700">MONGODB_URI</code>{" "}
            is wired — see the{" "}
            <code className="rounded bg-blue-100 px-1 py-0.5 font-mono text-slate-700">TODO [integration]</code>{" "}
            comment at the top of that file.
          </p>
        </div>

      </div>
    </main>
  );
}

// ── Job card ──────────────────────────────────────────────────────────────────
function JobCard({ job, index }: { job: JobPreviewEntry; index: number }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">

      {/* Header bar — mirrors email-engine style */}
      <div className="flex items-start justify-between gap-4 border-b border-border bg-slate-50 px-4 py-3">
        <div className="min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <span className="shrink-0 rounded bg-slate-200 px-1.5 py-0.5 font-mono text-xs text-slate-500">
              {String(index + 1).padStart(2, "0")}
            </span>
            <p className="font-semibold text-slate-800">{job.jobName}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded bg-blue-100 px-2 py-0.5 font-mono text-xs text-blue-700">
              {job.schedule}
            </span>
            <span className="text-sm text-slate-500">{job.scheduleLabel}</span>
            <span className="text-slate-300">·</span>
            <span className="text-sm text-slate-500">targets <span className="font-medium text-slate-600">{job.frequency}</span> alerts</span>
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
          {job.emailType}
        </span>
      </div>

      <div className="divide-y divide-border">

        {/* Description */}
        <div className="px-4 py-3">
          <p className="text-sm text-slate-600">{job.description}</p>
          <p className="mt-1 font-mono text-sm text-slate-400">{job.file}</p>
        </div>

        {/* Mock alerts */}
        <div className="px-4 py-4 space-y-3">
          <SectionLabel>Mock Input — Saved Alerts ({job.alerts.length})</SectionLabel>
          <div className="space-y-2">
            {job.alerts.map((alert) => (
              <div key={alert.id} className="rounded-lg border border-border bg-slate-50 px-4 py-3 font-mono text-sm text-slate-700 space-y-0.5">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="rounded bg-slate-200 px-1.5 py-0.5 text-slate-500">{alert.id}</span>
                  <span className="font-sans font-semibold text-slate-800">{alert.name}</span>
                  <span className={`ml-auto rounded px-1.5 py-0.5 font-sans text-sm font-medium ${alert.isActive ? "bg-green-100 text-green-700" : "bg-slate-200 text-slate-500"}`}>
                    {alert.isActive ? "active" : "paused"}
                  </span>
                </div>
                <AlertField k="userId" v={alert.userId} />
                <AlertField k="category" v={alert.category} />
                {alert.subCategory && <AlertField k="subCategory" v={alert.subCategory} />}
                {alert.keywords && <AlertField k="keywords" v={`[${alert.keywords.map(k => `"${k}"`).join(", ")}]`} />}
                {alert.location && <AlertField k="location" v={`"${alert.location}"`} />}
                {alert.priceMin !== undefined && <AlertField k="priceMin" v={`£${alert.priceMin}`} />}
                {alert.priceMax !== undefined && <AlertField k="priceMax" v={`£${alert.priceMax}`} />}
                <AlertField k="frequency" v={`"${alert.frequency}"`} />
                <AlertField k="notifyVia" v={`["${alert.notifyVia.join('", "')}"]`} />
                <AlertField k="lastMatchedListingIds" v={`[${alert.lastMatchedListingIds.length} ids]`} />
                {alert.noMatchSince && (
                  <AlertField k="noMatchSince" v={alert.noMatchSince} warn />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Listing evaluations */}
        {job.listings.length > 0 && (
          <div className="px-4 py-4 space-y-3">
            <SectionLabel>Listing Evaluation ({job.listings.length} listings checked)</SectionLabel>
            <div className="space-y-3">
              {job.listings.map((eval_) => (
                <ListingEvalCard key={eval_.listing.id} eval_={eval_} />
              ))}
            </div>
          </div>
        )}

        {/* Simulated trace */}
        <div className="px-4 py-4 space-y-3">
          <SectionLabel>Simulated Run Trace</SectionLabel>
          <TraceLog lines={job.trace} />
        </div>

        {/* JobRun DB record */}
        <div className="px-4 py-4 space-y-3">
          <SectionLabel>JobRun DB Record (_runner.ts writes this)</SectionLabel>
          <div className="rounded-lg border border-border bg-slate-900 px-4 py-3 font-mono text-sm">
            <div className="space-y-0.5">
              <JsonLine k="jobName"       v={`"${job.jobRun.jobName}"`}       color="text-green-400" />
              <JsonLine k="startedAt"     v={`"${job.jobRun.startedAt}"`}     color="text-blue-300" />
              <JsonLine k="completedAt"   v={`"${job.jobRun.completedAt}"`}   color="text-blue-300" />
              <JsonLine k="status"        v={`"${job.jobRun.status}"`}        color="text-green-400" />
              <div className="pt-0.5 text-slate-400">{"stats: {"}</div>
              <JsonLine k="  alertsProcessed" v={String(job.jobRun.stats.alertsProcessed)} color="text-amber-300" indent />
              <JsonLine k="  matchesFound"    v={String(job.jobRun.stats.matchesFound)}    color="text-amber-300" indent />
              <JsonLine k="  emailsSent"      v={String(job.jobRun.stats.emailsSent)}      color="text-amber-300" indent />
              <JsonLine k="  errors"          v={String(job.jobRun.stats.errors)}          color="text-amber-300" indent />
              <div className="text-slate-400">{"}"}</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">{children}</p>
  );
}

function AlertField({ k, v, warn }: { k: string; v: string; warn?: boolean }) {
  return (
    <div className="flex gap-1">
      <span className="text-slate-400">{k}:</span>
      <span className={warn ? "text-amber-600" : "text-slate-700"}>{v}</span>
    </div>
  );
}

function ListingEvalCard({ eval_ }: { eval_: MockListingEval }) {
  return (
    <div className={`rounded-lg border px-4 py-3 space-y-2 ${eval_.overallMatch ? "border-green-200 bg-green-50" : "border-slate-200 bg-slate-50"}`}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className={`text-base ${eval_.overallMatch ? "text-green-600" : "text-slate-400"}`}>
            {eval_.overallMatch ? "✓" : "✗"}
          </span>
          <span className="font-medium text-slate-800 text-sm">{eval_.listing.title}</span>
        </div>
        <span className="shrink-0 font-mono text-sm text-slate-400">{eval_.listing.id}</span>
      </div>
      <div className="grid grid-cols-1 gap-0.5 sm:grid-cols-2">
        {eval_.fields.map((f) => (
          <div key={f.field} className="flex items-start gap-1.5 text-sm">
            <span className={`mt-0.5 shrink-0 ${f.match ? "text-green-500" : "text-rose-500"}`}>
              {f.match ? "✓" : "✗"}
            </span>
            <span className="text-slate-500">{f.field}:</span>
            <span className="text-slate-700">{f.value}</span>
            {!f.match && (
              <span className="text-rose-400">({f.alertCriteria})</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function TraceLog({ lines }: { lines: TraceLine[] }) {
  return (
    <div className="rounded-lg border border-border bg-slate-900 px-4 py-3 font-mono text-sm space-y-0.5">
      {lines.map((line, i) => (
        <div key={i} className={TRACE_COLOR[line.level]}>
          {line.text || "\u00A0"}
        </div>
      ))}
    </div>
  );
}

// Full static class strings — required so Tailwind JIT can detect and include them
const TRACE_COLOR: Record<TraceLine["level"], string> = {
  info:    "text-slate-400",
  match:   "text-green-400",
  nomatch: "text-rose-400",
  email:   "text-blue-400",
  db:      "text-amber-300",
  result:  "text-slate-200 font-semibold",
};

function JsonLine({
  k, v, color, indent,
}: {
  k: string; v: string; color: string; indent?: boolean;
}) {
  return (
    <div className={indent ? "pl-4" : ""}>
      <span className="text-slate-400">{k}: </span>
      <span className={color}>{v}</span>
    </div>
  );
}

