"use client";

import { useEffect, useMemo, useState } from "react";
import { LaButton, LaCard, LaInput, LaBadge, LaSkeleton } from "@/components/la";
import { listUsers, type AdminUserRow } from "@/app/actions/admin/listUsers";
import { hardDeleteUser } from "@/app/actions/admin/hardDeleteUser";
import { toast } from "sonner";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2 border-b border-slate-100 last:border-0">
      <span className="text-sm font-medium text-slate-500">{label}</span>
      <span className="text-sm text-slate-900 text-right">{children}</span>
    </div>
  );
}

/**
 * /admin — Users tab: find any account and permanently delete it.
 * Moved out of dev-tools, which only sat behind shared proxy.ts Basic Auth —
 * a destructive, irreversible action belongs behind the real admin session
 * gate (requireAdminId, enforced inside listUsers/hardDeleteUser too).
 */
export default function AdminUsersPanel() {
  const [users, setUsers] = useState<AdminUserRow[] | null>(null);
  const [filter, setFilter] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

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
        u.primaryNumber?.toLowerCase().includes(q) ||
        u.userId.toLowerCase().includes(q)
    );
  }, [users, filter]);

  const selected = users?.find((u) => u.id === selectedId) ?? null;

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
    <div className="flex flex-col gap-6">
      <p className="text-sm text-slate-500">
        Find any account and permanently remove it from the database — cannot be undone. For
        moderation, use the Posts and Reports tabs instead.
      </p>

      <LaInput
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Search by name, email, phone, or user ID…"
      />

      <LaCard className="divide-y divide-slate-100 overflow-hidden">
        {users === null ? (
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
          <Row label="Created">{new Date(selected.createdAt).toLocaleString()}</Row>

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
    </div>
  );
}
