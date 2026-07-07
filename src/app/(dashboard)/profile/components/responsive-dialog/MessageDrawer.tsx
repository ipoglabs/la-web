"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Props = {
  sellerName?: string;
  receiverId?: string;
};

const MAX_CHARS = 500;

export function MessageResponsiveDialog({ sellerName = "Seller", receiverId }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const isDesktop = useMediaQuery("(min-width: 768px)");

  async function handleSend() {
    if (!receiverId) return;
    setSending(true);
    setError("");

    try {
      // Step 1: find-or-create conversation
      const convRes = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          otherUserId: receiverId,
          adId: "direct",
          adTitle: sellerName,
        }),
      });

      if (!convRes.ok) {
        const data = await convRes.json().catch(() => ({}));
        throw new Error(data.error || "Could not start conversation");
      }

      const { conversationId } = await convRes.json();
      const convId: string = conversationId;

      // Step 2: send the first message
      const text = subject.trim() ? `${subject.trim()}\n\n${message.trim()}` : message.trim();

      const msgRes = await fetch(`/api/conversations/${convId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!msgRes.ok) {
        const data = await msgRes.json().catch(() => ({}));
        throw new Error(data.error || "Could not send message");
      }

      setOpen(false);
      setSubject("");
      setMessage("");
      router.push("/chat");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setSending(false);
    }
  }

  const canSend = !!receiverId && message.trim().length > 0 && !sending;

  // ── Trigger ──────────────────────────────────────────────────────────────
  const trigger = (
    <button
      type="button"
      className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-700 text-white text-sm font-semibold px-4 py-3 rounded-xl transition-colors"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
        <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 0 0-1.032-.211 50.89 50.89 0 0 0-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 0 0 2.433 3.984L7.28 21.53A.75.75 0 0 1 6 21v-4.03a48.527 48.527 0 0 1-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979Z" />
        <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 0 0 1.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.105-2.8-2.63-2.94A49.4 49.4 0 0 0 15.75 7.5Z" />
      </svg>
      Send a message
    </button>
  );

  // ── Form body ─────────────────────────────────────────────────────────────
  const body = (
    <div className="px-5 py-4 space-y-4">
      {/* To */}
      <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-50 rounded-lg px-3 py-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400 w-6 shrink-0">To</span>
        <span className="font-medium text-slate-700">{sellerName}</span>
      </div>

      {/* Subject */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
          Subject <span className="text-slate-300 font-normal normal-case">(optional)</span>
        </label>
        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 transition"
          placeholder="e.g. Enquiry about your property listing"
        />
      </div>

      {/* Message */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Message
          </label>
          <span className={`text-[11px] tabular-nums ${message.length > MAX_CHARS * 0.9 ? "text-rose-500" : "text-slate-400"}`}>
            {message.length}/{MAX_CHARS}
          </span>
        </div>
        <textarea
          value={message}
          onChange={(e) => {
            if (e.target.value.length <= MAX_CHARS) setMessage(e.target.value);
          }}
          className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-slate-300 transition"
          placeholder={`Hi ${sellerName}, I'm interested in one of your listings…`}
          rows={5}
        />
      </div>

      {/* Error */}
      {!receiverId && (
        <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2">Unable to identify this user. Try refreshing the page.</p>
      )}
      {error && (
        <p className="text-xs text-rose-500 bg-rose-50 rounded-lg px-3 py-2">{error}</p>
      )}
    </div>
  );

  // ── Footer ────────────────────────────────────────────────────────────────
  const footer = (
    <div className="px-5 pb-5 pt-3 flex gap-3">
      <button
        type="button"
        onClick={() => { setOpen(false); setError(""); }}
        disabled={sending}
        className="flex-none px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:border-slate-400 hover:text-slate-800 transition-colors disabled:opacity-40"
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={handleSend}
        disabled={!canSend}
        className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 transition-colors"
      >
        {sending ? (
          <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
            <path d="M3.478 2.405a.75.75 0 0 0-.926.94l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.405Z" />
          </svg>
        )}
        {sending ? "Sending…" : "Send message"}
      </button>
    </div>
  );

  // ── Close button ──────────────────────────────────────────────────────────
  const closeBtn = (
    <button
      type="button"
      onClick={() => { setOpen(false); setError(""); }}
      disabled={sending}
      className="shrink-0 size-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors disabled:opacity-40"
    >
      <X className="size-4 text-slate-500" />
      <span className="sr-only">Close</span>
    </button>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={(v) => { if (!sending) { setOpen(v); setError(""); } }}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className="max-w-md w-full p-0 gap-0 rounded-2xl overflow-hidden">
          <DialogHeader className="flex flex-row items-center justify-between px-5 pt-5 pb-3 border-b border-slate-100">
            <DialogTitle className="text-base font-semibold text-slate-900">
              Message {sellerName}
            </DialogTitle>
            {closeBtn}
          </DialogHeader>
          {body}
          {footer}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={(v) => { if (!sending) { setOpen(v); setError(""); } }} dismissible={false}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent className="max-h-[92dvh] flex flex-col rounded-t-2xl">
        <DrawerHeader className="flex flex-row items-center justify-between px-5 pt-4 pb-3 border-b border-slate-100">
          <DrawerTitle className="text-base font-semibold text-slate-900">
            Message {sellerName}
          </DrawerTitle>
          {closeBtn}
        </DrawerHeader>
        <div className="flex-1 overflow-y-auto">
          {body}
        </div>
        <DrawerFooter className="p-0">{footer}</DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default MessageResponsiveDialog;
