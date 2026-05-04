"use client";

import { ReactNode } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

type ResponsiveModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
};

export default function ResponsiveModal({
  open,
  onOpenChange,
  title,
  children,
}: ResponsiveModalProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleClose = () => onOpenChange(false);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={() => {}}>
        <DialogContent
          className="sm:max-w-lg max-h-[85vh] flex flex-col"
          onInteractOutside={(e) => e.preventDefault()}   // ❌ disable outside click
          onEscapeKeyDown={(e) => e.preventDefault()}     // ❌ disable ESC
        >
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle>{title}</DialogTitle>

            {/* ❌ Only close via X */}
            <button
              type="button"
              onClick={handleClose}
              className="rounded-md p-1 hover:bg-slate-100"
            >
              <X className="size-4" />
            </button>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto pr-1">
            {children}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={() => {}}>
      <DrawerContent
        className="h-[85dvh] flex flex-col"
        onPointerDownOutside={(e) => e.preventDefault()} // ❌ disable outside click
      >
        <DrawerHeader className="flex flex-row items-center justify-between px-4">
          <DrawerTitle>{title}</DrawerTitle>

          {/* ❌ Only close via X */}
          <button
            type="button"
            onClick={handleClose}
            className="rounded-md p-1 hover:bg-slate-100"
          >
            <X className="size-4" />
          </button>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto px-4 pb-6">
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  );
}