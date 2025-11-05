"use server";

import { cookies } from "next/headers";
import connectDB from "@/config/database";
import User from "@/models/user";
import { verifyToken } from "@/lib/auth";
import mongoose from "mongoose";

function getIdAndEmail(decoded: any) {
  const id = decoded?.id || decoded?.userId; // supports both login & register tokens
  const email =
    decoded?.email ||
    decoded?.user?.email ||
    (typeof decoded?.sub === "string" && decoded.sub.includes("@") ? decoded.sub : undefined);
  return { id, email };
}

export async function getCurrentUser() {
  await connectDB();

  const token = cookies().get("token")?.value?.replace(/^Bearer\s+/i, "") || "";
  const decoded = token ? verifyToken(token) : null;
  if (!decoded) return null;

  const { id, email } = getIdAndEmail(decoded);

  let user = null;
  if (id && mongoose.Types.ObjectId.isValid(id)) {
    user = await User.findById(id).lean();
  } else if (email) {
    user = await User.findOne({ email }).lean();
  }

  if (!user) return null;

  return {
    id: String(user._id),
    firstName: user.firstName,
    lastName: user.lastName,
    dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().slice(0, 10) : "",
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
