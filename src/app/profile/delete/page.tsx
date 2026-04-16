"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/shadcn/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { softDeleteAccount } from "@/app/actions/profile/deleteAccount";
import { toast } from "sonner";

export default function DeleteAccountPage() {
  const router = useRouter();

  const [confirmed, setConfirmed] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

 const handleDelete = async () => {
  if (!confirmed) return;

  try {
    setLoading(true);

    await softDeleteAccount(feedback);

    toast.success("Your account has been deleted");

    router.push("/"); // or login page
  } catch (e: any) {
    toast.error(e?.message || "Failed to delete account");
  } finally {
    setLoading(false);
  }
};

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-6 flex justify-center">
      <div className="w-full max-w-2xl space-y-6">

        {/* 🔴 WARNING CARD */}
        <div className="bg-white border border-red-200 rounded-xl p-6 shadow-sm">
          <h1 className="text-xl font-semibold text-red-600">
            Delete Your Account
          </h1>

          <p className="mt-3 text-sm text-gray-600">
            Are you sure you want to delete your account?
          </p>

          <ul className="mt-4 text-sm text-gray-600 space-y-2 list-disc pl-5">
            <li>All your personal data will be permanently removed</li>
            <li>All your posts and listings will be deleted</li>
            <li>This action cannot be undone</li>
          </ul>

          {/* CONFIRMATION */}
          <div className="mt-6 flex items-start gap-3">
            <Checkbox
              id="confirm"
              checked={confirmed}
              onCheckedChange={(v: boolean) => setConfirmed(v)}
            />
            <label htmlFor="confirm" className="text-sm text-gray-700">
              I understand that this action is permanent
            </label>
          </div>
        </div>

        {/* 📝 FEEDBACK CARD */}
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-medium text-gray-800">
            Help us improve (optional)
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Tell us why you're leaving
          </p>

          <Textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Your feedback..."
            className="mt-4 min-h-[120px]"
          />
        </div>

        {/* ACTION BUTTONS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

            <Button
                type="button"
                variant="destructive"
                className="w-full"
                disabled={!confirmed || loading}
                onClick={handleDelete}
            >
                {loading ? "Deleting..." : "Delete My Account"}
            </Button>

            <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => router.back()}
            >
                Cancel
            </Button>

            </div>

      </div>
    </main>
  );
}