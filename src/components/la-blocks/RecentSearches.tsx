"use client";

/**
 * RecentSearches — horizontal wrap of dismissible search pills.
 *
 * Each pill shows: category icon · search label · ✕ dismiss button
 * Clicking the pill label navigates to href.
 * Clicking ✕ removes the pill (local state only).
 *
 * Usage:
 * <RecentSearches items={popularSearches} />
 */

import * as React from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface RecentSearchItem {
  id: string;
  label: string;
  href: string;
  /** Lucide icon component or any React element */
  icon: React.ReactNode;
}

export interface RecentSearchesProps {
  items: RecentSearchItem[];
  /** Section heading. Default: "Recent Searches" */
  title?: string;
  seeAllHref?: string;
  /** Max pills to show. Defaults to 6. */
  maxVisible?: number;
  className?: string;
}

export default function RecentSearches({ items, title = "Recent Searches", seeAllHref, maxVisible = 6, className }: RecentSearchesProps) {
  const [dismissed, setDismissed] = React.useState<Set<string>>(new Set());

  const notDismissed = items.filter((item) => !dismissed.has(item.id));
  const visible = notDismissed.slice(0, maxVisible);
  const hasMore = notDismissed.length > maxVisible;

  const dismiss = React.useCallback((id: string) => {
    setDismissed((prev) => new Set(prev).add(id));
  }, []);

  const clearAll = React.useCallback(() => {
    setDismissed(new Set(items.map((item) => item.id)));
  }, [items]);

  if (visible.length === 0) return null;

  return (
    <section className={cn("bg-slate-50 border-y border-slate-200 py-5 mb-5", className)}>
      <div className="container-app">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base-plus font-semibold text-slate-800">{title}</h2>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={clearAll}
              className="text-sm font-medium text-slate-400 hover:text-slate-600 transition-colors"
            >
              Clear all
            </button>
            {seeAllHref && hasMore && (
              <Link
                href={seeAllHref}
                className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                See all →
              </Link>
            )}
          </div>
        </div>

        {/* Pills — 2-row horizontal scroll on mobile, free wrap on desktop */}
        <div className="overflow-x-auto scrollbar-none sm:overflow-visible">
          <div className="grid grid-rows-2 grid-flow-col auto-cols-auto gap-2 w-max sm:w-auto sm:flex sm:flex-wrap">
            {visible.map((item) => (
              <div
                key={item.id}
                className="flex shrink-0 items-center gap-1.5 rounded-full border border-slate-400 bg-white pl-2.5 pr-1.5 py-1.5 text-sm text-slate-700 hover:border-slate-400 hover:shadow-sm transition-colors"
              >
                {/* Icon */}
                <span className="shrink-0 text-slate-500">{item.icon}</span>

                {/* Label — navigates to search */}
                <Link
                  href={item.href}
                  className="whitespace-nowrap font-medium leading-none hover:text-slate-900 transition-colors"
                >
                  {item.label}
                </Link>

                {/* Dismiss */}
                <button
                  type="button"
                  aria-label={`Remove "${item.label}" from recent searches`}
                  onClick={() => dismiss(item.id)}
                  className="ml-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
