/**
 * Tabs — shadcn/ui-style wrapper around @radix-ui/react-tabs
 *
 * Usage:
 *   <Tabs defaultValue="all">
 *     <TabsList>
 *       <TabsTrigger value="all">All</TabsTrigger>
 *       <TabsTrigger value="buying">Buying</TabsTrigger>
 *     </TabsList>
 *     <TabsContent value="all">…</TabsContent>
 *   </Tabs>
 */
"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

// Root — just re-exports Radix root (handles value/defaultValue/onValueChange)
const Tabs = TabsPrimitive.Root;

// The pill-row container — no background, just horizontal flex with gap
const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "flex items-center gap-2 overflow-x-auto scrollbar-none",
      className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

// Individual pill chip — YouTube style
// Selected: black pill + white bold text
// Unselected: gray pill + dark text
const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      // Base — pill shape
      "inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors shrink-0",
      // Idle — light gray chip
      "bg-slate-100 text-slate-800 hover:bg-slate-200",
      // Active — solid black chip
      "data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:hover:bg-slate-800",
      // Focus ring
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-1",
      // Disabled
      "disabled:pointer-events-none disabled:opacity-40",
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

// Panel that shows/hides based on active tab
const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn("focus-visible:outline-none", className)}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
