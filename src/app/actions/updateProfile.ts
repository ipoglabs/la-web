"use server";

import connectDB from "@/lib/db";
import User from "@/models/user";
import Post from "@/models/post";
import { getSession } from "@/lib/auth";
import { sendProfileUpdateEmail } from "@/lib/profile/updateProfileMail";
import { logActivity } from "@/lib/activityLog";
import {
  ROLES,
  BASE_ROLE,
  MAX_ROLES_PER_ACCOUNT,
  CUSTOM_ROLE_MIN_LENGTH,
  CUSTOM_ROLE_MAX_LENGTH,
  SPECIALTY_MAX_LENGTH,
  INTENT_OPTIONS,
} from "@/config/roles";

const PREDEFINED_ROLES = ["individual", "business", "agency"];
const VALID_ROLE_IDS = new Set<string>(ROLES.map((r) => r.id));
const VALID_INTENT_IDS = new Set<string>(INTENT_OPTIONS.map((o) => o.id));

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
  if (payload.fullName !== undefined) {
    const v = payload.fullName.trim();
    if (!v) throw new Error("Full name is required");
    const parts = v.split(/\s+/).filter(Boolean);
    if (!parts.every((p: string) => /^[A-Za-z]+$/.test(p)))
      throw new Error("Only alphabets allowed");

    if (user.fullName !== v) {
      changes.push({
        field: "Full Name",
        oldValue: user.fullName || "-",
        newValue: v,
      });

      user.fullName = v;
    }
  }

  /* ================= PUBLIC ROLE ================= */
  if (payload.publicRole !== undefined) {
    if (!payload.publicRole) throw new Error("Role is required");

    if (payload.publicRole === "other") {
      const title = payload.roleTitle?.trim();
      const desc = payload.roleDescription?.trim();

      if (!title || title.length < 2 || title.length > 80) {
        throw new Error("Invalid role title");
      }

      if (!desc || desc.length < 2 || desc.length > 300) {
        throw new Error("Invalid role description");
      }

      if (user.publicRole !== title || user.roleDescription !== desc) {
        changes.push({
          field: "Role",
          oldValue: user.publicRole || "-",
          newValue: title,
        });

        user.publicRole = title;
        user.roleTitle = title;
        user.roleDescription = desc;
      }

    } else {
      if (!PREDEFINED_ROLES.includes(payload.publicRole)) {
        throw new Error("Invalid role");
      }

      if (user.publicRole !== payload.publicRole) {
        changes.push({
          field: "Role",
          oldValue: user.publicRole || "-",
          newValue: payload.publicRole,
        });

        user.publicRole = payload.publicRole;
        user.roleTitle = "";
        user.roleDescription = "";
      }
    }
  }

  /* ================= MULTI-SELECT ROLES (Profile page RolesEditor) =================
   * Separate from the legacy `payload.publicRole` ("individual"/"business"/"agency"/"other")
   * block above — this is config/roles.ts's 12-option multi-select + custom
   * role, mirroring exactly how registration persists them
   * (see api/auth/complete-profile/route.ts). Never trust client-supplied
   * role ids or unsanitized custom text — validate everything server-side. */
  if (payload.roleIds !== undefined) {
    const roleIds: unknown = payload.roleIds;
    if (!Array.isArray(roleIds) || !roleIds.every((id) => typeof id === "string" && VALID_ROLE_IDS.has(id))) {
      throw new Error("Invalid roles");
    }

    const customRole = payload.customRole != null ? String(payload.customRole).trim() : null;
    if (customRole && (customRole.length < CUSTOM_ROLE_MIN_LENGTH || customRole.length > CUSTOM_ROLE_MAX_LENGTH)) {
      throw new Error("Invalid custom role");
    }

    if (roleIds.length + (customRole ? 1 : 0) > MAX_ROLES_PER_ACCOUNT) {
      throw new Error(`You can select up to ${MAX_ROLES_PER_ACCOUNT} additional roles`);
    }

    const rawSpecialties =
      payload.roleSpecialties && typeof payload.roleSpecialties === "object" ? payload.roleSpecialties : {};
    const cleanSpecialties: Record<string, string> = {};
    for (const id of roleIds as string[]) {
      const v = rawSpecialties[id];
      if (typeof v === "string" && v.trim()) {
        cleanSpecialties[id] = v.trim().slice(0, SPECIALTY_MAX_LENGTH);
      }
    }

    // Mirrors complete-profile/route.ts: `publicRole` stays the single
    // required display string — set to the first selected role (or the
    // implicit BASE_ROLE "individual" default).
    const primaryRole = (roleIds as string[])[0] ?? BASE_ROLE.id;

    if (user.publicRole !== primaryRole) {
      changes.push({ field: "Role", oldValue: user.publicRole || "-", newValue: primaryRole });
    }

    user.publicRole = primaryRole;
    user.roles = roleIds;
    user.roleSpecialties = cleanSpecialties;
    user.customRole = customRole || undefined;
  }

  /* ================= INTENT (private "why are you here") ================= */
  if (payload.intent !== undefined) {
    const intent = String(payload.intent);
    if (!VALID_INTENT_IDS.has(intent)) {
      throw new Error("Invalid intent");
    }
    user.intent = intent;
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

  /* ================= GENDER ================= */
  if (payload.gender !== undefined) {
    const v = String(payload.gender).trim();
    if (user.gender !== v) {
      changes.push({
        field: "Gender",
        oldValue: user.gender || "-",
        newValue: v,
      });
      user.gender = v;
    }
  }

  await user.save();

  // Keep each ad's contact snapshot (seller_info.name) in sync with the
  // account's display name so old ads never show a name the seller has
  // since changed — mirrors the email/phone sync in profile/updateContact.ts.
  if (changes.some((c) => c.field === "Full Name")) {
    await Post.updateMany(
      { ownerId: user._id },
      { $set: { "seller_info.name": user.fullName } }
    );
  }

  // ADO-style field-level history: log every changed field with its old→new
  // value, not just name — see ActivityAction in models/ActivityLog.ts.
  const FIELD_ACTIONS: Record<string, import("@/models/ActivityLog").ActivityAction> = {
    "Full Name": "NAME_CHANGED",
    "Profile ID": "USERID_CHANGED",
    Role: "ROLE_CHANGED",
    "Date of Birth": "DOB_CHANGED",
    Gender: "GENDER_CHANGED",
  };
  for (const change of changes) {
    const action = FIELD_ACTIONS[change.field];
    if (action) {
      await logActivity(user._id, action, { from: change.oldValue, to: change.newValue });
    }
  }

  /* ================= EMAIL ================= */
  try {
    if (changes.length > 0 && user.email) {
      await sendProfileUpdateEmail({
        fullName: user.fullName,
        email: user.email,
        changes,
      });
    }
  } catch (err) {
    console.error("Profile update email failed:", err);
  }

  return { success: true };
}