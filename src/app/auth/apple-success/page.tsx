"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

/** Mirrors auth/google-success/page.tsx exactly. */
export default function AppleSuccessPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

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
      <p className="text-slate-500 text-sm animate-pulse">Signing you in...</p>
    </div>
  );
}
