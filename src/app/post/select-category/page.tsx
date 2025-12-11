// src/app/post/select-category/page.tsx
import { Suspense } from "react";
import SelectCategoryClient from "./SelectCategoryClient";
import AppHeader from "@/app/components/AppHeader/appHeader";
import AppFooter from "@/app/components/AppFooter/appFooter";
import ResetEditFlags from "./ResetEditFlags"; // ← add this import

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <>
      <AppHeader />
      {/* Clear any stale edit state when user lands on create flow */}
      <ResetEditFlags />
      <Suspense fallback={null}>
        <SelectCategoryClient />
      </Suspense>
      <AppFooter />
    </>
  );
}
