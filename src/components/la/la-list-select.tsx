/**
 * LaListSelect — la design system selectable list
 * A standalone "pick one" list — selected item highlighted in blue with a check.
 * Use wherever you need a scrollable option list: drawers, sheets, sidebars, settings pages.
 *
 * ─────────────────────────────────────────────────────────────
 * IMPORT
 * ─────────────────────────────────────────────────────────────
 *   import { LaListSelect } from "@/components/la";
 *
 * ─────────────────────────────────────────────────────────────
 * FLAT OPTIONS
 * ─────────────────────────────────────────────────────────────
 *   <LaListSelect
 *     value={val}
 *     onValueChange={setVal}
 *     options={[
 *       { value: "apple",  label: "Apple"  },
 *       { value: "banana", label: "Banana" },
 *     ]}
 *   />
 *
 * ─────────────────────────────────────────────────────────────
 * GROUPED OPTIONS
 * ─────────────────────────────────────────────────────────────
 *   <LaListSelect
 *     value={val}
 *     onValueChange={setVal}
 *     groups={[
 *       {
 *         label: "Asia",
 *         options: [{ value: "sg", label: "Singapore" }],
 *       },
 *     ]}
 *   />
 *
 * ─────────────────────────────────────────────────────────────
 * PROPS REFERENCE
 * ─────────────────────────────────────────────────────────────
 *   value          string                      Controlled selected value.
 *   onValueChange  (value: string) => void     Called when user picks an option.
 *   options?       LaListSelectOption[]         Flat list. Use either options or groups.
 *   groups?        LaListSelectOptionGroup[]    Grouped list with section headers.
 *   className?     string                       Applied to the root <ul>.
 */
import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── shared option types ─────────────────────────────────── */
export interface LaListSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface LaListSelectOptionGroup {
  label: string;
  options: LaListSelectOption[];
}

/* ─── props ──────────────────────────────────────────────── */
export interface LaListSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  /** Flat list. Use either `options` or `groups`, not both. */
  options?: LaListSelectOption[];
  /** Grouped list with section headers. Use either `options` or `groups`, not both. */
  groups?: LaListSelectOptionGroup[];
  className?: string;
}

/* ─── component ──────────────────────────────────────────── */
export function LaListSelect({
  value,
  onValueChange,
  options,
  groups,
  className,
}: LaListSelectProps) {
  return (
    <ul className={cn("flex flex-col", className)}>
      {options &&
        options.map((o) => (
          <ListSelectItem
            key={o.value}
            option={o}
            selected={value === o.value}
            onSelect={onValueChange}
          />
        ))}

      {groups &&
        groups.map((g) => (
          <React.Fragment key={g.label}>
            {/* Group header */}
            <li
              className="px-3 pt-3 pb-0.5 text-xs font-semibold uppercase tracking-wider text-slate-400"
            >
              {g.label}
            </li>
            {g.options.map((o) => (
              <ListSelectItem
                key={o.value}
                option={o}
                selected={value === o.value}
                onSelect={onValueChange}
              />
            ))}
          </React.Fragment>
        ))}
    </ul>
  );
}

LaListSelect.displayName = "LaListSelect";

/* ─── single row ─────────────────────────────────────────── */
function ListSelectItem({
  option,
  selected,
  onSelect,
}: {
  option: LaListSelectOption;
  selected: boolean;
  onSelect: (value: string) => void;
}) {
  return (
    <li>
      <button
        type="button"
        disabled={option.disabled}
        onClick={() => onSelect(option.value)}
        className={cn(
          "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/25",
          selected
            ? "bg-blue-100 font-semibold text-blue-800"
            : "text-gray-900 hover:bg-blue-50/60",
          option.disabled && "cursor-not-allowed opacity-40",
        )}
      >
        {option.label}
        {selected && (
          <Check aria-hidden="true" className="size-4 shrink-0 text-blue-600" />
        )}
      </button>
    </li>
  );
}
