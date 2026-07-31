"use client";

import { useEffect, useMemo, useState } from "react";
import { LaCard, LaBadge, LaInput, LaButton } from "@/components/la";
import { listDeletedUsers } from "@/app/actions/la-dev/listDeletedUsers";
import { getDeletedUserData } from "@/app/actions/la-dev/getDeletedUserData";
import { getConversationMessages } from "@/app/actions/la-dev/getConversationMessages";
import type {
  LaDevDeletedUser,
  LaDevDeletedUserData,
  LaDevConversationMessage,
} from "@/app/actions/la-dev/types";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2 border-b border-slate-100 last:border-0">
      <span className="text-sm font-medium text-slate-500">{label}</span>
      <span className="text-sm text-slate-900 text-right">{children}</span>
    </div>
  );
}

const statusIntent: Record<string, "success" | "warning" | "danger" | "neutral"> = {
  active: "success",
  pending: "warning",
  off: "neutral",
  expired: "neutral",
  deleted: "danger",
};

export default function DeletedUsersPanel() {
  const [users, setUsers] = useState<LaDevDeletedUser[] | null>(null);
  const [filter, setFilter] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [data, setData] = useState<LaDevDeletedUserData | null>(null);
  const [loadingData, setLoadingData] = useState(false);
  const [openConvoId, setOpenConvoId] = useState<string | null>(null);
  const [messages, setMessages] = useState<LaDevConversationMessage[] | null>(null);
  const [loadingMessages, setLoadingMessages] = useState(false);

  useEffect(() => {
    listDeletedUsers().then(setUsers);
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    setLoadingData(true);
    setOpenConvoId(null);
    setMessages(null);
    getDeletedUserData(selectedId)
      .then(setData)
      .finally(() => setLoadingData(false));
  }, [selectedId]);

  const filtered = useMemo(() => {
    if (!users) return [];
    const q = filter.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.userId.toLowerCase().includes(q) ||
        u.deleteFeedback?.toLowerCase().includes(q) ||
        u.originalFullName?.toLowerCase().includes(q) ||
        u.originalEmail?.toLowerCase().includes(q) ||
        u.originalPrimaryNumber?.toLowerCase().includes(q)
    );
  }, [users, filter]);

  const selected = users?.find((u) => u.id === selectedId) ?? null;

  async function toggleConversation(convoId: string) {
    if (openConvoId === convoId) {
      setOpenConvoId(null);
      return;
    }
    setOpenConvoId(convoId);
    setLoadingMessages(true);
    setMessages(null);
    try {
      setMessages(await getConversationMessages(convoId));
    } finally {
      setLoadingMessages(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-slate-500">
        Accounts a user has deleted themselves. Their email/phone/name are already anonymized
        (see softDeleteAccount) — this view is read-only and exists so a deleted account&apos;s
        original listings and chat history can still be looked up when needed.
      </p>

      <LaInput
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Filter by name, email, phone, user ID, or feedback…"
      />

      <LaCard className="divide-y divide-slate-100 overflow-hidden">
        {users === null ? (
          <p className="text-sm text-slate-500 p-4">Loading deleted users…</p>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-slate-500 p-4">No deleted users found.</p>
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
                <p className="text-sm font-medium text-slate-900 truncate">
                  {u.originalFullName || u.userId}
                </p>
                <p className="text-sm text-slate-500 truncate">
                  {u.originalEmail || u.originalPrimaryNumber || u.userId}
                </p>
              </div>
              <span className="text-sm text-slate-500 shrink-0">
                {u.deletedAt ? new Date(u.deletedAt).toLocaleDateString() : "—"}
              </span>
            </button>
          ))
        )}
      </LaCard>

      {selected && (
        <LaCard className="p-5 flex flex-col gap-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-slate-900">{selected.userId}</span>
            <LaBadge intent="danger" variant="soft">Deleted</LaBadge>
          </div>

          <Row label="Registered">{new Date(selected.createdAt).toLocaleString()}</Row>
          <Row label="Deleted">{selected.deletedAt ? new Date(selected.deletedAt).toLocaleString() : "—"}</Row>
          <Row label="Delete feedback">{selected.deleteFeedback || "—"}</Row>

          <div className="pt-3 mt-2 border-t border-slate-100">
            <p className="text-sm font-medium text-slate-500 mb-1">Original identity (admin-only)</p>
            <Row label="Name">{selected.originalFullName || "—"}</Row>
            <Row label="Email">{selected.originalEmail || "—"}</Row>
            <Row label="Phone">{selected.originalPrimaryNumber || "—"}</Row>
          </div>

          {selected.audit.length > 0 && (
            <div className="pt-3 mt-2 border-t border-slate-100">
              <p className="text-sm font-medium text-slate-500 mb-1">Audit trail</p>
              {selected.audit.map((a, i) => (
                <p key={i} className="text-sm text-slate-700">
                  {a.action} — {new Date(a.at).toLocaleString()}
                </p>
              ))}
            </div>
          )}

          <div className="pt-4 mt-2 border-t border-slate-100">
            <p className="text-sm font-semibold text-slate-900 mb-2">Listings</p>
            {loadingData ? (
              <p className="text-sm text-slate-500">Loading…</p>
            ) : !data || data.listings.length === 0 ? (
              <p className="text-sm text-slate-500">No listings.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {data.listings.map((l) => (
                  <div key={l.id} className="rounded-lg border border-slate-200 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-slate-900 truncate">{l.name}</p>
                      <LaBadge intent={statusIntent[l.status] ?? "neutral"} variant="soft">
                        {l.status}
                      </LaBadge>
                    </div>
                    <p className="text-sm text-slate-500">
                      {l.category} / {l.subcategory} · {new Date(l.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-slate-500">
                      Seller snapshot: {l.sellerInfo.name} · {l.sellerInfo.phone} · {l.sellerInfo.email}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 mt-2 border-t border-slate-100">
            <p className="text-sm font-semibold text-slate-900 mb-2">Conversations</p>
            {loadingData ? (
              <p className="text-sm text-slate-500">Loading…</p>
            ) : !data || data.conversations.length === 0 ? (
              <p className="text-sm text-slate-500">No conversations.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {data.conversations.map((c) => (
                  <div key={c.id} className="rounded-lg border border-slate-200 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {c.adTitle || "(untitled ad)"}
                        </p>
                        <p className="text-sm text-slate-500 truncate">
                          with {c.otherParticipant.name}
                        </p>
                      </div>
                      <LaButton
                        intent="outline"
                        onClick={() => toggleConversation(c.id)}
                      >
                        {openConvoId === c.id ? "Hide messages" : "View messages"}
                      </LaButton>
                    </div>

                    {openConvoId === c.id && (
                      <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col gap-2 max-h-80 overflow-y-auto">
                        {loadingMessages ? (
                          <p className="text-sm text-slate-500">Loading messages…</p>
                        ) : !messages || messages.length === 0 ? (
                          <p className="text-sm text-slate-500">No messages.</p>
                        ) : (
                          messages.map((m) => (
                            <div key={m.id} className="text-sm">
                              <span className="font-medium text-slate-900">{m.senderName}: </span>
                              <span className="text-slate-700">{m.text}</span>
                              <span className="text-slate-500"> · {new Date(m.createdAt).toLocaleString()}</span>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </LaCard>
      )}
    </div>
  );
}
