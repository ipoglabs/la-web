/**
 * StatusDots: tiny cosmetic flourish next to the "Ad Status Guide" title.
 * Purely decorative (aria-hidden), page-local to /myads only, this is not
 * a design system primitive, just a little colour accent, deliberately
 * plain inline markup (no la/ component) since it's a one-off look-and-feel
 * touch, not a reusable pattern.
 */
export function StatusDots() {
  const colors = ["bg-green-500", "bg-slate-800", "bg-blue-500", "bg-red-500"];

  return (
    <span aria-hidden="true" className="inline-flex items-center gap-1">
      {colors.map((color, i) => (
        <span key={i} className={`size-2.5 rounded-full ${color}`} />
      ))}
    </span>
  );
}
