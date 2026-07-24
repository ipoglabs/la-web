/**
 * Avatar — la design system avatar
 * Displays a user avatar with optional image, initials fallback, status dot, and shape variant.
 *
 * ─────────────────────────────────────────────────────────────
 * IMPORT
 * ─────────────────────────────────────────────────────────────
 *   import { Avatar } from "@/components/avatar/Avatar";
 *
 * ─────────────────────────────────────────────────────────────
 * WITH IMAGE
 * ─────────────────────────────────────────────────────────────
 *   <Avatar src="/img/user.jpg" alt="Jane Doe" initials="JD" size="md" status="online" />
 *
 * ─────────────────────────────────────────────────────────────
 * INITIALS ONLY
 * ─────────────────────────────────────────────────────────────
 *   <Avatar initials="KG" size="lg" status="busy" />
 *
 * ─────────────────────────────────────────────────────────────
 * PROPS REFERENCE
 * ─────────────────────────────────────────────────────────────
 *   src?       string                     Image URL. Falls back to initials on error.
 *   alt?       string                     Alt text for the image.
 *   initials?  string                     1–2 characters shown when no image (default "?").
 *   size?      "xs"|"sm"|"md"|"lg"|"xl"|"2xl"  Visual size (default "md").
 *   status?    "online"|"busy"|"offline"|"none"  Status dot colour (default "none").
 *   shape?     "circle"|"rounded"         Border-radius variant (default "circle").
 *   ring?      boolean                    Subtle grey ring + white gap around the avatar (default false).
 *   className? string                     Extra classes on the root element.
 */
"use client";
import * as React from "react";
import { UserIcon } from "@heroicons/react/24/solid";
import { cn } from "@/lib/utils";

export type AvatarSize   = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
export type AvatarStatus = "online" | "busy" | "offline" | "none";
export type AvatarShape  = "circle" | "rounded";

export interface AvatarProps {
  src?:       string;
  alt?:       string;
  initials?:  string;
  size?:      AvatarSize;
  status?:    AvatarStatus;
  shape?:     AvatarShape;
  ring?:      boolean;
  className?: string;
}

/* ─── size tokens ──────────────────────────────────────────── */
/* `dotOffset` nudges the status dot inward from the bottom-right corner so
   it sits on the circle's curve instead of floating in the square bounding
   box's empty corner (only visible at larger sizes). */
const sizeMap: Record<AvatarSize, { container: string; text: string; dot: string; dotOffset: string }> = {
  xs: { container: "h-6 w-6",   text: "text-sm font-semibold",  dot: "h-2 w-2 ring-[1.5px]",  dotOffset: "bottom-0 right-0" },
  sm: { container: "h-8 w-8",   text: "text-sm font-semibold",  dot: "h-2.5 w-2.5 ring-2",    dotOffset: "bottom-0 right-0" },
  md: { container: "h-10 w-10", text: "text-sm font-medium",       dot: "h-3 w-3 ring-2",        dotOffset: "bottom-0.5 right-0.5" },
  lg: { container: "h-12 w-12", text: "text-base font-medium",     dot: "h-3.5 w-3.5 ring-2",    dotOffset: "bottom-0.5 right-0.5" },
  xl: { container: "h-16 w-16", text: "text-xl font-semibold",     dot: "h-4 w-4 ring-2",        dotOffset: "bottom-1 right-1" },
  "2xl": { container: "h-24 w-24 sm:h-28 sm:w-28 lg:h-32 lg:w-32", text: "text-2xl sm:text-3xl font-semibold", dot: "h-4 w-4 sm:h-5 sm:w-5 ring-2 sm:ring-[3px]", dotOffset: "bottom-1.5 right-1.5 sm:bottom-2 sm:right-2 lg:bottom-2.5 lg:right-2.5" },
};

/* ─── status colours ───────────────────────────────────────── */
const statusColor: Record<AvatarStatus, string> = {
  online:  "bg-emerald-500",
  busy:    "bg-rose-500",
  offline: "bg-slate-400",
  none:    "",
};

/* ─── shape ────────────────────────────────────────────────── */
const shapeMap: Record<AvatarShape, string> = {
  circle:  "rounded-full",
  rounded: "rounded-xl",
};

/* ─── component ────────────────────────────────────────────── */
export function Avatar({
  src,
  alt = "",
  initials = "?",
  size    = "md",
  status  = "none",
  shape   = "circle",
  ring    = false,
  className,
}: AvatarProps) {
  const [imgError, setImgError] = React.useState(false);
  // React-recommended "render-time derived state" pattern:
  // Reset imgError inline during render when src changes — avoids an effect.
  const [prevSrc, setPrevSrc] = React.useState(src);
  if (prevSrc !== src) {
    setPrevSrc(src);
    setImgError(false);
  }

  const showImage = Boolean(src) && !imgError;
  const { container, text, dot, dotOffset } = sizeMap[size];
  const shapeClass = shapeMap[shape];

  return (
    <div className={cn("relative inline-flex shrink-0", className)}>
      <div
        className={cn(
          container,
          shapeClass,
          "flex items-center justify-center overflow-hidden select-none",
          showImage ? "bg-transparent" : "bg-slate-200 text-slate-700",
          ring && "ring-2 ring-slate-200 ring-offset-2 ring-offset-white",
        )}
      >
        {showImage ? (
          // Avatar uses <img> (not next/image): src is a dynamic user URL and
          // we need the onError fallback. next/image requires explicit dims.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt}
            className="h-full w-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : initials === "?" ? (
          <UserIcon aria-hidden="true" className="w-[62%] h-[62%] text-slate-500" />
        ) : (
          <span className={text}>{initials.slice(0, 2).toUpperCase()}</span>
        )}
      </div>

      {status !== "none" && (
        <span
          aria-label={status}
          className={cn(
            "absolute rounded-full ring-white",
            dotOffset,
            dot,
            statusColor[status],
          )}
        />
      )}
    </div>
  );
}

