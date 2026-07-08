/**
 * config/categories/visuals.ts
 *
 * Resolves the string keys stored in CategoryItem (color, cardIcon) into
 * actual UI values — Tailwind gradient classes + Heroicon components.
 *
 * This is the ONLY file that imports Heroicons or defines gradient strings.
 * To swap icon libraries or change gradients: edit here only.
 *
 * Usage:
 *   import { resolveCardColor, resolveCardIcon } from "@/config/categories/visuals";
 *   const style = resolveCardColor(category.color);    // { header, text }
 *   const Icon  = resolveCardIcon(category.cardIcon);  // Heroicon | null
 */
import type { ComponentType, SVGProps } from "react";
import {
  BookOpenIcon,
  BriefcaseIcon,
  BuildingOffice2Icon,
  BuildingStorefrontIcon,
  CakeIcon,
  DevicePhoneMobileIcon,
  GiftIcon,
  GlobeAltIcon,
  HeartIcon,
  HomeIcon,
  MusicalNoteIcon,
  PaperAirplaneIcon,
  PercentBadgeIcon,
  ShoppingBagIcon,
  SparklesIcon,
  TagIcon,
  TicketIcon,
  TruckIcon,
  UserGroupIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/solid";

type HeroIcon = ComponentType<SVGProps<SVGSVGElement>>;

// ── Icon resolver ─────────────────────────────────────────────────────────────

const CARD_ICONS: Record<string, HeroIcon> = {
  "home":            HomeIcon,
  "truck":           TruckIcon,
  "briefcase":       BriefcaseIcon,
  "wrench":          WrenchScrewdriverIcon,
  "sparkles":        SparklesIcon,
  "building-office": BuildingOffice2Icon,
  "users":           UserGroupIcon,
  "percent-badge":   PercentBadgeIcon,
  "book-open":       BookOpenIcon,
  "heart":           HeartIcon,
  "cake":            CakeIcon,
  "paper-airplane":  PaperAirplaneIcon,
  "gift":            GiftIcon,
  "globe":           GlobeAltIcon,
  "phone":           DevicePhoneMobileIcon,
  "storefront":      BuildingStorefrontIcon,
  "shopping-bag":    ShoppingBagIcon,
  "music-note":      MusicalNoteIcon,
  "ticket":          TicketIcon,
  "tag":             TagIcon,
};

/** Returns the Heroicon component for a cardIcon key, or null if not found. */
export function resolveCardIcon(key: string): HeroIcon | null {
  return CARD_ICONS[key] ?? null;
}

// ── Color resolver ────────────────────────────────────────────────────────────

export type CardColorStyle = {
  /** Tailwind gradient class for the card header background */
  header: string;
  /** Tailwind text colour class for text/icon on the header */
  text: string;
};

const CARD_COLORS: Record<string, CardColorStyle> = {
  blue:           { header: "bg-blue-500",    text: "text-white" },
  amber:          { header: "bg-amber-500",   text: "text-white" },
  violet:         { header: "bg-violet-500",  text: "text-white" },
  teal:           { header: "bg-teal-500",    text: "text-white" },
  pink:           { header: "bg-pink-500",    text: "text-white" },
  indigo:         { header: "bg-indigo-500",  text: "text-white" },
  emerald:        { header: "bg-emerald-500", text: "text-white" },
  rose:           { header: "bg-rose-500",    text: "text-white" },
  sky:            { header: "bg-sky-500",     text: "text-white" },
  fuchsia:        { header: "bg-fuchsia-500", text: "text-white" },
  lime:           { header: "bg-lime-500",    text: "text-white" },
  cyan:           { header: "bg-cyan-500",    text: "text-white" },
  "yellow-amber": { header: "bg-amber-400",   text: "text-white" },
  green:          { header: "bg-green-500",   text: "text-white" },
  red:            { header: "bg-red-500",     text: "text-white" },
  stone:          { header: "bg-stone-500",   text: "text-white" },
  purple:         { header: "bg-purple-500",  text: "text-white" },
  orange:         { header: "bg-orange-500",  text: "text-white" },
  yellow:         { header: "bg-yellow-500",  text: "text-white" },
};

// ── Soft pastel palette (saved for reference / A-B testing) ──────────────────
// Switch CARD_COLORS entries to these for a lighter, muted look.
// Text colour must change to "text-slate-800" when using pastel headers.
//
// blue:           { header: "bg-blue-200",    text: "text-slate-800" },
// amber:          { header: "bg-amber-200",   text: "text-slate-800" },
// violet:         { header: "bg-violet-200",  text: "text-slate-800" },
// teal:           { header: "bg-teal-200",    text: "text-slate-800" },
// pink:           { header: "bg-pink-200",    text: "text-slate-800" },
// indigo:         { header: "bg-indigo-200",  text: "text-slate-800" },
// emerald:        { header: "bg-emerald-200", text: "text-slate-800" },
// rose:           { header: "bg-rose-200",    text: "text-slate-800" },
// sky:            { header: "bg-sky-200",     text: "text-slate-800" },
// fuchsia:        { header: "bg-fuchsia-200", text: "text-slate-800" },
// lime:           { header: "bg-lime-200",    text: "text-slate-800" },
// cyan:           { header: "bg-cyan-200",    text: "text-slate-800" },
// "yellow-amber": { header: "bg-yellow-200",  text: "text-slate-800" },
// green:          { header: "bg-green-200",   text: "text-slate-800" },
// red:            { header: "bg-red-200",     text: "text-slate-800" },
// stone:          { header: "bg-stone-200",   text: "text-slate-800" },
// purple:         { header: "bg-purple-200",  text: "text-slate-800" },
// orange:         { header: "bg-orange-200",  text: "text-slate-800" },
// yellow:         { header: "bg-yellow-100",  text: "text-slate-800" },

const DEFAULT_COLOR: CardColorStyle = { header: "bg-slate-500", text: "text-white" };

/** Returns gradient + text classes for a color token. Falls back to slate. */
export function resolveCardColor(color: string): CardColorStyle {
  return CARD_COLORS[color] ?? DEFAULT_COLOR;
}
