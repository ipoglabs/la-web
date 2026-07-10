"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export default function GoogleSuccessPage() {
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
        window.dispatchEvent(new Event("auth-changed"));
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
    }

    hydrate();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-slate-500 text-sm animate-pulse">Signing you in...</p>
    </div>
  );
}