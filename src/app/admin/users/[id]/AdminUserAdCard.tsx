"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { updatePostStatus } from "../../actions/updatePostStatus";

export default function AdminUserAdCard({ post }: { post: any }) {
  const [pending, start] = useTransition();
  const [status, setStatus] = useState<string>(post.status || "pending");
  const [error, setError] = useState<string | null>(null);

  const setPostStatus = (next: "active" | "off" | "expired") => {
    setError(null);

    start(async () => {
      const res = await updatePostStatus(post.id, next);
      if (!res?.ok) {
        setError("Failed to update status");
        return;
      }
      setStatus(next); // ✅ instant UI update
    });
  };

  return (
    <div className="p-4 rounded-lg border bg-white">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-medium">{post.name}</div>
          <div className="text-xs text-slate-500">
            {post.category} • {post.subcategory}
          </div>

          <div className="text-xs mt-1">
            Status: <span className="font-semibold capitalize">{status}</span>
          </div>

          {post.location?.address ? (
            <div className="text-xs mt-1 text-slate-600">
              Location: {post.location.address}
            </div>
          ) : null}

          {post.rentPrice != null ? (
            <div className="text-xs mt-1 text-slate-600">
              Rent: {post.rentPrice}
            </div>
          ) : null}

          {post.salePrice != null ? (
            <div className="text-xs mt-1 text-slate-600">
              Sale: {post.salePrice}
            </div>
          ) : null}

          {error ? <div className="text-xs text-red-600 mt-2">{error}</div> : null}
        </div>

        {Array.isArray(post.images) && post.images[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.images[0]}
            alt={post.name}
            className="h-16 w-16 rounded-md object-cover border"
          />
        ) : null}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {status !== "active" && (
          <Button size="sm" disabled={pending} onClick={() => setPostStatus("active")}>
            {pending ? "Saving..." : "Approve"}
          </Button>
        )}

        {status === "active" && (
          <Button
            size="sm"
            variant="outline"
            disabled={pending}
            onClick={() => setPostStatus("off")}
          >
            {pending ? "Saving..." : "Pause"}
          </Button>
        )}

        <Button
          size="sm"
          variant="destructive"
          disabled={pending}
          onClick={() => setPostStatus("expired")}
        >
          {pending ? "Saving..." : "Reject"}
        </Button>
      </div>
    </div>
  );
}
