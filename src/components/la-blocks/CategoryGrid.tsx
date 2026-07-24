"use client";

import { useState } from "react";
import Link from "next/link";
import type { CategoryItem } from "@/config/categories";
import { resolveCardColor, resolveCardIcon } from "@/config/categories/visuals";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { useCountryConfig } from "@/lib/hooks/useCountryConfig";
import { cn } from "@/lib/utils";

const VISIBLE_SUBS = 6;

// TODO [INTEGRATION]: Replace static CATEGORIES prop with a server-fetched list.
// API shape expected: GET /api/categories?country={code} → CategoryItem[]
// Until then, the parent (app/page.tsx) filters CATEGORIES by country config.

// TODO [INTEGRATION]: Add a skeleton/loading state for when categories are being fetched.
// Suggest: render N ghost cards (matching initialVisible) with pulse animation.

// ─── CategoryCard ─────────────────────────────────────────────────────────────

function CategoryCard({ category }: { category: CategoryItem }) {
  const { countryCode } = useCountryConfig();
  const [expanded, setExpanded] = useState(false);
  const subs = category.subcategories;
  const visible = expanded ? subs : subs.slice(0, VISIBLE_SUBS);
  const hiddenCount = subs.length - VISIBLE_SUBS;
  const hasMore = subs.length > VISIBLE_SUBS;
  const style = resolveCardColor(category.color);
  const Icon = resolveCardIcon(category.cardIcon);

  return (
    <div className="rounded-xl overflow-hidden shadow-sm border border-stone-300 bg-white">

      {/* Header */}
      <div className={cn("relative flex items-center gap-2.5 px-2.5 py-2", style.header)}>
        <div className="absolute inset-0 bg-linear-to-b from-transparent to-white/10 pointer-events-none" />
        {Icon && <Icon className={cn("relative z-10 size-9 shrink-0", style.text)} />}
        <div className="relative z-10 flex-1 min-w-0">
          <p className={cn("text-sm font-semibold leading-tight truncate", style.text)}>
            {category.label}
          </p>
          {category.description && (
            <p className={cn("text-xs font-medium leading-snug mt-0.5 opacity-80 truncate", style.text)}>
              {category.description}
            </p>
          )}
        </div>
      </div>

      {/* Subcategory list */}
      <ul className="divide-y divide-dashed divide-stone-400 px-0.5">
        {visible.map((sub) => (
          <li key={sub.id} className="py-px">
            <Link
              href={`/${countryCode}/listings?cat=${category.id}&sub=${sub.id}`}
              className="flex items-center justify-between px-3 py-1 text-sm text-slate-900 hover:font-semibold hover:text-emerald-800 hover:bg-emerald-100 transition-colors group rounded-md"
            >
              <span className="truncate">{sub.label}</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                className="size-3 shrink-0 text-slate-400 group-hover:text-slate-600 transition-colors ml-1 flex-none">
                <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
              </svg>
            </Link>
          </li>
        ))}
      </ul>

      {/* Footer — expand / collapse + See all */}
      <div className="border-t border-stone-300 bg-stone-50 flex items-stretch divide-x divide-stone-300">
        {hasMore && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="flex-1 px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 hover:bg-stone-100 transition-colors text-left"
          >
            {expanded ? "Show less" : `+ ${hiddenCount} more`}
          </button>
        )}
        <Link
          href={`/${countryCode}/listings?cat=${category.id}`}
          className={cn(
            "flex items-center justify-end gap-0.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-stone-100 transition-colors",
            !hasMore && "flex-1",
          )}
        >
          See all
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-3">
            <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
          </svg>
        </Link>
      </div>

    </div>
  );
}

// ─── CategoryGrid ─────────────────────────────────────────────────────────────

interface CategoryGridProps {
  categories: CategoryItem[];
  initialVisible?: number;
  className?: string;
}

export default function CategoryGrid({
  categories,
  initialVisible = 8,
  className,
}: CategoryGridProps) {
  const [showAll, setShowAll] = useState(false);
  const isLg = useMediaQuery("(min-width: 1024px)");
  const isSm = useMediaQuery("(min-width: 640px)");
  const numCols = isLg ? 4 : isSm ? 3 : 2;

  if (!categories.length) return null;

  const visible = showAll ? categories : categories.slice(0, initialVisible);
  const hiddenCount = categories.length - initialVisible;

  // Distribute items across columns (left-to-right, top-to-bottom)
  const columns: CategoryItem[][] = Array.from({ length: numCols }, () => []);
  visible.forEach((cat, i) => columns[i % numCols].push(cat));

  return (
    <div className={cn("py-5 px-4", className)}>
      <div className="flex gap-3 items-start">
        {columns.map((col, colIdx) => (
          <div key={colIdx} className="flex-1 min-w-0 flex flex-col gap-3">
            {col.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        ))}
      </div>

      {categories.length > initialVisible && (
        <div className="flex justify-center mt-5">
          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-slate-300 bg-white text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:border-slate-400 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
              className={cn("size-4 transition-transform duration-200", showAll && "rotate-180")}>
              <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>
            {showAll ? "Show less" : `Show ${hiddenCount} more categories`}
          </button>
        </div>
      )}
    </div>
  );
}