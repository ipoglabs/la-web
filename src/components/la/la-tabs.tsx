/**
 * LaTabs — la design system tabs
 * Extends: components/ui/tabs (Radix-backed)
 *
 * Adds style variants on the trigger:
 *   - "pill"      → solid filled chip (current default in ui/tabs)
 *   - "underline" → thin bottom border indicator
 *   - "card"      → segmented control look
 */
"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Root — pass-through
const LaTabs = TabsPrimitive.Root;

// List wrapper
const LaTabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn("flex items-center gap-1 overflow-x-auto scrollbar-none", className)}
    {...props}
  />
));
LaTabsList.displayName = "LaTabsList";

// Trigger variants
const triggerVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap shrink-0 font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-40",
  {
    variants: {
      variant: {
        pill: [
          "rounded-full px-4 py-2 text-sm",
          "bg-slate-100 text-slate-700 hover:bg-slate-200",
          "data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:hover:bg-slate-800",
        ],
        underline: [
          "rounded-none px-3 py-2 text-sm border-b-2 border-transparent",
          "text-slate-500 hover:text-slate-800",
          "data-[state=active]:border-slate-900 data-[state=active]:text-slate-900",
        ],
        card: [
          "rounded-md px-4 py-1.5 text-sm",
          "text-slate-500 hover:text-slate-700",
          "data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm",
        ],
      },
    },
    defaultVariants: {
      variant: "pill",
    },
  }
);

export interface LaTabsTriggerProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>,
    VariantProps<typeof triggerVariants> {}

const LaTabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  LaTabsTriggerProps
>(({ variant, className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(triggerVariants({ variant }), className)}
    {...props}
  />
));
LaTabsTrigger.displayName = "LaTabsTrigger";

// Content — pass-through
const LaTabsContent = TabsPrimitive.Content;

export { LaTabs, LaTabsList, LaTabsTrigger, LaTabsContent };
