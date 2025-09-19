// src/app/components/form/fields/FormField.tsx
"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { usePostFormStore } from "@/app/post/store/postFormStore";

type Props = {
  label: string;
  field: string; // key in the store (flat or dot path if your setField supports it)
  type?: "text" | "number" | "email" | "tel" | "date" | "textarea";
  placeholder?: string;
  required?: boolean;
  className?: string;

  /** Optional controlled mode props */
  value?: string | number | undefined;
  onChange?: (value: string | number | undefined) => void;
};

export default function FormField({
  label,
  field,
  type = "text",
  placeholder,
  required,
  className,
  value,
  onChange,
}: Props) {
  const storeValue = usePostFormStore((s) => (s as any)[field]);
  const setField = usePostFormStore((s) => s.setField);

  const isControlled = typeof value !== "undefined" && typeof onChange === "function";
  const v = isControlled ? value : storeValue;

  const parseByType = (raw: string) => {
    if (type === "number") {
      if (raw === "" || raw === null) return undefined;
      const n = Number(raw);
      return Number.isNaN(n) ? undefined : n;
    }
    if (type === "date") {
      // keep as ISO-like string; server/preview already formats
      return raw || undefined;
    }
    // text/email/tel/textarea
    return raw;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const parsed = parseByType(e.target.value);
    if (isControlled) {
      onChange?.(parsed);
    } else {
      setField(field, parsed);
    }
  };

  const id = React.useId();
  const FieldCmp = type === "textarea" ? Textarea : Input;
  const inputType = type === "textarea" ? undefined : type;

  return (
    <div className={className ?? "space-y-2"}>
      <Label htmlFor={id}>
        {label} {required ? <span className="text-red-500">*</span> : null}
      </Label>

      <FieldCmp
        id={id}
        type={inputType}
        value={v ?? (type === "number" ? "" : "")}
        placeholder={placeholder}
        onChange={handleChange}
        required={required}
      />
    </div>
  );
}
