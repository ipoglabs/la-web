"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { updatePostStatus } from "../../actions/updatePostStatus";

function fmtDateTime(d?: any) {
  if (!d) return "-";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return "-";
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    hour12: true,
    timeZone: "Asia/Kolkata",
  }).format(dt);
}

function StatusPill({ status }: { status: string }) {
  const cls = useMemo(() => {
    switch (status) {
      case "active":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "off":
        return "bg-slate-50 text-slate-700 border-slate-200";
      case "expired":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-slate-50 text-slate-600 border-slate-200";
    }
  }, [status]);

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border capitalize ${cls}`}
    >
      {status}
    </span>
  );
}

export default function AdminUserAdCard({ post }: { post: any }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [status, setStatus] = useState<string>(post.status || "pending");
  const [error, setError] = useState<string | null>(null);

  const setPostStatus = (next: "active" | "off" | "expired") => {
    setError(null);

    start(async () => {
      const res = await updatePostStatus(post.id, next);
      if (!res?.ok) {
        setError(res?.error || "Failed to update status");
        return;
      }
      setStatus(next);
      router.refresh();
    });
  };

  return (
    <div
      onClick={() => router.push(`/admin/posts/${post.id}`)}
      className="p-4 rounded-lg border bg-white hover:bg-slate-50 transition cursor-pointer"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="font-medium truncate">{post.name}</div>
            <StatusPill status={status} />
          </div>

          <div className="text-xs text-slate-500 mt-0.5">
            {post.category} • {post.subcategory}
          </div>

          {post.location?.address ? (
            <div className="text-xs mt-1 text-slate-600">
              Location: {post.location.address}
            </div>
          ) : null}

          {post.rentPrice != null ? (
            <div className="text-xs mt-1 text-slate-600">
              Rent: <b>{post.rentPrice}</b>
            </div>
          ) : null}

          {post.salePrice != null ? (
            <div className="text-xs mt-1 text-slate-600">
              Sale: <b>{post.salePrice}</b>
            </div>
          ) : null}

          <div className="text-[11px] text-slate-500 mt-2 space-y-0.5">
            <div>Created: {fmtDateTime(post.createdAt)}</div>
            <div>Updated: {fmtDateTime(post.updatedAt)}</div>
            {post.lastBumpedAt ? (
              <div>Bumped: {fmtDateTime(post.lastBumpedAt)}</div>
            ) : null}
          </div>

          {error ? <div className="text-xs text-red-600 mt-2">{error}</div> : null}
        </div>

        <div
          className="flex flex-col items-end gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          {Array.isArray(post.images) && post.images[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.images[0]}
              alt={post.name}
              className="h-16 w-16 rounded-md object-cover border"
            />
          ) : (
            <div className="h-16 w-16 rounded-md bg-slate-100 border flex items-center justify-center text-[10px] text-slate-400">
              No Image
            </div>
          )}

          <Button
            size="sm"
            variant="outline"
            onClick={() => router.push(`/admin/posts/${post.id}`)}
          >
            View
          </Button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2" onClick={(e) => e.stopPropagation()}>
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
