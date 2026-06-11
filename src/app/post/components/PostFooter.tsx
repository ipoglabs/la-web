"use client";

import React, { useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";

interface PostFooterProps {
  showCancel?: boolean;
  showBack?: boolean;
  showNext?: boolean;
  showSubmit?: boolean;
  nextLabel?: string;
  submitLabel?: string;

  step?: string;
  steps?: string[];
  basePath?: string;

  onBack?: () => void;
  onNext?: () => void;
  onCancel?: () => void;
  onSubmit?: () => void;

  isNextDisabled?: boolean;
  submitting?: boolean;

  showProgress?: boolean;
}

const REAL_STEPS = [
  "select-category",
  "details",
  "upload-photo",
  "pick-location",
  "preview",
];

export default function PostFooter(props: PostFooterProps) {
  const {
    showBack = true,
    showNext = true,
    showSubmit = false,
    showCancel = false,
    nextLabel = "Next",
    submitLabel = "Submit",

    steps = REAL_STEPS,
    basePath = "/post",

    onBack,
    onNext,
    onCancel,
    onSubmit,

    isNextDisabled = false,
    submitting = false,
    showProgress = true,
  } = props;

  const router = useRouter();
  const pathname = usePathname() || "";

  const baseBtn =
    "rounded-full px-8 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black transition-colors cursor-pointer";
  const mutedBtn = `${baseBtn} bg-slate-200/80 text-foreground hover:bg-slate-300/80`;
  const darkBtn = `${baseBtn} bg-slate-950 text-white hover:bg-slate-800`;

  // Robust step detection
  const currentStepIndex = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    const postIndex = segments.indexOf("post");

    if (postIndex === -1) return -1;

    const step = segments[postIndex + 1] || "";
    return steps.indexOf(step);
  }, [pathname, steps]);

  const totalSteps = steps.length;

  const handleLeftBtnClick = () => {
    if (showCancel) {
      if (onCancel) return onCancel();
      router.push(basePath);
      return;
    }

    if (showBack) {
      if (onBack) return onBack();

      if (currentStepIndex > 0) {
        router.push(`${basePath}/${steps[currentStepIndex - 1]}`);
      } else {
        router.push(basePath);
      }
    }
  };

  const handleRightBtnClick = () => {
    if (showSubmit) {
      if (onSubmit) return onSubmit();
      router.push(`${basePath}/congratulation`);
      return;
    }

    if (showNext) {
      if (onNext) return onNext();

      if (currentStepIndex < totalSteps - 1) {
        router.push(`${basePath}/${steps[currentStepIndex + 1]}`);
      }
    }
  };

  const progressPercent =
    currentStepIndex >= 0
      ? ((currentStepIndex + 1) / totalSteps) * 100
      : 0;

  return (
    <div className="w-full">
      {showProgress && currentStepIndex >= 0 && (
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>
              Step {currentStepIndex + 1} / {totalSteps}
            </span>
            <span className="capitalize">
              {steps[currentStepIndex]?.replace("-", " ")}
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-2 bg-slate-950 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      <footer className="rounded-full w-full px-4 py-4 bg-background border border-gray-100 flex items-center justify-between shadow-sm">
        <div className="flex-1 flex justify-start">
          {(showCancel || showBack) && (
            <button
              type="button"
              onClick={handleLeftBtnClick}
              className={mutedBtn}
            >
              {showCancel ? "Cancel" : "Back"}
            </button>
          )}
        </div>

        <div className="flex-1 flex justify-end">
          {(showSubmit || showNext) && (
            <button
              type="button"
              onClick={handleRightBtnClick}
              className={darkBtn}
              disabled={(showNext && isNextDisabled) || submitting}
            >
              {submitting ? "Submitting…" : showSubmit ? submitLabel : nextLabel}
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}
