"use client";

import { LaButton } from "@/components/la";
import { cn } from "@/lib/utils";
import type { FeedbackReasonOption } from "./types";

interface ReasonChipsProps {
  options: FeedbackReasonOption[];
  selected: string[];
  max: number;
  onToggle: (value: string) => void;
}

export default function ReasonChips({ options, selected, max, onToggle }: ReasonChipsProps) {
  const isMaxReached = selected.length >= max;

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const active = selected.includes(option.value);
        const disabled = !active && isMaxReached;

        return (
          <LaButton
            key={option.value}
            type="button"
            intent={active ? "primary-blue" : "outline"}
            size="compact"
            disabled={disabled}
            className={cn("rounded-full", disabled && "opacity-40")}
            onClick={() => onToggle(option.value)}
          >
            {option.label}
          </LaButton>
        );
      })}
    </div>
  );
}
