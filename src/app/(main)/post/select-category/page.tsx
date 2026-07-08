import { Suspense } from "react";
import SelectCategoryClient from "./SelectCategoryClient";
import ResetEditFlags from "./ResetEditFlags";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <>
  
      <ResetEditFlags />
      <Suspense fallback={null}>
        <SelectCategoryClient />
      </Suspense>
    </>
  );
}
