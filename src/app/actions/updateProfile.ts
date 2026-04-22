"use server";

import connectDB from "@/config/database";
import User from "@/models/user";
import { getSession } from "@/lib/auth";
import { sendProfileUpdateEmail } from "@/lib/profile/updateProfileMail";

const PREDEFINED_ROLES = ["individual", "business", "agency"];

export async function updateProfile(payload: any) {
  await connectDB();

  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const { userId: sessionUserId, email } = session;

  let user: any = null;

  if (sessionUserId) {
    user = await User.findById(sessionUserId);
  } else if (email) {
    user = await User.findOne({ email });
  }

  if (!user) throw new Error("User not found");

  // ✅ Track detailed changes
  const changes: {
    field: string;
    oldValue: string;
    newValue: string;
  }[] = [];

  /* ================= USER ID ================= */
  if (payload.userId !== undefined) {
    const newId = payload.userId.trim();

    if (!newId) throw new Error("Profile ID is required");
    if (newId.length > 18) throw new Error("Max 18 characters allowed");
    if (!/^[a-zA-Z0-9_]+$/.test(newId)) {
      throw new Error("Only letters, numbers, underscore allowed");
    }

    const exists = await User.findOne({
      userId: newId,
      _id: { $ne: user._id },
    });

    if (exists) throw new Error("Profile ID already taken");

    if (user.userId !== newId) {
      changes.push({
        field: "Profile ID",
        oldValue: user.userId || "-",
        newValue: newId,
      });

      user.userId = newId;
    }
  }

  /* ================= NAME ================= */
  if (payload.firstName !== undefined) {
    const v = payload.firstName.trim();
    if (!v) throw new Error("First name required");
    if (v.length > 18) throw new Error("Max 18 characters");
    if (!/^[A-Za-z]+$/.test(v)) throw new Error("Only alphabets");

    if (user.firstName !== v) {
      changes.push({
        field: "First Name",
        oldValue: user.firstName || "-",
        newValue: v,
      });

      user.firstName = v;
    }
  }

  if (payload.lastName !== undefined) {
    const v = payload.lastName.trim();
    if (!v) throw new Error("Last name required");
    if (v.length > 18) throw new Error("Max 18 characters");
    if (!/^[A-Za-z]+$/.test(v)) throw new Error("Only alphabets");

    if (user.lastName !== v) {
      changes.push({
        field: "Last Name",
        oldValue: user.lastName || "-",
        newValue: v,
      });

      user.lastName = v;
    }
  }

  /* ================= ROLE ================= */
  if (payload.role !== undefined) {
    if (!payload.role) throw new Error("Role is required");

    if (payload.role === "other") {
      const title = payload.roleTitle?.trim();
      const desc = payload.roleDescription?.trim();

      if (!title || title.length < 2 || title.length > 80) {
        throw new Error("Invalid role title");
      }

      if (!desc || desc.length < 2 || desc.length > 300) {
        throw new Error("Invalid role description");
      }

      if (user.role !== title || user.roleDescription !== desc) {
        changes.push({
          field: "Role",
          oldValue: user.role || "-",
          newValue: title,
        });

        user.role = title;
        user.roleTitle = title;
        user.roleDescription = desc;
      }

    } else {
      if (!PREDEFINED_ROLES.includes(payload.role)) {
        throw new Error("Invalid role");
      }

      if (user.role !== payload.role) {
        changes.push({
          field: "Role",
          oldValue: user.role || "-",
          newValue: payload.role,
        });

        user.role = payload.role;
        user.roleTitle = "";
        user.roleDescription = "";
      }
    }
  }

  /* ================= DOB ================= */
  if (payload.dateOfBirth !== undefined) {
    const dob = new Date(payload.dateOfBirth);
    if (isNaN(dob.getTime())) throw new Error("Invalid date");

    if (user.dateOfBirth !== payload.dateOfBirth) {
      changes.push({
        field: "Date of Birth",
        oldValue: user.dateOfBirth || "-",
        newValue: payload.dateOfBirth,
      });

      user.dateOfBirth = payload.dateOfBirth;
    }
  }

  await user.save();

  /* ================= EMAIL ================= */
  try {
    if (changes.length > 0 && user.email) {
      await sendProfileUpdateEmail({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        changes,
      });
    }
  } catch (err) {
    console.error("Profile update email failed:", err);
  }

  return { success: true };
}