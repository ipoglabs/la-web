"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { STEP_ROUTES, STEPS, StepKey } from "./steps";
import { usePostFormStore } from "../store/postFormStore";

function hasText(v: unknown) {
  return typeof v === "string" ? v.trim().length > 0 : Boolean(v);
}

export function computeEarliestMissingStep(state: any): StepKey | null {
  // must have category+subcategory to proceed beyond select-category
  if (!hasText(state.category) || !hasText(state.subcategory)) return "select-category";

  // must have details to proceed beyond details
  if (!hasText(state.name) || !hasText(state.description)) return "details";

  // must have at least 1 image to proceed beyond upload-photo
  if (!Array.isArray(state.images) || state.images.length === 0) return "upload-photo";

  // must have location to proceed beyond pick-location
  const addr = state.location?.address;
  if (!hasText(addr)) return "pick-location";

  return null;
}

/**
 * Guard a page so user cannot skip by URL.
 * Example usage:
 *   useWizardGuard("details")
 */
export function useWizardGuard(current: StepKey) {
  const router = useRouter();
  const state = usePostFormStore();

  useEffect(() => {
    const missing = computeEarliestMissingStep(state);
    if (!missing) return;

    // If earliest missing is BEFORE current, force redirect back.
    const missingIdx = STEPS.indexOf(missing);
    const currentIdx = STEPS.indexOf(current);

    if (missingIdx !== -1 && currentIdx !== -1 && missingIdx < currentIdx) {
      router.replace(STEP_ROUTES[missing]);
    }
  }, [state, current, router]);
}
