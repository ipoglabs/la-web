// Single switch for the DB-driven post form rollout, shared by the details
// page (renders DynamicPostForm) and the addPost / updatePost server actions
// (validate against the same schema). Keeping both behind one flag means the
// server never enforces rules the user wasn't shown.
//
// Always on in dev; in production only when NEXT_PUBLIC_DYNAMIC_POST_FORM=1.
//
// Every category the picker offers is on the DB form (defaults for each live
// in form-schema/defaults). The per-subcategory forms in components/form/*
// are only the fallback while the production flag is off.

import { CATEGORIES } from "@/config/categories";

const DYNAMIC_FORM_CATEGORIES = new Set(CATEGORIES.map((c) => c.label));

const DYNAMIC_FORM_ENABLED =
  process.env.NODE_ENV !== "production" ||
  process.env.NEXT_PUBLIC_DYNAMIC_POST_FORM === "1";

export function isDynamicFormCategory(category: string | null | undefined): boolean {
  return DYNAMIC_FORM_ENABLED && !!category && DYNAMIC_FORM_CATEGORIES.has(category);
}
