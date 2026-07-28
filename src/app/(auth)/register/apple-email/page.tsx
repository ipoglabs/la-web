import { Suspense } from "react";
import { AppleEmailStep } from "./AppleEmailStep";

export default function RegisterAppleEmailPage() {
  return (
    <Suspense>
      <AppleEmailStep />
    </Suspense>
  );
}
