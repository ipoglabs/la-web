"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Trash2, Frown, Loader2 } from "lucide-react";
import { softDeleteAccount } from "@/app/actions/profile/deleteAccount";
import { toast } from "sonner";
import AppHeader from "@/components/la-blocks/AppHeader";
import AppFooter from "@/components/la-blocks/AppFooter";

const userName = "User"; // TODO: replace with session user

const REASONS = [
  "I no longer need the product",
  "I am switching to another service",
  "I am concerned about privacy",
  "I had a bad experience",
  "The product is too complex",
  "I want a fresh start",
];

export default function DeleteAccountConfirmPage() {
  const router = useRouter();

  const [stage, setStage] = useState(2);
  const [reasons, setReasons] = useState<string[]>([]);
  const [details, setDetails] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleReason = (reason: string) => {
    setReasons((prev) =>
      prev.includes(reason)
        ? prev.filter((r) => r !== reason)
        : [...prev, reason]
    );
  };

 const handleDelete = async () => {
  if (!confirmed) return;

  try {
    setLoading(true);
    setError("");

    const feedback = `${reasons.join(", ")} | ${details}`;

    await softDeleteAccount(feedback);

    toast.success("Your account has been deleted");

    // 🔥 CRITICAL FIX — clear session cookie
    document.cookie = "session=; Max-Age=0; path=/";

    // optional: also clear your uinfo cookie
    document.cookie = "uinfo=; Max-Age=0; path=/";

    setStage(4);

    // // optional: redirect after 2s
    // setTimeout(() => {
    //   router.push("/");
    // }, 2000);

  } catch (e: any) {
    setError(e?.message || "Failed to delete account");
  } finally {
    setLoading(false);
  }
};

  const canProceedFromStage2 = reasons.length > 0;
  const canProceedFromStage3 = confirmed;
  const detailsCount = details.trim().length;

  return (
    <main className="min-h-screen flex flex-col bg-[radial-gradient(circle_at_top,#f8fafc,#e2e8f0)]">
      <AppHeader />
      <div className="flex flex-1 items-center justify-center px-6 py-14">
      <div className="mx-auto w-full max-w-lg">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* ── Stage 2: Feedback ──────────────────────────────────────────── */}
{stage === 2 && (
  <div className="px-6 py-7 sm:px-8 space-y-7">
    <div>
      <h2 className="text-lg font-medium text-slate-900">
        Before you go — what happened?
      </h2>
      <p className="mt-1.5 text-sm font-light text-slate-600">
        {"We'd love to make things right. Tell us what's not working and we'll do our best to help."}
      </p>
    </div>

    {/* Multi-select reason chips */}
    <div className="grid gap-2.5 sm:grid-cols-2">
      {REASONS.map((reason) => {
        const selected = reasons.includes(reason);

        return (
          <button
            key={reason}
            type="button"
            onClick={() => toggleReason(reason)}
            className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-normal transition ${
              selected
                ? "border-blue-500 bg-blue-50 text-slate-800"
                : "border-slate-400 bg-white text-slate-700 hover:border-slate-500 hover:bg-slate-50"
            }`}
          >
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition ${
                selected
                  ? "border-blue-500 bg-blue-500 text-white"
                  : "border-slate-400 text-transparent"
              }`}
            >
              <Check className="h-3 w-3" />
            </span>
            {reason}
          </button>
        );
      })}
    </div>

    {/* Optional free-text detail */}
    <div>
      <label className="text-sm font-medium text-slate-700">
        Anything else?{" "}
        <span className="font-normal text-slate-400">(optional)</span>
      </label>

      <textarea
        value={details}
        onChange={(e) => setDetails(e.target.value)}
        maxLength={150}
        placeholder="Share any extra context — it goes directly to our product team."
        className="mt-2 min-h-[100px] w-full rounded-md border-[1.5px] border-slate-400 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition-all duration-150 placeholder:text-slate-400 focus:border-b-[3px] focus:border-b-blue-500"
      />

      <p className="mt-1 text-right text-xs text-slate-400">
        {detailsCount}/150
      </p>
    </div>

    <div className="flex items-center gap-3">
      {/* Back */}
      <button
        type="button"
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:border-slate-300"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      {/* Continue */}
      <button
        type="button"
        disabled={!canProceedFromStage2 || loading}
        onClick={() => setStage(3)}  // 🔥 IMPORTANT change
        className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition ${
          canProceedFromStage2 && !loading
            ? "bg-slate-900 text-white hover:bg-slate-800"
            : "cursor-not-allowed bg-slate-100 text-slate-400"
        }`}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        Continue
        {!loading && <ArrowRight className="h-4 w-4" />}
      </button>
    </div>
  </div>
)}

         {/* ── Stage 3: Review + Confirm ──────────────────────────────────── */}
{stage === 3 && (
  <div className="px-6 py-7 sm:px-8 space-y-7">
    <div>
      <h2 className="text-lg font-medium text-slate-900">
        One last check
      </h2>
      <p className="mt-1.5 text-sm text-slate-500">
        You are about to permanently delete your account. This cannot be undone.
      </p>
    </div>

    {/* Summary */}
    <div className="space-y-2.5">
      <p className="text-sm font-medium text-slate-700">
        Your reasons
      </p>

      <ul className="space-y-2">
        {reasons.map((r) => (
          <li
            key={r}
            className="flex items-start gap-2.5 text-sm text-slate-600"
          >
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-800" />
            {r}
          </li>
        ))}
      </ul>

      {/* Details */}
      {detailsCount > 0 && (
        <div className="mt-6 space-y-2">
          <p className="text-sm font-medium text-slate-700">
            Additional Details
          </p>
          <p className="text-sm text-slate-600">{details}</p>
        </div>
      )}
    </div>

    {/* Divider */}
    <hr className="border-slate-400" />

    {/* Confirm checkbox */}
    <label className="flex cursor-pointer items-start gap-3 rounded-lg py-1 transition hover:opacity-80 focus-within:ring-2 focus-within:ring-blue-300">
      <input
        type="checkbox"
        checked={confirmed}
        onChange={() => setConfirmed(!confirmed)}
        className="sr-only"
      />

      <div
        className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition ${
          confirmed
            ? "border-blue-500 bg-blue-500"
            : "border-slate-400 bg-white"
        }`}
      >
        {confirmed && (
          <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
        )}
      </div>

      <p className="text-sm font-normal text-slate-800">
        I confirm my decision to delete my account. I understand this action is
        permanent and cannot be undone.
      </p>
    </label>

    {/* Actions */}
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => {
          setStage(2);
          setConfirmed(false);
          setError(""); // 🔥 replace clearError()
        }}
        className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:border-slate-300"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <button
        type="button"
        disabled={!canProceedFromStage3 || loading}
        onClick={handleDelete} // 🔥 replace deleteAccount
        className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition ${
          canProceedFromStage3 && !loading
            ? "bg-rose-600 text-white hover:bg-rose-700"
            : "cursor-not-allowed bg-rose-100 text-rose-300"
        }`}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Trash2 className="h-4 w-4" />
        )}
        Delete my account
      </button>
    </div>

    {/* Error */}
    {error && (
      <p className="text-sm text-rose-600">{error}</p>
    )}
  </div>
)}

         {/* ── Stage 4: Goodbye ───────────────────────────────────────────── */}
{stage === 4 && (
  <div className="px-6 py-7 sm:px-8 space-y-6">

    {/* Header */}
    <div className="flex items-center gap-4">
      <Frown className="h-14 w-14 text-rose-400" />

      <div>
        <h2 className="text-lg font-medium text-slate-900">
          {userName}, sorry to see you go.
        </h2>

        <p className="mt-0.5 text-sm text-slate-500">
          Your account and all associated data have been permanently deleted.
        </p>
      </div>
    </div>

    {/* Secondary message */}
    <p className="text-sm text-slate-500">
      {"You're always welcome back — just sign up with the same email or phone number."}
    </p>

    {/* CTA */}
    <button
      type="button"
      onClick={() => router.push("/")}
      className="inline-flex items-center gap-2 rounded-full bg-slate-900 text-white px-4 py-2.5 text-sm font-medium transition hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-slate-400"
    >
      ⬅ Back to Home
    </button>

  </div>
)}

        </div>
      </div>
      </div>
      <AppFooter />
    </main>
  );
}