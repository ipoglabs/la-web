"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { clearCountryCookies } from "@/lib/country-cookie";

export function ResetButton() {
  const router = useRouter();

  function handleReset() {
    clearCountryCookies();
    router.refresh();
  }

  return (
    <Button variant="outline" onClick={handleReset}>
      Reset — clear country cookie
    </Button>
  );
}
