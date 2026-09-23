// src/app/components/form/fields/FormField.tsx
"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/rich-text-editor/RichTextEditor";
import { DateInput } from "@/components/date-input";
import { LaSeparator } from "@/components/la/la-separator";
import { usePostFormStore } from "@/app/(main)/post/store/postFormStore";
import { sanitizeAdTitle } from "@/posting/validation/sanitizeAdTitle";

// ✅ Add "time" to supported types
type FieldType = "text" | "number" | "email" | "tel" | "date" | "time" | "textarea"| "password"| "url"| "search"| "color";

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

  /** textarea rows (only used when type === "textarea") */
  rows?: number;
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
    rows,
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
    // ✅ keep date/time as strings
    if (type === "date" || type === "time") return raw || undefined;
    // Ad title: letters, digits, spaces, and . , - only
    if (field === "name") return sanitizeAdTitle(raw);
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
  const isTextarea = type === "textarea";
  // The "description" field always uses the design-system rich text editor
  // (heading level limited to H2, no live preview) instead of a plain textarea.
  const isDescription = isTextarea && field === "description";
  // Dates always use the design-system masked DateInput instead of the
  // browser's native <input type="date"> (see /design-system/core/date-input).
  const isDate = type === "date";
  const FieldCmp = isTextarea ? Textarea : Input;
  const inputType = isTextarea ? undefined : type;

  const uiValue =
    v === undefined || v === null
      ? ""
      : type === "number"
      ? String(v)
      : (v as string | number);

  const handleDescriptionChange = (html: string) => {
    if (isControlled) onChange?.(html);
    else setField(field, html);
  };

  const handleDateChange = (iso: string | null) => {
    if (isControlled) onChange?.(iso ?? undefined);
    else setField(field, iso ?? undefined);
  };

  return (
    <>
      <div className={className ?? "space-y-2"}>
        <Label htmlFor={id}>
          {label} {required ? <span className="text-red-500">*</span> : null}
        </Label>

        {isDescription ? (
          <RichTextEditor
            value={uiValue as string}
            onChange={handleDescriptionChange}
            placeholder={placeholder}
          />
        ) : isDate ? (
          <DateInput
            id={id}
            value={uiValue as string}
            onChange={handleDateChange}
            placeholder={placeholder}
            disabled={disabled}
          />
        ) : (
          <FieldCmp
            id={id}
            name={name ?? field}
            // shadcn Input accepts string; "time" is a valid HTML input type
            type={inputType as any}
            value={uiValue as any}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            onChange={handleChange}
            {...(isTextarea ? { rows } : {})}
            {...numberExtras}
          />
        )}

        {hint ? (
          <p className="text-xs text-muted-foreground leading-relaxed">{hint}</p>
        ) : null}
      </div>

      {/* Every form's "Adv Details" field ends the basic-info block —
          separate it from the category-specific fields that follow. */}
      {isDescription && <LaSeparator className="mt-2" />}
    </>
  );
}
