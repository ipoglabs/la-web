"use client";

import { useState, useRef, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppHeader from "../components/AppHeader/appHeader";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TYPES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

type Message = {
  id: string;
  from: "me" | "them";
  text: string;
  time: string; // display string e.g. "4/18 9:51 AM"
};

type Ad = {
  title: string;
  price: string;
  category: string;
  color: string; // Tailwind bg — swap for imageUrl in production
};

type Convo = {
  id: string;
  name: string;
  initials: string;
  online: boolean;
  unread: boolean;
  lastMessage: string;
  lastTime: string;   // display label
  lastDays: number;   // days since last message — used for tab filter
  sortOrder: number;  // lower = more recent — used to keep list sorted
  role: "buying" | "selling";
  blocked: boolean;   // true if the user has blocked this contact
  ad: Ad;
  messages: Message[];
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// INPUT SAFETY
//
// sanitizeMessage() strips any HTML/script-like content before the text
// reaches local state (and eventually the API).
//
// In production also apply server-side sanitisation — never trust client only.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Patterns we actively block: HTML tags, JS event handlers, script/iframe, SQL
const BLOCKED_PATTERNS = [
  /<[^>]*>/g,                        // any HTML tag
  /javascript:/gi,                    // JS URI scheme
  /on\w+\s*=/gi,                     // onclick= onload= etc.
  /(<\s*script|<\s*iframe)/gi,        // script or iframe tags
  /(\bDROP\b|\bSELECT\b.*\bFROM\b)/gi, // basic SQL injection hints
];

type SanitizeResult =
  | { ok: true; text: string }
  | { ok: false; reason: string };

function sanitizeMessage(raw: string): SanitizeResult {
  const trimmed = raw.trim();

  if (trimmed.length === 0) {
    return { ok: false, reason: "Message cannot be empty." };
  }
  if (trimmed.length > 1000) {
    return { ok: false, reason: "Message is too long (max 1000 characters)." };
  }

  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(trimmed)) {
      // Reset lastIndex for global regexes so next call works correctly
      pattern.lastIndex = 0;
      return {
        ok: false,
        reason: "Your message contains content that is not allowed. Please use plain text only.",
      };
    }
    pattern.lastIndex = 0;
  }

  // All clear — return the trimmed plain text
  return { ok: true, text: trimmed };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MOCK DATA
// Replace with useQuery(["conversations"]) when integrating with the real API.
// lastDays drives the time-based tab filter; sortOrder keeps the list ordered.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const CONVOS_RAW: Convo[] = [
  {
    id: "1",  sortOrder: 1,  lastDays: 0,  name: "Sarah M.",  initials: "SM", online: true,  unread: true,  blocked: false, role: "selling",
    lastMessage: "Is it still available?", lastTime: "9:51 AM",
    ad: { title: "iPhone 14 Pro 256GB Space Black", price: "$650", category: "Electronics", color: "bg-slate-700" },
    messages: [
      { id: "m1", from: "them", text: "Hi! Is the iPhone still available?",     time: "4/23 9:48 AM" },
      { id: "m2", from: "me",   text: "Yes, still in great condition!",         time: "4/23 9:50 AM" },
      { id: "m3", from: "them", text: "Is it still available?",                 time: "4/23 9:51 AM" },
      { id: "m4", from: "me",   text: "Absolutely. Would you like to meet up?", time: "4/23 9:53 AM" },
      { id: "m5", from: "them", text: "Yes, can we do tomorrow at 2pm?",        time: "4/23 9:54 AM" },
      { id: "m6", from: "me",   text: "Works for me. Central Park entrance?",   time: "4/23 9:55 AM" },
      { id: "m7", from: "them", text: "Perfect, see you then!",                 time: "4/23 9:56 AM" },
    ],
  },
  {
    id: "2",  sortOrder: 2,  lastDays: 1,  name: "James K.",  initials: "JK", online: false, unread: false, blocked: false, role: "selling",
    lastMessage: "What's your best price?", lastTime: "Yesterday",
    ad: { title: "Vintage Leather Sofa — Dark Brown", price: "$280", category: "Furniture", color: "bg-amber-700" },
    messages: [
      { id: "m1", from: "them", text: "Hey, saw your sofa listing. What's your best price?", time: "4/22 3:12 PM" },
      { id: "m2", from: "me",   text: "I can do $260 if you can pick it up.",                time: "4/22 3:20 PM" },
      { id: "m3", from: "them", text: "Let me check with my partner and get back to you.",   time: "4/22 3:22 PM" },
    ],
  },
  {
    id: "3",  sortOrder: 3,  lastDays: 4,  name: "Priya S.",  initials: "PS", online: true,  unread: true,  blocked: false, role: "buying",
    lastMessage: "This weekend works great for me.", lastTime: "Mon",
    ad: { title: "Trek FX3 Road Bike 2022", price: "$200", category: "Sports", color: "bg-blue-600" },
    messages: [
      { id: "m1", from: "me",   text: "Hi! Love the listing. Can you do $180?", time: "4/19 11:02 AM" },
      { id: "m2", from: "them", text: "Best I can do is $190 — barely used.",   time: "4/19 11:10 AM" },
      { id: "m3", from: "me",   text: "Deal! When can I pick it up?",           time: "4/19 11:12 AM" },
      { id: "m4", from: "them", text: "This weekend works great for me.",        time: "4/19 11:15 AM" },
    ],
  },
  {
    id: "4",  sortOrder: 4,  lastDays: 6,  name: "Tom H.",    initials: "TH", online: false, unread: false, blocked: false, role: "selling",
    lastMessage: "Yes, original Apple 67W charger included!", lastTime: "Sun",
    ad: { title: "MacBook Pro M2 13-inch", price: "$950", category: "Electronics", color: "bg-zinc-600" },
    messages: [
      { id: "m1", from: "them", text: "Does it come with the charger?",           time: "4/17 7:40 PM" },
      { id: "m2", from: "me",   text: "Yes, original Apple 67W charger included!", time: "4/17 7:45 PM" },
    ],
  },
  {
    id: "5",  sortOrder: 5,  lastDays: 8,  name: "Lena R.",   initials: "LR", online: true,  unread: false, blocked: false, role: "buying",
    lastMessage: "Can you deliver to Southside?", lastTime: "Sat",
    ad: { title: "Dining Table — Solid Oak 6-Seater", price: "$350", category: "Furniture", color: "bg-orange-800" },
    messages: [
      { id: "m1", from: "me",   text: "Hi! Is delivery an option?",                time: "4/15 2:10 PM" },
      { id: "m2", from: "them", text: "I can arrange delivery for $30 extra.",      time: "4/15 2:30 PM" },
      { id: "m3", from: "me",   text: "Can you deliver to Southside?",              time: "4/15 2:35 PM" },
    ],
  },
  {
    id: "6",  sortOrder: 6,  lastDays: 12, name: "Carlos M.", initials: "CM", online: false, unread: true,  blocked: false, role: "selling",
    lastMessage: "I'll take it — when can we meet?", lastTime: "Fri",
    ad: { title: "Sony WH-1000XM5 Headphones", price: "$180", category: "Electronics", color: "bg-indigo-600" },
    messages: [
      { id: "m1", from: "them", text: "Hey, are the headphones still up for sale?", time: "4/11 10:05 AM" },
      { id: "m2", from: "me",   text: "Yes! Barely used, great condition.",          time: "4/11 10:12 AM" },
      { id: "m3", from: "them", text: "I'll take it!",                               time: "4/11 10:14 AM" },
      { id: "m4", from: "me",   text: "Great — when can we meet?",                   time: "4/11 10:15 AM" },
    ],
  },
  {
    id: "7",  sortOrder: 7,  lastDays: 13, name: "Nadia O.",  initials: "NO", online: false, unread: false, blocked: false, role: "selling",
    lastMessage: "None at all — comes with the original box.", lastTime: "4/10",
    ad: { title: "Canon EOS R50 Camera Body", price: "$520", category: "Photography", color: "bg-red-700" },
    messages: [
      { id: "m1", from: "them", text: "Hi! Any scratches or dents on the camera?",   time: "4/10 6:20 PM" },
      { id: "m2", from: "me",   text: "None at all — comes with the original box.",   time: "4/10 6:35 PM" },
    ],
  },
  {
    id: "8",  sortOrder: 8,  lastDays: 14, name: "Wei L.",    initials: "WL", online: true,  unread: false, blocked: false, role: "buying",
    lastMessage: "Can I see it today?", lastTime: "4/9",
    ad: { title: "IKEA KALLAX Shelf Unit — White", price: "$60", category: "Furniture", color: "bg-gray-400" },
    messages: [
      { id: "m1", from: "me",   text: "Is the shelf still available?",        time: "4/9 4:00 PM" },
      { id: "m2", from: "them", text: "Yes! I can hold it until tomorrow.",    time: "4/9 4:10 PM" },
      { id: "m3", from: "me",   text: "Can I see it today?",                  time: "4/9 4:12 PM" },
    ],
  },
  {
    id: "9",  sortOrder: 9,  lastDays: 16, name: "Oliver T.", initials: "OT", online: false, unread: false, blocked: false, role: "selling",
    lastMessage: "Sold! Thanks!", lastTime: "4/7",
    ad: { title: "Specialized Allez Road Bike", price: "$420", category: "Sports", color: "bg-green-700" },
    messages: [
      { id: "m1", from: "them", text: "Is the Specialized available?",    time: "4/7 9:00 AM" },
      { id: "m2", from: "me",   text: "Yes, pick up only though.",         time: "4/7 9:15 AM" },
      { id: "m3", from: "them", text: "Works for me. $400 final?",         time: "4/7 9:20 AM" },
      { id: "m4", from: "me",   text: "$410 and it's yours.",               time: "4/7 9:22 AM" },
      { id: "m5", from: "them", text: "Sold! Thanks!",                     time: "4/7 9:23 AM" },
    ],
  },
  {
    id: "10", sortOrder: 10, lastDays: 18, name: "Fatima B.", initials: "FB", online: true,  unread: true,  blocked: false, role: "buying",
    lastMessage: "Works perfectly! Selling because we moved.", lastTime: "4/5",
    ad: { title: "Smeg Retro Toaster Oven — Cream", price: "$95", category: "Appliances", color: "bg-yellow-600" },
    messages: [
      { id: "m1", from: "me",   text: "Hi! Does the oven work fine?",                   time: "4/5 1:30 PM" },
      { id: "m2", from: "them", text: "Works perfectly! Selling because we moved.",      time: "4/5 1:45 PM" },
    ],
  },
  {
    id: "11", sortOrder: 11, lastDays: 20, name: "Ethan W.",  initials: "EW", online: false, unread: false, blocked: false, role: "selling",
    lastMessage: "I can pick up Tuesday.", lastTime: "4/3",
    ad: { title: "Nintendo Switch OLED — White", price: "$230", category: "Gaming", color: "bg-violet-600" },
    messages: [
      { id: "m1", from: "them", text: "Hi! Is the Switch bundle still available?", time: "4/3 11:00 AM" },
      { id: "m2", from: "me",   text: "Yes, comes with 2 games.",                  time: "4/3 11:08 AM" },
      { id: "m3", from: "them", text: "I can pick up Tuesday.",                    time: "4/3 11:10 AM" },
    ],
  },
  {
    id: "12", sortOrder: 12, lastDays: 24, name: "Amara J.",  initials: "AJ", online: false, unread: false, blocked: false, role: "buying",
    lastMessage: "It's a light grey-blue. Very neutral!", lastTime: "3/30",
    ad: { title: "3-Seater Fabric Couch", price: "$150", category: "Furniture", color: "bg-teal-700" },
    messages: [
      { id: "m1", from: "me",   text: "Hi, what colour is the couch exactly?",     time: "3/30 5:00 PM" },
      { id: "m2", from: "them", text: "It's a light grey-blue. Very neutral!",      time: "3/30 5:20 PM" },
    ],
  },
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ICONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function IconChevronLeft() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden="true" focusable="false">
      <path fillRule="evenodd" clipRule="evenodd" d="M12.707 4.293a1 1 0 0 1 0 1.414L8.414 10l4.293 4.293a1 1 0 0 1-1.414 1.414l-5-5a1 1 0 0 1 0-1.414l5-5a1 1 0 0 1 1.414 0Z" />
    </svg>
  );
}

function IconChevronRight() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true" focusable="false">
      <path fillRule="evenodd" clipRule="evenodd" d="M7.293 4.293a1 1 0 0 1 1.414 0l5 5a1 1 0 0 1 0 1.414l-5 5a1 1 0 0 1-1.414-1.414L11.586 10 7.293 5.707a1 1 0 0 1 0-1.414Z" />
    </svg>
  );
}

function IconArrowUp() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden="true" focusable="false">
      <path fillRule="evenodd" clipRule="evenodd" d="M10 17a.75.75 0 0 1-.75-.75V5.612L5.29 9.77a.75.75 0 0 1-1.08-1.04l5.25-5.5a.75.75 0 0 1 1.08 0l5.25 5.5a.75.75 0 1 1-1.08 1.04L10.75 5.612V16.25A.75.75 0 0 1 10 17Z" />
    </svg>
  );
}

function IconSearch() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true" focusable="false">
      <path fillRule="evenodd" clipRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" />
    </svg>
  );
}

// Three-dot / ellipsis icon for the row actions menu
function IconDotsVertical() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true" focusable="false">
      <path d="M10 3a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm0 5.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm0 5.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
    </svg>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CONFIRM DIALOG
// A minimal inline modal used for Block / Delete confirmations.
// In production: replace with your own Dialog component.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function ConfirmDialog({
  title,
  message,
  confirmLabel,
  confirmClass,
  onConfirm,
  onCancel,
}: {
  title: string;
  message: string;
  confirmLabel: string;
  confirmClass: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    // Backdrop — clicking outside cancels
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6"
        onClick={(e) => e.stopPropagation()} // prevent backdrop click firing inside
      >
        <h3 className="text-base font-semibold text-slate-900 mb-1">{title}</h3>
        <p className="text-sm text-slate-500 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${confirmClass}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SHARED COMPONENTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Avatar — initials circle with an online/offline dot bottom-right
function Avatar({ initials, online }: { initials: string; online: boolean }) {
  return (
    <div className="relative shrink-0">
      <div className="h-11 w-11 rounded-full bg-slate-300 flex items-center justify-center text-sm font-medium text-slate-700 select-none">
        {initials}
      </div>
      <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full ring-2 ring-white ${
        online ? "bg-emerald-400" : "bg-slate-300"
      }`} />
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CONVERSATION ROW
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function ConversationRow({
  conv,
  selected,
  onClick,
  onBlock,
  onDelete,
}: {
  conv: Convo;
  selected: boolean;
  onClick: () => void;
  onBlock: () => void;
  onDelete: () => void;
}) {
  // Controls the ⋯ dropdown menu visibility
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close the menu when clicking anywhere outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div
      className={`relative flex items-center border-l-4 transition-colors hover:bg-blue-50/30 ${
        selected
          ? "bg-blue-100 border-l-blue-600"   // selected: stronger bg + thicker left accent
          : "border-l-transparent"
      }`}
    >
      {/*
        Unread dot — sits flush left of the avatar, Teams-style.
        Only visible when conv.unread is true.
      */}
      <div className="flex items-center justify-center w-5 shrink-0">
        {conv.unread && (
          <span className="h-2 w-2 rounded-full bg-blue-500" aria-label="Unread messages" />
        )}
      </div>

      {/* Main row button — opens the conversation */}
      <button
        onClick={onClick}
        className="flex flex-1 items-center gap-3 pr-2 py-3.5 text-left min-w-0"
      >
        <Avatar initials={conv.initials} online={conv.online} />

        <div className="flex-1 min-w-0">

          {/* Row 1 — name + timestamp */}
          <div className="flex items-center justify-between gap-2">
            <span className={`text-sm truncate ${
              selected ? "font-semibold text-slate-900" : (conv.unread ? "font-semibold text-slate-900" : "font-medium text-slate-700")
            }`}>
              {conv.name}
              {conv.blocked && (
                <span className="ml-1.5 text-[10px] font-medium text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded-full">Blocked</span>
              )}
            </span>
            <span className={`text-xs shrink-0 ${selected ? "text-slate-600" : "text-slate-400"}`}>{conv.lastTime}</span>
          </div>

          {/* Row 2 — listing chip: subtle bg tag distinguishes it from the message preview */}
          <div className="flex items-center mt-1">
            <span className={`inline-flex items-center max-w-full rounded px-1.5 py-0.5 min-w-0 ${selected ? "bg-blue-50" : "bg-slate-100"}`}>
              <span className={`text-[11px] font-medium truncate ${selected ? "text-slate-700" : "text-slate-500"}`}>{conv.ad.title}</span>
            </span>
          </div>

          {/* Row 3 — last message preview */}
          <p className={`text-sm truncate mt-0.5 ${
            selected ? "text-slate-900" : (conv.unread ? "text-slate-800" : "text-slate-700")
          }`}>
            {conv.lastMessage}
          </p>

        </div>
      </button>

      {/* ⋯ menu button — Block / Delete actions */}
      <div ref={menuRef} className="relative mr-3 shrink-0">
        <button
          onClick={(e) => { e.stopPropagation(); setMenuOpen((v) => !v); }}
          className="flex items-center justify-center h-8 w-8 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Conversation options"
        >
          <IconDotsVertical />
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-9 z-10 w-40 bg-white rounded-xl shadow-lg border border-slate-100 py-1 text-sm">
            <button
              onClick={() => { setMenuOpen(false); onBlock(); }}
              className="w-full px-4 py-2.5 text-left text-slate-700 hover:bg-slate-50 transition-colors"
            >
              {conv.blocked ? "Unblock" : "Block"}
            </button>
            <button
              onClick={() => { setMenuOpen(false); onDelete(); }}
              className="w-full px-4 py-2.5 text-left text-rose-600 hover:bg-rose-50 transition-colors"
            >
              Delete chat
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CHAT HEADER — ad context bar pinned to top of the chat view
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function ChatHeader({ conv, onBack }: { conv: Convo; onBack: () => void }) {
  return (
    <div className="flex items-center gap-3 px-3 py-2.5 border-b border-slate-400 bg-slate-200/50 shrink-0">
      {/* Back button — mobile only */}
      
      <button
        onClick={onBack}
        className="md:hidden flex items-center justify-center h-9 w-9 rounded-full hover:bg-slate-100 text-slate-600 transition-colors shrink-0"
        aria-label="Back to messages"
      >
        <IconChevronLeft />
      </button>

      {/*
        Ad thumbnail placeholder.
        In production: replace with <Image src={conv.ad.imageUrl} … />
      */}
      <div className={`h-12 w-12 rounded-xl shrink-0 ${conv.ad.color}`} aria-hidden="true" />

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-900 truncate leading-snug">{conv.ad.title}</p>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
            {conv.ad.price}
          </span>
          <span className="text-xs text-slate-400">{conv.ad.category}</span>
          <span className="flex items-center gap-1 text-xs text-slate-400">
            <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${conv.online ? "bg-emerald-400" : "bg-slate-300"}`} />
            {conv.name}
          </span>
        </div>
      </div>

      {/* View ad link — In production: href={`/listings/${conv.ad.id}`} */}
      <a
        href="#"
        onClick={(e) => e.preventDefault()}
        className="shrink-0 text-xs text-slate-700 hover:text-slate-700 transition-colors flex items-center gap-0.5 whitespace-nowrap"
      >
        View ad <IconChevronRight />
      </a>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MESSAGE BUBBLE
// showTimestamp: shown only at the end of each sender's run (not every message)
// isGrouped: true = same sender continues next → tighter vertical gap
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function MessageBubble({
  msg,
  showTimestamp,
  isGrouped,
}: {
  msg: Message;
  showTimestamp: boolean;
  isGrouped: boolean;
}) {
  const isMe = msg.from === "me";
  return (
    <div className={`flex flex-col ${isMe ? "items-end" : "items-start"} ${isGrouped ? "mb-0.5" : "mb-3"}`}>
      <div className={`max-w-[72%] px-4 py-2.5 text-sm leading-relaxed ${
        isMe
          ? "bg-slate-900 text-white rounded-2xl rounded-tr-sm"
          : "bg-slate-100 text-slate-800 rounded-2xl rounded-tl-sm"
      }`}>
        {msg.text}
      </div>
      {showTimestamp && (
        <span className="text-[11px] text-slate-400 mt-1 px-1">{msg.time}</span>
      )}
    </div>
  );
}

// Returns an array of booleans — true means "show timestamp under this bubble"
// Timestamp appears at the end of each consecutive sender run
function resolveTimestamps(messages: Message[]): boolean[] {
  return messages.map((msg, i) => {
    const next = messages[i + 1];
    return !next || next.from !== msg.from;
  });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CHAT INPUT
// Sanitises input before allowing send. Renders an inline error when blocked.
// Max 1000 characters. Shows a soft character counter at 800+.
// onUnblock: called when the user taps "Unblock" in the blocked banner.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function ChatInput({ onSend, blocked, onUnblock }: { onSend: (text: string) => void; blocked: boolean; onUnblock: () => void }) {
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const MAX_CHARS = 1000;
  const charsLeft = MAX_CHARS - text.length;
  const showCounter = text.length >= 800; // only show counter when getting close

  const handleSend = () => {
    setError(null);
    const result = sanitizeMessage(text);
    if (!result.ok) {
      setError(result.reason);
      return;
    }
    onSend(result.text);
    setText("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
    // Clear error as soon as user starts editing
    if (error) setError(null);
  };

  // Blocked state — show a banner instead of the input
  if (blocked) {
    return (
      <div className="px-4 py-4 border-t border-slate-100 bg-white shrink-0 text-center">
        <p className="text-sm text-slate-400">
          You have blocked this contact.{" "}
          <button
            onClick={onUnblock}
            className="text-blue-500 hover:underline font-medium"
          >
            Unblock
          </button>{" "}
          to send messages.
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 pt-2 pb-3 border-t border-slate-100 bg-white shrink-0">
      {/* Inline safety error */}
      {error && (
        <div className="flex items-start gap-2 mb-2 px-3 py-2 rounded-xl bg-rose-50 border border-rose-100">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" aria-hidden="true">
            <path fillRule="evenodd" clipRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm0-11a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 7Zm0 7a.875.875 0 1 0 0-1.75A.875.875 0 0 0 10 14Z" />
          </svg>
          <p className="text-xs text-rose-600 leading-snug">{error}</p>
        </div>
      )}

      <div className="flex items-end gap-2">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
            onKeyDown={handleKeyDown}
            onInput={handleInput}
            rows={1}
            placeholder="Message..."
            className={`w-full resize-none rounded-2xl border px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 leading-relaxed overflow-y-auto bg-slate-50 ${
              error
                ? "border-rose-300 focus:ring-rose-200"
                : "border-slate-200 focus:ring-slate-200 focus:border-slate-300"
            }`}
          />
          {/* Character counter — appears softly when over 800 chars */}
          {showCounter && (
            <span className={`absolute bottom-2 right-3 text-[10px] ${charsLeft <= 50 ? "text-rose-500" : "text-slate-400"}`}>
              {charsLeft}
            </span>
          )}
        </div>

        <button
          onClick={handleSend}
          disabled={!text.trim()}
          className="shrink-0 h-10 w-10 rounded-full bg-slate-900 flex items-center justify-center text-white transition-all disabled:opacity-30 hover:enabled:bg-slate-700"
          aria-label="Send message"
        >
          <IconArrowUp />
        </button>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CHAT VIEW — full conversation screen
// Receives key={conv.id} from parent so React remounts it on every switch
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function ChatView({ conv, onBack, onUnblock }: { conv: Convo; onBack: () => void; onUnblock: () => void }) {
  const [messages, setMessages] = useState<Message[]>(conv.messages);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "instant" }); }, []);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleSend = (text: string) => {
    const now = new Date();
    const time = `${now.getMonth() + 1}/${now.getDate()} ${now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;
    // In production: await api.post(`/conversations/${conv.id}/messages`, { text })
    setMessages((prev) => [...prev, { id: `new-${Date.now()}`, from: "me", text, time }]);
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <ChatHeader conv={conv} onBack={onBack} />

      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-2 bg-slate-50/30">
        {(() => {
          const showTimestamps = resolveTimestamps(messages);
          return messages.map((msg, i) => (
            <MessageBubble
              key={msg.id}
              msg={msg}
              showTimestamp={showTimestamps[i]}
              isGrouped={!showTimestamps[i]}
            />
          ));
        })()}
        <div ref={bottomRef} />
      </div>

      <ChatInput onSend={handleSend} blocked={conv.blocked} onUnblock={onUnblock} />
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EMPTY STATE — shown on desktop when no conversation is selected
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function EmptyState() {
  return (
    <div className="hidden md:flex flex-col flex-1 items-center justify-center text-center px-8 bg-slate-50/50">
      <div className="h-14 w-14 rounded-full bg-white border border-slate-200 flex items-center justify-center mb-4 shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7 text-slate-400" aria-hidden="true" focusable="false">
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
export default function ChatPage() {
  const [convos, setConvos] = useState<Convo[]>(
    // Sort by sortOrder ascending (most recent first) on first load
    [...CONVOS_RAW].sort((a, b) => a.sortOrder - b.sortOrder)
  );
  const [selected, setSelected]   = useState<Convo | null>(null);
  const [activeTab, setActiveTab] = useState("recent");
  const [searchQuery, setSearchQuery] = useState("");

  // Dialog state: { type: "block" | "delete", convoId: string } | null
  const [dialog, setDialog] = useState<{ type: "block" | "delete"; convoId: string } | null>(null);

  // ── Tab filter logic ───────────────────────────────────────────────────────
  //
  // RETENTION POLICY
  // Chat history is hard-capped at 6 months (180 days) platform-wide.
  // This is enforced via HISTORY_CAP_DAYS — every filter is clamped to it.
  // To change the platform retention window, update only this constant.
  //
  // TAB VALUES & THEIR DAY WINDOWS
  //   "recent" → ≤ 30 days   (default view — active conversations)
  //   "1mo"    → ≤ 30 days   (explicit 1-month view, same window as Recent)
  //   "3mo"    → ≤ 90 days   (medium-term history)
  //   "6mo"    → ≤ 180 days  (full history — equals the platform cap)
  //
  // NOTE: "recent" and "1mo" share the same day window intentionally.
  // "Recent" is a UX-first label for the default state (feels active/live).
  // "1mo" is a developer/power-user label for the explicit 30-day window.
  //
  // API INTEGRATION
  // Pass the resolved day limit as a query param when fetching from the backend:
  //   GET /conversations?days=30        → recent / 1mo tab
  //   GET /conversations?days=90        → 3mo tab
  //   GET /conversations?days=180       → 6mo tab
  // The backend should also enforce the 180-day cap server-side.
  // Example: api.get(`/conversations?days=${dayLimits[activeTab]}`)
  //
  const HISTORY_CAP_DAYS = 180; // platform-wide retention limit — change here only
  const dayLimits: Record<string, number> = { recent: 30, "1mo": 30, "3mo": 90, "6mo": 180 };

  const searchNorm = searchQuery.trim().toLowerCase();

  const visibleConvos = convos
    .filter((c) => c.lastDays <= Math.min(dayLimits[activeTab] ?? 30, HISTORY_CAP_DAYS))
    // Client-side search: match on contact name or listing title
    // In production: pass `q` as a query param — api.get(`/conversations?q=${searchNorm}&days=…`)
    .filter((c) =>
      !searchNorm ||
      c.name.toLowerCase().includes(searchNorm) ||
      c.ad.title.toLowerCase().includes(searchNorm)
    );

  // ── Block handler ──────────────────────────────────────────────────────────
  // Toggles block on the conversation. In production: call PATCH /conversations/:id/block
  // Only closes the chat panel when *blocking* — unblocking keeps the view open
  // so the user can immediately start messaging again.
  const handleBlock = (convoId: string) => {
    const isCurrentlyBlocked = convos.find((c) => c.id === convoId)?.blocked ?? false;
    setConvos((prev) =>
      prev.map((c) => c.id === convoId ? { ...c, blocked: !c.blocked } : c)
    );
    if (!isCurrentlyBlocked && selected?.id === convoId) setSelected(null);
    setDialog(null);
  };

  // ── Delete handler ─────────────────────────────────────────────────────────
  // Removes conversation from list. In production: call DELETE /conversations/:id
  const handleDelete = (convoId: string) => {
    setConvos((prev) => prev.filter((c) => c.id !== convoId));
    if (selected?.id === convoId) setSelected(null);
    setDialog(null);
  };

  // ── When selecting a conversation, mark it as read ─────────────────────────
  const handleSelect = (conv: Convo) => {
    setSelected(conv);
    setConvos((prev) =>
      prev.map((c) => c.id === conv.id ? { ...c, unread: false } : c)
    );
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white">

      <AppHeader />

      <main className="flex flex-1 overflow-hidden">

        {/* ── Left panel: conversation list ── */}
        <div className={`flex flex-col w-full shrink-0 md:w-85 md:border-r md:border-slate-100 ${
          selected ? "hidden md:flex" : "flex"
        }`}>

          {/* Panel header — title + time-based tab filter */}
          <div className="px-4 pt-4 pb-3 border-b border-slate-100 shrink-0 space-y-3">
            <h1 className="text-xl font-semibold text-slate-900">Messages</h1>

            {/* Search input — filters by contact name or listing title */}
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <IconSearch />
              </span>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or listing…"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-300"
              />
            </div>
            {/*
              TAB FILTER — time-based conversation scoping
              ─────────────────────────────────────────────
              Each tab narrows the list to conversations active within that window.
              The active tab value is also passed to the API as a `days` param.

              Tab values and their windows:
                recent  → last 30 days  (default)
                1mo     → last 30 days
                3mo     → last 90 days
                6mo     → last 180 days (platform history cap)

              UI behaviour:
                - "Recent" is the default on page load
                - A retention notice appears under the tab row on the "6mo" tab
                  to set clear user expectations about the history limit
            */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="recent">Recent</TabsTrigger>
                <TabsTrigger value="1mo">1mo</TabsTrigger>
                <TabsTrigger value="3mo">3mo</TabsTrigger>
                <TabsTrigger value="6mo">6mo</TabsTrigger>
              </TabsList>
            </Tabs>
            {/* Retention notice — shown only on the 6mo tab to set user expectations */}
            {activeTab === "6mo" && (
              <p className="text-[11px] text-slate-400 flex items-center gap-1 pt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3 w-3 shrink-0" aria-hidden="true">
                  <path fillRule="evenodd" clipRule="evenodd" d="M15 8A7 7 0 1 1 1 8a7 7 0 0 1 14 0Zm-6 3.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM8 4a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3A.75.75 0 0 1 8 4Z" />
                </svg>
                Chat history is kept for 6 months.
              </p>
            )}
          </div>

          {/* Scrollable list */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {visibleConvos.length === 0 ? (
              <p className="px-4 py-8 text-sm text-slate-400 text-center">
                {searchNorm ? `No results for "${searchQuery}".` : "No conversations in this period."}
              </p>
            ) : (
              visibleConvos.map((conv) => (
                <ConversationRow
                  key={conv.id}
                  conv={conv}
                  selected={selected?.id === conv.id}
                  onClick={() => handleSelect(conv)}
                  onBlock={() => {
                    // If already blocked → unblock immediately without dialog
                    if (conv.blocked) { handleBlock(conv.id); }
                    else { setDialog({ type: "block", convoId: conv.id }); }
                  }}
                  onDelete={() => setDialog({ type: "delete", convoId: conv.id })}
                />
              ))
            )}
          </div>
        </div>

        {/* ── Right panel: chat view or empty state ── */}
        {selected ? (
          <ChatView key={selected.id} conv={selected} onBack={() => setSelected(null)} onUnblock={() => handleBlock(selected.id)} />
        ) : (
          <EmptyState />
        )}

      </main>

      {/* ── Block confirmation dialog ── */}
      {dialog?.type === "block" && (
        <ConfirmDialog
          title="Block this contact?"
          message="They won't be able to message you, and you won't see their messages. You can unblock them at any time."
          confirmLabel="Block"
          confirmClass="bg-slate-900 text-white hover:bg-slate-700"
          onConfirm={() => handleBlock(dialog.convoId)}
          onCancel={() => setDialog(null)}
        />
      )}

      {/* ── Delete confirmation dialog ── */}
      {dialog?.type === "delete" && (
        <ConfirmDialog
          title="Delete this conversation?"
          message="This will permanently remove the chat history. This cannot be undone."
          confirmLabel="Delete"
          confirmClass="bg-rose-600 text-white hover:bg-rose-700"
          onConfirm={() => handleDelete(dialog.convoId)}
          onCancel={() => setDialog(null)}
        />
      )}

    </div>
  );
}

