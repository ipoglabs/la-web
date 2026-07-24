"use server";

import dbConnect from "@/lib/db";
import User from "@/models/user";
import type { LaDevUser } from "./types";

/** All users, newest first — Basic-Auth gated, see src/app/la-dev/page.tsx. */
export async function listUsers(): Promise<LaDevUser[]> {
  await dbConnect();

  const users = await User.find({}).sort({ createdAt: -1 });

  return users.map((user: any) => ({
    id: String(user._id),
    userId: user.userId,
    fullName: user.fullName,
    email: user.email || undefined,
    isEmailVerified: user.isEmailVerified,
    primaryNumber: user.primaryNumber || undefined,
    isPrimaryNumberVerified: user.isPrimaryNumberVerified,
    dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString() : undefined,
    locality: user.locality || undefined,
    provider: user.provider,
    accountStatus: user.accountStatus,
    isFullyRegistered: Boolean(user.isFullyRegistered),
    isNewUser: Boolean(user.isNewUser),
    createdAt: new Date(user.createdAt).toISOString(),
  }));
}
