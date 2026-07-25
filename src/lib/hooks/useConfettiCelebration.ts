"use client";

/**
 * useConfettiCelebration — pairs with `<ConfettiButton autoFire showButton={false} />`
 * for one-off success moments (registration/login) that redirect right
 * after a toast. `celebrate()` shows the confetti burst and resolves once
 * it's had time to actually register visually, so callers can `await` it
 * before navigating away instead of firing confetti the same tick as an
 * `router.push()` (which would never actually render).
 */
import { useCallback, useState } from "react";

// react-confetti's own particle-count ramp is forced to ~400ms (see
// ConfettiButton's `tweenDuration`) — this just needs to comfortably outlast
// that ramp plus a beat to actually register with the user before whatever
// called celebrate() navigates away.
const CELEBRATION_MS = 1800;

export function useConfettiCelebration() {
  const [celebrating, setCelebrating] = useState(false);

  const celebrate = useCallback(() => {
    setCelebrating(true);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setCelebrating(false);
        resolve();
      }, CELEBRATION_MS);
    });
  }, []);

  return { celebrating, celebrate };
}
