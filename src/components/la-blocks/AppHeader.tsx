"use client";

/**
 * AppHeader — la design system common application header.
 *
 * Variants:
 *   "default" — full header: Logo + POST CTA + Favourites sheet + Avatar menu
 *   "simple"  — minimal header: Logo + Avatar menu only
 *   "hidden"  — renders nothing (auth journeys: /login, /register, /signup)
 *
 * Props:
 *   variant  — layout variant (default | simple | hidden)
 *   user     — authenticated user from server session, or null/undefined when logged out
 *
 * Favourites are stored in localStorage (useFavouritesStore) — available to all users,
 * logged in or not. On login, call syncFromServer() to merge with server data.
 *
 * Usage:
 *   <AppHeader variant="default" user={user} />
 */

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AvatarDropdown } from "@/components/avatar/AvatarDropdown";
import { LaFavouriteThumbnail } from "@/components/la-blocks/la-thumbnail-favourites/LaFavouriteThumbnail";
import { LaButton, laButtonVariants } from "@/components/la/la-button";
import { LaBadge } from "@/components/la/la-badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetCloseButton,
} from "@/components/ui/sheet";
import {
  Outline_Heart_24by24,
  Solid_Heart_24by24,
} from "@/components/icons/la-icons";
import { cn } from "@/lib/utils";
import type { AuthUser } from "@/types/auth";
import { getAllRolesLabel } from "@/config/roles";
import { useFavouritesStore } from "@/lib/stores/favouritesStore";
import { getMyFavourites } from "@/app/actions/favourites/getMyFavourites";
import { addFavourite } from "@/app/actions/favourites/addFavourite";
import { useCountryConfig } from "@/lib/hooks/useCountryConfig";
import { isSimpleLayoutRoute } from "@/lib/layout-routes";

export type AppHeaderVariant = "default" | "simple" | "hidden";

interface AppHeaderProps {
  variant?: AppHeaderVariant;
  user?: AuthUser | null;
}

/** Derive up-to-2-char initials from a display name (mirrors la-avatar.tsx) */
function getInitials(name?: string): string {
  if (!name) return "";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function AppHeader({ variant, user = null }: AppHeaderProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const { config } = useCountryConfig();
  const pathname = usePathname();
  const isLanding = pathname === "/";

  // The root layout no longer passes `variant` — a server-computed prop is
  // frozen after first paint, so next/link soft nav in or out of /login,
  // /register, /signup wouldn't otherwise flip it without a hard refresh
  // (see CLAUDE.md's "Layout signal system" note). Deriving straight from
  // the live pathname instead makes the header correct itself immediately
  // on soft navigation, in both directions. `variant` still works as an
  // explicit override for callers that pass it directly (e.g. the
  // /snippets/app-shell demo, which needs to force "simple" on a pathname
  // that isn't actually a simple-layout route).
  //
  // Auth journeys (/login, /register, /signup) drop the header entirely
  // rather than falling back to "simple" — there's no logo bar on these
  // pages at all.
  const effectiveVariant = variant ?? (isSimpleLayoutRoute(pathname) ? "hidden" : "default");

  // ── Auth state ─────────────────────────────────────────────────────────────
  // Seed from the server-rendered `user` prop (getAuthUser() in layout.tsx) so
  // there's no flash of "logged out" on first paint, then re-validate against
  // /api/auth/me client-side — same checkAuth() + "auth-changed" event pattern
  // used on the develop branch. This is what the POST button below reads.
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(user);
  const isLoggedIn = currentUser !== null;
  // Skip the skeleton when the server already handed us a user — only the
  // cold client-side check (no server session prop) has a visible wait.
  const [authChecked, setAuthChecked] = useState(false); // TEMP-DEBUG: forces skeleton visible for demo

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      if (!res.ok) {
        setCurrentUser(null);
        return;
      }
      const { user: apiUser } = await res.json();
      if (!apiUser) {
        setCurrentUser(null);
        return;
      }
      const displayName = apiUser.fullName || apiUser.username || "Member";
      setCurrentUser({
        id: apiUser.id,
        name: displayName,
        initials: getInitials(displayName) || "?",
        avatarUrl: apiUser.image || undefined,
        role: apiUser.isAdmin ? "admin" : "member",
        roleLabel: getAllRolesLabel(
          apiUser.publicRole,
          apiUser.roles,
          apiUser.roleSpecialties,
          apiUser.customRole
        ),
        status: "online",
      });
    } catch {
      setCurrentUser(null);
    } finally {
      await new Promise((r) => setTimeout(r, 3000)); // TEMP-DEBUG: forces skeleton visible for demo
      setAuthChecked(true);
    }
  }, []);

  useEffect(() => {
    checkAuth();
    const handler = () => checkAuth();
    window.addEventListener("auth-changed", handler);
    return () => window.removeEventListener("auth-changed", handler);
  }, [checkAuth]);

  // If the server-rendered prop changes (e.g. a client-side nav re-runs the
  // layout with a fresh session), stay in sync with it too.
  useEffect(() => {
    setCurrentUser(user);
  }, [user]);

  const items = useFavouritesStore((s) => s.items);
  const remove = useFavouritesStore((s) => s.remove);
  const count = items.length;

  // Rehydrate from localStorage after client mount (skipHydration: true
  // prevents SSR mismatch), then — for a signed-in user — flush any pending
  // deletes, push up favourites added while logged out (device-local only,
  // since addFavourite no-ops without a session), and merge in whatever the
  // DB already has (e.g. favourites added on another device).
  // Order matters:
  //   1. reconcile() BEFORE the getMyFavourites() read, so its snapshot is
  //      taken after unconfirmed deletes have actually landed server-side —
  //      otherwise syncFromServer would resurrect a just-removed favourite.
  //   2. await rehydrate() first — reading getState().items before it
  //      resolves would see an empty store and treat every local favourite
  //      as already synced, dropping it on the next persisted write.
  const currentUserId = currentUser?.id ?? null;

  useEffect(() => {
    let cancelled = false;

    (async () => {
      await useFavouritesStore.persist.rehydrate();
      if (cancelled || !currentUserId) return;

      await useFavouritesStore.getState().reconcile();
      if (cancelled) return;

      const localItems = useFavouritesStore.getState().items;
      const serverItems = await getMyFavourites();
      if (cancelled) return;

      const localOnly = localItems.filter((i) => !serverItems.some((si) => si.id === i.id));
      await Promise.all(localOnly.map((item) => addFavourite(item).catch(() => {})));
      if (cancelled) return;

      useFavouritesStore.getState().syncFromServer(serverItems);
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally
    // keyed on the stable id, not the currentUser object reference: every
    // run below calls Server Actions (getMyFavourites/addFavourite), and
    // invoking a Server Action always triggers Next.js to refetch the RSC
    // tree for the current route — which hands this component a brand-new
    // `user` prop object even when the underlying user is unchanged. Keying
    // on the object itself turned this into an infinite loop (effect →
    // action call → route refresh → new object → effect fires again).
  }, [currentUserId]);

  if (effectiveVariant === "hidden") return null;

  return (
    <header className="bg-white border-b border-stone-300 z-10 shadow-gray-300">
      {/*  shadow  */}
      {/* Main App Header */}
      <div className="container-app h-16 flex items-center">
        {/* Logo — not clickable on landing (already there, no point refreshing) */}
        {isLanding ? (
          <span className="flex gap-2 items-center">
            <Image src="/assets/la-logo-symbol-color.svg" alt="lokalads logo" width={46} height={46} />
            <div className="relative max-sm:hidden">
              <Image src="/assets/la-text-black.svg" alt="lokalads" width={120} height={32}/>
              {config.displayName && (
                <span className="absolute right-0 -bottom-3.5 text-[10px] font-normal text-slate-900 whitespace-nowrap subpixel-antialiased">
                  {config.displayName}
                </span>
              )}
            </div>
            <LaBadge intent="info" variant="outline" size="sm">Beta</LaBadge>
          </span>
        ) : (
          <Link className="flex gap-2 items-center" href="/">
            <Image src="/assets/la-logo-symbol-color.svg" alt="lokalads logo" width={40} height={40} />
            <div className="relative max-sm:hidden">
              <Image src="/assets/la-text-black.svg" alt="lokalads" width={96} height={24} />
              {config.displayName && (
                <span className="absolute right-0 -bottom-3.5 text-[10px] font-normal text-slate-900 whitespace-nowrap subpixel-antialiased">
                  {config.displayName}
                </span>
              )}
            </div>
            <LaBadge intent="info" variant="outline" size="sm">Beta</LaBadge>
          </Link>
        )}

        <div className="flex-1" />

        <div className="h-full flex items-center gap-1.5">

          {/* Post CTA */}
          {effectiveVariant === "default" && (
            <Link
              href={isLoggedIn ? "/post" : "/login?redirect=/post"}
              className={cn(laButtonVariants({ intent: "primary-rose", size: "default" }), "[&_svg]:size-5 max-sm:hidden")}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M10 4.5v11M4.5 10h11" />
              </svg>
              POST
            </Link>
          )}
          {effectiveVariant === "default" && (
            <Link
              href={isLoggedIn ? "/post" : "/login?redirect=/post"}
              className={cn(laButtonVariants({ intent: "primary-rose", size: "default" }), "[&_svg]:size-5 w-9 px-0 sm:hidden")}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M10 4.5v11M4.5 10h11" />
              </svg>
            </Link>
          )}

          {/* Favourites — always visible; badge driven by favCount when logged in */}
          {effectiveVariant === "default" && (
            <LaButton
              type="button"
              intent="ghost"
              size="default"
              aria-label={sheetOpen ? "Close favourites" : "View saved listings"}
              aria-expanded={sheetOpen}
              onClick={() => setSheetOpen((v) => !v)}
              className={cn(
                "w-11 max-sm:w-9 h-full rounded-none overflow-visible px-0 [&_svg]:size-10",
                count > 0 || sheetOpen ? "text-rose-500" : "text-slate-600"
              )}
            >
              <span className="relative inline-flex">
                {count > 0 || sheetOpen
                  ? <Solid_Heart_24by24 className="size-9" />
                  : <Outline_Heart_24by24 className="size-9" strokeWidth={1.5} />
                }
                {count > 0 && (
                  <span className="pointer-events-none absolute -top-0 -right-0 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs font-bold tabular-nums text-white">
                    {count > 9 ? "9+" : count}
                  </span>
                )}
              </span>
            </LaButton>
          )}

          {/* Avatar — always visible; shows guest menu when logged out */}
          <div className="flex items-center px-1">
            <AvatarDropdown
              isLoggedIn={isLoggedIn}
              loading={!authChecked}
              name={currentUser?.name}
              subtitle={
                currentUser?.role === "admin"
                  ? "Admin"
                  : currentUser?.roleLabel || "Member"
              }
              initials={currentUser?.initials}
              src={currentUser?.avatarUrl}
              status={currentUser?.status}
            />
          </div>

        </div>
      </div>

      {/* Favourites Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right">
          <SheetHeader>
            <div>
              <SheetTitle>Favourites</SheetTitle>
              <SheetDescription>
                {count > 0 ? `${count} saved listing${count === 1 ? "" : "s"}` : "No saved listings"}
              </SheetDescription>
            </div>
            <SheetCloseButton />
          </SheetHeader>
          <div className="flex-1 overflow-y-auto bg-slate-50 px-5 pb-2">
            {count === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-slate-500">
                <Outline_Heart_24by24 className="size-10 mb-3 text-slate-300" strokeWidth={1.5} />
                <p className="text-sm font-medium">No saved listings yet</p>
                <p className="text-sm text-slate-400 mt-1">Tap the heart on any listing to save it here.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {items.map((item) => (
                  <LaFavouriteThumbnail
                    key={item.id}
                    image={item.image}
                    priceLabel={item.priceLabel}
                    priceSuffix={item.priceSuffix}
                    title={item.title}
                    detailsLabel={item.detailsLabel}
                    locationLabel={item.locationLabel}
                    postedAt={item.postedAt}
                    status={item.status}
                    onRemove={() => remove(item.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

    </header>
  );
}