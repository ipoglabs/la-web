// ── Favourite Update Template ─────────────────────────────────────────────────
// Sent when a listing in the user's favourites changes:
// price_drop, sold_removed, relisted.
// Plain text fallback: favouriteUpdateText()

import { baseEmail, s, esc, APP_URL } from "../_base";

type FavouriteUpdateData = {
  firstName: string;
  listingTitle: string;
  listingUrl: string;
  event: "price_drop" | "sold_removed" | "relisted";
  oldPrice?: string;
  newPrice?: string;
};

const CONFIG = {
  price_drop: {
    icon: "🏷️",
    heading: "Price drop on a listing you saved!",
    intro: (d: FavouriteUpdateData) =>
      `Good news — the seller of <strong style="${s({ color: "#0f172a" })}">${esc(d.listingTitle)}</strong> has dropped the price.`,
    noteBg: "#f0fdf4", noteBorder: "#bbf7d0", noteColor: "#15803d",
    note: "Listings with price drops often sell fast. Don't miss your chance!",
    ctaLabel: "View Listing", ctaBg: "#16a34a",
    preview: (d: FavouriteUpdateData) => `Price drop on "${d.listingTitle}" — you saved it!`,
  },
  sold_removed: {
    icon: "😔",
    heading: "A listing you saved is no longer available",
    intro: (d: FavouriteUpdateData) =>
      `Unfortunately, <strong style="${s({ color: "#0f172a" })}">${esc(d.listingTitle)}</strong> has been sold or removed by the seller.`,
    noteBg: "#f8fafc", noteBorder: "#e2e8f0", noteColor: "#475569",
    note: "Looking for something similar? Browse current listings to find your next favourite.",
    ctaLabel: "Browse Similar Listings", ctaBg: "#475569",
    preview: (d: FavouriteUpdateData) => `"${d.listingTitle}" is no longer available.`,
  },
  relisted: {
    icon: "🎉",
    heading: "A listing you liked is back!",
    intro: (d: FavouriteUpdateData) =>
      `Great news — <strong style="${s({ color: "#0f172a" })}">${esc(d.listingTitle)}</strong> has been relisted and is available again.`,
    noteBg: "#eff6ff", noteBorder: "#bfdbfe", noteColor: "#1e40af",
    note: "It's back — grab it before someone else does!",
    ctaLabel: "View Listing", ctaBg: "#2563eb",
    preview: (d: FavouriteUpdateData) => `"${d.listingTitle}" is back — you saved it!`,
  },
} as const;

export function FavouriteUpdateEmail(data: FavouriteUpdateData): string {
  const cfg = CONFIG[data.event];
  const listingUrl = data.listingUrl.startsWith("http") ? data.listingUrl : `${APP_URL}${data.listingUrl}`;
  const priceBlock =
    data.event === "price_drop" && data.oldPrice && data.newPrice
      ? `<div style="${s({ display: "flex", gap: 16, marginBottom: 20 })}">
          <div style="${s({ textAlign: "center", flex: 1, backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: "12px 16px" })}">
            <p style="${s({ fontSize: 12, fontWeight: 600, color: "#94a3b8", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.05em" })}">Was</p>
            <p style="${s({ fontSize: 18, fontWeight: 700, color: "#94a3b8", textDecoration: "line-through", margin: 0 })}">${esc(data.oldPrice)}</p>
          </div>
          <div style="${s({ display: "flex", alignItems: "center", fontSize: 20 })}">→</div>
          <div style="${s({ textAlign: "center", flex: 1, backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: "12px 16px" })}">
            <p style="${s({ fontSize: 12, fontWeight: 600, color: "#15803d", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.05em" })}">Now</p>
            <p style="${s({ fontSize: 18, fontWeight: 700, color: "#15803d", margin: 0 })}">${esc(data.newPrice)}</p>
          </div>
        </div>`
      : "";

  const content = `
<div style="${s({ marginBottom: 16 })}"><span style="${s({ fontSize: 32 })}">${cfg.icon}</span></div>
<h1 style="${s({ fontSize: 22, fontWeight: 700, color: "#0f172a", margin: "0 0 12px", lineHeight: 1.3 })}">Hi ${esc(data.firstName)}, ${cfg.heading}</h1>
<p style="${s({ fontSize: 15, color: "#475569", margin: "0 0 20px", lineHeight: 1.6 })}">${cfg.intro(data)}</p>
${priceBlock}
<div style="${s({ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: "16px 20px", marginBottom: 20 })}">
  <p style="${s({ fontSize: 12, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 4px" })}">Saved listing</p>
  <p style="${s({ fontSize: 15, fontWeight: 600, color: "#0f172a", margin: 0 })}">${esc(data.listingTitle)}</p>
</div>
<div style="${s({ backgroundColor: cfg.noteBg, border: `1px solid ${cfg.noteBorder}`, borderRadius: 10, padding: "16px 20px", marginBottom: 24 })}">
  <p style="${s({ fontSize: 14, color: cfg.noteColor, margin: 0, lineHeight: 1.5 })}">${cfg.note}</p>
</div>
<div style="${s({ textAlign: "center", marginBottom: 24 })}">
  <a href="${esc(listingUrl)}" style="${s({ display: "inline-block", backgroundColor: cfg.ctaBg, color: "#ffffff", fontSize: 15, fontWeight: 600, textDecoration: "none", padding: "12px 28px", borderRadius: 8 })}">${cfg.ctaLabel}</a>
</div>
<p style="${s({ fontSize: 13, color: "#94a3b8", margin: 0, lineHeight: 1.5 })}">Manage your favourites in <a href="${APP_URL}/favourites" style="${s({ color: "#2563eb", textDecoration: "underline" })}">My Favourites</a>.</p>
`;
  return baseEmail(content, cfg.preview(data));
}

export function favouriteUpdateText(data: FavouriteUpdateData): string {
  const listingUrl = data.listingUrl.startsWith("http") ? data.listingUrl : `${APP_URL}${data.listingUrl}`;
  const cfg = CONFIG[data.event];
  const lines = [`Hi ${data.firstName}, ${cfg.heading}`, "", `Listing: ${data.listingTitle}`];
  if (data.event === "price_drop" && data.oldPrice && data.newPrice) {
    lines.push(`Price: ${data.oldPrice} → ${data.newPrice}`);
  }
  lines.push("", cfg.note);
  if (data.event !== "sold_removed") lines.push("", `View listing: ${listingUrl}`);
  else lines.push("", `Browse similar: ${APP_URL}/listings`);
  return lines.join("\n");
}
