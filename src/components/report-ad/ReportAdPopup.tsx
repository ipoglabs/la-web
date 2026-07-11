"use client";

/**
 * ReportAdPopup.tsx
 *
 * Uses a single <Dialog> + <DialogPrimitive.Content> with inline styles for
 * positioning. This means:
 *   1. No component swapping on resize → journey state is always preserved.
 *   2. Inline styles give 100% reliable positioning with no Tailwind class
 *      conflicts (no tailwind-merge dedup issues with fixed+transform).
 *   3. useMediaQuery drives STYLES only, not component identity.
 *
 *   Mobile  (<768px): bottom sheet  — slide-up animation
 *   Desktop (≥768px): centred popup — fade animation
 */

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useEffect, useState, startTransition, CSSProperties } from "react";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import ReportAdJourney from "./ReportAdJourney";
import type { ReportAdTarget, ReportAdPayload, ReportAdTicket } from "./types";

export interface ReportAdPopupProps {
  open:          boolean;
  onOpenChange:  (open: boolean) => void;
  target:        ReportAdTarget;
  onSubmit?:     (payload: ReportAdPayload) => Promise<ReportAdTicket> | ReportAdTicket | void;
  className?:    string;
}

function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Close report dialog"
      className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-800 z-10"
    >
      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" aria-hidden>
        <path d="M18 6L6 18M6 6l12 12" strokeWidth="2.5" />
      </svg>
    </button>
  );
}

export function ReportAdPopup({ open, onOpenChange, target, onSubmit, className }: ReportAdPopupProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [journeyKey, setJourneyKey] = useState(0);
  const [step, setStep] = useState<1 | 2 | 3>(1);

  useEffect(() => {
    if (open) {
      startTransition(() => {
        setJourneyKey((k) => k + 1);
        setStep(1);
      });
    }
  }, [open]);

  const handleComplete = () => onOpenChange(false);

  // Inline styles — 100% reliable, no Tailwind class conflict
  const contentStyle: CSSProperties = isDesktop
    ? {
        position:     "fixed",
        top:          "50%",
        left:         "50%",
        transform:    "translate(-50%, -50%)",
        width:        "100%",
        maxWidth:     "28rem",   // ~448px (md)
        height:       "85dvh",
        borderRadius: "1.5rem",  // rounded-3xl
      }
    : {
        position:     "fixed",
        left:         0,
        right:        0,
        bottom:       0,
        width:        "100%",
        height:       "82dvh",
        borderRadius: "1rem 1rem 0 0",  // rounded-t-2xl
      };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
          style={contentStyle}
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
          className={cn(
            "report-ad-popup z-50 bg-white outline-none overflow-hidden flex flex-col",
            "shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_0_32px_rgba(0,0,0,0.35)]",
            className,
          )}
        >
          {/* Drag handle — mobile only, rose tint on step 3 */}
          {!isDesktop && (
            <div className={cn(
              "shrink-0 pt-2 pb-1.5 flex justify-center",
              step === 3 ? "bg-rose-500" : "bg-white",
            )}>
              <div className={cn("h-1 w-10 rounded-full", step === 3 ? "bg-white/40" : "bg-slate-300")} />
            </div>
          )}

          <DialogHeader className="sr-only">
            <DialogTitle>Report this ad</DialogTitle>
            <DialogDescription>Help us keep the platform safe.</DialogDescription>
          </DialogHeader>

          <CloseButton onClick={() => onOpenChange(false)} />

          <ReportAdJourney
            key={journeyKey}
            target={target}
            className="flex-1 min-h-0"
            layout="popup"
            onSubmit={onSubmit}
            onComplete={handleComplete}
            onStepChange={setStep}
          />
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}

