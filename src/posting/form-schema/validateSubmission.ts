// Server side of the DB-driven post form, used by addPost / updatePost:
// look up the schema the user was shown, read exactly its fields out of the
// submitted FormData, decide where each one is saved, and validate the
// result against the same schema. Only categories rolled out to the dynamic
// form (see rollout.ts) take this path; everything else keeps the actions'
// hand-written field mapping.

import Post from "@/models/post";
import { isDynamicFormCategory } from "./rollout";
import { getPostFormSchema } from "./getPostFormSchema";
import { validateAgainstSchema } from "./validate";
import type { FormFieldDef, PostFormSchemaData } from "./types";

/**
 * Keys a form schema may never write, whatever the DB document says —
 * ownership, moderation and lifecycle fields, plus the core fields the
 * actions already read and check themselves.
 */
const PROTECTED_KEYS = new Set([
  "_id",
  "__v",
  "id",
  "ownerId",
  "adsId",
  "status",
  "rejectionReason",
  "expiresAt",
  "lastBumpedAt",
  "deletedAt",
  "viewCount",
  "isSuspended",
  "suspendedAt",
  "suspendedBy",
  "createdAt",
  "updatedAt",
  "country",
  "category",
  "subcategory",
  "name",
  "description",
  "images",
  "location",
  "seller_info",
  "attributes",
]);

export async function getSubmissionSchema(input: {
  category: string | undefined;
  subcategory: string | undefined;
  country: string | undefined;
}): Promise<{ schema: PostFormSchemaData | null; error?: string }> {
  const { category, subcategory, country } = input;
  if (!category || !subcategory || !isDynamicFormCategory(category)) return { schema: null };

  // Posts without a market (no valid country cookie) can't be matched to a
  // per-country schema; the actions' basic checks still apply to them.
  if (!country) return { schema: null };

  const { schema } = await getPostFormSchema(category, subcategory, country);
  if (!schema) return { schema: null, error: `Unknown subcategory "${subcategory}" for ${category}.` };
  return { schema };
}

function schemaFields(schema: PostFormSchemaData): FormFieldDef[] {
  return schema.sections.flatMap((s) => s.fields).filter((f) => !PROTECTED_KEYS.has(f.key));
}

function readValue(field: FormFieldDef, raw: FormDataEntryValue | null): unknown {
  const s = typeof raw === "string" ? raw.trim() : "";
  if (!s) return undefined;

  switch (field.type) {
    case "number":
    case "currency": {
      const n = Number(s);
      return Number.isFinite(n) ? n : s; // keep the bad input so validation reports it
    }
    case "multiselect":
    case "tags": {
      try {
        const parsed: unknown = JSON.parse(s);
        if (Array.isArray(parsed)) return parsed.map((v) => String(v).trim()).filter(Boolean);
      } catch {
        // fall through to comma-separated
      }
      return s.split(",").map((v) => v.trim()).filter(Boolean);
    }
    default:
      return s;
  }
}

/**
 * Reads the schema's fields from the submission and splits them into Post
 * model paths (saved top-level, where listing/filter code already reads them)
 * and everything else (saved under `attributes`). `unset` lists model paths
 * the schema owns that came back empty, so an edit can clear them.
 */
export function readSchemaValues(formData: FormData, schema: PostFormSchemaData) {
  const fields: Record<string, unknown> = {};
  const attributes: Record<string, unknown> = {};
  const unset: string[] = [];

  for (const field of schemaFields(schema)) {
    const value = readValue(field, formData.get(field.key));
    const isEmpty = value === undefined || (Array.isArray(value) && value.length === 0);
    const onModel = Boolean(Post.schema.path(field.key));

    if (isEmpty) {
      if (onModel) unset.push(field.key);
      continue;
    }
    if (onModel) fields[field.key] = value;
    else attributes[field.key] = value;
  }

  return { fields, attributes, unset };
}

/** Human-readable errors for `data` (the post as it will be saved, attributes flattened in). */
export function validateSubmission(schema: PostFormSchemaData, data: Record<string, unknown>): string[] {
  return Object.values(validateAgainstSchema(schema, data));
}
