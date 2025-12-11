// src/app/post/select-category/ResetEditFlags.tsx
"use client";
import { useEffect } from "react";
import { usePostFormStore } from "../store/postFormStore";

export default function ResetEditFlags() {
  const setField = usePostFormStore((s) => s.setField);

  useEffect(() => {
    // Clear edit flags at the start of the create flow
    setField("editMode", false);
    setField("postId", undefined as unknown as string);
  }, [setField]);

  return null;
}
