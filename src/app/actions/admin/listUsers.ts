"use server";

import dbConnect from "@/lib/db";
import User from "@/models/user";
import { requireAdminId } from "@/lib/requireAdmin";

export interface AdminUserRow {
  id: string;
  userId: string;
  fullName: string;
  email?: string;
  isEmailVerified: boolean;
  primaryNumber?: string;
  isPrimaryNumberVerified: boolean;
  dateOfBirth?: string;
  locality?: string;
  provider: string;
  accountStatus: string;
  isFullyRegistered: boolean;
  createdAt: string;
}

/** All users, newest first — for /admin's Users tab (delete-account flow).
 * Admin-only — unlike dev-tools's listUsers this route isn't behind proxy.ts
 * Basic Auth, so it has to enforce the real admin session check itself. */
export async function listUsers(): Promise<AdminUserRow[]> {
  const adminId = await requireAdminId();
  if (!adminId) return [];

  await dbConnect();

  const users = await User.find({})
    .sort({ createdAt: -1 })
    .select(
      "userId fullName email isEmailVerified primaryNumber isPrimaryNumberVerified dateOfBirth locality provider accountStatus isFullyRegistered createdAt"
    )
    .lean<
      {
        _id: unknown;
        userId: string;
        fullName: string;
        email?: string;
        isEmailVerified?: boolean;
        primaryNumber?: string;
        isPrimaryNumberVerified?: boolean;
        dateOfBirth?: Date;
        locality?: string;
        provider: string;
        accountStatus: string;
        isFullyRegistered?: boolean;
        createdAt: Date;
      }[]
    >();

  return users.map((user) => ({
    id: String(user._id),
    userId: user.userId,
    fullName: user.fullName,
    email: user.email || undefined,
    isEmailVerified: Boolean(user.isEmailVerified),
    primaryNumber: user.primaryNumber || undefined,
    isPrimaryNumberVerified: Boolean(user.isPrimaryNumberVerified),
    dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString() : undefined,
    locality: user.locality || undefined,
    provider: user.provider,
    accountStatus: user.accountStatus,
    isFullyRegistered: Boolean(user.isFullyRegistered),
    createdAt: new Date(user.createdAt).toISOString(),
  }));
}
