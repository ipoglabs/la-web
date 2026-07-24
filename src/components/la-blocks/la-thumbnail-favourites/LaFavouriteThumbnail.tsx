"use client";

/**
 * LaFavouriteThumbnail — compact horizontal listing card for the Favourites sheet.
 *
 * Shows a single primary/hero image (no carousel) with key listing info.
 * Designed to sit inside a scrollable right-side sheet or panel.
 *
 * Deliberate design decisions:
 * — No carousel. This is a saved-list card, not a browser card. One image is enough.
 * — 72×72 square thumbnail — identifiable but compact.
 * — justify-between on the info column so all 4 rows spread evenly across the image height.
 * — × remove button uses rose-50/rose-500 hover — soft destructive signal.
 *
 * Usage:
 * <LaFavouriteThumbnail
 *   image={{ src: "/img/img1.jpg", alt: "Villa" }}
 *   priceLabel="$4,500"
 *   priceSuffix="pcm"
 *   title="Beautiful 5 Bed Villa in Dartford"
 *   detailsLabel="3 BEDS • 2 BATHS • APARTMENT"
 *   locationLabel="Dartford, Kent"
 *   postedAt="2026-05-01T10:00:00Z"
 *   onRemove={() => removeFavourite(id)}
 * />
 */

import Image from "next/image";
import * as React from "react";
import { X } from "lucide-react";
import { Outline_MapPin_24by24 } from "@/components/icons/la-icons";
import { LaRelativeDate } from "@/components/la-blocks/la-relative-date";
import { cn } from "@/lib/utils";
import type { ListingStatus } from "@/types/listing";

export type { ListingStatus };

const STATUS_CONFIG: Partial<Record<ListingStatus, { label: string; className: string }>> = {
  closed:       { label: "Closed",     className: "bg-rose-500 text-white" },
  "off-market": { label: "Off Market", className: "bg-slate-600/90 text-white" },
};

export interface LaFavouriteThumbnailProps {
  /** Single primary/hero image. No carousel — this is a compact list card. */
  image: { src: string; alt?: string };
  priceLabel: string;
  priceSuffix?: string;
  title: string;
  detailsLabel: string;
  locationLabel: string;
  postedAt: string | number | Date;
  /** Listing status. "active" (default) shows no badge; others show a coloured overlay on the thumbnail. */
  status?: ListingStatus;
  /** Called when the user taps the × remove button. */
  onRemove?: () => void;
  className?: string;
}

export function LaFavouriteThumbnail({
  image,
  priceLabel,
  priceSuffix,
  title,
  detailsLabel,
  locationLabel,
  postedAt,
  status = "active",
  onRemove,
  className,
}: LaFavouriteThumbnailProps) {
  const [loaded, setLoaded] = React.useState(false);

  return (
    <div
      className={cn(
        "flex gap-3 py-3",
        className,
      )}
    >
      {/* Thumbnail — single primary image, no carousel */}
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-200">
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              aria-hidden="true"
              className="h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-t-slate-600"
            />
          </div>
        )}
        <Image
          src={image.src}
          alt={image.alt ?? title}
          fill
          sizes="64px"
          className={cn(
            "object-cover transition-opacity duration-200",
            loaded ? "opacity-100" : "opacity-0",
          )}
          onLoad={() => setLoaded(true)}
        />
      </div>

      {/* Info — 3 rows */}
      <div className="flex min-w-0 flex-1 flex-col gap-1 justify-center">
        {/* Row 1 — price + status badge + remove button */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 flex-1 items-center gap-1.5 flex-wrap">
            <p className="text-sm font-bold leading-tight text-slate-800 shrink-0">
              {priceLabel}
              {priceSuffix && (
                <span className="ml-1 text-sm font-medium text-slate-500">{priceSuffix}</span>
              )}
            </p>
            {status && status !== "active" && STATUS_CONFIG[status] && (
              <span
                className={cn(
                  "shrink-0 rounded px-2 py-1 text-xs font-bold uppercase leading-none tracking-wide",
                  STATUS_CONFIG[status]!.className,
                )}
              >
                {STATUS_CONFIG[status]!.label}
              </span>
            )}
          </div>
          {onRemove && (
            <button
              type="button"
              aria-label="Remove from favourites"
              onClick={onRemove}
              className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-500"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Row 2 — title */}
        <p className="line-clamp-1 text-sm font-medium leading-snug text-slate-700">{title}</p>

        {/* Row 3 — specs · location · time (all on one line) */}
        <div className="flex items-center gap-1 overflow-hidden">
          <p className="shrink-0 text-sm font-semibold uppercase tracking-wide text-slate-400">{detailsLabel}</p>
          <span className="shrink-0 text-sm text-slate-300 mx-0.5">·</span>
          <Outline_MapPin_24by24 className="h-3 w-3 shrink-0 text-slate-400" />
          <p className="min-w-0 flex-1 truncate text-sm text-slate-400">{locationLabel}</p>
          <LaRelativeDate value={postedAt} />
        </div>
      </div>
    </div>
  );
}
