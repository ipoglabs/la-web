// Dropdown values sellers typed that aren't in the form's options (see
// CUSTOM_OPTION in ./types): queued in models/OptionRequest.ts for the admin,
// and — once the admin adds one — written into the form's options.

import { Types } from "mongoose";
import { ADMIN_EMAIL } from "@/lib/admin";
import { sendEmail } from "@/lib/email";
import OptionRequest from "@/models/OptionRequest";
import { acceptsCustomOption, isFieldVisible, type FormSection, type PostFormSchemaData } from "./types";

/** Typed (not-an-option) dropdown values in `data`, the post as saved. */
export function customOptionValues(schema: PostFormSchemaData, data: Record<string, unknown>) {
  return schema.sections
    .flatMap((s) => s.fields)
    .filter((f) => acceptsCustomOption(f) && isFieldVisible(f, data))
    .flatMap((field) => {
      const raw = data[field.key];
      const value = typeof raw === "string" ? raw.trim() : "";
      if (!value || field.options?.some((o) => o.value === value)) return [];
      return [{ field, value }];
    });
}

/**
 * Queues each typed dropdown value on `postId` for the admin, and emails the
 * admin about a value nobody has typed before (`notify: false` skips that,
 * for scripts). Never throws — a failed request mustn't fail the post, which
 * already saved the value.
 */
export async function recordOptionRequests(
  schema: PostFormSchemaData,
  data: Record<string, unknown>,
  postId: string,
  { notify = true } = {},
) {
  try {
    for (const { field, value } of customOptionValues(schema, data)) {
      const res = await OptionRequest.updateOne(
        {
          category: schema.category,
          subcategory: schema.subcategory,
          country: schema.country.toUpperCase(),
          fieldKey: field.key,
          valueKey: value.toLowerCase(),
        },
        {
          $setOnInsert: { value, status: "pending" },
          $set: { fieldLabel: field.label },
          $addToSet: { postIds: new Types.ObjectId(postId) },
        },
        { upsert: true },
      );
      if (notify && res.upsertedCount) await notifyAdmin(schema, field.label, value);
    }
  } catch (err) {
    console.error("[option-requests] recording failed:", err);
  }
}

async function notifyAdmin(schema: PostFormSchemaData, fieldLabel: string, value: string) {
  const result = await sendEmail({
    type: "ADMIN_MESSAGE",
    to: ADMIN_EMAIL,
    data: {
      firstName: "Admin",
      subject: `New ${fieldLabel.toLowerCase()} to review: ${value}`,
      body:
        `A seller typed “${value}” as the ${fieldLabel} in ${schema.category} › ${schema.subcategory} ` +
        `(${schema.country.toUpperCase()}) — it isn't in that form's list.\n\n` +
        `Add it to the form or dismiss it in Admin → Option requests.`,
      actionUrl: "/admin?tab=options",
      actionLabel: "Review option requests",
    },
  });
  if (!result.success) console.error("[option-requests] admin email failed:", result.error);
}

/**
 * `sections` with `value` added to the `fieldKey` dropdown's options, in A–Z
 * place (after a leading "Any"). Unchanged when the field is missing or
 * already has the value (any case).
 */
export function withOption(sections: FormSection[], fieldKey: string, value: string): FormSection[] {
  const key = value.toLowerCase();
  return sections.map((section) => ({
    ...section,
    fields: section.fields.map((field) => {
      if (field.key !== fieldKey || !acceptsCustomOption(field)) return field;
      const options = field.options ?? [];
      if (options.some((o) => o.value.toLowerCase() === key || o.label.toLowerCase() === key)) return field;
      const start = options[0]?.value === "Any" ? 1 : 0;
      const after = options.findIndex((o, i) => i >= start && o.label.localeCompare(value, "en", { sensitivity: "base" }) > 0);
      const at = after >= 0 ? after : options.length;
      return { ...field, options: [...options.slice(0, at), { value, label: value }, ...options.slice(at)] };
    }),
  }));
}

/** `sections` with every option the admin has added to this form — re-applied after a code sync replaces it. */
export async function withAddedOptions(
  category: string,
  subcategory: string,
  country: string,
  sections: FormSection[],
): Promise<FormSection[]> {
  const added = await OptionRequest.find({ category, subcategory, country, status: "added" })
    .sort({ reviewedAt: 1 })
    .select("fieldKey value")
    .lean();
  return added.reduce((acc, r) => withOption(acc, r.fieldKey, r.value), sections);
}
