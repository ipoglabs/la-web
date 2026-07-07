"use client";

import { useEffect, useRef, useState } from "react";

// ─── Success Animation ────────────────────────────────────────────────────────

function SuccessAnimation() {
  return (
    <div className="relative flex items-center justify-center size-20">
      {/* Sparkle dots */}
      {[1,2,3,4,5,6].map((n) => (
        <svg key={n} className={`absolute size-2 sparkle-${n}`} viewBox="0 0 8 8">
          <circle cx="4" cy="4" r="3" fill="#22c55e" />
        </svg>
      ))}
      {/* Circle + tick */}
      <svg viewBox="0 0 48 48" className="size-16 success-circle" fill="none">
        <circle cx="24" cy="24" r="22" fill="#22c55e" />
        <path
          className="success-check"
          d="M14 24l7 7 13-13"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────

export type EventType = "launch" | "release" | "feature" | "milestone";

export interface TimelineEvent {
  id: string;
  year: number;
  date: string;
  type: EventType;
  title: string;
  description: string;
  tag?: string; // e.g. "v1.0"
  points?: string[]; // optional bullet points
}

// ─── Config ───────────────────────────────────────────────────────────────────

const BATCH = 6;

const TYPE = {
  launch: {
    dot: "bg-emerald-500",
    badge: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    label: "Launch",
  },
  release: {
    dot: "bg-blue-500",
    badge: "bg-blue-50 text-blue-700 border border-blue-200",
    label: "Release",
  },
  feature: {
    dot: "bg-violet-500",
    badge: "bg-violet-50 text-violet-700 border border-violet-200",
    label: "Feature",
  },
  milestone: {
    dot: "bg-amber-500",
    badge: "bg-amber-50 text-amber-700 border border-amber-200",
    label: "Milestone",
  },
} satisfies Record<EventType, { dot: string; badge: string; label: string }>;

// ─── Skeleton row ─────────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <div className="relative pl-8 pb-7 animate-pulse">
      <span className="absolute -left-1.25 top-1 size-2.5 rounded-full bg-slate-200" />
      <div className="flex items-center gap-2 mb-2">
        <div className="h-4 w-16 rounded-md bg-slate-200" />
        <div className="h-3 w-12 rounded bg-slate-100" />
        <div className="h-3 w-14 rounded bg-slate-100 ml-auto" />
      </div>
      <div className="h-4 w-36 rounded bg-slate-200 mb-1.5" />
      <div className="h-3 w-52 rounded bg-slate-100" />
    </div>
  );
}

// ─── Event Item ───────────────────────────────────────────────────────────────

function EventItem({ event }: { event: TimelineEvent }) {
  const cfg = TYPE[event.type];
  return (
    <div className="relative pl-8 pb-7 last:pb-2">
      {/* Timeline dot */}
      <span
        className={`absolute -left-1.25 top-1 size-2.5 rounded-full ring-2 ring-white ${cfg.dot}`}
      />

      {/* Meta row: type badge + version tag + date */}
      <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${cfg.badge}`}>
          {cfg.label}
        </span>
        {event.tag && (
          <span className="text-[10px] font-mono font-medium text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
            {event.tag}
          </span>
        )}
        <span className="text-[11px] text-slate-400 ml-auto shrink-0">{event.date}</span>
      </div>

      {/* Content */}
      <p className="text-sm font-semibold text-slate-900 leading-snug">{event.title}</p>
      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{event.description}</p>
      {event.points && event.points.length > 0 && (
        <ul className="mt-2 space-y-1">
          {event.points.map((pt, i) => (
            <li key={i} className="flex items-start gap-1.5">
              <span className="mt-1.5 size-1 rounded-full bg-slate-600 shrink-0" />
              <span className="text-xs text-slate-500 leading-relaxed">{pt}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── Year divider ─────────────────────────────────────────────────────────────

function YearDivider({ year }: { year: number }) {
  return (
    <div className="relative pl-8 pb-5 pt-2">
      {/* Larger solid dot on the track */}
      <span className="absolute -left-2.5 top-2.5 size-5 rounded-full bg-slate-900 flex items-center justify-center shadow-sm">
        <span className="size-1.5 rounded-full bg-white" />
      </span>
      {/* Year pill */}
      <span className="inline-flex items-center gap-1.5 bg-slate-900 text-white text-xs font-bold px-3 py-1 rounded-full tracking-wide shadow-sm">
        {year}
      </span>
    </div>
  );
}

// ─── Legend ───────────────────────────────────────────────────────────────────

function Legend() {
  return (
    <div className="flex flex-wrap gap-x-3 gap-y-1 mb-5">
      {(Object.entries(TYPE) as [EventType, (typeof TYPE)[EventType]][]).map(
        ([key, cfg]) => (
          <span key={key} className="flex items-center gap-1">
            <span className={`size-2 rounded-full ${cfg.dot}`} />
            <span className="text-[11px] text-slate-500">{cfg.label}</span>
          </span>
        )
      )}
    </div>
  );
}

// ─── Timeline ─────────────────────────────────────────────────────────────────

export default function Timeline({ events }: { events: TimelineEvent[] }) {
  const [visible, setVisible] = useState(BATCH);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const visibleEvents = events.slice(0, visible);
  const hasMore = visible < events.length;

  // Lazy-load next batch when sentinel enters viewport
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loading && hasMore) {
          setLoading(true);
          // Simulate async data fetch
          setTimeout(() => {
            setVisible((v) => Math.min(v + BATCH, events.length));
            setLoading(false);
          }, 700);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [loading, hasMore, events.length]);

  // All unique years in visible set, preserving order
  const years = [...new Set(visibleEvents.map((e) => e.year))];

  const totalYears = new Set(events.map((e) => e.year)).size;
  const featureCount = events.filter((e) => e.type === "feature").length;
  const releaseCount = events.filter((e) => e.type === "release").length;

  return (
    <div className="px-5 pt-3 pb-8">

      {/* ── Stats strip ── */}
      <div className="grid grid-cols-4 gap-1.5 mb-4">
        <div className="flex flex-col items-center gap-0 bg-rose-50 rounded-lg py-3 px-1">
          <span className="text-base font-bold leading-none text-rose-700">{events.length}</span>
          <span className="text-[9px] font-semibold uppercase tracking-wider text-rose-400 mt-0.5">Total</span>
        </div>
        <div className="flex flex-col items-center gap-0 bg-sky-50 rounded-lg py-3 px-1">
          <span className="text-base font-bold leading-none text-sky-700">{totalYears}<span className="text-[10px] font-semibold">yr</span></span>
          <span className="text-[9px] font-semibold uppercase tracking-wider text-sky-400 mt-0.5">Span</span>
        </div>
        <div className="flex flex-col items-center gap-0 bg-violet-50 rounded-lg py-3 px-1">
          <span className="text-base font-bold leading-none text-violet-700">{featureCount}</span>
          <span className="text-[9px] font-semibold uppercase tracking-wider text-violet-400 mt-0.5">Features</span>
        </div>
        <div className="flex flex-col items-center gap-0 bg-emerald-50 rounded-lg py-3 px-1">
          <span className="text-base font-bold leading-none text-emerald-700">{releaseCount}</span>
          <span className="text-[9px] font-semibold uppercase tracking-wider text-emerald-500 mt-0.5">Releases</span>
        </div>
      </div>

      {/* ── Legend ── */}
      <Legend />

      {/* ── Timeline track ── */}
      <div className="relative border-l-2 border-slate-100 ml-1.25">
        {years.map((year) => (
          <div key={year}>
            <YearDivider year={year} />
            {visibleEvents
              .filter((e) => e.year === year)
              .map((event) => (
                <EventItem key={event.id} event={event} />
              ))}
          </div>
        ))}

        {/* Loading skeletons */}
        {loading && (
          <>
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </>
        )}
      </div>

      {/* Sentinel — triggers next batch load when scrolled into view */}
      {hasMore && !loading && <div ref={sentinelRef} className="h-1" />}

      {/* End state */}
      {!hasMore && !loading && (
        <div className="flex flex-col items-center gap-1 pt-6 pb-2">
          <SuccessAnimation />
          <p className="text-xs font-semibold text-slate-600">You&apos;re all caught up</p>
          <p className="text-[11px] text-slate-400">
            {events.length} events · {totalYears} years
          </p>
        </div>
      )}
    </div>
  );
}
