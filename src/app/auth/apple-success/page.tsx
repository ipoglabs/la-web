"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import ConfettiButton from "@/components/confettibutton";
import { useConfettiCelebration } from "@/lib/hooks/useConfettiCelebration";

/** Mirrors auth/google-success/page.tsx exactly. */
export default function AppleSuccessPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const { celebrating, celebrate } = useConfettiCelebration();

  useEffect(() => {
    async function hydrate() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.user) {
          setAuth(null, data.user);
        }
      } catch {
        // session cookie is already set — user can still navigate
      }

      await celebrate();

      const redirectTo = localStorage.getItem("redirectAfterLogin");
      if (redirectTo) {
        localStorage.removeItem("redirectAfterLogin");
        router.push(redirectTo);
      } else {
        router.push("/");
      }

      // Force the root layout (Server Component) to re-run getSession() so
      // AppHeader picks up the freshly-set session cookie immediately.
      router.refresh();
    }

    hydrate();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      {celebrating && <ConfettiButton autoFire showButton={false} />}
      <p className="text-slate-500 text-sm animate-pulse">Signing you in...</p>
    </div>
  );
}
