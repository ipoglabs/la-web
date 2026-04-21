"use server";

import connectDB from "@/config/database";
import User from "@/models/user";
import { getSession } from "@/lib/auth";
import type { ProfileUser } from "@/app/profile/types";

export async function getCurrentUser(): Promise<ProfileUser | null> {
  await connectDB();

  const session = await getSession();
  if (!session) return null;

  // 🔥 Always use userId (no fallback needed)
  const user: any = await User.findById(session.userId).lean();

  if (!user || user.isDeleted) return null;

  return {
    id: user.userId || "",
    username: user.username || "",
    firstName: user.firstName || "",
    lastName: user.lastName || "",
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