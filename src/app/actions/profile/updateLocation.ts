"use server";

import connectDB from "@/config/database";
import User from "@/models/user";
import { getSession } from "@/lib/auth";
import { sendLocationUpdateEmail } from "@/lib/profile/updateLocationEmail";

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