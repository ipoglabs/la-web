"use client";

import { useReducer, useEffect, useRef, useCallback } from "react";
import { X } from "lucide-react";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

// URL served from /public — swap this for a real API endpoint when needed
const TERMS_CONTENT_URL = "/content/terms.html";

// ── Skeleton ──────────────────────────────────────────────────────────────────

function TermsSkeleton() {
  return (
    <div className="space-y-4 px-1 animate-pulse">
      <div className="h-5 w-2/5 rounded-md bg-slate-400" />
      <div className="space-y-2">
        <div className="h-3 w-full rounded-full bg-slate-300" />
        <div className="h-3 w-full rounded-full bg-slate-300" />
        <div className="h-3 w-4/5 rounded-full bg-slate-300" />
      </div>
      <div className="h-5 w-1/3 rounded-md bg-slate-400 mt-6" />
      <div className="space-y-2">
        <div className="h-3 w-full rounded-full bg-slate-300" />
        <div className="h-3 w-full rounded-full bg-slate-300" />
        <div className="h-3 w-3/5 rounded-full bg-slate-300" />
      </div>
      <div className="h-5 w-2/5 rounded-md bg-slate-400 mt-6" />
      <div className="space-y-2">
        <div className="h-3 w-full rounded-full bg-slate-300" />
        <div className="h-3 w-5/6 rounded-full bg-slate-300" />
      </div>
      <div className="h-5 w-1/4 rounded-md bg-slate-400 mt-6" />
      <div className="space-y-2">
        <div className="h-3 w-full rounded-full bg-slate-300" />
        <div className="h-3 w-full rounded-full bg-slate-300" />
        <div className="h-3 w-2/3 rounded-full bg-slate-300" />
      </div>
    </div>
  );
}

// ── State ────────────────────────────────────────────────────────────────────

type TermsState = {
  open: boolean;
  htmlContent: string | null;
  loading: boolean;
  scrolledToBottom: boolean;
};

type TermsAction =
  | { type: "OPEN" }            // resets all state and triggers fetch
  | { type: "CLOSE" }
  | { type: "LOADED"; html: string }
  | { type: "SCROLLED_BOTTOM" };

const initialState: TermsState = {
  open: false,
  htmlContent: null,
  loading: false,
  scrolledToBottom: false,
};

function termsReducer(state: TermsState, action: TermsAction): TermsState {
  switch (action.type) {
    case "OPEN":
      return { open: true, htmlContent: null, loading: true, scrolledToBottom: false };
    case "CLOSE":
      return { ...state, open: false };
    case "LOADED":
      return { ...state, htmlContent: action.html, loading: false };
    case "SCROLLED_BOTTOM":
      return { ...state, scrolledToBottom: true };
  }
}

// ── Component ───────────────────────────────────────────────────────────────

export function TermsResponsiveDialog() {
  const [state, dispatch] = useReducer(termsReducer, initialState);
  const { open, htmlContent, loading, scrolledToBottom } = state;
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // Fetch when open becomes true
  useEffect(() => {
    if (!open) return;
    const controller = new AbortController();

    const minDelay = new Promise<void>((res) => setTimeout(res, 6000));
    const fetchContent = fetch(TERMS_CONTENT_URL, { signal: controller.signal }).then((r) => r.text());

    Promise.all([minDelay, fetchContent])
      .then(([, html]) => dispatch({ type: "LOADED", html }))
      .catch(() => { /* aborted on close — ignore */ });

    return () => controller.abort();
  }, [open]);

  // Detect scroll reaching bottom
  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 8;
    if (atBottom) dispatch({ type: "SCROLLED_BOTTOM" });
  }, []);

  // Re-check on content load (short content may already be at bottom)
  useEffect(() => {
    if (!htmlContent) return;
    const el = scrollRef.current;
    if (!el) return;
    const timer = setTimeout(() => {
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 8;
      if (atBottom) dispatch({ type: "SCROLLED_BOTTOM" });
    }, 50);
    return () => clearTimeout(timer);
  }, [htmlContent]);

  // TODO: [API] POST /api/terms/accept — record user acceptance with timestamp
  function handleAccept() {
    dispatch({ type: "CLOSE" });
  }

  const onOpenChange = (o: boolean) => dispatch({ type: o ? "OPEN" : "CLOSE" });

  // ── Shared render pieces ──────────────────────────────────────────────────
  // Defined as variables so they can be composed into either the Dialog (desktop)
  // or the Drawer (mobile) without duplicating markup.

  const triggerButton = (
    <button
      type="button"
      className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-slate-50 hover:bg-slate-700 transition-colors"
    >
      View Terms &amp; Conditions
    </button>
  );

  const innerContent = (
    <>
      {/* Scrollable content */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-6 py-5 min-h-0"
      >
        {loading ? (
          <TermsSkeleton />
        ) : (
          <div
            className={cn(
              "prose prose-sm max-w-none",
              "prose-headings:font-semibold prose-headings:text-slate-800",
              "prose-h2:text-base prose-h3:text-sm",
              "prose-p:text-slate-600 prose-p:leading-relaxed",
              "prose-li:text-slate-600",
              "prose-strong:text-slate-800",
              "prose-a:text-slate-700"
            )}
            dangerouslySetInnerHTML={{ __html: htmlContent ?? "" }}
          />
        )}
      </div>

      {/* Scroll progress hint */}
      {!loading && !scrolledToBottom && (
        <p className="text-center text-xs text-slate-400 py-2 border-t border-slate-100">
          Scroll to the bottom to accept
        </p>
      )}
    </>
  );

  const acceptButton = (
    <button
      type="button"
      disabled={!scrolledToBottom || loading}
      onClick={handleAccept}
      className={cn(
        "w-full rounded-lg px-5 py-3 text-sm font-semibold transition-all",
        scrolledToBottom && !loading
          ? "bg-slate-900 text-slate-50 hover:bg-slate-700 cursor-pointer"
          : "bg-slate-100 text-slate-400 cursor-not-allowed"
      )}
    >
      {loading ? "Loading…" : scrolledToBottom ? "Accept & Continue" : "Read to the end to accept"}
    </button>
  );

  // ── Responsive shell ────────────────────────────────────────────────────────
  // isDesktop: Dialog (centered modal) | mobile: Drawer (bottom sheet)

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>{triggerButton}</DialogTrigger>
        <DialogContent
          className="max-h-[85dvh] flex flex-col p-0 gap-0"
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader className="border-b border-slate-100 px-6 pt-6 pb-4">
            <DialogTitle>Terms &amp; Conditions</DialogTitle>
            <DialogDescription>
              Please read carefully and scroll to the bottom to accept.
            </DialogDescription>
          </DialogHeader>
          {innerContent}
          <DialogFooter className="border-t border-slate-100 px-6 pt-3 pb-6">
            {acceptButton}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // ── Mobile: bottom Drawer ───────────────────────────────────────────────────
  return (
    <Drawer open={open} onOpenChange={onOpenChange} dismissible={false}>
      <DrawerTrigger asChild>{triggerButton}</DrawerTrigger>
      <DrawerContent className="max-h-[92dvh] flex flex-col">
        <DrawerHeader className="border-b border-slate-100 relative">
          <DrawerTitle>Terms &amp; Conditions</DrawerTitle>
          <DrawerDescription>
            Please read carefully and scroll to the bottom to accept.
          </DrawerDescription>
          <button
            type="button"
            onClick={() => dispatch({ type: "CLOSE" })}
            className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100"
          >
            <X className="h-4 w-4 text-slate-500" />
            <span className="sr-only">Close</span>
          </button>
        </DrawerHeader>
        {innerContent}
        <DrawerFooter className="border-t border-slate-100">
          {acceptButton}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
