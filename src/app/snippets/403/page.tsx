"use client";

import { useRouter } from "next/navigation";
import ErrorPageShell from "@/components/error-page/ErrorPageShell";

export default function Error403Page() {
  const router = useRouter();

  return (
    <ErrorPageShell
      code="403"
      title="Access denied"
      description="You do not have permission to view this page."
      toneIcon="ban"
      primaryAction={{
        label: "Go home",
        onClick: () => router.push("/"),
      }}
      secondaryAction={{
        label: "Back",
        onClick: () => router.back(),
      }}
      supportPrefix="Need access for this action?"
      supportEmail="support@lokalads.com"
    />
  );
}
