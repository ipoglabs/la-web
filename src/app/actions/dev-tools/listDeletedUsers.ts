"use server";

import dbConnect from "@/lib/db";
import User from "@/models/user";
import type { DevToolsDeletedUser } from "./types";

type DeletedUserLean = {
  _id: unknown;
  userId: string;
  fullName: string;
  accountStatus: string;
  deletedAt?: Date;
  deleteFeedback?: string;
  createdAt: Date;
  audit?: { action: string; at: Date }[];
  deletedIdentitySnapshot?: { email?: string; primaryNumber?: string; fullName?: string };
};

/**
 * Deleted (anonymized) accounts, newest-deleted first — Basic-Auth gated,
 * see src/app/dev-tools/page.tsx. Their email/phone/name are already scrubbed
 * (see softDeleteAccount, src/app/actions/profile/deleteAccount.ts) — this
 * is a read-only view onto what's left (userId, audit trail, deletion
 * metadata) plus their listings/chat history via getDeletedUserData.
 */
export async function listDeletedUsers(): Promise<DevToolsDeletedUser[]> {
  await dbConnect();

  const users = await User.find({ isDeleted: true })
    .sort({ deletedAt: -1 })
    .lean<DeletedUserLean[]>();

  return users.map((user) => ({
    id: String(user._id),
    userId: user.userId,
    fullName: user.fullName,
    accountStatus: user.accountStatus,
    deletedAt: user.deletedAt ? new Date(user.deletedAt).toISOString() : undefined,
    deleteFeedback: user.deleteFeedback || undefined,
    createdAt: new Date(user.createdAt).toISOString(),
    audit: (user.audit || []).map((a) => ({
      action: a.action,
      at: new Date(a.at).toISOString(),
    })),
    originalEmail: user.deletedIdentitySnapshot?.email || undefined,
    originalPrimaryNumber: user.deletedIdentitySnapshot?.primaryNumber || undefined,
    originalFullName: user.deletedIdentitySnapshot?.fullName || undefined,
  }));
}
