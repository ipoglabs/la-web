"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createAlert } from "@/app/actions/createAlert";
import type { AlertPayload } from "./types";

/** Shared onSubmit wiring for every CreateAlertDialog/CreateAlertBanner
 * render site — calls the real createAlert action, surfaces success/failure
 * via toast, and re-throws on failure so CreateAlertJourney's handleSubmit
 * keeps the user on step 2 instead of advancing to the "done" step. */
export function useSubmitAlert() {
  const router = useRouter();

  return async (payload: AlertPayload) => {
    const result = await createAlert(payload);

    if (!result.success) {
      if (result.error === "unauthenticated") {
        toast.error("Please sign in to create an alert.");
        router.push("/login");
      } else {
        toast.error(result.error || "Couldn't create alert. Please try again.");
      }
      throw new Error(result.error);
    }

    toast.success("Alert created — we'll notify you about new matches.");
  };
}
