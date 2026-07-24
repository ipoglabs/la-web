/**
 * types/listings-api.ts
 *
 * Generic, category-agnostic API response shape for ALL /api/listings/[category]
 * requests. Replaces the old bespoke per-category type files (e.g. property-api.ts).
 *
 * subCategoryId / countsBySubcategory are intentionally loosely typed (string,
 * not a per-category union) — the canonical subcategory ID list per category
 * lives in config/categories/*.ts and lib/mock/listing-map.ts. Validating a
 * request's `sub` against that list happens in the API route, not the type.
 */
import type { Listing } from "@/types/listing";
import type { CountryCode } from "@/config";

export interface ListingsApiResponse {
  ok: true;
  source: "mock" | "db";
  market: CountryCode;
  categoryId: string;
  subCategoryId: string | null;
  currency: string;
  total: number;
  generatedAt: string;
  countsBySubcategory: Record<string, number>;
  items: Listing[];
}
