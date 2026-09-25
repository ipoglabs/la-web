// Building blocks shared by every category's default post-form schema.
// Each defaults/<category>.ts builds its sections from these, and index.ts
// applies the same sanity limits to every field before serving/seeding.

import type { FormFieldDef, FormFieldOption, FormSection } from "../types";

export const COUNTRIES = ["IN", "GB", "SG"] as const;

/** Options whose stored value is also the label. */
export const opts = (values: string[]): FormFieldOption[] => values.map((v) => ({ value: v, label: v }));

/** Options from [value, label] pairs — keeps the slug values older posts already store. */
export const pairs = (entries: [string, string][]): FormFieldOption[] =>
  entries.map(([value, label]) => ({ value, label }));

export const YES_NO = pairs([
  ["yes", "Yes"],
  ["no", "No"],
]);

/** Title, details and the seller's own Good To Know points — first on every form. */
export const GOOD_TO_KNOW_FIELD: FormFieldDef = {
  key: "goodToKnow",
  type: "goodToKnow",
  label: "Good To Know",
  hint: "Add any extra detail buyers should know, e.g. Parking → Available.",
};

export const basics: FormSection = {
  fields: [
    { key: "name", type: "text", label: "Adv Title", required: true, format: "adTitle" },
    { key: "description", type: "richtext", label: "Adv Details", required: true },
    GOOD_TO_KNOW_FIELD,
  ],
};

// ── Limits ───────────────────────────────────────────────────────────────────
// Sanity caps that catch typos and junk, not business rules — price caps are
// deliberately generous and the same in every currency.
export const PRICE_MAX = 10_000_000_000;

const FIELD_LIMITS: Record<string, Partial<FormFieldDef>> = {
  name: { maxLength: 100 },
  description: { maxLength: 2000 }, // matches RichTextEditor's counter
  year: { min: 1900, max: 2100 },
  kms: { max: 5_000_000 },
  quantity: { max: 1_000_000 },
  seatsAvailable: { max: 100 },
  seatingCapacity: { max: 100 },
  engineCapacity: { max: 20_000 },
};

/** Applies the per-key limits plus a default cap per field type. */
export function applyLimits(field: FormFieldDef): FormFieldDef {
  const byType: Partial<FormFieldDef> =
    field.type === "currency"
      ? { min: 0, max: PRICE_MAX }
      : field.type === "text"
        ? { maxLength: 200 }
        : field.type === "textarea"
          ? { maxLength: 1000 }
          : {};
  return { ...byType, ...field, ...FIELD_LIMITS[field.key] };
}
