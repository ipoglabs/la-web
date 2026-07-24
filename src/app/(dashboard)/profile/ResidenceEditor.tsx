"use client";

/**
 * ResidenceEditor — country/state/city editor backed by LocationPicker.
 * Split out of page.tsx (Golden Rule file-size split, 2026-07-14).
 */

import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { laButtonVariants } from "@/components/la/la-button";
import { LocationPicker, type LocationValue } from "@/components/location-picker";
import { cn } from "@/lib/utils";
import { ResponsiveEditor } from "./ResponsiveEditor";
import { countryFromToken } from "./SavedLocationSection";
import type { ResidenceValues, SavedLocation } from "./types";

function pickerValueToResidence(v: LocationValue): ResidenceValues {
  const parts = (v.sublabel ?? "")
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);
  let country = "";
  let state = "";
  if (parts.length >= 2) {
    country = countryFromToken(parts[parts.length - 1]).country;
    state = parts.slice(0, -1).join(", ");
  } else if (parts.length === 1) {
    country = countryFromToken(parts[0]).country;
  } else {
    country = countryFromToken(v.label).country;
  }
  return { city: v.label, state, country };
}

function residenceToPickerValue(r: ResidenceValues): LocationValue {
  const sublabel = [r.state, r.country].filter(Boolean).join(", ");
  return { label: r.city, sublabel };
}

export function ResidenceEditor({
  open,
  onOpenChange,
  value,
  onSave,
  primaryLocation,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: ResidenceValues;
  onSave: (next: ResidenceValues) => void | Promise<void>;
  primaryLocation?: SavedLocation | null;
}) {
  const hasExisting = Boolean(value.city);
  const [pickerValue, setPickerValue] = useState<LocationValue | null>(
    hasExisting ? residenceToPickerValue(value) : null,
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) setPickerValue(value.city ? residenceToPickerValue(value) : null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const usePrimary = () => {
    if (!primaryLocation) return;
    setPickerValue({
      label: primaryLocation.city,
      sublabel: [primaryLocation.region, primaryLocation.country].filter(Boolean).join(", "),
    });
  };

  const handleSave = async () => {
    if (!pickerValue || saving) return;
    setSaving(true);
    try {
      // Real persistence happens in the parent's onSave (updateLocation server
      // action → PATCHes the User doc in Mongo) — we just need to wait for it
      // and only close the editor once it's actually confirmed.
      await onSave(pickerValueToResidence(pickerValue));
      onOpenChange(false);
    } catch {
      // Parent's onSave is expected to surface its own error toast; keep the
      // editor open so the user can retry instead of silently losing the edit.
    } finally {
      setSaving(false);
    }
  };

  const current = pickerValue ? pickerValueToResidence(pickerValue) : null;
  const isSet = Boolean(current?.city);

  return (
    <ResponsiveEditor
      open={open}
      onOpenChange={onOpenChange}
      title="Edit My Residence"
      onSave={handleSave}
      saveLabel={saving ? "Saving…" : "Save Changes"}
      saveDisabled={!isSet || saving}
    >
      <div className="space-y-5 px-6 py-5">
        {/* ── State A: location already set — show it, offer to change ── */}
        {isSet && current ? (
          <div className="space-y-4">
            <div className="space-y-2.5 border-l-4 border-slate-200 pl-4">
              <p className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                <MapPin className="size-4 text-slate-500" aria-hidden="true" />
                Current public residence
              </p>
              <div className="space-y-0.5 min-w-0">
                <p className="text-lg font-semibold text-slate-900">{current.city}</p>
                {current.state && <p className="text-base text-slate-500">{current.state}</p>}
                <p className="text-base text-slate-500">{current.country}</p>
              </div>
            </div>
            <div className="space-y-2 pt-1">
              <p className="text-sm font-medium text-slate-700">Want to change this?</p>
              <LocationPicker
                value={pickerValue}
                onChange={setPickerValue}
                searchProvider="google"
                countryScope={["SG", "UK", "IN"]}
                trigger="link"
                triggerClassName={cn(
                  laButtonVariants({ intent: "primary-blue", size: "default" }),
                  "w-full justify-center no-underline hover:no-underline"
                )}
              />
            </div>
          </div>
        ) : (
          /* ── State B: no location — picker is the main action ── */
          <div className="space-y-3">
            <p className="text-sm text-slate-600">
              Start by picking your city, region, and country.
            </p>
            <LocationPicker
              value={pickerValue}
              onChange={setPickerValue}
              searchProvider="google"
              countryScope={["SG", "UK", "IN"]}
              trigger="link"
              placeholder="Search for your city..."
              triggerClassName={cn(
                laButtonVariants({ intent: "primary-blue", size: "default" }),
                "w-full justify-center no-underline hover:no-underline"
              )}
            />
            {primaryLocation && (
              <button
                type="button"
                onClick={usePrimary}
                className="flex w-full items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2.5 text-sm font-medium text-blue-800 transition hover:bg-blue-100"
              >
                <MapPin className="size-3.5 shrink-0" />
                Use my primary saved location ({primaryLocation.city})
              </button>
            )}
          </div>
        )}
      </div>
    </ResponsiveEditor>
  );
}