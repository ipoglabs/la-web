// Single switch for the DB-driven post form rollout, shared by the details
// page (renders DynamicPostForm) and the addPost / updatePost server actions
// (validate against the same schema). Keeping both behind one flag means the
// server never enforces rules the user wasn't shown.
//
// Always on in dev; in production only when NEXT_PUBLIC_DYNAMIC_POST_FORM=1.

const DYNAMIC_FORM_CATEGORIES = new Set(["Property"]);

const DYNAMIC_FORM_ENABLED =
  process.env.NODE_ENV !== "production" ||
  process.env.NEXT_PUBLIC_DYNAMIC_POST_FORM === "1";

export function isDynamicFormCategory(category: string | null | undefined): boolean {
  return DYNAMIC_FORM_ENABLED && !!category && DYNAMIC_FORM_CATEGORIES.has(category);
}
