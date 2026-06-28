"use client";

import { CheckCircle2, XCircle, Loader2, Circle } from "lucide-react";

export type SubmitStepStatus = "pending" | "active" | "done" | "error";

export type SubmitStep = {
  key: string;
  label: string;
};

export const SUBMIT_STEPS: SubmitStep[] = [
  { key: "validate", label: "Validating details" },
  { key: "upload", label: "Uploading photos" },
  { key: "build", label: "Preparing your ad" },
  { key: "save", label: "Saving to server" },
  { key: "finalize", label: "Finishing up" },
];

function StepIcon({ status }: { status: SubmitStepStatus }) {
  if (status === "done") return <CheckCircle2 className="text-green-500" size={20} />;
  if (status === "active") return <Loader2 className="text-slate-700 animate-spin" size={20} />;
  if (status === "error") return <XCircle className="text-red-500" size={20} />;
  return <Circle className="text-gray-300" size={20} />;
}

export default function SubmitProgressModal({
  steps = SUBMIT_STEPS,
  status,
  errorMessage,
}: {
  steps?: SubmitStep[];
  status: Record<string, SubmitStepStatus>;
  errorMessage?: string | null;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-base font-semibold mb-4">Submitting your ad…</h3>

        <ul className="space-y-3">
          {steps.map((step) => {
            const s = status[step.key] ?? "pending";
            return (
              <li key={step.key} className="flex items-center gap-3">
                <StepIcon status={s} />
                <span
                  className={
                    s === "done"
                      ? "text-sm text-gray-700"
                      : s === "error"
                      ? "text-sm text-red-600"
                      : s === "active"
                      ? "text-sm text-slate-900 font-medium"
                      : "text-sm text-gray-400"
                  }
                >
                  {step.label}
                </span>
              </li>
            );
          })}
        </ul>

        {errorMessage && (
          <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
            {errorMessage}
          </div>
        )}
      </div>
    </div>
  );
}
