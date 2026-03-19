'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Logo from "@/app/assets/la-logo-symbol-color.svg";
import LogoText from "@/app/assets/la-text-black.svg";

export default function ComingSoonPage() {
  const router = useRouter();

  const [clickCount, setClickCount] = useState(0);
  const [showInput, setShowInput] = useState(false);
  const [secret, setSecret] = useState("");

  // If already unlocked redirect to home
  useEffect(() => {
    const unlocked = localStorage.getItem("lokalads_unlock");
    if (unlocked === "true") {
      router.replace("/");
    }
  }, [router]);

  const handleLogoClick = () => {
    const count = clickCount + 1;
    setClickCount(count);

    if (count >= 5) {
      setShowInput(true);
    }
  };

  const verifyKey = async () => {
    try {
      const res = await fetch("/api/unlock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ key: secret }),
      });

      if (res.ok) {
        localStorage.setItem("lokalads_unlock", "true");

        // redirect to homepage
        router.replace("/");
      } else {
        alert("Invalid key");
        setSecret("");
      }
    } catch {
      alert("Something went wrong");
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white px-4 text-center">

      {/* Logo */}
      <div
        onClick={handleLogoClick}
        className="flex gap-2 items-center mb-6 cursor-pointer select-none"
      >
        <Image className="size-10" src={Logo} alt="logo" />
        <Image className="w-24 max-sm:hidden" src={LogoText} alt="logo text" />
      </div>

      {/* Coming Soon Text */}
      <h1 className="text-4xl sm:text-5xl font-bold mb-4">Coming Soon</h1>

      <p className="text-lg sm:text-xl text-slate-300 mb-8">
        We’re working hard to bring something amazing. Stay tuned!
      </p>

      {/* Secret Input */}
      {showInput && (
        <div className="flex gap-2 mt-4">
          <input
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") verifyKey();
            }}
            placeholder="Enter secret key"
            className="px-3 py-2 rounded text-black"
          />

          <button
            onClick={verifyKey}
            className="bg-white text-black px-4 py-2 rounded hover:bg-slate-200 transition"
          >
            Unlock
          </button>
        </div>
      )}
    </main>
  );
}