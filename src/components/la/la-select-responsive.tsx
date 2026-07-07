/**
 * LaSelectResponsive — la design system responsive select
 * - Mobile (< md): taps the trigger → opens a Vaul Drawer with a scrollable option list.
 * - Tablet & above (≥ md): renders a plain LaSelect (native <select>).
 *
 * ─────────────────────────────────────────────────────────────
 * IMPORT
 * ─────────────────────────────────────────────────────────────
 *   import { LaSelectResponsive } from "@/components/la";
 *
 * ─────────────────────────────────────────────────────────────
 * BASIC (controlled)
 * ─────────────────────────────────────────────────────────────
 *   const [val, setVal] = useState("");
 *
 *   <LaSelectResponsive
 *     value={val}
 *     onValueChange={setVal}
 *     placeholder="Pick a fruit"
 *     options={[
 *       { value: "apple",  label: "Apple"  },
 *       { value: "banana", label: "Banana" },
 *     ]}
 *   />
 *
 * ─────────────────────────────────────────────────────────────
 * OPTION GROUPS
 * ─────────────────────────────────────────────────────────────
 *   <LaSelectResponsive
 *     value={val}
 *     onValueChange={setVal}
 *     placeholder="Pick a country"
 *     groups={[
 *       {
 *         label: "Asia",
 *         options: [{ value: "sg", label: "Singapore" }],
 *       },
 *     ]}
 *   />
 *
 * ─────────────────────────────────────────────────────────────
 * STATUS
 * ─────────────────────────────────────────────────────────────
 *   <LaSelectResponsive ... status="error" />
 *
 * ─────────────────────────────────────────────────────────────
 * PROPS REFERENCE
 * ─────────────────────────────────────────────────────────────
 *   value          string                    Controlled selected value.
 *   onValueChange  (value: string) => void   Called when user picks an option.
 *   options?       LaSelectOption[]          Flat list of options.
 *   groups?        LaSelectOptionGroup[]     Grouped options (renders <optgroup> / group header).
 *   placeholder?   string                    Label shown when nothing is selected.
 *   label?         string                    Drawer title on mobile.
 *   status?        "default"|"error"|"success"
 *   disabled?      boolean
 *   className?     string                    Passed to the trigger / select wrapper.
 */
"use client";

import * as React from "react";
import { ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { LaSelect } from "./la-select";
import { LaListSelect } from "./la-list-select";
import type { LaListSelectOption, LaListSelectOptionGroup } from "./la-list-select";
import {
  Drawer,
  DrawerContent,
} from "@/components/ui/drawer";
import type { LaSelectStatus } from "./la-select";

/* ─── re-export option types from la-list-select ─────────── */
export type { LaListSelectOption as LaSelectOption, LaListSelectOptionGroup as LaSelectOptionGroup } from "./la-list-select";

export interface LaSelectResponsiveProps {
  value: string;
  onValueChange: (value: string) => void;
  /** Flat list — use either `options` or `groups`, not both. */
  options?: LaListSelectOption[];
  /** Grouped list — use either `options` or `groups`, not both. */
  groups?: LaListSelectOptionGroup[];
  placeholder?: string;
  /** Drawer title shown on mobile. Falls back to placeholder. */
  label?: string;
  status?: LaSelectStatus;
  disabled?: boolean;
  className?: string;
}

/* ─── helpers ────────────────────────────────────────────── */
function flatOptions(
  options?: LaListSelectOption[],
  groups?: LaListSelectOptionGroup[],
): LaListSelectOption[] {
  if (options) return options;
  if (groups) return groups.flatMap((g) => g.options);
  return [];
}

/* ─── trigger button — mirrors LaSelect closed state ─────── */
const triggerBase = [
  "flex h-10 w-full items-center justify-between",
  "rounded-md border-[1.5px] border-gray-700/55 bg-gray-50 pl-3 pr-3",
  "text-base font-normal",
  "focus-visible:bg-yellow-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/25 focus-visible:ring-offset-1",
  "disabled:cursor-not-allowed disabled:opacity-50",
].join(" ");

const triggerStatus: Record<LaSelectStatus, string> = {
  default: "",
  error:   "border-red-500 focus-visible:ring-red-500/25",
  success: "border-green-600 focus-visible:ring-green-600/25",
};

/* ─── component ──────────────────────────────────────────── */
export function LaSelectResponsive({
  value,
  onValueChange,
  options,
  groups,
  placeholder = "Select…",
  label,
  status = "default",
  disabled = false,
  className,
}: LaSelectResponsiveProps) {
  const [open, setOpen] = React.useState(false);

  const allOptions = flatOptions(options, groups);
  const selectedLabel = allOptions.find((o) => o.value === value)?.label;

  /* ── DESKTOP: native <select> ≥ md ───────────────────────── */
  const desktopSelect = (
    <div className={cn("hidden md:block", className)}>
      <LaSelect
        value={value}
        status={status}
        disabled={disabled}
        title={label ?? placeholder}
        aria-label={label ?? placeholder}
        onChange={(e) => onValueChange(e.target.value)}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options &&
          options.map((o) => (
            <option key={o.value} value={o.value} disabled={o.disabled}>
              {o.label}
            </option>
          ))}
        {groups &&
          groups.map((g) => (
            <optgroup key={g.label} label={g.label}>
              {g.options.map((o) => (
                <option key={o.value} value={o.value} disabled={o.disabled}>
                  {o.label}
                </option>
              ))}
            </optgroup>
          ))}
      </LaSelect>
    </div>
  );

  /* ── MOBILE: trigger + Drawer < md ───────────────────────── */
  const mobilePicker = (
    <div className={cn("block md:hidden", className)}>
      {/* Trigger */}
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-label={label ?? placeholder}
        onClick={() => setOpen(true)}
        className={cn(triggerBase, triggerStatus[status])}
      >
        <span className={cn(!selectedLabel && "text-gray-500")}>
          {selectedLabel ?? placeholder}
        </span>
        <ChevronDown aria-hidden="true" className="size-4 shrink-0 text-slate-500" />
      </button>

      {/* Drawer */}
      <Drawer open={open} onOpenChange={setOpen}>
        {/* pt-0 + hide built-in drag handle — we render our own inside the header */}
        <DrawerContent className="pt-0 [&>div:first-child]:hidden border-slate-200 max-h-[80svh]">
          {/* Header — slate dark + drag handle + left title + close */}
          <div className="rounded-t-2xl bg-linear-to-b from-slate-100 to-slate-50 px-4 pt-1.5 pb-1.5 border-b border-slate-200">
            {/* Drag handle */}
            <div className="mx-auto mb-1.5 h-0.5 w-6 rounded-full bg-slate-400" />
            {/* Title row */}
            <div className="flex items-center justify-between">
              <span className="text-base font-semibold text-slate-800 tracking-wide">
                {label ?? placeholder}
              </span>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center size-8 rounded-full bg-slate-200 hover:bg-slate-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
              >
                <X aria-hidden="true" className="size-4 text-slate-600" />
              </button>
            </div>
          </div>

          <LaListSelect
            value={value}
            onValueChange={(v) => {
              onValueChange(v);
              setOpen(false);
            }}
            options={options}
            groups={groups}
            className="min-h-0 flex-1 overflow-y-auto px-2 pb-5 pt-1"
          />
        </DrawerContent>
      </Drawer>
    </div>
  );

  return (
    <>
      {desktopSelect}
      {mobilePicker}
    </>
  );
}


