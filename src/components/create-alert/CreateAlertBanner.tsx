"use client";

import { useState } from "react";
import { Bell, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { CreateAlertDialog } from "./CreateAlertDialog";
import { LaButton } from "@/components/la";
import type { AlertPayload } from "./types";

interface CreateAlertBannerProps {
  className?: string;
  onAlertCreated?: (payload: AlertPayload) => Promise<void> | void;
}

export function CreateAlertBanner({ className, onAlertCreated }: CreateAlertBannerProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Banner */}
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl",
          "bg-linear-to-br from-rose-100 via-pink-50 to-rose-100 border border-rose-200",
          className,
        )}
      >
        {/* Decorative bg circles */}
        <div className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-rose-200/30" />
        <div className="pointer-events-none absolute right-8 -bottom-8 h-20 w-20 rounded-full bg-pink-200/30" />

        <div className="relative flex items-start sm:items-center gap-3 sm:gap-4 px-5 py-4">
          {/* Icon */}
          <div className="mt-0.5 sm:mt-0 shrink-0 flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-rose-100">
            <Bell className="h-5 w-5 text-rose-500" fill="currentColor" strokeWidth={0} />
          </div>

          {/* Text + button — stacks on mobile, row on sm+ */}
          <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 leading-snug">Never miss a great deal!</p>
              <p className="mt-0.5 text-sm text-slate-500 leading-snug">
                Create an alert and get notified instantly
              </p>
            </div>
            <LaButton
              type="button"
              intent="primary-rose"
              size="default"
              className="w-full sm:w-auto shrink-0"
              onClick={() => setOpen(true)}
            >
              Create Alert
              <ArrowRight className="h-4 w-4" />
            </LaButton>
          </div>
        </div>
      </div>

      {/* Dialog / Drawer */}
      <CreateAlertDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={onAlertCreated}
      />
    </>
  );
}
