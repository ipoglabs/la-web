"use client";

import * as React from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose as DClose } from "@/components/ui/dialog";
import { COUNTRIES, type Country } from "./countries";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onClose: () => void;
  selected?: Country;
  onSelect: (c: Country) => void;
  countries?: Country[];
};

export function CountryPicker({ open, onClose, selected, onSelect, countries }: Props) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const list = countries && countries.length ? countries : COUNTRIES;

  const grid = (
    <div className="grid grid-cols-2 gap-3 p-4">
      {list.map((c) => {
        const isSelected = selected?.code === c.code;
        return (
          <button
            key={c.code}
            type="button"
            onClick={() => { onSelect(c); onClose(); }}
            className={cn(
              "flex flex-col items-center gap-2 px-3 py-4 rounded-2xl border-2 transition-colors w-full",
              isSelected
                ? "border-blue-500 bg-blue-50"
                : "border-slate-200 bg-slate-50 hover:bg-slate-100"
            )}
          >
            <c.Flag className="h-10 w-14 rounded-md object-cover" />
            <span className="text-xs font-semibold text-slate-800 text-center leading-tight">
              {c.name}
            </span>
            <span className="text-xs text-slate-400">(+{c.dial})</span>
          </button>
        );
      })}
    </div>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
        <DialogContent className="w-full max-w-sm p-0 overflow-hidden">
          <DialogHeader className="px-5 pt-5 pb-0">
            <DialogTitle className="text-base font-semibold">Select Country</DialogTitle>
            <DClose asChild>
              <button
                type="button"
                aria-label="Close"
                className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M18 6L6 18M6 6l12 12" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </button>
            </DClose>
          </DialogHeader>
          {grid}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={(v) => !v && onClose()}>
      <DrawerContent>
        <DrawerHeader className="pb-0">
          <DrawerTitle>Select Country</DrawerTitle>
        </DrawerHeader>
        {grid}
        <DrawerFooter className="pt-0" />
      </DrawerContent>
    </Drawer>
  );
}

export default CountryPicker;
