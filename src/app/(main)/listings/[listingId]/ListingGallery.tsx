"use client";

import { useState, useRef, useEffect } from "react";
import { Share2 } from "lucide-react";
import { LaImageGallery } from "@/components/la-image-gallery";
import type { GalleryImageItem } from "@/components/la-image-gallery";
import { Outline_Heart_24by24, Solid_Heart_24by24 } from "@/components/icons/la-icons";
import { useFavouritesStore, type FavItem } from "@/lib/stores/favouritesStore";

interface ListingGalleryProps {
  images: GalleryImageItem[];
  price: string;
  priceSuffix?: string;
  /** Page title used in the share sheet */
  title: string;
  /** Full item shape required by the favourites store */
  favItem: FavItem;
  /** TODO [INTEGRATION]: Derive from API data (e.g. "New", "Featured", "Price Drop") */
  badge?: string;
  /**
   * Iconised spec strip shown below the price.
   * Value from Listing.detailsLabel — e.g. "3 BEDS • 2 BATHS • APARTMENT"
   */
  detailsLabel?: string;
}

export default function ListingGallery({ images, badge, price, priceSuffix, title, favItem, detailsLabel }: ListingGalleryProps) {
  const favId  = favItem.id;
  const saved  = useFavouritesStore((s) => s.items.some((i) => i.id === favId));
  const add    = useFavouritesStore((s) => s.add);
  const remove = useFavouritesStore((s) => s.remove);

  const [shareState, setShareState] = useState<"idle" | "copied">("idle");
  // Keep a ref to the timeout so we can clear it on unmount (prevents state update on unmounted component)
  const shareTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (shareTimerRef.current) clearTimeout(shareTimerRef.current);
    };
  }, []);

  async function handleShare() {
    const url = window.location.href;

    // Web Share API — pops native OS share sheet (WhatsApp, Telegram, iMessage, copy link, etc.)
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // User cancelled or share failed — swallow silently
      }
      return;
    }

    // Desktop fallback — copy link to clipboard
    try {
      await navigator.clipboard.writeText(url);
      setShareState("copied");
      shareTimerRef.current = setTimeout(() => setShareState("idle"), 2000);
    } catch {
      // Clipboard not available — nothing to do
    }
  }

  return (
    <>
      <LaImageGallery
        images={images}
        badge={badge}
        aspectRatio="16/9"
        showThumbnails
        showPhotoCount
        allowFullscreen
        transition="fade"
        showPlayPause={false}
      />

      {/* Price + specs + actions bar */}
      <div className="flex items-start gap-2 pl-4 pr-2 pt-3 pb-2">
        {/* Price + specs column */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-slate-900">{price}</span>
            {priceSuffix && <span className="text-base text-slate-500">{priceSuffix}</span>}
          </div>
          {detailsLabel && <SpecsStrip label={detailsLabel} />}
        </div>

        {/* Share */}
        <button
          type="button"
          aria-label={shareState === "copied" ? "Link copied!" : "Share listing"}
          title={shareState === "copied" ? "Link copied to clipboard!" : "Share this listing"}
          onClick={handleShare}
          className="relative size-10 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
        >
          {shareState === "copied" ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-5 text-emerald-600" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <Share2 className="size-5" aria-hidden />
          )}
        </button>

        {/* Favourite — wired to useFavouritesStore; header badge updates automatically */}
        <button
          type="button"
          aria-label={saved ? "Remove from favourites" : "Save to favourites"}
          onClick={() => saved ? remove(favItem.id) : add(favItem)}
          className="size-10 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors"
        >
          {saved ? (
            <Solid_Heart_24by24 className="size-5 text-rose-500" />
          ) : (
            <Outline_Heart_24by24 className="size-5 text-slate-600" />
          )}
        </button>
      </div>
    </>
  );
}

// ── Specs strip ───────────────────────────────────────────────────────────────
// Renders detailsLabel (e.g. "3 BEDS • 2 BATHS • APARTMENT") as iconised chips.

function SpecsStrip({ label }: { label: string }) {
  const segments = label.split(/[•·]/).map((s) => s.trim()).filter(Boolean);
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
      {segments.map((seg, i) => (
        <span key={i} className="flex items-center gap-1 text-sm font-semibold text-slate-600 tracking-wide">
          <SpecIcon segment={seg} />
          {seg}
        </span>
      ))}
    </div>
  );
}

function SpecIcon({ segment }: { segment: string }) {
  const s = segment.toUpperCase();

  // Beds
  if (s.includes("BED")) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
        className="size-3.5 shrink-0 text-slate-500" aria-hidden="true">
        {/* Simplified bed silhouette */}
        <path d="M2 11V8.5A1.5 1.5 0 0 1 3.5 7h13A1.5 1.5 0 0 1 18 8.5V11h1v3H1v-3h1Zm2-4V5.5A.5.5 0 0 1 4.5 5h4a.5.5 0 0 1 .5.5V7H4Zm6 0V5.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5V7h-5Z" />
      </svg>
    );
  }

  // Baths
  if (s.includes("BATH")) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
        className="size-3.5 shrink-0 text-slate-500" aria-hidden="true">
        {/* Bath / shower icon */}
        <path fillRule="evenodd" d="M3 10.5a.5.5 0 0 0-.5.5v1A2.5 2.5 0 0 0 5 14.5h10a2.5 2.5 0 0 0 2.5-2.5V11a.5.5 0 0 0-.5-.5H3ZM5 5a1 1 0 0 1 1-1h.5a.5.5 0 0 1 .5.5V9H5V5Zm3 4V4.5a.5.5 0 0 1 .5-.5H9v5H8Z" clipRule="evenodd" />
      </svg>
    );
  }

  // Property type (apartment, flat, house, studio, room, villa)
  if (/APARTMENT|FLAT|HOUSE|STUDIO|ROOM|VILLA|BUNGALOW|MAISONETTE|COTTAGE/.test(s)) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
        className="size-3.5 shrink-0 text-slate-500" aria-hidden="true">
        {/* Building2 / home icon (Heroicons 20 mini home-modern) */}
        <path fillRule="evenodd" d="M1 2.75A.75.75 0 0 1 1.75 2h10.5a.75.75 0 0 1 0 1.5H12v13.75a.25.25 0 0 1-.25.25h-8.5A.25.25 0 0 1 3 17.25V3.5h-.25A.75.75 0 0 1 1 2.75ZM5 4a.75.75 0 0 0 0 1.5h1A.75.75 0 0 0 6 4H5Zm-.75 3.5A.75.75 0 0 1 5 6.75h1a.75.75 0 0 1 0 1.5H5a.75.75 0 0 1-.75-.75ZM5 10a.75.75 0 0 0 0 1.5h1a.75.75 0 0 0 0-1.5H5Zm3-6a.75.75 0 0 0 0 1.5h1A.75.75 0 0 0 9 4H8Zm-.75 3.5A.75.75 0 0 1 8 6.75h1a.75.75 0 0 1 0 1.5H8a.75.75 0 0 1-.75-.75ZM8 10a.75.75 0 0 0 0 1.5h1a.75.75 0 0 0 0-1.5H8Zm5.04 1.44A.75.75 0 0 0 12.3 11H12v6.25c0 .138.112.25.25.25H17a.75.75 0 0 0 .75-.75v-4.5a3 3 0 0 0-4.71-2.56Z" clipRule="evenodd" />
      </svg>
    );
  }

  // Mileage / distance
  if (/MILE|KM|KILOMETER/.test(s)) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
        className="size-3.5 shrink-0 text-slate-500" aria-hidden="true">
        {/* Gauge / speedometer */}
        <path fillRule="evenodd" d="M10 2a8 8 0 1 0 0 16A8 8 0 0 0 10 2ZM4.34 7.07a6.5 6.5 0 0 1 9.31-2.42.75.75 0 1 1-.84 1.24A5 5 0 0 0 5.59 8.13.75.75 0 0 1 4.34 7.07ZM10 5.5a.75.75 0 0 1 .75.75v3.19l2.28 2.28a.75.75 0 1 1-1.06 1.06l-2.5-2.5A.75.75 0 0 1 9.25 9.75V6.25A.75.75 0 0 1 10 5.5Z" clipRule="evenodd" />
      </svg>
    );
  }

  // Vehicles
  if (/CAR|VAN|TRUCK|SUV|HATCHBACK|SEDAN|COUPE|ESTATE|MPV|MOTORCYCLE|BIKE/.test(s)) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
        className="size-3.5 shrink-0 text-slate-500" aria-hidden="true">
        {/* Simplified car/vehicle icon */}
        <path d="M6.5 3A1.5 1.5 0 0 0 5.06 4.06L4 7H2.5A1.5 1.5 0 0 0 1 8.5v4A1.5 1.5 0 0 0 2.5 14H3a2 2 0 0 0 4 0h6a2 2 0 0 0 4 0h.5A1.5 1.5 0 0 0 19 12.5v-4A1.5 1.5 0 0 0 17.5 7H16l-1.06-2.94A1.5 1.5 0 0 0 13.5 3h-7ZM5 14a1 1 0 1 1 2 0 1 1 0 0 1-2 0Zm8 0a1 1 0 1 1 2 0 1 1 0 0 1-2 0Z" />
      </svg>
    );
  }

  return null;
}
