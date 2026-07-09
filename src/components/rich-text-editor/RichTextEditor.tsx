"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import {
  Heading2,
} from "lucide-react";
import { TE_BoldIcon, TE_ItalicIcon, TE_UnderlineIcon, TE_StrikethroughIcon } from "@/components/icons/la-icons";
import { TE_BulletListIcon, TE_NumberListIcon } from "@/components/icons/la-icons";
import { TE_QuoteIcon } from "@/components/icons/la-icons";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface RichTextEditorProps {
  value?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  maxLength?: number;
}

// ── Toolbar definition ────────────────────────────────────────────────────────

const TOOLBAR = [
  // Group 1 — inline text
  { key: "bold",                   command: "bold",                icon: TE_BoldIcon,             label: "Bold",          type: "toggle" },
  { key: "italic",                 command: "italic",              icon: TE_ItalicIcon,           label: "Italic",        type: "toggle" },
  { key: "underline",              command: "underline",           icon: TE_UnderlineIcon,        label: "Underline",     type: "toggle" },
  { key: "strikeThrough",          command: "strikeThrough",       icon: TE_StrikethroughIcon,    label: "Strikethrough", type: "toggle" },
  { divider: true },
  // Group 2 — lists
  { key: "insertUnorderedList",    command: "insertUnorderedList", icon: TE_BulletListIcon, label: "Bullet List",   type: "toggle" },
  { key: "insertOrderedList",      command: "insertOrderedList",   icon: TE_NumberListIcon, label: "Number List",   type: "toggle" },
  { divider: true },
  // Group 3 — block (command is always "formatBlock"; value is the block tag)
  { key: "block-h2",               command: "formatBlock",         icon: Heading2,         label: "Title",         type: "block",  value: "h2" },
  { key: "block-blockquote",       command: "formatBlock",         icon: TE_QuoteIcon,      label: "Quote",         type: "block",  value: "blockquote" },
] as const;

type ToolbarItem = (typeof TOOLBAR)[number];
type DividerItem = { divider: true };
type ButtonItem = Exclude<ToolbarItem, DividerItem>;

// ── Helpers ───────────────────────────────────────────────────────────────────

// Returns visible text stripped of invisible chars Chrome injects (ZWS etc.).
// Uses textContent (layout-independent; <br> = "") instead of innerText.
const getEditorText = (el: HTMLElement): string =>
  (el.textContent ?? "").replace(/[\u200B\u200C\u200D\uFEFF\u00AD]/g, "").trim();

// ── Component ─────────────────────────────────────────────────────────────────

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Write something...",
  maxLength = 2000,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const seededRef = useRef(false);
  const [focused, setFocused] = useState(false);
  const [activeToggles, setActiveToggles] = useState<Set<string>>(new Set());
  const [activeBlock, setActiveBlock] = useState<string>("");
  const [isEmpty, setIsEmpty] = useState(!value);
  const [charCount, setCharCount] = useState(0);

  // ── Sync toolbar state with current cursor selection ──────────────────────
  const syncStateInner = useCallback(() => {
    const el = editorRef.current;
    // Empty check via getEditorText — queryCommandState returns stale values
    // on empty elements (Chrome ZWS injection), so always clear first.
    if (!el || !getEditorText(el)) {
      setActiveToggles(new Set());
      setActiveBlock("");
      return;
    }
    const toggles = new Set<string>();
    TOOLBAR.forEach((item) => {
      if ("divider" in item) return;
      if (item.type === "toggle" && document.queryCommandState(item.command)) {
        toggles.add(item.command);
      }
    });
    setActiveToggles(toggles);
    setActiveBlock(document.queryCommandValue("formatBlock").toLowerCase());
  }, []);

  const syncState = useCallback(() => {
    const sel = document.getSelection();
    if (!sel || !editorRef.current?.contains(sel.anchorNode)) return;
    syncStateInner();
  }, [syncStateInner]);

  useEffect(() => {
    document.addEventListener("selectionchange", syncState);
    return () => document.removeEventListener("selectionchange", syncState);
  }, [syncState]);

  // ── Set initial value (seed once on mount) ───────────────────────────────
  useEffect(() => {
    const el = editorRef.current;
    if (!el || seededRef.current) return;
    seededRef.current = true;
    if (value) {
      el.innerHTML = value;
    }
  }, [value]);

  // ── Apply format command ──────────────────────────────────────────────────
  const applyFormat = useCallback(
    (item: ButtonItem) => {
      editorRef.current?.focus();
      if (item.type === "block") {
        // Toggle off: if the cursor is already inside this block type, reset to paragraph
        const currentBlock = document.queryCommandValue("formatBlock").toLowerCase();
        const targetTag = currentBlock === item.value ? "p" : item.value;
        document.execCommand("formatBlock", false, targetTag);
      } else {
        document.execCommand(item.command, false);
      }
      // Force sync — bypasses the selection guard so toolbar updates immediately
      syncStateInner();
      onChange?.(editorRef.current?.innerHTML ?? "");
    },
    [syncStateInner, onChange]
  );

  const handleInput = useCallback(() => {
    const el = editorRef.current;
    if (!el) return;
    const empty = !getEditorText(el);
    setIsEmpty(empty);
    setCharCount(empty ? 0 : el.innerText.trim().length);
    if (empty) {
      setActiveToggles(new Set());
      setActiveBlock("");
    }
    onChange?.(empty ? "" : el.innerHTML);
  }, [onChange]);

  // ── Active check helpers ──────────────────────────────────────────────────
  const isActive = useCallback((item: ButtonItem) => {
    if (item.type === "toggle") return activeToggles.has(item.command);
    if (item.type === "block") return activeBlock === item.value;
    return false;
  }, [activeToggles, activeBlock]);

  // ── Render ────────────────────────────────────────────────────────────────
  const overLimit = charCount > maxLength;

  return (
    <div className="w-full space-y-1.5">
      {/* ── Editor box ─────────────────────────────────────────────────── */}
      <div
        className={cn(
          "w-full bg-white rounded-md transition-all duration-150",
          "border-[1.5px]",
          overLimit && !focused ? "border-red-400" : "border-slate-400",
          focused && "border-b-[3px] border-b-blue-500"
        )}
      >
        {/* ── Toolbar row ────────────────────────────────────────────── */}
        <div className="flex items-center px-1 pt-2 pb-1 border-b border-slate-100">
          <div className="flex flex-wrap items-center gap-1">
            {TOOLBAR.map((item, i) => {
              if ("divider" in item) {
                return null;
              }
              const active = isActive(item);
              return (
                <button
                  key={item.key}
                  type="button"
                  title={item.label}
                  onMouseDown={(e) => {
                    e.preventDefault(); // keep editor focus
                    applyFormat(item);
                  }}
                  className={cn(
                    "flex h-[34px] w-[34px] sm:h-8 sm:w-8 items-center justify-center rounded transition-colors",
                    active
                      ? "bg-slate-300 text-slate-900"
                      : "text-slate-700 hover:bg-slate-200 hover:text-slate-900 active:bg-slate-200"
                  )}
                >
                  <item.icon className="h-4 w-4" strokeWidth={active ? 2.5 : 2} />
                  <span className="sr-only">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Editor area ────────────────────────────────────────────── */}
        <div className="relative px-4 py-3 min-h-36">
          {isEmpty && !focused && (
            <span
              className="pointer-events-none absolute top-3 left-4 text-sm text-slate-400 select-none"
              aria-hidden
            >
              {placeholder}
            </span>
          )}

          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onFocus={() => setFocused(true)}
            onBlur={() => {
              setFocused(false);
              setActiveToggles(new Set());
              setActiveBlock("");
            }}
            onKeyDown={(e) => {
              const el = editorRef.current;
              if (!el) return;
              // First printable key on an empty editor: wipe format residue and
              // reset caret so the char lands in a clean, format-free context.
              if (!getEditorText(el) && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
                el.innerHTML = "";
                const range = document.createRange();
                range.setStart(el, 0);
                range.collapse(true);
                window.getSelection()?.removeAllRanges();
                window.getSelection()?.addRange(range);
              }
            }}
            onInput={handleInput}
            onMouseUp={syncState}
            onTouchEnd={syncState}
            spellCheck
            className={cn(
              "min-h-32 text-base sm:text-sm text-slate-800 outline-none",
              "selection:bg-slate-300 selection:text-slate-900",
              "[&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-slate-900 [&_h2]:mb-1",
              "[&_p]:leading-relaxed [&_p]:text-slate-700",
              "[&_blockquote]:border-l-4 [&_blockquote]:border-slate-200 [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:text-slate-500",
              "[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-0.5",
              "[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-0.5",
              "[&_li]:leading-relaxed"
            )}
          />
        </div>
      </div>

      {/* ── Footer: error left · count right ───────────────────────────── */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs text-red-400">
          {overLimit ? `Exceeded by ${charCount - maxLength} characters` : ""}
        </span>
        <span
          className={cn(
            "text-xs tabular-nums transition-colors",
            overLimit                        ? "text-red-400 font-medium" :
            charCount > maxLength * 0.95     ? "text-red-400 font-medium" :
            charCount > maxLength * 0.8      ? "text-amber-500" :
            "text-slate-400"
          )}
        >
          {charCount} / {maxLength}
        </span>
      </div>
    </div>
  );
}
