"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { LaThumbnailListingCard } from "@/components/la-blocks/la-thumbnail-listing";
import type { MockListing } from "@/lib/mock/mock-listing-schema";
import { PAGE_SIZE } from "@/lib/hooks/useListingSearch";
import { useFavouritesStore } from "@/lib/stores/favouritesStore";

// ── Skeleton ──────────────────────────────────────────────────────────────────
// Derived from PAGE_SIZE so skeleton card count always matches a real page.

function SkeletonCard() {
  return (
    <div className="rounded-lg overflow-hidden bg-white">
      <div className="aspect-4/3 bg-slate-200 animate-pulse" />
      <div className="p-2 space-y-2">
        <div className="h-4   bg-slate-200 rounded animate-pulse w-2/5" />
        <div className="h-3.5 bg-slate-200 rounded animate-pulse w-5/6" />
        <div className="h-3   bg-slate-200 rounded animate-pulse w-3/4" />
        <div className="h-3   bg-slate-200 rounded animate-pulse w-1/2" />
      </div>
    </div>
  );
}

// ── Grid ──────────────────────────────────────────────────────────────────────

interface ListingGridProps {
  items: MockListing[];
  desktopFilterOpen?: boolean;
  /** True while results are loading — renders skeleton instead of real cards */
  isLoading?: boolean;
  /** Human-readable context shown above skeleton — "Searching 'flat' in Property…" */
  loadingContext?: string;
}

export default function ListingGrid({
  items,
  desktopFilterOpen = true,
  isLoading = false,
  loadingContext,
}: ListingGridProps) {
  const gridClass = cn(
    "grid grid-cols-2 md:grid-cols-4 gap-[6px]",
    desktopFilterOpen ? "lg:grid-cols-4" : "lg:grid-cols-5"
  );

  // ── Favourites — wired to store so hearts persist and header badge updates ──
  const favItems = useFavouritesStore((s) => s.items);
  const addFav   = useFavouritesStore((s) => s.add);
  const removeFav = useFavouritesStore((s) => s.remove);

  // ── Loading skeleton ───────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div>
        {loadingContext && (
          <div className="flex items-center gap-2 mb-4 py-2 px-3 bg-blue-50 border border-blue-100 rounded-lg w-fit max-w-full">
            <span className="shrink-0 size-3.5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-medium text-blue-700 truncate">{loadingContext}</span>
          </div>
        )}
        <div className={gridClass}>
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  // ── Empty state ────────────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-500">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-12 mb-3 text-slate-300">
          <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd" />
        </svg>
        <p className="text-sm font-medium">No listings found</p>
        <p className="text-sm mt-1 text-slate-500">Try a different category or remove filters</p>
      </div>
    );
  }

  // ── Results ────────────────────────────────────────────────────────────────
  return (
    <div className={gridClass}>
      {items.map((item) => {
        const isFav = favItems.some((f) => f.id === item.id);
        return (
          <Link key={item.id} href={item.href} className="block group">
            <LaThumbnailListingCard
              {...item}
              favorite={isFav}
              onFavoriteChange={(next) => {
                if (next) {
                  addFav({
                    id:            item.id,
                    image:         item.images[0] ?? { src: "" },
                    priceLabel:    item.priceLabel,
                    priceSuffix:   item.priceSuffix,
                    title:         item.title,
                    detailsLabel:  item.detailsLabel,
                    locationLabel: item.locationLabel,
                    // postedAt is ISO string in Listing — store expects unix ms
                    postedAt:      new Date(item.postedAt).getTime(),
                    status:        item.status,
                  });
                } else {
                  removeFav(item.id);
                }
              }}
            />
          </Link>
        );
      })}
    </div>
  );
}

