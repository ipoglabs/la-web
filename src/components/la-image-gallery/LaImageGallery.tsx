"use client";

/**
 * LaImageGallery — full-featured image carousel / gallery block.
 *
 * Features:
 *  - Desktop: left/right dark-circle arrow buttons (appear on hover)
 *  - Mobile: touch swipe support
 *  - Keyboard: ← → to navigate, Escape to close fullscreen
 *  - Counter badge e.g. "1 / 8" (hideable via showPhotoCount)
 *  - Status/promo badge (top-left, colour variants)
 *  - Thumbnail strip (scrollable, active thumb highlighted with rose bottom accent bar)
 *  - Pagination dots when thumbnails hidden (max 10 images; falls back to counter)
 *  - Fullscreen overlay (Expand icon → full-viewport, X to close)
 *  - Caption overlay in fullscreen per-image
 *  - Preloads ±1 neighbour images for smooth navigation
 *  - Slide or Fade transition
 *  - AutoPlay with configurable interval + play/pause button
 *  - Per-image error recovery (broken src → grey fallback tile)
 *  - Empty state when images array is empty
 *  - allowFullscreen={false} to disable fullscreen in embedded contexts
 *
 * Minimal usage:
 * <LaImageGallery images={[{ src: "https://placehold.co/900x675/334155/e2e8f0?text=Room", alt: "Room" }]} />
 */

import * as React from "react";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Play,
  Pause,
  ImageOff,
  Camera,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface GalleryImageItem {
  src: string;
  alt?: string;
  caption?: string;
}

export type GalleryBadgeVariant = "default" | "rose" | "amber" | "blue" | "green";
export type GalleryAspectRatio = "4/3" | "16/9" | "3/2" | "1/1";
export type GalleryTransition = "slide" | "fade";

export interface LaImageGalleryProps {
  images: GalleryImageItem[];
  /** Top-left promotional/status badge text */
  badge?: string;
  badgeVariant?: GalleryBadgeVariant;
  /** Aspect ratio of the main viewport. Default: "4/3" */
  aspectRatio?: GalleryAspectRatio;
  /** Show scrollable thumbnail strip. Default: true */
  showThumbnails?: boolean;
  /** Show 1/N photo counter badge. Default: true */
  showPhotoCount?: boolean;
  /** Allow detaching to fullscreen overlay. Default: true */
  allowFullscreen?: boolean;
  /** Slide (default) or fade transition between images */
  transition?: GalleryTransition;
  /** Enable auto-play slideshow */
  autoPlay?: boolean;
  /** Auto-play interval in ms. Default: 3000 */
  autoPlayInterval?: number;
  /** Show the play/pause button. Default: true */
  showPlayPause?: boolean;
  /** Fires whenever the active image index changes */
  onImageChange?: (index: number) => void;
  className?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ASPECT_CLASS: Record<GalleryAspectRatio, string> = {
  "4/3":  "aspect-[4/3]",
  "16/9": "aspect-[16/9]",
  "3/2":  "aspect-[3/2]",
  "1/1":  "aspect-square",
};

const BADGE_CLASS: Record<GalleryBadgeVariant, string> = {
  default: "bg-slate-900/80 text-white",
  rose:    "bg-rose-500 text-white",
  amber:   "bg-amber-400 text-slate-900",
  blue:    "bg-blue-600 text-white",
  green:   "bg-emerald-500 text-white",
};

const SWIPE_THRESHOLD = 36;
const MAX_DOTS = 10;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function looped(index: number, total: number) {
  if (total === 0) return 0;
  return ((index % total) + total) % total;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

/** Dark-circle nav arrow button */
function NavArrow({
  direction,
  onClick,
  className,
}: {
  direction: "prev" | "next";
  onClick: (e: React.MouseEvent) => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label={direction === "prev" ? "Previous image" : "Next image"}
      onClick={onClick}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full",
        "bg-slate-900/80 text-white shadow-md",
        "transition-all hover:bg-slate-900 hover:scale-105 active:scale-95",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white",
        className,
      )}
    >
      {direction === "prev" ? (
        <ChevronLeft className="h-5 w-5" />
      ) : (
        <ChevronRight className="h-5 w-5" />
      )}
    </button>
  );
}

// ─── GalleryImageSlot — thumbnail strip slot ─────────────────────────────────
// Module-level: stable identity across parent re-renders.
function GalleryImageSlot({ item, title }: { item: GalleryImageItem; title: string }) {
  const [status, setStatus] = React.useState<"loading" | "loaded" | "error">("loading");
  return (
    <div className="relative h-full w-full">
      {status === "loading" && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-200">
          <span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-t-slate-700" />
        </div>
      )}
      {status === "error" && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-100">
          <ImageOff className="h-4 w-4 text-slate-400" />
        </div>
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={item.src}
        alt={item.alt ?? title}
        className={cn(
          "absolute inset-0 h-full w-full object-cover transition-opacity duration-200",
          status === "loaded" ? "opacity-100" : "opacity-0",
        )}
        onLoad={() => setStatus("loaded")}
        onError={() => setStatus("error")}
      />
    </div>
  );
}

// ─── ImageSlotWithError — main carousel image slot ────────────────────────────
// Module-level: stable identity. Each slot owns its own load/error state.
interface ImageSlotWithErrorProps {
  img: GalleryImageItem;
  index: number;
  onError: (index: number) => void;
}

function ImageSlotWithError({ img, index, onError }: ImageSlotWithErrorProps) {
  const [status, setStatus] = React.useState<"loading" | "loaded" | "error">("loading");
  return (
    <div className="relative h-full w-full">
      {status === "loading" && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-800">
          <span aria-hidden="true" className="h-6 w-6 animate-spin rounded-full border-2 border-slate-500 border-t-slate-200" />
        </div>
      )}
      {status === "error" && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-slate-800">
          <ImageOff className="h-10 w-10 text-slate-500" />
          <span className="text-sm text-slate-500">Image unavailable</span>
        </div>
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={img.src}
        alt={img.alt ?? `Gallery image ${index + 1}`}
        className={cn(
          "absolute inset-0 h-full w-full object-cover transition-opacity duration-300",
          status === "loaded" ? "opacity-100" : "opacity-0",
        )}
        onLoad={() => setStatus("loaded")}
        onError={() => { setStatus("error"); onError(index); }}
      />
    </div>
  );
}

// ─── CarouselViewport props ───────────────────────────────────────────────────

interface CarouselViewportProps {
  images: GalleryImageItem[];
  activeIndex: number;
  total: number;
  transition: GalleryTransition;
  aspectRatio: GalleryAspectRatio;
  badge?: string;
  badgeVariant: GalleryBadgeVariant;
  showDots: boolean;
  showCounter: boolean;
  allowFullscreen: boolean;
  showPlayPause: boolean;
  isPlaying: boolean;
  /** true when this instance IS the fullscreen overlay viewport */
  fullscreen: boolean;
  carouselRef: React.RefObject<HTMLDivElement | null>;
  thumbsRef: React.RefObject<HTMLDivElement | null>;
  thumbItemRefs: React.MutableRefObject<(HTMLButtonElement | null)[]>;
  onPrev: () => void;
  onNext: () => void;
  onGoTo: (index: number) => void;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onMarkError: (index: number) => void;
  onSetPlaying: (v: boolean) => void;
  onSetFullscreen: (v: boolean) => void;
}

// ─── CarouselViewport — module-level, stable identity ────────────────────────

function CarouselViewport({
  images, activeIndex, total, transition, aspectRatio,
  badge, badgeVariant, showDots, showCounter, allowFullscreen,
  showPlayPause, isPlaying, fullscreen,
  carouselRef, thumbsRef, thumbItemRefs,
  onPrev, onNext, onGoTo,
  onTouchStart, onTouchEnd, onKeyDown,
  onMarkError, onSetPlaying, onSetFullscreen,
}: CarouselViewportProps) {
  return (
    <div
      ref={fullscreen ? undefined : carouselRef}
      role="region"
      aria-label="Image gallery"
      tabIndex={0}
      className={cn(
        "group relative select-none overflow-hidden outline-none",
        fullscreen ? "h-full w-full" : [ASPECT_CLASS[aspectRatio], "rounded-2xl"],
      )}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onKeyDown={onKeyDown}
    >
      {/* ── Image slides ── */}
      <div className="relative h-full w-full bg-slate-900">
        {images.map((img, i) => {
          const isActive = i === activeIndex;
          const isNeighbour = Math.abs(i - activeIndex) === 1;

          if (transition === "fade") {
            return (
              <div
                key={img.src}
                className={cn(
                  "absolute inset-0 transition-opacity duration-500",
                  isActive ? "opacity-100 z-10" : "opacity-0 z-0",
                )}
              >
                {(isActive || isNeighbour) && (
                  <ImageSlotWithError img={img} index={i} onError={onMarkError} />
                )}
              </div>
            );
          }

          const offset = i - activeIndex;
          return (
            <div
              key={img.src}
              className={cn(
                "absolute inset-0 transition-transform duration-300 ease-in-out",
                offset === 0 ? "translate-x-0" : offset > 0 ? "translate-x-full" : "-translate-x-full",
              )}
            >
              {(isActive || isNeighbour) && (
                <ImageSlotWithError img={img} index={i} onError={onMarkError} />
              )}
            </div>
          );
        })}
      </div>

      {/* ── Prev / Next arrows — desktop hover ── */}
      {total > 1 && (
        <>
          <div className="absolute left-3 top-1/2 z-20 -translate-y-1/2 hidden sm:flex opacity-0 transition-opacity group-hover:opacity-100">
            <NavArrow direction="prev" onClick={(e) => { e.stopPropagation(); onPrev(); }} />
          </div>
          <div className="absolute right-3 top-1/2 z-20 -translate-y-1/2 hidden sm:flex opacity-0 transition-opacity group-hover:opacity-100">
            <NavArrow direction="next" onClick={(e) => { e.stopPropagation(); onNext(); }} />
          </div>
        </>
      )}

      {/* ── Top-right control cluster ── */}
      <div className="absolute right-3 top-3 z-20 flex items-center gap-2">
        {!fullscreen && showPlayPause && total > 1 && (
          <button
            type="button"
            aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
            onClick={() => onSetPlaying(!isPlaying)}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full",
              "bg-slate-900/70 text-white shadow transition-all",
              "hover:bg-slate-900 hover:scale-105 active:scale-95",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white",
              "opacity-0 group-hover:opacity-100",
            )}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
        )}

        {allowFullscreen && !fullscreen && (
          <button
            type="button"
            aria-label="View fullscreen"
            onClick={() => onSetFullscreen(true)}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full",
              "bg-slate-900/70 text-white shadow transition-all",
              "hover:bg-slate-900 hover:scale-105 active:scale-95",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white",
              "opacity-0 group-hover:opacity-100",
            )}
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        )}

        {fullscreen && (
          <button
            type="button"
            aria-label="Close fullscreen"
            onClick={() => onSetFullscreen(false)}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-full",
              "bg-white/10 text-white border border-white/20 shadow-lg backdrop-blur-sm",
              "hover:bg-white/20 hover:scale-105 active:scale-95 transition-all",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white",
            )}
          >
            <X className="h-5 w-5" strokeWidth={2.5} />
          </button>
        )}
      </div>

      {/* ── Status badge — top-left ── */}
      {badge && (
        <div className="absolute left-3 top-3 z-20">
          <span className={cn(
            "rounded px-2.5 py-1 text-[11px] font-bold uppercase leading-none tracking-wide",
            BADGE_CLASS[badgeVariant],
          )}>
            {badge}
          </span>
        </div>
      )}

      {/* ── Photo counter — inline mode ── */}
      {showCounter && !fullscreen && (
        <div className="absolute bottom-3 left-3 z-20 rounded-full bg-slate-900/75 px-2.5 py-1 text-xs font-semibold leading-none text-white">
          {activeIndex + 1} / {total}
        </div>
      )}

      {/* ── Photo counter — fullscreen mode ── */}
      {fullscreen && total > 1 && (
        <div className="absolute bottom-28 left-1/2 z-20 -translate-x-1/2 rounded-full bg-slate-900/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
          {activeIndex + 1} / {total}
        </div>
      )}

      {/* ── Caption — fullscreen only ── */}
      {fullscreen && images[activeIndex]?.caption && (
        <div className="absolute bottom-36 left-0 right-0 z-20 flex justify-center px-4">
          <div className="max-w-lg rounded-xl bg-slate-900/70 px-4 py-2 text-center text-sm text-white backdrop-blur-sm">
            {images[activeIndex].caption}
          </div>
        </div>
      )}

      {/* ── Pagination dots — inline, no thumbnails, ≤10 images ── */}
      {showDots && !fullscreen && (
        <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to image ${i + 1}`}
              onClick={() => onGoTo(i)}
              className={cn(
                "rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white",
                i === activeIndex ? "h-2 w-5 bg-white shadow" : "h-2 w-2 bg-white/50 hover:bg-white/75",
              )}
            />
          ))}
        </div>
      )}

      {/* ── Thumbnail strip — fullscreen mode ── */}
      {fullscreen && total > 1 && (
        <div className="absolute bottom-0 left-0 right-0 z-20 bg-linear-to-t from-slate-950/90 to-transparent px-4 pb-4 pt-8">
          <div ref={thumbsRef} className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {images.map((img, i) => (
              <button
                key={i}
                ref={(el) => { thumbItemRefs.current[i] = el; }}
                type="button"
                aria-label={`View image ${i + 1}`}
                onClick={() => onGoTo(i)}
                className={cn(
                  "relative h-14 w-20 shrink-0 overflow-hidden rounded-lg transition-all",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400",
                  i === activeIndex ? "opacity-100" : "opacity-50 hover:opacity-80",
                )}
              >
                <GalleryImageSlot item={img} title={`Thumbnail ${i + 1}`} />
                {i === activeIndex && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.75 bg-rose-400 z-10" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── LaImageGallery — main export ────────────────────────────────────────────

export function LaImageGallery({
  images,
  badge,
  badgeVariant = "default",
  aspectRatio = "4/3",
  showThumbnails = true,
  showPhotoCount = true,
  allowFullscreen = true,
  transition = "slide",
  autoPlay = false,
  autoPlayInterval = 3000,
  showPlayPause = true,
  onImageChange,
  className,
}: LaImageGalleryProps) {
  const total = images.length;

  const [activeIndex, setActiveIndex] = React.useState(0);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [isPlaying, setIsPlaying] = React.useState(autoPlay);
  const [errorIndices, setErrorIndices] = React.useState<Set<number>>(new Set());

  const dragStartX = React.useRef<number | null>(null);
  const thumbsRef = React.useRef<HTMLDivElement | null>(null);
  const thumbItemRefs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const carouselRef = React.useRef<HTMLDivElement | null>(null);
  const intervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Stable navigation — functional setState breaks activeIndex dependency ──
  const goTo = React.useCallback(
    (index: number) => {
      if (total === 0) return;
      setActiveIndex(looped(index, total));
    },
    [total],
  );

  // Fire onImageChange on every index change (covers goTo, autoplay, keyboard nav)
  const hasMounted = React.useRef(false);
  React.useEffect(() => {
    if (!hasMounted.current) { hasMounted.current = true; return; }
    onImageChange?.(activeIndex);
  }, [activeIndex, onImageChange]);

  const prev = React.useCallback(
    () => setActiveIndex((i) => looped(i - 1, total)),
    [total],
  );

  const next = React.useCallback(
    () => setActiveIndex((i) => looped(i + 1, total)),
    [total],
  );

  // ── Auto-play ───────────────────────────────────────────────────────────────
  React.useEffect(() => {
    if (!isPlaying || total <= 1) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setActiveIndex((i) => looped(i + 1, total));
    }, autoPlayInterval);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, total, autoPlayInterval]);

  // Sync isPlaying when autoPlay prop changes externally
  React.useEffect(() => {
    setIsPlaying(autoPlay);
  }, [autoPlay]);

  // Pause when fullscreen opens
  React.useEffect(() => {
    if (isFullscreen) setIsPlaying(false);
  }, [isFullscreen]);

  // Body scroll lock — prevent background scroll when fullscreen is open
  React.useEffect(() => {
    if (isFullscreen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prevOverflow; };
    }
  }, [isFullscreen]);

  // ── Scroll active thumbnail into view ───────────────────────────────────────
  React.useEffect(() => {
    const el = thumbItemRefs.current[activeIndex];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [activeIndex]);

  // ── Touch handlers — stable refs ─────────────────────────────────────────────
  const onTouchStart = React.useCallback((e: React.TouchEvent) => {
    dragStartX.current = e.changedTouches[0]?.clientX ?? null;
  }, []);

  const onTouchEnd = React.useCallback((e: React.TouchEvent) => {
    if (dragStartX.current === null) return;
    const delta = (e.changedTouches[0]?.clientX ?? dragStartX.current) - dragStartX.current;
    dragStartX.current = null;
    if (Math.abs(delta) < SWIPE_THRESHOLD) return;
    if (delta < 0) { next(); } else { prev(); }
  }, [next, prev]);

  // ── Keyboard handlers ────────────────────────────────────────────────────────
  const onKeyDown = React.useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
    if (e.key === "Escape") setIsFullscreen(false);
  }, [next, prev]);

  // Global keyboard when fullscreen is active
  React.useEffect(() => {
    if (!isFullscreen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsFullscreen(false);
      if (e.key === "ArrowRight") setActiveIndex((i) => looped(i + 1, total));
      if (e.key === "ArrowLeft") setActiveIndex((i) => looped(i - 1, total));
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isFullscreen, total]);

  // ── Error tracking ───────────────────────────────────────────────────────────
  const markError = React.useCallback((index: number) => {
    setErrorIndices((prev) => new Set(prev).add(index));
  }, []);

  // ── Derived ─────────────────────────────────────────────────────────────────
  const showDots = !showThumbnails && total > 1 && total <= MAX_DOTS;
  const showCounter = showPhotoCount && total > 1 && !showDots;

  // ── Empty state ──────────────────────────────────────────────────────────────
  if (total === 0) {
    return (
      <div className={cn(
        "overflow-hidden rounded-2xl border border-slate-200 bg-slate-50",
        ASPECT_CLASS[aspectRatio],
        "flex flex-col items-center justify-center gap-3",
        className,
      )}>
        <Camera className="h-10 w-10 text-slate-300" />
        <p className="text-sm font-medium text-slate-400">No photos available</p>
      </div>
    );
  }

  // ── Shared viewport props ────────────────────────────────────────────────────
  const viewportProps: CarouselViewportProps = {
    images, activeIndex, total, transition, aspectRatio,
    badge, badgeVariant, showDots, showCounter, allowFullscreen,
    showPlayPause: showPlayPause && total > 1,
    isPlaying,
    fullscreen: false,
    carouselRef, thumbsRef, thumbItemRefs,
    onPrev: prev, onNext: next, onGoTo: goTo,
    onTouchStart, onTouchEnd, onKeyDown,
    onMarkError: markError,
    onSetPlaying: setIsPlaying,
    onSetFullscreen: setIsFullscreen,
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Inline carousel */}
      <div className={cn("flex flex-col gap-3", className)}>
        <CarouselViewport {...viewportProps} fullscreen={false} />

        {/* Thumbnail strip — inline mode */}
        {showThumbnails && total > 1 && (
          <div ref={thumbsRef} className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {images.map((img, i) => (
              <button
                key={i}
                ref={(el) => { thumbItemRefs.current[i] = el; }}
                type="button"
                aria-label={`View image ${i + 1}`}
                onClick={() => goTo(i)}
                className={cn(
                  "relative h-14 w-20 shrink-0 overflow-hidden rounded-lg transition-all",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400",
                  i === activeIndex ? "opacity-100" : "opacity-55 hover:opacity-85",
                )}
              >
                <GalleryImageSlot item={img} title={`Thumbnail ${i + 1}`} />
                {i === activeIndex && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.75 bg-rose-500 z-10" />
                )}
                {errorIndices.has(i) && (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-200/80">
                    <ImageOff className="h-4 w-4 text-slate-400" />
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen overlay */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-slate-950"
          role="dialog"
          aria-modal="true"
          aria-label="Image gallery fullscreen"
        >
          <div className="flex flex-1 items-center justify-center overflow-hidden">
            <div className="relative h-full w-full max-h-screen">
              <CarouselViewport {...viewportProps} fullscreen={true} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
