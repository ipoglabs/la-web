/**
 * la-chip.tsx
 *
 * Exports:
 *   LaChip            — single dismissible chip / filter pill
 *   LaFilterChipStrip — horizontal scrollable strip of LaChips with drag-to-scroll
 */
"use client";
import * as React from "react";
import { useRef } from "react";
import { cn } from "@/lib/utils";

export interface LaChipProps {
  label: string;
  onRemove?: () => void;
  size?: "sm" | "default";
  className?: string;
}

export function LaChip({ label, onRemove, size = "default", className }: LaChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-slate-300 bg-white text-slate-700 font-medium whitespace-nowrap select-none",
        size === "sm"      && "h-6 pl-2.5 pr-1.5 text-xs",
        size === "default" && "h-8 pl-3 pr-2 text-sm",
        className
      )}
    >
      {label}
      {onRemove && (
        <button
          type="button"
          aria-label={`Remove ${label}`}
          onClick={onRemove}
          className={cn(
            "flex items-center justify-center rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors",
            size === "sm"      && "size-3.5",
            size === "default" && "size-4"
          )}
        >
          {/* × icon */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-full">
            <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
          </svg>
        </button>
      )}
    </span>
  );
}

// ── LaFilterChipStrip ─────────────────────────────────────────────────────────
// Self-contained horizontally scrollable strip of dismissible chips.
// Supports mouse drag-to-scroll (click + hold + drag) as well as touch/trackpad.
//
// Usage:
//   <LaFilterChipStrip
//     filters={[{ id: "type", label: "Apartment" }, ...]}
//     onRemove={(id) => removeFilter(id)}
//   />

export interface FilterItem {
  id: string;
  label: string;
}

export interface LaFilterChipStripProps {
  filters: FilterItem[];
  onRemove: (id: string) => void;
  size?: LaChipProps["size"];
  className?: string;
}

export function LaFilterChipStrip({
  filters,
  onRemove,
  size = "default",
  className,
}: LaFilterChipStripProps) {
  const stripRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, startX: 0, scrollLeft: 0 });

  function onMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    const el = stripRef.current;
    if (!el) return;
    drag.current = { active: true, startX: e.pageX - el.offsetLeft, scrollLeft: el.scrollLeft };
    el.style.cursor = "grabbing";
    e.preventDefault();
  }
  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = stripRef.current;
    if (!el || !drag.current.active) return;
    el.scrollLeft = drag.current.scrollLeft - (e.pageX - el.offsetLeft - drag.current.startX);
  }
  function stopDrag() {
    drag.current.active = false;
    if (stripRef.current) stripRef.current.style.cursor = "grab";
  }

  if (!filters.length) return null;

  return (
    <>
      {/* Vertical separator between result count and chips */}
      <span className="flex-none mx-2 w-px h-5 bg-slate-300" aria-hidden />
      <div
        ref={stripRef}
        className={cn(
          "flex-1 min-w-0 flex items-center gap-1.5",
          "overflow-x-auto cursor-grab select-none",
          "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none",
          className
        )}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={stopDrag}
        onMouseLeave={stopDrag}
      >
        {filters.map((f) => (
          <LaChip key={f.id} label={f.label} size={size} onRemove={() => onRemove(f.id)} />
        ))}
      </div>
    </>
  );
}
