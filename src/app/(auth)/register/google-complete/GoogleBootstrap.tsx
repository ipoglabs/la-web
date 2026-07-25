"use client";

/**
 * GoogleBootstrap — hands a brand-new Google sign-up off to the same
 * onboarding wizard Email/Phone already uses (Details → Role), instead of
 * the old standalone phone+DOB+locality form this file replaced. See
 * `DetailsStep.tsx`'s header comment — it already expected Google/Apple to
 * arrive via `markAccountCreated(prefillFullName)`, this is what actually
 * does that now.
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOnboardingStore } from "@/lib/stores/onboardingStore";
import { withRedirectParam } from "@/lib/utils";

interface Props {
  googleData: { email: string; name: string; image: string };
}

export default function GoogleBootstrap({ googleData }: Props) {
  const router = useRouter();
  const setMethod = useOnboardingStore((s) => s.setMethod);
  const markAccountCreated = useOnboardingStore((s) => s.markAccountCreated);

  useEffect(() => {
    setMethod("google", googleData.email);
    markAccountCreated(googleData.name || undefined);

    // PostHeader.tsx sets this before sending an unauthenticated user into
    // OAuth (e.g. "Post an ad") — carry it into the wizard's own `?redirect=`
    // convention so it survives Details → Role like it does for every other
    // signup method.
    const redirectTo = localStorage.getItem("redirectAfterLogin");
    if (redirectTo) localStorage.removeItem("redirectAfterLogin");

    router.replace(withRedirectParam("/register/details", redirectTo));
  }, [googleData, setMethod, markAccountCreated, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-slate-500 text-sm animate-pulse">Signing you in…</p>
    </div>
  );
}
