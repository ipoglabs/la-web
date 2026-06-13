"use client";

import { useEffect } from "react";
import { usePostFormStore } from "../store/postFormStore";

function generateObjectId(): string {
  const ts = Math.floor(Date.now() / 1000).toString(16).padStart(8, "0");
  const rand = Array.from(crypto.getRandomValues(new Uint8Array(8)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return ts + rand;
}

export default function ResetEditFlags() {
  const setField = usePostFormStore((s) => s.setField);

  useEffect(() => {
    // Clear edit wiring and assign a fresh postId for this new post creation flow
    setField("editMode", false);
    setField("postId", generateObjectId());
  }, [setField]);

  return null;
}
