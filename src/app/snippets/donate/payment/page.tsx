"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useDonationStore, type PaymentTier } from "@/lib/stores/donationStore";
import { LaInput as Input } from "@/components/la/la-input";

// ─── Step Progress (same as step 1) ──────────────────────────────────────

const STEPS = ["Choose Amount", "Select Payment", "Confirmation"];

function StepProgress({ current }: { current: 1 | 2 | 3 }) {
  return (
    <div className="bg-slate-800 py-2.5 px-4">
      <div className="max-w-screen-md mx-auto">
        <nav className="sm:hidden">
          <div className="flex gap-2 mb-1">
            {STEPS.map((_, i) => (
              <div key={i} className={cn("flex-1 h-1.5 rounded-full", i + 1 <= current ? "bg-teal-500" : "bg-slate-600")} />
            ))}
          </div>
          <p className="text-sm font-medium text-slate-200">Step {current}: {STEPS[current - 1]}</p>
        </nav>
        <nav className="hidden sm:block">
          <ol className="flex gap-4">
            {STEPS.map((step, i) => (
              <li key={i} className="flex-1">
                <div className={cn("h-1 rounded-full mb-1", i + 1 <= current ? "bg-teal-500" : "bg-slate-600")} />
                <p className={cn("text-sm font-medium", i + 1 <= current ? "text-slate-200" : "text-slate-500")}>
                  Step {i + 1}: {step}
                </p>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </div>
  );
}

// ─── QR Timer ─────────────────────────────────────────────────────────────

const QR_SECONDS = 5 * 60;

function QrTimer() {
  const [secs, setSecs] = useState(QR_SECONDS);

  useEffect(() => {
    if (secs <= 0) return;
    const id = setTimeout(() => setSecs((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [secs]);

  const pct = (secs / QR_SECONDS) * 100;
  const mm = String(Math.floor(secs / 60)).padStart(2, "0");
  const ss = String(secs % 60).padStart(2, "0");
  const expired = secs === 0;

  return (
    <div className="w-full">
      {/* Progress bar */}
      <div className="h-1.5 bg-slate-200 rounded-full mb-1 overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-1000", expired ? "bg-rose-500" : "bg-teal-500")}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className={cn("text-xs text-center font-mono", expired ? "text-rose-600 font-semibold" : "text-slate-500")}>
        {expired ? "QR code expired — refresh to get a new one" : `QR expires in ${mm}:${ss}`}
      </p>
    </div>
  );
}

// ─── Payment Tier Section ──────────────────────────────────────────────────

function TierHeader({
  tier,
  selected,
  onSelect,
  icon,
  label,
  badge,
  badgeColor,
}: {
  tier: PaymentTier;
  selected: boolean;
  onSelect: () => void;
  icon: React.ReactNode;
  label: string;
  badge?: string;
  badgeColor?: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 text-left transition-all",
        selected
          ? "border-slate-700 bg-slate-700 text-white"
          : "border-slate-200 bg-white hover:border-slate-300 text-slate-800"
      )}
    >
      <span className={cn("flex-none size-10 rounded-full flex items-center justify-center", selected ? "bg-white/15" : "bg-slate-100")}>
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <span className="block font-semibold text-base leading-tight">{label}</span>
      </div>
      {badge && (
        <span className={cn("text-xs font-semibold px-2.5 py-0.5 rounded-full flex-none", badgeColor ?? "bg-emerald-100 text-emerald-700")}>
          {badge}
        </span>
      )}
      <div className={cn("flex-none size-5 rounded-full border-2 flex items-center justify-center", selected ? "border-white" : "border-slate-300")}>
        {selected && <span className="size-2.5 rounded-full bg-white block" />}
      </div>
    </button>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────

const QrIcon = ({ active }: { active: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={cn("size-5", active ? "text-white" : "text-slate-600")}>
    <path fillRule="evenodd" d="M3 4.875C3 3.839 3.84 3 4.875 3h4.5c1.036 0 1.875.84 1.875 1.875v4.5c0 1.036-.84 1.875-1.875 1.875h-4.5A1.875 1.875 0 0 1 3 9.375v-4.5ZM4.875 4.5a.375.375 0 0 0-.375.375v4.5c0 .207.168.375.375.375h4.5a.375.375 0 0 0 .375-.375v-4.5a.375.375 0 0 0-.375-.375h-4.5Zm7.875.375c0-1.036.84-1.875 1.875-1.875h4.5C20.16 3 21 3.84 21 4.875v4.5c0 1.036-.84 1.875-1.875 1.875h-4.5a1.875 1.875 0 0 1-1.875-1.875v-4.5Zm1.875-.375a.375.375 0 0 0-.375.375v4.5c0 .207.168.375.375.375h4.5a.375.375 0 0 0 .375-.375v-4.5a.375.375 0 0 0-.375-.375h-4.5ZM6 6.75A.75.75 0 0 1 6.75 6h.75a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75h-.75A.75.75 0 0 1 6 7.5v-.75Zm9.75 0A.75.75 0 0 1 16.5 6h.75a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75v-.75ZM3 14.625c0-1.036.84-1.875 1.875-1.875h4.5c1.036 0 1.875.84 1.875 1.875v4.5c0 1.035-.84 1.875-1.875 1.875h-4.5A1.875 1.875 0 0 1 3 19.125v-4.5Zm1.875-.375a.375.375 0 0 0-.375.375v4.5c0 .207.168.375.375.375h4.5a.375.375 0 0 0 .375-.375v-4.5a.375.375 0 0 0-.375-.375h-4.5Zm7.875-.75a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75v-.75Zm6 0a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75v-.75ZM6 16.5a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75v-.75Zm9.75 0a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75v-.75Zm-3 3a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75v-.75Zm6 0a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75v-.75Z" clipRule="evenodd" />
  </svg>
);

const WalletIcon = ({ active }: { active: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={cn("size-5", active ? "text-white" : "text-slate-600")}>
    <path d="M2.273 5.625A4.483 4.483 0 0 1 5.25 4.5h13.5c1.141 0 2.183.425 2.977 1.125A3 3 0 0 0 18.75 3H5.25a3 3 0 0 0-2.977 2.625ZM2.273 8.625A4.483 4.483 0 0 1 5.25 7.5h13.5c1.141 0 2.183.425 2.977 1.125A3 3 0 0 0 18.75 6H5.25a3 3 0 0 0-2.977 2.625ZM5.25 9a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h13.5a3 3 0 0 0 3-3v-6a3 3 0 0 0-3-3H5.25Zm7.5 4.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z" />
  </svg>
);

const CardIcon = ({ active }: { active: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={cn("size-5", active ? "text-white" : "text-slate-600")}>
    <path d="M4.5 3.75a3 3 0 0 0-3 3v.75h21v-.75a3 3 0 0 0-3-3h-15Z" />
    <path fillRule="evenodd" d="M22.5 9.75h-21v7.5a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3v-7.5Zm-18 3.75a.75.75 0 0 1 .75-.75h6a.75.75 0 0 1 0 1.5h-6a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3Z" clipRule="evenodd" />
  </svg>
);

// ─── Page ─────────────────────────────────────────────────────────────────

export default function PaymentPage() {
  const router = useRouter();
  const store = useDonationStore();

  const resolvedAmount =
    store.selectedAmount !== null
      ? store.selectedAmount
      : parseFloat(store.customAmount) || 0;

  // Redirect if no donor info (direct URL access)
  useEffect(() => {
    if (!store.donorName || !store.donorEmail) {
      router.replace("/donate");
    }
  }, [store.donorName, store.donorEmail, router]);

  function handlePay() {
    store.confirmPayment();
    router.push("/donate/success");
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
            <span className="bg-lime-400 text-lime-900 text-xs font-semibold px-3 py-0.5 rounded-full">BETA</span>
          </div>
        </div>
        <StepProgress current={2} />
      </header>

      {/* ── Main ── */}
      <main className="flex-1 max-w-screen-md mx-auto w-full px-4 sm:px-6 py-8">

        {/* ── Donation Summary ── */}
        <div className="bg-slate-800 rounded-2xl px-5 py-4 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-0.5">Donating as</p>
            <p className="text-white font-semibold text-lg leading-tight">{store.donorName || "—"}</p>
            <p className="text-slate-400 text-sm">{store.donorEmail}</p>
          </div>
          <div className="text-right sm:text-right">
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-0.5">Amount</p>
            <p className="text-white text-3xl font-bold">£{resolvedAmount}</p>
          </div>
        </div>

        {/* ── Payment Method ── */}
        <div className="mb-6">
          <h2 className="text-base font-semibold text-slate-700 mb-4">Select payment method:</h2>

          <div className="flex flex-col gap-3">
            {/* ── Tier 1: Quick Pay ── */}
            <div>
              <TierHeader
                tier="qr"
                selected={store.paymentTier === "qr"}
                onSelect={() => store.setPaymentTier("qr")}
                icon={<QrIcon active={store.paymentTier === "qr"} />}
                label="Quick Pay — Scan QR"
                badge="Fastest"
                badgeColor={store.paymentTier === "qr" ? "bg-white/20 text-white" : "bg-teal-50 text-teal-700"}
              />

              {store.paymentTier === "qr" && (
                <div className="mt-2 mx-1 rounded-b-xl border-2 border-t-0 border-slate-200 bg-slate-50 px-4 pt-4 pb-5">
                  <div className="flex flex-col sm:flex-row gap-6 items-center">
                    {/* QR panel */}
                    <div className="flex flex-col items-center gap-2">
                      <div className="relative">
                        <div className="size-52 border-2 border-slate-300 rounded-xl p-1.5 bg-white shadow-sm">
                          <Image src="/dummy-qr.png" alt="Scan to Pay QR" width={200} height={200} className="w-full h-full object-contain" />
                        </div>
                        <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-rose-500 text-white text-xs font-bold px-3 py-0.5 rounded-full uppercase tracking-wide whitespace-nowrap">
                          Scan to Pay
                        </span>
                      </div>
                      <div className="mt-4 w-52">
                        <QrTimer />
                      </div>
                      <button className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 font-medium mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-4">
                          <path d="M10.75 2.75a.75.75 0 0 0-1.5 0v8.614L6.295 8.235a.75.75 0 1 0-1.09 1.03l4.25 4.5a.75.75 0 0 0 1.09 0l4.25-4.5a.75.75 0 0 0-1.09-1.03l-2.955 3.129V2.75Z" />
                          <path d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z" />
                        </svg>
                        Save QR Code
                      </button>
                    </div>

                    {/* Instructions */}
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-700 mb-2">Works with any banking app</p>
                      <div className="flex items-center gap-3 mb-4">
                        <Image src="/paytm-logo.svg" alt="Paytm" width={56} height={20} className="h-5 w-auto" />
                        <span className="text-xs text-slate-400">or any UPI / bank app</span>
                      </div>
                      <ol className="text-sm text-slate-600 list-decimal ml-4 space-y-1.5">
                        <li>Open your banking or payment app</li>
                        <li>Tap <span className="font-medium">Scan QR</span> and scan the code</li>
                        <li>Confirm the payment of <span className="font-semibold">£{resolvedAmount}</span></li>
                        <li>Stay on this page until confirmed</li>
                      </ol>
                      <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5 text-xs text-amber-800">
                        <strong>Keep this page open</strong> — you&apos;ll be redirected automatically once payment is detected.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ── Tier 2: Wallet Pay ── */}
            <div>
              <TierHeader
                tier="wallet"
                selected={store.paymentTier === "wallet"}
                onSelect={() => store.setPaymentTier("wallet")}
                icon={<WalletIcon active={store.paymentTier === "wallet"} />}
                label="1-Tap Wallet Pay"
                badge="Recommended"
                badgeColor={store.paymentTier === "wallet" ? "bg-white/20 text-white" : "bg-blue-50 text-blue-700"}
              />

              {store.paymentTier === "wallet" && (
                <div className="mt-2 mx-1 rounded-b-xl border-2 border-t-0 border-slate-200 bg-slate-50 px-4 pt-5 pb-5">
                  <p className="text-sm text-slate-500 mb-4 text-center">Choose your preferred wallet:</p>

                  {/* Sub-option: Apple Pay */}
                  <label className={cn("flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer mb-2 transition-all",
                    store.walletMethod === "apple-pay" ? "border-slate-700 bg-white shadow-sm" : "border-slate-200 bg-white hover:border-slate-300")}>
                    <input type="radio" name="wallet" checked={store.walletMethod === "apple-pay"}
                      onChange={() => store.setWalletMethod("apple-pay")} className="sr-only" />
                    <div className="size-8 bg-black rounded-lg flex items-center justify-center flex-none">
                      <svg viewBox="0 0 24 24" fill="white" className="size-5">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">Apple Pay</p>
                      <p className="text-xs text-slate-500">Face ID / Touch ID secured</p>
                    </div>
                    <div className={cn("size-4 rounded-full border-2 flex items-center justify-center",
                      store.walletMethod === "apple-pay" ? "border-slate-700" : "border-slate-300")}>
                      {store.walletMethod === "apple-pay" && <span className="size-2 rounded-full bg-slate-700 block" />}
                    </div>
                  </label>

                  {/* Sub-option: Google Pay */}
                  <label className={cn("flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer mb-2 transition-all",
                    store.walletMethod === "google-pay" ? "border-slate-700 bg-white shadow-sm" : "border-slate-200 bg-white hover:border-slate-300")}>
                    <input type="radio" name="wallet" checked={store.walletMethod === "google-pay"}
                      onChange={() => store.setWalletMethod("google-pay")} className="sr-only" />
                    <div className="size-8 rounded-lg flex items-center justify-center flex-none bg-white border border-slate-200">
                      <svg viewBox="0 0 48 48" className="size-5">
                        <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z" />
                        <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z" />
                        <path fill="#FBBC05" d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z" />
                        <path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">Google Pay</p>
                      <p className="text-xs text-slate-500">Fingerprint / PIN secured</p>
                    </div>
                    <div className={cn("size-4 rounded-full border-2 flex items-center justify-center",
                      store.walletMethod === "google-pay" ? "border-slate-700" : "border-slate-300")}>
                      {store.walletMethod === "google-pay" && <span className="size-2 rounded-full bg-slate-700 block" />}
                    </div>
                  </label>

                  {/* Sub-option: PayPal */}
                  <label className={cn("flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all",
                    store.walletMethod === "paypal" ? "border-slate-700 bg-white shadow-sm" : "border-slate-200 bg-white hover:border-slate-300")}>
                    <input type="radio" name="wallet" checked={store.walletMethod === "paypal"}
                      onChange={() => store.setWalletMethod("paypal")} className="sr-only" />
                    <div className="size-8 rounded-lg flex items-center justify-center flex-none bg-[#003087]">
                      <svg viewBox="0 0 24 24" fill="white" className="size-5">
                        <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.58 2.975-2.477 4.6-5.716 4.6h-2.19c-1.515 0-2.8 1.106-3.034 2.6l-1.12 7.107h2.606c.524 0 .968-.382 1.05-.9l.44-2.782c.082-.518.527-.9 1.05-.9h.668c3.845 0 6.538-1.563 7.374-6.082a5.026 5.026 0 0 0-.48-3.356z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">PayPal</p>
                      <p className="text-xs text-slate-500">Safe buyer protection included</p>
                    </div>
                    <div className={cn("size-4 rounded-full border-2 flex items-center justify-center",
                      store.walletMethod === "paypal" ? "border-slate-700" : "border-slate-300")}>
                      {store.walletMethod === "paypal" && <span className="size-2 rounded-full bg-slate-700 block" />}
                    </div>
                  </label>
                </div>
              )}
            </div>

            {/* ── Tier 3: Card & Bank ── */}
            <div>
              <TierHeader
                tier="card"
                selected={store.paymentTier === "card"}
                onSelect={() => store.setPaymentTier("card")}
                icon={<CardIcon active={store.paymentTier === "card"} />}
                label="Card & Bank Transfer"
                badgeColor={store.paymentTier === "card" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}
              />

              {store.paymentTier === "card" && (
                <div className="mt-2 mx-1 rounded-b-xl border-2 border-t-0 border-slate-200 bg-slate-50 px-4 pt-5 pb-5">
                  {/* Card vs Bank sub-options */}
                  <div className="flex gap-2 mb-4">
                    <button
                      type="button"
                      onClick={() => store.setCardMethod("credit-card")}
                      className={cn("flex-1 py-2 px-3 text-sm font-semibold rounded-lg border transition-all",
                        store.cardMethod === "credit-card"
                          ? "bg-slate-700 text-white border-slate-700"
                          : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                      )}
                    >
                      Credit / Debit Card
                    </button>
                    <button
                      type="button"
                      onClick={() => store.setCardMethod("bank-transfer")}
                      className={cn("flex-1 py-2 px-3 text-sm font-semibold rounded-lg border transition-all",
                        store.cardMethod === "bank-transfer"
                          ? "bg-slate-700 text-white border-slate-700"
                          : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                      )}
                    >
                      Bank Transfer
                    </button>
                  </div>

                  {store.cardMethod === "credit-card" && (
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Image src="/visa-logo.svg" alt="Visa" width={40} height={14} className="h-5 w-auto" />
                        <Image src="/mastercard-logo.svg" alt="Mastercard" width={32} height={24} className="h-6 w-auto" />
                        <span className="text-xs text-slate-400 ml-1">& more</span>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Card number</label>
                        <Input placeholder="1234 5678 9012 3456" maxLength={19} className="font-mono" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1">Expiry</label>
                          <Input placeholder="MM / YY" maxLength={7} className="font-mono" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1">CVV</label>
                          <Input placeholder="•••" maxLength={4} type="password" className="font-mono" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Name on card</label>
                        <Input placeholder="As it appears on your card" />
                      </div>
                    </div>
                  )}

                  {store.cardMethod === "bank-transfer" && (
                    <div className="bg-white rounded-xl border border-slate-200 px-4 py-4">
                      <p className="text-sm font-semibold text-slate-700 mb-3">Bank transfer details:</p>
                      <div className="space-y-2 text-sm">
                        {[
                          ["Account Name", "Lokalads Ltd"],
                          ["Sort Code", "20-45-53"],
                          ["Account Number", "73842910"],
                          ["Reference", `DONATE-${resolvedAmount}`],
                        ].map(([label, value]) => (
                          <div key={label} className="flex justify-between items-center border-b border-slate-100 pb-2 last:border-0 last:pb-0">
                            <span className="text-slate-500">{label}</span>
                            <span className="font-semibold text-slate-800 font-mono text-right">{value}</span>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-slate-400 mt-3">
                        Transfers may take 1–3 business days to process. Please use the reference above so we can match your donation.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Security note ── */}
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-6 justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-4 text-slate-400">
            <path fillRule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z" clipRule="evenodd" />
          </svg>
          Secured with 256-bit SSL encryption
        </div>

        {/* ── CTA ── */}
        <div className="flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={handlePay}
            className="w-full sm:w-auto px-10 py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-lg font-bold rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            Proceed to Pay — £{resolvedAmount}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="text-sm text-slate-400 hover:text-slate-600 transition-colors"
          >
            ← Back to choose amount
          </button>
        </div>

        <p className="text-center text-sm text-slate-400 italic mt-8 mb-2">
          ...every contribution empowers us to enhance your experience and keep Lokalads thriving for everyone.
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
