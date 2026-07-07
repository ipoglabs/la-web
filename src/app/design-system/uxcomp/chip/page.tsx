"use client";

import { useState } from "react";
import LaSection from "@/components/la/la-section";
import { LaChip, LaFilterChipStrip } from "@/components/la";

// ── demo data ─────────────────────────────────────────────────────────────────

const ALL_FILTERS = [
  { id: "type",      label: "Apartment" },
  { id: "beds",      label: "2 BR" },
  { id: "tenure",    label: "Freehold" },
  { id: "furnished", label: "Furnished" },
  { id: "max_price", label: "Under £2,000" },
  { id: "min_price", label: "From £800" },
  { id: "garden",    label: "Garden" },
  { id: "parking",   label: "Parking" },
  { id: "balcony",   label: "Balcony" },
  { id: "pet",       label: "Pet Friendly" },
  { id: "bills",     label: "Bills Included" },
];

// ── helpers ───────────────────────────────────────────────────────────────────

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  );
}

// ── page ──────────────────────────────────────────────────────────────────────

export default function ChipDemoPage() {
  const [active, setActive] = useState(ALL_FILTERS.slice(0, 5));
  const remove = (id: string) => setActive((prev) => prev.filter((f) => f.id !== id));
  const reset  = () => setActive(ALL_FILTERS);

  return (
    <>
      {/* ── LaChip — sizes ─────────────────────────────────────────── */}
      <LaSection title="La Chip">

        <Row label="Size — sm (h-6 / 24px)">
          <LaChip label="Apartment" size="sm" />
          <LaChip label="Furnished" size="sm" />
          <LaChip label="Pet Friendly" size="sm" />
          <LaChip label="Under £2,000" size="sm" onRemove={() => {}} />
        </Row>

        <Row label="Size — default (h-8 / 32px)">
          <LaChip label="Apartment" />
          <LaChip label="Furnished" />
          <LaChip label="Pet Friendly" />
          <LaChip label="Under £2,000" onRemove={() => {}} />
        </Row>

        <Row label="Non-dismissible (no onRemove)">
          <LaChip label="Read-only tag" />
          <LaChip label="Category" size="sm" />
        </Row>

      </LaSection>

      {/* ── LaFilterChipStrip ──────────────────────────────────────── */}
      <LaSection title="La Filter Chip Strip">

        <div className="flex flex-col gap-3">
          <p className="text-sm text-slate-500">
            Horizontally scrollable strip with drag-to-scroll (click + hold + drag). Renders nothing when empty.
          </p>

          {/* Simulated toolbar — same pattern as listings page */}
          <div className="flex items-center bg-white border border-slate-200 rounded-lg px-3 py-2 gap-2">
            <p className="text-sm font-normal flex-none">
              <span className="text-lg font-semibold">{active.length}</span>
              <span className="text-slate-500"> active filters</span>
            </p>
            <LaFilterChipStrip filters={active} onRemove={remove} />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={reset}
              className="text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-300 rounded-md px-3 py-1 transition-colors"
            >
              Reset all
            </button>
            <span className="text-xs text-slate-400 self-center">
              Remove chips individually or reset to restore all 11.
            </span>
          </div>
        </div>

      </LaSection>

      {/* ── LaFilterChipStrip — empty state ────────────────────────── */}
      <LaSection title="Strip — Empty State">
        <div className="flex flex-col gap-2">
          <p className="text-sm text-slate-500">
            When <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">filters</code> is empty, the strip (including the separator) renders nothing — no layout shift.
          </p>
          <div className="flex items-center bg-white border border-slate-200 rounded-lg px-3 py-2 gap-2">
            <p className="text-sm font-normal flex-none">
              <span className="text-lg font-semibold">0</span>
              <span className="text-slate-500"> active filters</span>
            </p>
            <LaFilterChipStrip filters={[]} onRemove={() => {}} />
          </div>
        </div>
      </LaSection>
    </>
  );
}
