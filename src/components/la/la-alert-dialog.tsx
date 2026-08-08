/**
 * LaAlertDialog — la design system confirmation dialog
 * Wraps @radix-ui/react-alert-dialog directly (not components/ui/alert-dialog —
 * that pulls in shadcn's own Button variants, which the la/ layer never
 * delegates to). Action/Cancel render as LaButton so intent/size stay
 * consistent with every other confirm/cancel pair in the product.
 */
"use client";

import * as React from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { cn } from "@/lib/utils";
import { LaButton, type LaButtonProps } from "./la-button";

const LaAlertDialog = AlertDialogPrimitive.Root;
const LaAlertDialogTrigger = AlertDialogPrimitive.Trigger;
const LaAlertDialogPortal = AlertDialogPrimitive.Portal;

const LaAlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/30 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
));
LaAlertDialogOverlay.displayName = "LaAlertDialogOverlay";

const LaAlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content> & {
    size?: "default" | "sm";
  }
>(({ className, size = "default", ...props }, ref) => (
  <LaAlertDialogPortal>
    <LaAlertDialogOverlay />
    <AlertDialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed top-1/2 left-1/2 z-50 grid w-full -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl border-[1.5px] border-slate-300 bg-white p-5 shadow-lg outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        size === "sm" ? "max-w-xs" : "max-w-sm",
        className
      )}
      {...props}
    />
  </LaAlertDialogPortal>
));
LaAlertDialogContent.displayName = "LaAlertDialogContent";

function LaAlertDialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-1.5 text-left", className)} {...props} />;
}
LaAlertDialogHeader.displayName = "LaAlertDialogHeader";

/** Optional icon slot above the title — e.g. a destructive-action glyph. */
function LaAlertDialogMedia({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "mb-1 inline-flex size-10 items-center justify-center rounded-full bg-slate-100",
        className
      )}
      {...props}
    />
  );
}
LaAlertDialogMedia.displayName = "LaAlertDialogMedia";

function LaAlertDialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  );
}
LaAlertDialogFooter.displayName = "LaAlertDialogFooter";

const LaAlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold text-slate-900", className)}
    {...props}
  />
));
LaAlertDialogTitle.displayName = "LaAlertDialogTitle";

const LaAlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-slate-700", className)}
    {...props}
  />
));
LaAlertDialogDescription.displayName = "LaAlertDialogDescription";

const LaAlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action> &
    Pick<LaButtonProps, "intent" | "size">
>(({ className, intent = "primary", size = "default", ...props }, ref) => (
  <AlertDialogPrimitive.Action ref={ref} asChild>
    <LaButton intent={intent} size={size} className={className} {...props} />
  </AlertDialogPrimitive.Action>
));
LaAlertDialogAction.displayName = "LaAlertDialogAction";

const LaAlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel> &
    Pick<LaButtonProps, "intent" | "size">
>(({ className, intent = "outline", size = "default", ...props }, ref) => (
  <AlertDialogPrimitive.Cancel ref={ref} asChild>
    <LaButton intent={intent} size={size} className={className} {...props} />
  </AlertDialogPrimitive.Cancel>
));
LaAlertDialogCancel.displayName = "LaAlertDialogCancel";

export {
  LaAlertDialog,
  LaAlertDialogTrigger,
  LaAlertDialogPortal,
  LaAlertDialogOverlay,
  LaAlertDialogContent,
  LaAlertDialogHeader,
  LaAlertDialogFooter,
  LaAlertDialogMedia,
  LaAlertDialogTitle,
  LaAlertDialogDescription,
  LaAlertDialogAction,
  LaAlertDialogCancel,
};
