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

import type { ProfileUser } from "./types";

type ActiveModal = null | "publicProfile" | "basic" | "location" | "resetPassword";



export default function ProfileClient({ user }: { user: ProfileUser }) {

  const router = useRouter();

  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

  return (
    <>
      <AppHeader />

      <main className="min-h-screen flex justify-center bg-gray-50 px-4 py-6">
        <div className="w-full max-w-2xl space-y-8">
         <Section title="Public Profile" hideEdit>
          <Row
            label="Profile ID"
            value={user.id?.trim() || "—"}
            actionLabel="Edit"
            onAction={() => setActiveModal("publicProfile")}
          />

          <Row
            label="Profile URL"
            value={
              user.id
                ? `lokalads.com/u/${user.id.trim()}`
                : "—"
            }
          />
        </Section>

          <Section title="Basic Info" onEdit={() => setActiveModal("basic")}>
            <Row label="First Name" value={user.firstName} />
            <Row label="Last Name" value={user.lastName} />
            <Row label="Role Title" value={user.role} />
            <Row label="DOB" value={user.dateOfBirth} />
          </Section>

          <Section title="Contact Information" hideEdit>
            <ContactEditForm user={user} />
          </Section>

          <Section title="Location" onEdit={() => setActiveModal("location")}>
            <Row label="Country" value={user.nationality} />
            <Row label="Postal Code" value={user.address?.postalCode} />
            <Row label="City" value={user.locality} />
          </Section>

          <Section title="Account Settings" hideEdit>
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setActiveModal("resetPassword")}
                className="w-full border rounded-lg px-4 py-3 text-left hover:bg-gray-50 transition"
              >
                <div className="font-medium text-gray-900">Reset Password</div>
                <div className="text-sm text-gray-500">
                  Change your account password securely
                </div>
              </button>

              <button
                type="button"
                onClick={() => router.push("/profile/delete")}
                className="w-full border border-red-200 rounded-lg px-4 py-3 text-left hover:bg-red-50 transition"
              >
                <div className="font-medium text-red-600">
                  Delete My Account
                </div>
                <div className="text-sm text-red-400">
                  Permanently remove your account and all data
                </div>
              </button>
            </div>
          </Section>
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