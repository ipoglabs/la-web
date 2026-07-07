/**
 * use-recent-searches.ts
 *
 * localStorage-backed hook for saving and retrieving recent searches.
 * Each entry captures keyword + location + category scope.
 * Max 8 entries — oldest are dropped automatically.
 */
"use client";
import { useState, useCallback } from "react";
import type { LocationValue } from "@/components/location-picker";

const KEY   = "la:recent-searches";
const LIMIT = 8;

export interface RecentSearch {
  id: string;          // timestamp-based unique id
  keyword:  string;
  location: LocationValue | null;
  scope:    { cat: string; label: string } | null;
  savedAt:  number;    // Date.now()
}

function readStorage(): RecentSearch[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

function writeStorage(items: RecentSearch[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    // storage quota — silently skip
  }
}

export function useRecentSearches() {
  const [recents, setRecents] = useState<RecentSearch[]>(readStorage);

  const save = useCallback((entry: Omit<RecentSearch, "id" | "savedAt">) => {
    // Skip saving empty keyword with no scope
    if (!entry.keyword.trim() && !entry.scope) return;

    setRecents((prev) => {
      // Remove any duplicate with same keyword + cat scope
      const deduped = prev.filter(
        (r) =>
          !(
            r.keyword.trim().toLowerCase() === entry.keyword.trim().toLowerCase() &&
            r.scope?.cat === entry.scope?.cat
          )
      );
      const next: RecentSearch[] = [
        { ...entry, id: String(Date.now()), savedAt: Date.now() },
        ...deduped,
      ].slice(0, LIMIT);
      writeStorage(next);
      return next;
    });
  }, []);

  const remove = useCallback((id: string) => {
    setRecents((prev) => {
      const next = prev.filter((r) => r.id !== id);
      writeStorage(next);
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    writeStorage([]);
    setRecents([]);
  }, []);

  return { recents, save, remove, clear };
}
