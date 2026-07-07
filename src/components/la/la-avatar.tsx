"use client";

/**
 * LaAvatar — la design system avatar
 * Pure visual primitive — no Radix dependency.
 *
 * Sizes:   "xs" | "sm" | "md" | "lg" | "xl"
 * Shape:   "circle" | "rounded"
 * Shows image when src provided, falls back to initials, then generic icon.
 */
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";

const avatarVariants = cva(
  "relative inline-flex shrink-0 items-center justify-center overflow-hidden bg-slate-200 font-semibold text-slate-600 select-none",
  {
    variants: {
      size: {
        xs: "w-6  h-6  text-[9px]",
        sm: "w-8  h-8  text-xs",
        md: "w-10 h-10 text-sm",
        lg: "w-12 h-12 text-base",
        xl: "w-16 h-16 text-lg",
      },
      shape: {
        circle:  "rounded-full",
        rounded: "rounded-lg",
      },
    },
    defaultVariants: {
      size: "md",
      shape: "circle",
    },
  }
);

const iconSize: Record<string, number> = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 28,
};

/** Derive up-to-2-char initials from a display name */
function getInitials(name?: string): string {
  if (!name) return "";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export interface LaAvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  src?: string;
  name?: string;
  alt?: string;
}

function LaAvatar({ src, name, alt, size = "md", shape, className, ...props }: LaAvatarProps) {
  const [imgError, setImgError] = React.useState(false);
  const initials = getInitials(name);
  const sz = iconSize[size ?? "md"];

  return (
    <div
      className={cn(avatarVariants({ size, shape }), className)}
      aria-label={alt ?? name ?? "avatar"}
      role="img"
      {...props}
    >
      {src && !imgError ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt ?? name ?? "avatar"}
          className="h-full w-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : initials ? (
        <span>{initials}</span>
      ) : (
        <User width={sz} height={sz} className="text-slate-400" />
      )}
    </div>
  );
}

// Intentionally using <img> here — avatar src is runtime/user-supplied so Next Image
// optimisation isn't applicable. Suppress lint warning at usage site if needed.

export { LaAvatar };
