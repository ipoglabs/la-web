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
  Bell,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SESSION_DURATIONS } from "@/lib/sessionDurations";
import {
  ToggleButtonGroup,
  ToggleGroupButton,
} from "@/components/toggle-group/CompoundToggleGroup";
import {
  Outline_UnCheckCircle_24by24,
  Outline_CheckCircle_24by24,
} from "@/components/icons/la-icons";
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
  { label: "My Alerts",        icon: Bell,          href: "/my-alerts" },
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
        <p className="text-base font-semibold text-slate-900">Welcome</p>
        <p className="text-base text-slate-500 mt-0.5">Sign in to access your account</p>
      </div>
      <div className="py-1">
        <Link
          href="/login"
          onClick={onClose}
          className="flex items-center gap-3 px-4 py-2.5 text-base font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <LogIn aria-hidden="true" className="size-4 shrink-0 text-slate-400" />
          Login
        </Link>
        <Link
          href="/register"
          onClick={onClose}
          className="flex items-center gap-3 px-4 py-2.5 text-base font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <UserPlus aria-hidden="true" className="size-4 shrink-0 text-slate-400" />
          Register
        </Link>
        <div className="border-t border-slate-100 mt-1 pt-1">
          <button
            type="button"
            onClick={onOpenCountry}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-base text-slate-700 hover:bg-slate-50 transition-colors"
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

/* ─── "stay signed in" switcher ──────────────────────────────── */
/**
 * Re-issues the current session for a different lifetime (Off / 24h / 7d /
 * 14d / 1mo) via `/api/auth/session-duration` — no logout, same device.
 * "Off" issues a session-only cookie (cleared when the browser closes).
 *
 * Optimistic: the toggle moves immediately on click, the POST runs in the
 * background, and a failure rolls the selection back. Deliberately has NO
 * disabled/"saving" lockout — a hung or slow request must never leave the
 * control un-clickable. Re-clicking aborts the previous in-flight request
 * (last write wins), and the initial GET never overwrites a choice the
 * user has already made.
 *
 * Rendered as the single-select icon toggle group from
 * `/design-system/core/toggle-group` (use case 7).
 */
function SessionLengthSection() {
  const [seconds, setSeconds] = React.useState<number | null>(null);
  const touchedRef = React.useRef(false);
  const abortRef = React.useRef<AbortController | null>(null);

  React.useEffect(() => {
    const ac = new AbortController();
    fetch("/api/auth/session-duration", { signal: ac.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        // Don't clobber a selection the user made while the GET was in flight.
        if (!touchedRef.current && typeof j?.data?.seconds === "number") {
          setSeconds(j.data.seconds);
        }
      })
      .catch(() => {});
    return () => ac.abort();
  }, []);

  async function choose(values: string[]) {
    const next = Number(values[0]);
    if (Number.isNaN(next) || next === seconds) return;

    touchedRef.current = true;
    const prev = seconds;
    setSeconds(next); // optimistic

    abortRef.current?.abort(); // cancel any earlier in-flight write
    const ac = new AbortController();
    abortRef.current = ac;

    try {
      const res = await fetch("/api/auth/session-duration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seconds: next }),
        signal: ac.signal,
      });
      if (!res.ok) setSeconds(prev ?? null);
    } catch (err) {
      if ((err as Error)?.name !== "AbortError") setSeconds(prev ?? null);
    }
  }

  return (
    <div className="border-t border-slate-100 px-4 py-3">
      <div className="mb-2 flex items-center gap-3">
        <Clock aria-hidden="true" className="size-5 shrink-0 text-slate-400" />
        <span className="text-base font-medium text-slate-700">Stay signed in up to</span>
      </div>
      <ToggleButtonGroup
        singleSelect
        requireSelection
        value={seconds === null ? [] : [String(seconds)]}
        onChange={choose}
      >
        {SESSION_DURATIONS.map((opt) => (
          <ToggleGroupButton
            key={opt.seconds}
            value={String(opt.seconds)}
            icon={Outline_UnCheckCircle_24by24}
            iconSelected={Outline_CheckCircle_24by24}
          >
            {opt.label}
          </ToggleGroupButton>
        ))}
      </ToggleButtonGroup>
    </div>
  );
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
      {/* User identity — text column shrinks (min-w-0 + flex-1) so a long
           name or a full multi-role line truncates with an ellipsis instead
           of forcing the menu wider. Full role line stays on the title attr. */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100">
        <div className="shrink-0">
          <Avatar src={src} initials={initials} size="md" status={status} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-lg font-semibold text-slate-900 truncate">{name}</p>
          <p className="text-base text-slate-500 truncate" title={subtitle}>{subtitle}</p>
        </div>
      </div>

      {/* Nav items */}
      <div className="py-1">
        {NAV_ITEMS.map(({ label, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-2.5 text-base text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Icon aria-hidden="true" className="size-5 shrink-0 text-slate-400" />
            {label}
          </Link>
        ))}
        {/* Switch Country — opens overlay instead of navigating */}
        <button
          type="button"
          onClick={onOpenCountry}
          className="flex w-full items-center gap-3 px-4 py-2.5 text-base text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <Globe2 aria-hidden="true" className="size-5 shrink-0 text-slate-400" />
          Switch Country
        </button>
      </div>

      {/* "Stay signed in" switcher */}
      <SessionLengthSection />

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
          className="flex w-full items-center gap-3 px-4 py-2.5 text-base font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
        >
          <LogOut aria-hidden="true" className="size-5 shrink-0" />
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
  // Lazy init: read matchMedia on first client render so the drawer renders
  // correctly on mobile without a layout flash. Falls back to false on SSR.
  const [isMobile, setIsMobile] = React.useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 639px)").matches
  );
  const [countryOpen, setCountryOpen] = React.useState(false);
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
  // Drawer/popover's own conditional render. Nesting it inside Vaul's Drawer
  // (or leaving the desktop popover mounted alongside it) meant its portaled
  // content — always outside that container's own DOM subtree — fought with
  // Vaul/Radix's outside-tap dismiss handling and this component's own
  // outside-click listener; unreliable enough to need two rounds of patches
  // that still didn't hold up on real iOS Safari. Closing the menu first
  // removes the competing layer entirely instead of racing it.
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

      {/* Desktop — floating popover. z-[60] clears page content that also
           sits at z-50 (the header itself is unpositioned). max-h + scroll
           keeps a tall menu from running down over the page. */}
      {!isMobile && open && (
        <div className="absolute right-0 top-full mt-2 z-[60] w-56 max-h-[calc(100vh-6rem)] overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg ring-1 ring-black/5">
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

