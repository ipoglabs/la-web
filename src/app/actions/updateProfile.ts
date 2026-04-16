"use server";

import connectDB from "@/config/database";
import User from "@/models/user";
import { getSession } from "@/lib/auth";

export async function updateProfile(payload: any) {
  await connectDB();

  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const { userId: sessionUserId, email } = session;

  /* ================= FIND USER ================= */
  let user: any = null;

  if (sessionUserId) {
    user = await User.findById(sessionUserId);
  } else if (email) {
    user = await User.findOne({ email });
  }

  if (!user) throw new Error("User not found");

  /* ================= VALIDATION ================= */

  // 🔥 USER ID (Public Profile ID)
  if (payload.userId !== undefined) {
    const newId = payload.userId.trim();

    if (!newId) throw new Error("Profile ID is required");
    if (newId.length > 18) throw new Error("Max 18 characters allowed");
    if (!/^[a-zA-Z0-9_]+$/.test(newId)) {
      throw new Error("Only letters, numbers, and underscore allowed");
    }

    const exists = await User.findOne({
      userId: newId,
      _id: { $ne: user._id },
    });

    if (exists) {
      throw new Error("This Profile ID is already taken");
    }

    user.userId = newId;
  }

  // 🔥 NAME VALIDATION
  if (payload.firstName !== undefined) {
    const v = payload.firstName.trim();

    if (!v) throw new Error("First name is required");
    if (v.length > 18) throw new Error("Max 18 characters allowed");
    if (!/^[A-Za-z]+$/.test(v)) {
      throw new Error("First name must contain only alphabets");
    }

    user.firstName = v;
  }

  if (payload.lastName !== undefined) {
    const v = payload.lastName.trim();

    if (!v) throw new Error("Last name is required");
    if (v.length > 18) throw new Error("Max 18 characters allowed");
    if (!/^[A-Za-z]+$/.test(v)) {
      throw new Error("Last name must contain only alphabets");
    }

    user.lastName = v;
  }

  // 🔥 ROLE
  if (payload.role !== undefined) {
    if (!payload.role) throw new Error("Role is required");

    user.role = payload.role;
  }

  // 🔥 ROLE EXTRA (only for other)
  if (payload.role === "other") {
    const title = payload.roleTitle?.trim();
    const desc = payload.roleDescription?.trim();

    if (!title) throw new Error("Role title is required");
    if (title.length < 2) throw new Error("Role title too short");
    if (title.length > 80) throw new Error("Max 80 characters allowed");

    if (!desc) throw new Error("Role description is required");
    if (desc.length < 2) throw new Error("Description too short");
    if (desc.length > 300) throw new Error("Max 300 characters allowed");

    user.roleTitle = title;
    user.roleDescription = desc;
  } else {
    user.roleTitle = "";
    user.roleDescription = "";
  }

  // 🔥 DOB
  if (payload.dateOfBirth !== undefined) {
    const dob = new Date(payload.dateOfBirth);

    if (isNaN(dob.getTime())) {
      throw new Error("Invalid date");
    }

    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    if (age < 18) {
      throw new Error("You must be at least 18 years old");
    }

    user.dateOfBirth = payload.dateOfBirth;
  }

  /* ================= SAVE ================= */
  await user.save();

  return {
    success: true,
  };
}