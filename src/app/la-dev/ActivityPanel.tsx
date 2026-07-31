"use client";

import { useEffect, useMemo, useState } from "react";
import { LaCard, LaInput, LaBadge } from "@/components/la";
import { listActivity } from "@/app/actions/la-dev/listActivity";
import type { LaDevActivityFeedEntry } from "@/app/actions/la-dev/listActivity";
import { ACTIVITY_LABELS } from "./activityLabels";

const ALL_ACTIONS = Object.keys(ACTIVITY_LABELS);

function metadataSummary(metadata?: Record<string, unknown>): string {
  if (!metadata) return "";
  return Object.entries(metadata)
    .map(([k, v]) => `${k}: ${v}`)
    .join(" · ");
}

export default function ActivityPanel() {
  const [entries, setEntries] = useState<LaDevActivityFeedEntry[] | null>(null);
  const [filter, setFilter] = useState("");
  const [actionFilter, setActionFilter] = useState<string | null>(null);

  useEffect(() => {
    listActivity().then(setEntries);
  }, []);

  const filtered = useMemo(() => {
    if (!entries) return [];
    let list = entries;
    if (actionFilter) list = list.filter((e) => e.action === actionFilter);
    const q = filter.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (e) =>
          e.user.fullName.toLowerCase().includes(q) ||
          e.user.email?.toLowerCase().includes(q) ||
          e.user.userId.toLowerCase().includes(q)
      );
    }
    return list;
  }, [entries, filter, actionFilter]);

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-slate-500">
        Global feed of user activity (logins, contact/name changes, ads posted or deleted, messages
        sent) — newest first, most recent 200 events.
      </p>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <LaInput
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter by name, email, or user ID…"
          className="sm:flex-1"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActionFilter(null)}
          className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
            actionFilter === null ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          All
        </button>
        {ALL_ACTIONS.map((action) => (
          <button
            key={action}
            type="button"
            onClick={() => setActionFilter(action === actionFilter ? null : action)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
              actionFilter === action ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {ACTIVITY_LABELS[action]}
          </button>
        ))}
      </div>

      <LaCard className="divide-y divide-slate-100 overflow-hidden">
        {entries === null ? (
          <p className="text-sm text-slate-500 p-4">Loading activity…</p>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-slate-500 p-4">No activity found.</p>
        ) : (
          filtered.map((entry) => (
            <div key={entry.id} className="flex items-center justify-between gap-4 px-4 py-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-slate-900 truncate">{entry.user.fullName}</p>
                  <LaBadge intent="info" variant="soft">{ACTIVITY_LABELS[entry.action] ?? entry.action}</LaBadge>
                </div>
                <p className="text-sm text-slate-500 truncate">
                  {entry.user.email || entry.user.userId}
                  {entry.metadata && ` — ${metadataSummary(entry.metadata)}`}
                </p>
              </div>
              <span className="text-sm text-slate-500 shrink-0">
                {new Date(entry.at).toLocaleString()}
              </span>
            </div>
          ))
        )}
      </LaCard>
    </div>
  );
}
