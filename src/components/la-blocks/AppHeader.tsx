"use client";

/**
 * AppHeader — la design system common application header.
 *
 * Variants:
 *   "default" — full header: Logo + POST CTA + Favourites sheet + Avatar menu
 *   "simple"  — minimal header: Logo + Avatar menu only
 *
 * Props:
 *   variant  — layout variant (default | simple)
 *   user     — authenticated user from server session, or null/undefined when logged out
 *
 * Favourites are stored in localStorage (useFavouritesStore) — available to all users,
 * logged in or not. On login, call syncFromServer() to merge with server data.
 *
 * Usage:
 *   <AppHeader variant="default" user={user} />
 */

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AvatarDropdown } from "@/components/avatar/AvatarDropdown";
import { LaFavouriteThumbnail } from "@/components/la-blocks/la-thumbnail-favourites/LaFavouriteThumbnail";
import { LaButton, laButtonVariants } from "@/components/la/la-button";
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
import { useFavouritesStore } from "@/lib/stores/favouritesStore";
import { useCountryConfig } from "@/lib/hooks/useCountryConfig";

export type AppHeaderVariant = "default" | "simple";

interface AppHeaderProps {
  variant?: AppHeaderVariant;
  user?: AuthUser | null;
}

export default function AppHeader({ variant = "default", user = null }: AppHeaderProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const isLoggedIn = user !== null;
  const { config } = useCountryConfig();
  const pathname = usePathname();
  const isLanding = pathname === "/";

  const items = useFavouritesStore((s) => s.items);
  const remove = useFavouritesStore((s) => s.remove);
  const count = items.length;

  // Rehydrate from localStorage after client mount (skipHydration: true prevents SSR mismatch)
  useEffect(() => {
    useFavouritesStore.persist.rehydrate();
  }, []);

  return (
    <header className="bg-white border-b border-stone-300 z-10 shadow-gray-300">
      {/*  shadow  */}
      {/* Main App Header */}
      <div className="container-app h-16 flex items-center">
        {/* Logo — not clickable on landing (already there, no point refreshing) */}
        {isLanding ? (
          <span className="flex gap-2 items-center">
            <Image src="/assets/la-logo-symbol-color.svg" alt="lokalads logo" width={40} height={40} />
            <div className="relative max-sm:hidden">
              <Image src="/assets/la-text-black.svg" alt="lokalads" width={96} height={24} />
              {config.displayName && (
                <span className="absolute right-0 -bottom-3.5 text-[10px] font-normal text-slate-900 whitespace-nowrap subpixel-antialiased">
                  {config.displayName}
                </span>
              )}
            </div>
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
          </Link>
        )}

        <div className="flex-1" />

        <div className="h-full flex items-center gap-1">

          {/* Post CTA */}
          {variant === "default" && (
            <Link
              href={isLoggedIn ? "/post" : "/login?redirect=/post"}
              className={cn(laButtonVariants({ intent: "primary-rose", size: "compact" }), "max-sm:hidden")}
            >
              <svg width="16" height="16" fill="currentColor" aria-hidden="true">
                <path d="M8 3a1 1 0 0 1 1 1v3h3a1 1 0 1 1 0 2H9v3a1 1 0 1 1-2 0V9H4a1 1 0 1 1 0-2h3V4a1 1 0 0 1 1-1Z" />
              </svg>
              POST
            </Link>
          )}
          {variant === "default" && (
            <Link
              href={isLoggedIn ? "/post" : "/login?redirect=/post"}
              className={cn(laButtonVariants({ intent: "primary-rose", size: "compact" }), "w-7 px-0 sm:hidden")}
            >
              <svg width="16" height="16" fill="currentColor" aria-hidden="true">
                <path d="M8 3a1 1 0 0 1 1 1v3h3a1 1 0 1 1 0 2H9v3a1 1 0 1 1-2 0V9H4a1 1 0 1 1 0-2h3V4a1 1 0 0 1 1-1Z" />
              </svg>
            </Link>
          )}

          {/* Favourites — always visible; badge driven by favCount when logged in */}
          {variant === "default" && (
            <LaButton
              type="button"
              intent="ghost"
              size="default"
              aria-label={sheetOpen ? "Close favourites" : "View saved listings"}
              aria-expanded={sheetOpen}
              onClick={() => setSheetOpen((v) => !v)}
              className={cn(
                "w-11 max-sm:w-9 h-full rounded-none overflow-visible px-0 [&_svg]:size-7",
                count > 0 || sheetOpen ? "text-rose-500" : "text-slate-600"
              )}
            >
              <span className="relative inline-flex">
                {count > 0 || sheetOpen
                  ? <Solid_Heart_24by24 className="size-7" />
                  : <Outline_Heart_24by24 className="size-7" strokeWidth={1.5} />
                }
                {count > 0 && (
                  <span className="pointer-events-none absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs font-bold tabular-nums text-white">
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
              name={user?.name}
              subtitle={user?.role === "admin" ? "Admin" : "Member"}
              initials={user?.initials}
              src={user?.avatarUrl}
              status={user?.status}
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
