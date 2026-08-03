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
import { CONFETTI_CELEBRATION_MS } from "@/config/confetti";

export function useConfettiCelebration() {
  const [celebrating, setCelebrating] = useState(false);

  const celebrate = useCallback(() => {
    setCelebrating(true);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setCelebrating(false);
        resolve();
      }, CONFETTI_CELEBRATION_MS);
    });
  }, []);

  return { celebrating, celebrate };
}
