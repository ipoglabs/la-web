"use client";

import { useState } from "react";
import { LaCard, LaBadge, LaButton, LaInput, LaSkeleton } from "@/components/la";
import { addOptionRequest, dismissOptionRequest, listOptionRequests } from "@/app/actions/admin/optionRequests";
import { useAsyncList } from "@/lib/hooks/useAsyncList";
import { toast } from "sonner";

/**
 * Dropdown values sellers typed that aren't in their post form's options.
 * "Add to form" puts the value (spelling editable) into that form's options
 * in the DB; "Dismiss" leaves the form alone. Posts keep the value either way.
 */
export default function AdminOptionRequestsPanel() {
  const { data: requests, error, refresh } = useAsyncList(listOptionRequests, []);
  const [done, setDone] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState<string | null>(null);
  const [spelling, setSpelling] = useState<Record<string, string>>({});

  const visible = requests?.filter((r) => !done.has(r.id)) ?? null;

  async function decide(id: string, run: () => Promise<{ ok: true } | { ok: false; error: string }>, success: string) {
    setBusy(id);
    try {
      const res = await run();
      if (res.ok) {
        toast.success(success);
        setDone((prev) => new Set(prev).add(id));
      } else {
        toast.error(res.error === "failed" ? "Action failed." : res.error);
      }
    } finally {
      setBusy(null);
    }
  }

  if (error) {
    return (
      <div className="flex flex-col items-start gap-2 p-4">
        <p className="text-sm text-rose-600">{error}</p>
        <LaButton intent="outline" size="compact" onClick={refresh}>
          Retry
        </LaButton>
      </div>
    );
  }

  if (visible === null) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <LaSkeleton key={i} shape="block" className="h-24 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (visible.length === 0) {
    return <p className="text-sm text-slate-500 p-4">No option requests.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {visible.map((r) => {
        const label = spelling[r.id] ?? r.value;
        return (
          <LaCard key={r.id} className="p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-end">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-slate-900">
                    {r.fieldLabel}: “{r.value}”
                  </p>
                  <LaBadge intent="neutral" variant="soft">
                    {r.country}
                  </LaBadge>
                </div>
                <p className="text-sm text-slate-500">
                  {r.category} › {r.subcategory} · used in {r.postCount} {r.postCount === 1 ? "post" : "posts"} · first{" "}
                  {new Date(r.createdAt).toLocaleDateString()}
                </p>
                <label htmlFor={`option-${r.id}`} className="mt-2 block text-sm font-medium text-slate-700">
                  Add as
                </label>
                <LaInput
                  id={`option-${r.id}`}
                  value={label}
                  onChange={(e) => setSpelling((prev) => ({ ...prev, [r.id]: e.target.value }))}
                  className="mt-1 max-w-xs"
                />
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <LaButton
                  intent="outline"
                  size="compact"
                  disabled={busy === r.id}
                  onClick={() => decide(r.id, () => dismissOptionRequest(r.id), "Request dismissed.")}
                >
                  Dismiss
                </LaButton>
                <LaButton
                  size="compact"
                  disabled={busy === r.id || !label.trim()}
                  onClick={() => decide(r.id, () => addOptionRequest(r.id, label), `Added “${label.trim()}” to ${r.fieldLabel}.`)}
                >
                  Add to form
                </LaButton>
              </div>
            </div>
          </LaCard>
        );
      })}
    </div>
  );
}
