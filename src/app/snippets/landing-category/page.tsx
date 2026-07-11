"use client";

import { useState } from "react";
import Link from "next/link";
import { CATEGORIES } from "@/config/categories";
import type { CategoryItem } from "@/config/categories";
import { resolveCardColor, resolveCardIcon } from "@/config/categories/visuals";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";

const VISIBLE_SUBS = 6;
const INITIAL_CARDS = 8;

// ── CategoryCard ──────────────────────────────────────────────────────────────
function CategoryCard({ category }: { category: CategoryItem }) {
  const [expanded, setExpanded] = useState(false);
  const subs = category.subcategories;
  const visible = expanded ? subs : subs.slice(0, VISIBLE_SUBS);
  const hiddenCount = subs.length - VISIBLE_SUBS;
  const hasMore = subs.length > VISIBLE_SUBS;
  const style = resolveCardColor(category.color);
  const Icon = resolveCardIcon(category.cardIcon);

  return (
    <div className="rounded-xl overflow-hidden shadow-sm border border-stone-300 bg-white">

      {/* Header — [icon] [title / description] */}
      <div className={cn("relative flex items-center gap-2.5 px-2.5 py-2", style.header)}>
        {/* Subtle dark fade overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-transparent to-white/10 pointer-events-none" />
        {Icon && <Icon className={cn("relative z-10 size-9 shrink-0", style.text)} />}
        <div className="relative z-10 flex-1 min-w-0">
          {/* Title — full width, no truncation risk */}
          <p className={cn("text-sm font-semibold leading-tight truncate", style.text)}>
            {category.label}
          </p>
          {/* Description full width, single line truncate */}
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
              href={`/listings?cat=${category.id}&sub=${sub.id}`}
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
          href={`/listings?cat=${category.id}`}
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

// ── CategoryGridNew ───────────────────────────────────────────────────────────
function CategoryGridNew({ categories }: { categories: CategoryItem[] }) {
  const [showAll, setShowAll] = useState(false);
  const isLg = useMediaQuery("(min-width: 1024px)");
  const isSm = useMediaQuery("(min-width: 640px)");
  const numCols = isLg ? 4 : isSm ? 3 : 2;

  const visible = showAll ? categories : categories.slice(0, INITIAL_CARDS);
  const hiddenCount = categories.length - INITIAL_CARDS;

  // Distribute items across columns (left-to-right, top-to-bottom)
  const columns: CategoryItem[][] = Array.from({ length: numCols }, () => []);
  visible.forEach((cat, i) => columns[i % numCols].push(cat));

  if (!categories.length) return null;

  return (
    <div className="py-5 px-4 container-app">
      <div className="flex gap-3 items-start">
        {columns.map((col, colIdx) => (
          <div key={colIdx} className="flex-1 min-w-0 flex flex-col gap-3">
            {col.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        ))}
      </div>

      {categories.length > INITIAL_CARDS && (
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

// ── Page ──────────────────────────────────────────────────────────────────────
export default function LandingCategorySnippetPage() {
  return (
    <div className="min-h-screen bg-sky-50 pb-20">

      <div className="container-app pt-8 pb-4">
        <p className="text-sm font-mono uppercase tracking-widest text-slate-400">Snippet</p>
        <h1 className="text-2xl font-bold text-slate-800 mt-1">Landing Category</h1>
        <p className="mt-2 text-sm text-slate-500">
          Always-open subcategory list. First {VISIBLE_SUBS} shown per card, expandable inline.
          Grid: 2 col → 3 col (sm) → 4 col (lg).
        </p>
      </div>

      <div className="w-full bg-sky-100 border-y border-sky-200">
        <CategoryGridNew categories={CATEGORIES} />
      </div>

    </div>
  );
}
