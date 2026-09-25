// Which categories use the DB-driven post form — shared by the details
// page, the preview, addPost / updatePost (validate against the same schema)
// and the listing detail table, so the server never enforces rules the user
// wasn't shown. Every category the picker offers is on it; defaults for each
// live in form-schema/defaults.

import { CATEGORIES } from "@/config/categories";

const DYNAMIC_FORM_CATEGORIES = new Set(CATEGORIES.map((c) => c.label));

export function isDynamicFormCategory(category: string | null | undefined): boolean {
  return !!category && DYNAMIC_FORM_CATEGORIES.has(category);
}
