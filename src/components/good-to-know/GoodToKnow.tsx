/**
 * GoodToKnow — la design system selling-points editor
 *
 * Two components:
 *  - GoodToKnowEditor   — seller fills in label/value pairs (e.g. "Parking → Available")
 *  - GoodToKnowUserView — buyer sees the polished read-only display
 *
 * ─────────────────────────────────────────────────────────────
 * IMPORT
 * ─────────────────────────────────────────────────────────────
 *   import {
 *     GoodToKnowEditor,
 *     GoodToKnowUserView,
 *   } from "@/components/good-to-know/GoodToKnow";
 *
 * ─────────────────────────────────────────────────────────────
 * EDITOR — controlled pattern
 * ─────────────────────────────────────────────────────────────
 *   const [points, setPoints] = useState<GoodToKnowPoint[]>([]);
 *   const [title,  setTitle]  = useState("Good To Know");
 *
 *   <GoodToKnowEditor
 *     maxPoints={8}
 *     onChange={setPoints}
 *     onTitleChange={setTitle}
 *   />
 *
 * ─────────────────────────────────────────────────────────────
 * USER VIEW
 * ─────────────────────────────────────────────────────────────
 *   <GoodToKnowUserView points={points} title={title} />
 *
 * ─────────────────────────────────────────────────────────────
 * EDITOR PROPS
 * ─────────────────────────────────────────────────────────────
 *   maxPoints?      number                    Max rows (default 10).
 *   minPoints?      number                    Min rows — cannot delete below (default 1).
 *   defaultTitle?   string                    Initial title value.
 *   titleOptions?   string[]                  Preset title choices in the selector.
 *   initialPoints?  {label,value}[]           Seed data.
 *   onChange?       (pts: GoodToKnowPoint[]) => void
 *   onTitleChange?  (title: string) => void
 */
"use client";

import * as React from "react";
import { ChevronDown, Pencil, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { LaButton, LaInput } from "@/components/la";

/* ─── constants ────────────────────────────────────────────── */
const LABEL_MAX = 40;
const VALUE_MAX = 60;

const DEFAULT_TITLE_OPTIONS = [
  "Good To Know",
  "Key Details",
  "At a Glance",
  "Highlights",
  "Quick Facts",
];

const SAMPLE_POINTS: { label: string; value: string }[] = [
  { label: "Parking",  value: "Available" },
  { label: "Security", value: "24/7 CCTV" },
  { label: "",         value: ""          },
];

/* ─── types ────────────────────────────────────────────────── */

/**
 * A single selling point.
 * `id` is a stable internal key — strip it before persisting to an API.
 */
export interface GoodToKnowPoint {
  id:    string;
  label: string;
  value: string;
}

export interface GoodToKnowEditorProps {
  /** Maximum number of rows. Default 10. */
  maxPoints?:     number;
  /** Cannot delete below this count. Default 1. */
  minPoints?:     number;
  /** Preset title choices shown in the section-title selector. */
  titleOptions?:  string[];
  /** Initial title. Defaults to first titleOption. */
  defaultTitle?:  string;
  /** Seed rows. Stable IDs will be added internally. */
  initialPoints?: { label: string; value: string }[];
  /** Called on every change with the current rows. */
  onChange?:      (points: GoodToKnowPoint[]) => void;
  /** Called when the section title changes. */
  onTitleChange?: (title: string) => void;
}

export interface GoodToKnowUserViewProps {
  points: { label: string; value: string }[];
  title?: string;
}

/* ─── helpers ──────────────────────────────────────────────── */
let _seq = 0;
function newId(): string { return `gtk-${++_seq}`; }

function seedPoints(
  raw: { label: string; value: string }[],
  limit: number,
): GoodToKnowPoint[] {
  return raw.slice(0, limit).map((r) => ({ id: newId(), ...r }));
}

/* ─── GoodToKnowEditor ─────────────────────────────────────── */
export function GoodToKnowEditor({
  maxPoints    = 10,
  minPoints    = 1,
  titleOptions = DEFAULT_TITLE_OPTIONS,
  defaultTitle,
  initialPoints = SAMPLE_POINTS,
  onChange,
  onTitleChange,
}: GoodToKnowEditorProps) {
  const firstOption = titleOptions[0] ?? "Good To Know";
  const initTitle   = defaultTitle ?? firstOption;

  // Single lazy initializer guarantees points + editingIds share the same generated IDs
  const [editorState, setEditorState] = React.useState<{
    points:     GoodToKnowPoint[];
    editingIds: Set<string>;
  }>(() => {
    const pts = seedPoints(initialPoints, maxPoints);
    return {
      points:     pts,
      editingIds: new Set(pts.filter((p) => !p.label.trim() || !p.value.trim()).map((p) => p.id)),
    };
  });
  const { points, editingIds } = editorState;

  // Wrapper helpers keep callsites unchanged while routing through combined state
  function setPoints(fn: (prev: GoodToKnowPoint[]) => GoodToKnowPoint[]) {
    setEditorState((prev) => ({ ...prev, points: fn(prev.points) }));
  }
  function setEditingIds(fn: (prev: Set<string>) => Set<string>) {
    setEditorState((prev) => ({ ...prev, editingIds: fn(prev.editingIds) }));
  }

  const [title,      setTitle]      = React.useState(initTitle);
  const [titleOpen,  setTitleOpen]  = React.useState(false);

  const newRowRef  = React.useRef<HTMLInputElement | null>(null);
  const titleRef   = React.useRef<HTMLDivElement>(null);

  /* close title menu on outside click */
  React.useEffect(() => {
    if (!titleOpen) return;
    function handler(e: MouseEvent) {
      if (titleRef.current && !titleRef.current.contains(e.target as Node)) {
        setTitleOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [titleOpen]);

  /* ── title handlers ── */
  function handleTitleSelect(val: string) {
    setTitle(val);
    setTitleOpen(false);
    onTitleChange?.(val);
  }

  /* ── row edit mode ── */
  function startEdit(id: string) {
    setEditingIds((prev) => new Set([...prev, id]));
    // Auto-focus the label input after the row re-renders in edit mode
    requestAnimationFrame(() => {
      const el = document.querySelector<HTMLInputElement>(`[data-row-id="${id}"]`);
      el?.focus();
    });
  }

  function handleBlur(id: string, label: string, value: string) {
    // Switch to preview only when BOTH fields are filled
    if (label.trim() && value.trim()) {
      setEditingIds((prev) => { const s = new Set(prev); s.delete(id); return s; });
    }
  }

  /* ── row field handlers ── */
  function handleField(id: string, field: "label" | "value", val: string) {
    setPoints((prev) => {
      const next = prev.map((p) => (p.id === id ? { ...p, [field]: val } : p));
      onChange?.(next);
      return next;
    });
  }

  function handleAdd() {
    if (points.length >= maxPoints) return;
    const last = points[points.length - 1];
    if (last && !last.label.trim() && !last.value.trim()) return;
    const id = newId();
    setPoints((prev) => {
      const next = [...prev, { id, label: "", value: "" }];
      onChange?.(next);
      return next;
    });
    setEditingIds((prev) => new Set([...prev, id]));
    requestAnimationFrame(() => newRowRef.current?.focus());
  }

  function handleDelete(id: string) {
    if (points.length <= minPoints) return;
    setPoints((prev) => {
      const next = prev.filter((p) => p.id !== id);
      onChange?.(next);
      return next;
    });
    setEditingIds((prev) => { const s = new Set(prev); s.delete(id); return s; });
  }

  /* ── derived ── */
  const lastPoint  = points[points.length - 1];
  const canAdd     = points.length < maxPoints && !(lastPoint && !lastPoint.label.trim() && !lastPoint.value.trim());
  const filledCount = points.filter((p) => p.label.trim() && p.value.trim()).length;

  return (
    <div className="space-y-4">

      {/* ── Title pill + floating menu ── */}
      <div ref={titleRef} className="relative inline-block">
        <button
          type="button"
          onClick={() => setTitleOpen((v) => !v)}
          className="flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-3.5 py-1.5 text-sm font-semibold text-slate-800 shadow-xs hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
        >
          {title}
          <ChevronDown
            aria-hidden="true"
            className={cn("size-3.5 text-slate-400 transition-transform duration-150", titleOpen && "rotate-180")}
          />
        </button>

        {titleOpen && (
          <div className="absolute left-0 top-full mt-1.5 z-50 min-w-40 rounded-xl border border-slate-200 bg-white py-1 shadow-lg ring-1 ring-black/5">
            {titleOptions.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => handleTitleSelect(opt)}
                className={cn(
                  "flex w-full items-center px-4 py-2 text-sm transition-colors",
                  opt === title
                    ? "bg-blue-50 font-semibold text-blue-700"
                    : "text-slate-700 hover:bg-slate-50",
                )}
              >
                {opt}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Column headers ── */}
      <div className="flex items-center gap-2">
        <p className="flex-1 text-xs font-semibold uppercase tracking-wide text-slate-400">Label</p>
        <p className="flex-1 text-xs font-semibold uppercase tracking-wide text-slate-400">Value / Detail</p>
        <div className="w-20 shrink-0" />
      </div>

      {/* ── Rows ── */}
      <div className="space-y-2">
        {points.map((point, idx) => {
          const isLast    = idx === points.length - 1;
          const isEmpty   = !point.label.trim() && !point.value.trim();
          const isEditing = editingIds.has(point.id) || isEmpty;

          return (
            <div key={point.id} className="flex items-center gap-2">
              {isEditing ? (
                /* ── Edit mode — blur fires on the wrapper, so tabbing label→value doesn't collapse */
                <div
                  className="flex flex-1 gap-2"
                  onBlur={(e) => {
                    // Only collapse when focus leaves the entire row (not just one input to the other)
                    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
                      handleBlur(point.id, point.label, point.value);
                    }
                  }}
                >
                  <LaInput
                    className="flex-1"
                    placeholder="e.g. Parking"
                    value={point.label}
                    maxLength={LABEL_MAX}
                    aria-label={`Label for row ${idx + 1}`}
                    data-row-id={point.id}
                    ref={isLast ? newRowRef : undefined}
                    onChange={(e) => handleField(point.id, "label", e.target.value)}
                  />
                  <LaInput
                    className="flex-1"
                    placeholder="e.g. Available"
                    value={point.value}
                    maxLength={VALUE_MAX}
                    aria-label={`Value for row ${idx + 1}`}
                    onChange={(e) => handleField(point.id, "value", e.target.value)}
                  />
                </div>
              ) : (
                /* ── Preview mode (dot leader) ── */
                <div className="flex flex-1 items-center gap-2 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2.5 min-w-0">
                  <span className="min-w-0 max-w-[42%] truncate text-sm font-medium text-slate-700">
                    {point.label}
                  </span>
                  <span className="min-w-4 flex-1 border-b border-dashed border-slate-300 shrink" />
                  <span className="min-w-0 max-w-[42%] truncate text-sm text-slate-900">
                    {point.value}
                  </span>
                </div>
              )}

              {/* Edit (only in preview mode) */}
              <button
                type="button"
                aria-label={`Edit row ${idx + 1}`}
                onClick={() => startEdit(point.id)}
                className={cn(
                  "flex w-9 h-9 shrink-0 items-center justify-center rounded-md transition-colors",
                  isEditing
                    ? "invisible pointer-events-none"
                    : "text-slate-400 hover:bg-blue-50 hover:text-blue-500",
                )}
              >
                <Pencil aria-hidden="true" className="w-4 h-4" />
              </button>

              {/* Delete */}
              <button
                type="button"
                aria-label={`Remove row ${idx + 1}`}
                disabled={points.length <= minPoints}
                onClick={() => handleDelete(point.id)}
                className={cn(
                  "flex w-9 h-9 shrink-0 items-center justify-center rounded-md transition-colors",
                  points.length <= minPoints
                    ? "cursor-not-allowed text-slate-200"
                    : "text-slate-400 hover:bg-rose-50 hover:text-rose-500",
                )}
              >
                <Trash2 aria-hidden="true" className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      {/* ── Footer ── */}
      <div className="flex items-center justify-between pt-1">
        <p className="text-xs text-slate-400">
          {filledCount} of {maxPoints} points added
        </p>
        <LaButton
          type="button"
          intent="secondary"
          size="compact"
          disabled={!canAdd}
          onClick={handleAdd}
        >
          <span className="flex items-center gap-1">
            <Plus aria-hidden="true" className="w-3.5 h-3.5" />
            Add point
          </span>
        </LaButton>
      </div>
    </div>
  );
}

/* ─── GoodToKnowUserView ───────────────────────────────────── */
export function GoodToKnowUserView({
  points,
  title = "Good To Know",
}: GoodToKnowUserViewProps) {
  const visible = points.filter((p) => p.label.trim() || p.value.trim());

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      {/* Header band */}
      <div className="border-b border-slate-100 bg-slate-50 px-5 py-3">
        <h2 className="text-base font-semibold text-slate-800">{title}</h2>
      </div>

      {visible.length === 0 ? (
        <p className="px-5 py-4 text-sm text-slate-400">No details added yet.</p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {visible.map((point, idx) => (
            <li key={idx} className="flex items-center gap-3 px-5 py-3 min-w-0">
              <span className="min-w-0 max-w-[42%] truncate text-sm font-medium text-slate-700">
                {point.label}
              </span>
              {/* dot leader */}
              <span className="min-w-4 flex-1 shrink border-b border-dashed border-slate-300" />
              <span className="min-w-0 max-w-[42%] truncate text-sm text-slate-900">
                {point.value}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

