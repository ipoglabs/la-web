"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetCloseButton,
} from "@/components/ui/sheet";
import { SolidFilterHorizontal24by24 } from "@/components/icons/la-icons";
import { LaButton } from "@/components/la";
import FilterContent from "./FilterContent";
import type { ListingFilterConfig } from "@/lib/listing-filters";

interface MobileFilterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: ListingFilterConfig[];
  draftValues: Record<string, string[]>;
  onDraftChange: (filterId: string, values: string[]) => void;
  /** Clears draft AND pushes empty to URL atomically (no stale-closure race) */
  onClearAndApply: () => void;
  onApply: () => void;
  activeCount: number;
  /** Human-readable subcategory name — shown in header when sub is set */
  subLabel?: string;
  /** Subcategory picker — forwarded to FilterContent when cat is set but sub is not */
  subcategories?: Array<{ key: string; label: string }>;
  currentSub?: string;
  onSubSelect?: (sub: string) => void;
}

export default function MobileFilterSheet({
  open,
  onOpenChange,
  filters,
  draftValues,
  onDraftChange,
  onClearAndApply,
  onApply,
  activeCount,
  subLabel,
  subcategories,
  currentSub,
  onSubSelect,
}: MobileFilterSheetProps) {
  // In picker mode the footer (Apply/Clear) is irrelevant — hide it
  const isSubPickerMode = filters.length === 0 && (subcategories?.length ?? 0) > 0;

  function handleApply() {
    onApply();
    onOpenChange(false);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left">
        {/* Header */}
        <SheetHeader>
          <div className="flex items-center gap-2">
            <SolidFilterHorizontal24by24 className="size-5 text-slate-700" />
            <SheetTitle>
              Filters
              {subLabel && (
                <span className="text-slate-600 font-normal"> / {subLabel}</span>
              )}
            </SheetTitle>
          </div>
          <SheetCloseButton />
        </SheetHeader>

        {/* Scrollable filter sections — draft values shown here */}
        <div className="flex-1 min-h-0 overflow-y-auto px-5 pb-4">
          <FilterContent
            filters={filters}
            values={draftValues}
            onChange={onDraftChange}
            subcategories={subcategories}
            currentSub={currentSub}
            onSubSelect={onSubSelect}
          />
        </div>

        {/* Footer — Clear All + Apply (hidden while subcategory picker is shown) */}
        {!isSubPickerMode && (
          <div className="shrink-0 px-5 py-4 border-t border-slate-200 flex gap-2">
            {/* G4: Clear all draft selections, then immediately apply (push empty to URL) */}
            {activeCount > 0 && (
              <LaButton
                intent="secondary"
                size="default"
                className="shrink-0"
                onClick={() => {
                  onClearAndApply();
                  onOpenChange(false);
                }}
              >
                Clear all
              </LaButton>
            )}
            <LaButton
              intent="primary"
              size="default"
              className="flex-1"
              onClick={handleApply}
            >
              {activeCount > 0 ? `Apply (${activeCount})` : "Apply Filters"}
            </LaButton>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
