// src/posting/config/types.ts
export type FieldSpec = {
  key: string;
  type: "string" | "number" | "currency" | "date" | "array" | "boolean";
  label: string;
  required?: boolean;
  unit?: string;
};

// Maps a category name (e.g. "property", "job") to its subcategory field
// definitions (e.g. "to buy" -> FieldSpec[], "to rent" -> FieldSpec[]).
export type CategoryConfig = Record<string, Record<string, FieldSpec[]>>;
