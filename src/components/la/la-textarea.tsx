/**
 * LaTextarea — la design system textarea
 * Same visual language as LaInput — border, bg, focus ring.
 *
 * ─────────────────────────────────────────────────────────────
 * IMPORT
 * ─────────────────────────────────────────────────────────────
 *   import { LaTextarea } from "@/components/la";
 *
 * ─────────────────────────────────────────────────────────────
 * BASIC
 * ─────────────────────────────────────────────────────────────
 *   <LaTextarea placeholder="Tell us more..." />
 *   <LaTextarea rows={5} placeholder="Detailed description" />
 *
 * ─────────────────────────────────────────────────────────────
 * STATUS
 * ─────────────────────────────────────────────────────────────
 *   <LaTextarea status="error" placeholder="Required" />
 *   <LaTextarea status="success" placeholder="Looks good!" />
 */
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type LaTextareaStatus = "default" | "error" | "success";

export interface LaTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  status?: LaTextareaStatus;
}

const statusStyles: Record<LaTextareaStatus, string> = {
  default: "",
  error:   "border-red-500 focus-visible:ring-red-500/25 focus-visible:bg-red-50",
  success: "border-green-600 focus-visible:ring-green-600/25 focus-visible:bg-green-50",
};

const LaTextarea = React.forwardRef<HTMLTextAreaElement, LaTextareaProps>(
  ({ status = "default", className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-[88px] w-full rounded-md border-[1.5px] border-gray-700/55 bg-gray-50 px-3 py-2.5",
        "text-base font-normal text-gray-900 placeholder:text-gray-500",
        "resize-y leading-relaxed",
        "focus-visible:bg-yellow-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/25 focus-visible:ring-offset-1",
        "disabled:cursor-not-allowed disabled:opacity-50",
        statusStyles[status],
        className,
      )}
      {...props}
    />
  ),
);

LaTextarea.displayName = "LaTextarea";

export { LaTextarea };
