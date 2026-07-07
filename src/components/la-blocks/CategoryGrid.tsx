"use client";

import { useState } from "react";
import Link from "next/link";
import type { MainCategory } from "@/components/create-alert";
import { cn } from "@/lib/utils";

// ─── Per-category color style ─────────────────────────────────────────────────

type CategoryStyle = { header: string };

const CATEGORY_STYLE: Record<string, CategoryStyle> = {
  property:                 { header: "bg-blue-200"    },
  vehicles:                 { header: "bg-amber-200"   },
  jobs:                     { header: "bg-violet-200"  },
  services:                 { header: "bg-teal-200"    },
  pets:                     { header: "bg-pink-200"    },
  business:                 { header: "bg-indigo-200"  },
  community:                { header: "bg-emerald-200" },
  special_offers:           { header: "bg-rose-200"    },
  education:                { header: "bg-sky-200"     },
  health_beauty:            { header: "bg-fuchsia-200" },
  food_dining:              { header: "bg-lime-200"    },
  travel_stays:             { header: "bg-cyan-200"    },
  baby_kids:                { header: "bg-yellow-200"  },
  sports_outdoors:          { header: "bg-green-200"   },
  electronics_tech:         { header: "bg-red-200"     },
  home_furniture:           { header: "bg-stone-200"   },
  fashion_clothing:         { header: "bg-purple-200"  },
  musical_instruments:      { header: "bg-orange-200"  },
  books_media_collectibles: { header: "bg-amber-100"   },
  tickets_vouchers:         { header: "bg-violet-100"  },
  free_giveaway:            { header: "bg-yellow-100"  },
};

const DEFAULT_STYLE: CategoryStyle = { header: "bg-slate-200" };

// ─── CategoryCard ─────────────────────────────────────────────────────────────

function CategoryCard({
  category,
  isOpen,
  onToggle,
}: {
  category: MainCategory;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const style = CATEGORY_STYLE[category.id] ?? DEFAULT_STYLE;

  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden">

      {/* Header — toggle button */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className={cn(
          "w-full flex items-center justify-between gap-2.5 pl-0.5 pr-3 py-0.5",
          "border-b border-slate-200 text-left group",
          style.header,
        )}
      >
        <div className="flex items-center px-0.5 gap-2.5 min-w-0">
          {/* Icon placeholder */}
          <i className="size-14 shrink-0 rounded bg-black/10 block" aria-hidden="true" />
          <div className="min-w-0 py-1">
            <p className="text-base font-semibold text-slate-800 leading-tight truncate">{category.label}</p>
            {category.description && (
              <p className="text-sm text-slate-600 leading-snug mt-0.5 line-clamp-2">{category.description}</p>
            )}
          </div>
        </div>
        <span className="flex items-center justify-center size-7 rounded-full bg-white/70 group-hover:bg-white/90 transition-colors shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
            className={cn("size-4 text-slate-500 transition-transform duration-200", isOpen && "rotate-180")}>
            <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
          </svg>
        </span>
      </button>

      {/* Subcategory list */}
      {isOpen && (
        <ul className="bg-white divide-y divide-dashed divide-slate-200">
          {category.subcategories.map((sub) => (
            <li key={sub.id}>
              <Link
                href={`/listings?cat=${category.id}&sub=${sub.id}`}
                className="flex items-center justify-between pl-4 pr-2 py-2 text-sm text-slate-700 font-medium hover:bg-emerald-50 hover:text-emerald-800 transition-colors"
              >
                <span>{sub.label}</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-4 shrink-0 text-slate-400">
                  <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                </svg>
              </Link>
            </li>
          ))}
          <li>
            <Link
              href={`/listings?cat=${category.id}`}
              className="flex items-center justify-end gap-1 pr-3 py-2 text-sm font-medium text-slate-400 hover:text-emerald-700 transition-colors"
            >
              See all in {category.label}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-4 shrink-0">
                <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
              </svg>
            </Link>
          </li>
        </ul>
      )}
    </div>
  );
}

// ─── CategoryGrid ─────────────────────────────────────────────────────────────

interface CategoryGridProps {
  categories: MainCategory[];
  defaultOpen?: string | string[];
  initialVisible?: number;
  className?: string;
}

export default function CategoryGrid({
  categories,
  defaultOpen,
  initialVisible = 8,
  className,
}: CategoryGridProps) {
  const [openIds, setOpenIds] = useState<Set<string>>(
    () => new Set(defaultOpen ? (Array.isArray(defaultOpen) ? defaultOpen : [defaultOpen]) : []),
  );
  const [showAll, setShowAll] = useState(false);

  if (!categories.length) return null;

  const toggle = (id: string) =>
    setOpenIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const visibleCats = showAll ? categories : categories.slice(0, initialVisible);
  const hiddenCount = categories.length - initialVisible;

  return (
    <div className={cn("py-6", className)}>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {visibleCats.map((cat) => (
          <CategoryCard
            key={cat.id}
            category={cat}
            isOpen={openIds.has(cat.id)}
            onToggle={() => toggle(cat.id)}
          />
        ))}
      </div>

      {categories.length > initialVisible && (
        <div className="flex justify-center mt-6">
          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-300 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
              className={cn("size-4 transition-transform duration-200", showAll && "rotate-180")}>
              <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>
            {showAll
              ? "Show less"
              : `Show ${hiddenCount} more ${hiddenCount === 1 ? "category" : "categories"}`}
          </button>
        </div>
      )}
    </div>
  );
}
