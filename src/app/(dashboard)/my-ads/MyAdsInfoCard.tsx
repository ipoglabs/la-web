/**
 * MyAdsInfoCard: page-local reference-card wrapper for /myads.
 * Co-located (only ever used by MyAdsPage's status legend + Good To Know
 * sections) per the co-location rule. Gives both a single, consistent
 * title/subtitle/card style so only the content inside varies.
 *
 * Collapsed by default: reference content is opt-in, expanded by tapping
 * the header. The plus/minus icon is a visual indicator only, the whole
 * header row is the actual (large) touch target.
 */
"use client";

import { useId, useState, type ReactNode } from "react";
import { Minus, Plus } from "lucide-react";

export interface MyAdsInfoCardProps {
  title: string;
  /** Small decorative element rendered right next to the title (e.g. colour dots). Purely cosmetic. */
  titleAdornment?: ReactNode;
  subtitle?: string;
  itemCount?: number;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function MyAdsInfoCard({ title, titleAdornment, subtitle, itemCount, children, defaultOpen = false }: MyAdsInfoCardProps) {
  const [open, setOpen] = useState(defaultOpen);
  const contentId = useId();

  return (
    <div className="rounded-xl border border-slate-400 bg-white p-5">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={contentId}
        className="-m-2 flex w-full items-start justify-between gap-3 rounded-lg p-2 text-left cursor-pointer transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
      >
        <div>
          <p className="flex items-center gap-2 text-xl font-semibold text-slate-700 mb-0.5">
            <span>
              {title}
              {itemCount !== undefined && (
                <span className="text-sm italic font-normal text-slate-500"> ({itemCount} {itemCount === 1 ? "item" : "items"})</span>
              )}
            </span>
            {titleAdornment}
          </p>
          {subtitle && <p className="text-lg text-slate-700">{subtitle}</p>}
        </div>
        <div className="mt-1 flex shrink-0 items-center gap-2 -mr-5">
          <span
            aria-hidden="true"
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-700"
          >
            {open ? <Minus className="size-4" /> : <Plus className="size-4" />}
          </span>
        </div>
      </button>
      {open && <div id={contentId} className="mt-4">{children}</div>}
    </div>
  );
}

