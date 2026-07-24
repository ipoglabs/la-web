// UNUSED — share and favourite actions are now handled inside ListingGallery.tsx.
// Safe to delete once confirmed no other consumer exists.
"use client";

import { useState, useRef, useEffect } from "react";
import { Share2 } from "lucide-react";
import { Outline_Heart_24by24, Solid_Heart_24by24 } from "@/components/icons/la-icons";
import { useFavouritesStore, type FavItem } from "@/lib/stores/favouritesStore";

interface ListingActionsProps {
  price: string;
  priceSuffix?: string;
  /** Page title used in the share sheet */
  title: string;
  /** Full item shape required by the favourites store */
  favItem: FavItem;
}

export default function ListingActions({ price, priceSuffix, title, favItem }: ListingActionsProps) {
  // Use items directly in the selector — avoids calling get() inside a selector (Zustand anti-pattern)
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
    <div className="flex items-center gap-2 pl-4 pr-2 pt-3 pb-2">
      {/* Price */}
      <div className="flex-1 min-w-0">
        <span className="text-2xl font-bold text-slate-900">{price}</span>
        {priceSuffix && <span className="text-base text-slate-500 ml-1">{priceSuffix}</span>}
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
          <Share2 className="size-5" />
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
  );
}
