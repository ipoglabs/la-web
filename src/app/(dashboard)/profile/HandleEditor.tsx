"use client";

/**
 * HandleEditor — sets the user's public @handle (lokalads.com/{handle}),
 * with debounced live availability checking against /api/profile/check-handle.
 * Split out of page.tsx (Golden Rule file-size split, 2026-07-14).
 *
 * Has custom save-disabled logic tied to availability state, so it renders
 * its own Dialog/Drawer rather than using ResponsiveEditor.
 */

import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, Loader2, XIcon } from "lucide-react";
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

const HANDLE_REGEX = /^[a-z0-9_]{3,20}$/;

export function HandleEditor({
  open,
  onOpenChange,
  currentHandle,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentHandle: string;
  onSave: (handle: string) => void;
}) {
  const isTablet = useMediaQuery("(min-width: 768px)");
  const [draft, setDraft] = useState(currentHandle);
  const [checkState, setCheckState] = useState<"idle" | "checking" | "available" | "taken">("idle");

  // Reset to current handle each time the editor opens
  useEffect(() => {
    if (open) {
      setDraft(currentHandle);
      setCheckState("idle");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const isValidFormat = HANDLE_REGEX.test(draft);
  const isUnchanged = draft === currentHandle;
  const canSave = checkState === "available";

  const handleInputChange = (raw: string) => {
    // Strip disallowed chars, enforce lowercase
    const cleaned = raw.toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 20);
    setDraft(cleaned);
  };

  // Auto-check availability as the user types (debounced) — no manual button.
  useEffect(() => {
    if (!open || !isValidFormat || isUnchanged) {
      setCheckState("idle");
      return;
    }
    setCheckState("checking");
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch("/api/profile/check-handle", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ handle: draft }),
          signal: controller.signal,
        });
        const data = (await res.json()) as { available: boolean };
        setCheckState(data.available ? "available" : "taken");
      } catch (err) {
        if ((err as Error).name !== "AbortError") setCheckState("idle");
      }
    }, 500);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [draft, isValidFormat, isUnchanged, open]);

  const handleSave = () => {
    // TODO [INTEGRATION]: PATCH /api/users/me/handle { handle: draft }
    onSave(draft);
    onOpenChange(false);
  };

  const form = (
    <div className="space-y-2 px-6 py-5">
      {/* Live URL preview — read-only, sits above the input */}
      <p className="break-all text-xl text-slate-500">
        lokalads.com/<span className="font-semibold text-slate-800">{draft || "your-handle"}</span>
      </p>

      {/* Plain input — nothing but the handle itself, unambiguous to edit */}
      <div
        className={cn(
          "flex items-stretch overflow-hidden rounded-md border-[1.5px] border-gray-700/55 bg-white",
          "focus-within:bg-yellow-50 focus-within:ring-2 focus-within:ring-blue-500/25 focus-within:ring-offset-1",
          checkState === "taken" && "border-red-500"
        )}
      >
        <input
          value={draft}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="jane_smith"
          autoComplete="off"
          spellCheck={false}
          aria-label="Handle"
          className="min-w-0 flex-1 bg-transparent py-2.5 pr-2 pl-3 text-base font-medium text-gray-900 placeholder:font-normal placeholder:text-gray-500 focus:outline-none"
        />
        <span className="flex shrink-0 items-center pr-3" aria-hidden={checkState === "idle"}>
          {checkState === "checking" && <Loader2 className="size-4 animate-spin text-slate-400" />}
          {checkState === "available" && <CheckCircle2 className="size-4 text-emerald-600" />}
          {checkState === "taken" && <AlertCircle className="size-4 text-rose-500" />}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          {checkState === "available" ? (
            <span className="font-medium text-emerald-700">Available</span>
          ) : checkState === "taken" ? (
            <span className="font-medium text-rose-700">Already taken — try another</span>
          ) : (
            "3–20 characters · lowercase letters, numbers, underscores"
          )}
        </p>
        <p
          className={`shrink-0 text-sm tabular-nums ${draft.length > 17 ? "font-semibold text-amber-600" : "text-slate-400"}`}
        >
          {draft.length}/20
        </p>
      </div>
    </div>
  );

  // Handle editor has custom save-disabled logic, so it doesn't use ResponsiveEditor.
  if (isTablet) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md gap-0 p-0" showCloseButton>
          <DialogHeader className="border-b border-slate-200 px-6 py-4">
            <DialogTitle>Set Your Handle</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto">{form}</div>
          <DialogFooter className="mx-0 mb-0 rounded-b-xl border-t border-slate-100 px-6 py-4">
            <LaButton type="button" intent="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </LaButton>
            <LaButton type="button" onClick={handleSave} disabled={!canSave}>
              Set Handle
            </LaButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange} noBodyStyles shouldScaleBackground={false}>
      <DrawerContent className="max-h-[90dvh]">
        <DrawerHeader>
          <DrawerTitle>Set Your Handle</DrawerTitle>
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
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{form}</div>
        <DrawerFooter className="grid grid-cols-2 gap-3">
          <DrawerClose asChild>
            <LaButton type="button" intent="outline" className="w-full">
              Cancel
            </LaButton>
          </DrawerClose>
          <LaButton type="button" onClick={handleSave} className="w-full" disabled={!canSave}>
            Set Handle
          </LaButton>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
