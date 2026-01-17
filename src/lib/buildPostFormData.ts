import { normalizeCategory, normalizeSubcategory } from "@/posting/config/normalize";
import { CATEGORY_CONFIG, FALLBACK_OPTIONAL_FIELDS } from "@/posting/config/categoryConfig";
import type { FieldSpec } from "@/posting/config/types";

// keep your StoreState type as-is
type StoreState = any;

export function buildPostFormData(data: StoreState) {
  const fd = new FormData();

  fd.append("category", data.category || "");
  fd.append("subcategory", data.subcategory || "");
  fd.append("name", data.name || "");
  fd.append("description", data.description || "");

  fd.append("locationData", JSON.stringify(data.location || {}));
  fd.append("seller_info.name", data.sellerInfo?.name || "");
  fd.append("seller_info.email", data.sellerInfo?.email || "");
  fd.append("seller_info.phone", data.sellerInfo?.phone || "");

  (data.images || []).forEach((img: any, i: number) => {
    if (img instanceof File) fd.append("images", img, img.name || `image-${i}.jpg`);
    else if (typeof img === "string") fd.append("imageUrl", img);
  });

  const normCat = normalizeCategory(data.category);
  const normSub = normalizeSubcategory(data.subcategory);
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

  applySpec(spec);
  applySpec(FALLBACK_OPTIONAL_FIELDS);

  return fd;
}
