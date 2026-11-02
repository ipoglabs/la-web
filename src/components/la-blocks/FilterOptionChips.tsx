"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { LaButton, LaInput } from "@/components/la";
import { ToggleButtonGroup, ToggleGroupButton } from "@/components/toggle-group/CompoundToggleGroup";
import {
  Outline_UnCheckCircle_24by24,
  Outline_CheckCircle_24by24,
} from "@/components/icons/la-icons";
import type { FilterConfig } from "@/components/create-alert/types";

// ── Options filter — toggle buttons ───────────────────────────────────────────
// Used by the listings filters and the create-alert journey. A long list (the
// Brand filters run to ~50) shows its first few buttons plus the picked ones,
// a "Show all" button and a search box that narrows the buttons as you type.

const SHORT_LIST = 12;

interface FilterOptionChipsProps {
  filter: FilterConfig;
  value: string[];
  onChange: (values: string[]) => void;
}

export default function FilterOptionChips({ filter, value, onChange }: FilterOptionChipsProps) {
  const [query, setQuery] = useState("");
  const [showAll, setShowAll] = useState(false);

  const long = filter.options.length > SHORT_LIST;
  const q = query.trim().toLowerCase();
  const visible = !long
    ? filter.options
    : filter.options.filter((opt, i) =>
        q ? opt.label.toLowerCase().includes(q) : showAll || i < SHORT_LIST || value.includes(opt.value),
      );

  return (
    <div className="flex flex-col gap-2">
      {long && (
        <LaInput
          prefix={<Search className="size-4" />}
          clearable
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search ${filter.label.toLowerCase()}`}
          aria-label={`Search ${filter.label.toLowerCase()}`}
        />
      )}

      <ToggleButtonGroup singleSelect={filter.singleSelect} value={value} onChange={onChange} className="gap-0">
        <div className="flex flex-wrap gap-2">
          {visible.map((opt) => (
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

      {long && q && visible.length === 0 && <p className="text-sm text-slate-500">No matches found</p>}

      {long && !q && (
        <LaButton intent="link" className="self-start px-0" onClick={() => setShowAll((s) => !s)}>
          {showAll ? "Show fewer" : `Show all ${filter.options.length}`}
        </LaButton>
      )}
    </div>
  );
}
