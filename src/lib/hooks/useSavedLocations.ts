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
import { removeSavedLocation } from "@/app/actions/profile/removeSavedLocation";
import { locationValueToSavedLocationInput } from "@/lib/locationUtils";
import type { LocationValue, SavedSuggestion } from "@/components/location-picker";

export function useSavedLocations() {
  const [savedLocations, setSavedLocations] = useState<SavedSuggestion[]>([]);
  const loggedIn = useRef(true); // optimistic until the first fetch says otherwise

  const refresh = useCallback(async () => {
    const user = await getCurrentUser().catch(() => null);
    loggedIn.current = Boolean(user);
    setSavedLocations(
      (user?.savedLocations ?? []).map((loc) => ({
        id: loc.id,
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

  /** Bookmark a search/recent row without selecting it as the current location. */
  const saveSuggestion = useCallback(
    async (s: SavedSuggestion) => {
      if (!loggedIn.current) return;
      try {
        await addSavedLocation(locationValueToSavedLocationInput(s));
        await refresh();
      } catch {
        // Already saved — nothing to surface for a background bookmark toggle.
      }
    },
    [refresh]
  );

  /** Real delete, called by LocationPicker's confirm-delete dialog. */
  const removeSavedLocationById = useCallback(
    async (id: string) => {
      if (!loggedIn.current) return;
      try {
        await removeSavedLocation(id);
        await refresh();
      } catch {
        // Account state changed underneath us — refresh already re-synced
        // savedLocations to the DB's actual state, nothing further to do.
      }
    },
    [refresh]
  );

  return { savedLocations, saveLocation, saveSuggestion, removeSavedLocationById };
}
