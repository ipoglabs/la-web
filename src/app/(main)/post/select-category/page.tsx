import { Suspense } from "react";
import SelectCategoryClient from "./SelectCategoryClient";
import ResetEditFlags from "./ResetEditFlags";
import PostHeader from "../components/PostHeader";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <>
      <PostHeader />
      <ResetEditFlags />
      <Suspense fallback={null}>
        <SelectCategoryClient />
      </Suspense>
    </>
  );
}
