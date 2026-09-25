import { normalizeCategory, normalizeSubcategory } from "@/posting/config/normalize";
import { CATEGORY_CONFIG, FALLBACK_OPTIONAL_FIELDS } from "@/posting/config/categoryConfig";
import type { FieldSpec } from "@/posting/config/types";
import type { PostFormSchemaData } from "@/posting/form-schema/types";

type StoreState = any;

/**
 * `schema` is the DB-driven form the details step rendered, when the
 * category is on it — its fields are submitted instead of the static
 * posting/config spec, so every field the user saw is sent.
 */
export function buildPostFormData(data: StoreState, schema?: PostFormSchemaData | null) {
  const fd = new FormData();

  // postId is used by addPost to pre-set _id so it matches the R2 folder name
  if (data.postId) fd.append("postId", data.postId);

  fd.append("category", data.category || "");
  fd.append("subcategory", data.subcategory || "");
  fd.append("name", data.name || "");
  fd.append("description", data.description || "");

  fd.append("locationData", JSON.stringify(data.location || {}));
  fd.append("seller_info.name", data.sellerInfo?.name || "");
  fd.append("seller_info.email", data.sellerInfo?.email || "");
  fd.append("seller_info.phone", data.sellerInfo?.phone || "");

  (data.images || []).forEach((img: any) => {
    if (img instanceof File) {
      fd.append("images", img);
    } else if (typeof img === "string" && !img.startsWith("blob:")) {
      fd.append("imageUrl", img);
    }
  });

  const normCat = normalizeCategory(data.category);
  const normSub = normalizeSubcategory(data.category, data.subcategory);
  const spec = CATEGORY_CONFIG[normCat]?.[normSub];

  const applySpec = (fields?: FieldSpec[]) => {
    if (!fields) return;
    for (const field of fields) {
      const value = (data as any)[field.key];
      if (value === undefined || value === null || value === "") continue;

      if (field.type === "array") fd.append(field.key, JSON.stringify(value));
      else fd.append(field.key, String(value));
    }
  };

  if (schema) {
    for (const field of schema.sections.flatMap((s) => s.fields)) {
      if (field.key === "name" || field.key === "description") continue;
      const value: unknown = data[field.key];
      if (value === undefined || value === null || value === "") continue;
      if (Array.isArray(value)) {
        if (value.length) fd.append(field.key, JSON.stringify(value));
      } else {
        fd.append(field.key, String(value));
      }
    }
    return fd;
  }

  applySpec(spec);
  applySpec(FALLBACK_OPTIONAL_FIELDS);

  return fd;
}
