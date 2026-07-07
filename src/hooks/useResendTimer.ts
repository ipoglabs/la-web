"use client";

import { useEffect, useState } from "react";

export function useResendTimer(
  initialSeconds = 30
) {
  const [seconds, setSeconds] =
    useState(initialSeconds);

  const [enabled, setEnabled] =
    useState(false);

  useEffect(() => {
    if (enabled) return;

    if (seconds <= 0) {
      setEnabled(true);
      return;
    }

    const timer = setTimeout(() => {
      setSeconds((s) => s - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [seconds, enabled]);

  const reset = () => {
    setSeconds(initialSeconds);
    setEnabled(false);
  };

  return {
    seconds,
    enabled,
    reset,
  };
}