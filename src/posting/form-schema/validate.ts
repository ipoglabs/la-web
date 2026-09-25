import type { FormFieldDef, PostFormSchemaData } from "./types";
import { goodToKnowError, normalizeGoodToKnow } from "./goodToKnow";

// Mirrors sanitizeAdTitle (posting/validation/sanitizeAdTitle.ts): the form
// strips anything else while typing, so the server rejects it outright.
const AD_TITLE_DISALLOWED = /[^a-zA-Z0-9 .,-]/;

/** Visible text of a value — HTML tags removed, each entity counted as one char. */
function plainText(value: string): string {
  return value
    .replace(/<[^>]*>/g, "")
    .replace(/&[a-z0-9#]+;/gi, "x")
    .replace(/[​‌‍﻿­]/g, "")
    .trim();
}

function isEmpty(value: unknown) {
  if (value === null || value === undefined) return true;
  // Rich text: "<p><br></p>" etc. counts as empty.
  if (typeof value === "string") return plainText(value.replace(/&nbsp;/g, " ")) === "";
  if (Array.isArray(value)) return value.length === 0;
  return false;
}

const fmt = (n: number) => n.toLocaleString("en");

function validateField(
  field: FormFieldDef,
  data: Record<string, unknown>,
  labelOf: (key: string) => string,
): string | null {
  if (field.type === "goodToKnow") {
    const gtk = normalizeGoodToKnow(data[field.key]);
    if (!gtk) return field.required ? `Please add at least one ${field.label} point.` : null;
    return goodToKnowError(gtk);
  }

  const value = data[field.key];

  if (isEmpty(value)) {
    if (!field.required) return null;
    return field.type === "select" || field.type === "multiselect"
      ? `Please select ${field.label.toLowerCase()}.`
      : `${field.label} is required.`;
  }

  if ((field.type === "text" || field.type === "textarea" || field.type === "richtext") && typeof value === "string") {
    if (field.maxLength !== undefined && plainText(value).length > field.maxLength) {
      return `${field.label} must be ${fmt(field.maxLength)} characters or fewer.`;
    }
    if (field.format === "adTitle" && AD_TITLE_DISALLOWED.test(value)) {
      return `${field.label} can only contain letters, numbers, spaces and . , -`;
    }
  }

  // Choice fields only accept values the schema offers — the chips can't
  // produce anything else, so a mismatch means a tampered/stale submission.
  if ((field.type === "select" || field.type === "multiselect") && field.options?.length) {
    const allowed = new Set(field.options.map((o) => o.value));
    const values = Array.isArray(value) ? value.map(String) : [String(value)];
    if (field.type === "select" && values.length > 1) return `${field.label} accepts only one choice.`;
    if (values.some((v) => !allowed.has(v))) return `${field.label} has an invalid choice.`;
  }

  if (field.type === "date" && Number.isNaN(Date.parse(String(value)))) {
    return `${field.label} must be a valid date.`;
  }

  if (field.type === "number" || field.type === "currency") {
    const n = Number(value);
    if (!Number.isFinite(n)) return `${field.label} must be a number.`;
    if (field.min !== undefined && n < field.min) {
      return field.min === 0 ? `${field.label} must be 0 or more.` : `${field.label} must be at least ${fmt(field.min)}.`;
    }
    if (field.max !== undefined && n > field.max) {
      return `${field.label} must be ${fmt(field.max)} or less.`;
    }
    if (field.gteField) {
      const other = data[field.gteField];
      if (!isEmpty(other) && n < Number(other)) {
        return `${field.label} must be at least ${labelOf(field.gteField)}.`;
      }
    }
    if (field.lteField) {
      const other = data[field.lteField];
      if (!isEmpty(other) && n > Number(other)) {
        return `${field.label} can't be more than ${labelOf(field.lteField)}.`;
      }
    }
  }

  return null;
}

/** Returns { fieldKey: message } for every invalid field, in schema order. */
export function validateAgainstSchema(
  schema: PostFormSchemaData,
  data: Record<string, unknown>,
): Record<string, string> {
  const labels = new Map(schema.sections.flatMap((s) => s.fields.map((f) => [f.key, f.label] as const)));
  const labelOf = (key: string) => labels.get(key) ?? key;

  const errors: Record<string, string> = {};
  for (const section of schema.sections) {
    for (const field of section.fields) {
      const msg = validateField(field, data, labelOf);
      if (msg) errors[field.key] = msg;
    }
  }
  return errors;
}
