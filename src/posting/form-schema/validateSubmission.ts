// Server-side check of a submitted post against its DB-driven form schema.
// Called by addPost / updatePost before saving. Only categories rolled out to
// the dynamic form (see rollout.ts) are checked; everything else keeps the
// actions' existing basic checks.

import { isDynamicFormCategory } from "./rollout";
import { getPostFormSchema } from "./getPostFormSchema";
import { validateAgainstSchema } from "./validate";

/**
 * Returns a list of human-readable errors (empty when valid or when the
 * category isn't on the dynamic form). `data` is the post as it will be
 * saved — numbers already parsed, arrays already split.
 */
export async function validatePostSubmission(input: {
  category: string | undefined;
  subcategory: string | undefined;
  country: string | undefined;
  data: Record<string, unknown>;
}): Promise<string[]> {
  const { category, subcategory, country, data } = input;
  if (!category || !subcategory || !isDynamicFormCategory(category)) return [];

  // Posts without a market (no valid country cookie) can't be matched to a
  // per-country schema; the actions' basic checks still apply to them.
  if (!country) return [];

  const { schema } = await getPostFormSchema(category, subcategory, country);
  if (!schema) return [`Unknown subcategory "${subcategory}" for ${category}.`];

  return Object.values(validateAgainstSchema(schema, data));
}
