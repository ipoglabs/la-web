"use server";

import connectDB from "@/lib/db";
import User from "@/models/user";
import { getSession } from "@/lib/auth";
import { sendLocationUpdateEmail } from "@/lib/profile/updateLocationEmail";
import { logActivity } from "@/lib/activityLog";
import type { ActivityAction } from "@/models/ActivityLog";

export async function updateLocation({
  country,
  state,
  locality,
  postalCode = "",
}: {
  country: string;
  state: string;
  locality: string;
  postalCode?: string;
}) {
  await connectDB();

  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const { userId, email } = session;

  let user: any = null;

  if (userId) {
    user = await User.findById(userId);
  } else if (email) {
    user = await User.findOne({ email });
  }

  if (!user) throw new Error("User not found");

  /* ================= VALIDATION ================= */

  if (!country) throw new Error("Country is required");
  if (!state) throw new Error("State is required");
  if (!locality) throw new Error("City is required");

  /* ================= TRACK CHANGES ================= */

  const changes: {
    field: string;
    oldValue: string;
    newValue: string;
  }[] = [];

  if (user.nationality !== country) {
    changes.push({
      field: "Country",
      oldValue: user.nationality || "-",
      newValue: country,
    });
  }

  if (user.address?.state !== state) {
    changes.push({
      field: "State",
      oldValue: user.address?.state || "-",
      newValue: state,
    });
  }

  if (user.locality !== locality) {
    changes.push({
      field: "City",
      oldValue: user.locality || "-",
      newValue: locality,
    });
  }

  if (user.address?.postalCode !== postalCode) {
    changes.push({
      field: "Postal Code",
      oldValue: user.address?.postalCode || "-",
      newValue: postalCode,
    });
  }

  /* ================= UPDATE ================= */

  user.nationality = country;
  user.locality = locality;

  user.address = {
    ...(user.address || {}),
    country,
    state,
    city: locality,
    postalCode,
  };

  await user.save();

  // ADO-style field-level history: log every changed field with its old→new
  // value — mirrors updateProfile.ts's FIELD_ACTIONS pattern. Postal Code
  // has no action mapped: the editor never actually sends one (always
  // defaults to ""), so there's nothing real to log yet.
  const FIELD_ACTIONS: Record<string, ActivityAction> = {
    Country: "COUNTRY_CHANGED",
    State: "STATE_CHANGED",
    City: "CITY_CHANGED",
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
      await sendLocationUpdateEmail({
        fullName: user.fullName || "",
        email: user.email,
        changes,
      });
    }
  } catch (err) {
    console.error("Location email failed:", err);
  }

  return { success: true };
}