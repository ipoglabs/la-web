'use client'
import { useState } from 'react'
import Confetti from 'react-confetti'
import { useWindowSize } from 'react-use'

export default function ConfettiButton() {
  const { width, height } = useWindowSize()
  const [fire, setFire] = useState(false)

  const handleClick = () => {
    setFire(true)
    // Stop after 5 seconds
    setTimeout(() => setFire(false), 5000)
  }

  return (
    <>
      {fire && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={400}
          onConfettiComplete={() => setFire(false)}
        />
      )}

      <button
        onClick={handleClick}
        className="px-6 py-3 bg-emerald-500 text-white font-bold rounded-full shadow-lg hover:bg-emerald-600 active:scale-95 transition"
      >
        🎉 Celebrate!
      </button>
    </>
  )
}