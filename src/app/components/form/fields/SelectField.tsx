// src/app/components/form/fields/SelectField.tsx
"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { usePostFormStore } from "@/app/post/store/postFormStore";

type Option = { value: string | number; label?: string };

type Props = {
  label: string;
  field: string;                 // key in the store (dot-path if your setField supports it)
  placeholder?: string;
  options: Option[];
  required?: boolean;            // UI only
  disabled?: boolean;
  className?: string;

  /** Optional controlled mode */
  value?: string | number | undefined;
  onChange?: (value: string | number | undefined) => void;
};

export default function SelectField({
  label,
  field,
  placeholder = "Select…",
  options,
  required,
  disabled,
  className,
  value,
  onChange,
}: Props) {
  const storeValue = usePostFormStore((s) => (s as any)[field]);
  const setField = usePostFormStore((s) => s.setField);

  const isControlled = typeof value !== "undefined" && typeof onChange === "function";
  const current = isControlled ? value : storeValue;

  // shadcn Select is string-based; keep source type by mapping via options
  const currentStr = current === null || current === undefined ? "" : String(current);

  const handleValueChange = (val: string) => {
    const matched = options.find((o) => String(o.value) === val);
    const parsed = matched ? matched.value : val; // fallback to raw string

    if (isControlled) onChange?.(parsed);
    else setField(field, parsed);
  };

  const id = React.useId();

  return (
    <div className={className ?? "space-y-2"}>
      <Label htmlFor={id}>
        {label} {required ? <span className="text-red-500">*</span> : null}
      </Label>

      <Select
        value={currentStr}
        onValueChange={handleValueChange}
        disabled={disabled}
      >
        <SelectTrigger id={id} aria-required={required}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={String(opt.value)} value={String(opt.value)}>
              {opt.label ?? String(opt.value)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
