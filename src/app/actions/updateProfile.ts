"use server";

import { cookies } from "next/headers";
import connectDB from "@/config/database";
import User from "@/models/user";
import { verifyToken } from "@/lib/auth";
import cloudinary from "@/config/cloudinary";
import mongoose from "mongoose";

type UpdatePayload = {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string; // ISO yyyy-mm-dd
  gender?: "Male" | "Female" | "Other";
  nationality?: string;
  residency?: string;
  username?: string;
  primaryNumber?: string;
  secondaryNumber1?: string;
  secondaryNumber2?: string;
  marketingOptIn?: boolean;
};

export async function updateProfile(form: FormData): Promise<{ ok: true } | { ok: false; error: string }> {
  await connectDB();

  const token = cookies().get("token")?.value?.replace(/^Bearer\s+/i, "") || "";
  const decoded = token ? verifyToken(token) : null;
  const id = decoded?.id || decoded?.userId;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return { ok: false, error: "Not authenticated" };
  }

  // Map form fields
  const payload: UpdatePayload = {
    firstName: (form.get("firstName") as string) || undefined,
    lastName: (form.get("lastName") as string) || undefined,
    dateOfBirth: (form.get("dateOfBirth") as string) || undefined,
    gender: (form.get("gender") as any) || undefined,
    nationality: (form.get("nationality") as string) || undefined,
    residency: (form.get("residency") as string) || undefined,
    username: (form.get("username") as string) || undefined,
    primaryNumber: (form.get("primaryNumber") as string) || undefined,
    secondaryNumber1: (form.get("secondaryNumber1") as string) || undefined,
    secondaryNumber2: (form.get("secondaryNumber2") as string) || undefined,
    marketingOptIn: (form.get("marketingOptIn") as string) === "on",
  };

  // Optional avatar upload
  let imageUrl: string | undefined;
  const avatar = form.get("image") as File | null;
  if (avatar && avatar.size && avatar.type?.startsWith("image/")) {
    const buf = Buffer.from(await avatar.arrayBuffer());
    const base64 = `data:${avatar.type};base64,${buf.toString("base64")}`;
    const uploaded = await cloudinary.uploader.upload(base64, { folder: "avatars" });
    imageUrl = uploaded.secure_url;
  }

  // Build update object (avoid overwriting with empties)
  const $set: Record<string, any> = {};
  for (const [k, v] of Object.entries(payload)) {
    if (v !== undefined && v !== null && String(v).length > 0) $set[k] = v;
  }
  if (payload.dateOfBirth) $set.dateOfBirth = new Date(payload.dateOfBirth);
  if (imageUrl) $set.image = imageUrl;

  try {
    await User.updateOne({ _id: id }, { $set }).lean();
    return { ok: true };
  } catch (e: any) {
    // handle unique constraints
    if (e?.code === 11000) {
      const key = Object.keys(e.keyPattern || {})[0] || "field";
      return { ok: false, error: `That ${key} is already in use.` };
    }
    return { ok: false, error: e?.message || "Failed to update profile" };
  }
}
