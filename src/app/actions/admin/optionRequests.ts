"use server";

import dbConnect from "@/lib/db";
import { requireAdminId } from "@/lib/requireAdmin";
import OptionRequest from "@/models/OptionRequest";
import PostFormSchema from "@/models/PostFormSchema";
import Post from "@/models/post";
import { getDefaultSchema } from "@/posting/form-schema/defaults";
import { withOption } from "@/posting/form-schema/optionRequests";
import { CUSTOM_OPTION, type FormSection } from "@/posting/form-schema/types";

export interface AdminOptionRequest {
  id: string;
  category: string;
  subcategory: string;
  country: string;
  fieldKey: string;
  fieldLabel: string;
  value: string;
  postCount: number;
  createdAt: string;
}

type ActionResult = { ok: true } | { ok: false; error: string };

/** Pending dropdown values sellers typed (models/OptionRequest.ts), most-used first. */
export async function listOptionRequests(): Promise<AdminOptionRequest[]> {
  const adminId = await requireAdminId();
  if (!adminId) return [];

  await dbConnect();
  const rows = await OptionRequest.find({ status: "pending" }).sort({ createdAt: -1 }).limit(500).lean();

  return rows
    .map((r) => ({
      id: String(r._id),
      category: r.category,
      subcategory: r.subcategory,
      country: r.country,
      fieldKey: r.fieldKey,
      fieldLabel: r.fieldLabel,
      value: r.value,
      postCount: r.postIds.length,
      createdAt: new Date(r.createdAt).toISOString(),
    }))
    .sort((a, b) => b.postCount - a.postCount);
}

/**
 * Adds the value to that form's dropdown options (spelt as `label`, e.g.
 * "bmw" → "BMW") and gives the posts that used it the same spelling.
 */
export async function addOptionRequest(id: string, label: string): Promise<ActionResult> {
  const adminId = await requireAdminId();
  if (!adminId) return { ok: false, error: "forbidden" };

  const value = label.trim().replace(/\s+/g, " ");
  if (!value || value.length > CUSTOM_OPTION.maxLength || !CUSTOM_OPTION.pattern.test(value)) {
    return { ok: false, error: `Use up to ${CUSTOM_OPTION.maxLength} letters, numbers, spaces and . , ' & ( ) / + -` };
  }

  try {
    await dbConnect();
    const request = await OptionRequest.findOne({ _id: id, status: "pending" });
    if (!request) return { ok: false, error: "Request not found or already reviewed" };
    const { category, subcategory, country, fieldKey } = request;

    // Forms not yet in the DB are served from the code defaults — start from those.
    const doc = await PostFormSchema.findOne({ category, subcategory, country }).lean();
    const sections = (doc?.sections as FormSection[] | undefined) ?? getDefaultSchema(category, subcategory, country)?.sections;
    if (!sections) return { ok: false, error: `No form for ${category} › ${subcategory} (${country})` };

    await PostFormSchema.updateOne(
      { category, subcategory, country },
      {
        $set: { sections: withOption(sections, fieldKey, value) },
        ...(doc ? {} : { $setOnInsert: { version: 1, active: true } }),
      },
      { upsert: true },
    );

    if (value !== request.value) {
      const path = Post.schema.path(fieldKey) ? fieldKey : `attributes.${fieldKey}`;
      await Post.updateMany({ _id: { $in: request.postIds }, [path]: request.value }, { $set: { [path]: value } });
      request.value = value;
    }

    request.status = "added";
    request.reviewedAt = new Date();
    request.reviewedBy = adminId;
    await request.save();
    return { ok: true };
  } catch (err) {
    console.error("[option-requests] add failed:", err);
    return { ok: false, error: "failed" };
  }
}

/** Leaves the form as it is; the posts keep the typed value. */
export async function dismissOptionRequest(id: string): Promise<ActionResult> {
  const adminId = await requireAdminId();
  if (!adminId) return { ok: false, error: "forbidden" };

  try {
    await dbConnect();
    const res = await OptionRequest.updateOne(
      { _id: id, status: "pending" },
      { $set: { status: "dismissed", reviewedAt: new Date(), reviewedBy: adminId } },
    );
    return res.matchedCount ? { ok: true } : { ok: false, error: "Request not found or already reviewed" };
  } catch {
    return { ok: false, error: "failed" };
  }
}
