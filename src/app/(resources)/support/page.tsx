"use client";

import React, { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { LaField } from "@/components/la/la-field";
import { LaInput } from "@/components/la/la-input";
import { LaTextarea } from "@/components/la/la-textarea";
import { LaSelect } from "@/components/la/la-select";
import { LaButton } from "@/components/la/la-button";

// ─── Topic config ─────────────────────────────────────────────────────────────
const TOPICS = [
  { value: "",                  label: "Select a topic…",                  urgent: false, note: "" },
  { value: "scam",              label: "Report a scam or fraud",           urgent: true,  note: "Flagged as urgent — reviewed within 2 hours." },
  { value: "account-locked",    label: "I can't access my account",        urgent: true,  note: "Flagged as urgent — reviewed within 2 hours." },
  { value: "ad-removed",        label: "My ad was removed or rejected",    urgent: false, note: "We'll review your ad and respond within 1 business day." },
  { value: "buyer-issue",       label: "Problem with a seller or listing", urgent: false, note: "We'll look into this and respond within 1 business day." },
  { value: "bug",               label: "Something isn't working",          urgent: false, note: "We'll investigate and respond within 1 business day." },
  { value: "other",             label: "Something else",                   urgent: false, note: "We'll respond within 1 business day." },
];

// ─── Form state type ──────────────────────────────────────────────────────────
interface FormState {
  name: string;
  email: string;
  topic: string;
  adId: string;
  message: string;
}

const EMPTY: FormState = { name: "", email: "", topic: "", adId: "", message: "" };

// ─── Helpers ──────────────────────────────────────────────────────────────────
function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

// ─── Success state ────────────────────────────────────────────────────────────
function SuccessState({ email }: { email: string }) {
  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-8 py-10 text-center max-w-lg mx-auto">
      {/* Checkmark */}
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round" className="size-7 text-emerald-600" aria-hidden>
          <path d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-xl font-bold text-slate-900 mb-2">Message received</h2>
      <p className="text-base text-slate-700 leading-relaxed">
        We&apos;ve got your message and will reply to{" "}
        <span className="font-semibold text-slate-900">{email}</span> shortly.
      </p>
      <p className="mt-3 text-base text-slate-600">
        Every message is read by a real person on our team — no bots, no auto-replies.
      </p>
      <div className="mt-6">
        <Link href="/" className="text-sm font-semibold text-blue-700 hover:text-blue-900 underline-offset-2 hover:underline">
          Back to home
        </Link>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function SupportPage() {
  const [form, setForm]       = useState<FormState>(EMPTY);
  const [errors, setErrors]   = useState<Partial<FormState>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const selectedTopic = TOPICS.find((t) => t.value === form.topic);
  const adIdTopics = ["ad-removed", "buyer-issue", "scam"];
  const showAdId = adIdTopics.includes(form.topic);

  function set(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  }

  function validate(): boolean {
    const e: Partial<FormState> = {};
    if (!form.name.trim())        e.name    = "Please enter your name.";
    if (!form.email.trim())       e.email   = "Please enter your email.";
    else if (!isEmail(form.email)) e.email  = "Please enter a valid email address.";
    if (!form.topic)              e.topic   = "Please select a topic.";
    if (!form.message.trim())     e.message = "Please describe your issue.";
    else if (form.message.trim().length < 20) e.message = "Please give us a little more detail (20+ characters).";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    // Simulated async submit — replace with real API call
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  }

  return (
    <div className="bg-white">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="container-app pt-8 pb-6 max-w-3xl">
        <p className="text-base font-bold uppercase tracking-widest text-blue-700 mb-3">
          Support
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
          We&apos;re here to help.
        </h1>
        <p className="mt-3 text-lg text-slate-700 leading-relaxed">
          Every message is read by a real person on our team — no bots, no auto-replies.
        </p>
      </section>

      {/* ── Self-serve first — escape cards ──────────────────────────────── */}
      <section className="container-app pb-8 max-w-3xl">
        <p className="text-sm font-semibold text-slate-500 mb-3">Before you write — your answer might already be here:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/faq"
            className="group flex items-start gap-4 rounded-xl border border-slate-200 bg-slate-50 hover:border-blue-300 hover:bg-blue-50 px-5 py-4 transition-all">
            <div className="mt-0.5 shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round" className="size-5" aria-hidden>
                <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>
              </svg>
            </div>
            <div>
              <p className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors">Frequent Questions</p>
              <p className="text-sm text-slate-600">20 answers to the most common issues.</p>
            </div>
          </Link>
          <Link href="/tutorials"
            className="group flex items-start gap-4 rounded-xl border border-slate-200 bg-slate-50 hover:border-blue-300 hover:bg-blue-50 px-5 py-4 transition-all">
            <div className="mt-0.5 shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round" className="size-5" aria-hidden>
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
              </svg>
            </div>
            <div>
              <p className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors">Tutorials</p>
              <p className="text-sm text-slate-600">Step-by-step guides for every feature.</p>
            </div>
          </Link>
        </div>
      </section>

      {/* ── Divider ───────────────────────────────────────────────────────── */}
      <div className="border-t border-slate-200" />

      {/* ── Contact form ─────────────────────────────────────────────────── */}
      <section className="container-app py-10 max-w-3xl">

        {submitted ? (
          <SuccessState email={form.email} />
        ) : (
          <>
            <h2 className="text-xl font-bold text-slate-900 mb-6">Send us a message</h2>

            <form onSubmit={handleSubmit} noValidate className="space-y-5">

              {/* Name + Email — side by side on sm+ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <LaField name="name" label="Your name" required error={errors.name}>
                  <LaInput
                    id="name"
                    type="text"
                    placeholder="e.g. Priya Nair"
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    status={errors.name ? "error" : "default"}
                    autoComplete="name"
                  />
                </LaField>
                <LaField name="email" label="Email address" required error={errors.email}>
                  <LaInput
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    status={errors.email ? "error" : "default"}
                    autoComplete="email"
                  />
                </LaField>
              </div>

              {/* Topic */}
              <LaField name="topic" label="What is this about?" required error={errors.topic}>
                <LaSelect
                  id="topic"
                  value={form.topic}
                  onChange={(e) => set("topic", e.target.value)}
                  status={errors.topic ? "error" : "default"}
                >
                  {TOPICS.map((t) => (
                    <option key={t.value} value={t.value} disabled={t.value === ""}>
                      {t.label}
                    </option>
                  ))}
                </LaSelect>
              </LaField>

              {/* Urgency / response time note */}
              {selectedTopic?.note && (
                <div className={cn(
                  "flex items-start gap-3 rounded-lg px-4 py-3 text-sm font-medium",
                  selectedTopic.urgent
                    ? "bg-rose-50 border border-rose-200 text-rose-700"
                    : "bg-blue-50 border border-blue-200 text-blue-700"
                )}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round"
                    className="size-4 shrink-0 mt-0.5" aria-hidden>
                    <circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/>
                  </svg>
                  {selectedTopic.note}
                </div>
              )}

              {/* Ad ID — only for relevant topics */}
              {showAdId && (
                <LaField name="adId" label="Ad ID" hint="Optional — the 5-digit ID shown on the listing (e.g. 10042)">
                  <LaInput
                    id="adId"
                    type="text"
                    placeholder="e.g. 10042"
                    value={form.adId}
                    onChange={(e) => set("adId", e.target.value)}
                    maxLength={10}
                  />
                </LaField>
              )}

              {/* Message */}
              <LaField name="message" label="Describe your issue" required error={errors.message}>
                <LaTextarea
                  id="message"
                  rows={5}
                  placeholder="Give us as much detail as you can — what happened, when, and any steps you've already tried."
                  value={form.message}
                  onChange={(e) => set("message", e.target.value)}
                  status={errors.message ? "error" : "default"}
                />
              </LaField>

              {/* Submit */}
              <div className="pt-1 flex items-center gap-4">
                <LaButton
                  type="submit"
                  intent="primary"
                  size="big"
                  loading={loading}
                  disabled={loading}
                >
                  {loading ? "Sending…" : "Send message"}
                </LaButton>
                <p className="text-sm text-slate-500">
                  We&apos;ll reply to your email address above.
                </p>
              </div>

            </form>
          </>
        )}
      </section>

    </div>
  );
}
