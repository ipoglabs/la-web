"use client";

import { useEffect } from "react";
import { usePostFormStore } from "../store/postFormStore";

export default function ResetEditFlags() {
  const setField = usePostFormStore((s) => s.setField);

  useEffect(() => {
    // clear any stale edit wiring when starting create flow
    setField("editMode", false);
    setField("postId", undefined);
  }, [setField]);

  return null;
}
