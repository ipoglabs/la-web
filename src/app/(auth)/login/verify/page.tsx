import { Suspense } from "react";
import { VerifyStep } from "./VerifyStep";

export default function LoginVerifyPage() {
  return (
    <Suspense>
      <VerifyStep />
    </Suspense>
  );
}
