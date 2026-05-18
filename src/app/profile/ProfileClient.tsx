"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";


import AppHeader from "../components/AppHeader/appHeader";
import Section from "./components/Section";
import Row from "./components/Row";
import PublicProfileEdit from "./components/PublicProfileEdit";
import BasicEditForm from "./components/BasicEditForm";
import LocationEditForm from "./components/LocationEditForm";
import ContactEditForm from "./components/ContactEditForm";
import ResetPassword from "./components/ResetPassword";
import ResponsiveModal from "./components/ResponsiveModal";
import { ShieldAlert, Trash2, Loader2 } from "lucide-react";

import type { ProfileUser } from "./types";

type ActiveModal = null | "publicProfile" | "basic" | "location" | "resetPassword";

function InfoRow({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div className="px-4 py-3.5 border-b border-slate-100 last:border-0">
      <div className="text-xs font-semibold text-slate-500 mb-1">
        {label}
      </div>
      <div className="text-sm font-semibold text-slate-900">
        {value || "—"}
      </div>
    </div>
  );
}

function ContactRow({
  label,
  value,
  onClick,
}: {
  label: string;
  value?: string | null;
  onClick?: () => void;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100 last:border-0 gap-4">
      <div className="min-w-0 flex-1">
        <div className="text-xs font-semibold text-slate-500">{label}</div>
        <div className="text-sm font-semibold text-slate-900 mt-0.5 truncate">
          {value || "—"}
        </div>
      </div>

      {onClick && (
        <button
          type="button"
          onClick={onClick}
          className="shrink-0 text-xs font-semibold text-slate-500 border border-slate-200 px-3.5 py-1.5 rounded-lg hover:border-slate-400 hover:text-slate-800"
        >
          Edit
        </button>
      )}
    </div>
  );
}

function SettingsRow({
  label,
  onClick,
}: {
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center justify-between px-4 py-3.5 border-b border-slate-100 last:border-0 text-left"
    >
      <span className="text-sm font-medium text-slate-800">{label}</span>
      <span className="text-slate-300">›</span>
    </button>
  );
}

function Section({
  label,
  onEdit,
  children,
}: {
  label: string;
  onEdit?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between px-1 mb-2">
        <span className="text-sm font-bold text-slate-700">{label}</span>

        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800"
          >
            Edit
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
        {children}
      </div>
    </div>
  );
}

function formatDOB(date?: string) {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ProfileClient({ user }: { user: ProfileUser }) {

  const router = useRouter();

  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

  return (
    <>
      <AppHeader />

{/* MAIN */}
<main className="bg-slate-50 min-h-screen">
  <div className="max-w-xl mx-auto px-4 pb-10 flex flex-col gap-6">

    {/* ── Avatar Hero ── */}
    <div className="flex items-center gap-3.5 pt-5 pb-1">

      <div className="relative shrink-0">
        <div className="size-14 rounded-full bg-slate-900 flex items-center justify-center text-white text-xl font-bold shadow-sm">
          {user.fullName?.charAt(0) || "U"}
        </div>

        <button
          type="button"
          className="absolute -bottom-0.5 -right-0.5 size-5 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-500 hover:text-slate-800"
        >
          ✎
        </button>
      </div>

      <div className="min-w-0">
        <h2 className="text-base font-bold text-slate-900">
          {user.fullName}
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          @{user.profileId} · {user.role || "User"}
        </p>
      </div>

    </div>

    {/* ── Public Profile ── */}
    <Section label="Public Profile" onEdit={() => setActiveModal("publicProfile")}>
      <InfoRow
        label="Profile ID"
        value={user.profileId?.trim() || "—"}
      />
    </Section>

    {/* ── Basic Info ── */}
    <Section label="Basic Info" onEdit={() => setActiveModal("basic")}>
      <InfoRow label="Full Name" value={user.fullName} />
      <InfoRow
        label="Date of Birth"
        value={
          user.dateOfBirth
            ? new Date(user.dateOfBirth).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "—"
        }
      />
      <InfoRow label="Role" value={user.role || "—"} />
      {user.roleDescription && (
        <InfoRow label="Role Description" value={user.roleDescription} />
      )}
    </Section>

   <Section label="Contact Information" hideEdit> <ContactEditForm user={user} /> </Section>

    {/* ── Location ── */}
    <Section label="Location" onEdit={() => setActiveModal("location")}>
      <InfoRow label="Country" value={user.address?.country || user.nationality || "—"} />
      <InfoRow label="State" value={user.address?.state || "—"} />
      <InfoRow label="City" value={user.address?.city || user.locality || "—"} />
      <InfoRow label="Postal Code" value={user.address?.postalCode || "—"} />
    </Section>

    {/* ── Account Settings ── */}
    <Section label="Account Settings">
      <SettingsRow
        label="Reset Password"
        onClick={() => setActiveModal("resetPassword")}
      />
      <SettingsRow label="Two-Factor Authentication" />
      <SettingsRow label="Notifications" />
    </Section>

    {/* ── Danger Zone ── */}
    <div>
      <div className="px-1 mb-2">
        <span className="text-sm font-bold text-slate-700">
          Danger Zone
        </span>
      </div>

      <div className="rounded-2xl border border-yellow-200 bg-yellow-50 overflow-hidden">

        <div className="px-4 pt-4 pb-3 flex items-start gap-3">
          <ShieldAlert className="size-5 text-yellow-600 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-yellow-900">
              Permanent action
            </p>
            <p className="text-sm text-yellow-800 mt-0.5">
              Deleting your account is irreversible.
            </p>
          </div>
        </div>

        <div className="px-4 pb-4">
          <button
            type="button"
            onClick={() => router.push("/profile/delete")}
            className="inline-flex items-center gap-2 rounded-full border border-rose-300 bg-white px-4 py-1.5 text-sm font-semibold text-rose-600 hover:bg-rose-500 hover:text-white"
          >
            <Trash2 className="size-3.5" />
            Delete Account
          </button>
        </div>

      </div>
    </div>

  </div>
</main>

   

      <ResponsiveModal
        open={activeModal === "publicProfile"}
        onOpenChange={(open) => !open && setActiveModal(null)}
        title="Edit Public Profile ID"
      >
        <PublicProfileEdit
          user={user}
          onSuccess={() => setActiveModal(null)}
        />
      </ResponsiveModal>

      <ResponsiveModal
        open={activeModal === "basic"}
        onOpenChange={(open) => !open && setActiveModal(null)}
        title="Edit Basic Info"
      >
        <BasicEditForm
          user={user}
          onSuccess={() => setActiveModal(null)}
        />
      </ResponsiveModal>

      <ResponsiveModal
        open={activeModal === "location"}
        onOpenChange={(open) => !open && setActiveModal(null)}
        title="Edit Location"
      >
        <LocationEditForm
          user={user}
          onSuccess={() => setActiveModal(null)}
        />
      </ResponsiveModal>

      <ResponsiveModal
        open={activeModal === "resetPassword"}
        onOpenChange={(open) => !open && setActiveModal(null)}
        title="Reset Password"
      >
        <ResetPassword onSuccess={() => setActiveModal(null)} />
      </ResponsiveModal>
    </>
  );
}