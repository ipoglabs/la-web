// ─── Types ────────────────────────────────────────────────────────────────────
// TODO [INTEGRATION]: Replace with the Row type returned by your API
export interface Row {
  key: string;
  value: string;
}

export interface ListingDetailsTableProps {
  title: string;
  rows: Row[];
  /** Pass the card surface class from the parent page so styling stays centralised */
  className?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────
/**
 * ListingDetailsTable — stacked label/value cells in a CSS grid with dotted borders.
 *
 * Layout:
 *   Mobile        — 2-column grid
 *   md+ (tablet+) — 3-column grid
 *
 * Each cell: label (small, muted) stacked above value (bold).
 * Dotted borders separate rows and columns — no background fills.
 */
export default function ListingDetailsTable({ title, rows, className }: ListingDetailsTableProps) {
  return (
    <section className={className}>
      <h2 className="text-lg font-semibold text-slate-900 mb-3">{title}</h2>

      <dl
        className={[
          "grid grid-cols-2 md:grid-cols-3",
          "border border-dashed border-slate-300 rounded-lg overflow-hidden",
          // All cells get right + bottom dashed borders
          "*:border-r *:border-b *:border-dashed *:border-slate-300",
          // Mobile (2-col): remove right border on every 2nd cell (last in row)
          "[&>*:nth-child(2n)]:border-r-0",
          // Tablet+ (3-col): restore 2nd-cell border, remove 3rd-cell border
          "md:[&>*:nth-child(2n)]:border-r md:[&>*:nth-child(3n)]:border-r-0",
          // overflow-hidden on wrapper clips last-row bottom borders cleanly
        ].join(" ")}
      >
        {rows.map((row) => (
          <div key={row.key} className="flex flex-col px-3 py-3 gap-0.5">
            <dt className="text-sm text-slate-500">{row.key}</dt>
            <dd className="text-sm font-semibold text-slate-800">{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
