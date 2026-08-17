/**
 * MyAdCard: purpose-built listing management card for /my-ads.
 * Page-local (co-location rule): only ever used by MyAdsPage.
 *
 * Shows image, title, price, status badge, per-ad stats (views/
 * favourites/messages), "Expires in X days" indicator, and a horizontal
 * action row (Edit, status action, Preview, Delete) filtered to only
 * the actions valid for the ad's current status.
 *
 * Real actions — setListingLifecycle.ts (pause/resume/renew/close/delete)
 * and bumpPost.ts — replace the ported-from mock store's synchronous
 * mutations. `onChanged` (router.refresh(), owned by the parent) re-fetches
 * real data after every successful action instead of a local store update.
 */
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import {
  Eye,
  Heart,
  MessageCircle,
  Pause,
  Play,
  RefreshCw,
  Trash2,
  Pencil,
  ExternalLink,
  Share2,
  ArrowUpToLine,
  MoreVertical,
  Timer,
} from "lucide-react";
import { LaBadge } from "@/components/la/la-badge";
import { LaButton } from "@/components/la/la-button";
import { LaSeparator } from "@/components/la/la-separator";
import { LaRelativeDate } from "@/components/la-blocks/la-relative-date";
import { LegalDrawer } from "@/components/la-blocks/LegalDrawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { MyAd } from "@/app/actions/getMyAds";
import { setListingLifecycle, type LifecycleAction } from "@/app/actions/setListingLifecycle";
import { bumpPost } from "@/app/actions/bumpPost";
import type { MyAdStatus } from "@/lib/myAdsStatus";
import { getBumpCooldownHours } from "@/config";
import { useCountryConfig } from "@/lib/hooks/useCountryConfig";

const STATUS_CONFIG: Record<MyAdStatus, { label: string; intent: "success" | "warning" | "neutral" | "info" | "danger" }> = {
  active: { label: "Active", intent: "success" },
  "off-market": { label: "Paused", intent: "warning" },
  expired: { label: "Expired", intent: "neutral" },
  closed: { label: "Closed", intent: "info" },
  pending: { label: "Pending", intent: "neutral" },
  rejected: { label: "Rejected", intent: "danger" },
  "under-review": { label: "Reported", intent: "warning" },
  blocked: { label: "Suspended", intent: "danger" },
};

/** Short "why/what next" note shown next to the status badge, same spot as "Expires in X days" for active ads. */
const STATUS_NOTE: Partial<Record<MyAdStatus, string>> = {
  "off-market": "Hidden from search",
  expired: "Renew to make it live",
  closed: "No longer listed",
  pending: "Awaiting approval",
};

const DAY_MS = 24 * 60 * 60 * 1000;

function daysUntil(ts: number): number {
  return Math.ceil((ts - Date.now()) / DAY_MS);
}

// Wraps Date.now() inside a module-level function — avoids the React
// compiler flagging a direct Date.now() call in the component body as an
// impure render read (same pattern as LaRelativeDate.tsx's computeRelativeLabel).
function cooldownRemainingMs(bumpedAt: number | null, cooldownMs: number): number {
  return bumpedAt ? bumpedAt + cooldownMs - Date.now() : 0;
}

/** Formats a duration in ms as "3h 42m" (or just "42m" once under an hour). */
function formatCooldownRemaining(ms: number): string {
  const totalMinutes = Math.max(1, Math.ceil(ms / 60_000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
}

export interface MyAdCardProps {
  ad: MyAd;
  /** Called after any action succeeds — parent re-fetches real data (router.refresh()). */
  onChanged: () => void;
}

export function MyAdCard({ ad, onChanged }: MyAdCardProps) {
  const { countryCode } = useCountryConfig();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Fade only shows while there's more of the action row to scroll to,
  // checked on mount/resize and on scroll so it never falsely implies
  // overflow that isn't there.
  const actionsRef = useRef<HTMLDivElement>(null);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const el = actionsRef.current;
    if (!el) return;

    function updateFade() {
      if (!el) return;
      setCanScrollRight(el.scrollWidth - el.clientWidth - el.scrollLeft > 1);
    }

    updateFade();
    el.addEventListener("scroll", updateFade);
    const observer = new ResizeObserver(updateFade);
    observer.observe(el);
    return () => {
      el.removeEventListener("scroll", updateFade);
      observer.disconnect();
    };
  }, []);

  // Ticks once a minute so the bump cooldown countdown stays accurate without
  // updating every second, a slow, calm tick is easier to read at a glance
  // (and avoids constant flicker for low-vision users) than a live seconds timer.
  const [, forceTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => forceTick((n) => n + 1), 60_000);
    return () => clearInterval(id);
  }, []);

  const status = STATUS_CONFIG[ad.status];
  const expiryDays = ad.expiresAt ? daysUntil(ad.expiresAt) : null;
  const showExpiry = ad.status === "active" && expiryDays !== null;
  const expiryUrgent = expiryDays !== null && expiryDays <= 14;
  const statusNote = STATUS_NOTE[ad.status];
  const isReadOnly = ad.status === "under-review" || ad.status === "blocked" || ad.status === "pending" || ad.status === "rejected";

  const bumpCooldownMs = getBumpCooldownHours(countryCode) * 60 * 60 * 1000;
  const bumpCooldownRemainingMs = cooldownRemainingMs(ad.bumpedAt, bumpCooldownMs);
  const canBump = ad.status === "active" && bumpCooldownRemainingMs <= 0;

  function runLifecycle(action: LifecycleAction) {
    startTransition(async () => {
      const res = await setListingLifecycle(ad.id, action);
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      if (action === "delete") setConfirmDelete(false);
      onChanged();
    });
  }

  function handleBump() {
    startTransition(async () => {
      const res = await bumpPost(ad.id);
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success("Your ad has been bumped to the top of search results");
      onChanged();
    });
  }

  function handleCopyLink() {
    const url = `${window.location.origin}/listings/${ad.id}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard");
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-4">
        <Link
          href={`/listings/${ad.id}`}
          className="relative block size-20 shrink-0 overflow-hidden rounded-lg bg-slate-100"
        >
          <Image src={ad.image.src} alt={ad.image.alt ?? ad.title} fill className="object-cover" />
        </Link>

        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 w-full">
              <div className="flex items-center gap-2 mb-1">
                <LaBadge intent={status.intent} variant="solid" size="sm">{status.label}</LaBadge>
                {showExpiry && (
                  <span className={expiryUrgent ? "text-sm text-amber-700" : "text-sm text-slate-700"}>
                    Expires in {expiryDays} day{expiryDays === 1 ? "" : "s"}
                  </span>
                )}
                {statusNote && (
                  <span className="text-sm text-slate-700">{statusNote}</span>
                )}
              </div>

              {(ad.status === "under-review" || ad.status === "blocked" || ad.status === "rejected") && ad.moderationReason && (
                <div className="mb-1 flex flex-wrap items-baseline gap-x-2">
                  <p className="text-sm text-slate-700">{ad.moderationReason}</p>
                  <LegalDrawer countryCode={countryCode} type="listing-policy">
                    <button type="button" className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                      View Listing Policy &rarr;
                    </button>
                  </LegalDrawer>
                </div>
              )}

              {/* Row 1: title, up to 2 lines, then truncate */}
              <Link href={`/listings/${ad.id}`} className="line-clamp-2 text-base-plus font-semibold text-slate-900">
                {ad.title}
              </Link>

              {/* Row 2: price | posted date (+ bumped date if present) */}
              <div className="flex flex-nowrap items-center gap-2 overflow-x-auto scrollbar-none text-base">
                <p className="shrink-0 font-medium text-slate-700">
                  {ad.priceLabel}
                  {ad.priceSuffix && <span className="text-slate-500"> {ad.priceSuffix}</span>}
                </p>
                <span className="shrink-0 text-slate-400" aria-hidden="true">|</span>
                <p className="shrink-0 text-slate-500">
                  Posted <LaRelativeDate value={ad.publishedAt} />
                  {ad.bumpedAt && (
                    <>
                      {" · "}Bumped <LaRelativeDate value={ad.bumpedAt} />
                    </>
                  )}
                </p>
              </div>

              {/* Row 3: stats */}
              <div className="flex flex-nowrap items-center gap-3 overflow-x-auto scrollbar-none text-sm text-slate-500 mt-2">
                <span className="flex items-center gap-1">
                  <Eye className="size-4" /> {ad.viewCount}
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="size-4" /> {ad.favouriteCount}
                </span>
                <Link
                  href="/chat"
                  className="flex items-center gap-1 hover:text-slate-800 hover:underline"
                >
                  <MessageCircle className="size-4" /> {ad.messageCount}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <LaSeparator className="-mx-4 w-auto" />

      <div className="flex w-full min-w-0 items-center gap-2">
        <div className="relative min-w-0 flex-1">
        <div ref={actionsRef} className="flex flex-nowrap items-center gap-2 overflow-x-auto scrollbar-none">
          {ad.status === "active" && (
            <>
              <LaButton
                intent={canBump ? "primary-blue" : "primary-amber"}
                size="default"
                className={
                  canBump
                    ? "shrink-0 px-3"
                    : "shrink-0 cursor-not-allowed px-3 hover:bg-(--la-primary-amber)"
                }
                aria-disabled={!canBump || isPending}
                disabled={isPending}
                onClick={canBump ? handleBump : undefined}
              >
                {canBump ? (
                  <>
                    <ArrowUpToLine /> Bump Up
                  </>
                ) : (
                  <>
                    <Timer /> Bump Up in {formatCooldownRemaining(bumpCooldownRemainingMs)}
                  </>
                )}
              </LaButton>
              <LaButton intent="secondary" size="default" className="shrink-0 px-3" asChild>
                <Link href="/post">
                  <Pencil /> Edit
                </Link>
              </LaButton>
              <LaButton intent="secondary" size="default" className="shrink-0 px-3" disabled={isPending} onClick={() => runLifecycle("pause")}>
                <Pause /> Pause
              </LaButton>
            </>
          )}
          {ad.status === "off-market" && (
            <>
              <LaButton intent="primary-blue" size="default" className="shrink-0 px-3" disabled={isPending} onClick={() => runLifecycle("resume")}>
                <Play /> Resume
              </LaButton>
              <LaButton intent="secondary" size="default" className="shrink-0 px-3" asChild>
                <Link href="/post">
                  <Pencil /> Edit
                </Link>
              </LaButton>
            </>
          )}
          {ad.status === "expired" && (
            <>
              <LaButton intent="primary-blue" size="default" className="shrink-0 px-3" disabled={isPending} onClick={() => runLifecycle("renew")}>
                <RefreshCw /> Renew
              </LaButton>
              <LaButton intent="secondary" size="default" className="shrink-0 px-3" asChild>
                <Link href="/post">
                  <Pencil /> Edit
                </Link>
              </LaButton>
            </>
          )}
          {ad.status === "closed" && (
            <LaButton intent="secondary" size="default" className="shrink-0 px-3" asChild>
              <Link href="/post">
                <Pencil /> Edit
              </Link>
            </LaButton>
          )}
          {isReadOnly && (
            <span className="shrink-0 text-sm italic text-slate-500">
              {ad.status === "under-review"
                ? "Actions unavailable while under review"
                : ad.status === "blocked"
                ? "Actions unavailable while suspended"
                : ad.status === "pending"
                ? "Actions unavailable while awaiting approval"
                : "Actions unavailable — this ad was rejected"}
            </span>
          )}
          {ad.status !== "blocked" && (
            <LaButton intent="secondary" size="default" className="shrink-0 px-3" onClick={handleCopyLink}>
              <Share2 /> Share
            </LaButton>
          )}
        </div>
        {canScrollRight && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-linear-to-l from-white to-transparent"
          />
        )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label="More actions"
              className="flex size-11 shrink-0 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            >
              <MoreVertical className="size-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/listings/${ad.id}`}>
                <ExternalLink /> Preview
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={() => setConfirmDelete(true)}>
              <Trash2 /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Delete confirm: calm, icon-led framing (Stripe/Linear-style confirm dialog) */}
      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia className="rounded-full bg-rose-50 text-rose-600">
              <Trash2 />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete this ad?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes it from your list and search results for good. Views, favourites, and messages linked to
              this ad are kept for our records, but you won&apos;t see this ad here again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <LaButton intent="outline" size="default">Cancel</LaButton>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <LaButton intent="danger" size="default" disabled={isPending} onClick={() => runLifecycle("delete")}>
                Delete
              </LaButton>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
