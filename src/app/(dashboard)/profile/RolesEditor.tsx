"use client";

/**
 * RolesEditor — account-level "Roles" editor (Buyer/Seller/Landlord/Agent
 * etc. hats worn in addition to the implicit BASE_ROLE "Individual"), plus
 * a private "why are you here" intent and one optional free-text custom
 * role. Split out of page.tsx (Golden Rule file-size split, 2026-07-14).
 *
 * Exports formatRoleBadge + RolesValue since ProfilePage's identity card and
 * Roles section both render badges directly, not just this editor.
 */

import { useEffect, useState } from "react";
import { Lock, Plus, XIcon } from "lucide-react";
import { toast } from "sonner";
import { LaButton, LaInput } from "@/components/la";
import { isMeaningfulText, sanitizeFreeTextInput } from "@/lib/validation";
import { cn } from "@/lib/utils";
import { ResponsiveEditor } from "./ResponsiveEditor";
import {
  ROLES,
  BASE_ROLE,
  MAX_ROLES_PER_ACCOUNT,
  CUSTOM_ROLE_MIN_LENGTH,
  CUSTOM_ROLE_MAX_LENGTH,
  SPECIALTY_MAX_LENGTH,
  INTENT_OPTIONS,
  getRoleLabel,
  type RoleId,
  type IntentId,
} from "@/config/roles";

/** Shape saved by RolesEditor: an optional private intent, canonical role ids
 * the user picked, an optional specialty per specializable role id, and one
 * optional free-text "say it in your own words" custom role. The implicit
 * `BASE_ROLE` (Individual) is never part of this shape — it's not a choice,
 * it's always true, and it only renders publicly when no explicit roles exist. */
export interface RolesValue {
  /** Required — always set, defaults to "both" (the only option that's never wrong for a new account). */
  intent: IntentId;
  roleIds: RoleId[];
  specialties: Partial<Record<RoleId, string>>;
  customRole: string | null;
}

/** Role label, suffixed with its specialty when one is set (e.g. "Skilled Worker / Tradesperson · Plumber"). Ignores a specialty that's just punctuation/whitespace once sanitized — e.g. a lone "-" never shows up. */
export function formatRoleBadge(id: RoleId, specialties: Partial<Record<RoleId, string>>) {
  const specialty = specialties[id]?.trim();
  return specialty && isMeaningfulText(specialty) ? `${getRoleLabel(id)} · ${specialty}` : getRoleLabel(id);
}

export function RolesEditor({
  open,
  onOpenChange,
  value,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: RolesValue;
  onSave: (next: RolesValue) => void;
}) {
  const [draftIntent, setDraftIntent] = useState<IntentId>(value.intent);
  const [draftRoleIds, setDraftRoleIds] = useState<RoleId[]>(value.roleIds);
  const [draftSpecialties, setDraftSpecialties] = useState<Partial<Record<RoleId, string>>>(
    value.specialties
  );
  const [draftCustomRole, setDraftCustomRole] = useState<string | null>(value.customRole);
  const [customInput, setCustomInput] = useState("");

  useEffect(() => {
    if (open) {
      setDraftIntent(value.intent);
      setDraftRoleIds(value.roleIds);
      setDraftSpecialties(value.specialties);
      setDraftCustomRole(value.customRole);
      setCustomInput("");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const additionalCount = draftRoleIds.length + (draftCustomRole ? 1 : 0);
  const atCap = additionalCount >= MAX_ROLES_PER_ACCOUNT;

  const toggleRole = (id: RoleId) => {
    setDraftRoleIds((prev) => {
      if (prev.includes(id)) {
        setDraftSpecialties((specialties) => {
          const next = { ...specialties };
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
    setDraftCustomRole(trimmed);
    setCustomInput("");
  };

  const handleSave = () => {
    // Drop any specialty that's empty or just punctuation/whitespace once
    // sanitized (e.g. a lone "-") — never persist garbage, even though the
    // display layer already guards against showing it.
    const cleanSpecialties: Partial<Record<RoleId, string>> = {};
    for (const [id, value] of Object.entries(draftSpecialties)) {
      const trimmed = value?.trim();
      if (trimmed && isMeaningfulText(trimmed)) cleanSpecialties[id as RoleId] = trimmed;
    }
    // TODO [INTEGRATION]: PATCH /api/users/me { intent, roleIds, specialties, customRole }
    onSave({
      intent: draftIntent,
      roleIds: draftRoleIds,
      specialties: cleanSpecialties,
      customRole: draftCustomRole,
    });
    onOpenChange(false);
  };

  return (
    <ResponsiveEditor
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Your Roles"
      onSave={handleSave}
    >
      <div className="space-y-4 px-6 py-5">

        {/* Private intent — deliberately styled neutral/slate, never blue like the
            public hat badges below, so it visually reads as "context for us", not
            "credential shown to others". */}
        <div>
          <p className="mb-2 text-sm font-semibold text-slate-700">Why are you here?</p>
          <div className="flex flex-wrap gap-2">
            {INTENT_OPTIONS.map((opt) => {
              const selected = draftIntent === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setDraftIntent(opt.id)}
                  className={cn(
                    "rounded-full border-[1.5px] px-3.5 py-1.5 text-sm font-semibold transition-colors",
                    selected
                      ? "border-slate-700 bg-slate-700 text-white"
                      : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
                  )}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
          <p className="mt-1.5 flex items-center gap-1 text-sm text-slate-500">
            <Lock className="size-3.5" />
            Private — helps us personalize your experience, never shown on your profile
          </p>
        </div>

        {/* Live "review" strip — updates as you tap, doubles as the review step */}
        {(draftRoleIds.length > 0 || draftCustomRole) && (
          <div className="rounded-xl border border-blue-200 bg-blue-50 px-3.5 py-3">
            <div className="flex flex-wrap gap-1.5">
              {draftRoleIds.map((id) => (
                <span
                  key={id}
                  className="inline-flex items-center gap-1 rounded-full bg-blue-600 py-1 pl-3 pr-1.5 text-sm font-semibold text-white"
                >
                  {formatRoleBadge(id, draftSpecialties)}
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
              {draftCustomRole && (
                <span className="inline-flex items-center gap-1 rounded-full border-2 border-dashed border-blue-600 bg-white py-1 pl-3 pr-1.5 text-sm font-semibold text-blue-700">
                  {draftCustomRole}
                  <button
                    type="button"
                    onClick={() => setDraftCustomRole(null)}
                    aria-label={`Remove ${draftCustomRole}`}
                    className="rounded-full p-0.5 hover:bg-blue-100"
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

        <div>
          <p className="mb-2 text-sm font-semibold text-slate-700">
            Add the hats you wear publicly
          </p>
          <p className="mb-3 text-sm text-slate-500">
            If you leave this empty, your profile will simply show {BASE_ROLE.label}.
          </p>
          <div className="flex flex-col gap-2">
            {ROLES.map((role) => {
              const id = role.id as RoleId;
              const selected = draftRoleIds.includes(id);
              const disabled = !selected && atCap;
              return (
                <div
                  key={role.id}
                  className={cn(
                    "rounded-xl border-[1.5px] transition-colors",
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
                    <p
                      className={cn(
                        "text-sm font-semibold",
                        selected ? "text-blue-700" : "text-slate-800"
                      )}
                    >
                      {role.label}
                    </p>
                    <p className="mt-0.5 text-sm text-slate-500">{role.description}</p>
                  </button>
                  {/* Inline specialty — surfaced immediately under the role that needs
                      it, so it's impossible to miss (unlike the unrelated free-text box
                      further down, which is only for roles not in this list at all). */}
                  {selected && role.specializable && (
                    <div className="border-t border-blue-200 px-3.5 py-2.5">
                      <p className="mb-1.5 text-sm font-medium text-slate-700">
                        What&apos;s your specialty?
                      </p>
                      <LaInput
                        value={draftSpecialties[id] ?? ""}
                        onChange={(e) => {
                          const clean = sanitizeFreeTextInput(e.target.value).slice(
                            0,
                            SPECIALTY_MAX_LENGTH
                          );
                          setDraftSpecialties((prev) => ({ ...prev, [id]: clean }));
                        }}
                        placeholder={role.specialtyPlaceholder ?? "Add your specialty"}
                        maxLength={SPECIALTY_MAX_LENGTH}
                        className="bg-white"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold text-slate-700">
            Don&apos;t see your exact role? Say it in your own words
          </p>
          {draftCustomRole ? (
            <p className="text-sm text-slate-500">
              Remove &ldquo;{draftCustomRole}&rdquo; above to add a different one.
            </p>
          ) : (
            <div className="flex gap-2">
              <LaInput
                value={customInput}
                onChange={(e) =>
                  setCustomInput(sanitizeFreeTextInput(e.target.value).slice(0, CUSTOM_ROLE_MAX_LENGTH))
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddCustom();
                  }
                }}
                placeholder="e.g. Egg Farm Owner, Wedding Photographer"
                maxLength={CUSTOM_ROLE_MAX_LENGTH}
                disabled={atCap}
                className="flex-1"
              />
              <LaButton
                type="button"
                intent="secondary"
                size="compact"
                onClick={handleAddCustom}
                disabled={atCap || customInput.trim().length === 0}
              >
                <Plus className="size-3.5" />
                Add
              </LaButton>
            </div>
          )}
        </div>
      </div>
    </ResponsiveEditor>
  );
}
