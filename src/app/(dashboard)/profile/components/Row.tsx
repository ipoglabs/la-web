"use client";

import { Button } from "@/components/ui/button";

type RowProps = {
  label: string;
  value?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export default function Row({
  label,
  value,
  actionLabel,
  onAction,
}: RowProps) {
  return (
    <div className="grid grid-cols-[42%_3%_1fr_auto] items-center gap-2">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm text-gray-400 text-center">:</span>
      <span className="text-sm font-medium text-gray-900 break-words">
        {value?.trim() ? value : "—"}
      </span>

      {actionLabel && onAction ? (
        <Button variant="ghost" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : (
        <span />
      )}
    </div>
  );
}