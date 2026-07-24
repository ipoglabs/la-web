import { Suspense } from "react";
import { DetailsStep } from "./DetailsStep";

export default function RegisterDetailsPage() {
  return (
    <Suspense>
      <DetailsStep />
    </Suspense>
  );
}
