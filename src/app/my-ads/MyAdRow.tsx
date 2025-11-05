"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Pencil } from "lucide-react";
import { deletePost } from "@/app/actions/deletePost";

type Row = {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  thumb: string | null;
  updatedAt: string | null; // ISO string recommended
};

export default function MyAdRow({
  row,
  ownerEmail,
  onDeleted,
}: {
  row: Row;
  ownerEmail: string;
  onDeleted: (id: string) => void;
}) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // ✅ Client-only, locale/timezone-stable label
  const [updatedLabel, setUpdatedLabel] = useState<string | null>(null);
  useEffect(() => {
    if (!row.updatedAt) {
      setUpdatedLabel(null);
      return;
    }
    const dt = new Date(row.updatedAt);
    const label = new Intl.DateTimeFormat("en-GB", {
      dateStyle: "short",
      timeStyle: "medium",
      hour12: true,
      timeZone: "Asia/Kolkata", // keep it stable across server/client
    }).format(dt);
    setUpdatedLabel(label);
  }, [row.updatedAt]);

  const handleDelete = () => {
    setError(null);
    if (!confirm("Delete this post permanently?")) return;

    start(async () => {
      const res = await deletePost(row.id, ownerEmail);
      if (!res.ok) {
        setError(res.error || "Delete failed");
        return;
      }
      onDeleted(row.id);
    });
  };

  return (
    <div className="flex items-center gap-4 p-3 border rounded-lg">
      <div className="w-16 h-16 bg-slate-100 rounded overflow-hidden flex items-center justify-center">
        {row.thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={row.thumb} alt={row.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-xs text-slate-400">No Image</span>
        )}
      </div>

      <div className="flex-1">
        <div className="font-medium">{row.name}</div>
        <div className="text-xs text-slate-500">
          {row.category} • {row.subcategory}
        </div>

        {row.updatedAt && (
          <div className="text-[11px] text-slate-400">
            Updated{" "}
            {/* SSR prints ISO (stable), client replaces with pretty label.
               suppressHydrationWarning avoids mismatch warning. */}
            <span suppressHydrationWarning>
              {updatedLabel ?? new Date(row.updatedAt).toISOString()}
            </span>
          </div>
        )}

        {error && <div className="text-xs text-red-600 mt-1">{error}</div>}
      </div>

      <div className="flex items-center gap-2">
        <Link href={`/post/edit/${row.id}`}>
          <Button variant="outline" size="sm">
            <Pencil className="h-4 w-4 mr-1" />
            Edit
          </Button>
        </Link>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          disabled={pending}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          {pending ? "Deleting…" : "Delete"}
        </Button>
      </div>
    </div>
  );
}
