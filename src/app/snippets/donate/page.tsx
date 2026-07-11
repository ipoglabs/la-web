"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useDonationStore } from "@/lib/stores/donationStore";
import { LaInput as Input } from "@/components/la/la-input";
import { Button } from "@/components/ui/button";

// ─── Step Progress ────────────────────────────────────────────────────────

const STEPS = [
  { label: "Choose Amount" },
  { label: "Select Payment" },
  { label: "Confirmation" },
];

function StepProgress({ current }: { current: 1 | 2 | 3 }) {
  return (
    <div className="bg-slate-800 py-2.5 px-4">
      <div className="max-w-screen-md mx-auto">
        {/* Mobile: bar + label */}
        <nav className="sm:hidden">
          <div className="flex gap-2 mb-1">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={cn(
                  "flex-1 h-1.5 rounded-full",
                  i + 1 <= current ? "bg-teal-500" : "bg-slate-600"
                )}
              />
            ))}
          </div>
          <p className="text-sm font-medium text-slate-200">
            Step {current}: {STEPS[current - 1].label}
          </p>
        </nav>

        {/* Desktop: full steps */}
        <nav className="hidden sm:block">
          <ol className="flex gap-4">
            {STEPS.map((step, i) => (
              <li key={i} className="flex-1">
                <div
                  className={cn(
                    "h-1 rounded-full mb-1",
                    i + 1 <= current ? "bg-teal-500" : "bg-slate-600"
                  )}
                />
                <p
                  className={cn(
                    "text-sm font-medium",
                    i + 1 <= current ? "text-slate-200" : "text-slate-500"
                  )}
                >
                  Step {i + 1}: {step.label}
                </p>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </div>
  );
}

// ─── Amount Card ──────────────────────────────────────────────────────────

const AMOUNTS = [
  { value: 10, tagline: "Help keep Lokalads running smoothly every day." },
  { value: 30, tagline: "Drive essential improvements and innovation." },
  { value: 50, tagline: "Empower us to deliver better features and services." },
  { value: 100, tagline: "Be the reason Lokalads transforms for the better." },
  { value: 500, tagline: "Fuel a bigger change and help us reach more communities." },
];

function AmountCard({
  amount,
  tagline,
  selected,
  onSelect,
}: {
  amount: number;
  tagline: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "relative text-left px-4 py-3 rounded-xl border transition-all",
        selected
          ? "border-blue-500 ring-2 ring-blue-400/50 bg-blue-50"
          : "border-slate-300 bg-white hover:bg-slate-50"
      )}
    >
      <span
        className={cn(
          "block text-2xl sm:text-3xl font-bold",
          selected ? "text-blue-700" : "text-slate-800"
        )}
      >
        £{amount}
      </span>
      <span className="block text-sm text-slate-500 mt-0.5 leading-snug">{tagline}</span>
      {selected && (
        <span className="absolute top-3 right-3 size-5 rounded-full bg-blue-500 flex items-center justify-center">
          <svg className="size-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </span>
      )}
    </button>
  );
}

function OtherAmountCard({
  selected,
  onSelect,
}: {
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "relative text-left px-4 py-3 rounded-xl border transition-all",
        selected
          ? "border-blue-500 ring-2 ring-blue-400/50 bg-blue-50"
          : "border-slate-300 bg-white hover:bg-slate-50"
      )}
    >
      <span
        className={cn(
          "block text-2xl font-bold",
          selected ? "text-blue-700" : "text-slate-800"
        )}
      >
        Other Amount
      </span>
      <span className="block text-sm text-slate-500 mt-0.5 leading-snug">
        Every pound counts — customise your support!
      </span>
      {selected && (
        <span className="absolute top-3 right-3 size-5 rounded-full bg-blue-500 flex items-center justify-center">
          <svg className="size-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </span>
      )}
    </button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────

export default function DonationPage() {
  const router = useRouter();
  const store = useDonationStore();
  const [errors, setErrors] = useState<{ name?: string; email?: string; amount?: string }>({});

  const resolvedAmount =
    store.selectedAmount !== null
      ? store.selectedAmount
      : parseFloat(store.customAmount) || null;

  function validate() {
    const e: typeof errors = {};
    if (!store.donorName.trim()) e.name = "Please enter your full name.";
    if (!store.donorEmail.trim()) e.email = "Please enter your email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(store.donorEmail)) e.email = "Please enter a valid email.";
    if (!resolvedAmount || resolvedAmount <= 0) e.amount = "Please select or enter a donation amount.";
    else if (store.selectedAmount === null && resolvedAmount < 1) e.amount = "Minimum donation is £1.";
    return e;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length > 0) {
      setErrors(e2);
      return;
    }
    setErrors({});
    router.push("/donate/payment");
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* ── Header ── */}
      <header className="sticky top-0 z-10 shadow-sm">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-screen-md mx-auto h-12 flex items-center px-4 sm:px-6">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/la-logo-symbol-color.svg" alt="Lokalads" width={36} height={36} />
              <Image src="/la-text-black.svg" alt="Lokalads" width={80} height={20} />
            </Link>
            <div className="flex-1" />
            <span className="bg-lime-400 text-lime-900 text-xs font-semibold px-3 py-0.5 rounded-full">
              BETA
            </span>
          </div>
        </div>
        <StepProgress current={1} />
      </header>

      {/* ── Main ── */}
      <main className="flex-1 max-w-screen-md mx-auto w-full px-4 sm:px-6 py-8">
        {/* Headline */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 leading-tight">
            Support Lokalads — Together, We Build Stronger Communities
          </h1>
          <p className="text-base sm:text-lg text-slate-500 italic mt-2">
            &ldquo;Your contribution keeps Lokalads free and growing, so millions can benefit from our platform.&rdquo;
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* ── Amount Selection ── */}
          <fieldset className="mb-8">
            <legend className="text-base font-semibold text-slate-700 mb-3">
              Choose your contribution amount:
            </legend>

            {errors.amount && (
              <p className="text-sm text-rose-600 mb-3">{errors.amount}</p>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
              {AMOUNTS.map(({ value, tagline }) => (
                <AmountCard
                  key={value}
                  amount={value}
                  tagline={tagline}
                  selected={store.selectedAmount === value}
                  onSelect={() => store.setSelectedAmount(value)}
                />
              ))}
              <OtherAmountCard
                selected={store.selectedAmount === null}
                onSelect={() => store.setSelectedAmount(null)}
              />
            </div>

            {/* Custom amount input */}
            {store.selectedAmount === null && (
              <div className="border-l-4 border-blue-400 bg-blue-50 rounded-r-lg px-4 py-3 mt-1">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Enter your amount (£)
                </label>
                <Input
                  type="number"
                  min={1}
                  placeholder="e.g. 75"
                  value={store.customAmount}
                  onChange={(e) => store.setCustomAmount(e.target.value)}
                  className="w-40"
                />
              </div>
            )}
          </fieldset>

          {/* ── Separator ── */}
          <hr className="border-slate-200 mb-8" />

          {/* ── Donor Details ── */}
          <div className="mb-8">
            <h2 className="text-base font-semibold text-slate-700 mb-4">Your details:</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="e.g. Jane Smith"
                  autoComplete="name"
                  value={store.donorName}
                  onChange={(e) => store.setDonorName(e.target.value)}
                />
                {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <Input
                  type="email"
                  placeholder="e.g. jane@example.com"
                  autoComplete="email"
                  value={store.donorEmail}
                  onChange={(e) => store.setDonorEmail(e.target.value)}
                />
                {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Message <span className="text-slate-400 text-xs font-normal">(Optional)</span>
              </label>
              <textarea
                rows={3}
                placeholder="Feel free to share your experience with Lokalads!"
                value={store.donorMessage}
                onChange={(e) => store.setDonorMessage(e.target.value)}
                className="w-full rounded-md border-[1.5px] border-gray-700/55 bg-gray-50 px-3 py-2 text-base text-gray-900 placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/25 focus-visible:ring-offset-1 focus-visible:bg-yellow-50 resize-none"
              />
            </div>
          </div>

          {/* ── CTA ── */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="px-8 py-3.5 bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-600 text-yellow-900 text-lg font-bold rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
            >
              Yes, I want to Support Lokalads!
            </button>
          </div>
        </form>

        {/* Sub tagline */}
        <p className="text-center text-sm text-slate-400 italic mt-8 mb-2">
          ...every contribution empowers us to enhance your experience, introduce new features, and keep Lokalads thriving for everyone.
        </p>
      </main>

      {/* ── Footer ── */}
      <footer className="bg-slate-800 border-t-4 border-rose-500 py-4 px-4">
        <div className="max-w-screen-md mx-auto flex flex-wrap items-center justify-center gap-x-2 text-slate-400 text-xs">
          <span>© 2025 Lokalads</span>
          <span className="text-slate-600">·</span>
          <a href="#" className="hover:text-slate-200">Privacy Policy</a>
          <span className="text-slate-600">·</span>
          <a href="#" className="hover:text-slate-200">Cookie Policy</a>
        </div>
      </footer>
    </div>
  );
}
