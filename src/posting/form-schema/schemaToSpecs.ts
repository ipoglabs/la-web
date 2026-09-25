// Turns a DB-driven form schema into the FieldSpec list the post preview
// renders, plus a value → label map for choice fields (so "like-new" shows
// as "Like New").

import type { FieldSpec } from "@/posting/config/types";
import type { FormFieldDef, PostFormSchemaData } from "./types";

const SPEC_TYPE: Record<FormFieldDef["type"], FieldSpec["type"]> = {
  text: "string",
  richtext: "string",
  textarea: "string",
  number: "number",
  currency: "currency",
  date: "date",
  select: "string",
  multiselect: "array",
  tags: "array",
  goodToKnow: "array", // never used — goodToKnow fields are skipped below
};

export function schemaToSpecs(schema: PostFormSchemaData): {
  specs: FieldSpec[];
  optionLabels: Record<string, Record<string, string>>;
} {
  const specs: FieldSpec[] = [];
  const optionLabels: Record<string, Record<string, string>> = {};

  for (const field of schema.sections.flatMap((s) => s.fields)) {
    // Title and details are shown separately by the preview; Good To Know
    // points are listed by it as their own label/value rows.
    if (field.key === "name" || field.key === "description" || field.type === "goodToKnow") continue;
    specs.push({ key: field.key, type: SPEC_TYPE[field.type], label: field.label, unit: field.unit });
    if (field.options?.length) {
      optionLabels[field.key] = Object.fromEntries(field.options.map((o) => [o.value, o.label]));
    }
  }

  return { specs, optionLabels };
}
