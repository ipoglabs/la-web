"use client";

import * as React from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { COUNTRIES, Country } from "./countries";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
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

  const isThumbnail = list.length >= 2 && list.length <= 6;

  const thumbnailContent = (
    <div className="grid grid-cols-2 gap-2 p-4">
      {list.map((c) => {
        const isSelected = selected?.code === c.code;
        return (
          <button
            key={c.code}
            onClick={() => { onSelect(c); onClose(); }}
            className={cn(
              "flex flex-col items-center gap-1 px-3 py-3 rounded-xl border-2 transition-colors w-full",
              isSelected
                ? "border-blue-500 bg-blue-50"
                : "border-transparent bg-slate-100 hover:bg-slate-200"
            )}
          >
            <c.Flag className="h-8 w-12 rounded-sm flex-none" />
            <span className="text-xs font-medium text-slate-800 truncate w-full text-center mt-0.5 leading-none">
              {c.name} <span className="font-normal text-slate-400">(+{c.dial})</span>
            </span>
          </button>
        );
      })}
    </div>
  );

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
        <DialogContent className={cn("w-full p-0", isThumbnail ? "max-w-sm" : "max-w-sm")}>
          <DialogHeader className="p-4 pb-0">
            <DialogTitle>Select Country</DialogTitle>
          </DialogHeader>
          {isThumbnail ? thumbnailContent : content}
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
        {isThumbnail ? thumbnailContent : content}
        <DrawerFooter />
      </DrawerContent>
    </Drawer>
  );
}

export default CountryPicker;
