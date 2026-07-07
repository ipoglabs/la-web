"use client";

/**
 * LaThumbnailListingCard — reusable classifieds thumbnail card block.
 *
 * Requirement coverage:
 * 1) Thumbnail carousel supports swipe (mobile touch) + prev/next arrow buttons (desktop hover).
 *    Image counter badge shows current position e.g. 1/18.
 * 2) Each image shows a mini spinner on grey surface until fully loaded.
 * 3) Title clamps to 1 line by default. Configurable via `titleLines` (1 | 2 | 3).
 * 4) Favourite heart is a toggle. Supports controlled (`favorite` + `onFavoriteChange`)
 *    and uncontrolled (`defaultFavorite`) usage.
 * 5) Location row is always a single truncated line based on available width.
 * 6) Posted time uses `LaRelativeDate` — click to toggle relative ↔ exact date.
 * 7) Carousel index is intentionally uncontrolled (pure internal state).
 *    No consumer needs to sync it externally.
 *
 * Minimal usage:
 * <LaThumbnailListingCard
 *   images={[{ src: "/img/img1.jpg", alt: "Villa" }]}
 *   priceLabel="$4,500"
 *   priceSuffix="pcm"
 *   title="Beautiful 5 Bed Room Villa Home"
 *   detailsLabel="3 BEDS • 2 BATHS • APARTMENT"
 *   locationLabel="Dartford, Kent, DA99JW"
 *   postedAt={listing.createdAt}
 * />
 */

import Image from "next/image";
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Outline_Heart_24by24,
  Outline_MapPin_24by24,
  Solid_Heart_24by24,
} from "@/components/icons/la-icons";
import { LaRelativeDate } from "@/components/la-blocks/la-relative-date";
import { LaButton } from "@/components/la/la-button";
import { cn } from "@/lib/utils";

export interface ListingImageItem {
  src: string;
  alt?: string;
}

// Local mirror of types/listing.ts — keep in sync.
// See types/listing.ts for the full state machine, visibility matrix, and comments.
export type ListingStatus =
  | "draft"
  | "pending"
  | "active"
  | "off-market"
  | "expired"
  | "closed"
  | "under-review"
  | "rejected"
  | "blocked"
  | "deleted";

/**
 * Badge config for every non-active status shown on the thumbnail card.
 *
 * Colours convey intent at a glance:
 *   slate  — seller-side neutral (draft, paused, expired, deleted)
 *   blue   — pending approval
 *   rose   — closed / ended
 *   amber  — needs attention (under review)
 *   red    — moderation action (rejected, blocked)
 */
const STATUS_CONFIG: Record<Exclude<ListingStatus, "active">, { label: string; className: string }> = {
  "draft":         { label: "Draft",        className: "bg-slate-400 text-white" },
  "pending":       { label: "Pending",      className: "bg-blue-500 text-white" },
  "off-market":    { label: "Off Market",  className: "bg-slate-600/90 text-white" },
  "expired":       { label: "Expired",      className: "bg-slate-500 text-white" },
  "closed":        { label: "Closed",       className: "bg-rose-500 text-white" },
  "under-review":  { label: "Under Review", className: "bg-amber-500 text-white" },
  "rejected":      { label: "Rejected",     className: "bg-red-600 text-white" },
  "blocked":       { label: "Blocked",      className: "bg-red-700 text-white" },
  "deleted":       { label: "Deleted",      className: "bg-slate-900/80 text-white" },
};

export interface LaThumbnailListingCardProps {
  images: ListingImageItem[];
  priceLabel: string;
  priceSuffix?: string;
  title: string;
  detailsLabel: string;
  locationLabel: string;
  postedAt: string | number | Date;
  className?: string;
  /** Listing status. "active" (default) shows no badge. */
  status?: ListingStatus;
  /** Controlled favourite state. Pair with `onFavoriteChange`. */
  favorite?: boolean;
  /** Initial favourite state for uncontrolled usage. */
  defaultFavorite?: boolean;
  onFavoriteChange?: (next: boolean) => void;
  /** Show location row. Defaults to true. */
  showLocation?: boolean;
  /** Show posted date/time. Defaults to true. */
  showTime?: boolean;
  /** Show beds/baths details row. Defaults to true. */
  showDetails?: boolean;
  /** Number of title lines to clamp. 1 = truncate, 2 = clamp-2, 3 = clamp-3. Defaults to 1. */
  titleLines?: 1 | 2 | 3;
}

const SWIPE_THRESHOLD = 36;

function getLoopedIndex(index: number, total: number) {
  if (total === 0) return 0;
  return ((index % total) + total) % total;
}
function useControllableBoolean(params: {
  value?: boolean;
  defaultValue: boolean;
  onChange?: (next: boolean) => void;
}) {
  const { value, defaultValue, onChange } = params;
  const [internal, setInternal] = React.useState(defaultValue);
  const isControlled = value !== undefined;
  const current = isControlled ? value : internal;

  const setCurrent = React.useCallback(
    (next: boolean) => {
      if (!isControlled) {
        setInternal(next);
      }
      onChange?.(next);
    },
    [isControlled, onChange],
  );

  return [current, setCurrent] as const;
}

export function LaThumbnailListingCard({
  images,
  priceLabel,
  priceSuffix,
  title,
  detailsLabel,
  locationLabel,
  postedAt,
  className,
  status = "active",
  defaultFavorite = false,
  favorite,
  onFavoriteChange,
  showLocation = true,
  showTime = true,
  showDetails = true,
  titleLines = 1,
}: LaThumbnailListingCardProps) {
  const totalImages = images.length;

  // Carousel index is always uncontrolled — no consumer needs to sync it.
  const [activeIndex, setActiveIndex] = React.useState(0);

  const [isFavorite, setIsFavorite] = useControllableBoolean({
    value: favorite,
    defaultValue: defaultFavorite,
    onChange: onFavoriteChange,
  });

  const [loadedIndices, setLoadedIndices] = React.useState<Record<number, true>>({});
  const dragStartX = React.useRef<number | null>(null);
  const activeImage = totalImages > 0 ? images[activeIndex] : undefined;

  const changeIndexBy = React.useCallback(
    (step: number) => {
      if (totalImages <= 1) return;
      setActiveIndex((i) => getLoopedIndex(i + step, totalImages));
    },
    [totalImages],
  );

  // ── Touch (mobile) ──────────────────────────────────────────────────────────
  const onTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    dragStartX.current = event.changedTouches[0]?.clientX ?? null;
  };

  const onTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (dragStartX.current === null) return;
    const endX = event.changedTouches[0]?.clientX ?? dragStartX.current;
    const delta = endX - dragStartX.current;
    dragStartX.current = null;
    if (Math.abs(delta) < SWIPE_THRESHOLD) return;
    if (delta < 0) changeIndexBy(1);
    else changeIndexBy(-1);
  };

  const onImageLoaded = () => {
    setLoadedIndices((prev) => ({ ...prev, [activeIndex]: true }));
  };

  const isImageLoaded = loadedIndices[activeIndex] === true;

  return (
    <article
      className={cn(
        "overflow-hidden rounded-xl border border-slate-200 bg-card shadow-sm",
        className,
      )}
    >
      <div
        className="group relative isolate aspect-4/3 bg-slate-200 select-none touch-pan-y"
        role="region"
        aria-label="Listing images"
        tabIndex={0}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") changeIndexBy(1);
          if (event.key === "ArrowLeft") changeIndexBy(-1);
        }}
      >
        {activeImage ? (
          <>
            {!isImageLoaded && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-200">
                <span
                  aria-hidden="true"
                  className="h-5 w-5 animate-spin rounded-full border-2 border-slate-400 border-t-slate-600"
                />
              </div>
            )}
            <Image
              src={activeImage.src}
              alt={activeImage.alt ?? title}
              fill
              sizes="(max-width: 640px) 100vw, 360px"
              className={cn(
                "object-cover transition-opacity duration-200",
                isImageLoaded ? "opacity-100" : "opacity-0",
              )}
              onLoad={onImageLoaded}
              priority={activeIndex === 0}
            />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-slate-500">
            No image
          </div>
        )}

        {/* Prev / Next — desktop only, appear on hover */}
        {totalImages > 1 && (
          <>
            <div className="absolute left-2 top-1/2 -translate-y-1/2 z-20 hidden sm:flex opacity-0 group-hover:opacity-100 transition-opacity">
              <LaButton
                intent="ghost"
                size="compact"
                iconOnly
                aria-label="Previous image"
                className="bg-slate-900/70 hover:bg-slate-900 text-white hover:text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  changeIndexBy(-1);
                }}
              >
                <ChevronLeft className="h-5 w-5" />
              </LaButton>
            </div>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 z-20 hidden sm:flex opacity-0 group-hover:opacity-100 transition-opacity">
              <LaButton
                intent="ghost"
                size="compact"
                iconOnly
                aria-label="Next image"
                className="bg-slate-900/70 hover:bg-slate-900 text-white hover:text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  changeIndexBy(1);
                }}
              >
                <ChevronRight className="h-5 w-5" />
              </LaButton>
            </div>
          </>
        )}

        <div className="absolute left-3 bottom-3 rounded-full bg-slate-900/75 px-2.5 py-1 text-xs font-semibold leading-none text-white">
          {totalImages === 0 ? "0/0" : `${activeIndex + 1}/${totalImages}`}
        </div>

        {/* Status badge — top-left */}
        {status !== "active" && (
          <div className="absolute left-3 top-3 z-20">
            <span className={cn(
              "rounded px-2 py-1 text-xs font-bold uppercase leading-none tracking-wide",
              STATUS_CONFIG[status].className,
            )}>
              {STATUS_CONFIG[status].label}
            </span>
          </div>
        )}

        {/* Favourite — top-right, over image */}
        <button
          type="button"
          data-pressed={isFavorite}
          aria-label={isFavorite ? "Remove from favourites" : "Add to favourites"}
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsFavorite(!isFavorite); }}
          className="absolute right-2 top-2 z-20 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/30 transition-colors hover:bg-black/50"
        >
          {isFavorite ? (
            <Solid_Heart_24by24 className="h-5 w-5 text-rose-400" />
          ) : (
            <Outline_Heart_24by24 className="h-5 w-5 text-white" />
          )}
        </button>
      </div>

      <div className="border-t border-slate-200 px-3 py-1.5 min-w-0">
        <p className="truncate text-base font-medium leading-none text-slate-800">
          {priceLabel}{priceSuffix && <span className="ml-0.5 text-sm font-medium">{priceSuffix}</span>}
        </p>
      </div>

      <div className="space-y-1 px-3 pb-3">
        <h3 className={cn(
          "text-sm font-medium leading-snug text-slate-900",
          titleLines === 1 ? "truncate" : titleLines === 2 ? "line-clamp-2" : "line-clamp-3",
        )}>
          {title}
        </h3>

        {showDetails && <p className="truncate text-sm font-semibold uppercase tracking-wide text-slate-400">{detailsLabel}</p>}

        {(showLocation || showTime) && (
          <div className="flex items-center gap-2">
            {showLocation && (
              <div className="flex min-w-0 flex-1 items-center gap-1 text-slate-500">
                <Outline_MapPin_24by24 className="h-3.5 w-3.5 shrink-0" />
                <p className="truncate text-sm">{locationLabel}</p>
              </div>
            )}
            {showTime && <LaRelativeDate value={postedAt} />}
          </div>
        )}
      </div>
    </article>
  );
}
