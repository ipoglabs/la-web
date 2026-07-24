"use client";

/**
 * /profile — Private Profile dashboard page
 *
 * AUTH GUARD (add when real auth ships):
 *   Convert the default export to an async Server Component:
 *     const session = await getSession();
 *     if (!session) redirect("/login?redirect=/profile");
 *     return <ProfileClient user={session.user} />;
 *
 *   Until then, this renders with mock data so the full UX can be validated in POC.
 *
 * File-size note (Golden Rule, 2026-07-14): this route file was ~2,390
 * lines — every self-contained editor/section component has been split
 * into co-located sibling files (see imports below). This file now owns
 * only state, handlers, and JSX composition for the page itself.
 */

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  ShieldAlert,
  Trash2,
  Loader2,
  Plus,
  AlertCircle,
  Lock,
  Star,
  Mail,
  Phone,
  Eye,
  EyeOff,
  ShieldCheck,
  Monitor,
  LogOut,
} from "lucide-react";
import { toast } from "sonner";
import { useDeleteAccountStore } from "@/lib/stores/deleteAccountStore";
import { Avatar } from "@/components/avatar/Avatar";
import { LaBadge, LaButton, LaCard, LaSwitch } from "@/components/la";
import { AddPhoneEditor } from "./AddPhoneEditor";
import { ChangeEmailEditor } from "./ChangeEmailEditor";
import { updateProfile } from "@/app/actions/updateProfile";
import { updateContact } from "@/app/actions/profile/updateContact";
import { updateLocation } from "@/app/actions/profile/updateLocation";
import { cn } from "@/lib/utils";
import { isStageFeatureEnabled } from "@/config";
import {
  BASE_ROLE,
  DEFAULT_INTENT,
  getIntentLabel,
  type RoleId,
  type IntentId,
} from "@/config/roles";
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

import type {
  BasicInfoValues,
  DeviceSession,
  ContactValues,
  ProfileUser,
  ResidenceValues,
  SavedLocation,
} from "./types";
import { Section, InfoRow, ContactRow, SettingsRow } from "./layout-atoms";
import { HandleEditor } from "./HandleEditor";
import { BasicInfoEditor, formatDobLabel, getInitials } from "./BasicInfoEditor";
import { RolesEditor, formatRoleBadge } from "./RolesEditor";
import { ResidenceEditor } from "./ResidenceEditor";
import { SavedLocationSection } from "./SavedLocationSection";
import { ChangePasswordEditor } from "./ChangePasswordEditor";
import {
  NotificationsEditor,
  NOTIFICATION_PREF_KEYS,
  type NotificationPrefs,
} from "./NotificationsEditor";
import { TwoFactorAuthEditor } from "./TwoFactorAuthEditor";

/**
 * The User model stores phones as 3 flat fields (primaryNumber,
 * secondaryNumber1, secondaryNumber2) — the UI works with a phones[] array.
 * These two helpers convert between the two shapes. `visibleToBuyers` has no
 * DB column yet, so it's UI-only state (resets to false on reload).
 */
function buildPhonesFromUser(user: ProfileUser): PhoneEntryList {
  const entries: { id: string; number: string; primary: boolean }[] = [];
  if (user.primaryNumber) entries.push({ id: "primary", number: user.primaryNumber, primary: true });
  if (user.secondaryNumber1) entries.push({ id: "secondary1", number: user.secondaryNumber1, primary: false });
  if (user.secondaryNumber2) entries.push({ id: "secondary2", number: user.secondaryNumber2, primary: false });
  return entries.map((e) => ({ ...e, visibleToBuyers: false }));
}
type PhoneEntryList = { id: string; number: string; primary: boolean; visibleToBuyers: boolean }[];

/** Maps a phones[] id ("primary" | "secondary1" | "secondary2") to the User schema field it persists to. */
function phoneIdToField(id: string): "primaryNumber" | "secondaryNumber1" | "secondaryNumber2" {
  if (id === "primary") return "primaryNumber";
  if (id === "secondary1") return "secondaryNumber1";
  return "secondaryNumber2";
}

/** Picks the next free schema slot for a newly-added phone number. */
function nextFreePhoneId(existing: PhoneEntryList): string {
  if (!existing.some((p) => p.id === "primary")) return "primary";
  if (!existing.some((p) => p.id === "secondary1")) return "secondary1";
  return "secondary2";
}

function buildDisplayedRoleBadges(
  roleIds: RoleId[],
  specialties: Partial<Record<RoleId, string>>,
  customRole: string | null,
) {
  const explicitRoles = [
    ...roleIds.map((id) => formatRoleBadge(id, specialties)),
    ...(customRole ? [customRole] : []),
  ];

  return explicitRoles.length > 0 ? explicitRoles : [BASE_ROLE.label];
}

export type ProfilePageMode = "profile" | "account-settings";

export function ProfilePageScreen({
  mode = "profile",
  user,
}: {
  mode?: ProfilePageMode;
  user: ProfileUser;
}) {
  const router = useRouter();
  const {
    checkEligibility,
    isLoading: deleteLoading,
    error: deleteError,
    reset: resetDelete,
  } = useDeleteAccountStore();

  // Editor visibility
  const [handleEditorOpen, setHandleEditorOpen] = useState(false);
  const [basicInfoEditorOpen, setBasicInfoEditorOpen] = useState(false);
  const [rolesEditorOpen, setRolesEditorOpen] = useState(false);
  const [residenceEditorOpen, setResidenceEditorOpen] = useState(false);
  const [phoneEditorOpen, setPhoneEditorOpen] = useState(false);
  const [changeEmailEditorOpen, setChangeEmailEditorOpen] = useState(false);
  const [phoneEditorId, setPhoneEditorId] = useState<string | null>(null);
  const [addPhoneEditorOpen, setAddPhoneEditorOpen] = useState(false);
  const [phonePendingDelete, setPhonePendingDelete] = useState<string | null>(null);
  const MAX_PHONES = 3;

  // Devices (Login and Security) — one row per signed-in session, backed by
  // the real Session collection (see models/session.ts). A single email/
  // phone identity can be signed in on several devices at once; each is
  // individually revocable, or all-but-current in one action.
  const [devices, setDevices] = useState<DeviceSession[]>([]);
  const [devicesLoading, setDevicesLoading] = useState(true);
  const [devicePendingRevoke, setDevicePendingRevoke] = useState<DeviceSession | null>(null);
  const [revokingSessionId, setRevokingSessionId] = useState<string | null>(null);
  const [revokeOthersConfirmOpen, setRevokeOthersConfirmOpen] = useState(false);
  const [revokeOthersLoading, setRevokeOthersLoading] = useState(false);

  // Account Settings
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [notificationsEditorOpen, setNotificationsEditorOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationPrefs>({
    newMessages: true,
    listingUpdates: true,
    savedSearchAlerts: true,
    marketingEmails: user.marketingOptIn,
  });
  const notificationsOnCount = NOTIFICATION_PREF_KEYS.filter((key) => notifications[key]).length;
  const showTwoFactor = isStageFeatureEnabled("twoFactorAuth");
  const [twoFactorEditorOpen, setTwoFactorEditorOpen] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Profile data — seeded from the real, DB-backed user record (getCurrentUser()).
  const [handle, setHandle] = useState(user.profileId || user.username || "");
  const [basicInfo, setBasicInfo] = useState<BasicInfoValues>({
    fullName: user.fullName,
    dateOfBirthIso: user.dateOfBirth,
    gender: (["Male", "Female", "Prefer not to say"] as const).includes(user.gender as any)
      ? (user.gender as BasicInfoValues["gender"])
      : "Prefer not to say",
  });
  // Roles/intent/specialties are a private preference layer with no matching
  // field on the User schema yet (schema only has a single flat `role`
  // string). Left as local-only UI state — wiring this needs a schema
  // decision (e.g. roles: string[] + intent: string) before it can persist.
  const [intent, setIntent] = useState<IntentId>(DEFAULT_INTENT);
  const [roleIds, setRoleIds] = useState<RoleId[]>([]);
  const [specialties, setSpecialties] = useState<Partial<Record<RoleId, string>>>({});
  const [customRole, setCustomRole] = useState<string | null>(
    user.role && !["individual", "business", "agency"].includes(user.role) ? user.role : null
  );
  const [contact, setContact] = useState<ContactValues>({
    email: user.email,
    emailVerified: true,
    phones: buildPhonesFromUser(user),
  });
  const [residence, setResidence] = useState<ResidenceValues>({
    country: user.address?.country || user.nationality || "",
    state: user.address?.state || "",
    city: user.address?.city || user.locality || "",
  });

  const [locations, setLocations] = useState<SavedLocation[]>(user.savedLocations);
  const primaryLocation = locations.find((l) => l.primary) ?? null;

  // Devices list only matters in account-settings mode — skip the fetch
  // entirely on /profile.
  useEffect(() => {
    if (mode !== "account-settings") return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/auth/sessions", { credentials: "include" });
        if (!res.ok) throw new Error("failed to load sessions");
        const { data } = await res.json();
        if (!cancelled) setDevices(data.sessions ?? []);
      } catch {
        if (!cancelled) toast.error("Couldn't load your signed-in devices.");
      } finally {
        if (!cancelled) setDevicesLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [mode]);

  const formatDeviceDate = (iso: string | null): string => {
    if (!iso) return "-";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "-";
    return `${d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })} · ${d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`;
  };

  const confirmRevokeDevice = async () => {
    if (!devicePendingRevoke) return;
    const target = devicePendingRevoke;
    setRevokingSessionId(target.sessionId);
    try {
      const res = await fetch("/api/auth/sessions/revoke", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: target.sessionId }),
      });
      if (!res.ok) throw new Error("revoke failed");
      const { data } = await res.json();
      setDevicePendingRevoke(null);
      if (data.signedOutCurrentDevice) {
        toast.success("Signed out of this device.");
        router.push("/");
        router.refresh();
        return;
      }
      setDevices((prev) => prev.filter((d) => d.sessionId !== target.sessionId));
      toast.success(`Signed out of ${target.deviceLabel}.`);
    } catch {
      toast.error("Couldn't sign out that device. Please try again.");
    } finally {
      setRevokingSessionId(null);
    }
  };

  const confirmRevokeOthers = async () => {
    setRevokeOthersLoading(true);
    try {
      const res = await fetch("/api/auth/sessions/revoke-others", { method: "POST" });
      if (!res.ok) throw new Error("revoke failed");
      const { data } = await res.json();
      setDevices((prev) => prev.filter((d) => d.isCurrent));
      setRevokeOthersConfirmOpen(false);
      toast.success(
        data.revokedCount > 0
          ? `Signed out of ${data.revokedCount} other device${data.revokedCount === 1 ? "" : "s"}.`
          : "No other devices to sign out."
      );
    } catch {
      toast.error("Couldn't sign out other devices. Please try again.");
    } finally {
      setRevokeOthersLoading(false);
    }
  };

  const openPhoneEditor = (id: string) => {
    setPhoneEditorId(id);
    setPhoneEditorOpen(true);
  };

  const handleEmailVerified = async (newEmail: string) => {
    try {
      await updateContact({ field: "email", value: newEmail });
      setContact((prev) => ({ ...prev, email: newEmail, emailVerified: true }));
      setChangeEmailEditorOpen(false);
      toast.success("Email updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't update email");
    }
  };

  const handlePhoneVerified = async (fullNumber: string) => {
    const newId = nextFreePhoneId(contact.phones);
    try {
      await updateContact({ field: phoneIdToField(newId), value: fullNumber });
      setContact((prev) => ({
        ...prev,
        phones: [
          ...prev.phones,
          { id: newId, number: fullNumber, primary: prev.phones.length === 0, visibleToBuyers: false },
        ],
      }));
      setAddPhoneEditorOpen(false);
      toast.success("Phone number added");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't add phone number");
    }
  };

  const handlePhoneEditVerified = async (fullNumber: string) => {
    if (!phoneEditorId) return;
    try {
      await updateContact({ field: phoneIdToField(phoneEditorId), value: fullNumber });
      setContact((prev) => ({
        ...prev,
        phones: prev.phones.map((p) => p.id === phoneEditorId ? { ...p, number: fullNumber } : p),
      }));
      setPhoneEditorOpen(false);
      toast.success("Phone number updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't update phone number");
    }
  };

  const removePhone = async (id: string) => {
    // Defense-in-depth: the trash-icon button only renders when there's more
    // than one number, but this guard stays here too (not just at render) —
    // per the standing rule, an account must never end up with zero phones.
    if (contact.phones.length <= 1) return;
    try {
      await updateContact({ field: phoneIdToField(id), value: "" });
      setContact((prev) => {
        const filtered = prev.phones.filter((p) => p.id !== id);
        const hasPrimary = filtered.some((p) => p.primary);
        return {
          ...prev,
          phones: hasPrimary ? filtered : filtered.map((p, i) => ({ ...p, primary: i === 0 })),
        };
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't remove phone number");
    } finally {
      setPhonePendingDelete(null);
    }
  };

  const setPrimaryPhone = (id: string) => {
    // "Primary" here just controls display order/badge — both numbers are
    // already persisted as primaryNumber/secondaryNumberN. Swapping which
    // slot is "primary" would mean swapping the two DB field values; skipped
    // for now since it's a cosmetic reorder, not a data change.
    setContact((prev) => ({
      ...prev,
      phones: prev.phones.map((p) => ({ ...p, primary: p.id === id })),
    }));
  };

  const setPhoneVisibility = (id: string, visible: boolean) => {
    // No visibleToBuyers column on the User model yet — UI-only for now.
    setContact((prev) => ({
      ...prev,
      phones: prev.phones.map((p) => (p.id === id ? { ...p, visibleToBuyers: visible } : p)),
    }));
  };

  const handleDeleteClick = async () => {
    resetDelete();
    const eligible = await checkEligibility();
    if (eligible) router.push("/delete-account/confirm");
  };

  return (
    <>
      <main className="min-h-screen bg-[#eaeff5]">
        <div className="mx-auto max-w-xl px-4 pb-16 pt-5 sm:px-6">
          <h1 className={cn("text-2xl font-bold text-slate-900", mode === "profile" ? "mb-2" : "mb-4")}>
            {mode === "profile" ? "My Profile" : "Account Settings"}
          </h1>
          {mode === "profile" && (
            <p className="mb-4 text-sm text-slate-600">
              Manage your public identity and how buyers see you.
            </p>
          )}

          <div className="flex flex-col gap-6">
            {/* ── Identity card ── */}
            <div className={mode === "profile" ? "" : "hidden"}>
            <LaCard className="overflow-hidden border-slate-200 bg-white p-0">
              <div className="h-1.5 w-full bg-linear-to-r from-rose-500 to-rose-400" />
              {/* Avatar+name row, then all role badges wrap freely on their own row
                  below — never truncated or collapsed to a "+N" count. Roles are
                  useful identity info, not clutter to hide. */}
              <div className="flex flex-col gap-3 px-4 py-4">
                <div className="flex items-center gap-3">
                  <Avatar initials={getInitials(basicInfo.fullName)} size="lg" />
                  <div className="min-w-0">
                    <h2 className="text-base font-bold leading-tight text-slate-900">
                      {basicInfo.fullName}
                    </h2>
                    <p className="mt-0.5 text-sm text-slate-600">
                      @{handle} · Member since 2022
                    </p>
                  </div>
                </div>
                {(() => {
                  const badgeLabels = buildDisplayedRoleBadges(roleIds, specialties, customRole);
                  return (
                    <div className="flex flex-wrap gap-1.5">
                      {badgeLabels.map((label) => {
                        const isBase = label === BASE_ROLE.label;
                        return (
                          <span
                            key={label}
                            title={isBase ? `${label} — default when no roles are selected` : label}
                            className={cn(
                              "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-sm font-semibold",
                              isBase
                                ? "bg-slate-100 text-slate-600"
                                : "border border-blue-400 bg-blue-100 text-blue-900"
                            )}
                          >
                            {isBase && <Lock className="size-3 shrink-0" />}
                            {label}
                          </span>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            </LaCard>
            </div>

          {/* ── Section 1: Public Profile ── */}
          <div className={mode === "profile" ? "" : "hidden"}>
          <Section
            label="Public Profile"
            actionText="Set Handle"
            onActionClick={() => setHandleEditorOpen(true)}
          >
            <div className="border-b border-slate-200 px-4 py-3.5">
              <p className="text-base font-medium text-slate-900">
                <span className="mr-1.5 text-sm font-medium uppercase tracking-wide text-slate-700">
                  Handle:
                </span>
                @{handle}
              </p>
              <a
                href={`/u/${handle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-0.5 inline-block text-sm text-blue-800 underline underline-offset-2 hover:text-blue-900"
              >
                lokalads.com/{handle}
              </a>
            </div>
            <div className="flex items-center justify-between gap-4 px-4 py-3">
              <p className="text-sm text-slate-500">
                See what buyers see when they view your profile
              </p>
              <LaButton asChild intent="primary-blue" size="default" className="shrink-0">
                <a href={`/u/${handle}`} target="_blank" rel="noopener noreferrer">
                  Preview
                </a>
              </LaButton>
            </div>
          </Section>
          </div>

          {/* ── Section 2: Basic Info ── */}
          <div className={mode === "profile" ? "" : "hidden"}>
          <Section
            label="Basic Info"
            actionText="Edit"
            onActionClick={() => setBasicInfoEditorOpen(true)}
          >
            <InfoRow label="Full Name" value={basicInfo.fullName} />
            <InfoRow label="Date of Birth" value={formatDobLabel(basicInfo.dateOfBirthIso)} />
            <InfoRow label="Gender" value={basicInfo.gender} />
          </Section>
          </div>

          {/* ── Section 3: Roles ── */}
          <div className={mode === "profile" ? "" : "hidden"}>
          <Section
            label="Roles"
            actionText="Edit"
            onActionClick={() => setRolesEditorOpen(true)}
            description="How you use LokalAds — shown as badges on your public profile. If you pick no explicit roles, we show Individual by default."
          >
            <div className="flex items-center gap-1.5 border-b border-slate-200 px-4 py-3 text-sm text-slate-600">
              <Lock className="size-3.5 text-slate-400" />
              Here for:
              <span className="font-semibold text-slate-800">
                {getIntentLabel(intent)}
              </span>
              <span className="text-slate-400">(private)</span>
            </div>
            <div className="flex flex-wrap gap-2 px-4 py-4">
              {(() => {
                const hasExplicitRoles = roleIds.length > 0 || Boolean(customRole);

                if (!hasExplicitRoles) {
                  return (
                    <span
                      title={`${BASE_ROLE.label} — shown until you pick a role`}
                      className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-600"
                    >
                      <Lock className="size-3.5" />
                      {BASE_ROLE.label}
                    </span>
                  );
                }

                return (
                  <>
                    {roleIds.map((id) => (
                      <span
                        key={id}
                        className="rounded-full border border-blue-400 bg-blue-100 px-3 py-1.5 text-sm font-semibold text-blue-900"
                      >
                        {formatRoleBadge(id, specialties)}
                      </span>
                    ))}
                    {customRole && (
                      <span className="rounded-full border-2 border-dashed border-blue-500 bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-900">
                        {customRole}
                      </span>
                    )}
                  </>
                );
              })()}
            </div>
          </Section>
          </div>

          {/* ── Section 4: Contact Information ── */}
          <div className={mode === "account-settings" ? "" : "hidden"}>
          <Section
            label="Contact Information"
            description="Your email is always private. Choose which phone numbers are visible to buyers."
          >
            {/* Email */}
            <ContactRow
              label="Email"
              value={contact.email}
              verified={contact.emailVerified}
              icon={Mail}
              onEdit={() => {
                // Guard: the email-change journey's 2nd factor is the primary
                // phone, which is guaranteed to exist once onboarding is done —
                // but defend against the edge case anyway (e.g. a fresh/mock
                // account with zero phones on file).
                if (contact.phones.length === 0) {
                  toast.info("Add a phone number before changing your email.");
                  return;
                }
                setChangeEmailEditorOpen(true);
              }}
            />

            {/* Phone list */}
            {contact.phones.map((phone, index) => (
              <div
                key={phone.id}
                className={cn(
                  "border-b border-slate-200 px-4 py-3.5 last:border-0",
                  phone.primary && "border-lime-200 bg-lime-100/80"
                )}
              >
                <div className="flex min-h-15 items-center justify-between gap-4">
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <Phone className="size-7 shrink-0 text-slate-500" strokeWidth={1.75} />
                    <div className="min-w-0 flex-1">
                      <div className="mb-0.5 flex items-center gap-2">
                        <p className="text-sm font-medium uppercase tracking-wide text-slate-600">
                          Phone {index + 1}
                        </p>
                        {phone.primary && (
                          <LaBadge
                            intent="danger"
                            variant="solid"
                            size="md"
                            className="gap-1 bg-rose-600 text-white hover:bg-rose-600"
                          >
                            <Star className="size-3" fill="currentColor" strokeWidth={0} />
                            Primary
                          </LaBadge>
                        )}
                      </div>
                      {/* Never truncate — the owner must always be able to fully read their own number */}
                      <p className="break-all text-base font-medium text-slate-900">{phone.number}</p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <LaButton
                      type="button"
                      intent="ghost"
                      size="default"
                      onClick={() => openPhoneEditor(phone.id)}
                      className="px-2 text-sm font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                    >
                      Edit
                    </LaButton>
                    {contact.phones.length > 1 && (
                      <LaButton
                        type="button"
                        intent="ghost"
                        size="default"
                        iconOnly
                        aria-label={`Remove phone ${index + 1}`}
                        onClick={() => setPhonePendingDelete(phone.id)}
                        className="rounded-md text-slate-500 hover:bg-rose-50 hover:text-rose-500"
                      >
                        <Trash2 className="size-4" strokeWidth={1.75} />
                      </LaButton>
                    )}
                  </div>
                </div>

                {/* "Set primary" gets its own full-width row — kept out of the row
                    above so Edit/Trash never have to compete with it for space,
                    which is what was squeezing the phone number into an ellipsis
                    on narrow viewports. */}
                {contact.phones.length > 1 && !phone.primary && (
                  <div className="mt-2">
                    <LaButton
                      type="button"
                      intent="outline"
                      size="default"
                      onClick={() => setPrimaryPhone(phone.id)}
                      className="px-3 text-sm"
                    >
                      Set primary
                    </LaButton>
                  </div>
                )}

                {/* Per-number visibility consent — default OFF, buyers reach seller via Chat until opted in */}
                <div className="mt-2 flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2 text-sm text-slate-500">
                    {phone.visibleToBuyers ? (
                      <Eye className="size-4 shrink-0 text-slate-500" strokeWidth={1.75} />
                    ) : (
                      <EyeOff className="size-4 shrink-0 text-slate-500" strokeWidth={1.75} />
                    )}
                    <span className="truncate">
                      {phone.visibleToBuyers ? "Visible to buyers" : "Hidden — reachable via Chat only"}
                    </span>
                  </div>
                  <LaSwitch
                    size="default"
                    checked={phone.visibleToBuyers}
                    onCheckedChange={(checked) => setPhoneVisibility(phone.id, checked)}
                    aria-label="Show to buyers"
                    className="shrink-0"
                  />
                </div>
              </div>
            ))}

            {/* Add phone / empty state / max reached */}
            {contact.phones.length === 0 ? (
              <div className="flex flex-col items-center gap-2 px-4 py-6 text-center">
                <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-2.5">
                  <AlertCircle className="size-4 shrink-0 text-amber-600" />
                  <p className="text-sm font-medium text-amber-800">
                    You need a phone number to post an ad.
                  </p>
                </div>
                <LaButton
                  type="button"
                  intent="primary-blue"
                  size="default"
                  onClick={() => setAddPhoneEditorOpen(true)}
                  className="mt-1 gap-1 px-3 text-sm font-semibold"
                >
                  <Plus className="size-3.5" />
                  Add phone number
                </LaButton>
              </div>
            ) : contact.phones.length < MAX_PHONES ? (
              <div className="flex min-h-12 items-center justify-between gap-4 px-4 py-3">
                <p className="text-sm text-slate-500">
                  {contact.phones.length === 1
                    ? "Add a backup number"
                    : `${contact.phones.length} of ${MAX_PHONES} numbers added`}
                </p>
                <LaButton
                  type="button"
                  intent="primary-blue"
                  size="default"
                  onClick={() => setAddPhoneEditorOpen(true)}
                  className="gap-1 px-3 text-sm font-semibold"
                >
                  <Plus className="size-3.5" />
                  Add
                </LaButton>
              </div>
            ) : (
              <div className="px-4 py-3">
                <p className="text-sm text-slate-500">Maximum {MAX_PHONES} phone numbers added.</p>
              </div>
            )}
          </Section>
          </div>

          {/* ── Section 5: Saved Locations ── */}
          <div className={mode === "account-settings" ? "" : "hidden"}>
          <SavedLocationSection locations={locations} setLocations={setLocations} />
          </div>

          {/* ── Section 6: My Residence ── */}
          <div className={mode === "profile" ? "" : "hidden"}>
          <Section
            label="My Residence"
            actionText="Edit"
            onActionClick={() => setResidenceEditorOpen(true)}
            description="Shown on your public profile so buyers know where you are."
          >
            <InfoRow label="City" value={residence.city} />
            <InfoRow label="State / Region" value={residence.state} />
            <InfoRow label="Country" value={residence.country} />
          </Section>
          </div>

          {/* ── Section 7: Login and Security ── */}
          <div className={mode === "account-settings" ? "" : "hidden"}>
          <Section
            label="Login and Security"
            description={`Signed in as ${contact.email || user.primaryNumber} — here are the devices currently signed in to your account.`}
          >
            {devicesLoading ? (
              <div className="flex items-center gap-2 px-4 py-5 text-sm text-slate-500">
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                Loading devices…
              </div>
            ) : devices.length === 0 ? (
              <div className="px-4 py-5 text-sm text-slate-500">No active devices found.</div>
            ) : (
              devices.map((device, index) => (
                <div
                  key={device.sessionId}
                  className={cn(
                    "flex items-start justify-between gap-4 px-4 py-3.5",
                    index < devices.length - 1 && "border-b border-slate-200"
                  )}
                >
                  <div className="flex min-w-0 flex-1 items-start gap-3">
                    <Monitor className="mt-0.5 size-5 shrink-0 text-slate-400" strokeWidth={1.5} aria-hidden="true" />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-lg font-semibold text-slate-900">{device.deviceLabel}</p>
                        {device.isCurrent && (
                          <LaBadge intent="success" size="md" className="gap-1 bg-emerald-50 text-emerald-700">
                            <ShieldCheck className="size-3" />
                            This device
                          </LaBadge>
                        )}
                      </div>
                      <p className="mt-1 text-base font-medium text-slate-900">{device.location}</p>
                      <p className="mt-0.5 text-sm text-slate-600">
                        {device.isCurrent ? "Active now" : `Last active ${formatDeviceDate(device.lastActiveAtIso)}`}
                        {" · "}Signed in {formatDeviceDate(device.createdAtIso)}
                      </p>
                    </div>
                  </div>

                  <LaButton
                    type="button"
                    intent="outline"
                    size="default"
                    onClick={() => setDevicePendingRevoke(device)}
                    disabled={revokingSessionId === device.sessionId}
                    className="h-10 min-w-32 shrink-0 justify-center border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100 hover:text-rose-800 focus-visible:ring-rose-400"
                  >
                    {revokingSessionId === device.sessionId ? (
                      <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                    ) : (
                      "Sign out"
                    )}
                  </LaButton>
                </div>
              ))
            )}

            {devices.filter((d) => !d.isCurrent).length > 0 && (
              <div className="px-4 py-3.5">
                <LaButton
                  type="button"
                  intent="outline"
                  size="default"
                  onClick={() => setRevokeOthersConfirmOpen(true)}
                  className="w-full justify-center border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100 hover:text-rose-800 focus-visible:ring-rose-400"
                >
                  Sign out of all other devices
                </LaButton>
              </div>
            )}
          </Section>
          </div>

          {/* ── Section 8: Account Settings ── */}
          <div className={mode === "account-settings" ? "" : "hidden"}>
          <Section label="Account Settings">
            <SettingsRow label="Change Password" onClick={() => setChangePasswordOpen(true)} />
            <SettingsRow
              label="Notifications"
              subtitle={`${notificationsOnCount} of ${NOTIFICATION_PREF_KEYS.length} on`}
              onClick={() => setNotificationsEditorOpen(true)}
            />
            {showTwoFactor && (
              <SettingsRow
                label="Two-Factor Authentication"
                subtitle={twoFactorEnabled ? "On" : "Off"}
                onClick={() => setTwoFactorEditorOpen(true)}
              />
            )}
          </Section>
          </div>

          {/* ── Section 9: Danger Zone ── */}
          <div className={mode === "account-settings" ? "" : "hidden"}>
          <section className="space-y-1">
            <div className="flex items-center justify-between px-1">
              <p className="text-lg font-medium text-slate-900">Danger Zone</p>
            </div>
            <LaCard className="overflow-hidden border-slate-200 bg-white p-0">
              {/* amber warning stripe — same language as identity card's violet stripe */}
              <div className="h-1.5 w-full bg-linear-to-r from-amber-400 to-rose-400" />
              <div className="flex items-start gap-3 px-4 pb-3 pt-4">
                <ShieldAlert
                  className="mt-0.5 size-5 shrink-0 text-amber-500"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-900">Permanent action</p>
                  {deleteError ? (
                    <p className="mt-0.5 text-sm text-rose-600">{deleteError}</p>
                  ) : (
                    <p className="mt-0.5 text-sm font-normal text-slate-600">
                      Deleting your account is irreversible. All your data will be permanently
                      removed.
                    </p>
                  )}
                </div>
              </div>
              <div className="px-4 pb-4">
                <button
                  type="button"
                  disabled={deleteLoading}
                  onClick={handleDeleteClick}
                  className="inline-flex items-center gap-2 rounded-full border-2 border-rose-300 bg-rose-50 px-4 py-1.5 text-sm font-semibold text-rose-600 transition hover:border-rose-500 hover:bg-rose-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {deleteLoading ? (
                    <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
                  ) : (
                    <Trash2 className="size-3.5" aria-hidden="true" />
                  )}
                  Delete Account
                </button>
              </div>
            </LaCard>
          </section>
          </div>
          </div>
        </div>
      </main>

      {/* ── Editors (conditional render = fresh state on each open) ── */}
      {handleEditorOpen && (
        <HandleEditor
          open={handleEditorOpen}
          onOpenChange={setHandleEditorOpen}
          currentHandle={handle}
          onSave={async (newHandle) => {
            try {
              await updateProfile({ userId: newHandle });
              setHandle(newHandle);
              toast.success("Handle updated");
            } catch (err) {
              toast.error(err instanceof Error ? err.message : "Couldn't update handle");
            }
          }}
        />
      )}
      {basicInfoEditorOpen && (
        <BasicInfoEditor
          open={basicInfoEditorOpen}
          onOpenChange={setBasicInfoEditorOpen}
          value={basicInfo}
          onSave={async (next) => {
            try {
              await updateProfile({
                fullName: next.fullName,
                dateOfBirth: next.dateOfBirthIso,
                gender: next.gender,
              });
              setBasicInfo(next);
              toast.success("Basic info updated");
            } catch (err) {
              toast.error(err instanceof Error ? err.message : "Couldn't update basic info");
            }
          }}
        />
      )}
      {rolesEditorOpen && (
        <RolesEditor
          open={rolesEditorOpen}
          onOpenChange={setRolesEditorOpen}
          value={{ intent, roleIds, specialties, customRole }}
          onSave={(next) => {
            setIntent(next.intent);
            setRoleIds(next.roleIds);
            setSpecialties(next.specialties);
            setCustomRole(next.customRole);
          }}
        />
      )}
      {phoneEditorOpen && phoneEditorId && (
        <AddPhoneEditor
          open={phoneEditorOpen}
          onOpenChange={setPhoneEditorOpen}
          initialValue={contact.phones.find((p) => p.id === phoneEditorId)?.number ?? ""}
          existingNumbers={contact.phones.filter((p) => p.id !== phoneEditorId).map((p) => p.number)}
          defaultCountryHint={residence.country}
          onVerified={handlePhoneEditVerified}
        />
      )}
      {addPhoneEditorOpen && (
        <AddPhoneEditor
          open={addPhoneEditorOpen}
          onOpenChange={setAddPhoneEditorOpen}
          existingNumbers={contact.phones.map((p) => p.number)}
          defaultCountryHint={residence.country}
          onVerified={handlePhoneVerified}
        />
      )}
      {changeEmailEditorOpen && (
        <ChangeEmailEditor
          open={changeEmailEditorOpen}
          onOpenChange={setChangeEmailEditorOpen}
          currentEmail={contact.email}
          primaryPhone={contact.phones.find((p) => p.primary)?.number ?? ""}
          onVerified={handleEmailVerified}
        />
      )}
      {residenceEditorOpen && (
        <ResidenceEditor
          open={residenceEditorOpen}
          onOpenChange={setResidenceEditorOpen}
          value={residence}
          onSave={async (next) => {
            try {
              await updateLocation({
                country: next.country,
                state: next.state,
                locality: next.city,
              });
              setResidence(next);
              toast.success("Residence updated");
            } catch (err) {
              toast.error(err instanceof Error ? err.message : "Couldn't update residence");
            }
          }}
          primaryLocation={primaryLocation}
        />
      )}
      {changePasswordOpen && (
        <ChangePasswordEditor open={changePasswordOpen} onOpenChange={setChangePasswordOpen} />
      )}
      {notificationsEditorOpen && (
        <NotificationsEditor
          open={notificationsEditorOpen}
          onOpenChange={setNotificationsEditorOpen}
          value={notifications}
          onSave={setNotifications}
        />
      )}
      {showTwoFactor && twoFactorEditorOpen && (
        <TwoFactorAuthEditor
          open={twoFactorEditorOpen}
          onOpenChange={setTwoFactorEditorOpen}
          enabled={twoFactorEnabled}
          onEnable={() => setTwoFactorEnabled(true)}
          onDisable={() => setTwoFactorEnabled(false)}
        />
      )}

      {/* Phone removal confirmation */}
      <AlertDialog open={!!phonePendingDelete} onOpenChange={(open) => !open && setPhonePendingDelete(null)}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia>
              <Trash2 className="size-5 text-rose-500" />
            </AlertDialogMedia>
            <AlertDialogTitle>Remove this number?</AlertDialogTitle>
            <AlertDialogDescription>
              {contact.phones.find((p) => p.id === phonePendingDelete)?.number} will be removed from your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => phonePendingDelete && removePhone(phonePendingDelete)}
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Device sign-out confirmation */}
      <AlertDialog open={!!devicePendingRevoke} onOpenChange={(open) => !open && setDevicePendingRevoke(null)}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia>
              <LogOut className="size-5 text-rose-500" />
            </AlertDialogMedia>
            <AlertDialogTitle>
              Sign out {devicePendingRevoke?.isCurrent ? "this device" : devicePendingRevoke?.deviceLabel}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {devicePendingRevoke?.isCurrent
                ? "You'll be signed out here right away and need to sign in again."
                : "That device will be signed out immediately and will need to sign in again."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={confirmRevokeDevice}>
              Sign out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Sign out of all other devices confirmation */}
      <AlertDialog open={revokeOthersConfirmOpen} onOpenChange={setRevokeOthersConfirmOpen}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia>
              <LogOut className="size-5 text-rose-500" />
            </AlertDialogMedia>
            <AlertDialogTitle>Sign out of all other devices?</AlertDialogTitle>
            <AlertDialogDescription>
              Every other device signed in to this account will be signed out immediately. This device stays signed in.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={confirmRevokeOthers} disabled={revokeOthersLoading}>
              {revokeOthersLoading ? "Signing out…" : "Sign out all"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
