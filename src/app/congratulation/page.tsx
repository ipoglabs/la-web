import { Suspense } from "react";
import CongratulationClient from "./CongratulationClient";

export const dynamic = "force-dynamic";

export default function CongratulationPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center bg-gray-50">
          <p className="text-gray-500 text-sm">
            Preparing your advertisement summary...
          </p>
        </main>
      }
    >
      <CongratulationClient />
    </Suspense>
  );
}