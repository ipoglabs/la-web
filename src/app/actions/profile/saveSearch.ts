"use server";

import connectDB from "@/lib/db";
import User from "@/models/user";
import { getSession } from "@/lib/auth";
import { MAX_RECENT_SEARCHES, mapRecentSearch, type RecentSearch, type RecentSearchScope } from "@/lib/searchUtils";

export async function saveSearch({
  keyword,
  scope,
}: {
  keyword: string;
  scope: RecentSearchScope | null;
}): Promise<RecentSearch[]> {
  await connectDB();

  const session = await getSession();
  if (!session?.userId) throw new Error("Unauthorized");

  const trimmedKeyword = keyword.trim();
  if (!trimmedKeyword && !scope) return [];

  const user: any = await User.findById(session.userId);
  if (!user || user.isDeleted) throw new Error("User not found");

  // Dedupe: drop any existing entry with the same keyword + category scope
  // before pushing the new one to the front — mirrors upsertRecentSearch
  // (the guest localStorage path) so behavior is identical either way.
  const deduped = user.recentSearches.filter(
    (r: { keyword?: string; scopeCat?: string }) =>
      !(
        (r.keyword || "").trim().toLowerCase() === trimmedKeyword.toLowerCase() &&
        (r.scopeCat || null) === (scope?.cat || null)
      )
  );
  deduped.unshift({
    keyword: trimmedKeyword,
    scopeCat: scope?.cat,
    scopeLabel: scope?.label,
    scopeSub: scope?.sub,
    scopeSubLabel: scope?.subLabel,
    searchedAt: new Date(),
  });

  // Cleanup: cap to MAX_RECENT_SEARCHES, dropping the oldest entries.
  user.recentSearches = deduped.slice(0, MAX_RECENT_SEARCHES);

  await user.save();

  return user.recentSearches.map(mapRecentSearch);
}
