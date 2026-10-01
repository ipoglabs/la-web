"use client";

import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

/**
 * True when the current step was opened from the review page's "Change"
 * button. Read from window.location rather than useSearchParams so the step
 * pages don't need a Suspense boundary.
 */
export function useFromReview() {
  return useSyncExternalStore(
    noopSubscribe,
    () => new URLSearchParams(window.location.search).get("from") === "review",
    () => false
  );
}
