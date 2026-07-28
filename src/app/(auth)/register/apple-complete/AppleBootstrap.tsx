"use client";

/** Mirrors register/google-complete/GoogleBootstrap.tsx, with one
 *  divergence: unlike Google, Apple never gives us a trustworthy email (see
 *  apple-callback/route.ts's header) — `identifier` is left null here
 *  rather than set to `appleData.appleEmailId` (that's a lookup key, not a
 *  real address). Every Apple sign-up is routed to `/register/apple-email`
 *  next to collect + OTP-verify a real one before Details/Role, instead of
 *  straight to `/register/details` like Google. One more Apple-specific
 *  note (from the old AppleCompleteForm this replaced): Apple's id_token
 *  carries no `name` claim in practice, so `appleData.name` is usually
 *  empty; DetailsStep already handles an empty pre-filled fullName
 *  gracefully (just asks the user to type it), so no fallback is needed
 *  here. */

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOnboardingStore } from "@/lib/stores/onboardingStore";
import { withRedirectParam } from "@/lib/utils";

interface Props {
  appleData: { appleEmailId: string; name: string; image: string };
}

export default function AppleBootstrap({ appleData }: Props) {
  const router = useRouter();
  const setMethod = useOnboardingStore((s) => s.setMethod);
  const markAccountCreated = useOnboardingStore((s) => s.markAccountCreated);

  useEffect(() => {
    setMethod("apple", null);
    markAccountCreated(appleData.name || undefined);

    const redirectTo = localStorage.getItem("redirectAfterLogin");
    if (redirectTo) localStorage.removeItem("redirectAfterLogin");

    router.replace(withRedirectParam("/register/apple-email", redirectTo));
  }, [appleData, setMethod, markAccountCreated, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-slate-500 text-sm animate-pulse">Signing you in…</p>
    </div>
  );
}
