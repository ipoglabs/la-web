'use client'
import { useEffect, useState } from 'react'
import Confetti from 'react-confetti'
import { useWindowSize } from 'react-use'

interface ConfettiButtonProps {
  /** Fires the confetti burst as soon as this mounts — no click needed.
   *  Pair with `showButton={false}` for a fire-and-forget celebration
   *  (e.g. registration/login success) rather than a persistent button. */
  autoFire?: boolean
  /** Hide the "🎉 Celebrate!" trigger button. Defaults to visible so
   *  existing click-to-fire usage is unaffected. */
  showButton?: boolean
  numberOfPieces?: number
  durationMs?: number
}

export default function ConfettiButton({
  autoFire = false,
  showButton = true,
  numberOfPieces = 400,
  durationMs = 5000,
}: ConfettiButtonProps) {
  const { width, height } = useWindowSize()
  // Seeded from `autoFire` at mount time (this component is meant to be
  // mounted fresh per burst — see `showButton={false}` usage), so the
  // effect below only ever needs to manage the auto-stop timer, never an
  // initial setState (avoids the cascading-render lint rule).
  const [fire, setFire] = useState(autoFire)

  useEffect(() => {
    if (!autoFire) return
    const timer = setTimeout(() => setFire(false), durationMs)
    return () => clearTimeout(timer)
  }, [autoFire, durationMs])

  const handleClick = () => {
    setFire(true)
    // Stop after `durationMs`
    setTimeout(() => setFire(false), durationMs)
  }

  return (
    <>
      {fire && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={numberOfPieces}
          // react-confetti ramps particle count in gradually over
          // `tweenDuration` (defaults to 5000ms) — far longer than the
          // ~1.2-2s window autoFire callers actually keep this mounted for,
          // so the burst barely gets going before being cut off. Force a
          // fast ramp so the full piece count is visible almost immediately.
          tweenDuration={400}
          onConfettiComplete={() => setFire(false)}
        />
      )}

      {showButton && (
        <button
          onClick={handleClick}
          className="px-6 py-3 bg-emerald-500 text-white font-bold rounded-full shadow-lg hover:bg-emerald-600 active:scale-95 transition"
        >
          🎉 Celebrate!
        </button>
      )}
    </>
  )
}
