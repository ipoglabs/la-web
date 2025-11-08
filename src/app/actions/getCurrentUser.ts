"use server";

import { getSession } from "@/lib/auth";
import connectDB from "@/config/database";
import User from "@/models/user";
import mongoose from "mongoose";

export async function getCurrentUser() {
  await connectDB();

  const session = getSession();
  if (!session) return null;

  const { userId, email } = session;

  let user = null;

  if (userId && mongoose.Types.ObjectId.isValid(userId)) {
    user = await User.findById(userId).lean();
  } else if (email) {
    user = await User.findOne({ email }).lean();
  }

  if (!user) return null;

  return {
    id: String(user._id),
    firstName: user.firstName,
    lastName: user.lastName,
    dateOfBirth: user.dateOfBirth
      ? new Date(user.dateOfBirth).toISOString().slice(0, 10)
      : "",
    gender: user.gender,
    nationality: user.nationality,
    residency: user.residency,
    email: user.email,
    username: user.username,
    primaryNumber: user.primaryNumber,
    secondaryNumber1: user.secondaryNumber1 || "",
    secondaryNumber2: user.secondaryNumber2 || "",
    role: user.role,
    image: user.image || "",
    marketingOptIn: !!user.marketingOptIn,
  };
}
