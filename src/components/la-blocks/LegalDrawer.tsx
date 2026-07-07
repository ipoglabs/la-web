"use client";

/**
 * LegalDrawer — loads country-specific legal HTML content (privacy policy,
 * terms & conditions, cookie policy) into a responsive overlay.
 *
 * Mobile  → bottom Sheet (Drawer)
 * Desktop → centered Dialog
 *
 * HTML files are served from /public/html/{countryCode}/{type}.html
 *
 * Usage:
 *   <LegalDrawer countryCode="uk" type="privacy-policy">
 *     <button>Privacy Policy</button>
 *   </LegalDrawer>
 */

import { useReducer, useEffect, useRef, useCallback } from "react";
import type { ReactNode } from "react";
import { X } from "lucide-react";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { LaButton } from "@/components/la";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { CountryCode } from "@/config";

// ── Types ─────────────────────────────────────────────────────────────────────

export type LegalDocType = "privacy-policy" | "terms" | "cookie-policy";

const TITLES: Record<LegalDocType, string> = {
  "privacy-policy": "Privacy Policy",
  "terms": "Terms & Conditions",
  "cookie-policy": "Cookie Policy",
};

// ── Skeleton ──────────────────────────────────────────────────────────────────

function LegalSkeleton() {
  return (
    <div className="space-y-4 px-1 animate-pulse" aria-label="Loading content">
      <div className="h-5 w-2/5 rounded-md bg-slate-200" />
      <div className="space-y-2">
        <div className="h-3 w-full rounded-full bg-slate-100" />
        <div className="h-3 w-full rounded-full bg-slate-100" />
        <div className="h-3 w-4/5 rounded-full bg-slate-100" />
      </div>
      <div className="h-5 w-1/3 rounded-md bg-slate-200 mt-6" />
      <div className="space-y-2">
        <div className="h-3 w-full rounded-full bg-slate-100" />
        <div className="h-3 w-full rounded-full bg-slate-100" />
        <div className="h-3 w-3/5 rounded-full bg-slate-100" />
      </div>
      <div className="h-5 w-2/5 rounded-md bg-slate-200 mt-6" />
      <div className="space-y-2">
        <div className="h-3 w-full rounded-full bg-slate-100" />
        <div className="h-3 w-5/6 rounded-full bg-slate-100" />
      </div>
    </div>
  );
}

// ── State ────────────────────────────────────────────────────────────────────

type DrawerState = {
  open: boolean;
  html: string | null;
  loading: boolean;
  error: boolean;
};

type DrawerAction =
  | { type: "OPEN" }
  | { type: "CLOSE" }
  | { type: "LOADED"; html: string }
  | { type: "ERROR" };

const initialState: DrawerState = {
  open: false,
  html: null,
  loading: false,
  error: false,
};

function drawerReducer(state: DrawerState, action: DrawerAction): DrawerState {
  switch (action.type) {
    case "OPEN":
      return { open: true, html: null, loading: true, error: false };
    case "CLOSE":
      return { ...state, open: false };
    case "LOADED":
      return { ...state, html: action.html, loading: false };
    case "ERROR":
      return { ...state, loading: false, error: true };
  }
}

// ── Props ────────────────────────────────────────────────────────────────────

interface LegalDrawerProps {
  countryCode: CountryCode;
  type: LegalDocType;
  children: ReactNode;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function LegalDrawer({ countryCode, type, children }: LegalDrawerProps) {
  const [state, dispatch] = useReducer(drawerReducer, initialState);
  const { open, html, loading, error } = state;
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const title = TITLES[type];
  const contentUrl = `/html/${countryCode}/${type}.html`;

  // Fetch on open
  useEffect(() => {
    if (!open) return;
    const controller = new AbortController();
    fetch(contentUrl, { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load");
        return r.text();
      })
      .then((text) => dispatch({ type: "LOADED", html: text }))
      .catch((err) => {
        if (err.name !== "AbortError") dispatch({ type: "ERROR" });
      });
    return () => controller.abort();
  }, [open, contentUrl]);

  // Scroll to top when new content loads
  useEffect(() => {
    if (html) scrollRef.current?.scrollTo({ top: 0 });
  }, [html]);

  const onOpenChange = useCallback(
    (o: boolean) => dispatch({ type: o ? "OPEN" : "CLOSE" }),
    []
  );

  const handleClose = useCallback(() => dispatch({ type: "CLOSE" }), []);

  // ── Shared header ─────────────────────────────────────────────────────────

  const sharedHeader = (
    <div className="relative shrink-0 bg-slate-200 border-b border-slate-300 px-5 py-3 pr-12 rounded-t-xl">
      <p className="text-base-plus font-bold text-slate-900 leading-tight">{title}</p>
      <p className="text-sm text-slate-500">{countryCode.toUpperCase()} &nbsp;·&nbsp; lokalads</p>
      <button
        type="button"
        onClick={handleClose}
        aria-label="Close"
        className="absolute top-1/2 -translate-y-1/2 right-3 size-8 flex items-center justify-center rounded-full bg-slate-300 hover:bg-slate-400 text-slate-700 transition-colors"
      >
        <X className="size-4" />
      </button>
    </div>
  );

  // ── Shared footer ─────────────────────────────────────────────────────────

  const sharedFooter = (
    <div className="shrink-0 bg-slate-200 border-t border-slate-300 px-5 py-3 flex items-center justify-end">
      <LaButton intent="primary-blue" size="default" onClick={handleClose}>
        Close
      </LaButton>
    </div>
  );

  // ── Shared content ────────────────────────────────────────────────────────

  const bodyContent = (
    <div
      ref={scrollRef}
      role="region"
      aria-label={title}
      aria-live="polite"
      className="flex-1 overflow-y-auto px-6 py-5 min-h-0"
    >
      {loading && <LegalSkeleton />}
      {error && (
        <p className="text-sm text-slate-500 text-center py-8">
          Unable to load content. Please try again later.
        </p>
      )}
      {html && !loading && (
        <div
          className="la-legal"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      )}
    </div>
  );

  // ── Desktop: Dialog ───────────────────────────────────────────────────────

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="max-h-[85dvh] flex flex-col p-0 gap-0 sm:max-w-2xl overflow-hidden" showCloseButton={false}>
          <DialogTitle className="sr-only">{title}</DialogTitle>
          <DialogDescription className="sr-only">{title} for {countryCode.toUpperCase()}</DialogDescription>
          {sharedHeader}
          {bodyContent}
          {sharedFooter}
        </DialogContent>
      </Dialog>
    );
  }

  // ── Mobile: bottom Drawer ────────────────────────────────────────────────

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="max-h-[92dvh] flex flex-col overflow-hidden">
        <DrawerTitle className="sr-only">{title}</DrawerTitle>
        <DrawerDescription className="sr-only">{title} for {countryCode.toUpperCase()}</DrawerDescription>
        {sharedHeader}
        {bodyContent}
        {sharedFooter}
      </DrawerContent>
    </Drawer>
  );
}
