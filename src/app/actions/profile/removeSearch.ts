"use server";

import connectDB from "@/lib/db";
import User from "@/models/user";
import { getSession } from "@/lib/auth";
import { mapRecentSearch, type RecentSearch } from "@/lib/searchUtils";

export async function removeSearch(id: string): Promise<RecentSearch[]> {
  await connectDB();

  const session = await getSession();
  if (!session?.userId) throw new Error("Unauthorized");

  const user: any = await User.findById(session.userId);
  if (!user || user.isDeleted) throw new Error("User not found");

  const target = user.recentSearches.id(id);
  if (target) target.deleteOne();

  await user.save();
  return user.recentSearches.map(mapRecentSearch);
}
