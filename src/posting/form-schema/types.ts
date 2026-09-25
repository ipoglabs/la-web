// Shared shape of a DB-driven post form (models/PostFormSchema.ts stores it,
// app/api/post-form-schema serves it, post/details/DynamicPostForm renders it).
// Kept free of mongoose so client components can import it.
//
// Field `key`s are the post form store keys and the saved post's keys. A key
// that is a Post model path (models/post.ts) is saved there, so existing
// listing/filter code keeps reading it; any other key is saved under
// `post.attributes` (see form-schema/extractFields.ts).

export type FormFieldType =
  | "text"        // single-line text
  | "richtext"    // RichTextEditor (HTML)
  | "textarea"    // multi-line plain text
  | "number"      // plain number, optional `unit` suffix (e.g. sq ft)
  | "currency"    // number shown with the country's currency
  | "date"
  | "select"      // single choice (chips)
  | "multiselect" // many choices (chips)
  | "tags";       // free-text list of strings

export interface FormFieldOption {
  value: string;
  label: string;
}

export interface FormFieldDef {
  key: string;
  type: FormFieldType;
  label: string;
  required?: boolean;
  placeholder?: string;
  hint?: string;
  unit?: string;
  options?: FormFieldOption[];
  /** Numeric lower bound (number / currency). */
  min?: number;
  /** Numeric upper bound (number / currency) — catches typos like 999 beds. */
  max?: number;
  /** Numeric: value must be >= this other field's value (e.g. maxBudget ≥ minBudget). */
  gteField?: string;
  /** Numeric: value must be <= this other field's value (e.g. floor ≤ totalFloors). */
  lteField?: string;
  /** Text / textarea / richtext: max characters of visible text (HTML tags not counted). */
  maxLength?: number;
  /** Text rules: "adTitle" = letters, digits, spaces and . , - only
   *  (stripped while typing, rejected by the server). */
  format?: "adTitle";
  /** Grid width on md+ screens; always full width on mobile. */
  width?: "full" | "half" | "third";
}

export interface FormSection {
  title?: string;
  fields: FormFieldDef[];
}

export interface PostFormSchemaData {
  /** Exact category label from config/categories, e.g. "Property". */
  category: string;
  /** Exact subcategory label, e.g. "To Rent". */
  subcategory: string;
  /** ISO country code ("IN" | "GB" | "SG"). */
  country: string;
  version: number;
  sections: FormSection[];
}

export interface PostFormSchemaResponse {
  schema: PostFormSchemaData | null;
  /** "db" when served from MongoDB, "default" when falling back to the code defaults. */
  source: "db" | "default" | "none";
}
