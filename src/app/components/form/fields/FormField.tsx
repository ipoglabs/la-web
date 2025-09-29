// src/app/components/form/fields/FormField.tsx
"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { usePostFormStore } from "@/app/post/store/postFormStore";

type FieldType = "text" | "number" | "email" | "tel" | "date" | "textarea";

type CommonProps = {
  label: string;
  field: string;               // store key
  name?: string;               // optional DOM name
  type?: FieldType;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  hint?: string;

  /** Controlled mode */
  value?: string | number | undefined;
  onChange?: (value: string | number | undefined) => void;
  onChangeRaw?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
};

type NumberishExtras =
  | { type?: Exclude<FieldType, "number"> }
  | {
      type: "number";
      min?: number;
      max?: number;
      step?: number | "any";
      inputMode?: "numeric" | "decimal";
    };

type Props = CommonProps & NumberishExtras;

export default function FormField(props: Props) {
  const {
    label,
    field,
    name,
    type = "text",
    placeholder,
    required,
    disabled,
    className,
    hint,
    value,
    onChange,
    onChangeRaw,
  } = props;

  // Narrow number-only extras safely
  const numberExtras =
    type === "number"
      ? {
          min: (props as Extract<Props, { type: "number" }>).min,
          max: (props as Extract<Props, { type: "number" }>).max,
          step: (props as Extract<Props, { type: "number" }>).step,
          inputMode: (props as Extract<Props, { type: "number" }>).inputMode,
        }
      : {};

  const storeValue = usePostFormStore((s) => (s as any)[field]);
  const setField = usePostFormStore((s) => s.setField);

  const isControlled =
    typeof value !== "undefined" && typeof onChange === "function";
  const v = isControlled ? value : storeValue;

  const parseByType = (raw: string) => {
    if (type === "number") {
      if (raw === "" || raw === null) return undefined;
      const n = Number(raw);
      return Number.isNaN(n) ? undefined : n;
    }
    if (type === "date") return raw || undefined;
    return raw;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    onChangeRaw?.(e);
    const parsed = parseByType(e.target.value);
    if (isControlled) onChange?.(parsed);
    else setField(field, parsed);
  };

  const id = React.useId();
  const FieldCmp = type === "textarea" ? Textarea : Input;
  const inputType = type === "textarea" ? undefined : type;

  const uiValue =
    v === undefined || v === null
      ? ""
      : type === "number"
      ? String(v)
      : (v as string | number);

  return (
    <div className={className ?? "space-y-2"}>
      <Label htmlFor={id}>
        {label} {required ? <span className="text-red-500">*</span> : null}
      </Label>

      <FieldCmp
        id={id}
        name={name ?? field}              
        type={inputType as any}
        value={uiValue as any}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        onChange={handleChange}
        {...numberExtras}
      />

      {hint ? (
        <p className="text-xs text-muted-foreground leading-relaxed">{hint}</p>
      ) : null}
    </div>
  );
}
