"use client";

import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import CreateAlertJourney from "./CreateAlertJourney";
import type { AlertPayload } from "./types";

interface CreateAlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (payload: AlertPayload) => Promise<void> | void;
  className?: string;
}

export function CreateAlertDialog({
  open,
  onOpenChange,
  onSubmit,
  className,
}: CreateAlertDialogProps) {
  const isTabletOrAbove = useMediaQuery("(min-width: 768px)");

  const handleComplete = () => onOpenChange(false);

  // ── Mobile: Bottom sheet drawer ───────────────────────────────────────────
  if (!isTabletOrAbove) {
    return (
      // TODO [INTEGRATION]: If user navigates away mid-flow, check if they have unsaved progress
      // and confirm before closing (e.g. "Leave without saving alert?")
      <Drawer open={open} onOpenChange={onOpenChange} dismissible={false}>
        <DrawerContent
          className={cn(
            "h-[90dvh] flex flex-col",
            className,
          )}
        >
          {/* Drag handle */}
          <div className="shrink-0 bg-white rounded-t-2xl pt-2 pb-1.5 flex justify-center">
            <div className="h-1 w-10 rounded-full bg-slate-300" />
          </div>

          {/* Close button */}
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="Close"
            className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-800 z-10"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" aria-hidden>
              <path d="M18 6L6 18M6 6l12 12" strokeWidth="2.5" />
            </svg>
          </button>

          <DrawerHeader className="sr-only">
            <DrawerTitle>Create Alert</DrawerTitle>
            <DrawerDescription>
              Set up an alert to be notified of new listings instantly.
            </DrawerDescription>
          </DrawerHeader>

          <CreateAlertJourney
            className="flex-1 overflow-hidden rounded-none border-0 shadow-none"
            layout="popup"
            onSubmit={onSubmit}
            onComplete={handleComplete}
          />
        </DrawerContent>
      </Drawer>
    );
  }

  // ── Tablet+: Centered dialog popup ────────────────────────────────────────
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        // TODO [INTEGRATION]: Allow dismiss after Step 3 (alert already saved), block during Steps 1–2
        className={cn(
          "h-[88dvh] max-h-170 w-full max-w-md overflow-hidden rounded-3xl p-0",
          "flex flex-col ring-1 ring-slate-900/8 shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_0_32px_rgba(0,0,0,0.35)]",
          className,
        )}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Create Alert</DialogTitle>
          <DialogDescription>
            Set up an alert to be notified of new listings instantly.
          </DialogDescription>
        </DialogHeader>

        {/* Close button */}
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          aria-label="Close"
          className="absolute right-3 top-3 flex h-8 w-8 flex-none items-center justify-center rounded-full bg-slate-200 text-slate-600 transition-colors hover:bg-slate-300 hover:text-slate-800"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" aria-hidden>
            <path d="M18 6L6 18M6 6l12 12" strokeWidth="2.5" />
          </svg>
        </button>

        <CreateAlertJourney
          className="h-full max-w-none rounded-none border-0 shadow-none"
          layout="popup"
          onSubmit={onSubmit}
          onComplete={handleComplete}
        />
      </DialogContent>
    </Dialog>
  );
}
