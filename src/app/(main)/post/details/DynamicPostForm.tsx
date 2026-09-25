"use client";

// One form for every subcategory — fields come from the DB schema
// (models/PostFormSchema.ts via /api/post-form-schema), values go into the
// same post form store keys the rest of the post flow reads,
// so upload → preview → submit → edit work unchanged.

import React from "react";
import { LaInput, LaTagInput, LaTextarea } from "@/components/la";
import { RichTextEditor } from "@/components/rich-text-editor/RichTextEditor";
import { GoodToKnowEditor, type GoodToKnowPoint } from "@/components/good-to-know/GoodToKnow";
import { ToggleButtonGroup, ToggleGroupButton } from "@/components/toggle-group/CompoundToggleGroup";
import { usePostFormStore } from "../store/postFormStore";
import { sanitizeAdTitle } from "@/posting/validation/sanitizeAdTitle";
import { GOOD_TO_KNOW, PLACE_TAG, type FormFieldDef, type GoodToKnowValue, type PostFormSchemaData } from "@/posting/form-schema/types";
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

  // Seller-written label/value points — the editor renders its own title pill.
  if (field.type === "goodToKnow") {
    return (
      <div data-field={field.key} className="flex flex-col gap-2">
        <GoodToKnowField value={value as GoodToKnowValue | undefined} onChange={set} />
        {footer}
      </div>
    );
  }

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

    // Same tag input as Create Alert's Keywords: chips, helper line and an
    // "n/max" counter — the hint renders inside it, so the footer below only
    // shows errors for this type.
    case "tags": {
      const place = field.format === "place";
      control = (
        <LaTagInput
          value={Array.isArray(value) ? (value as string[]) : []}
          onChange={(tags) => set(tags)}
          placeholder={field.placeholder}
          hint={field.hint ?? ""}
          maxTags={field.maxItems}
          itemNoun={place ? "locations" : "entries"}
          {...(place
            ? {
                pattern: PLACE_TAG.pattern,
                patternMessage: "Only letters, numbers, spaces and . ' & - allowed",
                maxLength: PLACE_TAG.maxLength,
              }
            : {})}
        />
      );
      break;
    }

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
      {field.type === "tags" && !error ? null : footer}
    </div>
  );
}

// ── Good To Know ─────────────────────────────────────────────────────────────
// GoodToKnowEditor keeps its own row state and only reads its initial props,
// so it's seeded once from the store (edit mode brings saved points back)
// and every change is written back as { title, points }.

function GoodToKnowField({
  value,
  onChange,
}: {
  value: GoodToKnowValue | undefined;
  onChange: (next: GoodToKnowValue) => void;
}) {
  const [initial] = React.useState(() => ({
    title: value?.title ?? GOOD_TO_KNOW.titles[0],
    points: value?.points?.length ? value.points : [{ label: "", value: "" }],
  }));
  const latest = React.useRef(initial);

  const emit = (patch: Partial<GoodToKnowValue>) => {
    latest.current = { ...latest.current, ...patch };
    onChange(latest.current);
  };

  return (
    <GoodToKnowEditor
      maxPoints={GOOD_TO_KNOW.maxPoints}
      titleOptions={[...GOOD_TO_KNOW.titles]}
      defaultTitle={initial.title}
      initialPoints={initial.points}
      onTitleChange={(title) => emit({ title })}
      onChange={(points: GoodToKnowPoint[]) => emit({ points: points.map(({ label, value: v }) => ({ label, value: v })) })}
    />
  );
}
