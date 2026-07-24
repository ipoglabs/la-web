"use server";

import connectDB from "@/config/database";
import User from "@/models/user";
import { getSession } from "@/lib/auth";
import type { SavedLocation } from "@/app/(dashboard)/profile/types";

export async function addSavedLocation({
  flagCode,
  city,
  region,
  country,
}: {
  flagCode: string;
  city: string;
  region: string;
  country: string;
}): Promise<SavedLocation> {
  await connectDB();

  const session = await getSession();
  if (!session?.userId) throw new Error("Unauthorized");

  const trimmedCity = city.trim();
  const trimmedCountry = country.trim();
  if (!trimmedCity) throw new Error("City is required");
  if (!trimmedCountry) throw new Error("Country is required");

  const user: any = await User.findById(session.userId);
  if (!user || user.isDeleted) throw new Error("User not found");

  const isDuplicate = user.savedLocations.some(
    (l: { city: string; country: string }) =>
      l.city.toLowerCase() === trimmedCity.toLowerCase() &&
      l.country.toLowerCase() === trimmedCountry.toLowerCase()
  );
  if (isDuplicate) throw new Error("That location is already saved");

  // First saved location becomes primary by default — mirrors the phone
  // list's "first entry is primary" behaviour (see ProfilePageScreen.tsx).
  const isFirst = user.savedLocations.length === 0;
  user.savedLocations.push({
    flagCode,
    city: trimmedCity,
    region: region.trim(),
    country: trimmedCountry,
    primary: isFirst,
  });

  await user.save();

  const created = user.savedLocations[user.savedLocations.length - 1];
  return {
    id: String(created._id),
    flagCode: created.flagCode,
    city: created.city,
    region: created.region,
    country: created.country,
    primary: created.primary,
  };
}
