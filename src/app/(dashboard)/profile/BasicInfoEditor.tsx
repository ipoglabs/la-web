"use client";

/**
 * BasicInfoEditor — full name / date of birth / gender editor.
 * Split out of page.tsx (Golden Rule file-size split, 2026-07-14).
 *
 * Exports formatDobLabel + getInitials since ProfilePage's identity card and
 * Basic Info section both render them directly, not just this editor.
 */

import { useEffect, useState } from "react";
import { LaInput, LaRadio } from "@/components/la";
import {
  isAgeValid,
  isValidFullName,
  sanitizeFullNameInput,
} from "@/lib/validation";
import { DateInput } from "@/components/date-input";
import { ResponsiveEditor } from "./ResponsiveEditor";
import type { BasicInfoValues } from "./types";

export function formatDobLabel(iso: string): string {
  if (!iso) return "—";
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/** First letter of the first two words in a name, e.g. "Gopinath Krishnamoorthi" → "GK". */
export function getInitials(fullName: string): string {
  const words = fullName.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  const first = words[0]!.charAt(0);
  const second = words.length > 1 ? words[1]!.charAt(0) : "";
  return (first + second).toUpperCase();
}

export function BasicInfoEditor({
  open,
  onOpenChange,
  value,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: BasicInfoValues;
  onSave: (next: BasicInfoValues) => void;
}) {
  const [draft, setDraft] = useState<BasicInfoValues>(value);
  const [nameTouched, setNameTouched] = useState(false);

  useEffect(() => {
    if (open) {
      setDraft(value);
      setNameTouched(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // ── Validation ──────────────────────────────────────────────────────────
  const trimmedName = draft.fullName.trim();
  const nameError =
    trimmedName.length === 0 ? "Full name is required" :
    trimmedName.length < 2 ? "Enter at least 2 characters" :
    trimmedName.length > 60 ? "Keep it under 60 characters" :
    !isValidFullName(trimmedName) ? "Enter a valid name" :
    null;

  const isDobComplete = !!draft.dateOfBirthIso;
  const isAdult = isDobComplete && isAgeValid(draft.dateOfBirthIso, 18);
  const dobError = isDobComplete && !isAdult ? "You must be at least 18 years old" : undefined;

  const canSave = !nameError && isDobComplete && isAdult;

  const handleSave = () => {
    if (!canSave) return;
    // TODO [INTEGRATION]: PATCH /api/users/me
    //   body: { fullName: trimmedName, dateOfBirthIso: draft.dateOfBirthIso, gender: draft.gender }
    //   Server must re-validate (never trust client input) — see md/architecture/api/08-profile-api-contract.md
    onSave({ ...draft, fullName: trimmedName });
    onOpenChange(false);
  };

  return (
    <ResponsiveEditor
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Basic Info"
      onSave={handleSave}
      saveDisabled={!canSave}
    >
      <div className="space-y-5 px-6 py-5">
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-700">Full Name</p>
          <LaInput
            value={draft.fullName}
            onChange={(e) =>
              setDraft((prev) => ({
                ...prev,
                fullName: sanitizeFullNameInput(e.target.value).slice(0, 60),
              }))
            }
            onBlur={() => setNameTouched(true)}
            placeholder="Enter your full name"
            maxLength={60}
            status={nameTouched && nameError ? "error" : "default"}
          />
          {nameTouched && nameError && (
            <p role="alert" className="text-sm font-medium text-red-600">
              {nameError}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-700">Date of Birth</p>
          <DateInput
            value={draft.dateOfBirthIso}
            onChange={(iso) => setDraft((prev) => ({ ...prev, dateOfBirthIso: iso ?? "" }))}
            inputClassName="h-10 rounded-md border-[1.5px] border-slate-300 bg-white"
            error={dobError}
          />
        </div>

        <div className="space-y-2.5">
          <p className="text-sm font-medium text-slate-700">Gender</p>
          <div className="flex flex-wrap gap-5">
            {(["Male", "Female", "Prefer not to say"] as const).map((g) => (
              <LaRadio
                key={g}
                name="basic-info-gender"
                value={g}
                label={g}
                checked={draft.gender === g}
                onChange={() => setDraft((prev) => ({ ...prev, gender: g }))}
              />
            ))}
          </div>
        </div>
      </div>
    </ResponsiveEditor>
  );
}
