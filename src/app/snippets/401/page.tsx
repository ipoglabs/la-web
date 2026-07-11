"use client";

import { useRouter } from "next/navigation";
import ErrorPageShell from "@/components/error-page/ErrorPageShell";

export default function Error401Page() {
  const router = useRouter();

  return (
    <ErrorPageShell
      code="401"
      title="Authentication required"
      description="You need to sign in before accessing this page."
      toneIcon="lock"
      primaryAction={{
        label: "Go to login",
        onClick: () => router.push("/login"),
      }}
      secondaryAction={{
        label: "Go home",
        onClick: () => router.push("/"),
      }}
      supportPrefix="Still cannot access?"
      supportEmail="support@lokalads.com"
    />
  );
}
