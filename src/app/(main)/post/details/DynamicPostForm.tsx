"use client";

// One form for every subcategory — fields come from the DB schema
// (models/PostFormSchema.ts via /api/post-form-schema), values go into the
// same post form store keys the hand-built forms in components/form/* use,
// so upload → preview → submit → edit work unchanged.

import React from "react";
import { LaInput, LaTagInput, LaTextarea } from "@/components/la";
import { RichTextEditor } from "@/components/rich-text-editor/RichTextEditor";
import { ToggleButtonGroup, ToggleGroupButton } from "@/components/toggle-group/CompoundToggleGroup";
import { usePostFormStore } from "../store/postFormStore";
import { sanitizeAdTitle } from "@/posting/validation/sanitizeAdTitle";
import type { FormFieldDef, PostFormSchemaData } from "@/posting/form-schema/types";
import { cn } from "@/lib/utils";

interface DynamicPostFormProps {
  schema: PostFormSchemaData;
  currencySymbol: string;
  errors: Record<string, string>;
  onFieldChange: (key: string) => void;
}

const WIDTH_CLASS: Record<NonNullable<FormFieldDef["width"]>, string> = {
  full: "col-span-6",
  half: "col-span-6 md:col-span-3",
  third: "col-span-6 md:col-span-2",
};

export default function DynamicPostForm({ schema, currencySymbol, errors, onFieldChange }: DynamicPostFormProps) {
  return (
    <form
      data-post-form="true"
      noValidate
      onSubmit={(e) => e.preventDefault()}
      className="flex w-full flex-col gap-6"
    >
      {schema.sections.map((section, i) => (
        <section
          key={section.title ?? i}
          aria-labelledby={section.title ? `section-${i}` : undefined}
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          {section.title && (
            <h2 id={`section-${i}`} className="mb-4 font-display text-lg font-semibold text-slate-900">
              {section.title}
            </h2>
          )}
          <div className="grid grid-cols-6 gap-x-4 gap-y-5">
            {section.fields.map((field) => (
              <div key={field.key} className={WIDTH_CLASS[field.width ?? "full"]}>
                <DynamicField
                  field={field}
                  currencySymbol={currencySymbol}
                  error={errors[field.key]}
                  onFieldChange={onFieldChange}
                />
              </div>
            ))}
          </div>
        </section>
      ))}
    </form>
  );
}

// ── Single field ─────────────────────────────────────────────────────────────

interface DynamicFieldProps {
  field: FormFieldDef;
  currencySymbol: string;
  error?: string;
  onFieldChange: (key: string) => void;
}

function DynamicField({ field, currencySymbol, error, onFieldChange }: DynamicFieldProps) {
  const value = usePostFormStore((s) => (s as unknown as Record<string, unknown>)[field.key]);
  const setField = usePostFormStore((s) => s.setField);

  const set = (v: unknown) => {
    (setField as (k: string, v: unknown) => void)(field.key, v);
    onFieldChange(field.key);
  };

  const errorId = `${field.key}-error`;
  const hintId = `${field.key}-hint`;
  const describedBy = error ? errorId : field.hint ? hintId : undefined;

  const footer = error ? (
    <p id={errorId} role="alert" className="text-sm font-medium text-rose-600">
      {error}
    </p>
  ) : field.hint ? (
    <p id={hintId} className="text-sm text-slate-500">
      {field.hint}
    </p>
  ) : null;

  // Choice fields: the toggle group renders its own (accessible) title.
  if (field.type === "select" || field.type === "multiselect") {
    const single = field.type === "select";
    const selected = single ? (value ? [String(value)] : []) : Array.isArray(value) ? (value as string[]) : [];
    return (
      <div data-field={field.key} className="flex flex-col gap-1">
        <ToggleButtonGroup
          title={field.label}
          isMandatory={field.required}
          singleSelect={single}
          value={selected}
          onChange={(v) => set(single ? (v[0] ?? "") : v)}
        >
          {(field.options ?? []).map((o) => (
            <ToggleGroupButton key={o.value} value={o.value}>
              {o.label}
            </ToggleGroupButton>
          ))}
        </ToggleButtonGroup>
        {footer}
      </div>
    );
  }

  const label = (
    <label
      htmlFor={field.type === "richtext" ? undefined : field.key}
      id={`${field.key}-label`}
      className="text-sm font-semibold text-slate-800"
    >
      {field.label}
      {field.required && <span className="ml-0.5 text-rose-600">*</span>}
    </label>
  );

  let control: React.ReactNode;

  switch (field.type) {
    case "richtext":
      control = (
        <div
          aria-labelledby={`${field.key}-label`}
          aria-describedby={describedBy}
          className={cn(error && "rounded-md ring-2 ring-rose-500")}
        >
          <RichTextEditor
            value={typeof value === "string" ? value : ""}
            placeholder={field.placeholder}
            maxLength={field.maxLength}
            onChange={(html) => set(html)}
          />
        </div>
      );
      break;

    case "textarea":
      control = (
        <LaTextarea
          id={field.key}
          name={field.key}
          rows={4}
          maxLength={field.maxLength}
          value={typeof value === "string" ? value : ""}
          onChange={(e) => set(e.target.value)}
          placeholder={field.placeholder}
          status={error ? "error" : "default"}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
        />
      );
      break;

    case "tags":
      control = (
        <LaTagInput
          value={Array.isArray(value) ? (value as string[]) : []}
          onChange={(tags) => set(tags)}
          placeholder={field.placeholder}
          hint=""
        />
      );
      break;

    case "number":
    case "currency":
      control = (
        <LaInput
          id={field.key}
          name={field.key}
          type="number"
          inputMode="decimal"
          min={field.min}
          max={field.max}
          value={value === undefined || value === null ? "" : String(value)}
          onChange={(e) => set(e.target.value)}
          placeholder={field.placeholder}
          status={error ? "error" : "default"}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          prefix={field.type === "currency" ? <span className="text-sm font-medium text-slate-700">{currencySymbol}</span> : undefined}
          suffix={field.unit ? <span className="text-sm text-slate-600">{field.unit}</span> : undefined}
        />
      );
      break;

    case "date":
    case "text":
    default:
      control = (
        <LaInput
          id={field.key}
          name={field.key}
          type={field.type === "date" ? "date" : "text"}
          maxLength={field.type === "text" ? field.maxLength : undefined}
          value={typeof value === "string" ? value : value == null ? "" : String(value)}
          onChange={(e) =>
            set(field.format === "adTitle" ? sanitizeAdTitle(e.target.value) : e.target.value)
          }
          placeholder={field.placeholder}
          status={error ? "error" : "default"}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
        />
      );
  }

  return (
    <div data-field={field.key} className="flex flex-col gap-1.5">
      {label}
      {control}
      {footer}
    </div>
  );
}
