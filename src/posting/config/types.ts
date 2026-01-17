// src/posting/config/types.ts
export type FieldScalar = "string" | "number" | "date" | "boolean" | "currency";

export type FieldSpec =
  | { key: string; type: FieldScalar; label: string; unit?: string }
  | { key: string; type: "array"; label: string };

export type CategoryConfig = Record<string, Record<string, FieldSpec[]>>;
