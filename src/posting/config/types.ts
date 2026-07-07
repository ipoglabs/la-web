// src/posting/config/types.ts
export type FieldSpec = {
  key: string;
  type: "string" | "number" | "currency" | "date" | "array";
  label: string;
  required?: boolean;
};
