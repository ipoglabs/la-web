/**
 * LaButton — la design system button
 * Own CVA — not delegating to ui/button variants.
 *
 * intent:
 *   Primary family (solid, high-emphasis):
 *     "primary"       — dark / black  (default)
 *     "primary-blue"  — blue
 *     "primary-rose"  — rose / pink
 *     "primary-amber" — amber / yellow
 *   Supporting:
 *     "secondary"  — light grey, medium emphasis
 *     "danger"     — red, destructive
 *     "outline"    — bordered, transparent fill
 *     "ghost"      — no border, no fill
 *     "link"       — inline text action
 *
 * Naming (updated):
 *   Mini     — smallest
 *   Compact  — compact / small
 *   Default  — default visual (was "big")
 *   Big      — larger (was "bigger")
 *   Bigger   — even larger (was "large")
 *   Biggest  — largest (was "larger")
 *
 * font size: "mini" (10px) | "compact" (12px) | "default" (14px) | "big" (16px) | "bigger" (20px) | "biggest" (24px)
 * size:      "mini" (h-20px) | "compact" (h-28px) | "default" (h-36px) | "big" (h-48px) | "bigger" (h-56px) | "biggest" (h-64px)
 * loading:  spinner, disables interaction
 * iconOnly: collapses to a square (removes h-padding)
 */
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const laButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      intent: {
        // ─ Primary family ─ retheme by changing --la-* vars in globals.css only
        "primary":        "bg-[var(--la-primary)] text-[var(--la-primary-fg)] hover:bg-[var(--la-primary-hover)] focus-visible:ring-[var(--la-primary)]",
        "primary-blue":   "bg-[var(--la-primary-blue)] text-[var(--la-primary-blue-fg)] hover:bg-[var(--la-primary-blue-hover)] focus-visible:ring-[var(--la-primary-blue)]",
        "primary-rose":   "bg-[var(--la-primary-rose)] text-[var(--la-primary-rose-fg)] hover:bg-[var(--la-primary-rose-hover)] focus-visible:ring-[var(--la-primary-rose)]",
        "primary-amber":  "bg-[var(--la-primary-amber)] text-[var(--la-primary-amber-fg)] hover:bg-[var(--la-primary-amber-hover)] focus-visible:ring-[var(--la-primary-amber)]",
        // ─ Supporting ─
        "secondary":      "bg-slate-200 text-slate-900 hover:bg-slate-400/40 focus-visible:ring-slate-400",
        "danger":         "bg-[var(--la-danger)] text-[var(--la-danger-fg)] hover:bg-[var(--la-danger-hover)] focus-visible:ring-[var(--la-danger)]",
        "outline":        "border-[1.5px] border-slate-400 bg-transparent text-slate-900 hover:bg-slate-100 focus-visible:ring-slate-400",
        "ghost":          "bg-transparent text-slate-700 hover:bg-slate-100 focus-visible:ring-slate-400",
        "link":           "bg-transparent text-blue-700 underline-offset-4 hover:underline focus-visible:ring-blue-400",
      },
      size: {
        mini:      "h-5  px-2.5 text-[10px] font-medium [&_svg]:size-3",
        compact:   "h-7  px-3.5 text-xs     font-medium [&_svg]:size-3.5",
        default:   "h-9  px-5   text-sm     font-medium [&_svg]:size-4",
        big:       "h-12 px-6   text-base   font-medium [&_svg]:size-[18px]",
        bigger:    "h-15 px-8   text-2xl    font-light [&_svg]:size-5",
        biggest:   "h-18 px-10  text-3xl    font-light [&_svg]:size-6",
      },
    },
    defaultVariants: {
      intent: "primary",
      size: "default",
    },
  }
);

// Square dimensions per size for icon-only mode
const iconOnlyClass: Record<string, string> = {
  mini:      "w-5  px-0",
  compact:   "w-7  px-0",
  default:   "w-9  px-0",
  big:       "w-12 px-0",
  bigger:    "w-14 px-0",
  biggest:   "w-16 px-0",
};

export interface LaButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof laButtonVariants> {
  asChild?:  boolean;
  loading?:  boolean;
  /** Collapse to square — use when button contains only an icon */
  iconOnly?: boolean;
}

const LaButton = React.forwardRef<HTMLButtonElement, LaButtonProps>(
  (
    { intent, size, asChild = false, loading = false, iconOnly = false, disabled, children, className, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          laButtonVariants({ intent, size }),
          iconOnly && iconOnlyClass[size ?? "default"],
          loading && {
            mini:      "pl-2",
            compact:   "pl-2.5",
            default:   "pl-3",
            big:       "pl-3.5",
            bigger:    "pl-4",
            biggest:   "pl-4.5",
          }[size ?? "default"],
          className
        )}
        {...props}
      >
        {asChild ? (
          children
        ) : (
          <>
            {loading && <Loader2 className="animate-spin" />}
            {children}
          </>
        )}
      </Comp>
    );
  }
);
LaButton.displayName = "LaButton";

export { LaButton, laButtonVariants };
