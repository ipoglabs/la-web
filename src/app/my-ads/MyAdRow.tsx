"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Pencil, Rocket } from "lucide-react";
import { bumpPost } from "@/app/actions/bumpPost";
import { deletePost } from "@/app/actions/deletePost";

type Row = {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  thumb: string | null;
  updatedAt: string | null;
  status?: string;
  lastBumpedAt?: string | null;
};

function getStatusClasses(status?: string): string {
  switch (status) {
    case "active":
      return "bg-emerald-50 text-emerald-700 border border-emerald-200";
    case "pending":
      return "bg-amber-50 text-amber-700 border border-amber-200";
    case "off":
      return "bg-slate-50 text-slate-600 border border-slate-200";
    case "expired":
      return "bg-slate-50 text-slate-600 border border-slate-200";
    default:
      return "bg-slate-50 text-slate-500 border border-slate-200";
  }
}

export default function MyAdRow({
  row,
  ownerEmail,
  ownerId,
  onDeleted,
  onBumped,
}: {
  row: Row;
  ownerEmail: string;
  ownerId: string;
  onDeleted: (id: string) => void;
  onBumped?: (id: string, iso: string) => void;
}) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [updatedLabel, setUpdatedLabel] = useState<string | null>(null);
  const [bumpedLabel, setBumpedLabel] = useState<string | null>(null);

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
      timeZone: "Asia/Kolkata",
    }).format(dt);
    setUpdatedLabel(label);
  }, [row.updatedAt]);

  useEffect(() => {
    if (!row.lastBumpedAt) {
      setBumpedLabel(null);
      return;
    }
    const dt = new Date(row.lastBumpedAt);
    const label = new Intl.DateTimeFormat("en-GB", {
      dateStyle: "short",
      timeStyle: "short",
      hour12: true,
      timeZone: "Asia/Kolkata",
    }).format(dt);
    setBumpedLabel(label);
  }, [row.lastBumpedAt]);

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

  const handleBump = () => {
    setError(null);

    start(async () => {
      // bumpPost uses auth from cookies/header, ownerId not required here,
      // but we keep ownerId in props for future use.
      const res = await bumpPost(row.id);
      if (!res.ok) {
        setError(res.error || "Bump failed");
        return;
      }

      const iso = res.lastBumpedAt || new Date().toISOString();
      onBumped?.(row.id, iso);
    });
  };

  return (
    <div className="flex items-center gap-4 p-3 border rounded-lg">
      <div className="w-16 h-16 bg-slate-100 rounded overflow-hidden flex items-center justify-center">
        {row.thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={row.thumb}
            alt={row.name}
            className="w-full h-full object-cover"
          />
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
            <span suppressHydrationWarning>
              {updatedLabel ?? new Date(row.updatedAt).toISOString()}
            </span>
          </div>
        )}

        {bumpedLabel && (
          <div className="text-[11px] text-slate-400">
            Bumped{" "}
            <span suppressHydrationWarning>
              {bumpedLabel ?? new Date(row.lastBumpedAt!).toISOString()}
            </span>
          </div>
        )}

        {error && <div className="text-xs text-red-600 mt-1">{error}</div>}
      </div>

      <div className="flex items-center gap-2">
        {row.status && (
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusClasses(
              row.status
            )}`}
          >
            {row.status}
          </span>
        )}

        {row.status === "active" && (
          <Button
            variant="secondary"
            size="sm"
            onClick={handleBump}
            disabled={pending}
            title="Bump this ad to the top"
          >
            <Rocket className="h-4 w-4 mr-1" />
            {pending ? "Bumping…" : "Bump"}
          </Button>
        )}

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
