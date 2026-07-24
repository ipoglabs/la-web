"use client";

import { ToggleButtonGroup, ToggleGroupButton } from "@/components/toggle-group/CompoundToggleGroup";
import { LaSelectResponsive } from "@/components/la";
import {
  SolidFilterHorizontal24by24,
  Outline_UnCheckCircle_24by24,
  Outline_CheckCircle_24by24,
} from "@/components/icons/la-icons";
import { cn } from "@/lib/utils";
import { isRangeFilter, type ListingFilterConfig, type RangeFilterConfig } from "@/lib/listing-filters";

// ── Range filter row — Min / Max dropdowns ────────────────────────────────────

interface RangeFilterRowProps {
  filter: RangeFilterConfig;
  values: Record<string, string[]>;
  onChange: (filterId: string, values: string[]) => void;
}

function RangeFilterRow({ filter, values, onChange }: RangeFilterRowProps) {
  const minKey = `${filter.id}_min`;
  const maxKey = `${filter.id}_max`;
  const minVal = values[minKey]?.[0] ?? "";
  const maxVal = values[maxKey]?.[0] ?? "";
  const fmt = (n: number) => `${filter.prefix ?? ""}${n.toLocaleString()}`;

  // Min: "No Min" first, then exclude steps >= current max
  const minOptions = [
    { value: "", label: "No Min" },
    ...(filter.steps as readonly number[])
      .filter((s) => !maxVal || s < Number(maxVal))
      .map((s) => ({ value: String(s), label: fmt(s) })),
  ];

  // Max: "No Max" first, then exclude steps <= current min
  const maxOptions = [
    { value: "", label: "No Max" },
    ...(filter.steps as readonly number[])
      .filter((s) => !minVal || s > Number(minVal))
      .map((s) => ({ value: String(s), label: fmt(s) })),
  ];

  return (
    <div className="space-y-2">
      <div>
        <LaSelectResponsive
          value={minVal}
          onValueChange={(v) => {
            onChange(minKey, v ? [v] : []);
            if (v && maxVal && Number(v) >= Number(maxVal)) onChange(maxKey, []);
          }}
          placeholder="No Min"
          label={`Min ${filter.label}`}
          options={minOptions}
        />
      </div>
      <div>
        <LaSelectResponsive
          value={maxVal}
          onValueChange={(v) => {
            onChange(maxKey, v ? [v] : []);
            if (v && minVal && Number(v) <= Number(minVal)) onChange(minKey, []);
          }}
          placeholder="No Max"
          label={`Max ${filter.label}`}
          options={maxOptions}
        />
      </div>
    </div>
  );
}

export interface FilterContentProps {
  filters: ListingFilterConfig[];
  values: Record<string, string[]>;
  onChange: (filterId: string, values: string[]) => void;
  /** Subcategories to offer as a picker when cat is set but no sub is selected yet */
  subcategories?: Array<{ key: string; label: string }>;
  currentSub?: string;
  onSubSelect?: (sub: string) => void;
}

export default function FilterContent({
  filters,
  values,
  onChange,
  subcategories,
  currentSub,
  onSubSelect,
}: FilterContentProps) {
  // ── Mode 1: Subcategory picker — cat selected, no sub chosen yet ──────────
  if (filters.length === 0 && subcategories && subcategories.length > 0) {
    return (
      <div className="pt-1">
        <p className="text-sm font-semibold text-slate-500 mb-3 px-1">Select a subcategory</p>
        <div className="space-y-0.5">
          {subcategories.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => onSubSelect?.(key)}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left",
                key === currentSub
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-700 hover:bg-slate-50"
              )}
            >
              {label}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="size-4 text-slate-500 flex-none ml-2 shrink-0"
              >
                <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
              </svg>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ── Mode 2: True empty state — sub is set but has no filters defined ──────
  if (filters.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center gap-2">
        <SolidFilterHorizontal24by24 className="size-8 text-slate-300" />
        <p className="text-sm font-medium text-slate-500">No filters available</p>
        <p className="text-sm text-slate-500">No filters defined for this subcategory</p>
      </div>
    );
  }

  return (
    <div className="space-y-5 pt-1">
      {filters.map((filter, idx) => (
        <div
          key={filter.id}
          className={idx < filters.length - 1 ? "pb-5 border-b border-slate-100" : ""}
        >
          <p className="text-sm font-medium text-slate-700 mb-2">{filter.label}</p>

          {isRangeFilter(filter) ? (
            <RangeFilterRow filter={filter} values={values} onChange={onChange} />
          ) : (
            // ── Options filter — toggle buttons ──────────────────────────────
            <ToggleButtonGroup
              singleSelect={filter.singleSelect}
              value={values[filter.id] ?? []}
              onChange={(selected) => onChange(filter.id, selected)}
              className="gap-0"
            >
              <div className="flex flex-wrap gap-2">
                {filter.options.map((opt) => (
                  <ToggleGroupButton
                    key={opt.value}
                    value={opt.value}
                    icon={Outline_UnCheckCircle_24by24}
                    iconSelected={Outline_CheckCircle_24by24}
                    size="default"
                  >
                    {opt.label}
                  </ToggleGroupButton>
                ))}
              </div>
            </ToggleButtonGroup>
          )}
        </div>
      ))}
    </div>
  );
}
