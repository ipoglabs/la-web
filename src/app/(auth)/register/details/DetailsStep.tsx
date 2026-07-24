"use client";

/**
 * DetailsStep — Step 3 · Review & complete Full Name, DOB, Gender
 *
 * Per `md/feature-spec-doc/register-journey.md` (locked 2026-07-15):
 * Full Name, DOB, Gender are mandatory for every account regardless of
 * signup method. Google/Apple pre-fill Full Name (via registerStore's
 * `markAccountCreated(prefillFullName)`) — the user can still edit it here.
 * Magic Link / Phone OTP have no name from the provider, so this field
 * starts empty for those methods. DOB enforces the same 18+ age gate used
 * on Profile (`isAgeValid`) — no exceptions for any signup method.
 *
 * Security-model note: by the time this step is reached, identity has
 * already been proven and the account is already (silently) created — see
 * `registerStore.ts` header. This step only completes the profile, it
 * does not gate account/session existence.
 *
 * TODO (API):
 *  - PATCH /api/users/me { fullName, gender, dateOfBirthIso } once a real
 *    user id exists (see registerStore TODO)
 */

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LaButton, LaCard, LaInput, LaRadio } from "@/components/la";
import { DateInput } from "@/components/date-input";
import { isAgeValid, isValidFullName, sanitizeFullNameInput } from "@/lib/validation";
import { useOnboardingStore } from "@/lib/stores/onboardingStore";
import { withRedirectParam } from "@/lib/utils";

export function DetailsStep() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect");
  const method = useOnboardingStore((s) => s.method);
  const verified = useOnboardingStore((s) => s.verified);
  const accountCreated = useOnboardingStore((s) => s.accountCreated);
  const storeFullName = useOnboardingStore((s) => s.fullName);
  const storeGender = useOnboardingStore((s) => s.gender);
  const storeDob = useOnboardingStore((s) => s.dateOfBirthIso);
  const setDetails = useOnboardingStore((s) => s.setDetails);

  const [fullName, setFullName] = useState(storeFullName);
  const [nameTouched, setNameTouched] = useState(false);
  const [gender, setGender] = useState<"Male" | "Female" | "Prefer not to say" | null>(storeGender);
  const [dateOfBirthIso, setDateOfBirthIso] = useState(storeDob);

  // Guard: must have chosen a method, and if it needs verification, must be verified.
  // NOTE: this route is entered two ways — (1) the normal Register journey,
  // or (2) Login's no-match convergence hand-off (Google/Apple/Magic-Link/
  // Phone-OTP identity proven but no existing account found — see
  // `md/feature-spec-doc/login-journey.md` Architecture). The guard logic
  // below is identical either way — it only checks `onboardingStore` state,
  // never which journey called it. This is intentional, not a bug.
  useEffect(() => {
    if (!method || !accountCreated) {
      router.replace("/register");
      return;
    }
    const needsVerify = method === "phone_otp" || method === "magic_link";
    if (needsVerify && !verified) {
      router.replace("/register/verify");
    }
  }, [method, verified, accountCreated, router]);

  if (!method || !accountCreated) return null;
  if ((method === "phone_otp" || method === "magic_link") && !verified) return null;

  const trimmedName = fullName.trim();
  const nameError =
    trimmedName.length === 0 ? "Full name is required" :
    trimmedName.length < 2 ? "Enter at least 2 characters" :
    trimmedName.length > 60 ? "Keep it under 60 characters" :
    !isValidFullName(trimmedName) ? "Enter a valid name" :
    null;

  const isDobComplete = !!dateOfBirthIso;
  const isAdult = isDobComplete && isAgeValid(dateOfBirthIso, 18);
  const dobError = isDobComplete && !isAdult ? "You must be at least 18 years old" : undefined;

  const canContinue = !nameError && isDobComplete && isAdult && gender !== null;

  function handleContinue() {
    setNameTouched(true);
    if (!canContinue || gender === null) return;
    setDetails(trimmedName, gender, dateOfBirthIso);
    router.push(withRedirectParam("/register/role", redirectParam));
  }

  return (
    <div className="w-full flex items-center justify-center bg-[#e9eef4] px-4 py-8">
      <LaCard className="w-full max-w-xs rounded-2xl p-6 flex flex-col gap-4">
        {/* Heading */}
        <div className="flex flex-col gap-1 text-center">
          <h1 className="text-2xl font-bold text-slate-800">Tell us a bit about you</h1>
          <p className="text-sm text-slate-600">
            {storeFullName
              ? "We've pre-filled what your provider gave us — feel free to edit."
              : "This helps us keep your account secure and personal."}
          </p>
        </div>

        {/* Full Name */}
        <div className="space-y-1.5">
          <p className="text-sm font-medium text-slate-700">Full Name</p>
          <LaInput
            value={fullName}
            onChange={(e) => setFullName(sanitizeFullNameInput(e.target.value).slice(0, 60))}
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

        {/* Date of Birth */}
        <div className="space-y-1.5">
          <p className="text-sm font-medium text-slate-700">Date of Birth</p>
          <DateInput
            value={dateOfBirthIso}
            onChange={(iso) => setDateOfBirthIso(iso ?? "")}
            inputFormat="DMY"
            blurDisplay="long"
            error={dobError}
          />
        </div>

        {/* Gender */}
        <div className="space-y-1.5">
          <p className="text-sm font-medium text-slate-700">Gender</p>
          <fieldset aria-label="Gender" className="flex flex-wrap gap-5">
            {((["Male", "Female", "Prefer not to say"] as const)).map((g) => (
              <LaRadio
                key={g}
                name="gender"
                value={g}
                label={g}
                checked={gender === g}
                onChange={() => setGender(g)}
              />
            ))}
          </fieldset>
        </div>

        <LaButton intent="primary" size="default" className="w-full" onClick={handleContinue}>
          Continue
        </LaButton>
    </LaCard>
    </div>
  );
}
