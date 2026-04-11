"use server";

import mongoose from "mongoose";
import { cache } from "react";

import connectDB from "@/config/database";
import User from "@/models/user";
import { getSession } from "@/lib/auth";

import type { ProfileUser } from "@/app/profile/types";

export const getCurrentUser = cache(async (): Promise<ProfileUser | null> => {
  await connectDB();

  const session = await getSession();
  if (!session) return null;

  const { userId, email } = session;

  let user: any = null;

  if (userId && mongoose.Types.ObjectId.isValid(userId)) {
    user = await User.findById(userId).lean();
  } else if (email) {
    user = await User.findOne({ email }).lean();
  }

  if (!user) return null;

  return {
    id: user.userId || "", // ✅ FIXED (MOST IMPORTANT)
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
    image: user.image || "",
    marketingOptIn: Boolean(user.marketingOptIn),
    locality: user.locality || "",
    address: {
      postalCode: user.address?.postalCode || "",
    },
  };
});