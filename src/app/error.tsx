"use client";

import { useRouter } from "next/navigation";
import ErrorPageShell from "@/components/error-page/ErrorPageShell";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  return (
    <ErrorPageShell
      code="500"
      title="Something went wrong"
      description="Our server hit an unexpected error. Please try again."
      toneIcon="shield-alert"
      primaryAction={{
        label: "Try again",
        onClick: reset,
      }}
      secondaryAction={{
        label: "Go home",
        onClick: () => router.push("/"),
      }}
      supportPrefix="Problem persists?"
      supportEmail="support@lokalads.com"
    />
  );
}
