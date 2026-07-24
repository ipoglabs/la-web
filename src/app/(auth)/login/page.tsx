import { Suspense } from "react";
import { MethodStep } from "./MethodStep";

export default function LoginPage() {
  return (
    <Suspense>
      <MethodStep />
    </Suspense>
  );
}
