"use client";

/**
 * ResponsiveEditor — shared Dialog (tablet+) / Drawer (mobile) wrapper used
 * by every editor on the /profile page, plus AddPhoneEditor.tsx (a sibling
 * feature file for the phone-add/edit OTP flow). Split out of page.tsx
 * (Golden Rule file-size split, 2026-07-14) so it no longer lives inside a
 * route file — AddPhoneEditor.tsx previously imported it from "./page".
 */

import type { ReactNode } from "react";
import { XIcon } from "lucide-react";
import { LaButton } from "@/components/la";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

export function ResponsiveEditor({
  open,
  onOpenChange,
  title,
  children,
  onSave,
  saveLabel = "Save Changes",
  saveDisabled = false,
  hideSaveButton = false,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
  onSave: () => void;
  saveLabel?: string;
  saveDisabled?: boolean;
  /** Hide the primary action button — for steps where the body itself drives progress (e.g. an auto-submitting OTP field). Cancel remains available. */
  hideSaveButton?: boolean;
}) {
  const isTablet = useMediaQuery("(min-width: 768px)");

  if (isTablet) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="flex max-h-[85vh] max-w-md flex-col gap-0 p-0" showCloseButton>
          <DialogHeader className="border-b border-slate-200 px-6 py-4">
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
          <DialogFooter className="mx-0 mb-0 rounded-b-xl border-t border-slate-100 px-6 py-4">
            <LaButton type="button" intent="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </LaButton>
            {!hideSaveButton && (
              <LaButton type="button" onClick={onSave} disabled={saveDisabled}>
                {saveLabel}
              </LaButton>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange} noBodyStyles shouldScaleBackground={false}>
      <DrawerContent className="max-h-[90dvh]">
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerClose asChild>
            <button
              type="button"
              className="rounded-md p-1.5 text-slate-500 opacity-70 transition-opacity hover:bg-slate-100 hover:opacity-100"
            >
              <XIcon className="size-4" />
              <span className="sr-only">Close</span>
            </button>
          </DrawerClose>
        </DrawerHeader>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{children}</div>
        <DrawerFooter className={cn("grid gap-3", hideSaveButton ? "grid-cols-1" : "grid-cols-2")}>
          <DrawerClose asChild>
            <LaButton type="button" intent="outline" className="w-full">
              Cancel
            </LaButton>
          </DrawerClose>
          {!hideSaveButton && (
            <LaButton
              type="button"
              onClick={onSave}
              className="w-full"
              disabled={saveDisabled}
            >
              {saveLabel}
            </LaButton>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
