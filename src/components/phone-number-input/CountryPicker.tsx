"use client";

import * as React from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose, DrawerFooter } from "@/components/ui/drawer";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose as DClose } from "@/components/ui/dialog";
import { COUNTRIES, Country } from "./countries";
import { useMediaQuery } from "@/hooks/use-media-query";

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

  const content = (
    <div className="max-h-[50vh] overflow-auto">
      <div className="divide-y divide-slate-200">
        {list.map((c) => {
          const isSelected = selected?.code === c.code;
          return (
            <button
              key={c.code}
              onClick={() => {
                onSelect(c);
                onClose();
              }}
              className={
                `w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-slate-200 ${
                  isSelected ? "bg-blue-50" : ""
                }`
              }
            >
              <span className="flex-none">
                <c.Flag className="rounded-sm" />
              </span>
              <span className="flex-1">
                <div className={`text-sm font-normal ${isSelected ? "text-blue-900" : ""}`}>{c.name} <span className="text-sm text-slate-500">(+{c.dial})</span></div>
              </span>
              <span className="flex-none">
                <span
                  className={
                    `inline-block h-2 w-2 rounded-full ${
                      isSelected ? "bg-blue-700" : "bg-transparent"
                    }`
                  }
                  aria-hidden
                />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
        <DialogContent className="w-full max-w-sm p-0">
          <DialogHeader>
            <DialogTitle>Select Country</DialogTitle>
          </DialogHeader>
          {content}
          <DClose className="sr-only" />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={(v) => !v && onClose()}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Select country</DrawerTitle>
        </DrawerHeader>
        {content}
        <DrawerFooter />
      </DrawerContent>
    </Drawer>
  );
}

export default CountryPicker;
