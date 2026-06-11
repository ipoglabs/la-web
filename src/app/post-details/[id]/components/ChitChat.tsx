"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getSocket } from "@/lib/wsClient";
import type { Socket } from "socket.io-client";
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogFooter,
  AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { filterChatChars, hasContactInfo } from "@/lib/chatValidation";

// ── Types ──────────────────────────────────────────────────────────────────────

type Msg = {
  id:      string;
  text:    string;
  from:    "me" | "them";
  time:    string;
  tempId?: string;
  status?: "pending" | "sent" | "failed";
};

type ApiMessage = {
  _id:       string;
  senderId:  string;
  text:      string;
  tempId:    string | null;
  createdAt: string;
};

type ApiConversation = {
  id:        string;
  adId:      string;
  otherUser: { id: string };
};

export type ChitChatProps = {
  postId:    string;
  postTitle: string;
  postPrice: string;
  postImage: string;
  sellerId:  string;
};

// ── Helpers ────────────────────────────────────────────────────────────────────

function toMsg(m: ApiMessage, myId: string): Msg {
  return {
    id:   m._id,
    text: m.text,
    from: m.senderId === myId ? "me" : "them",
    time: new Date(m.createdAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
    tempId: m.tempId ?? undefined,
    status: "sent",
  };
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function ChitChat({ postId, postTitle, postPrice, postImage, sellerId }: ChitChatProps) {
  const router = useRouter();

  const [authChecked, setAuthChecked] = useState(false);
  const [myId,        setMyId]        = useState<string | null>(null);
  const [convId,      setConvId]      = useState<string | null>(null);
  const [messages,    setMessages]    = useState<Msg[]>([]);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [text,        setText]        = useState("");
  const [sending,     setSending]     = useState(false);
  const [error,       setError]       = useState("");
  const [showAlert,   setShowAlert]   = useState(false);
  const [pendingText, setPendingText] = useState("");

  const bottomRef     = useRef<HTMLDivElement>(null);
  const sockCleanup   = useRef<(() => void) | null>(null);

  // ── Socket subscription (called when convId is known) ─────────────────────

  const subscribeSocket = useCallback((cId: string, uid: string) => {
    sockCleanup.current?.();

    getSocket().then((sock: Socket) => {
      sock.emit("join:conversation", cId);

      const onNewMsg = (data: { message: ApiMessage }) => {
        if (data.message.senderId === uid) return;
        setMessages((prev) => [...prev, toMsg(data.message, uid)]);
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
      };

      const onReconnect = () => sock.emit("join:conversation", cId);

      sock.on("message:new", onNewMsg);
      sock.on("connect",     onReconnect);

      sockCleanup.current = () => {
        sock.emit("leave:conversation", cId);
        sock.off("message:new", onNewMsg);
        sock.off("connect",     onReconnect);
      };
    }).catch(() => {});
  }, []);

  // ── Mount: auth check + find existing conversation ─────────────────────────

  useEffect(() => {
    let cancelled = false;

    async function init() {
      // Auth check always runs first so myId is set before authChecked flips
      const meRes  = await fetch("/api/auth/me");
      const meData = await meRes.json();
      const uid    = meData.user?.id ?? null;
      if (cancelled) return;

      setMyId(uid);
      setAuthChecked(true);

      // Can't chat: not logged in, no seller id, or viewing own listing
      if (!uid || !sellerId || uid === sellerId) return;

      // Find existing conversation for this post
      const convosRes = await fetch("/api/conversations");
      if (!convosRes.ok || cancelled) return;

      const { conversations = [] } = await convosRes.json();
      const existing: ApiConversation | undefined = conversations.find(
        (c: ApiConversation) => c.adId === postId && c.otherUser?.id === sellerId
      );

      if (!existing || cancelled) return;

      setConvId(existing.id);
      setLoadingMsgs(true);

      const msgsRes = await fetch(`/api/conversations/${existing.id}/messages?limit=30`);
      if (cancelled) return;

      const { messages: raw = [] } = await msgsRes.json();
      setMessages(raw.map((m: ApiMessage) => toMsg(m, uid)));
      setLoadingMsgs(false);

      fetch(`/api/conversations/${existing.id}/read`, { method: "POST" }).catch(() => {});
      subscribeSocket(existing.id, uid);
    }

    init().catch(() => { setAuthChecked(true); });

    return () => {
      cancelled = true;
      sockCleanup.current?.();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId, sellerId]);

  // ── Auto-scroll on new messages ────────────────────────────────────────────

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  // ── Send ───────────────────────────────────────────────────────────────────

  const doSend = useCallback(async (trimmed: string) => {
    if (!myId) return;
    setError("");
    setSending(true);
    setText("");

    const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const optimistic: Msg = {
      id: tempId, text: trimmed, from: "me",
      time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      tempId, status: "pending",
    };
    setMessages((prev) => [...prev, optimistic]);

    try {
      let activeConvId = convId;

      // Create conversation on first message
      if (!activeConvId) {
        const convRes = await fetch("/api/conversations", {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            otherUserId: sellerId,
            adId:        postId,
            adTitle:     postTitle,
            adPrice:     postPrice,
            adImage:     postImage,
          }),
        });

        if (!convRes.ok) {
          const d = await convRes.json().catch(() => ({}));
          throw new Error(d.error || "Could not start conversation");
        }

        const { conversationId } = await convRes.json();
        activeConvId = conversationId;
        setConvId(conversationId);
        subscribeSocket(conversationId, myId);
      }

      // Send message
      const msgRes = await fetch(`/api/conversations/${activeConvId}/messages`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: trimmed, tempId }),
      });

      if (!msgRes.ok) {
        const d = await msgRes.json().catch(() => ({}));
        throw new Error(d.error || "Failed to send");
      }

      const { message: saved } = await msgRes.json();
      setMessages((prev) =>
        prev.map((m) => m.tempId === tempId ? { ...m, id: saved._id, status: "sent" } : m)
      );
    } catch (err: any) {
      setMessages((prev) =>
        prev.map((m) => m.tempId === tempId ? { ...m, status: "failed" } : m)
      );
      setError(err.message || "Failed to send");
    } finally {
      setSending(false);
    }
  }, [myId, convId, sellerId, postId, postTitle, postPrice, postImage, subscribeSocket]);

  const handleSend = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed || sending || !myId) return;

    // Contact info detected — confirm before sending
    if (hasContactInfo(trimmed)) {
      setPendingText(trimmed);
      setShowAlert(true);
      return;
    }

    doSend(trimmed);
  }, [text, sending, myId, doSend]);

  // ── Render: loading ────────────────────────────────────────────────────────

  if (!authChecked) {
    return (
      <div className="flex items-center justify-center py-8">
        <span className="text-sm text-slate-400">Loading…</span>
      </div>
    );
  }

  // ── Render: not logged in ──────────────────────────────────────────────────

  if (!myId) {
    return (
      <div className="flex flex-col items-center gap-3 py-6 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8 text-slate-300">
          <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 0 0-1.032-.211 50.89 50.89 0 0 0-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 0 0 2.433 3.984L7.28 21.53A.75.75 0 0 1 6 21v-4.03a48.527 48.527 0 0 1-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979Z" />
          <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 0 0 1.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.105-2.8-2.63-2.94A49.4 49.4 0 0 0 15.75 7.5Z" />
        </svg>
        <p className="text-sm text-slate-500">Log in to send a private message to the seller.</p>
        <a
          href="/login"
          className="bg-slate-900 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-slate-700 transition-colors"
        >
          Log in to chat
        </a>
      </div>
    );
  }

  // ── Render: own listing ────────────────────────────────────────────────────

  if (myId === sellerId) {
    return (
      <div className="flex items-center justify-center py-6">
        <p className="text-sm text-slate-400 italic">This is your listing.</p>
      </div>
    );
  }

  // ── Render: no sellerId (old post without ownerId) ─────────────────────────

  if (!sellerId) {
    return (
      <div className="py-6 text-center">
        <p className="text-sm text-slate-400">Contact the seller via email or phone above.</p>
      </div>
    );
  }

  // ── Render: chat ───────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-3">

      {/* Messages box */}
      <div className="h-60 overflow-y-auto bg-gray-100 rounded-xl p-3 flex flex-col gap-2">
        {loadingMsgs ? (
          <div className="flex items-center justify-center h-full">
            <span className="text-sm text-slate-400">Loading messages…</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-1 text-center">
            <p className="text-sm font-medium text-slate-500">No messages yet</p>
            <p className="text-xs text-slate-400">Send a message to the seller below</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}>
              <div className={`px-3 py-2 rounded-xl text-sm max-w-[82%] leading-snug ${
                msg.from === "me"
                  ? `bg-blue-500 text-white rounded-tr-sm ${msg.status === "pending" ? "opacity-60" : ""}`
                  : "bg-white text-gray-900 shadow-sm rounded-tl-sm"
              }`}>
                {msg.text}
                {msg.status === "failed" && (
                  <span className="block text-[10px] text-red-200 mt-0.5">⚠ Failed</span>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Error */}
      {error && (
        <p className="text-xs text-rose-500 bg-rose-50 px-3 py-2 rounded-lg">{error}</p>
      )}

      {/* Input row */}
      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(filterChatChars(e.target.value).slice(0, 1000))}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
          type="text"
          maxLength={1000}
          placeholder="Type a message..."
          className="flex-1 border border-gray-300 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
        />
        <button
          onClick={handleSend}
          disabled={!text.trim() || sending}
          className="bg-blue-500 hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl px-4 py-2.5 transition-colors flex items-center justify-center"
        >
          {sending ? (
            <svg className="size-5 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-5" fill="currentColor">
              <path d="M4.4 19.425q-.5.2-.95-.088T3 18.5V14l8-2l-8-2V5.5q0-.55.45-.837t.95-.088l15.4 6.5q.625.275.625.925t-.625.925z" />
            </svg>
          )}
        </button>
      </div>

      {/* Open full chat link */}
      {convId && (
        <button
          onClick={() => router.push(`/chat?conv=${convId}`)}
          className="text-xs text-blue-500 hover:text-blue-700 hover:underline text-right transition-colors"
        >
          Open full conversation →
        </button>
      )}

      {/* Contact info warning dialog */}
      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Share contact information?</AlertDialogTitle>
            <AlertDialogDescription>
              Your message appears to contain a phone number or email address.
              Sharing personal contact details in chat may go against our community
              guidelines and could put you at risk. Are you sure you want to send this?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => { setShowAlert(false); setPendingText(""); }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-rose-600 hover:bg-rose-700 text-white"
              onClick={() => {
                doSend(pendingText);
                setPendingText("");
                setShowAlert(false);
              }}
            >
              Yes, send anyway
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
