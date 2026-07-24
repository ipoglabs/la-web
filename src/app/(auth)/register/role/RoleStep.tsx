"use client";

/**
 * RoleStep — Step 4 · Role selection (final step of the journey)
 *
 * Per `md/feature-spec-doc/register-journey.md` (locked 2026-07-15):
 * Reuses the exact same full role picker as Profile — all 12 roles from
 * `config/roles.ts` + one free-text custom slot, multi-select up to
 * `MAX_ROLES_PER_ACCOUNT`, inline specialty field for specializable roles.
 * No condensed/lighter version, no separate "why are you here" intent
 * picker (that's a Profile-only concept, out of scope for Register).
 *
 * Deliberately placed AFTER Details (Full Name/DOB/Gender) — role picking
 * is the final, most "consultative" step, giving the user confidence in
 * the platform right before landing.
 *
 * Role selection is required-but-never-blocking: picking nothing simply
 * means the account defaults to the implicit `BASE_ROLE` ("Individual"),
 * exactly like Profile's existing behaviour — so Continue is never disabled
 * here.
 *
 * Both Skip and Continue call the real completion route,
 * `POST /api/auth/complete-profile` (see `md/api-contracts/auth-register.md`
 * and that route's file header) — this is where the mock account actually
 * gets "created" server-side, with the full { fullName, gender,
 * dateOfBirthIso, roleIds, specialties, customRole } payload. A failed call
 * (network/validation) surfaces a toast and keeps the user on this step
 * rather than silently advancing.
 *
 * No dedicated Success/Welcome screen (removed 2026-07-15 per Gopi) — a
 * confirmation toast + redirect straight to `?redirect=` (mirrors login's
 * pattern) or `/` is the entire post-signup experience, no extra step.
 */

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Lock, Plus, XIcon } from "lucide-react";
import { LaButton, LaCard, LaInput } from "@/components/la";
import { cn } from "@/lib/utils";
import { isMeaningfulText } from "@/lib/validation";
import { useOnboardingStore } from "@/lib/stores/onboardingStore";
import {
  ROLES,
  BASE_ROLE,
  MAX_ROLES_PER_ACCOUNT,
  CUSTOM_ROLE_MIN_LENGTH,
  CUSTOM_ROLE_MAX_LENGTH,
  SPECIALTY_MAX_LENGTH,
  SHORT_DESCRIPTIONS,
  getRoleLabel,
  getShortRoleLabel,
  type RoleId,
} from "@/config/roles";

function formatRoleBadge(id: RoleId, specialties: Partial<Record<RoleId, string>>) {
  const specialty = specialties[id]?.trim();
  return specialty && isMeaningfulText(specialty)
    ? `${getShortRoleLabel(id)} · ${specialty}`
    : getShortRoleLabel(id);
}

export function RoleStep() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const method = useOnboardingStore((s) => s.method);
  const identifier = useOnboardingStore((s) => s.identifier);
  const verified = useOnboardingStore((s) => s.verified);
  const proof = useOnboardingStore((s) => s.proof);
  const fullName = useOnboardingStore((s) => s.fullName);
  const gender = useOnboardingStore((s) => s.gender);
  const dateOfBirthIso = useOnboardingStore((s) => s.dateOfBirthIso);
  const storeRoleIds = useOnboardingStore((s) => s.roleIds);
  const storeSpecialties = useOnboardingStore((s) => s.specialties);
  const storeCustomRole = useOnboardingStore((s) => s.customRole);
  const setRoles = useOnboardingStore((s) => s.setRoles);
  const reset = useOnboardingStore((s) => s.reset);

  // Hydrate from the store (not just empty defaults) — matches DetailsStep's
  // pattern, so navigating back here (e.g. via browser back button) shows
  // prior picks instead of silently discarding them.
  const [roleIds, setRoleIds] = useState<RoleId[]>(storeRoleIds);
  const [specialties, setSpecialties] = useState<Partial<Record<RoleId, string>>>(storeSpecialties);
  const [customRole, setCustomRole] = useState<string | null>(storeCustomRole);
  const [customInput, setCustomInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Guard: no method chosen yet, verification-required method not yet
  // verified, or Details (Full Name/DOB/Gender) not completed yet.
  // NOTE: this route is entered two ways — (1) the normal Register journey,
  // or (2) Login's no-match convergence hand-off, same as DetailsStep above.
  // The guard logic below is identical either way — it only checks
  // `onboardingStore` state, never which journey called it.
  useEffect(() => {
    if (!method) {
      router.replace("/register");
      return;
    }
    const needsVerify = method === "phone_otp" || method === "magic_link";
    if (needsVerify && !verified) {
      router.replace("/register/verify");
      return;
    }
    if (!dateOfBirthIso) {
      router.replace("/register/details");
    }
  }, [method, verified, dateOfBirthIso, router]);

  if (!method) return null;
  if ((method === "phone_otp" || method === "magic_link") && !verified) return null;
  if (!dateOfBirthIso) return null;

  const additionalCount = roleIds.length + (customRole ? 1 : 0);
  const atCap = additionalCount >= MAX_ROLES_PER_ACCOUNT;

  const toggleRole = (id: RoleId) => {
    setRoleIds((prev) => {
      if (prev.includes(id)) {
        setSpecialties((s) => {
          const next = { ...s };
          delete next[id];
          return next;
        });
        return prev.filter((r) => r !== id);
      }
      if (additionalCount >= MAX_ROLES_PER_ACCOUNT) {
        toast.info(`You can select up to ${MAX_ROLES_PER_ACCOUNT} additional roles.`);
        return prev;
      }
      return [...prev, id];
    });
  };

  const handleAddCustom = () => {
    const trimmed = customInput.trim();
    if (!isMeaningfulText(trimmed) || trimmed.length < CUSTOM_ROLE_MIN_LENGTH) {
      toast.info(`Enter at least ${CUSTOM_ROLE_MIN_LENGTH} characters.`);
      return;
    }
    if (trimmed.length > CUSTOM_ROLE_MAX_LENGTH) {
      toast.info(`Keep it under ${CUSTOM_ROLE_MAX_LENGTH} characters.`);
      return;
    }
    const isDuplicate = ROLES.some((r) => r.label.toLowerCase() === trimmed.toLowerCase());
    if (isDuplicate) {
      toast.info("That role is already in the list above — select it instead.");
      return;
    }
    if (additionalCount >= MAX_ROLES_PER_ACCOUNT) {
      toast.info(`You can select up to ${MAX_ROLES_PER_ACCOUNT} additional roles.`);
      return;
    }
    setCustomRole(trimmed);
    setCustomInput("");
  };

  /** Shared by both Skip and Continue — calls the real completion route
   *  (see md/api-contracts/auth-register.md) instead of only updating
   *  client-only state, then shows a confirmation toast and redirects —
   *  no dedicated Success screen (removed 2026-07-15 per Gopi). Redirects
   *  to `?redirect=` when present (mirrors login's `?redirect=/post`
   *  pattern, e.g. arriving here mid-checkout) or `/` otherwise. */
  async function submitAndAdvance(
    finalRoleIds: RoleId[],
    finalSpecialties: Partial<Record<RoleId, string>>,
    finalCustomRole: string | null
  ) {
    if (submitting || !gender) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/complete-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method,
          identifier,
          proof,
          fullName,
          gender,
          dateOfBirthIso,
          roleIds: finalRoleIds,
          specialties: finalSpecialties,
          customRole: finalCustomRole,
        }),
      });
      if (!res.ok) throw new Error(`complete-profile failed (${res.status})`);
      setRoles(finalRoleIds, finalSpecialties, finalCustomRole);
      const firstName = fullName.trim().split(/\s+/)[0] || "there";
      toast.success(`Welcome, ${firstName}! Your account is ready.`);
      reset();
      router.push(searchParams.get("redirect") || "/");
      // router.push() alone does not re-run the root layout Server Component,
      // so AppHeader's server-seeded `user` prop would stay stale (logged
      // out) even though complete-profile already set the session cookie —
      // force it to re-fetch getSession() (mirrors auth/google-success/page.tsx).
      router.refresh();
    } catch {
      toast.error("Couldn't finish setting up your account. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleSkip() {
    submitAndAdvance([], {}, null);
  }

  function handleContinue() {
    const cleanSpecialties: Partial<Record<RoleId, string>> = {};
    for (const [id, val] of Object.entries(specialties)) {
      const trimmed = val?.trim();
      if (trimmed && isMeaningfulText(trimmed)) cleanSpecialties[id as RoleId] = trimmed;
    }
    submitAndAdvance(roleIds, cleanSpecialties, customRole);
  }

  return (
    <div className="w-full flex items-center justify-center bg-[#e9eef4] px-4 pt-4 pb-8 sm:py-8">
      <LaCard className="w-full max-w-xs sm:max-w-2xl lg:max-w-3xl rounded-2xl p-4 sm:p-6 flex flex-col gap-4">
        {/* Heading */}
        <div className="flex flex-col gap-1 text-center">
          <span className="inline-flex self-center items-center rounded-full bg-blue-600 px-3 py-1 text-sm font-semibold text-white">
            Last step
          </span>
          <h1 className="text-2xl font-bold text-slate-800">How will you use LokalAds?</h1>
          <p className="text-sm text-slate-600">Optional — pick any that apply.</p>
        </div>

        {/* Live "review" strip */}
        {(roleIds.length > 0 || customRole) && (
          <div className="rounded-xl border border-blue-200 bg-blue-50 px-3.5 py-2.5">
            <div className="flex flex-wrap gap-1.5">
              {roleIds.map((id) => (
                <span
                  key={id}
                  className="inline-flex items-center gap-1 rounded-full bg-blue-600 py-1 pl-3 pr-1.5 text-sm font-semibold text-white"
                >
                  {formatRoleBadge(id, specialties)}
                  <button
                    type="button"
                    onClick={() => toggleRole(id)}
                    aria-label={`Remove ${getRoleLabel(id)}`}
                    className="rounded-full p-0.5 hover:bg-blue-700"
                  >
                    <XIcon className="size-3.5" />
                  </button>
                </span>
              ))}
              {customRole && (
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-600 py-1 pl-3 pr-1.5 text-sm font-semibold text-white">
                  {customRole}
                  <button
                    type="button"
                    onClick={() => setCustomRole(null)}
                    aria-label={`Remove ${customRole}`}
                    className="rounded-full p-0.5 hover:bg-blue-700"
                  >
                    <XIcon className="size-3.5" />
                  </button>
                </span>
              )}
            </div>
            <p className="mt-2 text-sm font-medium text-blue-700">
              {additionalCount} of {MAX_ROLES_PER_ACCOUNT} additional roles
            </p>
          </div>
        )}

        {/* Role selector — same bordered-card treatment as Profile's
            RolesEditor, but laid out as a CSS multi-column masonry list on
            tablet/desktop (2 columns sm, 3 columns lg) instead of Profile's
            fixed single column — this step's card is wider, so a single
            column would waste the horizontal space and force a lot of
            scrolling through 12+ cards. `break-inside-avoid` keeps each card
            intact (never split across columns) and columns pack tightly by
            each card's own height instead of being forced into equal grid
            row heights. Stays single-column on mobile. Individual is shown
            as the active default (Lock icon, non-toggleable) only while no
            explicit role is picked — it disappears the moment any role or a
            custom one is added, exactly like Profile's BASE_ROLE badge
            behaviour. */}
        <div>
          <div className="columns-1 sm:columns-3 gap-2.5">
            {/* Individual — implicit base role, hidden once an explicit role is picked */}
            {roleIds.length === 0 && !customRole && (
              <div
                title="Every account starts here — you can't turn this off"
                className="mb-2.5 break-inside-avoid rounded-xl border-[1.5px] border-blue-500 bg-blue-50 px-3.5 py-2.5"
              >
                <p className="flex items-center gap-1.5 text-sm font-semibold text-blue-900">
                  <Lock className="size-3.5 shrink-0" />
                  {BASE_ROLE.label}
                </p>
                <p className="mt-0.5 text-sm text-blue-700">Default for every account</p>
              </div>
            )}

            {ROLES.map((role) => {
              const id = role.id as RoleId;
              const selected = roleIds.includes(id);
              const disabled = !selected && atCap;
              return (
                <div
                  key={role.id}
                  className={cn(
                    "mb-2.5 break-inside-avoid rounded-xl border-[1.5px] transition-colors",
                    selected
                      ? "border-blue-500 bg-blue-50"
                      : disabled
                        ? "border-slate-200 bg-slate-50 opacity-60"
                        : "border-slate-300 bg-white hover:border-slate-400"
                  )}
                >
                  <button
                    type="button"
                    aria-pressed={selected}
                    disabled={disabled}
                    onClick={() => toggleRole(id)}
                    className="w-full px-3.5 py-2.5 text-left"
                  >
                    <p className={cn("text-sm font-semibold", selected ? "text-blue-700" : "text-slate-800")}>
                      {getShortRoleLabel(id)}
                    </p>
                    <p className="mt-0.5 text-sm text-slate-500">{SHORT_DESCRIPTIONS[id] ?? role.description}</p>
                  </button>
                  {selected && role.specializable && (
                    <div className="border-t border-blue-200 px-3.5 py-2.5">
                      <p className="mb-1.5 text-sm font-medium text-slate-700">What&apos;s your specialty?</p>
                      <LaInput
                        value={specialties[id] ?? ""}
                        onChange={(e) =>
                          setSpecialties((prev) => ({
                            ...prev,
                            [id]: e.target.value.slice(0, SPECIALTY_MAX_LENGTH),
                          }))
                        }
                        placeholder={role.specialtyPlaceholder}
                        maxLength={SPECIALTY_MAX_LENGTH}
                        className="bg-white"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Custom role — full width beneath the list */}
          <div className="mt-3 flex gap-2">
            <LaInput
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Say it in your own words"
              maxLength={CUSTOM_ROLE_MAX_LENGTH}
              disabled={Boolean(customRole) || (atCap && !customRole)}
            />
            <LaButton
              type="button"
              intent="outline"
              onClick={handleAddCustom}
              disabled={Boolean(customRole) || (atCap && !customRole)}
              className="shrink-0"
            >
              <Plus className="size-4" />
            </LaButton>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <LaButton
            type="button"
            intent="primary-blue"
            size="default"
            className="flex-1 sm:flex-none sm:px-8"
            disabled={submitting}
            onClick={handleSkip}
          >
            Skip & Continue
          </LaButton>
          <LaButton
            intent="primary"
            size="default"
            className="flex-1 sm:flex-none sm:px-8"
            disabled={submitting}
            onClick={handleContinue}
          >
            {submitting ? "Finishing…" : "Continue"}
          </LaButton>
        </div>
    </LaCard>
    </div>
  );
}
