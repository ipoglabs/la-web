"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { filterChatChars, hasContactInfo } from "@/lib/chatValidation";

/**
 * ChitChat — inline "message the seller" widget on the listing-detail page.
 *
 * Wired to the real chat backend (see `app/api/conversations/**`, added
 * alongside the standalone `/chat` inbox): finds-or-creates a Conversation
 * for (me, seller, this ad) on mount, loads its history, and sends real
 * messages. No realtime here either (same REST-only scope as `/chat` —
 * see that route's file headers) — a message you send appears immediately
 * (optimistic), but a reply from the seller only shows up on next visit/
 * refresh, not pushed live.
 *
 * Two honest degraded states, matching SellerContactGate's existing
 * "sign in to email/call this seller" pattern rather than faking a working
 * widget:
 *   - Not signed in            → prompt to sign in (redirects back here).
 *   - Seller has no real `id`  → most of the 40+ mock seller pools don't
 *     have one yet (see `Seller.id`'s TODO in types/listing.ts) — chat
 *     needs a real User document to create a Conversation against, so
 *     there's nothing to wire until that seller is.
 */

type ChitMessage = { id: string; from: "me" | "seller"; text: string };

interface ChitChatProps {
  className?: string;
  /** Used as the Conversation's `adId`. */
  listingId: string;
  /** Real Mongo User id — undefined for most mock seller pools (see header). */
  sellerId?: string;
  sellerName: string;
  adTitle: string;
  adPrice: string;
  adImage?: string;
}

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden>
      <path d="M4.4 19.425q-.5.2-.95-.088T3 18.5V14l8-2-8-2V5.5q0-.55.45-.837t.95-.088l15.4 6.5q.625.275.625.925t-.625.925z" />
    </svg>
  );
}

export default function ChitChat({ className, listingId, sellerId, sellerName, adTitle, adPrice, adImage }: ChitChatProps) {
  const [myId, setMyId] = React.useState<string | null>(null);
  const [authChecked, setAuthChecked] = React.useState(false);
  const [conversationId, setConversationId] = React.useState<string | null>(null);
  const [messages, setMessages] = React.useState<ChitMessage[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [setupError, setSetupError] = React.useState<string | null>(null);
  const [message, setMessage] = React.useState("");
  const [sendError, setSendError] = React.useState<string | null>(null);
  const [sending, setSending] = React.useState(false);
  const listRef = React.useRef<HTMLDivElement>(null);

  const redirectTarget = `/listings/${listingId}`;
  // Most of the 40+ mock seller pools use human-readable slug ids (e.g.
  // "seller-bob-harrison"), not a real Mongo ObjectId — chat needs a real
  // User document to create a Conversation against, so treat anything that
  // doesn't look like a real id the same as "no id at all" (see header).
  const hasRealSeller = !!sellerId && /^[0-9a-fA-F]{24}$/.test(sellerId);

  // ── Auth check ────────────────────────────────────────────────────────────
  React.useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/me", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : { user: null }))
      .then(({ user }) => { if (!cancelled) setMyId(user?.id ?? null); })
      .catch(() => { if (!cancelled) setMyId(null); })
      .finally(() => { if (!cancelled) setAuthChecked(true); });
    return () => { cancelled = true; };
  }, []);

  // ── Find-or-create the conversation, then load its history ─────────────────
  // `loading` is only ever read from the myId+sellerId-gated render branch
  // below, so there's nothing to reset when this bails out early.
  React.useEffect(() => {
    if (!authChecked || !myId || !hasRealSeller) return;
    let cancelled = false;

    (async () => {
      try {
        const createRes = await fetch("/api/conversations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ otherUserId: sellerId, adId: listingId, adTitle, adPrice, adImage }),
        });
        if (!createRes.ok) throw new Error("Couldn't start this conversation.");
        const { conversationId: convId } = await createRes.json();
        if (cancelled) return;
        setConversationId(convId);

        const msgsRes = await fetch(`/api/conversations/${convId}/messages`);
        if (!msgsRes.ok) throw new Error("Couldn't load your messages.");
        const { messages: raw } = await msgsRes.json();
        if (cancelled) return;
        setMessages(
          raw.map((m: { _id: string; senderId: string; text: string }) => ({
            id: m._id,
            from: m.senderId === myId ? "me" : "seller",
            text: m.text,
          }))
        );
        fetch(`/api/conversations/${convId}/read`, { method: "POST" }).catch(() => {});
      } catch (err) {
        if (!cancelled) setSetupError(err instanceof Error ? err.message : "Something went wrong.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [authChecked, myId, hasRealSeller, sellerId, listingId, adTitle, adPrice, adImage]);

  React.useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    setSendError(null);

    const trimmed = message.trim();
    if (!trimmed) return;
    if (trimmed.length > 1000) { setSendError("Message is too long (max 1000 characters)."); return; }
    if (hasContactInfo(trimmed)) {
      setSendError("Please don't share phone numbers or emails here — keep contact details inside the platform.");
      return;
    }
    if (!conversationId) return;

    const optimisticId = `temp-${Date.now()}`;
    setMessages((prev) => [...prev, { id: optimisticId, from: "me", text: trimmed }]);
    setMessage("");
    setSending(true);

    try {
      const res = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: trimmed }),
      });
      if (!res.ok) throw new Error();
      const { message: saved } = await res.json();
      setMessages((prev) => prev.map((m) => (m.id === optimisticId ? { id: saved._id, from: "me", text: saved.text } : m)));
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== optimisticId));
      setSendError("Message failed to send. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <section
      className={cn(
        "bg-white px-4 py-5",
        "border-y border-slate-200 sm:rounded-xl sm:border sm:shadow-sm",
        "flex flex-col gap-4",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">ChitChat</h2>
          <p className="text-sm text-slate-500 mt-0.5">Don&apos;t worry this is private message to owner.</p>
        </div>
        {conversationId && (
          <Link href={`/chat?conv=${conversationId}`} className="shrink-0 text-sm font-medium text-blue-600 hover:underline">
            Open in Messages
          </Link>
        )}
      </div>

      {/* Not signed in */}
      {authChecked && !myId && (
        <div className="rounded-xl bg-slate-100 px-4 py-4 text-center">
          <p className="text-sm text-slate-600">
            <Link href={`/login?redirect=${encodeURIComponent(redirectTarget)}`} className="font-semibold text-blue-600 hover:underline">
              Sign in
            </Link>{" "}
            to message {sellerName}.
          </p>
        </div>
      )}

      {/* Signed in, but this seller has no real account to message yet */}
      {authChecked && myId && !hasRealSeller && (
        <div className="rounded-xl bg-slate-100 px-4 py-4 text-center">
          <p className="text-sm text-slate-500">Messaging isn&apos;t set up for this seller yet.</p>
        </div>
      )}

      {/* Real conversation */}
      {authChecked && myId && hasRealSeller && (
        <>
          {setupError ? (
            <p className="text-sm text-rose-600">{setupError}</p>
          ) : (
            <div ref={listRef} className="overflow-y-auto max-h-64 bg-slate-100 rounded-xl px-4 py-4 flex flex-col gap-3">
              {loading ? (
                <p className="text-sm text-slate-400 text-center">Loading…</p>
              ) : messages.length === 0 ? (
                <p className="text-sm text-slate-400 text-center">Say hello to {sellerName}.</p>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className={cn("flex", msg.from === "me" ? "justify-end" : "justify-start")}>
                    <div
                      className={cn(
                        "rounded-2xl px-4 py-2.5 max-w-[80%]",
                        msg.from === "me"
                          ? "bg-blue-600 text-white rounded-br-sm"
                          : "bg-white border border-slate-200 text-slate-800 rounded-bl-sm",
                      )}
                    >
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {sendError && <p className="text-sm text-rose-600">{sendError}</p>}

          <form onSubmit={handleSend} className="flex items-center gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => { setMessage(filterChatChars(e.target.value).slice(0, 1000)); setSendError(null); }}
              placeholder="Type a message…"
              disabled={loading || !!setupError}
              className="flex-1 border border-slate-300 rounded-xl py-2.5 px-4 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!message.trim() || sending || loading || !!setupError}
              aria-label="Send message"
              className="shrink-0 size-10 flex items-center justify-center rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <SendIcon />
            </button>
          </form>
        </>
      )}
    </section>
  );
}
