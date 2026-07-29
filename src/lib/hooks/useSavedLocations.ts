"use client";

/**
 * useSavedLocations — real, DB-backed saved locations for any LocationPicker
 * instance outside the /profile route group (homepage, /listings, Create
 * Alert, Residence editor). Mirrors the pattern SavedLocationSection.tsx
 * already uses (real add via addSavedLocation, seeded from getCurrentUser),
 * generalized so every picker in the app shows the same real list instead of
 * each hardcoding its own mock "Saved" data.
 *
 * Logged-out visitors have no account to persist to — `savedLocations` stays
 * empty and `saveLocation` silently no-ops for them (these pages are public,
 * so this must never throw or block the picker's own selection behavior).
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import { addSavedLocation } from "@/app/actions/profile/addSavedLocation";
import { locationValueToSavedLocationInput } from "@/lib/locationUtils";
import type { LocationValue } from "@/components/location-picker";

type SavedSuggestion = { label: string; sublabel?: string };

export function useSavedLocations() {
  const [savedLocations, setSavedLocations] = useState<SavedSuggestion[]>([]);
  const loggedIn = useRef(true); // optimistic until the first fetch says otherwise

  const refresh = useCallback(async () => {
    const user = await getCurrentUser().catch(() => null);
    loggedIn.current = Boolean(user);
    setSavedLocations(
      (user?.savedLocations ?? []).map((loc) => ({
        label: loc.city,
        sublabel: [loc.region, loc.country].filter(Boolean).join(", "),
      }))
    );
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  /** Best-effort: every location a user picks in a wired-up picker gets saved. */
  const saveLocation = useCallback(
    async (value: LocationValue | null) => {
      if (!value || !loggedIn.current) return;
      try {
        await addSavedLocation(locationValueToSavedLocationInput(value));
        await refresh();
      } catch {
        // Already saved, or the account state changed underneath us — this
        // is a silent background save triggered by every pick, not a form
        // submission, so there's nothing worth surfacing to the user here.
      }
    },
    [refresh]
  );

  return { savedLocations, saveLocation };
}
