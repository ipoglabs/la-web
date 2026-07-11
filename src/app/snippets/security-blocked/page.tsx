"use client";

/**
 * SecurityBlock — shown when a user request is blocked by a security check.
 *
 * Variants:
 *   "banner"  — compact inline strip; sits inside a page or form
 *   "card"    — full standalone card with steps + actions (default)
 *
 * Usage:
 *   <SecurityBlock variant="card" eventMeta={meta} onSignIn={...} onRetry={...} onSignOut={...} />
 */

import React from "react";
import { LogIn, LogOut, RefreshCw, ShieldAlert, WifiOff } from "lucide-react";
import { LaButton } from "@/components/la";

/* ── Types ──────────────────────────────────────────────────── */
type SecurityEventMeta = Partial<{
  event_id:   string;
  timestamp:  string;
  path:       string;
  client_ip:  string;
  user_agent: string;
  user_id:    string | null;
}>;

interface SecurityBlockProps {
  /** "banner" = compact inline strip, "card" = full page-level card. Default: "card". */
  variant?:   "banner" | "card";
  eventMeta?: SecurityEventMeta;
  onSignIn?:  () => void;
  onRetry?:   () => void;
  onSignOut?: () => void;
}

/* ── Helpers ─────────────────────────────────────────────────── */
function formatRef(meta?: SecurityEventMeta): string {
  const id = meta?.event_id ?? "—";
  const ts = meta?.timestamp
    ? new Date(meta.timestamp).toLocaleString("en-GB", {
        day: "2-digit", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit",
      })
    : "—";
  return `${id} · ${ts}`;
}

function buildSupportUrl(meta?: SecurityEventMeta): string {
  const payload = {
    event_id:   meta?.event_id,
    timestamp:  meta?.timestamp,
    path:       meta?.path,
    client_ip:  meta?.client_ip,
    user_agent: meta?.user_agent,
    user_id:    meta?.user_id ?? "anonymous",
  };
  return `/support/new?payload=${encodeURIComponent(JSON.stringify(payload))}`;
}

/* ── Resolution steps ────────────────────────────────────────── */
const STEPS = [
  {
    icon:  LogIn,
    title: "Sign in again",
    desc:  "Your session may have expired. Re-authenticating usually resolves this immediately.",
  },
  {
    icon:  WifiOff,
    title: "Disable VPN or proxy",
    desc:  "Unusual network sources can trigger our checks. Try on a direct connection.",
  },
  {
    icon:  RefreshCw,
    title: "Wait a moment and retry",
    desc:  "Temporary rate limits clear within a few minutes.",
  },
] as const;

/* ── Banner ──────────────────────────────────────────────────── */
function SecurityBanner({ onSignIn, onRetry }: Omit<SecurityBlockProps, "variant">) {
  const signIn = onSignIn ?? (() => window.location.assign("/snippets/login"));
  const retry  = onRetry  ?? (() => window.location.reload());

  return (
    <div
      role="alert"
      className="flex flex-wrap items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3"
    >
      <ShieldAlert aria-hidden="true" className="size-5 shrink-0 text-amber-500" />

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-800">Request blocked</p>
        <p className="text-sm text-slate-500">
          We stopped an unusual action to protect your account.
        </p>
      </div>

      <div className="flex shrink-0 gap-2">
        <LaButton size="compact" intent="secondary" onClick={retry}>
          Retry
        </LaButton>
        <LaButton size="compact" intent="primary-blue" onClick={signIn}>
          Sign in
        </LaButton>
      </div>
    </div>
  );
}

/* ── Card ────────────────────────────────────────────────────── */
function SecurityCard({ eventMeta, onSignIn, onRetry, onSignOut }: Omit<SecurityBlockProps, "variant">) {
  const signIn  = onSignIn  ?? (() => window.location.assign("/snippets/login"));
  const retry   = onRetry   ?? (() => window.location.reload());
  const signOut = onSignOut ?? (() => {});

  return (
    <div
      role="alertdialog"
      aria-labelledby="sec-block-title"
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
    >

      {/* ── Header ── */}
      <div className="flex flex-col items-center gap-3 bg-linear-to-b from-amber-50 to-white px-6 pb-8 pt-10 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100">
          <ShieldAlert aria-hidden="true" className="size-7 text-amber-600" />
        </div>
        <div className="space-y-1.5">
          <h2 id="sec-block-title" className="text-lg font-semibold text-slate-900">
            Your request was blocked
          </h2>
          <p className="text-sm text-slate-500 max-w-xs mx-auto">
            We detected something unusual and paused this action to keep your
            account safe. This is usually quick to fix.
          </p>
        </div>
      </div>

      {/* ── Steps ── */}
      <div className="px-6">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
          What to try
        </p>
        <ol className="space-y-4">
          {STEPS.map(({ icon: Icon, title, desc }, i) => (
            <li key={i} className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100">
                <Icon aria-hidden="true" className="size-4 text-slate-500" />
              </div>
              <div className="min-w-0 pt-0.5">
                <p className="text-sm font-medium text-slate-800">{title}</p>
                <p className="text-sm text-slate-500">{desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* ── Divider ── */}
      <div className="mx-6 my-6 border-t border-slate-100" />

      {/* ── Actions ── */}
      <div className="flex flex-col gap-2.5 px-6">
        <LaButton intent="primary-blue" size="big" onClick={signIn} className="w-full">
          <LogIn aria-hidden="true" />
          Sign in again
        </LaButton>
        <div className="flex gap-2">
          <LaButton intent="secondary" size="default" onClick={retry} className="flex-1">
            <RefreshCw aria-hidden="true" />
            Retry
          </LaButton>
          <LaButton intent="ghost" size="default" onClick={signOut} className="flex-1">
            <LogOut aria-hidden="true" />
            Sign out
          </LaButton>
        </div>
      </div>

      {/* ── Reference footer ── */}
      <div className="mt-6 flex items-center justify-between border-t border-slate-100 px-6 py-4">
        <span className="font-mono text-xs text-slate-400">{formatRef(eventMeta)}</span>
        <LaButton
          intent="link"
          size="compact"
          onClick={() => window.open(buildSupportUrl(eventMeta), "_blank", "noopener,noreferrer")}
        >
          Contact support
        </LaButton>
      </div>

    </div>
  );
}

/* ── Main component ─────────────────────────────────────────── */
export function SecurityBlock({ variant = "card", ...props }: SecurityBlockProps) {
  if (variant === "banner") return <SecurityBanner {...props} />;
  return <SecurityCard {...props} />;
}

/* ── Demo page ──────────────────────────────────────────────── */
const DEMO_META: SecurityEventMeta = {
  event_id:  "REF-20480",
  timestamp: new Date().toISOString(),
  path:      "/api/post/create",
  client_ip: "203.0.113.42",
  user_id:   "usr_4f2a9c",
};

export default function Page() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="mx-auto max-w-lg space-y-12">

        <div>
          <p className="mb-2 text-xs font-mono uppercase tracking-[0.2em] text-slate-400">
            Banner variant
          </p>
          <SecurityBlock variant="banner" eventMeta={DEMO_META} />
        </div>

        <div>
          <p className="mb-3 text-xs font-mono uppercase tracking-[0.2em] text-slate-400">
            Card variant
          </p>
          <SecurityBlock variant="card" eventMeta={DEMO_META} />
        </div>

      </div>
    </main>
  );
}

