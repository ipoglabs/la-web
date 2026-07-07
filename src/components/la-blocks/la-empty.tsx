/**
 * LaEmpty — Classifieds empty state block
 *
 * Use whenever a category, search result, or list has no content yet.
 *
 * ─────────────────────────────────────────────────────────────
 * IMPORT
 * ─────────────────────────────────────────────────────────────
 *   import { LaEmpty } from "@/components/la-blocks/la-empty/LaEmpty";
 *
 * ─────────────────────────────────────────────────────────────
 * BASIC
 * ─────────────────────────────────────────────────────────────
 *   import { Car } from "lucide-react";
 *
 *   <LaEmpty
 *     icon={Car}
 *     category="Cars & Vehicles"
 *     subcategory="Sedans"
 *     title="No listings yet"
 *     description="Be the first to post a car in this category. Thousands of buyers are waiting."
 *     action={{ label: "Post an Ad", onClick: () => {} }}
 *   />
 *
 * ─────────────────────────────────────────────────────────────
 * WITH SECONDARY ACTION
 * ─────────────────────────────────────────────────────────────
 *   <LaEmpty
 *     icon={Heart}
 *     category="Favourites"
 *     title="Nothing saved yet"
 *     description="Tap the heart on any listing to save it here for later."
 *     action={{ label: "Browse Listings", onClick: () => {} }}
 *     secondaryAction={{ label: "Go Home", onClick: () => {} }}
 *   />
 *
 * ─────────────────────────────────────────────────────────────
 * INTENT — changes the icon background tint
 * ─────────────────────────────────────────────────────────────
 *   "default" | "blue" | "amber" | "rose" | "green" | "purple"
 *
 * ─────────────────────────────────────────────────────────────
 * SIZE
 * ─────────────────────────────────────────────────────────────
 *   "md" (default) | "sm"
 *
 * ─────────────────────────────────────────────────────────────
 * PROPS REFERENCE
 * ─────────────────────────────────────────────────────────────
 *   icon              LucideIcon              Lucide icon component (not JSX — pass the ref).
 *   category?         string                  Main category label (shown as badge).
 *   subcategory?      string                  Optional sub-category (appended to badge).
 *   title?            string                  Bold headline. Defaults to "Nothing here yet".
 *   description?      string | ReactNode      Supporting copy. Defaults to generic prompt.
 *   action?           { label, onClick, href? } Primary CTA.
 *   secondaryAction?  { label, onClick, href? } Ghost secondary link.
 *   intent?           "default"|"blue"|"amber"|"rose"|"green"|"purple"
 *   size?             "md" | "sm"
 *   className?        string
 */
"use client";

import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { LaButton } from "@/components/la/la-button";
import { LaBadge } from "@/components/la/la-badge";

// ── Intent → icon well colours ────────────────────────────────
const intentStyles = {
  default: "bg-slate-100 text-slate-500",
  blue:    "bg-blue-50 text-blue-500",
  amber:   "bg-amber-50 text-amber-500",
  rose:    "bg-rose-50 text-rose-500",
  green:   "bg-green-50 text-green-600",
  purple:  "bg-purple-50 text-purple-500",
} as const;

const intentBadge = {
  default: "neutral",
  blue:    "info",
  amber:   "warning",
  rose:    "danger",
  green:   "success",
  purple:  "purple",
} as const;

export type LaEmptyIntent = keyof typeof intentStyles;

export interface LaEmptyAction {
  label: string;
  onClick?: () => void;
  href?: string;
}

export interface LaEmptyProps {
  icon: LucideIcon;
  category?: string;
  subcategory?: string;
  title?: string;
  description?: string | React.ReactNode;
  action?: LaEmptyAction;
  secondaryAction?: LaEmptyAction;
  intent?: LaEmptyIntent;
  size?: "md" | "sm";
  className?: string;
}

export function LaEmpty({
  icon: Icon,
  category,
  subcategory,
  title = "Nothing here yet",
  description = "This category is empty right now. Check back soon or be the first to post.",
  action,
  secondaryAction,
  intent = "default",
  size = "md",
  className,
}: LaEmptyProps) {
  const isSm = size === "sm";

  const badgeLabel = subcategory
    ? `${category}  ›  ${subcategory}`
    : category;

  return (
    <div
      className={cn(
        "flex flex-col items-center text-center",
        isSm ? "gap-3 py-8 px-4" : "gap-5 py-14 px-6",
        className,
      )}
    >
      {/* ── Icon well ── */}
      <div
        className={cn(
          "flex items-center justify-center rounded-2xl shrink-0",
          intentStyles[intent],
          isSm ? "size-14" : "size-20",
        )}
      >
        <Icon
          className={cn(
            "shrink-0",
            isSm ? "size-7" : "size-10",
          )}
          strokeWidth={1.5}
        />
      </div>

      {/* ── Category badge ── */}
      {badgeLabel && (
        <LaBadge
          intent={intentBadge[intent]}
          variant="soft"
          size="md"
        >
          {badgeLabel}
        </LaBadge>
      )}

      {/* ── Title ── */}
      <h3
        className={cn(
          "font-bold tracking-tight text-slate-900 -mt-1",
          isSm ? "text-base" : "text-xl",
        )}
      >
        {title}
      </h3>

      {/* ── Description ── */}
      <p
        className={cn(
          "text-slate-500 leading-relaxed max-w-xs",
          isSm ? "text-xs" : "text-sm",
        )}
      >
        {description}
      </p>

      {/* ── Actions ── */}
      {(action || secondaryAction) && (
        <div className={cn("flex flex-col items-center", isSm ? "gap-2 mt-1" : "gap-3 mt-2")}>
          {action && (
            <LaButton
              size={isSm ? "compact" : "default"}
              intent="primary"
              onClick={action.onClick}
              {...(action.href ? { as: "a", href: action.href } : {})}
            >
              {action.label}
            </LaButton>
          )}
          {secondaryAction && (
            <LaButton
              size={isSm ? "compact" : "default"}
              intent="ghost"
              onClick={secondaryAction.onClick}
              {...(secondaryAction.href ? { as: "a", href: secondaryAction.href } : {})}
            >
              {secondaryAction.label}
            </LaButton>
          )}
        </div>
      )}
    </div>
  );
}
