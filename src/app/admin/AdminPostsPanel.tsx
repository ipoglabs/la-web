"use client";

import { useEffect, useState } from "react";
import { LaCard, LaBadge, LaButton, LaSkeleton, LaTextarea } from "@/components/la";
import { listAllPosts, type AdminPostRow, type AdminStatusFilter } from "@/app/actions/admin/listAllPosts";
import { setPostStatusAction } from "@/app/actions/admin/setPostStatus";
import type { PostStatusTarget } from "@/lib/moderation";
import { useAsyncList } from "@/lib/hooks/useAsyncList";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const TABS: { id: AdminStatusFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "active", label: "Approved" },
  { id: "rejected", label: "Rejected" },
  { id: "banned", label: "Banned" },
];

const STATUS_BADGE: Record<string, { label: string; intent: "success" | "warning" | "danger" | "neutral" }> = {
  active: { label: "Approved", intent: "success" },
  pending: { label: "Pending", intent: "warning" },
  rejected: { label: "Rejected", intent: "danger" },
  banned: { label: "Banned", intent: "danger" },
  off: { label: "Off", intent: "neutral" },
  expired: { label: "Expired", intent: "neutral" },
  deleted: { label: "Deleted", intent: "neutral" },
};

const ACTIONS: { target: PostStatusTarget; label: string; needsReason?: boolean }[] = [
  { target: "active", label: "Approve" },
  { target: "pending", label: "Pending" },
  { target: "rejected", label: "Reject", needsReason: true },
  { target: "banned", label: "Ban", needsReason: true },
];

function PostRow({ post, onChanged }: { post: AdminPostRow; onChanged: (updated: AdminPostRow) => void }) {
  const [busy, setBusy] = useState(false);
  const [pendingAction, setPendingAction] = useState<PostStatusTarget | null>(null);
  const [reason, setReason] = useState("");

  const badge = STATUS_BADGE[post.status] ?? { label: post.status, intent: "neutral" as const };

  async function apply(target: PostStatusTarget, reasonText?: string) {
    setBusy(true);
    try {
      const res = await setPostStatusAction(post.id, target, reasonText);
      if (res.ok) {
        toast.success(`"${post.name}" set to ${STATUS_BADGE[target === "active" ? "active" : target]?.label ?? target}.`);
        onChanged({
          ...post,
          status: target,
          rejectionReason: target === "rejected" ? (reasonText ?? null) : null,
        });
        setPendingAction(null);
        setReason("");
      } else {
        toast.error("Couldn't update status.");
      }
    } finally {
      setBusy(false);
    }
  }

  function handleClick(action: (typeof ACTIONS)[number]) {
    if (action.target === post.status) return;
    if (action.needsReason) {
      setPendingAction(pendingAction === action.target ? null : action.target);
      return;
    }
    apply(action.target);
  }

  return (
    <LaCard className="p-4">
      <div className="flex items-start gap-3">
        <div className="w-16 h-16 rounded-md overflow-hidden bg-slate-100 shrink-0">
          {post.thumb ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.thumb} alt={post.name} className="w-full h-full object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full text-sm text-slate-400">No image</div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-slate-900 truncate">{post.name}</p>
            <LaBadge intent={badge.intent} variant="soft">
              {badge.label}
            </LaBadge>
          </div>
          <p className="text-sm text-slate-500">
            {post.category} • {post.subcategory}
          </p>
          <p className="text-sm text-slate-500">
            {post.owner?.fullName ?? "Unknown owner"} · {new Date(post.updatedAt).toLocaleString()}
          </p>
          {post.status === "rejected" && post.rejectionReason && (
            <p className="text-sm text-slate-500 mt-1">Reason: {post.rejectionReason}</p>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2 shrink-0 max-w-[260px]">
          {ACTIONS.map((action) => (
            <LaButton
              key={action.target}
              intent={
                action.target === "rejected" || action.target === "banned"
                  ? "danger"
                  : action.target === "active"
                    ? "primary-blue"
                    : "outline"
              }
              size="compact"
              disabled={busy || action.target === post.status}
              onClick={() => handleClick(action)}
            >
              {action.label}
            </LaButton>
          ))}
        </div>
      </div>

      {pendingAction && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col gap-2">
          <LaTextarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={
              pendingAction === "rejected"
                ? "Reason for rejection (shown to the seller)…"
                : "Reason for banning this ad…"
            }
            rows={2}
          />
          <div className="flex justify-end gap-2">
            <LaButton intent="ghost" size="compact" onClick={() => setPendingAction(null)}>
              Cancel
            </LaButton>
            <LaButton
              intent="danger"
              size="compact"
              disabled={busy}
              onClick={() => apply(pendingAction, reason.trim())}
            >
              Confirm {pendingAction === "rejected" ? "reject" : "ban"}
            </LaButton>
          </div>
        </div>
      )}
    </LaCard>
  );
}

export default function AdminPostsPanel() {
  const [tab, setTab] = useState<AdminStatusFilter>("all");
  const { data: fetchedPosts, error, refresh } = useAsyncList(() => listAllPosts(tab), [tab]);
  const [posts, setPosts] = useState<AdminPostRow[] | null>(null);

  useEffect(() => {
    setPosts(fetchedPosts);
  }, [fetchedPosts]);

  function handleChanged(updated: AdminPostRow) {
    setPosts((prev) => {
      if (!prev) return prev;
      // If it no longer matches the active filter, drop it from view.
      if (tab !== "all" && updated.status !== tab) {
        return prev.filter((p) => p.id !== updated.id);
      }
      return prev.map((p) => (p.id === updated.id ? updated : p));
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="inline-flex flex-wrap gap-1 rounded-lg bg-slate-100 p-1 w-fit">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
              tab === t.id ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {error ? (
        <div className="flex flex-col items-start gap-2 p-4">
          <p className="text-sm text-rose-600">{error}</p>
          <LaButton intent="outline" size="compact" onClick={refresh}>
            Retry
          </LaButton>
        </div>
      ) : posts === null ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <LaSkeleton key={i} shape="block" className="h-20 w-full rounded-xl" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <p className="text-sm text-slate-500 p-4">No posts in this view.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {posts.map((post) => (
            <PostRow key={post.id} post={post} onChanged={handleChanged} />
          ))}
        </div>
      )}
    </div>
  );
}
