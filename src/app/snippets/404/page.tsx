"use client";

import { useRouter } from "next/navigation";
import ErrorPageShell from "@/components/error-page/ErrorPageShell";

export default function Error404Page() {
  const router = useRouter();

  return (
    <ErrorPageShell
      code="404"
      title="Page not found"
      description="The page you are looking for does not exist or may have moved."
      toneIcon="search"
      primaryAction={{
        label: "Go home",
        onClick: () => router.push("/"),
      }}
      secondaryAction={{
        label: "Go back",
        onClick: () => router.back(),
      }}
      supportPrefix="Think this is a mistake?"
      supportEmail="support@lokalads.com"
    />
  );
}

