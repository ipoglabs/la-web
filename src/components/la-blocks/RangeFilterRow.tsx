"use client";

import { LaSelectResponsive } from "@/components/la";
import { formatPrice, type RangeFilterConfig } from "@/lib/listing-filters";

// ── Range filter row — Min / Max dropdowns ────────────────────────────────────

interface RangeFilterRowProps {
  filter: RangeFilterConfig;
  values: Record<string, string[]>;
  onChange: (filterId: string, values: string[]) => void;
}

export default function RangeFilterRow({ filter, values, onChange }: RangeFilterRowProps) {
  const minKey = `${filter.id}_min`;
  const maxKey = `${filter.id}_max`;
  const minVal = values[minKey]?.[0] ?? "";
  const maxVal = values[maxKey]?.[0] ?? "";
  const fmt = (n: number) => formatPrice(n, filter);

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
