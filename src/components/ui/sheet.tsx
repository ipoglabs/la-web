"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

// Right-slide sheet built on Radix Dialog.
// Open/close animations use CSS keyframes defined in globals.css: sheetIn / sheetOut.
// Radix waits for animationend before unmounting — no forceMount needed.

const Sheet = DialogPrimitive.Root;
const SheetTrigger = DialogPrimitive.Trigger;
const SheetClose = DialogPrimitive.Close;
const SheetPortal = DialogPrimitive.Portal;

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "sheet-overlay fixed inset-0 z-50 bg-black/30 backdrop-blur-[2px]",
      className
    )}
    {...props}
  />
));
SheetOverlay.displayName = "SheetOverlay";

type SheetContentProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
  side?: "left" | "right";
};

const SheetContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  SheetContentProps
>(({ className, children, side = "right", ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "sheet-content fixed top-0 z-50 h-full w-[90vw] max-w-sm",
        side === "right" ? "right-0" : "left-0",
        side === "left" ? "left" : undefined,
        "bg-white shadow-2xl flex flex-col",
        "outline-none",
        className
      )}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </SheetPortal>
));
SheetContent.displayName = "SheetContent";

const SheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0",
      className
    )}
    {...props}
  />
);
SheetHeader.displayName = "SheetHeader";

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold text-slate-800 leading-tight", className)}
    {...props}
  />
));
SheetTitle.displayName = "SheetTitle";

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm font-medium text-slate-500 mt-0.5", className)}
    {...props}
  />
));
SheetDescription.displayName = "SheetDescription";

// Convenience close button — pre-styled, drop inside SheetHeader
function SheetCloseButton({ className }: { className?: string }) {
  return (
    <SheetClose
      className={cn(
        "p-1.5 rounded-full bg-slate-200 text-slate-700",
        "hover:bg-slate-300 hover:text-slate-900 transition-colors",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400",
        className
      )}
      aria-label="Close"
    >
      <X className="size-4" />
    </SheetClose>
  );
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetCloseButton,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
};
