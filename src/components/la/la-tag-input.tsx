"use client";

/**
 * LaTagInput — multi-keyword tag input for the la design system
 *
 * ─────────────────────────────────────────────────────────────
 * USAGE
 * ─────────────────────────────────────────────────────────────
 *   import { LaTagInput } from "@/components/la";
 *
 *   const [tags, setTags] = useState<string[]>([]);
 *   <LaTagInput value={tags} onChange={setTags} placeholder="Add keyword…" />
 *
 * ─────────────────────────────────────────────────────────────
 * BEHAVIOUR
 * ─────────────────────────────────────────────────────────────
 *   • Commit tag on: Enter · comma · Tab
 *   • Remove tag:   × button · Backspace when input is empty (removes last)
 *   • Validation:   a-z A-Z 0-9 + spaces only · min 2 · max 30 chars
 *                   no duplicates (case-insensitive)
 *   • OR logic hint shown below: alerts fire if any tag matches
 */

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const ALLOWED_RE = /^[a-zA-Z0-9 ]*$/;
const MIN_LEN = 2;
const MAX_LEN = 30;

export interface LaTagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
  className?: string;
  hint?: string;
}

export function LaTagInput({
  value,
  onChange,
  placeholder = "Type and press Enter…",
  maxTags,
  className,
  hint = "Alerts fire if a listing matches any keyword",
}: LaTagInputProps) {
  const [input, setInput] = React.useState("");
  const [error, setError] = React.useState("");
  const inputRef     = React.useRef<HTMLInputElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  function tryCommit(raw: string) {
    const trimmed = raw.trim().replace(/\s+/g, " ");
    if (!trimmed) { setInput(""); return; }

    if (!ALLOWED_RE.test(trimmed)) {
      setError("Only letters, numbers and spaces allowed");
      return;
    }
    if (trimmed.length < MIN_LEN) {
      setError(`At least ${MIN_LEN} characters`);
      return;
    }
    if (trimmed.length > MAX_LEN) {
      setError(`Max ${MAX_LEN} characters`);
      return;
    }
    if (value.some((t) => t.toLowerCase() === trimmed.toLowerCase())) {
      setError("Already added");
      return;
    }
    if (maxTags && value.length >= maxTags) {
      setError(`Max ${maxTags} keywords`);
      return;
    }

    onChange([...value, trimmed]);
    setInput("");
    setError("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      tryCommit(input);
    } else if (e.key === "Tab" && input.trim()) {
      // Only intercept Tab when there's pending text; otherwise let Tab navigate away
      e.preventDefault();
      tryCommit(input);
    } else if (e.key === "Backspace" && input === "" && value.length > 0) {
      onChange(value.slice(0, -1));
      setError("");
    } else {
      setError("");
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    // Strip comma immediately (it's a commit trigger)
    if (val.endsWith(",")) {
      tryCommit(val.slice(0, -1));
    } else {
      setInput(val);
      if (error) setError("");
    }
  }

  function removeTag(index: number) {
    onChange(value.filter((_, i) => i !== index));
    inputRef.current?.focus();
  }

  const atMax = !!(maxTags && value.length >= maxTags);

  return (
    <div className={cn("space-y-1.5", className)}>
      {/* Tag field */}
      <div
        ref={containerRef}
        className={cn(
          "flex min-h-10 w-full flex-wrap items-center gap-1.5 rounded-md border-[1.5px] border-gray-700/55 bg-gray-50 px-3 py-2",
          "focus-within:bg-yellow-50 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500/25",
          error && "border-red-500 focus-within:ring-red-500/25 focus-within:bg-red-50",
        )}
        onClick={() => inputRef.current?.focus()}
      >
        {/* Tags */}
        {value.map((tag, i) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-2.5 py-1 text-sm font-medium text-white"
          >
            {tag}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); removeTag(i); }}
              className="rounded-full px-0 py-0.5 hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/50"
              aria-label={`Remove ${tag}`}
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}

        {/* Text input */}
        {atMax ? (
          <span className="text-sm text-slate-400">Limit reached</span>
        ) : (
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onBlur={(e) => {
              // Skip commit when focus stays inside the component (e.g. clicking a × button)
              if (containerRef.current?.contains(e.relatedTarget as Node)) return;
              if (input.trim()) tryCommit(input);
            }}
            placeholder={value.length === 0 ? placeholder : "Add another…"}
            className="min-w-24 flex-1 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
          />
        )}
      </div>

      {/* Hint / error + optional count */}
      <div className="flex items-center justify-between gap-2">
        {error ? (
          <p className="text-sm text-red-500">{error}</p>
        ) : (
          <p className="text-sm text-slate-400">{hint}</p>
        )}
        {maxTags && (
          <p className={cn(
            "shrink-0 text-sm tabular-nums",
            value.length >= maxTags ? "font-medium text-amber-600" : "text-slate-400",
          )}>
            {value.length}/{maxTags}
          </p>
        )}
      </div>
    </div>
  );
}
