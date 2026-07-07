import { useState, useEffect, useCallback } from "react";

export function useResendTimer(duration = 30) {
  const [seconds, setSeconds] = useState(duration);
  const [enabled, setEnabled] = useState(false);
  const [resetCount, setResetCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(id);
          setEnabled(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [resetCount]);

  const reset = useCallback(() => {
    setSeconds(duration);
    setEnabled(false);
    setResetCount((c) => c + 1);
  }, [duration]);

  return { seconds, enabled, reset };
}
