"use server";

import { cookies } from "next/headers";
import connectDB from "@/config/database";
import User from "@/models/user";
import { verifyToken } from "@/lib/auth";
import type { ProfileUser } from "@/app/profile/types";

export async function getCurrentUser(): Promise<ProfileUser | null> {
  // JWT-only verify — no DB call for auth check
  const cookieStore = await cookies();
  const token =
    cookieStore.get("session")?.value ||
    cookieStore.get("token")?.value;

  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  const userId = payload.userId || payload.id;
  if (!userId) return null;

  await connectDB();

  // ONE query — fetch full doc and check status in the same round-trip
  const user: any = await User.findById(userId).lean();

  if (
    !user ||
    user.isDeleted === true ||
    user.isSuspended === true ||
    user.accountStatus === "Deleted" ||
    user.accountStatus === "Suspended"
  ) {
    return null;
  }

  return {
    id: user._id?.toString() || "",
    profileId: user.userId || "",
    username: user.username || "",
    fullName: user.fullName || "",
    dateOfBirth: user.dateOfBirth
      ? new Date(user.dateOfBirth).toISOString().slice(0, 10)
      : "",
    gender: user.gender || "",
    nationality: user.nationality || "",
    residency: user.residency || "",
    email: user.email || "",
    primaryNumber: user.primaryNumber || "",
    secondaryNumber1: user.secondaryNumber1 || "",
    secondaryNumber2: user.secondaryNumber2 || "",
    role: user.role || "",
    roleTitle: user.roleTitle || "",
    roleDescription: user.roleDescription || "",
    image: user.image || "",
    marketingOptIn: Boolean(user.marketingOptIn),
    locality: user.locality || "",
    address: {
      country: user.address?.country || "",
      state: user.address?.state || "",
      city: user.address?.city || "",
      postalCode: user.address?.postalCode || "",
    },
  };
}
