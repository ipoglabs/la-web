"use client";

/**
 * SavedLocationSection — user's list of saved locations (used to scope
 * local listing search), with add (via hidden LocationPicker trigger) and
 * remove (with confirm dialog). Split out of page.tsx (Golden Rule
 * file-size split, 2026-07-14).
 *
 * Real, DB-backed (see models/user.ts's savedLocations subdocuments and
 * app/actions/profile/{add,remove}SavedLocation.ts) — ProfilePageScreen
 * seeds `locations` from getCurrentUser(), and this component persists
 * every add/remove through those server actions itself before touching
 * local state, so a failed request never silently diverges from the DB.
 *
 * Exports countryFromToken (also reused by ResidenceEditor.tsx for the
 * same country-name normalizing).
 */

import { useRef, useState, type Dispatch, type SetStateAction } from "react";
import { MapPin, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { LaButton, LaCard } from "@/components/la";
import { LocationPicker, type LocationValue } from "@/components/location-picker";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { addSavedLocation } from "@/app/actions/profile/addSavedLocation";
import { removeSavedLocation } from "@/app/actions/profile/removeSavedLocation";
import type { SavedLocation } from "./types";

export function countryFromToken(token: string): { country: string; flagCode: string } {
  const lower = token.trim().toLowerCase();
  if (["uk", "united kingdom", "england", "scotland", "wales", "gb"].includes(lower))
    return { country: "United Kingdom", flagCode: "gb" };
  if (["sg", "singapore"].includes(lower))
    return { country: "Singapore", flagCode: "sg" };
  if (["in", "india"].includes(lower))
    return { country: "India", flagCode: "in" };
  return { country: token.trim(), flagCode: "un" };
}

function mapPickerValueToLocationInput(v: LocationValue): Omit<SavedLocation, "id" | "primary"> {
  const parts = (v.sublabel ?? "")
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);

  let country = "";
  let region = "";

  if (parts.length >= 2) {
    country = countryFromToken(parts[parts.length - 1]).country;
    region = parts.slice(0, -1).join(", ");
  } else if (parts.length === 1) {
    country = countryFromToken(parts[0]).country;
  } else {
    country = countryFromToken(v.label).country;
  }

  const flag = countryFromToken(country).flagCode;
  return { flagCode: flag, city: v.label, region, country };
}

export function SavedLocationSection({
  locations,
  setLocations,
}: {
  locations: SavedLocation[];
  setLocations: Dispatch<SetStateAction<SavedLocation[]>>;
}) {
  const [pendingDelete, setPendingDelete] = useState<SavedLocation | null>(null);
  const [saving, setSaving] = useState(false);
  const pickerHostRef = useRef<HTMLDivElement>(null);

  const openLocationPicker = () => {
    const trigger = pickerHostRef.current?.querySelector<HTMLButtonElement>(
      'button[aria-haspopup="dialog"]',
    );
    trigger?.click();
  };

  const handleAddLocation = async (value: LocationValue | null) => {
    if (!value) return;
    const next = mapPickerValueToLocationInput(value);
    const isDuplicate = locations.some(
      (l) =>
        l.city.toLowerCase() === next.city.toLowerCase() &&
        l.country.toLowerCase() === next.country.toLowerCase(),
    );
    if (isDuplicate) return;

    setSaving(true);
    try {
      const created = await addSavedLocation(next);
      setLocations((prev) => [...prev, created]);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't save that location");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    const target = pendingDelete;
    setSaving(true);
    try {
      await removeSavedLocation(target.id);
      setLocations((prev) => {
        const filtered = prev.filter((l) => l.id !== target.id);
        const hasPrimary = filtered.some((l) => l.primary);
        return !hasPrimary && filtered.length > 0
          ? filtered.map((l, i) => ({ ...l, primary: i === 0 }))
          : filtered;
      });
      setPendingDelete(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't remove that location");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <section className="space-y-1">
        <div className="flex items-center justify-between px-1">
          <p className="text-lg font-medium text-slate-900">Saved Locations</p>
          <LaButton
            type="button"
            intent="ghost"
            size="compact"
            onClick={openLocationPicker}
            disabled={saving}
            className="gap-1 px-2 text-sm font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-800"
          >
            <Plus className="size-3.5" />
            Add
          </LaButton>
        </div>
        <p className="px-1 text-sm text-slate-700">Only visible to you. Controls what local listings you see.</p>

        {/* Hidden LocationPicker trigger */}
        <div ref={pickerHostRef} aria-hidden="true" className="fixed -left-full top-0">
          <LocationPicker
            onChange={handleAddLocation}
            searchProvider="google"
            countryScope={["SG", "UK", "IN"]}
          />
        </div>

        <LaCard className="overflow-hidden">
          {locations.length === 0 && (
            <div className="px-4 py-6 text-center text-sm text-slate-500">
              No saved locations yet
            </div>
          )}
          {locations.map((loc) => (
            <div
              key={loc.id}
              className="flex items-center gap-3 border-b border-slate-200 px-4 py-3.5 last:border-0"
            >
              <img
                src={`/flags/${loc.flagCode}.svg`}
                alt={loc.country}
                width={24}
                height={16}
                className="shrink-0 rounded-sm object-contain"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-base font-semibold text-slate-900">{loc.city}</p>
                  {loc.primary && (
                    <span className="rounded-full bg-violet-100 px-2 py-0.5 text-sm font-semibold text-violet-700">
                      Primary
                    </span>
                  )}
                </div>
                {(loc.region || loc.country) && (
                  <p className="text-sm text-slate-500">
                    {[loc.region, loc.country].filter(Boolean).join(", ")}
                  </p>
                )}
              </div>
              <button
                type="button"
                aria-label={`Remove ${loc.city}`}
                onClick={() => setPendingDelete(loc)}
                disabled={saving}
                className="shrink-0 text-slate-400 transition-colors hover:text-rose-500 disabled:opacity-50"
              >
                <Trash2 className="size-4" strokeWidth={1.75} />
              </button>
            </div>
          ))}
        </LaCard>
      </section>

      <AlertDialog open={!!pendingDelete} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia>
              <MapPin className="size-5 text-rose-500" />
            </AlertDialogMedia>
            <AlertDialogTitle>Remove location?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDelete?.city}, {pendingDelete?.country} will be removed from your saved
              locations.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={confirmDelete} disabled={saving}>
              {saving ? "Removing…" : "Remove"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
