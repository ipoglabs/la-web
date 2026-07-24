"use server";

import { cookies } from "next/headers";
import connectDB from "@/config/database";
import User from "@/models/user";
import { verifyToken } from "@/lib/auth";
import { isSessionRevoked } from "@/lib/userSession";
import type { ProfileUser } from "@/app/(dashboard)/profile/types";

type RawSavedLocation = {
  _id: unknown;
  flagCode?: string;
  city?: string;
  region?: string;
  country?: string;
  primary?: boolean;
};

export async function getCurrentUser(): Promise<ProfileUser | null> {
  const cookieStore = await cookies();
  const token =
    cookieStore.get("session")?.value ||
    cookieStore.get("token")?.value;

  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  const userId = payload.userId || payload.id;
  if (!userId) return null;

  // Per-device revocation check (Devices list in account-settings) needs a
  // DB round-trip, so this is no longer JWT-only — see lib/userSession.ts.
  if (await isSessionRevoked(payload.sid, userId)) return null;

  await connectDB();

  // ONE query — fetch full doc and check status in the same round-trip
  const user: any = await User.findById(userId)
    .select(
      "userId username fullName dateOfBirth gender nationality residency email primaryNumber secondaryNumber1 secondaryNumber2 role roleTitle roleDescription image marketingOptIn locality address savedLocations isDeleted isSuspended accountStatus"
    )
    .lean();

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
    savedLocations: (user.savedLocations || []).map((loc: RawSavedLocation) => ({
      id: String(loc._id),
      flagCode: loc.flagCode || "un",
      city: loc.city || "",
      region: loc.region || "",
      country: loc.country || "",
      primary: Boolean(loc.primary),
    })),
  };
}
