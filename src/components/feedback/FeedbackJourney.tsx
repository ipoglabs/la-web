"use client";

import { useState } from "react";
import type { ComponentType } from "react";
import { ArrowRight, ChevronLeft, Sparkles, Smile, Meh, Frown } from "lucide-react";
import { ToggleButtonGroup, ToggleGroupButton } from "@/components/toggle-group/CompoundToggleGroup";
import { LaButton, LaField, LaTextarea } from "@/components/la";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
  REASON_OPTIONS,
  SENTIMENT_OPTIONS,
  type FeedbackPayload,
  type FeedbackSentiment,
} from "./types";

// ── Progress bar ──────────────────────────────────────────────────────────────

const STEP_CONFIG = [
  { bar: "bg-violet-500", barDone: "bg-violet-300" },
  { bar: "bg-pink-500",   barDone: "bg-pink-300"   },
  { bar: "bg-emerald-500",barDone: "bg-emerald-300" },
] as const;

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="flex gap-1.5 px-1 pb-1 shrink-0">
      {STEP_CONFIG.map((s, i) => {
        const n = i + 1;
        return (
          <div key={n} className="flex-1">
            <div
              className={cn(
                "h-1 rounded-full transition-all duration-300",
                step > n   ? s.barDone :
                step === n ? s.bar :
                "bg-slate-200",
              )}
            />
          </div>
        );
      })}
    </div>
  );
}

// ── Sentiment styles ──────────────────────────────────────────────────────────

const SENTIMENT_STYLES: Record<FeedbackSentiment, { base: string; selected: string; icon: string; iconSelected: string }> = {
  great:            { base: "border-slate-200 hover:border-blue-300 hover:bg-blue-50/40",   selected: "border-blue-500  bg-blue-50  text-blue-800",  icon: "text-slate-400", iconSelected: "text-blue-500"  },
  "could-be-better": { base: "border-slate-200 hover:border-amber-300 hover:bg-amber-50/40", selected: "border-amber-500 bg-amber-50 text-amber-800", icon: "text-slate-400", iconSelected: "text-amber-500" },
  frustrating:      { base: "border-slate-200 hover:border-rose-300 hover:bg-rose-50/40",   selected: "border-rose-500  bg-rose-50  text-rose-800",  icon: "text-slate-400", iconSelected: "text-rose-500"  },
};

const SENTIMENT_ICON: Record<FeedbackSentiment, ComponentType<{ className?: string; strokeWidth?: number | string }>> = {
  great:            Smile,
  "could-be-better": Meh,
  frustrating:      Frown,
};

const OPEN_TEXT_CONFIG: Record<FeedbackSentiment, { label: string; hint: string; placeholder: string; required: boolean }> = {
  great: {
    label:       "Anything we could do even better?",
    hint:        "Optional — any small wins or ideas welcome.",
    placeholder: "e.g. The confirmation screen could show my alert summary.",
    required:    false,
  },
  "could-be-better": {
    label:       "What specifically fell short?*",
    hint:        "Be specific — what happened and what would have helped?",
    placeholder: "e.g. The filter options were hard to understand. Labels would help.",
    required:    true,
  },
  frustrating: {
    label:       "What went wrong? How can we fix it?*",
    hint:        "Describe the problem + your suggested fix.",
    placeholder: "e.g. The form kept resetting on mobile. Fix: auto-save progress between steps.",
    required:    true,
  },
};



interface StepSentimentProps {
  sentiment: FeedbackSentiment | null;
  onSentimentChange: (s: FeedbackSentiment) => void;
  onNext: () => void;
  isPopup: boolean;
}

function StepSentiment({ sentiment, onSentimentChange, onNext, isPopup }: StepSentimentProps) {
  return (
    <>
      <div className="flex-1 overflow-y-auto pb-2 bg-slate-100">
        <div className="flex flex-col px-5 pt-5 pb-2 gap-4">
          <p className="text-base font-semibold text-slate-700 text-center">How did this feel?</p>
          <div className="grid grid-cols-3 gap-3">
            {SENTIMENT_OPTIONS.map((item) => {
              const selected = sentiment === item.value;
              const styles = SENTIMENT_STYLES[item.value];
              const Icon = SENTIMENT_ICON[item.value];
              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => onSentimentChange(item.value)}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-2xl border-2 px-2 py-5 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1 active:scale-[0.97]",
                    selected ? styles.selected : cn("bg-white text-slate-700", styles.base),
                  )}
                >
                  <Icon className={cn("h-10 w-10 transition-colors", selected ? styles.iconSelected : styles.icon)} strokeWidth={1.5} aria-hidden />
                  <span className="text-sm font-semibold">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className={cn("shrink-0 border-t border-slate-200 bg-slate-50 px-5 pt-3.5 pb-6", isPopup && "pb-5")}>
        <LaButton
          intent="primary-blue"
          size="big"
          className="w-full"
          disabled={sentiment === null}
          onClick={onNext}
        >
          Continue
          <ArrowRight className="h-4 w-4" />
        </LaButton>
      </div>
    </>
  );
}

// ── Step 2: Reasons + open text ───────────────────────────────────────────────

interface StepReasonsProps {
  sentiment: FeedbackSentiment;
  reasons: string[];
  issueAndImprovement: string;
  allowContact: boolean;
  onToggleReason: (v: string) => void;
  onIssueChange: (v: string) => void;
  onAllowContactChange: (v: boolean) => void;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  submitError: boolean;
  isPopup: boolean;
}

function StepReasons({
  sentiment,
  reasons,
  issueAndImprovement,
  allowContact,
  onToggleReason,
  onIssueChange,
  onAllowContactChange,
  onBack,
  onSubmit,
  isSubmitting,
  submitError,
  isPopup,
}: StepReasonsProps) {
  const reasonOptions = REASON_OPTIONS[sentiment];
  const textConfig = OPEN_TEXT_CONFIG[sentiment];
  const canSubmit = textConfig.required ? issueAndImprovement.trim().length > 0 : true;

  return (
    <>
      <div className="flex-1 overflow-y-auto px-5 pb-4">
        <div className="space-y-5 pt-2">

          {/* Reasons */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-700">What made you feel this way?</p>
            <p className="text-xs-plus italic font-light text-slate-500">Select up to 3.</p>
            <ToggleButtonGroup
              value={reasons}
              onChange={(vals) => {
                // enforce max 3 — add only if under limit, remove always allowed
                const adding = vals.find((v) => !reasons.includes(v));
                if (adding && reasons.length >= 3) return;
                // sync: find removed
                const removed = reasons.find((v) => !vals.includes(v));
                if (removed) onToggleReason(removed);
                else if (adding) onToggleReason(adding);
              }}
              className="gap-0"
            >
              <div className="flex flex-wrap gap-2">
                {reasonOptions.map((opt) => (
                  <ToggleGroupButton
                    key={opt.value}
                    value={opt.value}
                    size="default"
                    disabled={!reasons.includes(opt.value) && reasons.length >= 3}
                  >
                    {opt.label}
                  </ToggleGroupButton>
                ))}
              </div>
            </ToggleButtonGroup>
          </div>

          {/* Open text */}
          <LaField
            name="feedback-issue"
            label={textConfig.label}
            hint={textConfig.hint}
          >
            <LaTextarea
              value={issueAndImprovement}
              onChange={(e) => onIssueChange(e.target.value)}
              maxLength={450}
              rows={4}
              placeholder={textConfig.placeholder}
            />
          </LaField>

          {/* Allow contact */}
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-slate-700">
              The team can follow up with me about this feedback
            </span>
            <Switch
              checked={allowContact}
              onCheckedChange={onAllowContactChange}
            />
          </div>

        </div>
      </div>

      <div className={cn("shrink-0 border-t border-slate-200 bg-slate-50 px-5 pt-3.5 pb-6", isPopup && "pb-5")}>
        {/* TODO [INTEGRATION]: submitError is set on API failure — replace with a toast notification if preferred */}
        {submitError && (
          <p className="text-sm text-rose-600 mb-3">Something went wrong — please try again.</p>
        )}
        <div className="flex items-center gap-2">
          <LaButton intent="secondary" size="default" className="shrink-0" onClick={onBack}>
            <ChevronLeft className="h-4 w-4" />
            Back
          </LaButton>
          <LaButton
            intent="primary-blue"
            size="default"
            className="flex-1"
            disabled={!canSubmit}
            loading={isSubmitting}
            onClick={onSubmit}
          >
            <Sparkles className="h-4 w-4" />
            Submit Feedback
          </LaButton>
        </div>
      </div>
    </>
  );
}

// ── Step 3: Done ──────────────────────────────────────────────────────────────

interface StepDoneProps {
  sentiment: FeedbackSentiment;
  reasons: string[];
  issueAndImprovement: string;
  allowContact: boolean;
  onComplete?: () => void;
  isPopup: boolean;
}

function StepDone({ sentiment, reasons, issueAndImprovement, allowContact, onComplete, isPopup }: StepDoneProps) {
  const sentimentOption = SENTIMENT_OPTIONS.find((s) => s.value === sentiment)!;
  const SentimentIcon = SENTIMENT_ICON[sentiment];
  const reasonLabels = reasons.map(
    (v) => REASON_OPTIONS[sentiment].find((o) => o.value === v)?.label ?? v,
  );

  return (
    <>
      {/* Zone 1: Heading */}
      <div className="shrink-0 bg-violet-700 px-6 pt-6 pb-6 text-center">
        <p className="text-sm font-semibold text-violet-200 uppercase tracking-wide mb-1">Feedback Received</p>
        <h3 className="text-xl font-bold text-white leading-snug">
          Thanks — you&apos;re helping us improve.
        </h3>
      </div>

      {/* Zone 2: Summary */}
      <div className="flex-1 min-h-0 overflow-y-auto bg-slate-100 px-4 py-4 space-y-3">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white divide-y divide-slate-100">

          {/* Sentiment row */}
          <div className="px-4 py-3.5">
            <p className="text-sm font-medium text-slate-600 mb-1.5">You felt</p>
            <div className="flex items-center gap-2">
              <SentimentIcon className={cn("h-5 w-5", SENTIMENT_STYLES[sentiment].iconSelected)} strokeWidth={1.5} aria-hidden />
              <span className="text-sm font-semibold text-slate-900">{sentimentOption.label}</span>
            </div>
          </div>

          {/* Reasons row */}
          {reasonLabels.length > 0 && (
            <div className="px-4 py-3.5">
              <p className="text-sm font-medium text-slate-600 mb-2">Because</p>
              <div className="flex flex-wrap gap-1.5">
                {reasonLabels.map((label) => (
                  <span key={label} className="rounded-full bg-violet-50 px-2.5 py-0.5 text-sm font-medium text-violet-700">
                    {label}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Comment row */}
          {issueAndImprovement && (
            <div className="px-4 py-3.5">
              <p className="text-sm font-medium text-slate-600 mb-1.5">Your note</p>
              <p className="text-sm text-slate-700 leading-relaxed">{issueAndImprovement}</p>
            </div>
          )}

          {/* Allow contact row */}
          <div className="px-4 py-3.5">
            <p className="text-sm font-medium text-slate-600 mb-1">Follow-up</p>
            <p className="text-sm text-slate-700">
              {allowContact ? "Yes — the team can reach out" : "No — keep it anonymous"}
            </p>
          </div>

        </div>
      </div>

      {/* Zone 3: Footer */}
      <div className={cn("shrink-0 border-t border-slate-200 bg-slate-50 px-5 pt-3.5 pb-6 flex justify-center", isPopup && "pb-5")}>
        <LaButton intent="primary-blue" size="default" className="w-[55%]" onClick={onComplete}>
          Done
        </LaButton>
      </div>
    </>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

interface FeedbackJourneyProps {
  className?: string;
  /**
   * TODO [INTEGRATION]: Identifies which feature/page triggered this feedback,
   * e.g. "create-alert", "listing-detail". Sent in the payload for analytics segmentation.
   */
  journey?: string;
  /**
   * TODO [INTEGRATION]: POST the payload to your feedback API endpoint, e.g. POST /api/feedback.
   * Throw on failure — this triggers the inline error state shown to the user.
   */
  onSubmit?: (payload: FeedbackPayload) => Promise<void> | void;
  onComplete?: () => void;
  layout?: "default" | "popup";
}

export default function FeedbackJourney({
  className,
  journey = "",
  onSubmit,
  onComplete,
  layout = "default",
}: FeedbackJourneyProps) {
  const [step, setStep]                           = useState(1);
  const [sentiment, setSentiment]                 = useState<FeedbackSentiment | null>(null);
  const [reasons, setReasons]                     = useState<string[]>([]);
  const [issueAndImprovement, setIssueAndImprovement] = useState("");
  const [allowContact, setAllowContact]           = useState(false);
  const [isSubmitting, setIsSubmitting]           = useState(false);
  const [submitError, setSubmitError]             = useState(false);

  const isPopup = layout === "popup";

  const resetJourney = () => {
    setStep(1);
    setSentiment(null);
    setReasons([]);
    setIssueAndImprovement("");
    setAllowContact(false);
    setSubmitError(false);
  };

  // Resets internal state before surfacing completion to the parent —
  // ensures a fresh journey if the popup is reopened.
  const handleComplete = () => {
    resetJourney();
    onComplete?.();
  };

  const handleSentimentChange = (s: FeedbackSentiment) => {
    setSentiment(s);
    setReasons([]);
  };

  const toggleReason = (value: string) => {
    setReasons((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : prev.length >= 3 ? prev : [...prev, value],
    );
  };

  const handleSubmit = async () => {
    if (!sentiment || !issueAndImprovement.trim()) return;
    const payload: FeedbackPayload = {
      sentiment,
      reasons,
      journey,
      issueAndImprovement: issueAndImprovement.trim(),
      allowContact,
    };
    setIsSubmitting(true);
    setSubmitError(false);
    try {
      // TODO [INTEGRATION]: Replace onSubmit? with your API call — POST /api/feedback with payload
      await onSubmit?.(payload);
      setStep(3);
    } catch {
      // TODO [INTEGRATION]: Optionally surface a toast notification here in addition to the inline error
      setSubmitError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const headerTitle =
    step === 1 ? "Share your experience" :
    step === 2 ? "Tell us more"          :
    null;

  const headerSub =
    step === 1 ? "Quick — under 20 seconds" :
    step === 2 ? "Almost there"             :
    null;

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm",
        isPopup && "rounded-none border-0 shadow-none",
        className,
      )}
    >
      {/* Header */}
      {step < 3 && (
        <div className="shrink-0 px-5 pt-2 pb-2">
          <h2 className="text-lg font-medium text-slate-700">{headerTitle}</h2>
          <p className="text-sm text-slate-500">{headerSub}</p>
        </div>
      )}

      {/* Progress bar */}
      {step < 3 && <ProgressBar step={step} />}

      {/* Step 1 — Sentiment */}
      {step === 1 && (
        <StepSentiment
          sentiment={sentiment}
          onSentimentChange={handleSentimentChange}
          onNext={() => setStep(2)}
          isPopup={isPopup}
        />
      )}

      {/* Step 2 — Reasons + comment */}
      {step === 2 && sentiment && (
        <StepReasons
          sentiment={sentiment}
          reasons={reasons}
          issueAndImprovement={issueAndImprovement}
          allowContact={allowContact}
          onToggleReason={toggleReason}
          onIssueChange={setIssueAndImprovement}
          onAllowContactChange={setAllowContact}
          onBack={() => setStep(1)}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitError={submitError}
          isPopup={isPopup}
        />
      )}

      {/* Step 3 — Done */}
      {step === 3 && sentiment && (
        <StepDone
          sentiment={sentiment}
          reasons={reasons}
          issueAndImprovement={issueAndImprovement}
          allowContact={allowContact}
          onComplete={handleComplete}
          isPopup={isPopup}
        />
      )}
    </div>
  );
}

