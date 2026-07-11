"use client";

import { useRouter } from "next/navigation";
import ErrorPageShell from "@/components/error-page/ErrorPageShell";

export default function Error503Page() {
  const router = useRouter();

  return (
    <ErrorPageShell
      code="503"
      title="Service temporarily unavailable"
      description="We are doing maintenance right now. Please try again shortly."
      toneIcon="wrench"
      primaryAction={{
        label: "Try again",
        onClick: () => router.refresh(),
      }}
      secondaryAction={{
        label: "Go home",
        onClick: () => router.push("/"),
      }}
      supportPrefix="If this keeps happening,"
      supportEmail="support@lokalads.com"
    />
  );
}
