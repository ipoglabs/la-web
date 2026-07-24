import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────
// TODO [INTEGRATION]: Replace with the FactItem type returned by your API
export interface FactItem {
  key: string;
  value: string;
}

export interface ListingUserFactsProps {
  title: string;
  items: FactItem[];
  className?: string;
}

// ─── Single fact row — key · · · value ────────────────────────────────────────
function FactRow({ item }: { item: FactItem }) {
  return (
    <div className="flex items-center gap-2 py-2.5 border-b border-slate-100 last:border-0">
      <span className="text-sm text-slate-700 font-medium shrink-0">{item.key}</span>
      <span className="flex-1 border-b-2 border-dashed border-slate-300" aria-hidden />
      <span className="text-sm font-semibold text-slate-800 shrink-0">{item.value}</span>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
/**
 * ListingUserFacts — renders a titled grid of key/value fact rows.
 *
 * Layout:
 *   Mobile        — single column
 *   md+ (tablet+) — 2-column grid with a vertical divider between columns
 */
export default function ListingUserFacts({ title, items, className }: ListingUserFactsProps) {
  const mid = Math.ceil(items.length / 2);
  const leftItems = items.slice(0, mid);
  const rightItems = items.slice(mid);

  return (
    <section className={className}>
      <h2 className="text-lg font-semibold text-slate-900 mb-3">{title}</h2>

      {/* 1 col on mobile · 3-track grid (left | 1px divider | right) on md+ */}
      <div className={cn("grid grid-cols-1", rightItems.length > 0 && "md:grid-cols-[1fr_1px_1fr]")}>

        {/* Left column */}
        <div className="md:pr-5">
          {leftItems.map((item) => (
            <FactRow key={item.key} item={item} />
          ))}
        </div>

        {/* Vertical divider — md+ only */}
        {rightItems.length > 0 && (
          <div className="hidden md:block bg-slate-200" aria-hidden />
        )}

        {/* Right column */}
        {rightItems.length > 0 && (
          <div className="md:pl-5">
            {rightItems.map((item) => (
              <FactRow key={item.key} item={item} />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
