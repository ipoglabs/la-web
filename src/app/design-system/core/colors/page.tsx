"use client";

import LaSection from "@/components/la/la-section";
import { LaSeparator } from "@/components/la";

const COLOR_SCALE_MAP = {
  rose:    ["bg-rose-50","bg-rose-100","bg-rose-200","bg-rose-300","bg-rose-400","bg-rose-500","bg-rose-600","bg-rose-700","bg-rose-800","bg-rose-900","bg-rose-950"],
  red:     ["bg-red-50","bg-red-100","bg-red-200","bg-red-300","bg-red-400","bg-red-500","bg-red-600","bg-red-700","bg-red-800","bg-red-900","bg-red-950"],
  amber:   ["bg-amber-50","bg-amber-100","bg-amber-200","bg-amber-300","bg-amber-400","bg-amber-500","bg-amber-600","bg-amber-700","bg-amber-800","bg-amber-900","bg-amber-950"],
  yellow:  ["bg-yellow-50","bg-yellow-100","bg-yellow-200","bg-yellow-300","bg-yellow-400","bg-yellow-500","bg-yellow-600","bg-yellow-700","bg-yellow-800","bg-yellow-900","bg-yellow-950"],
  lime:    ["bg-lime-50","bg-lime-100","bg-lime-200","bg-lime-300","bg-lime-400","bg-lime-500","bg-lime-600","bg-lime-700","bg-lime-800","bg-lime-900","bg-lime-950"],
  emerald: ["bg-emerald-50","bg-emerald-100","bg-emerald-200","bg-emerald-300","bg-emerald-400","bg-emerald-500","bg-emerald-600","bg-emerald-700","bg-emerald-800","bg-emerald-900","bg-emerald-950"],
  sky:     ["bg-sky-50","bg-sky-100","bg-sky-200","bg-sky-300","bg-sky-400","bg-sky-500","bg-sky-600","bg-sky-700","bg-sky-800","bg-sky-900","bg-sky-950"],
  blue:    ["bg-blue-50","bg-blue-100","bg-blue-200","bg-blue-300","bg-blue-400","bg-blue-500","bg-blue-600","bg-blue-700","bg-blue-800","bg-blue-900","bg-blue-950"],
  purple:  ["bg-purple-50","bg-purple-100","bg-purple-200","bg-purple-300","bg-purple-400","bg-purple-500","bg-purple-600","bg-purple-700","bg-purple-800","bg-purple-900","bg-purple-950"],
  slate:   ["bg-slate-50","bg-slate-100","bg-slate-200","bg-slate-300","bg-slate-400","bg-slate-500","bg-slate-600","bg-slate-700","bg-slate-800","bg-slate-900","bg-slate-950"],
  gray:    ["bg-gray-50","bg-gray-100","bg-gray-200","bg-gray-300","bg-gray-400","bg-gray-500","bg-gray-600","bg-gray-700","bg-gray-800","bg-gray-900","bg-gray-950"],
  zinc:    ["bg-zinc-50","bg-zinc-100","bg-zinc-200","bg-zinc-300","bg-zinc-400","bg-zinc-500","bg-zinc-600","bg-zinc-700","bg-zinc-800","bg-zinc-900","bg-zinc-950"],
  neutral: ["bg-neutral-50","bg-neutral-100","bg-neutral-200","bg-neutral-300","bg-neutral-400","bg-neutral-500","bg-neutral-600","bg-neutral-700","bg-neutral-800","bg-neutral-900","bg-neutral-950"],
  stone:   ["bg-stone-50","bg-stone-100","bg-stone-200","bg-stone-300","bg-stone-400","bg-stone-500","bg-stone-600","bg-stone-700","bg-stone-800","bg-stone-900","bg-stone-950"],
} as const;

const COLOR_LIST = Object.keys(COLOR_SCALE_MAP) as (keyof typeof COLOR_SCALE_MAP)[];

export default function ColorsPage() {
  return (
    <>
    
    <LaSeparator className="bg-slate-300" />
      {/* ── Color Palette ───────────────────────────────────────────────── */}
      <LaSection title="Color Palette">
        <p className="text-sm text-slate-500">Approved Tailwind color families for `la` components and examples.</p>
        <div className="space-y-3 mt-2">
          <div className="flex items-center gap-3">
            <span className="w-28 shrink-0 text-xs text-slate-400" />
            <div className="flex items-center gap-2 text-xs text-slate-500">
              {[50,100,200,300,400,500,600,700,800,900,950].map((s) => (
                <span key={s} className="w-8 text-center">{s}</span>
              ))}
            </div>
          </div>

          {COLOR_LIST.map((color) => (
            <div key={color} className="flex items-center gap-3">
              <span className="w-28 shrink-0 text-sm text-slate-600">{color}</span>
              <div className="flex items-center gap-2">
                {COLOR_SCALE_MAP[color].map((bgClass) => (
                  <div key={bgClass} className={`${bgClass} w-8 h-8 rounded-md border border-slate-200`} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </LaSection>
    </>
  );
}
