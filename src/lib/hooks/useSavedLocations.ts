"use client";

/**
 * useSavedLocations — saved locations for any LocationPicker instance
 * outside the /profile route group (homepage, /listings, Create Alert,
 * Residence editor). Mirrors the pattern SavedLocationSection.tsx already
 * uses (real add via addSavedLocation, seeded from getCurrentUser),
 * generalized so every picker in the app shows the same list instead of
 * each hardcoding its own mock "Saved" data.
 *
 * Signed-in accounts: backed by the real DB (models/user.ts's
 * savedLocations, via addSavedLocation/removeSavedLocation server actions).
 *
 * Signed-out visitors have no account to persist to, but the feature still
 * needs to work for them — falls back to savedLocationsStore
 * (lib/stores/savedLocationsStore.ts), a localStorage-backed Zustand store,
 * so saving/removing a location behaves the same either way.
 */

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import { addSavedLocation } from "@/app/actions/profile/addSavedLocation";
import { removeSavedLocation } from "@/app/actions/profile/removeSavedLocation";
import { locationValueToSavedLocationInput, SAVED_LOCATIONS_LIMIT_MESSAGE } from "@/lib/locationUtils";
import { useSavedLocationsStore } from "@/lib/stores/savedLocationsStore";
import type { LocationValue, SavedSuggestion } from "@/components/location-picker";

export function useSavedLocations() {
  const [dbLocations, setDbLocations] = useState<SavedSuggestion[]>([]);
  const [loggedIn, setLoggedIn] = useState(false);

  const guestItems = useSavedLocationsStore((s) => s.items);
  const guestAdd = useSavedLocationsStore((s) => s.add);
  const guestRemove = useSavedLocationsStore((s) => s.remove);

  useEffect(() => {
    // skipHydration: true on the store (avoids SSR/client mismatch) means
    // it starts empty on the client too until explicitly rehydrated here.
    useSavedLocationsStore.persist.rehydrate();
  }, []);

  const refresh = useCallback(async () => {
    const user = await getCurrentUser().catch(() => null);
    setLoggedIn(Boolean(user));
    setDbLocations(
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
      if (!value) return;
      if (!loggedIn) {
        if (!guestAdd({ label: value.label, sublabel: value.sublabel })) {
          toast.error(SAVED_LOCATIONS_LIMIT_MESSAGE);
        }
        return;
      }
      try {
        await addSavedLocation(locationValueToSavedLocationInput(value));
        await refresh();
      } catch (err) {
        // Every other failure (duplicate, transient account-state change) is
        // a silent background save triggered by every pick, not a form
        // submission — but the save-limit is worth surfacing since the user
        // just took an explicit action expecting it to be saved.
        if (err instanceof Error && err.message === SAVED_LOCATIONS_LIMIT_MESSAGE) {
          toast.error(err.message);
        }
      }
    },
    [loggedIn, refresh, guestAdd]
  );

  /** Bookmark a search/recent row without selecting it as the current location. */
  const saveSuggestion = useCallback(
    async (s: SavedSuggestion) => {
      if (!loggedIn) {
        if (!guestAdd(s)) {
          toast.error(SAVED_LOCATIONS_LIMIT_MESSAGE);
        }
        return;
      }
      try {
        await addSavedLocation(locationValueToSavedLocationInput(s));
        await refresh();
      } catch (err) {
        if (err instanceof Error && err.message === SAVED_LOCATIONS_LIMIT_MESSAGE) {
          toast.error(err.message);
        }
      }
    },
    [loggedIn, refresh, guestAdd]
  );

  /** Real delete, called by LocationPicker's confirm-delete dialog. */
  const removeSavedLocationById = useCallback(
    async (id: string) => {
      if (!loggedIn) {
        guestRemove(id);
        return;
      }
      try {
        await removeSavedLocation(id);
        await refresh();
      } catch {
        // Account state changed underneath us — refresh already re-synced
        // savedLocations to the DB's actual state, nothing further to do.
      }
    },
    [loggedIn, refresh, guestRemove]
  );

  return {
    savedLocations: loggedIn ? dbLocations : guestItems,
    saveLocation,
    saveSuggestion,
    removeSavedLocationById,
  };
}
