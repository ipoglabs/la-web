import { Suspense } from "react";
import SelectCategoryClient from "./SelectCategoryClient";

// If this page was being statically pre-rendered and tripping on `useSearchParams`,
// Suspense boundary resolves it. The fallback can be null or a skeleton.
export const dynamic = "force-dynamic"; // optional: avoids static export headaches

export default function Page() {
  return (
    <Suspense fallback={null}>
      <SelectCategoryClient />
    </Suspense>
  );
}
