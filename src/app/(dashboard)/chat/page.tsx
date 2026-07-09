"use client";

import { useState, useRef, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { getSocket, disconnectSocket } from "@/lib/wsClient";
import type { Socket } from "socket.io-client";
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogFooter,
  AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { filterChatChars, hasContactInfo } from "@/lib/chatValidation";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TYPES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

type Message = {
  id:      string;
  from:    "me" | "them";
  text:    string;
  time:    string;
  tempId?: string;
  status?: "pending" | "sent" | "failed";
};

type Ad = { title: string; price: string; category: string; color: string; image?: string };

type Convo = {
  id:           string;
  name:         string;
  initials:     string;
  online:       boolean;
  unread:       boolean;
  unreadCount:  number;
  lastMessage:  string;
  lastTime:     string;
  lastDays:     number;
  sortOrder:    number;
  role:         "buying" | "selling";
  blocked:      boolean;
  iBlockedThem: boolean;
  otherUserId:  string;
  adId:         string;
  ad:           Ad;
  messages:     Message[];
};

type ApiConversation = {
  id:             string;
  otherUser:      { id: string; name: string; image: string };
  adId:           string;
  adTitle:        string;
  adPrice:        string;
  adImage:        string;
  lastMessage:    string;
  lastMessageAt:  string;
  unreadCount:    number;
  iBlockedThem:   boolean;
  blockedByOther: boolean;
  isBlocked:      boolean;
  createdBy?:     string;
};

type ApiMessage = {
  _id:            string;
  conversationId: string;
  senderId:       string;
  text:           string;
  tempId:         string | null;
  readBy:         string[];
  attachments:    unknown[];
  createdAt:      string;
  updatedAt:      string;
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// HELPERS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function formatLastTime(date: Date): string {
  const d = Math.floor((Date.now() - date.getTime()) / 86_400_000);
  if (d === 0) return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  if (d === 1) return "Yesterday";
  if (d < 7)   return date.toLocaleDateString("en-US", { weekday: "short" });
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

function formatMessageTime(date: Date): string {
  const isToday = date.toDateString() === new Date().toDateString();
  const t = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  return isToday ? t : `${date.getMonth() + 1}/${date.getDate()} ${t}`;
}

function getInitials(name: string): string {
  return name.split(" ").slice(0, 2).map((n) => n[0]?.toUpperCase() ?? "").join("");
}

function mapConversation(api: ApiConversation, myId: string, idx: number): Convo {
  const lastDate  = new Date(api.lastMessageAt);
  const rawDays   = (Date.now() - lastDate.getTime()) / 86_400_000;
  const daysSince = isNaN(rawDays) ? 0 : Math.floor(rawDays);
  return {
    id:           api.id,
    name:         api.otherUser.name,
    initials:     getInitials(api.otherUser.name),
    online:       false,
    unread:       api.unreadCount > 0,
    unreadCount:  api.unreadCount,
    lastMessage:  api.lastMessage,
    lastTime:     formatLastTime(lastDate),
    lastDays:     daysSince,
    sortOrder:    idx,
    role:         api.createdBy === myId ? "buying" : "selling",
    blocked:      api.isBlocked,
    iBlockedThem: api.iBlockedThem,
    otherUserId:  api.otherUser.id,
    adId:         api.adId,
    ad: {
      title:    api.adTitle,
      price:    api.adPrice,
      category: "",
      color:    "bg-slate-600",
      image:    api.adImage || undefined,
    },
    messages: [],
  };
}

function toMessage(api: ApiMessage, myId: string): Message {
  return {
    id:     api._id,
    from:   api.senderId === myId ? "me" : "them",
    text:   api.text,
    time:   formatMessageTime(new Date(api.createdAt)),
    tempId: api.tempId ?? undefined,
    status: "sent",
  };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// INPUT SAFETY
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const BLOCKED_PATTERNS = [/<[^>]*>/g, /javascript:/gi, /on\w+\s*=/gi, /(<\s*script|<\s*iframe)/gi, /(\bDROP\b|\bSELECT\b.*\bFROM\b)/gi];
type SanitizeResult = { ok: true; text: string } | { ok: false; reason: string };

function sanitizeMessage(raw: string): SanitizeResult {
  const trimmed = raw.trim();
  if (!trimmed)               return { ok: false, reason: "Message cannot be empty." };
  if (trimmed.length > 1000)  return { ok: false, reason: "Message is too long (max 1000 characters)." };
  for (const p of BLOCKED_PATTERNS) {
    if (p.test(trimmed)) { p.lastIndex = 0; return { ok: false, reason: "Plain text only — no HTML or scripts allowed." }; }
    p.lastIndex = 0;
  }
  return { ok: true, text: trimmed };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ICONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const IconChevronLeft  = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" clipRule="evenodd" d="M12.707 4.293a1 1 0 0 1 0 1.414L8.414 10l4.293 4.293a1 1 0 0 1-1.414 1.414l-5-5a1 1 0 0 1 0-1.414l5-5a1 1 0 0 1 1.414 0Z" /></svg>;
const IconChevronRight = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4"><path fillRule="evenodd" clipRule="evenodd" d="M7.293 4.293a1 1 0 0 1 1.414 0l5 5a1 1 0 0 1 0 1.414l-5 5a1 1 0 0 1-1.414-1.414L11.586 10 7.293 5.707a1 1 0 0 1 0-1.414Z" /></svg>;
const IconArrowUp      = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" clipRule="evenodd" d="M10 17a.75.75 0 0 1-.75-.75V5.612L5.29 9.77a.75.75 0 0 1-1.08-1.04l5.25-5.5a.75.75 0 0 1 1.08 0l5.25 5.5a.75.75 0 1 1-1.08 1.04L10.75 5.612V16.25A.75.75 0 0 1 10 17Z" /></svg>;
const IconSearch       = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4"><path fillRule="evenodd" clipRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" /></svg>;
const IconDotsVertical = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4"><path d="M10 3a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm0 5.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm0 5.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" /></svg>;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CONFIRM DIALOG
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function ConfirmDialog({ title, message, confirmLabel, confirmClass, onConfirm, onCancel }: {
  title: string; message: string; confirmLabel: string; confirmClass: string;
  onConfirm: () => void; onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4" onClick={onCancel}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-base font-semibold text-slate-900 mb-1">{title}</h3>
        <p className="text-sm text-slate-500 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900">Cancel</button>
          <button onClick={onConfirm} className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${confirmClass}`}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// AVATAR
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function Avatar({ initials, online }: { initials: string; online: boolean }) {
  return (
    <div className="relative shrink-0">
      <div className="h-11 w-11 rounded-full bg-slate-300 flex items-center justify-center text-sm font-medium text-slate-700 select-none">
        {initials}
      </div>
      <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full ring-2 ring-white transition-colors ${online ? "bg-emerald-400" : "bg-slate-300"}`} />
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TYPING DOTS (WhatsApp-style 3-dot bounce)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-[3px]">
      <span className="w-1 h-1 rounded-full bg-current animate-bounce [animation-delay:0ms]"   style={{ animationDuration: "1s" }} />
      <span className="w-1 h-1 rounded-full bg-current animate-bounce [animation-delay:200ms]" style={{ animationDuration: "1s" }} />
      <span className="w-1 h-1 rounded-full bg-current animate-bounce [animation-delay:400ms]" style={{ animationDuration: "1s" }} />
    </span>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CONVERSATION ROW
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function ConversationRow({
  conv, selected, isTyping, onClick, onBlock, onDelete,
}: {
  conv: Convo; selected: boolean; isTyping: boolean;
  onClick: () => void; onBlock: () => void; onDelete: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div className={`relative flex items-center border-l-4 transition-colors hover:bg-blue-50/30 ${selected ? "bg-blue-100 border-l-blue-600" : "border-l-transparent"}`}>
      <div className="flex items-center justify-center w-5 shrink-0">
        {conv.unread && !isTyping && <span className="h-2 w-2 rounded-full bg-blue-500" />}
      </div>

      <button onClick={onClick} className="flex flex-1 items-center gap-3 pr-2 py-3.5 text-left min-w-0">
        <Avatar initials={conv.initials} online={conv.online} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className={`text-sm truncate ${selected ? "font-semibold text-slate-900" : conv.unread ? "font-semibold text-slate-900" : "font-medium text-slate-700"}`}>
              {conv.name}
              {conv.blocked && <span className="ml-1.5 text-[10px] font-medium text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded-full">Blocked</span>}
            </span>
            <span className={`text-xs shrink-0 ${selected ? "text-slate-600" : "text-slate-400"}`}>{conv.lastTime}</span>
          </div>
          <div className="flex items-center mt-0.5">
            <span className={`inline-flex items-center max-w-full rounded px-1.5 py-0.5 ${selected ? "bg-blue-50" : "bg-slate-100"}`}>
              <span className={`text-[11px] font-medium truncate ${selected ? "text-slate-700" : "text-slate-500"}`}>
                {conv.adId === "direct" ? conv.name : conv.ad.title}
              </span>
            </span>
          </div>

          {/* Last message or typing indicator — Slack style */}
          {isTyping ? (
            <p className="text-sm text-emerald-500 mt-0.5 flex items-center gap-1.5">
              <TypingDots /> typing…
            </p>
          ) : (
            <p className={`text-sm truncate mt-0.5 ${selected ? "text-slate-900" : conv.unread ? "text-slate-800 font-medium" : "text-slate-500"}`}>
              {conv.lastMessage}
            </p>
          )}
        </div>
      </button>

      <div ref={menuRef} className="relative mr-3 shrink-0">
        <button onClick={(e) => { e.stopPropagation(); setMenuOpen((v) => !v); }} className="flex items-center justify-center h-8 w-8 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
          <IconDotsVertical />
        </button>
        {menuOpen && (
          <div className="absolute right-0 top-9 z-10 w-40 bg-white rounded-xl shadow-lg border border-slate-100 py-1 text-sm">
            <button onClick={() => { setMenuOpen(false); onBlock(); }} className="w-full px-4 py-2.5 text-left text-slate-700 hover:bg-slate-50">{conv.iBlockedThem ? "Unblock" : "Block"}</button>
            <button onClick={() => { setMenuOpen(false); onDelete(); }} className="w-full px-4 py-2.5 text-left text-rose-600 hover:bg-rose-50">Delete chat</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CHAT HEADER — WhatsApp style: "Online" / "typing..." below name
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function ChatHeader({ conv, otherOnline, isTyping, onBack }: {
  conv: Convo; otherOnline: boolean; isTyping: boolean; onBack: () => void;
}) {
  return (
    <div className="flex items-center gap-3 px-3 py-2.5 border-b border-slate-200 bg-white shrink-0">
      <button onClick={onBack} className="md:hidden flex items-center justify-center h-9 w-9 rounded-full hover:bg-slate-100 text-slate-600 shrink-0">
        <IconChevronLeft />
      </button>

      {/* Avatar with online ring */}
      <div className="relative shrink-0">
        {conv.ad.image
          ? <img src={conv.ad.image} alt={conv.ad.title} className="h-12 w-12 rounded-xl object-cover" />
          : <div className={`h-12 w-12 rounded-xl ${conv.ad.color}`} />
        }
        <span className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full ring-2 ring-white transition-colors ${otherOnline ? "bg-emerald-400" : "bg-slate-300"}`} />
      </div>

      {/* Name + status */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-sm font-semibold text-slate-900 truncate">{conv.name}</p>
          {!isTyping && conv.ad.price && (
            <span className="shrink-0 text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">{conv.ad.price}</span>
          )}
        </div>

        {/* Status line: typing / online shown alongside the post title */}
        {isTyping ? (
          <p className="text-xs text-emerald-500 font-medium flex items-center gap-1 mt-0.5">
            typing <TypingDots />
          </p>
        ) : (
          <p className="text-xs mt-0.5 truncate flex items-center gap-1">
            {otherOnline && <span className="text-emerald-500 font-medium shrink-0">Online</span>}
            {otherOnline && conv.ad.title && <span className="text-slate-300 shrink-0">·</span>}
            <span className="text-slate-400 truncate">
              {conv.adId === "direct" ? conv.name : conv.ad.title}
            </span>
          </p>
        )}
      </div>

      <a href="#" onClick={(e) => e.preventDefault()} className="shrink-0 text-xs text-slate-500 hover:text-slate-900 flex items-center gap-0.5 whitespace-nowrap">
        View ad <IconChevronRight />
      </a>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MESSAGE BUBBLE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function MessageBubble({ msg, showTimestamp, isGrouped }: { msg: Message; showTimestamp: boolean; isGrouped: boolean }) {
  const isMe = msg.from === "me";
  return (
    <div className={`flex flex-col ${isMe ? "items-end" : "items-start"} ${isGrouped ? "mb-0.5" : "mb-3"}`}>
      <div className={`max-w-[72%] px-4 py-2.5 text-sm leading-relaxed ${
        isMe
          ? `bg-slate-900 text-white rounded-2xl rounded-tr-sm ${msg.status === "pending" ? "opacity-50" : ""}`
          : "bg-slate-100 text-slate-800 rounded-2xl rounded-tl-sm"
      }`}>
        {msg.text}
      </div>
      {showTimestamp && (
        <div className={`flex items-center gap-1.5 mt-1 px-1 ${isMe ? "flex-row-reverse" : ""}`}>
          <span className="text-[11px] text-slate-400">{msg.time}</span>
          {isMe && msg.status === "failed" && <span className="text-[10px] text-rose-500 font-medium">⚠ Failed</span>}
        </div>
      )}
    </div>
  );
}

function resolveTimestamps(messages: Message[]): boolean[] {
  return messages.map((msg, i) => { const next = messages[i + 1]; return !next || next.from !== msg.from; });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CHAT INPUT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function ChatInput({ onSend, blocked, onUnblock, onTyping }: {
  onSend: (text: string) => void; blocked: boolean;
  onUnblock: () => void; onTyping?: (t: boolean) => void;
}) {
  const [text,        setText]        = useState("");
  const [error,       setError]       = useState<string | null>(null);
  const [showAlert,   setShowAlert]   = useState(false);
  const [pendingText, setPendingText] = useState("");
  const textareaRef                   = useRef<HTMLTextAreaElement>(null);
  const typingTimer                   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const MAX_CHARS = 1000;

  useEffect(() => () => { if (typingTimer.current) clearTimeout(typingTimer.current); }, []);

  const doSend = (txt: string) => {
    onSend(txt);
    setText("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    onTyping?.(false);
    if (typingTimer.current) clearTimeout(typingTimer.current);
  };

  const handleSend = () => {
    setError(null);
    const r = sanitizeMessage(text);
    if (!r.ok) { setError(r.reason); return; }

    // Contact info detected — ask before sending
    if (hasContactInfo(r.text)) {
      setPendingText(r.text);
      setShowAlert(true);
      return;
    }

    doSend(r.text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Strip disallowed characters as the user types
    const filtered = filterChatChars(e.target.value).slice(0, MAX_CHARS);
    setText(filtered);
    if (error) setError(null);
    if (onTyping) {
      onTyping(true);
      if (typingTimer.current) clearTimeout(typingTimer.current);
      typingTimer.current = setTimeout(() => onTyping(false), 2000);
    }
    const el = textareaRef.current;
    if (el) { el.style.height = "auto"; el.style.height = `${Math.min(el.scrollHeight, 120)}px`; }
  };

  if (blocked) {
    return (
      <div className="px-4 py-4 border-t border-slate-100 bg-white shrink-0 text-center">
        <p className="text-sm text-slate-400">
          You blocked this contact.{" "}
          <button onClick={onUnblock} className="text-blue-500 hover:underline font-medium">Unblock</button>{" "}to send messages.
        </p>
      </div>
    );
  }

  const charsLeft   = MAX_CHARS - text.length;
  const showCounter = text.length >= 800;

  return (
    <>
      <div className="px-4 pt-2 pb-3 border-t border-slate-100 bg-white shrink-0">
        {error && (
          <div className="flex items-start gap-2 mb-2 px-3 py-2 rounded-xl bg-rose-50 border border-rose-100">
            <p className="text-xs text-rose-600">{error}</p>
          </div>
        )}
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              rows={1}
              placeholder="Message..."
              className={`w-full resize-none rounded-2xl border px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 leading-relaxed overflow-y-auto bg-slate-50 ${
                error ? "border-rose-300 focus:ring-rose-200" : "border-slate-200 focus:ring-slate-200 focus:border-slate-300"
              }`}
            />
            {showCounter && (
              <span className={`absolute bottom-2 right-3 text-[10px] ${charsLeft <= 50 ? "text-rose-500" : "text-slate-400"}`}>{charsLeft}</span>
            )}
          </div>
          <button
            onClick={handleSend}
            disabled={!text.trim()}
            className="shrink-0 h-10 w-10 rounded-full bg-slate-900 flex items-center justify-center text-white disabled:opacity-30 hover:enabled:bg-slate-700"
          >
            <IconArrowUp />
          </button>
        </div>
      </div>

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
    </>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CHAT VIEW
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function ChatView({ conv, myId, onBack, onUnblock, onConvoUpdate, onTypingChange }: {
  conv: Convo; myId: string;
  onBack: () => void; onUnblock: () => void;
  onConvoUpdate: (id: string, patch: { lastMessage?: string; lastMessageAt?: string }) => void;
  onTypingChange: (convId: string, typing: boolean) => void;
}) {
  const [messages,    setMessages]    = useState<Message[]>([]);
  const [loadingMsgs, setLoadingMsgs] = useState(true);
  const [hasMore,     setHasMore]     = useState(false);
  const [nextCursor,  setNextCursor]  = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isTyping,    setIsTyping]    = useState(false);
  const [otherOnline, setOtherOnline] = useState(conv.online);

  const bottomRef   = useRef<HTMLDivElement>(null);
  const topRef      = useRef<HTMLDivElement>(null);
  const atBottomRef = useRef(true);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    atBottomRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 60;
  };

  // ── Fetch messages + join socket room ──────────────────────────────────────
  useEffect(() => {
    setMessages([]);
    setLoadingMsgs(true);
    setHasMore(false);
    setNextCursor(null);
    setIsTyping(false);

    fetch(`/api/conversations/${conv.id}/messages`)
      .then((r) => r.json())
      .then(({ messages: raw, hasMore: more, nextCursor: cursor }) => {
        setMessages(raw.map((m: ApiMessage) => toMessage(m, myId)));
        setHasMore(more);
        setNextCursor(cursor);
        setLoadingMsgs(false);
        requestAnimationFrame(() => bottomRef.current?.scrollIntoView({ behavior: "instant" }));
      })
      .catch(() => setLoadingMsgs(false));

    fetch(`/api/conversations/${conv.id}/read`, { method: "POST" }).catch(() => {});

    let cancelled = false;
    let cleanup: (() => void) | null = null;

    getSocket().then((sock: Socket) => {
      if (cancelled) return;

      sock.emit("join:conversation", conv.id);

      const onNewMsg = (data: { message: ApiMessage }) => {
        if (data.message.senderId === myId) return; // already shown optimistically
        const msg = toMessage(data.message, myId);
        setMessages((prev) => [...prev, msg]);
        onConvoUpdate(conv.id, { lastMessage: data.message.text, lastMessageAt: data.message.createdAt });
        fetch(`/api/conversations/${conv.id}/read`, { method: "POST" }).catch(() => {});
        if (atBottomRef.current) requestAnimationFrame(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }));
      };

      const onTypingStart = (data: { userId: string }) => {
        if (data.userId === myId) return;
        setIsTyping(true);
        onTypingChange(conv.id, true);
        if (typingTimer.current) clearTimeout(typingTimer.current);
        typingTimer.current = setTimeout(() => { setIsTyping(false); onTypingChange(conv.id, false); }, 3000);
      };

      const onTypingStop = (data: { userId: string }) => {
        if (data.userId === myId) return;
        setIsTyping(false);
        onTypingChange(conv.id, false);
        if (typingTimer.current) clearTimeout(typingTimer.current);
      };

      // Re-join conversation room after any reconnect (server restart / network blip)
      const onReconnect = () => sock.emit("join:conversation", conv.id);

      sock.on("message:new",  onNewMsg);
      sock.on("typing:start", onTypingStart);
      sock.on("typing:stop",  onTypingStop);
      sock.on("connect",      onReconnect);

      cleanup = () => {
        sock.emit("leave:conversation", conv.id);
        sock.off("message:new",  onNewMsg);
        sock.off("typing:start", onTypingStart);
        sock.off("typing:stop",  onTypingStop);
        sock.off("connect",      onReconnect);
        if (typingTimer.current) clearTimeout(typingTimer.current);
        onTypingChange(conv.id, false);
      };
    }).catch(() => {});

    return () => { cancelled = true; cleanup?.(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conv.id]);

  // ── Presence: watch the other user's online status ─────────────────────────
  useEffect(() => {
    if (!conv.otherUserId) return;
    let cancelled = false;
    let cleanup: (() => void) | null = null;

    getSocket().then((sock: Socket) => {
      if (cancelled) return;

      sock.emit("watch:presence", conv.otherUserId);

      const onOnline    = (d: { userId: string }) => { if (d.userId === conv.otherUserId) setOtherOnline(true); };
      const onOffline   = (d: { userId: string }) => { if (d.userId === conv.otherUserId) setOtherOnline(false); };
      const onStatus    = (d: { userId: string; online: boolean }) => { if (d.userId === conv.otherUserId) setOtherOnline(d.online); };
      // Re-watch after reconnect so online status is refreshed
      const onReconnect = () => sock.emit("watch:presence", conv.otherUserId);

      sock.on("user:online",      onOnline);
      sock.on("user:offline",     onOffline);
      sock.on("presence:status",  onStatus);
      sock.on("connect",          onReconnect);

      cleanup = () => {
        sock.emit("unwatch:presence", conv.otherUserId);
        sock.off("user:online",     onOnline);
        sock.off("user:offline",    onOffline);
        sock.off("presence:status", onStatus);
        sock.off("connect",         onReconnect);
      };
    }).catch(() => {});

    return () => { cancelled = true; cleanup?.(); };
  }, [conv.otherUserId]);

  // ── Infinite scroll upward ─────────────────────────────────────────────────
  const loadMore = useCallback(async () => {
    if (!hasMore || loadingMore || !nextCursor) return;
    setLoadingMore(true);
    try {
      const res = await fetch(`/api/conversations/${conv.id}/messages?cursor=${nextCursor}`);
      const { messages: raw, hasMore: more, nextCursor: cursor } = await res.json();
      setMessages((prev) => [...raw.map((m: ApiMessage) => toMessage(m, myId)), ...prev]);
      setHasMore(more);
      setNextCursor(cursor);
    } finally { setLoadingMore(false); }
  }, [conv.id, hasMore, loadingMore, nextCursor, myId]);

  useEffect(() => {
    const el = topRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) loadMore(); }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [loadMore]);

  // ── Optimistic send ────────────────────────────────────────────────────────
  const handleSend = async (text: string) => {
    const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const optimistic: Message = { id: tempId, from: "me", text, time: formatMessageTime(new Date()), tempId, status: "pending" };

    setMessages((prev) => [...prev, optimistic]);
    atBottomRef.current = true;
    requestAnimationFrame(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }));

    try {
      const res = await fetch(`/api/conversations/${conv.id}/messages`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ text, tempId }),
      });
      if (!res.ok) throw new Error(await res.text());
      const { message: saved } = await res.json();
      setMessages((prev) => prev.map((m) => m.tempId === tempId ? { ...toMessage(saved, myId), status: "sent" } : m));
      onConvoUpdate(conv.id, { lastMessage: text, lastMessageAt: saved.createdAt });
    } catch {
      setMessages((prev) => prev.map((m) => m.tempId === tempId ? { ...m, status: "failed" } : m));
      toast.error("Message failed to send.");
    }
  };

  // ── Typing — direct socket emit (no API) ───────────────────────────────────
  const handleTyping = useCallback((typing: boolean) => {
    getSocket().then((sock: Socket) => sock.emit(typing ? "typing:start" : "typing:stop", conv.id)).catch(() => {});
  }, [conv.id]);

  const showTimestamps = resolveTimestamps(messages);

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <ChatHeader conv={conv} otherOnline={otherOnline} isTyping={isTyping} onBack={onBack} />

      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-2 bg-slate-50/30" onScroll={handleScroll}>
        <div ref={topRef} className="h-px" />

        {loadingMore && <div className="flex justify-center py-2"><span className="text-xs text-slate-400">Loading older messages…</span></div>}

        {loadingMsgs ? (
          <div className="flex justify-center py-8"><span className="text-sm text-slate-400">Loading…</span></div>
        ) : (
          messages.map((msg, i) => (
            <MessageBubble key={msg.id} msg={msg} showTimestamp={showTimestamps[i]} isGrouped={!showTimestamps[i]} />
          ))
        )}

        {/* WhatsApp-style typing bubble */}
        {isTyping && (
          <div className="flex items-end mb-3">
            <div className="bg-slate-100 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0ms]"   style={{ animationDuration: "1s" }} />
              <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:200ms]" style={{ animationDuration: "1s" }} />
              <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:400ms]" style={{ animationDuration: "1s" }} />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <ChatInput onSend={handleSend} blocked={conv.blocked} onUnblock={onUnblock} onTyping={handleTyping} />
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EMPTY STATE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function EmptyState() {
  return (
    <div className="hidden md:flex flex-col flex-1 items-center justify-center text-center px-8 bg-slate-50/50">
      <div className="h-14 w-14 rounded-full bg-white border border-slate-200 flex items-center justify-center mb-4 shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7 text-slate-400">
          <path d="M12 2a10 10 0 1 1-4.64 18.86l-4.3 1.12a.85.85 0 0 1-1.03-1.04l1.11-4.29A10 10 0 0 1 12 2Zm1.25 11h-4.6a.75.75 0 0 0 0 1.5H13.35a.75.75 0 0 0 0-1.5h-.1Zm2-3.5h-6.6a.75.75 0 0 0 0 1.5H15.35a.75.75 0 0 0 0-1.5h-.1Z" />
        </svg>
      </div>
      <p className="text-sm font-medium text-slate-900">Your messages</p>
      <p className="text-sm text-slate-500 mt-1">Select a conversation to start chatting</p>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PAGE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function ChatPageContent() {
  const searchParams = useSearchParams();
  const convParam    = searchParams.get("conv"); // conversation ID passed from ChitChat

  const [convos,       setConvos]      = useState<Convo[]>([]);
  const [myId,         setMyId]        = useState<string | null>(null);
  const [loading,      setLoading]     = useState(true);
  const [selected,     setSelected]    = useState<Convo | null>(null);
  const [activeTab,    setActiveTab]   = useState("recent");
  const [searchQuery,  setSearchQuery] = useState("");
  const [dialog,       setDialog]      = useState<{ type: "block" | "delete"; convoId: string } | null>(null);
  // Tracks which conversation's other user is currently typing
  const [typingConvIds, setTypingConvIds] = useState<Set<string>>(new Set());

  // Refs so socket handlers always see the latest value without stale closures
  const selectedRef  = useRef<Convo | null>(null);
  const convosRef    = useRef<Convo[]>([]);
  const autoOpened   = useRef(false); // guard — only auto-open once per mount
  useEffect(() => { selectedRef.current = selected; }, [selected]);
  useEffect(() => { convosRef.current   = convos;   }, [convos]);

  // ── Fetch conversations + user ─────────────────────────────────────────────
  useEffect(() => {
    Promise.all([
      fetch("/api/auth/me").then((r) => r.json()),
      fetch("/api/conversations").then((r) => r.json()),
    ])
      .then(([me, convData]) => {
        const id = me.user?.id ?? null;
        setMyId(id);
        setConvos((convData.conversations ?? []).map((c: ApiConversation, i: number) => mapConversation(c, id ?? "", i)));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // ── Auto-open conversation when arriving from ChitChat (?conv=<id>) ─────────
  useEffect(() => {
    if (!convParam || loading || convos.length === 0 || autoOpened.current) return;
    const target = convos.find((c) => c.id === convParam);
    if (target) {
      autoOpened.current = true;
      if (target.unreadCount > 0) {
        window.dispatchEvent(new CustomEvent("conv-read", { detail: { count: target.unreadCount } }));
      }
      setSelected(target);
      setConvos((prev) => prev.map((c) => c.id === target.id ? { ...c, unread: false, unreadCount: 0 } : c));
    }
  }, [convParam, loading, convos]);

  // ── Global socket: unread updates + presence for conversation list ─────────
  useEffect(() => {
    if (!myId) return;
    let cancelled = false;
    let cleanup: (() => void) | null = null;

    getSocket().then((sock: Socket) => {
      if (cancelled) return;

      // conversation:updated — new message arrived while browsing other tab
      // Uses selectedRef so this handler never needs to be re-registered on selection change
      const onUpdated = (data: { conversationId: string; lastMessage: string; lastMessageAt: string }) => {
        setConvos((prev) => prev.map((c) => {
          if (c.id !== data.conversationId) return c;
          const d = new Date(data.lastMessageAt);
          return {
            ...c,
            lastMessage: data.lastMessage,
            lastTime:    formatLastTime(d),
            lastDays:    Math.floor((Date.now() - d.getTime()) / 86_400_000),
            unread:      selectedRef.current?.id !== c.id,
            unreadCount: selectedRef.current?.id !== c.id ? (c.unreadCount ?? 0) + 1 : c.unreadCount,
          };
        }));
      };

      // Presence events for the conversation list avatars
      const onOnline  = (d: { userId: string }) => setConvos((prev) => prev.map((c) => c.otherUserId === d.userId ? { ...c, online: true }  : c));
      const onOffline = (d: { userId: string }) => setConvos((prev) => prev.map((c) => c.otherUserId === d.userId ? { ...c, online: false } : c));
      const onStatus  = (d: { userId: string; online: boolean }) => setConvos((prev) => prev.map((c) => c.otherUserId === d.userId ? { ...c, online: d.online } : c));

      // Re-watch presence for all convos after a reconnect (server restart, network blip)
      const onReconnect = () => {
        convosRef.current.forEach((c) => sock.emit("watch:presence", c.otherUserId));
      };

      sock.on("conversation:updated", onUpdated);
      sock.on("user:online",          onOnline);
      sock.on("user:offline",         onOffline);
      sock.on("presence:status",      onStatus);
      sock.on("connect",              onReconnect);

      cleanup = () => {
        sock.off("conversation:updated", onUpdated);
        sock.off("user:online",          onOnline);
        sock.off("user:offline",         onOffline);
        sock.off("presence:status",      onStatus);
        sock.off("connect",              onReconnect);
      };
    }).catch(() => {});

    return () => { cancelled = true; cleanup?.(); };
  // selected?.id removed — selectedRef keeps it fresh without re-running this effect
  }, [myId]);

  // ── Watch presence for all conversation participants in the list ───────────
  useEffect(() => {
    if (!myId || convos.length === 0) return;
    let cancelled = false;

    getSocket().then((sock: Socket) => {
      if (cancelled) return;
      convos.forEach((c) => sock.emit("watch:presence", c.otherUserId));
    }).catch(() => {});

    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myId, convos.map((c) => c.id).join(",")]);

  // Socket stays alive so AppHeader can keep receiving unread-count events.
  // Disconnect happens only on logout (handled in AppHeader).

  const handleConvoUpdate = useCallback((convoId: string, patch: { lastMessage?: string; lastMessageAt?: string }) => {
    setConvos((prev) => prev.map((c) => {
      if (c.id !== convoId) return c;
      const d = patch.lastMessageAt ? new Date(patch.lastMessageAt) : null;
      return {
        ...c,
        lastMessage: patch.lastMessage ?? c.lastMessage,
        lastTime:    d ? formatLastTime(d) : c.lastTime,
        lastDays:    d ? Math.floor((Date.now() - d.getTime()) / 86_400_000) : c.lastDays,
      };
    }));
  }, []);

  const handleTypingChange = useCallback((convId: string, typing: boolean) => {
    setTypingConvIds((prev) => {
      const next = new Set(prev);
      typing ? next.add(convId) : next.delete(convId);
      return next;
    });
  }, []);

  const handleBlock = useCallback(async (convoId: string) => {
    const res = await fetch(`/api/conversations/${convoId}/block`, { method: "POST" });
    if (!res.ok) { toast.error("Action failed."); return; }
    const { iBlockedThem } = await res.json();
    setConvos((prev) => prev.map((c) => c.id === convoId ? { ...c, iBlockedThem, blocked: iBlockedThem || (c.blocked && !c.iBlockedThem) } : c));
    if (iBlockedThem && selected?.id === convoId) setSelected(null);
    setDialog(null);
  }, [selected?.id]);

  const handleDelete = useCallback(async (convoId: string) => {
    const res = await fetch(`/api/conversations/${convoId}`, { method: "DELETE" });
    if (!res.ok) { toast.error("Failed to delete conversation."); setDialog(null); return; }
    setConvos((prev) => prev.filter((c) => c.id !== convoId));
    if (selected?.id === convoId) setSelected(null);
    setDialog(null);
  }, [selected?.id]);

  const handleSelect = (conv: Convo) => {
    // Tell AppHeader to subtract this conversation's unread count from its badge
    if (conv.unreadCount > 0) {
      window.dispatchEvent(new CustomEvent("conv-read", { detail: { count: conv.unreadCount } }));
    }
    setSelected(conv);
    setConvos((prev) => prev.map((c) => c.id === conv.id ? { ...c, unread: false, unreadCount: 0 } : c));
  };

  const HISTORY_CAP = 180;
  const dayLimits: Record<string, number> = { recent: 30, "1mo": 30, "3mo": 90, "6mo": 180 };
  const searchNorm  = searchQuery.trim().toLowerCase();
  const visibleConvos = convos
    .filter((c) => c.lastDays <= Math.min(dayLimits[activeTab] ?? 30, HISTORY_CAP))
    .filter((c) => !searchNorm || c.name.toLowerCase().includes(searchNorm) || c.ad.title.toLowerCase().includes(searchNorm));

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white">

      <main className="flex flex-1 overflow-hidden">

        {/* ── Left: conversation list ── */}
        <div className={`flex flex-col w-full shrink-0 md:w-85 md:border-r md:border-slate-100 ${selected ? "hidden md:flex" : "flex"}`}>

          <div className="px-4 pt-4 pb-3 border-b border-slate-100 shrink-0 space-y-3">
            <h1 className="text-xl font-semibold text-slate-900">Messages</h1>

            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"><IconSearch /></span>
              <input
                type="search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or listing…"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-300"
              />
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="recent">Recent</TabsTrigger>
                <TabsTrigger value="1mo">1mo</TabsTrigger>
                <TabsTrigger value="3mo">3mo</TabsTrigger>
                <TabsTrigger value="6mo">6mo</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {loading ? (
              <p className="px-4 py-8 text-sm text-slate-400 text-center">Loading conversations…</p>
            ) : visibleConvos.length === 0 ? (
              <p className="px-4 py-8 text-sm text-slate-400 text-center">
                {searchNorm ? `No results for "${searchQuery}".` : "No conversations in this period."}
              </p>
            ) : (
              visibleConvos.map((conv) => (
                <ConversationRow
                  key={conv.id}
                  conv={conv}
                  selected={selected?.id === conv.id}
                  isTyping={typingConvIds.has(conv.id)}
                  onClick={() => handleSelect(conv)}
                  onBlock={() => conv.iBlockedThem ? handleBlock(conv.id) : setDialog({ type: "block", convoId: conv.id })}
                  onDelete={() => setDialog({ type: "delete", convoId: conv.id })}
                />
              ))
            )}
          </div>
        </div>

        {/* ── Right: chat ── */}
        {selected && myId ? (
          <ChatView
            key={selected.id}
            conv={selected}
            myId={myId}
            onBack={() => setSelected(null)}
            onUnblock={() => handleBlock(selected.id)}
            onConvoUpdate={handleConvoUpdate}
            onTypingChange={handleTypingChange}
          />
        ) : (
          <EmptyState />
        )}
      </main>

      {dialog?.type === "block" && (
        <ConfirmDialog
          title="Block this contact?"
          message="They won't be able to message you. You can unblock at any time."
          confirmLabel="Block" confirmClass="bg-slate-900 text-white hover:bg-slate-700"
          onConfirm={() => handleBlock(dialog.convoId)} onCancel={() => setDialog(null)}
        />
      )}
      {dialog?.type === "delete" && (
        <ConfirmDialog
          title="Delete this conversation?"
          message="This will permanently remove the chat history. This cannot be undone."
          confirmLabel="Delete" confirmClass="bg-rose-600 text-white hover:bg-rose-700"
          onConfirm={() => handleDelete(dialog.convoId)} onCancel={() => setDialog(null)}
        />
      )}
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense>
      <ChatPageContent />
    </Suspense>
  );
}
