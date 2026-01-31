"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { updatePostStatus } from "../../actions/updatePostStatus";

type AdminPost = {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  status?: string;
  ownerEmail?: string;
};

export default function AdminPostRow({ post }: { post: AdminPost }) {
  const [pending, start] = useTransition();
  const router = useRouter();

  const setStatus = (status: "active" | "off" | "expired") => {
    start(async () => {
      const res = await updatePostStatus(post.id, status);
      if (res?.ok) router.refresh();
      else alert(res?.error || "Update failed");
    });
  };

  return (
    <div
      onClick={() => router.push(`/admin/posts/${post.id}`)} // ✅ admin details
      className="bg-white p-4 rounded shadow flex justify-between items-center cursor-pointer hover:bg-slate-50 transition"
    >
      <div>
        <div className="font-medium">{post.name}</div>
        <div className="text-xs text-slate-500">
          {post.category} • {post.subcategory}
        </div>

        <div className="text-xs mt-1">
          User: <b>{post.ownerEmail || "-"}</b>
        </div>
        <div className="text-xs mt-1">
          Status: <b className="capitalize">{post.status || "pending"}</b>
        </div>
      </div>

      {/* Buttons should not trigger row navigation */}
      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
        {post.status !== "active" && (
          <Button
            size="sm"
            disabled={pending}
            onClick={() => setStatus("active")}
          >
            {pending ? "Saving..." : "Approve"}
          </Button>
        )}

        {post.status === "active" && (
          <Button
            size="sm"
            variant="outline"
            disabled={pending}
            onClick={() => setStatus("off")}
          >
            {pending ? "Saving..." : "Pause"}
          </Button>
        )}

        <Button
          size="sm"
          variant="destructive"
          disabled={pending}
          onClick={() => setStatus("expired")}
        >
          {pending ? "Saving..." : "Reject"}
        </Button>
      </div>
    </div>
  );
}
