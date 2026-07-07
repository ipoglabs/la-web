/**
 * LaSeparator — la design system separator
 * Pure visual primitive.
 *
 * Props:
 *   - orientation → "horizontal" (default) | "vertical"
 *   - label       → optional centred text label
 */
import * as React from "react";
import { cn } from "@/lib/utils";

export interface LaSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  label?: string;
}

function LaSeparator({
  orientation = "horizontal",
  label,
  className,
  ...props
}: LaSeparatorProps) {
  if (orientation === "vertical") {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={cn("inline-block w-px self-stretch bg-slate-300", className)}
        {...props}
      />
    );
  }

  if (label) {
    return (
      <div
        role="separator"
        aria-orientation="horizontal"
        className={cn("flex items-center gap-3", className)}
        {...props}
      >
        <span className="h-px flex-1 bg-slate-300" />
        <span className="text-xs font-medium text-slate-400">{label}</span>
        <span className="h-px flex-1 bg-slate-300" />
      </div>
    );
  }

  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      className={cn("h-px w-full bg-slate-300", className)}
      {...props}
    />
  );
}

export { LaSeparator };
