"use server";

import { Types } from "mongoose";
import dbConnect from "@/lib/db";
import Post from "@/models/post";
import User from "@/models/user";
import { requireAdminId } from "@/lib/requireAdmin";

export type AdminStatusFilter = "all" | "active" | "pending" | "rejected" | "banned";

export interface AdminPostRow {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  thumb: string | null;
  /** Raw lifecycle status, or "banned" (isSuspended, independent of status
   * in the schema — see PostStatusTarget in lib/moderation.ts). */
  status: string;
  rejectionReason: string | null;
  updatedAt: string;
  owner: { id: string; fullName: string; email?: string } | null;
}

type PopulatedOwner = { _id: Types.ObjectId; fullName: string; email?: string };

/** All posts for the admin posts page, newest-updated first. Admin-only —
 * unlike dev-tools's list actions this route isn't behind proxy.ts Basic Auth,
 * so it has to enforce the real admin session check itself. */
export async function listAllPosts(filter: AdminStatusFilter = "all", limit = 300): Promise<AdminPostRow[]> {
  const adminId = await requireAdminId();
  if (!adminId) return [];

  void User;
  await dbConnect();

  const query: Record<string, unknown> =
    filter === "banned"
      ? { isSuspended: true }
      : filter === "all"
        ? {}
        : { status: filter, isSuspended: { $ne: true } };

  const rows = await Post.find(query)
    .sort({ updatedAt: -1 })
    .limit(Math.min(limit, 500))
    .select("name category subcategory images status rejectionReason isSuspended updatedAt ownerId")
    .populate<{ ownerId: PopulatedOwner | null }>("ownerId", "fullName email")
    .lean();

  return rows.map((r) => ({
    id: String(r._id),
    name: r.name,
    category: r.category,
    subcategory: r.subcategory,
    thumb: r.images?.[0] ?? null,
    status: r.isSuspended ? "banned" : (r.status ?? "pending"),
    rejectionReason: r.rejectionReason ?? null,
    updatedAt: new Date(r.updatedAt ?? Date.now()).toISOString(),
    owner: r.ownerId
      ? { id: String(r.ownerId._id), fullName: r.ownerId.fullName, email: r.ownerId.email }
      : null,
  }));
}
