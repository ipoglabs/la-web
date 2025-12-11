"use client";
import React from "react";
import { useRouter, usePathname } from "next/navigation";

interface PostFooterProps {
  showCancel?: boolean;
  showBack?: boolean;
  showNext?: boolean;
  showSubmit?: boolean;
  nextLabel?: string;
  submitLabel?: string;

  steps?: string[];      // defaults below
  basePath?: string;     // defaults to "/post"

  onBack?: () => void;
  onNext?: () => void;
  onCancel?: () => void;
  onSubmit?: () => void;

  isNextDisabled?: boolean;
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
  } = props;

  const router = useRouter();
  const pathname = usePathname() || "";

  const baseBtn =
    "rounded-full px-8 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black transition-colors cursor-pointer";
  const mutedBtn = `${baseBtn} bg-slate-200/80 text-foreground hover:bg-slate-300/80`;
  const darkBtn = `${baseBtn} bg-slate-950 text-white hover:bg-slate-800`;

  // --- Robust current step detection: get the FIRST segment after basePath
  // e.g. pathname = "/post/upload-photo" -> relative = "/upload-photo" -> segment = "upload-photo"
  const normalize = (p: string) => (p.endsWith("/") ? p.slice(0, -1) : p);
  const normBase = normalize(basePath);
  const normPath = normalize(pathname);

  let currentSegment = "";
  if (normPath === normBase) {
    currentSegment = ""; // you're at /post
  } else if (normPath.startsWith(normBase + "/")) {
    const relative = normPath.slice((normBase + "/").length); // "upload-photo/xyz" or "upload-photo"
    currentSegment = relative.split("/")[0] || "";
  }

  const currentStep = steps.indexOf(currentSegment);
  const firstStep = steps[0];
  const lastStepIndex = steps.length - 1;

  /** LEFT: Cancel or Back */
  const handleLeftBtnClick = () => {
    if (showCancel) {
      if (onCancel) return onCancel();
      router.push(basePath);
      return;
    }

    if (showBack) {
      if (onBack) return onBack();

      if (currentStep === -1) {
        router.push(basePath);
        return;
      }
      if (currentStep > 0) {
        router.push(`${basePath}/${steps[currentStep - 1]}`);
        return;
      }
      // at first step -> go base
      router.push(basePath);
    }
  };

  /** RIGHT: Next or Submit */
  const handleRightBtnClick = () => {
    if (showSubmit) {
      if (onSubmit) return onSubmit();
      // default submit target (adjust if you have a real publish route)
      router.push(`${basePath}/congratulations`);
      return;
    }

    if (showNext) {
      if (onNext) return onNext();

      if (currentStep === -1) {
        // not on any step -> start at first
        router.push(`${basePath}/${firstStep}`);
        return;
      }
      if (currentStep < lastStepIndex) {
        router.push(`${basePath}/${steps[currentStep + 1]}`);
      }
    }
  };

  return (
    <footer className="rounded-full w-full px-4 py-4 bg-background border border-gray-100 flex items-center justify-between shadow-sm">
      <div className="flex-1 flex justify-start">
        {(showCancel || showBack) && (
          <button type="button" onClick={handleLeftBtnClick} className={mutedBtn}>
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
            disabled={showNext && isNextDisabled}
          >
            {showSubmit ? submitLabel : nextLabel}
          </button>
        )}
      </div>
    </footer>
  );
}
