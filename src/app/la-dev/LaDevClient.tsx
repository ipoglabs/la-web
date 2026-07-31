"use client";

import { useEffect, useMemo, useState } from "react";
import { LaButton, LaCard, LaInput, LaBadge, LaTabs, LaTabsList, LaTabsTrigger, LaTabsContent } from "@/components/la";
import { listUsers } from "@/app/actions/la-dev/listUsers";
import type { LaDevUser } from "@/app/actions/la-dev/types";
import { hardDeleteUser } from "@/app/actions/la-dev/hardDeleteUser";
import { getUserActivity } from "@/app/actions/la-dev/getUserActivity";
import type { LaDevUserActivity } from "@/app/actions/la-dev/getUserActivity";
import { toast } from "sonner";
import DeletedUsersPanel from "./DeletedUsersPanel";
import ActivityPanel from "./ActivityPanel";
import { ACTIVITY_LABELS } from "./activityLabels";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2 border-b border-slate-100 last:border-0">
      <span className="text-sm font-medium text-slate-500">{label}</span>
      <span className="text-sm text-slate-900 text-right">{children}</span>
    </div>
  );
}

export default function LaDevClient() {
  const [users, setUsers] = useState<LaDevUser[] | null>(null);
  const [filter, setFilter] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [activity, setActivity] = useState<LaDevUserActivity | null>(null);

  async function refresh() {
    setUsers(null);
    setSelectedId(null);
    setConfirming(false);
    setUsers(await listUsers());
  }

  useEffect(() => {
    refresh();
  }, []);

  const filtered = useMemo(() => {
    if (!users) return [];
    const q = filter.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.fullName.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.primaryNumber?.toLowerCase().includes(q)
    );
  }, [users, filter]);

  const selected = users?.find((u) => u.id === selectedId) ?? null;

  useEffect(() => {
    if (!selectedId) return;
    setActivity(null);
    getUserActivity(selectedId).then(setActivity);
  }, [selectedId]);

  async function handleDelete() {
    if (!selected) return;
    setDeleting(true);
    try {
      const result = await hardDeleteUser(selected.id);
      if (result.success) {
        toast.success(`Permanently deleted ${selected.email || selected.primaryNumber}. Free to re-register.`);
        await refresh();
      } else {
        toast.error(result.message || "Delete failed.");
      }
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="container-app max-w-3xl py-10 flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">la-dev — Users</h1>
        <p className="text-sm text-slate-500 mt-1">
          Dev-only — not available in production.
        </p>
      </div>

      <LaTabs defaultValue="users">
        <LaTabsList className="bg-slate-100 rounded-lg p-1">
          <LaTabsTrigger value="users" variant="card">Users</LaTabsTrigger>
          <LaTabsTrigger value="deleted" variant="card">Deleted users</LaTabsTrigger>
          <LaTabsTrigger value="activity" variant="card">Activity</LaTabsTrigger>
        </LaTabsList>

        <LaTabsContent value="users" className="flex flex-col gap-6 pt-4">
          <p className="text-sm text-slate-500">
            Select a user to view their registration status and permanently delete the record so
            the same email/phone can be re-registered.
          </p>

          <LaInput
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter by name, email, or phone…"
          />

          <LaCard className="divide-y divide-slate-100 overflow-hidden">
            {users === null ? (
              <p className="text-sm text-slate-500 p-4">Loading users…</p>
            ) : filtered.length === 0 ? (
              <p className="text-sm text-slate-500 p-4">No users found.</p>
            ) : (
              filtered.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => {
                    setSelectedId(u.id);
                    setConfirming(false);
                  }}
                  className={`flex w-full items-center justify-between gap-4 px-4 py-3 text-left hover:bg-slate-50 transition-colors ${
                    u.id === selectedId ? "bg-slate-50" : ""
                  }`}
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{u.fullName}</p>
                    <p className="text-sm text-slate-500 truncate">{u.email || u.primaryNumber || "—"}</p>
                  </div>
                  <LaBadge intent={u.isFullyRegistered ? "success" : "warning"} variant="soft">
                    {u.isFullyRegistered ? "Fully registered" : "Incomplete"}
                  </LaBadge>
                </button>
              ))
            )}
          </LaCard>

          {selected && (
            <LaCard className="p-5 flex flex-col gap-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-900">{selected.fullName}</span>
                <LaBadge intent={selected.isFullyRegistered ? "success" : "warning"} variant="soft">
                  {selected.isFullyRegistered ? "Fully registered" : "Incomplete"}
                </LaBadge>
              </div>

              <Row label="User ID">{selected.userId}</Row>
              <Row label="Email">
                {selected.email ?? "—"}{" "}
                {selected.email && (
                  <LaBadge intent={selected.isEmailVerified ? "success" : "danger"} variant="soft" className="ml-1">
                    {selected.isEmailVerified ? "verified" : "unverified"}
                  </LaBadge>
                )}
              </Row>
              <Row label="Phone">
                {selected.primaryNumber ?? "—"}{" "}
                {selected.primaryNumber && (
                  <LaBadge intent={selected.isPrimaryNumberVerified ? "success" : "danger"} variant="soft" className="ml-1">
                    {selected.isPrimaryNumberVerified ? "verified" : "unverified"}
                  </LaBadge>
                )}
              </Row>
              <Row label="Date of birth">
                {selected.dateOfBirth ? new Date(selected.dateOfBirth).toLocaleDateString() : "—"}
              </Row>
              <Row label="Location">{selected.locality || "—"}</Row>
              <Row label="Provider">{selected.provider}</Row>
              <Row label="Account status">{selected.accountStatus}</Row>
              <Row label="New user">{selected.isNewUser ? "Yes" : "No"}</Row>
              <Row label="Created">{new Date(selected.createdAt).toLocaleString()}</Row>

              <div className="pt-3 mt-2 border-t border-slate-100">
                <p className="text-sm font-medium text-slate-500 mb-2">Activity</p>
                {activity === null ? (
                  <p className="text-sm text-slate-500">Loading…</p>
                ) : (
                  <>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {Object.entries(ACTIVITY_LABELS).map(([action, label]) => (
                        <span
                          key={action}
                          className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700"
                        >
                          {label}
                          <span className="font-semibold text-slate-900">{activity.counts[action] ?? 0}</span>
                        </span>
                      ))}
                    </div>
                    {activity.recent.length === 0 ? (
                      <p className="text-sm text-slate-500">No recorded activity yet.</p>
                    ) : (
                      <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
                        {activity.recent.map((entry) => (
                          <p key={entry.id} className="text-sm text-slate-700">
                            <span className="font-medium">{ACTIVITY_LABELS[entry.action] ?? entry.action}</span>
                            {" — "}
                            {new Date(entry.at).toLocaleString()}
                          </p>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="pt-4 mt-2 border-t border-slate-100">
                {!confirming ? (
                  <LaButton intent="danger" onClick={() => setConfirming(true)}>
                    Delete permanently
                  </LaButton>
                ) : (
                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-medium text-rose-600">
                      This permanently removes the user from the database — cannot be undone. Confirm?
                    </p>
                    <div className="flex gap-2">
                      <LaButton intent="danger" onClick={handleDelete} loading={deleting}>
                        Yes, delete permanently
                      </LaButton>
                      <LaButton intent="outline" onClick={() => setConfirming(false)} disabled={deleting}>
                        Cancel
                      </LaButton>
                    </div>
                  </div>
                )}
              </div>
            </LaCard>
          )}
        </LaTabsContent>

        <LaTabsContent value="deleted" className="pt-4">
          <DeletedUsersPanel />
        </LaTabsContent>

        <LaTabsContent value="activity" className="pt-4">
          <ActivityPanel />
        </LaTabsContent>
      </LaTabs>
    </div>
  );
}
