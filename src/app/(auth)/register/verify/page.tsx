import { Suspense } from "react";
import { VerifyStep } from "./VerifyStep";

export default function RegisterVerifyPage() {
  return (
    <Suspense>
      <VerifyStep />
    </Suspense>
  );
}

