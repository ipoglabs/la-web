"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { LaCard, LaInput, LaAvatar, LaBadge, LaSkeleton } from "@/components/la";
import { listActivity } from "@/app/actions/la-dev/listActivity";
import type { LaDevActivityFeedEntry } from "@/app/actions/la-dev/listActivity";
import { ACTIVITY_LABELS, FIELD_NAMES } from "./activityLabels";
import { cn } from "@/lib/utils";

const AVATAR_COLORS = [
  "bg-blue-100 text-blue-700",
  "bg-rose-100 text-rose-700",
  "bg-amber-100 text-amber-700",
  "bg-emerald-100 text-emerald-700",
  "bg-violet-100 text-violet-700",
  "bg-cyan-100 text-cyan-700",
];

function avatarColor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

/** "Today" / "Yesterday" / "Last Week" / "Last 30 days" / "Older" — mirrors an ADO-style history panel. */
function bucketLabel(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const startOfDay = (dt: Date) => new Date(dt.getFullYear(), dt.getMonth(), dt.getDate()).getTime();
  const diffDays = Math.round((startOfDay(now) - startOfDay(d)) / 86400000);
  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays <= 7) return "Last Week";
  if (diffDays <= 30) return "Last 30 days";
  return "Older";
}

function rowTime(iso: string, bucket: string): string {
  const d = new Date(iso);
  const time = d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  if (bucket === "Today" || bucket === "Yesterday") return time;
  return `${d.toLocaleDateString(undefined, { month: "short", day: "numeric" })} ${time}`;
}

function fullTimestamp(iso: string): string {
  const d = new Date(iso);
  return `${d.toLocaleDateString(undefined, { weekday: "short" })}, ${d.toLocaleDateString()} ${d.toLocaleTimeString(
    undefined,
    { hour: "numeric", minute: "2-digit" }
  )}`;
}

function hasDiff(entry: LaDevActivityFeedEntry): boolean {
  return entry.metadata?.from !== undefined && entry.metadata?.to !== undefined;
}

interface DetailField {
  label: string;
  newValue: unknown;
  oldValue?: unknown;
}

/** Rows for the detail pane's field/value pills — ADO-style revision compare. */
function detailFields(entry: LaDevActivityFeedEntry): DetailField[] {
  if (hasDiff(entry)) {
    return [
      {
        label: FIELD_NAMES[entry.action] ?? ACTIVITY_LABELS[entry.action] ?? entry.action,
        newValue: entry.metadata!.to,
        oldValue: entry.metadata!.from,
      },
    ];
  }
  if (!entry.metadata) return [];
  return Object.entries(entry.metadata).map(([label, newValue]) => ({ label, newValue }));
}

/** One-line sentence for the list row and detail header, ADO's "X changed Y to Z" style. */
function describeAction(entry: LaDevActivityFeedEntry): string {
  const label = ACTIVITY_LABELS[entry.action] ?? entry.action;
  if (hasDiff(entry)) {
    const field = FIELD_NAMES[entry.action] ?? label;
    return `changed ${field} to "${String(entry.metadata!.to)}"`;
  }
  switch (entry.action) {
    case "REGISTERED":
      return "registered a new account";
    case "LOGIN":
      return "logged in";
    case "PASSWORD_CHANGED":
      return "changed their password";
    case "POST_CREATED":
      return "posted a new ad";
    case "POST_UPDATED":
      return "edited an ad";
    case "POST_BUMPED":
      return "bumped an ad";
    case "POST_DELETED":
      return "deleted an ad";
    case "MESSAGE_SENT":
      return "sent a message";
    default:
      return label.toLowerCase();
  }
}

export default function ActivityPanel() {
  const [entries, setEntries] = useState<LaDevActivityFeedEntry[] | null>(null);
  const [filter, setFilter] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [expandedOverrides, setExpandedOverrides] = useState<Record<string, boolean>>({});

  useEffect(() => {
    listActivity().then(setEntries);
  }, []);

  const filtered = useMemo(() => {
    if (!entries) return [];
    const q = filter.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter(
      (e) =>
        e.user.fullName.toLowerCase().includes(q) ||
        e.user.email?.toLowerCase().includes(q) ||
        e.user.userId.toLowerCase().includes(q)
    );
  }, [entries, filter]);

  // Derived rather than effect-driven: falls back to the newest entry whenever the
  // current selection is missing or filtered out, without a setState-in-effect render cascade.
  const effectiveSelectedId = useMemo(() => {
    if (selectedId && filtered.some((e) => e.id === selectedId)) return selectedId;
    return filtered[0]?.id ?? null;
  }, [filtered, selectedId]);

  const groups = useMemo(() => {
    const map = new Map<string, LaDevActivityFeedEntry[]>();
    for (const e of filtered) {
      const key = bucketLabel(e.at);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(e);
    }
    return Array.from(map.entries());
  }, [filtered]);

  const selectedEntry = filtered.find((e) => e.id === effectiveSelectedId) ?? null;

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-slate-500">
        Global audit history of user activity (logins, contact/name changes, ads posted or deleted,
        messages sent) — newest first, most recent 200 events. Search by user ID, username, or
        email, then pick an entry to see what changed.
      </p>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <LaInput
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Search by user ID, username, or email…"
          className="sm:flex-1"
        />
      </div>

      <LaCard className="overflow-hidden p-0">
        {entries === null ? (
          <div className="divide-y divide-slate-100">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3">
                <LaSkeleton shape="block" className="h-8 w-8 rounded-full shrink-0" />
                <div className="min-w-0 flex-1 space-y-2">
                  <LaSkeleton shape="text" className="w-1/3" />
                  <LaSkeleton shape="text" className="h-3 w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-slate-500 p-4">No activity found.</p>
        ) : (
          <div className="flex flex-col md:flex-row">
            <div className="w-full shrink-0 overflow-y-auto border-slate-200 md:h-[32rem] md:w-96 md:border-r">
              {groups.map(([label, groupEntries], i) => {
                const isExpanded = label in expandedOverrides ? expandedOverrides[label] : i === 0;
                return (
                  <div key={label}>
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedOverrides((prev) => ({ ...prev, [label]: !isExpanded }))
                      }
                      className="sticky top-0 z-10 flex w-full items-center gap-1.5 border-y border-slate-100 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-100"
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 shrink-0" />
                      ) : (
                        <ChevronRight className="h-4 w-4 shrink-0" />
                      )}
                      {label}
                    </button>
                    {isExpanded && (
                      <div className="divide-y divide-slate-100">
                        {groupEntries.map((entry) => (
                          <button
                            key={entry.id}
                            type="button"
                            onClick={() => setSelectedId(entry.id)}
                            className={cn(
                              "flex w-full items-start gap-3 border-l-4 px-4 py-3 text-left transition-colors",
                              entry.id === effectiveSelectedId
                                ? "border-blue-600 bg-blue-50"
                                : "border-transparent hover:bg-slate-50"
                            )}
                          >
                            <LaAvatar
                              name={entry.user.fullName}
                              size="sm"
                              className={avatarColor(entry.user.userId)}
                            />
                            <div className="min-w-0 flex-1">
                              <p className="text-sm text-slate-900 truncate">
                                <span className="font-semibold">{entry.user.fullName}</span>{" "}
                                <span className="text-slate-600">{describeAction(entry)}</span>
                              </p>
                              <p className="text-sm text-slate-500">{rowTime(entry.at, label)}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex-1 p-5">
              {selectedEntry ? (
                <div className="flex flex-col gap-4">
                  <div className="flex items-start gap-3">
                    <LaAvatar
                      name={selectedEntry.user.fullName}
                      size="md"
                      className={avatarColor(selectedEntry.user.userId)}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-900">{selectedEntry.user.fullName}</p>
                      <p className="text-sm text-slate-600">{describeAction(selectedEntry)}</p>
                    </div>
                    <span className="shrink-0 text-sm text-slate-500">{fullTimestamp(selectedEntry.at)}</span>
                  </div>

                  <div className="border-t border-slate-100 pt-4">
                    {(() => {
                      const fields = detailFields(selectedEntry);
                      if (fields.length === 0) {
                        return <p className="text-sm text-slate-500">No additional details recorded for this event.</p>;
                      }
                      return (
                        <div className="grid grid-cols-[10rem_1fr] items-center gap-x-4 gap-y-3">
                          {fields.map((field) => (
                            <Fragment key={field.label}>
                              <span className="text-sm text-slate-500">{field.label}</span>
                              <div className="flex flex-wrap items-center gap-2">
                                <LaBadge intent="success" dot>
                                  {String(field.newValue)}
                                </LaBadge>
                                {field.oldValue !== undefined && (
                                  <LaBadge intent="neutral" dot className="opacity-70 line-through">
                                    {String(field.oldValue)}
                                  </LaBadge>
                                )}
                              </div>
                            </Fragment>
                          ))}
                        </div>
                      );
                    })()}
                  </div>

                  <div className="border-t border-slate-100 pt-4 text-sm text-slate-500">
                    User ID: <span className="font-medium text-slate-700">{selectedEntry.user.userId}</span>
                    {selectedEntry.user.email && <> · {selectedEntry.user.email}</>}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-500">Select an event to view details.</p>
              )}
            </div>
          </div>
        )}
      </LaCard>
    </div>
  );
}
