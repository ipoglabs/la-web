"use client";

import Link from "next/link";
import { useState, useTransition, useEffect } from "react";
import { Trash2, Pencil, Rocket } from "lucide-react";
import { bumpPost } from "@/app/actions/bumpPost";
import { deletePost } from "@/app/actions/deletePost";

type Props = {
  row: any;
  ownerEmail: string;
  ownerId: string;
  onDeleted: (id: string) => void;
  onBumped: (id: string, iso: string) => void;
  onStatusChanged: (id: string, status: string) => void;
};

export default function MyAdRow({
  row,
  ownerEmail,
  onDeleted,
  onBumped,
}: Props) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [updatedLabel, setUpdatedLabel] = useState<string | null>(null);

  // ✅ DEBUG
  useEffect(() => {
    console.log("🔵 ROW RENDER:", {
      id: row?.id,
      status: row?.status,
    });
  }, [row]);

  useEffect(() => {
    if (!row?.updatedAt) return setUpdatedLabel(null);

    const dt = new Date(row.updatedAt);
    if (isNaN(dt.getTime())) return setUpdatedLabel(null);

    setUpdatedLabel(
      new Intl.DateTimeFormat("en-GB", {
        dateStyle: "short",
        timeStyle: "medium",
        hour12: true,
      }).format(dt)
    );
  }, [row?.updatedAt]);

  const handleDelete = () => {
    setError(null);
    if (!confirm("Delete this post permanently?")) return;

    start(async () => {
      const res = await deletePost(row.id, ownerEmail);
      if (!res?.ok) {
        setError(res?.error || "Delete failed");
        return;
      }
      onDeleted(row.id);
    });
  };

  const handleBump = () => {
    setError(null);

    start(async () => {
      const res = await bumpPost(row.id);
      if (!res?.ok) {
        setError(res?.error || "Bump failed");
        return;
      }

      const iso = res.lastBumpedAt || new Date().toISOString();
      onBumped(row.id, iso);
    });
  };

  return (
    <div className="flex items-center justify-between gap-4 p-4 border rounded-xl bg-white shadow-sm">
      <div className="w-20 h-20 rounded-md overflow-hidden bg-slate-100">
        {row?.thumb ? (
          <img
            src={row.thumb}
            alt={row.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-xs text-slate-400">
            No Image
          </div>
        )}
      </div>

      <div className="flex-1">
        <div className="text-lg font-semibold">
          {row?.name || "Untitled"}
        </div>

        <div className="text-sm text-slate-500">
          {row?.category} • {row?.subcategory}
        </div>

        {row?.updatedAt && (
          <div className="text-sm text-slate-400">
            Updated {updatedLabel}
          </div>
        )}

        {error && (
          <div className="text-xs text-red-500 mt-1">{error}</div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            row.status === "active"
              ? "bg-green-100 text-green-700"
              : row.status === "pending"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {row.status === "pending"
            ? "Waiting for approval..."
            : row.status}
        </span>

        {row.status === "active" && (
          <button
            onClick={handleBump}
            disabled={pending}
            className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded hover:bg-gray-200"
          >
            <Rocket className="w-4 h-4" />
            {pending ? "Bumping..." : "Bump"}
          </button>
        )}

        <Link href={`/post/edit/${row.id}`}>
          <button className="flex items-center gap-1 px-3 py-1 border rounded hover:bg-slate-50">
            <Pencil className="w-4 h-4" />
            Edit
          </button>
        </Link>

        <button
          onClick={handleDelete}
          disabled={pending}
          className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
          <Trash2 className="w-4 h-4" />
          {pending ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
}