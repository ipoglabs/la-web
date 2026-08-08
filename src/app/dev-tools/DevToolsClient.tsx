"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { LaCard, LaInput, LaBadge, LaButton, LaTabs, LaTabsList, LaTabsTrigger, LaTabsContent, LaSkeleton } from "@/components/la";
import { listUsers } from "@/app/actions/dev-tools/listUsers";
import { useAsyncList } from "@/lib/hooks/useAsyncList";
import DeletedUsersPanel from "./DeletedUsersPanel";
import ActivityPanel from "./ActivityPanel";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2 border-b border-slate-100 last:border-0">
      <span className="text-sm font-medium text-slate-500">{label}</span>
      <span className="text-sm text-slate-900 text-right">{children}</span>
    </div>
  );
}

export default function DevToolsClient() {
  const [tab, setTab] = useState<"users" | "deleted" | "activity">("users");
  const { data: users, error, refresh } = useAsyncList(listUsers, []);
  const [filter, setFilter] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [auditUserId, setAuditUserId] = useState<string | null>(null);

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

  return (
    <div className="container-app max-w-3xl py-10 flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">dev-tools — Users</h1>
        <p className="text-sm text-slate-500 mt-1">
          Dev-only — not available in production. Permanent account deletion now lives in{" "}
          <Link href="/admin" className="text-blue-600 hover:underline">
            /admin → Users
          </Link>
          .
        </p>
      </div>

      <LaTabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
        <LaTabsList className="bg-slate-100 rounded-lg p-1">
          <LaTabsTrigger value="users" variant="card">Users</LaTabsTrigger>
          <LaTabsTrigger value="deleted" variant="card">Deleted users</LaTabsTrigger>
          <LaTabsTrigger value="activity" variant="card">Audit History</LaTabsTrigger>
        </LaTabsList>

        <LaTabsContent value="users" className="flex flex-col gap-6 pt-4">
          <p className="text-sm text-slate-500">
            Select a user to inspect their registration status. For their full activity trail, use
            Audit History; to permanently delete an account, use /admin → Users.
          </p>

          <LaInput
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter by name, email, or phone…"
          />

          <LaCard className="divide-y divide-slate-100 overflow-hidden">
            {error ? (
              <div className="flex flex-col items-start gap-2 p-4">
                <p className="text-sm text-rose-600">{error}</p>
                <LaButton intent="outline" size="compact" onClick={refresh}>
                  Retry
                </LaButton>
              </div>
            ) : users === null ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between gap-4 px-4 py-3">
                  <div className="min-w-0 flex-1 space-y-2">
                    <LaSkeleton shape="text" className="w-1/3" />
                    <LaSkeleton shape="text" className="h-3 w-1/2" />
                  </div>
                  <LaSkeleton shape="block" className="h-6 w-24 rounded-full" />
                </div>
              ))
            ) : filtered.length === 0 ? (
              <p className="text-sm text-slate-500 p-4">No users found.</p>
            ) : (
              filtered.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => setSelectedId(u.id)}
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

              <div className="pt-4 mt-2 border-t border-slate-100">
                <LaButton
                  intent="outline"
                  onClick={() => {
                    setAuditUserId(selected.id);
                    setTab("activity");
                  }}
                >
                  View activity history →
                </LaButton>
              </div>
            </LaCard>
          )}
        </LaTabsContent>

        <LaTabsContent value="deleted" className="pt-4">
          <DeletedUsersPanel />
        </LaTabsContent>

        <LaTabsContent value="activity" className="pt-4">
          <ActivityPanel initialUserId={auditUserId} />
        </LaTabsContent>
      </LaTabs>
    </div>
  );
}
