/**
 * LaBadge — la design system badge
 * Pure visual primitive — no Radix dependency.
 *
 * Props:
 *   - intent   → semantic meaning (not a color name)
 *               "neutral" | "info" | "success" | "warning" | "danger" | "brand" | "purple"
 *   - variant  → visual style: "soft" (default) | "solid" | "outline"
 *   - size     → "sm" | "md"
 *   - dot      → status dot before label
 *
 * To retheme: change the Tailwind classes in compoundVariants — API stays the same.
 */
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 font-medium rounded-full whitespace-nowrap",
  {
    variants: {
      intent: {
        neutral: "",
        info:    "",
        success: "",
        warning: "",
        danger:  "",
        brand:   "",
        purple:  "",
      },
      variant: {
        soft:    "",
        solid:   "",
        outline: "border bg-transparent",
      },
      size: {
        sm: "px-2   py-0.5 text-sm",
        md: "px-2.5 py-1   text-sm",
      },
    },
    // Compound: intent × variant — change colors here when retheming
    compoundVariants: [
      // soft (default)
      { intent: "neutral", variant: "soft",    class: "bg-slate-100  text-slate-700" },
      { intent: "info",    variant: "soft",    class: "bg-blue-50    text-blue-700" },
      { intent: "success", variant: "soft",    class: "bg-green-50   text-green-700" },
      { intent: "warning", variant: "soft",    class: "bg-yellow-50  text-yellow-800" },
      { intent: "danger",  variant: "soft",    class: "bg-red-50     text-red-700" },
      { intent: "brand",   variant: "soft",    class: "bg-orange-50  text-orange-700" },
      { intent: "purple",  variant: "soft",    class: "bg-purple-50  text-purple-700" },
      // solid
      { intent: "neutral", variant: "solid",   class: "bg-slate-800  text-white" },
      { intent: "info",    variant: "solid",   class: "bg-blue-600   text-white" },
      { intent: "success", variant: "solid",   class: "bg-green-600  text-white" },
      { intent: "warning", variant: "solid",   class: "bg-yellow-400 text-yellow-900" },
      { intent: "danger",  variant: "solid",   class: "bg-red-500    text-white" },
      { intent: "brand",   variant: "solid",   class: "bg-orange-500 text-white" },
      { intent: "purple",  variant: "solid",   class: "bg-purple-600 text-white" },
      // outline
      { intent: "neutral", variant: "outline", class: "border-slate-300  text-slate-700" },
      { intent: "info",    variant: "outline", class: "border-blue-300   text-blue-700" },
      { intent: "success", variant: "outline", class: "border-green-300  text-green-700" },
      { intent: "warning", variant: "outline", class: "border-yellow-300 text-yellow-800" },
      { intent: "danger",  variant: "outline", class: "border-red-300    text-red-700" },
      { intent: "brand",   variant: "outline", class: "border-orange-300 text-orange-700" },
      { intent: "purple",  variant: "outline", class: "border-purple-300 text-purple-700" },
    ],
    defaultVariants: {
      intent: "neutral",
      variant: "soft",
      size: "md",
    },
  }
);

const dotClasses: Record<string, string> = {
  neutral: "bg-slate-500",
  info:    "bg-blue-500",
  success: "bg-green-500",
  warning: "bg-yellow-500",
  danger:  "bg-red-500",
  brand:   "bg-orange-500",
  purple:  "bg-purple-500",
};

export interface LaBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

function LaBadge({ intent, variant, size, dot, className, children, ...props }: LaBadgeProps) {
  return (
    <span className={cn(badgeVariants({ intent, variant, size }), className)} {...props}>
      {dot && (
        <span
          className={cn(
            "inline-block rounded-full",
            size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2",
            dotClasses[intent ?? "neutral"]
          )}
        />
      )}
      {children}
    </span>
  );
}

export { LaBadge, badgeVariants };
