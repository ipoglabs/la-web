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



export default function ProfileClient({ user }: { user: ProfileUser }) {

  const router = useRouter();

  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

  return (
    <>
      <AppHeader />

         {/* MAIN */}
    <main className="min-h-screen flex justify-center bg-gray-50 px-4 py-6">
      <div className="w-full max-w-2xl space-y-8">

        {/* Sections */}
        <Section title="Public Profile" hideEdit>
          <Row
            label="Profile ID"
            value={user.profileId?.trim() || "—"}
            actionLabel="Edit"
            onAction={() => setActiveModal("publicProfile")}
          />
        </Section>

        <Section title="Basic Info" onEdit={() => setActiveModal("basic")}>
          <Row label="First Name" value={user.firstName} />
          <Row label="Last Name" value={user.lastName} />
          <Row label="Role" value={user.role || "—"} />
          {user.roleDescription && (
            <Row label="Role Description" value={user.roleDescription} />
          )}
          <Row label="DOB" value={user.dateOfBirth} />
        </Section>

        <Section title="Contact Information" hideEdit>
          <ContactEditForm user={user} />
        </Section>

        <Section title="Location" onEdit={() => setActiveModal("location")}>
          <Row label="Country" value={user.address?.country || user.nationality || "—"} />
          <Row label="State" value={user.address?.state || "—"} />
          <Row label="City" value={user.address?.city || user.locality || "—"} />
          <Row label="Postal Code" value={user.address?.postalCode || "—"} />
        </Section>

        <Section title="Account Settings" hideEdit>
          <div className="space-y-3">

            {/* Reset Password */}
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

            {/* 🔥 Danger Zone (NON-FLOATING) */}
            <div className="flex flex-col md:flex-row md:items-center rounded-lg border border-yellow-300 bg-gradient-to-r from-yellow-50 via-yellow-100 to-yellow-50 px-4 py-3">

              {/* Left: Icon + text */}
              <div className="flex items-center flex-1">
                <ShieldAlert className="h-8 w-8 text-yellow-600 mr-2" />
                <div>
                  <div className="text-base font-semibold text-yellow-800">
                    Danger zone
                  </div>
                  <div className="text-sm text-yellow-900">
                    Need to delete your account? This action is permanent.
                  </div>
                </div>
              </div>

              {/* Right: Button */}
              <div className="mt-3 md:mt-0 md:ml-4">
                <button
                  onClick={() => router.push("/profile/delete")}
                  className="inline-flex items-center gap-2 rounded-full border border-rose-400 bg-rose-100 px-5 py-2 text-sm text-rose-700 hover:bg-rose-500 hover:text-white"
                >
                  <Trash2 className="h-5 w-5" />
                  Delete Account
                </button>
              </div>

            </div>

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