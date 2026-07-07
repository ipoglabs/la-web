"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import Logo from "@/app/assets/la-logo-symbol-color.svg";
import LogoText from "@/app/assets/la-text-black.svg";

export default function SiteGate({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState<boolean>(false);
  const [tapCount, setTapCount] = useState(0);
  const [showInput, setShowInput] = useState(false);
  const [secret, setSecret] = useState("");
  const [error, setError] = useState("");

  /* ✅ Check localStorage */
  useEffect(() => {
    const isUnlocked = localStorage.getItem("lokalads_unlock");
    if (isUnlocked === "true") {
      setUnlocked(true);
    }
  }, []);

  /* ✅ Reset tap count after 3s (UX improvement) */
  useEffect(() => {
    if (tapCount === 0) return;

    const timer = setTimeout(() => {
      setTapCount(0);
    }, 3000);

    return () => clearTimeout(timer);
  }, [tapCount]);

  /* ✅ Handle logo clicks */
  const handleLogoClick = () => {
    setTapCount((prev) => {
      const next = prev + 1;

      if (next >= 5) {
        setShowInput(true);
      }

      return next;
    });
  };

  /* ✅ Unlock handler */
  const handleUnlock = async () => {
    setError("");

    try {
      const res = await fetch("/api/unlock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ key: secret }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("lokalads_unlock", "true");
        setUnlocked(true);
      } else {
        setError("Invalid secret key");
      }
    } catch (e) {
      setError("Something went wrong");
    }
  };

  /* ✅ ENTER KEY SUPPORT */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleUnlock();
    }
  };

  /* ✅ Unlocked → show app */
  if (unlocked) {
    return <>{children}</>;
  }

  /* 🔒 Overlay */
  return (
    <div className="relative">
      {/* 🔹 Background (blurred + disabled) */}
      <div className="blur-md pointer-events-none select-none">
        {children}
      </div>

      {/* 🔹 Overlay */}
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/70 backdrop-blur-lg">

        {/* LOGO (CLICKABLE) */}
        <div
          className="flex flex-col items-center cursor-pointer animate-fadeIn"
          onClick={handleLogoClick}
        >
          <Image src={Logo} alt="logo" className="w-14 h-14 mb-2" />
          <Image src={LogoText} alt="logo text" className="w-28 hidden sm:block" />
        </div>

        <p className="text-lg font-semibold text-gray-500 mt-6 mb-2"> We are preparing something awesome 🚀</p>
        

        {/* SECRET INPUT */}
        {showInput && (
          <div className="flex flex-col items-center gap-3 animate-fadeIn">
            <input
              type="password"
              placeholder="Enter secret key"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              onKeyDown={handleKeyDown}
              className="border px-4 py-2 rounded w-64 text-center focus:outline-none focus:ring-2 focus:ring-black"
            />

            {/* <button
              onClick={handleUnlock}
              className="bg-black text-white px-4 py-2 rounded hover:opacity-90 transition"
            >
              Unlock
            </button> */}

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}