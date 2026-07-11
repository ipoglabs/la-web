"use client";

/**
 * ReportAdJourney.tsx
 *
 * 3-screen report flow inside ReportAdPopup.
 * Layout contract: flex-col, full height — flex-1 min-h-0 scroll zone + shrink-0 sticky footer per screen.
 *
 * Screen 1 — Collect: ad card + issue pill toggles + details textarea + identity toggle
 * Screen 2 — Review:  full summary + acknowledgement checkbox before submit
 * Screen 3 — Status:  ticket ID + what happens next
 *
 * TODO [INTEGRATION]: Replace simulateSubmit() with POST /api/reports.
 * TODO [INTEGRATION]: Pass reporterId from session into payload.
 * TODO [INTEGRATION]: On 429 → "You've already reported this ad."
 */

import { useState } from "react";
import { ArrowRight, ChevronLeft, Flag, AlertTriangle, Circle, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { ToggleButtonGroup, ToggleGroupButton } from "@/components/toggle-group/CompoundToggleGroup";
import { LaButton, LaField, LaTextarea } from "@/components/la";
import { cn } from "@/lib/utils";
import WhatsNext from "@/components/la-blocks/WhatsNext";
import {
  REPORT_ISSUE_OPTIONS,
  generateDemoTicketId,
  deriveReportPriority,
  type ReportAdTarget,
  type ReportAdPayload,
  type ReportAdTicket,
  type ReportIssue,
} from "./types";

// ── Shared: Ad context card ───────────────────────────────────────────────────

function AdContextCard({ target }: { target: ReportAdTarget }) {
  return (
    <div className="rounded-xl border border-slate-300 bg-stone-50 overflow-hidden">
      <div className="flex items-center gap-3 p-3">
        <div className="relative shrink-0 w-14 h-14 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
          {target.thumbnail ? (
            <Image src={target.thumbnail} alt={target.title} fill className="object-cover" sizes="56px" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Flag className="w-5 h-5 text-slate-400" aria-hidden />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0 space-y-0.5">
          <p className="text-sm font-semibold text-slate-900 truncate leading-snug">{target.title}</p>
          <p className="text-xs text-slate-500 truncate">{target.sellerName} · {target.location}</p>
          <div className="inline-flex items-center gap-1 bg-slate-100 border border-slate-300 rounded px-1.5 py-0.5">
            <span className="text-[12px] font-mono text-slate-400 uppercase tracking-wide">Ad ID</span>
            <span className="text-[12px] font-bold text-slate-700">{target.adId}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Screen 1: Collect ─────────────────────────────────────────────────────────

interface Screen1Props {
  target:          ReportAdTarget;
  issues:          ReportIssue[];
  details:         string;
  onIssueChange:   (vals: string[]) => void;
  onDetailsChange: (v: string) => void;
  onNext:          () => void;
  isPopup:         boolean;
}

function Screen1Collect({
  target, issues, details,
  onIssueChange, onDetailsChange,
  onNext, isPopup,
}: Screen1Props) {
  return (
    <>
      <div className="flex-1 min-h-0 overflow-y-auto px-5 py-4 space-y-5">

        {/* Ad being reported */}
        <div className="space-y-1.5">
          <p className="text-xs-plus font-medium uppercase tracking-wide text-slate-700">Reporting this ad</p>
          <AdContextCard target={target} />
          <div className="flex items-center gap-1.5 pt-0.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" aria-hidden />
            <p className="text-xs text-slate-500">False reports may result in account restrictions.</p>
          </div>
        </div>

        {/* Issue pill toggles — same style as Create Alert */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-800">What is the issue?</p>
          <p className="text-xs text-slate-500">Select all that apply.</p>
          <ToggleButtonGroup
            value={issues}
            onChange={onIssueChange}
            className="gap-0"
          >
            <div className="flex flex-wrap gap-2">
              {REPORT_ISSUE_OPTIONS.map((opt) => (
                <ToggleGroupButton key={opt.value} value={opt.value} size="default" icon={Circle} iconSelected={CheckCircle2}>
                  {opt.label}
                </ToggleGroupButton>
              ))}
            </div>
          </ToggleButtonGroup>
        </div>

        {/* Details textarea */}
        <LaField
          name="report-details"
          label="Tell us more (optional)"
          hint="Any extra context helps our team investigate faster. Max 500 chars."
        >
          <LaTextarea
            value={details}
            onChange={(e) => onDetailsChange(e.target.value)}
            maxLength={500}
            rows={3}
            placeholder="e.g. Price changed overnight from RM 50,000 to RM 500 — looks like a scam."
          />
        </LaField>

      </div>

      <div className={cn("shrink-0 border-t border-slate-200 bg-slate-50 px-5 pt-3.5 pb-6", isPopup && "pb-5")}>
        <LaButton
          intent="primary-rose"
          size="big"
          className="w-full"
          disabled={issues.length === 0}
          onClick={onNext}
        >
          Review Report
          <ArrowRight className="h-4 w-4" />
        </LaButton>
      </div>
    </>
  );
}

// ── Screen 2: Review + Acknowledgement ───────────────────────────────────────

interface Screen2Props {
  target:       ReportAdTarget;
  issues:       ReportIssue[];
  details:      string;
  onBack:       () => void;
  onSubmit:     () => void;
  isSubmitting: boolean;
  submitError:  boolean;
  isPopup:      boolean;
}

function Screen2Review({
  target, issues, details,
  onBack, onSubmit, isSubmitting, submitError, isPopup,
}: Screen2Props) {
  const [acknowledged, setAcknowledged] = useState(false);

  const issueLabels = issues.map(
    (v) => REPORT_ISSUE_OPTIONS.find((o) => o.value === v)?.label ?? v,
  );

  return (
    <>
      <div className="flex-1 min-h-0 overflow-y-auto px-5 py-5 space-y-4">

        {/* Ad */}
        <div className="space-y-0.5">
          <p className="text-sm font-light  text-slate-900">You are reporting</p>
          <p className="text-base font-bold text-slate-900 leading-snug">{target.title}</p>
          <p className="text-xs text-slate-800">{target.sellerName} · {target.location}</p>
          <span className="inline-flex items-center gap-1 rounded bg-rose-50 border border-rose-200 px-1.5 py-0.5 mt-1">
            <span className="text-sm font-mono text-rose-400 uppercase tracking-wide">Ad</span>
            <span className="text-sm font-bold text-rose-600">{target.adId}</span>
          </span>
        </div>

        <div className="border-t border-slate-100" />

        {/* Issues */}
        <div className="space-y-2">
          <p className="text-sm font-light text-slate-900">Selected issues</p>
          <div className="flex flex-wrap gap-1.5">
            {issueLabels.map((label) => (
              <span
                key={label}
                className="inline-flex rounded-full bg-slate-200 text-slate-800 border border-slate-300 px-3.5 py-1 text-sm font-medium"
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Details */}
        {details.trim() && (
          <>
            <div className="border-t border-slate-100" />
            <div className="space-y-1">
              <p className="text-sm font-light text-slate-900">Additional details</p>
              <p className="text-sm text-slate-800 font-medium leading-relaxed">{details}</p>
            </div>
          </>
        )}

        <div className="border-t border-slate-100" />

        {/* Acknowledgement */}
        <label className="flex items-start gap-3 cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <input
            type="checkbox"
            checked={acknowledged}
            onChange={(e) => setAcknowledged(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-blue-600 cursor-pointer"
          />
          <span className="text-sm text-slate-600 leading-snug">
            I confirm this report is accurate. False reports may lead to account restrictions.
          </span>
        </label>

      </div>

      <div className={cn("shrink-0 border-t border-slate-200 bg-slate-50 px-5 pt-3.5 pb-6", isPopup && "pb-5")}>
        {submitError && (
          <p className="text-sm text-rose-600 mb-3">Something went wrong — please try again.</p>
        )}
        <div className="flex items-center gap-2">
          <LaButton intent="secondary" size="default" className="shrink-0" onClick={onBack}>
            <ChevronLeft className="h-4 w-4" />
            Back
          </LaButton>
          <LaButton
            intent="primary-rose"
            size="default"
            className="flex-1"
            disabled={!acknowledged}
            loading={isSubmitting}
            onClick={onSubmit}
          >
            <Flag className="h-4 w-4" />
            Submit Report
          </LaButton>
        </div>
      </div>
    </>
  );
}

// ── Screen 3: Status ──────────────────────────────────────────────────────────

interface Step3Props {
  ticket:     ReportAdTicket;
  target:     ReportAdTarget;
  issues:     ReportIssue[];
  onComplete: () => void;
  isPopup:    boolean;
}

function Step3Done({ ticket, target, issues, onComplete, isPopup }: Step3Props) {
  const selectedLabels = issues.map(
    (v) => REPORT_ISSUE_OPTIONS.find((o) => o.value === v)?.label ?? v,
  );
  const priority = deriveReportPriority(issues);

  const priorityConfig = {
    high:   { label: "High Priority",   cls: "bg-rose-100 text-rose-700 border-rose-200"   },
    medium: { label: "Medium Priority", cls: "bg-amber-100 text-amber-700 border-amber-200" },
    low:    { label: "Low Priority",    cls: "bg-slate-100 text-slate-600 border-slate-200" },
  } as const;

  return (
    <>
      {/* Header — icon + simple thank you */}
      <div className="shrink-0 bg-rose-500 px-6 pt-6 pb-6 text-center">
        <div className="flex items-center justify-center mb-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white">
            <svg className="w-6 h-6 text-rose-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
        </div>
        <p className="text-xs font-semibold text-rose-100 uppercase tracking-widest mb-1">Report Submitted</p>
        <h3 className="text-lg font-bold text-white leading-snug">
          Thank you for keeping our community safe.
        </h3>
      </div>

      {/* Scrollable summary */}
      <div className="flex-1 min-h-0 overflow-y-auto bg-slate-50 px-5 py-4 space-y-4">

        {/* Ticket ID + priority */}
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-slate-400 mb-0.5">Ticket ID</p>
            <p className="text-sm font-bold tracking-wider font-mono text-slate-800">{ticket.ticketId}</p>
          </div>
          <span className={cn(
            "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold shrink-0",
            priorityConfig[priority].cls,
          )}>
            {priorityConfig[priority].label}
          </span>
        </div>
        <div className="space-y-3">
          <div className="space-y-0.5">
            <p className="text-xs text-slate-400">Reported ad</p>
            <p className="text-sm font-semibold text-slate-900 leading-snug">{target.title}</p>
            <p className="text-xs text-slate-500">Ad ID: {target.adId}</p>
          </div>
          <div className="space-y-1.5">
            <p className="text-xs text-slate-400">Issues reported</p>
            <div className="flex flex-wrap gap-1.5">
              {selectedLabels.map((label) => (
                <span key={label} className="inline-flex rounded-full bg-slate-200 text-slate-800 border border-slate-300 px-3.5 py-1 text-sm font-medium">
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200" />

        {/* What happens next */}
        <WhatsNext
          heading="What happens next"
          data={[
            { title: "Under review",     description: "We'll look into this within 24–48 hours.", isCompleted: true },
            { title: "Action if needed", description: "Violating ads will be removed.",            isCompleted: false },
            { title: "We may follow up", description: "We'll reach out if we need more details.",  isCompleted: false },
          ]}
        />

      </div>

      {/* Footer */}
      <div className={cn("shrink-0 border-t border-slate-200 bg-slate-50 px-5 pt-3.5 pb-6", isPopup && "pb-5")}>
        <LaButton
          intent="primary"
          size="big"
          className="w-full"
          onClick={onComplete}
        >
          Done
        </LaButton>
      </div>
    </>
  );
}

// ── Root journey component ────────────────────────────────────────────────────

export interface ReportAdJourneyProps {
  target:         ReportAdTarget;
  className?:     string;
  layout?:        "popup" | "standalone";
  onSubmit?:      (payload: ReportAdPayload) => Promise<ReportAdTicket> | ReportAdTicket | void;
  onComplete?:    () => void;
  onStepChange?:  (step: 1 | 2 | 3) => void;
}

/**
 * ReportAdJourney
 *
 * Self-contained 3-step report flow. Designed to run inside ReportAdPopup
 * (Drawer on mobile / Dialog on tablet+) but also works standalone.
 *
 * TODO [INTEGRATION]: Replace the simulated submit with a real API call:
 *
 *   const response = await fetch('/api/reports', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify(payload),
 *   });
 *   if (!response.ok) throw new Error('submit_failed');
 *   const { ticketId } = await response.json();
 *   return { ticketId, status: 'pending', createdAt: new Date().toISOString() };
 */
export default function ReportAdJourney({
  target,
  className,
  layout = "popup",
  onSubmit,
  onComplete,
  onStepChange,
}: ReportAdJourneyProps) {
  const isPopup = layout === "popup";

  const [step,         setStep]         = useState<1 | 2 | 3>(1);
  const [issues,       setIssues]       = useState<ReportIssue[]>([]);
  const [details,      setDetails]      = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError,  setSubmitError]  = useState(false);
  const [ticket,       setTicket]       = useState<ReportAdTicket | null>(null);

  function goToStep(s: 1 | 2 | 3) {
    setStep(s);
    onStepChange?.(s);
  }

  async function handleSubmit() {
    setIsSubmitting(true);
    setSubmitError(false);

    const payload: ReportAdPayload = {
      adId:        target.adId,
      adTitle:     target.title,
      adThumbnail: target.thumbnail ?? "",
      sellerName:  target.sellerName,
      location:    target.location,
      issues,
      details,
      hideIdentity: true,
    };

    try {
      let result: ReportAdTicket;

      if (onSubmit) {
        const returned = await onSubmit(payload);
        result = returned ?? {
          ticketId:  generateDemoTicketId(),
          status:    "pending",
          createdAt: new Date().toISOString(),
        };
      } else {
        await new Promise((r) => setTimeout(r, 900));
        result = {
          ticketId:  generateDemoTicketId(),
          status:    "pending",
          createdAt: new Date().toISOString(),
        };
      }

      setTicket(result);
      goToStep(3);
    } catch {
      setSubmitError(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  const headerTitle =
    step === 1 ? "Report an Ad"     :
    step === 2 ? "Review Report"    :
    null;

  const headerSub =
    step === 1 ? "Select issues and add details" :
    step === 2 ? "Check details before submitting" :
    null;

  return (
    <div className={cn("flex flex-col h-full", className)}>

      {/* Header — feedback-style title */}
      {step < 3 && (
        <div className="shrink-0 px-5 pt-4 pb-2">
          <h2 className="text-lg font-medium text-slate-700">{headerTitle}</h2>
          <p className="text-sm text-slate-500">{headerSub}</p>
        </div>
      )}

      {step === 1 && (
        <Screen1Collect
          target={target}
          issues={issues}
          details={details}
          onIssueChange={(vals) => setIssues(vals as ReportIssue[])}
          onDetailsChange={setDetails}
          onNext={() => goToStep(2)}
          isPopup={isPopup}
        />
      )}

      {step === 2 && (
        <Screen2Review
          target={target}
          issues={issues}
          details={details}
          onBack={() => goToStep(1)}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitError={submitError}
          isPopup={isPopup}
        />
      )}

      {step === 3 && ticket && (
        <Step3Done
          ticket={ticket}
          target={target}
          issues={issues}
          onComplete={onComplete ?? (() => {})}
          isPopup={isPopup}
        />
      )}

    </div>
  );
}
