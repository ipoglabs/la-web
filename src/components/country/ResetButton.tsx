"use client";

import { useRouter } from "next/navigation";
import { LaButton } from "@/components/la/la-button";
import { clearCountryCookies } from "@/lib/country-cookie";

export function ResetButton() {
  const router = useRouter();

  function handleReset() {
    clearCountryCookies();
    router.refresh();
  }

  return (
    <LaButton intent="outline" onClick={handleReset}>
      Reset — clear country cookie
    </LaButton>
  );
}
