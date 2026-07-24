/**
 * AvatarDropdown — la design system profile menu
 * Click the avatar to open a profile menu.
 * - Desktop (≥ sm): floating popover card, closes on outside click.
 * - Mobile (< sm):  Vaul Drawer slides up from the bottom.
 *
 * ─────────────────────────────────────────────────────────────
 * IMPORT
 * ─────────────────────────────────────────────────────────────
 *   import { AvatarDropdown } from "@/components/avatar/AvatarDropdown";
 *
 * ─────────────────────────────────────────────────────────────
 * USAGE
 * ─────────────────────────────────────────────────────────────
 *   <AvatarDropdown
 *     name="Karthik G"
 *     subtitle="Member"
 *     initials="KG"
 *   />
 *
 * ─────────────────────────────────────────────────────────────
 * PROPS REFERENCE
 * ─────────────────────────────────────────────────────────────
 *   name          string                                    User's display name.
 *   subtitle?     string                                    Secondary line (role, email, etc). Default "Member".
 *   initials?     string                                    1–2 chars for the avatar fallback. Default "?".
 *   src?          string                                    Avatar image URL.
 *   status?       "online"|"busy"|"offline"|"none"          Status dot on the avatar. Default "none".
 *   showChevron?  boolean                                   Show a chevron-down beside the avatar. Default false.
 */
"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutGrid,
  MessageCircle,
  User,
  History,
  Settings,
  Globe2,
  LogOut,
  ChevronDown,
  LogIn,
  UserPlus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "./Avatar";
import {
  Drawer,
  DrawerContent,
} from "@/components/ui/drawer";
import { OverlayCountrySelect } from "@/components/overlay-country-select";
import { useAuthStore } from "@/store/authStore";
/* ─── menu config ────────────────────────────────────────────── */
const NAV_ITEMS = [
  { label: "My Ads",           icon: LayoutGrid,    href: "/my-ads" },
  { label: "Chat",             icon: MessageCircle, href: "/chat" },
  { label: "Profile",          icon: User,          href: "/profile" },
  { label: "Account Settings", icon: Settings,      href: "/account-settings" },
  { label: "Donation History", icon: History,       href: "/donation-history" },
] as const;

/* ─── guest menu ─────────────────────────────────────────────── */
function GuestMenuBody({ onClose, onOpenCountry }: { onClose: () => void; onOpenCountry: () => void }) {
  return (
    <div>
      <div className="px-4 py-3 border-b border-slate-100">
        <p className="text-sm font-semibold text-slate-900">Welcome</p>
        <p className="text-sm text-slate-500 mt-0.5">Sign in to access your account</p>
      </div>
      <div className="py-1">
        <Link
          href="/login"
          onClick={onClose}
          className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <LogIn aria-hidden="true" className="size-4 shrink-0 text-slate-400" />
          Login
        </Link>
        <Link
          href="/register"
          onClick={onClose}
          className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <UserPlus aria-hidden="true" className="size-4 shrink-0 text-slate-400" />
          Register
        </Link>
        <div className="border-t border-slate-100 mt-1 pt-1">
          <button
            type="button"
            onClick={onOpenCountry}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Globe2 aria-hidden="true" className="size-4 shrink-0 text-slate-400" />
            Switch Country
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── props ──────────────────────────────────────────────────── */
export interface AvatarDropdownProps {
  name?:        string;
  subtitle?:    string;
  initials?:    string;
  src?:         string;
  status?:      "online" | "busy" | "offline" | "none";
  showChevron?: boolean;
  isLoggedIn?:  boolean;
}

/* ─── auth menu body ─────────────────────────────────────────── */
function MenuBody({
  name,
  subtitle = "Member",
  initials = "?",
  src,
  status = "none",
  onClose,
  onOpenCountry,
}: AvatarDropdownProps & { onClose: () => void; onOpenCountry: () => void }) {
  const router = useRouter();
  return (
    <div>
      {/* User identity */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100">
        <Avatar src={src} initials={initials} size="md" status={status} />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900 truncate">{name}</p>
          <p className="text-sm text-slate-500 truncate">{subtitle}</p>
        </div>
      </div>

      {/* Nav items */}
      <div className="py-1">
        {NAV_ITEMS.map(({ label, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Icon aria-hidden="true" className="size-4 shrink-0 text-slate-400" />
            {label}
          </Link>
        ))}
        {/* Switch Country — opens overlay instead of navigating */}
        <button
          type="button"
          onClick={onOpenCountry}
          className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <Globe2 aria-hidden="true" className="size-4 shrink-0 text-slate-400" />
          Switch Country
        </button>
      </div>

      {/* Separator + Sign out */}
      <div className="border-t border-slate-100 py-1">
        <button
          type="button"
          onClick={async () => {
  onClose();
  await fetch("/api/auth/logout", { method: "POST" });
  useAuthStore.getState().logout();
  router.push("/");
  router.refresh();
}}
          className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
        >
          <LogOut aria-hidden="true" className="size-4 shrink-0" />
          Sign out
        </button>
      </div>
    </div>
  );
}

/* ─── component ──────────────────────────────────────────────── */
export function AvatarDropdown({
  name = "Guest",
  subtitle = "Member",
  initials = "?",
  src,
  status = "none",
  showChevron = false,
  isLoggedIn = false,
}: AvatarDropdownProps) {
  const [open, setOpen] = React.useState(false);
  const [countryOpen, setCountryOpen] = React.useState(false);
  // Lazy init: read matchMedia on first client render so the drawer renders
  // correctly on mobile without a layout flash. Falls back to false on SSR.
  const [isMobile, setIsMobile] = React.useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 639px)").matches
  );
  const rootRef = React.useRef<HTMLDivElement>(null);

  /* Subscribe to viewport changes after mount */
  React.useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  /* close desktop popover on outside click */
  React.useEffect(() => {
    if (isMobile) return;
    function onDoc(e: MouseEvent) {
      if (rootRef.current && e.target instanceof Node && !rootRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [isMobile]);

  const close = () => setOpen(false);

  // Switch Country closes the menu (drawer/popover) and opens the country
  // picker as an independent overlay rendered below, outside the
  // Drawer/popover's own conditional render — nesting it inside Vaul's
  // Drawer previously meant its portaled content (outside the Drawer's DOM
  // subtree) fought with Vaul/Radix's outside-tap dismiss handling, breaking
  // country selection on iOS Safari.
  const openCountry = () => {
    setOpen(false);
    setCountryOpen(true);
  };

  return (
    <div ref={rootRef} className="relative inline-block">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        title="Account menu"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        className={cn(
          "flex items-center gap-1.5 rounded-full p-0.5",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500",
          "transition-opacity hover:opacity-80",
        )}
      >
        <Avatar src={src} initials={initials} size="md" status={status} />
        {showChevron && (
          <ChevronDown
            aria-hidden="true"
            className={cn(
              "size-3.5 text-slate-500 transition-transform duration-200",
              open && "rotate-180",
            )}
          />
        )}
      </button>

      {/* Desktop — floating popover */}
      {!isMobile && open && (
        <div className="absolute right-0 top-full mt-2 z-50 w-56 rounded-xl border border-slate-200 bg-white shadow-lg ring-1 ring-black/5 overflow-hidden">
          {isLoggedIn
            ? <MenuBody name={name} subtitle={subtitle} initials={initials} src={src} status={status} onClose={close} onOpenCountry={openCountry} />
            : <GuestMenuBody onClose={close} onOpenCountry={openCountry} />}
        </div>
      )}

      {/* Mobile — Drawer */}
      {isMobile && (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent className="pt-0 [&>div:first-child]:hidden border-slate-200 max-h-[80svh]">
            {/* Header */}
            <div className="rounded-t-2xl bg-linear-to-b from-slate-100 to-slate-50 px-4 pt-1.5 pb-1.5 border-b border-slate-200">
              <div className="mx-auto mb-1.5 h-0.5 w-6 rounded-full bg-slate-400" />
              <p className="text-base font-semibold text-slate-800 tracking-wide">Account</p>
            </div>
            <div className="flex-1 overflow-y-auto min-h-0">
              {isLoggedIn
                ? <MenuBody name={name} subtitle={subtitle} initials={initials} src={src} status={status} onClose={close} onOpenCountry={openCountry} />
                : <GuestMenuBody onClose={close} onOpenCountry={openCountry} />}
            </div>
          </DrawerContent>
        </Drawer>
      )}

      {/* Country picker — rendered independently of the Drawer/popover above
           (not nested inside their conditional content) so its lifecycle
           never competes with Vaul/Radix's outside-tap dismiss handling. */}
      {countryOpen && (
        <OverlayCountrySelect
          onSelect={() => setCountryOpen(false)}
          onClose={() => setCountryOpen(false)}
        />
      )}
    </div>
  );
}

