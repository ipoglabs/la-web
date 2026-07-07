"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetCloseButton,
} from "@/components/ui/sheet";
import Timeline from "@/components/timeline/Timeline";
import { TIMELINE_EVENTS } from "@/lib/data/timeline-events";

export function TimelineSheet({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <span onClick={() => setOpen(true)} className="cursor-pointer">
        {children}
      </span>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent>
          <SheetHeader>
            <div>
              <SheetTitle>Product Timeline</SheetTitle>
              <SheetDescription>5 years · releases, features &amp; milestones</SheetDescription>
            </div>
            <SheetCloseButton />
          </SheetHeader>

          <div className="flex-1 overflow-y-auto overscroll-contain">
            <Timeline events={TIMELINE_EVENTS} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
