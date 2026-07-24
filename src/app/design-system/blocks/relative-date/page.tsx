import { LaRelativeDate } from "@/components/la-blocks/la-relative-date";

// ── Demo timestamps ───────────────────────────────────────────────────────────
const NOW = Date.now();
const S   = 1_000;
const MIN = 60 * S;
const H   = 60 * MIN;
const D   = 24 * H;

// ── Section component ─────────────────────────────────────────────────────────
function Section({ title, description, children }: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div className="space-y-0.5">
        <h2 className="text-base font-semibold text-slate-900">{title}</h2>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-card divide-y divide-slate-100">
        {children}
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-4 py-2.5">
      <span className="text-sm text-slate-500">{label}</span>
      {children}
    </div>
  );
}

import React from "react";

export default function RelativeDateBlockPage() {
  return (
    <main className="min-h-screen bg-background px-6 py-16">
      <div className="mx-auto w-full max-w-lg space-y-10">

        {/* Header */}
        <div className="space-y-1.5">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">LA blocks</p>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Relative Date</h1>
          <p className="text-sm text-muted-foreground">
            Click any label to toggle between relative time and exact date.
            Click again to revert. Use <code className="text-slate-700">relativeStyle</code> to choose
            between the compact form (&quot;2w&quot;) and the spelled-out form (&quot;2 weeks ago&quot;).
          </p>
        </div>

        {/* Use Case 1 — Within first 24 hours */}
        <Section
          title="Use Case 1 — Within first 24 hours"
          description="Seconds → minutes → hours. All output relative labels."
        >
          <Row label="Just now (10s)"><LaRelativeDate value={NOW - 10 * S} /></Row>
          <Row label="1 minute"><LaRelativeDate value={NOW - 1 * MIN} /></Row>
          <Row label="3 minutes"><LaRelativeDate value={NOW - 3 * MIN} /></Row>
          <Row label="10 minutes"><LaRelativeDate value={NOW - 10 * MIN} /></Row>
          <Row label="30 minutes"><LaRelativeDate value={NOW - 30 * MIN} /></Row>
          <Row label="1 hour"><LaRelativeDate value={NOW - 1 * H} /></Row>
          <Row label="2 hours"><LaRelativeDate value={NOW - 2 * H} /></Row>
          <Row label="8 hours"><LaRelativeDate value={NOW - 8 * H} /></Row>
          <Row label="12 hours"><LaRelativeDate value={NOW - 12 * H} /></Row>
          <Row label="23 hours"><LaRelativeDate value={NOW - 23 * H} /></Row>
        </Section>

        {/* Use Case 2 — 1d to 6d */}
        <Section
          title="Use Case 2 — Days (1d – 6d)"
          description="Elapsed 1 to 6 days. Switches to weeks at 7 days."
        >
          <Row label="1 day"><LaRelativeDate value={NOW - 1 * D} /></Row>
          <Row label="2 days"><LaRelativeDate value={NOW - 2 * D} /></Row>
          <Row label="3 days"><LaRelativeDate value={NOW - 3 * D} /></Row>
          <Row label="4 days"><LaRelativeDate value={NOW - 4 * D} /></Row>
          <Row label="5 days"><LaRelativeDate value={NOW - 5 * D} /></Row>
          <Row label="6 days"><LaRelativeDate value={NOW - 6 * D} /></Row>
        </Section>

        {/* Use Case 3 — 1w to 4w */}
        <Section
          title="Use Case 3 — Weeks (1w – 4w)"
          description="7 days to 29 days. Switches to months at 30 days."
        >
          <Row label="1 week (7 days)"><LaRelativeDate value={NOW - 7 * D} /></Row>
          <Row label="2 weeks (14 days)"><LaRelativeDate value={NOW - 14 * D} /></Row>
          <Row label="3 weeks (21 days)"><LaRelativeDate value={NOW - 21 * D} /></Row>
          <Row label="4 weeks (28 days)"><LaRelativeDate value={NOW - 28 * D} /></Row>
        </Section>

        {/* Use Case 4 — 1mo to 3mo */}
        <Section
          title="Use Case 4 — Months (1mo – 3mo)"
          description="30 days to 90 days. Switches to exact date at 91 days."
        >
          <Row label="1 month (30 days)"><LaRelativeDate value={NOW - 30 * D} /></Row>
          <Row label="2 months (60 days)"><LaRelativeDate value={NOW - 60 * D} /></Row>
          <Row label="3 months (90 days)"><LaRelativeDate value={NOW - 90 * D} /></Row>
        </Section>

        {/* Use Case 5 — relativeStyle: short vs long */}
        <Section
          title="Use Case 5 — relativeStyle: short vs long"
          description='Pass relativeStyle="long" for spelled-out labels (e.g. reviews, activity feeds). Default is "short" (e.g. thumbnail cards).'
        >
          <div className="grid grid-cols-[1fr_auto_auto] items-center gap-x-4 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            <span>Elapsed</span>
            <span>short (default)</span>
            <span>long</span>
          </div>
          <Row label="1 minute">
            <div className="flex items-center gap-6">
              <LaRelativeDate value={NOW - 1 * MIN} relativeStyle="short" />
              <LaRelativeDate value={NOW - 1 * MIN} relativeStyle="long" />
            </div>
          </Row>
          <Row label="1 hour">
            <div className="flex items-center gap-6">
              <LaRelativeDate value={NOW - 1 * H} relativeStyle="short" />
              <LaRelativeDate value={NOW - 1 * H} relativeStyle="long" />
            </div>
          </Row>
          <Row label="1 day">
            <div className="flex items-center gap-6">
              <LaRelativeDate value={NOW - 1 * D} relativeStyle="short" />
              <LaRelativeDate value={NOW - 1 * D} relativeStyle="long" />
            </div>
          </Row>
          <Row label="2 weeks">
            <div className="flex items-center gap-6">
              <LaRelativeDate value={NOW - 14 * D} relativeStyle="short" />
              <LaRelativeDate value={NOW - 14 * D} relativeStyle="long" />
            </div>
          </Row>
          <Row label="2 months">
            <div className="flex items-center gap-6">
              <LaRelativeDate value={NOW - 60 * D} relativeStyle="short" />
              <LaRelativeDate value={NOW - 60 * D} relativeStyle="long" />
            </div>
          </Row>
        </Section>

        {/* Use Case 6 — Exact date & format options */}
        <Section
          title="Use Case 6 — Exact date & format variants"
          description="Values older than 91 days always show exact date. Pass dateFormatOptions to customise the format."
        >
          <Row label='Default — { month: &quot;short&quot;, day: &quot;2-digit&quot;, year: &quot;numeric&quot; }'>
            <LaRelativeDate value={NOW - 120 * D} />
          </Row>
          <Row label='Long month — { month: &quot;long&quot;, day: &quot;numeric&quot;, year: &quot;numeric&quot; }'>
            <LaRelativeDate value={NOW - 120 * D} dateFormatOptions={{ month: "long", day: "numeric", year: "numeric" }} />
          </Row>
          <Row label='Numeric — { month: &quot;2-digit&quot;, day: &quot;2-digit&quot;, year: &quot;numeric&quot; }'>
            <LaRelativeDate value={NOW - 120 * D} dateFormatOptions={{ month: "2-digit", day: "2-digit", year: "numeric" }} />
          </Row>
          <Row label='Day + month — { day: &quot;numeric&quot;, month: &quot;short&quot; }'>
            <LaRelativeDate value={NOW - 120 * D} dateFormatOptions={{ day: "numeric", month: "short" }} />
          </Row>
          <Row label='Month + year — { month: &quot;short&quot;, year: &quot;numeric&quot; }'>
            <LaRelativeDate value={NOW - 120 * D} dateFormatOptions={{ month: "short", year: "numeric" }} />
          </Row>
          <Row label='Full weekday — { weekday: &quot;short&quot;, day: &quot;numeric&quot;, month: &quot;short&quot;, year: &quot;numeric&quot; }'>
            <LaRelativeDate value={NOW - 120 * D} dateFormatOptions={{ weekday: "short", day: "numeric", month: "short", year: "numeric" }} />
          </Row>
        </Section>

        {/* Edge cases */}
        <Section
          title="Edge Cases"
          description="Input type coverage and error fallback."
        >
          <Row label="Number timestamp"><LaRelativeDate value={NOW - 3 * D} /></Row>
          <Row label="ISO string"><LaRelativeDate value={new Date(NOW - 4 * D).toISOString()} /></Row>
          <Row label="Date object"><LaRelativeDate value={new Date(NOW - 6 * D)} /></Row>
          <Row label="Future date (edge)"><LaRelativeDate value={NOW + 3 * D} /></Row>
          <Row label='Invalid input — "not-a-date"'><LaRelativeDate value="not-a-date" /></Row>
        </Section>

      </div>
    </main>
  );
}

