/**
 * LaSkeleton — la design system loading placeholder
 * Pure visual primitive — no Radix dependency.
 *
 * Props:
 *   - shape → "block" (default, rounded-lg) | "text" (rounded, h-4) | "circle" (rounded-full)
 *   - Size is controlled via className (e.g. "h-4 w-2/5", "size-12") like any other div.
 */
import * as React from "react";
import { cn } from "@/lib/utils";

export interface LaSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  shape?: "block" | "text" | "circle";
}

function LaSkeleton({ shape = "block", className, ...props }: LaSkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-slate-200",
        shape === "circle" && "rounded-full",
        shape === "text" && "rounded h-4",
        shape === "block" && "rounded-lg",
        className
      )}
      {...props}
    />
  );
}

export { LaSkeleton };
