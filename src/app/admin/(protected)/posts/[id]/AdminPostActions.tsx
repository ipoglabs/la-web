"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { updatePostStatus } from "../../../actions/updatePostStatus";

export default function AdminPostActions({
  postId,
  status,
}: {
  postId: string;
  status: string;
}) {
  const [pending, start] = useTransition();
  const router = useRouter();

  const update = (s: "active" | "off" | "expired") => {
    start(async () => {
      const res = await updatePostStatus(postId, s);
      if (res?.ok) router.refresh();
      else alert(res?.error || "Update failed");
    });
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow border flex gap-3">
      {status !== "active" && (
        <Button disabled={pending} onClick={() => update("active")}>
          {pending ? "Saving..." : "Approve"}
        </Button>
      )}

      {status === "active" && (
        <Button
          variant="outline"
          disabled={pending}
          onClick={() => update("off")}
        >
          {pending ? "Saving..." : "Pause"}
        </Button>
      )}

      <Button
        variant="destructive"
        disabled={pending}
        onClick={() => update("expired")}
      >
        {pending ? "Saving..." : "Reject"}
      </Button>
    </div>
  );
}
