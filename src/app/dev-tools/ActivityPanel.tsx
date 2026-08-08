"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { LaButton, LaCard, LaInput, LaAvatar, LaSkeleton } from "@/components/la";
import { listUsers } from "@/app/actions/dev-tools/listUsers";
import type { DevToolsUser } from "@/app/actions/dev-tools/types";
import { getUserAuditDetail } from "@/app/actions/dev-tools/getUserAuditDetail";
import type { AuditRange, DevToolsAuditEntry, DevToolsAuditUser } from "@/app/actions/dev-tools/getUserAuditDetail";
import { ACTIVITY_LABELS, FIELD_NAMES } from "./activityLabels";
import { useAsyncList } from "@/lib/hooks/useAsyncList";
import { cn } from "@/lib/utils";

const RANGES: { id: AuditRange; label: string }[] = [
  { id: "24h", label: "24h" },
  { id: "7d", label: "7d" },
  { id: "30d", label: "30d" },
  { id: "all", label: "All" },
];

function fullTimestamp(iso: string): string {
  const d = new Date(iso);
  return `${d.toLocaleDateString(undefined, { weekday: "short" })}, ${d.toLocaleDateString()} ${d.toLocaleTimeString(
    undefined,
    { hour: "numeric", minute: "2-digit" }
  )}`;
}

/** First 8 / last 4 chars — enough to eyeball-match two entries without ever showing the full internal id. */
function maskUuid(uuid: string): string {
  if (!uuid || uuid.length <= 14) return uuid || "—";
  return `${uuid.slice(0, 8)}…${uuid.slice(-4)}`;
}

function formatRole(user: DevToolsAuditUser): string {
  if (user.roleTitle) {
    return user.roleDescription ? `${user.roleTitle} - ${user.roleDescription}` : user.roleTitle;
  }
  const base = user.publicRole ? user.publicRole.charAt(0).toUpperCase() + user.publicRole.slice(1) : "—";
  return user.customRole ? `${base} - ${user.customRole}` : base;
}

interface EntryRow {
  field: string;
  oldValue: string | null;
  newValue: string;
}

/** One row per ActivityLog entry — diff-carrying actions show old→new for
 * their field, everything else falls back to a short summary. */
function rowForEntry(entry: DevToolsAuditEntry): EntryRow {
  const meta = entry.metadata;
  if (meta?.from !== undefined && meta?.to !== undefined) {
    return {
      field: FIELD_NAMES[entry.action] ?? ACTIVITY_LABELS[entry.action] ?? entry.action,
      oldValue: String(meta.from),
      newValue: String(meta.to),
    };
  }
  const summary =
    (meta?.title as string | undefined) ??
    (meta?.reason as string | undefined) ??
    (meta?.method as string | undefined) ??
    (meta?.conversationId ? "Message sent" : undefined) ??
    "—";
  return {
    field: ACTIVITY_LABELS[entry.action] ?? entry.action,
    oldValue: null,
    newValue: summary,
  };
}

function UserRow({ user, onOpen }: { user: DevToolsUser; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors"
    >
      <div className="min-w-0 flex items-center gap-3">
        <LaAvatar name={user.fullName} size="sm" />
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-900 truncate">{user.fullName}</p>
          <p className="text-sm text-slate-500 truncate">
            {user.email || user.primaryNumber || user.userId}
          </p>
        </div>
      </div>
      <span className="shrink-0 rounded-md border border-slate-300 p-1.5 text-slate-500">
        <ArrowRight className="h-4 w-4" />
      </span>
    </button>
  );
}

export default function ActivityPanel({ initialUserId }: { initialUserId?: string | null }) {
  const { data: users, error: usersError, refresh: refreshUsers } = useAsyncList(listUsers, []);
  const [filter, setFilter] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(initialUserId ?? null);
  const [range, setRange] = useState<AuditRange>("7d");
  const { data: detail, error: detailError, refresh: refreshDetail } = useAsyncList(async () => {
    if (!selectedId) return null;
    return getUserAuditDetail(selectedId, range);
  }, [selectedId, range]);

  // Jump straight to a user's detail when opened via a cross-link (Users tab).
  useEffect(() => {
    if (initialUserId) setSelectedId(initialUserId);
  }, [initialUserId]);

  const filtered = useMemo(() => {
    if (!users) return [];
    const q = filter.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.fullName.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.primaryNumber?.toLowerCase().includes(q) ||
        u.userId.toLowerCase().includes(q)
    );
  }, [users, filter]);

  if (selectedId) {
    return (
      <div className="flex flex-col gap-6">
        <button
          type="button"
          onClick={() => setSelectedId(null)}
          className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" /> Back to search
        </button>

        {detailError ? (
          <LaCard className="p-5 flex flex-col items-start gap-2">
            <p className="text-sm text-rose-600">{detailError}</p>
            <LaButton intent="outline" size="compact" onClick={refreshDetail}>
              Retry
            </LaButton>
          </LaCard>
        ) : detail === null ? (
          <LaCard className="p-5 flex items-center gap-3">
            <LaSkeleton shape="block" className="h-10 w-10 rounded-full shrink-0" />
            <div className="min-w-0 flex-1 space-y-2">
              <LaSkeleton shape="text" className="w-1/3" />
              <LaSkeleton shape="text" className="h-3 w-1/4" />
            </div>
          </LaCard>
        ) : detail.user === null ? (
          <p className="text-sm text-slate-500">User not found.</p>
        ) : (
          <>
            <LaCard className="p-5 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <LaAvatar name={detail.user.fullName} size="md" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900">{detail.user.fullName}</p>
                  <p className="text-sm text-slate-500">{formatRole(detail.user)}</p>
                </div>
              </div>
              <div className="pt-3 border-t border-slate-100 text-sm text-slate-500">
                UUID: <span className="font-mono text-slate-700">{maskUuid(detail.user.uuid)}</span>
              </div>
            </LaCard>

            <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1 w-fit">
              {RANGES.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRange(r.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                    range === r.id ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  {r.label}
                </button>
              ))}
            </div>

            <LaCard className="overflow-hidden p-0">
              {detail.entries.length === 0 ? (
                <p className="text-sm text-slate-500 p-4">No activity in this range.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-slate-500 border-b border-slate-100">
                        <th className="font-medium px-4 py-2 whitespace-nowrap">Timestamp</th>
                        <th className="font-medium px-4 py-2">Field</th>
                        <th className="font-medium px-4 py-2">Old value</th>
                        <th className="font-medium px-4 py-2">New value</th>
                        <th className="font-medium px-4 py-2">By</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {detail.entries.map((entry) => {
                        const row = rowForEntry(entry);
                        return (
                          <tr key={entry.id}>
                            <td className="px-4 py-2.5 text-slate-500 whitespace-nowrap">
                              {fullTimestamp(entry.at)}
                            </td>
                            <td className="px-4 py-2.5 text-slate-700">{row.field}</td>
                            <td className="px-4 py-2.5 text-slate-500">
                              {row.oldValue !== null ? (
                                <span className="line-through opacity-70">{row.oldValue}</span>
                              ) : (
                                "—"
                              )}
                            </td>
                            <td className="px-4 py-2.5 text-slate-900 font-medium">{row.newValue}</td>
                            <td className="px-4 py-2.5 text-slate-500">{entry.actor?.fullName ?? "—"}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </LaCard>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-slate-500">
        Search for an account, then drill into its audit trail — logins, contact/name changes, ads
        posted or deleted, messages sent.
      </p>

      <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
        <LaInput
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Search by name, email, phone, or user ID…"
          className="flex-1"
        />
        <LaButton type="submit" intent="primary">
          Go
        </LaButton>
      </form>

      <LaCard className="divide-y divide-slate-100 overflow-hidden">
        {usersError ? (
          <div className="flex flex-col items-start gap-2 p-4">
            <p className="text-sm text-rose-600">{usersError}</p>
            <LaButton intent="outline" size="compact" onClick={refreshUsers}>
              Retry
            </LaButton>
          </div>
        ) : users === null ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3">
              <LaSkeleton shape="block" className="h-8 w-8 rounded-full shrink-0" />
              <div className="min-w-0 flex-1 space-y-2">
                <LaSkeleton shape="text" className="w-1/3" />
                <LaSkeleton shape="text" className="h-3 w-1/4" />
              </div>
            </div>
          ))
        ) : filtered.length === 0 ? (
          <p className="text-sm text-slate-500 p-4">No users found.</p>
        ) : (
          filtered.map((u) => <UserRow key={u.id} user={u} onOpen={() => setSelectedId(u.id)} />)
        )}
      </LaCard>
    </div>
  );
}
