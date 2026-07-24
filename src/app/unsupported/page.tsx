/**
 * /unsupported — Browser not supported page
 *
 * ⚠️  IMPORTANT: This page must NEVER use Tailwind CSS classes.
 *     If the browser can't render Tailwind v4 CSS, this page will also break.
 *     All styling is done with inline `style` props only — intentionally.
 *     System fonts only — no custom font loading.
 */

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Browser Not Supported",
  robots: "noindex, nofollow",
};

/* ─── Browser data ─────────────────────────────────────────────────────────── */

const BROWSERS = [
  {
    name: "Google Chrome",
    version: "105+",
    href: "https://www.google.com/chrome/",
    recommended: true,
    icon: (
      <svg viewBox="0 0 48 48" width="36" height="36" aria-hidden="true">
        <circle cx="24" cy="24" r="24" fill="#fff" />
        <path
          fill="#4285F4"
          d="M24 12a12 12 0 0 1 10.39 6H24a6 6 0 1 0 0 12 6 6 0 0 0 5.46-3.5l9.21 5.32A22 22 0 1 1 24 2a22 22 0 0 1 19.07 11H24z"
        />
        <path fill="#34A853" d="M14.54 30l-9.21 5.32A22 22 0 0 0 24 46v-10a6 6 0 0 1-5.19-3z" />
        <path fill="#FBBC05" d="M5.33 35.32A22 22 0 0 1 5 24a22 22 0 0 1 .33-3.82L14.54 26a6 6 0 0 0 0 4z" />
        <path fill="#EA4335" d="M24 18h9.39A12 12 0 0 0 12 24a12 12 0 0 0 2.54 7.5L5.33 26.18A22 22 0 0 1 24 2z" />
        <circle cx="24" cy="24" r="6" fill="#fff" />
        <circle cx="24" cy="24" r="4" fill="#4285F4" />
      </svg>
    ),
  },
  {
    name: "Microsoft Edge",
    version: "105+",
    href: "https://www.microsoft.com/edge",
    recommended: false,
    icon: (
      <svg viewBox="0 0 48 48" width="36" height="36" aria-hidden="true">
        <defs>
          <linearGradient id="edge-g1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0078D4" />
            <stop offset="100%" stopColor="#00B0F0" />
          </linearGradient>
          <linearGradient id="edge-g2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1A9E3F" />
            <stop offset="100%" stopColor="#36B07E" />
          </linearGradient>
        </defs>
        <ellipse cx="24" cy="28" rx="16" ry="12" fill="url(#edge-g2)" />
        <path
          fill="url(#edge-g1)"
          d="M40 24C40 15.16 32.84 8 24 8S8 15.16 8 24c0 4.18 1.6 7.98 4.22 10.84C14.64 30.34 19.06 28 24 28c3.46 0 6.66 1.06 9.3 2.86A16 16 0 0 0 40 24z"
        />
        <ellipse cx="24" cy="34" rx="10" ry="6" fill="#0050A0" opacity="0.3" />
        <ellipse cx="24" cy="34" rx="10" ry="6" fill="url(#edge-g2)" />
      </svg>
    ),
  },
  {
    name: "Mozilla Firefox",
    version: "110+",
    href: "https://www.mozilla.org/firefox/",
    recommended: false,
    icon: (
      <svg viewBox="0 0 48 48" width="36" height="36" aria-hidden="true">
        <defs>
          <radialGradient id="ff-g1" cx="50%" cy="30%" r="60%">
            <stop offset="0%" stopColor="#FFD700" />
            <stop offset="60%" stopColor="#FF8C00" />
            <stop offset="100%" stopColor="#E3272E" />
          </radialGradient>
          <radialGradient id="ff-g2" cx="40%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#6B5DD3" />
            <stop offset="100%" stopColor="#FF4545" />
          </radialGradient>
        </defs>
        <circle cx="24" cy="24" r="20" fill="url(#ff-g2)" />
        <path
          fill="url(#ff-g1)"
          d="M40 20c-1-5-4-9-8-12-1 2-1 5 0 7-3-2-6-5-6-9-4 2-7 6-8 11-1-1-1-3-1-5-3 3-4 8-3 12a14 14 0 0 0 26-4z"
        />
      </svg>
    ),
  },
  {
    name: "Apple Safari",
    version: "16.4+",
    href: "https://www.apple.com/safari/",
    recommended: false,
    icon: (
      <svg viewBox="0 0 48 48" width="36" height="36" aria-hidden="true">
        <defs>
          <linearGradient id="sf-g" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1A8DFF" />
            <stop offset="100%" stopColor="#00C5FF" />
          </linearGradient>
        </defs>
        <circle cx="24" cy="24" r="20" fill="url(#sf-g)" />
        <circle cx="24" cy="24" r="18" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        <polygon points="24,10 28,24 24,22 20,24" fill="white" />
        <polygon points="24,38 20,24 24,26 28,24" fill="rgba(255,255,255,0.5)" />
        <circle cx="24" cy="24" r="2" fill="white" />
      </svg>
    ),
  },
];

/* ─── Styles ───────────────────────────────────────────────────────────────── */

const s = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    padding: "32px 20px",
    boxSizing: "border-box" as const,
    color: "#0f172a",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.05)",
    padding: "48px 40px 40px",
    maxWidth: "640px",
    width: "100%",
    textAlign: "center" as const,
  },
  iconWrap: {
    width: "72px",
    height: "72px",
    backgroundColor: "#fef2f2",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 28px",
    border: "1px solid #fecaca",
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    backgroundColor: "#fef2f2",
    color: "#dc2626",
    fontSize: "12px",
    fontWeight: 600,
    letterSpacing: "0.06em",
    textTransform: "uppercase" as const,
    padding: "4px 12px",
    borderRadius: "100px",
    marginBottom: "20px",
    border: "1px solid #fecaca",
  },
  heading: {
    fontSize: "26px",
    fontWeight: 700,
    color: "#0f172a",
    margin: "0 0 12px",
    lineHeight: 1.25,
    letterSpacing: "-0.02em",
  },
  subheading: {
    fontSize: "15px",
    color: "#64748b",
    margin: "0 0 36px",
    lineHeight: 1.7,
    maxWidth: "480px",
    marginLeft: "auto",
    marginRight: "auto",
  },
  divider: {
    border: "none",
    borderTop: "1px solid #f1f5f9",
    margin: "0 0 28px",
  },
  sectionLabel: {
    fontSize: "11px",
    fontWeight: 600,
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
    color: "#94a3b8",
    marginBottom: "20px",
  },
  browserGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "12px",
    marginBottom: "36px",
  },
  browserCard: {
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    padding: "16px",
    textDecoration: "none",
    color: "inherit",
    display: "flex",
    alignItems: "center",
    gap: "14px",
    transition: "border-color 0.15s, box-shadow 0.15s, background 0.15s",
    backgroundColor: "#ffffff",
    cursor: "pointer",
  },
  browserCardRecommended: {
    border: "1px solid #bfdbfe",
    backgroundColor: "#eff6ff",
  },
  browserInfo: {
    textAlign: "left" as const,
    flex: 1,
  },
  browserName: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#1e293b",
    margin: "0 0 2px",
  },
  browserVersion: {
    fontSize: "12px",
    color: "#94a3b8",
    margin: 0,
  },
  recommendedBadge: {
    fontSize: "10px",
    fontWeight: 600,
    color: "#2563eb",
    letterSpacing: "0.04em",
    textTransform: "uppercase" as const,
    backgroundColor: "#dbeafe",
    padding: "2px 8px",
    borderRadius: "100px",
    whiteSpace: "nowrap" as const,
  },
  arrowIcon: {
    color: "#cbd5e1",
    flexShrink: 0,
    fontSize: "16px",
  },
  infoBox: {
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    padding: "16px 20px",
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    textAlign: "left" as const,
    marginBottom: "32px",
  },
  infoIcon: {
    width: "18px",
    height: "18px",
    color: "#64748b",
    flexShrink: 0,
    marginTop: "1px",
  },
  infoText: {
    fontSize: "13px",
    color: "#64748b",
    margin: 0,
    lineHeight: 1.6,
  },
  footer: {
    borderTop: "1px solid #f1f5f9",
    paddingTop: "24px",
    fontSize: "13px",
    color: "#94a3b8",
  },
  footerLink: {
    color: "#64748b",
    textDecoration: "underline",
    cursor: "pointer",
  },
} as const;

/* ─── Component ────────────────────────────────────────────────────────────── */

export default function UnsupportedBrowserPage() {
  return (
    <div style={s.page}>
      {/*
        Inject hover styles via a <style> tag — the ONLY way to do hover on a
        Server Component without JS event handlers. CSS :hover works in IE8+
        so this is safe for every browser that might land on this page.
      */}
      <style>{`
        .ub-browser-card:hover {
          box-shadow: 0 4px 12px rgba(0,0,0,0.10);
          border-color: #cbd5e1;
        }
        .ub-browser-card[data-recommended="true"]:hover {
          box-shadow: 0 4px 12px rgba(0,0,0,0.10);
          border-color: #93c5fd;
        }
        .ub-footer-link:hover {
          color: #1e293b;
        }
      `}</style>
      <main style={s.card}>

        {/* Icon */}
        <div style={s.iconWrap}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="1.5" />
            <path d="M2 12h20" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
            <path
              d="M12 2C9.5 5 8 8.5 8 12s1.5 7 4 10M12 2c2.5 3 4 6.5 4 10s-1.5 7-4 10"
              stroke="#ef4444"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Badge */}
        <div style={s.badge}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true">
            <circle cx="5" cy="5" r="5" />
          </svg>
          Browser not supported
        </div>

        {/* Heading */}
        <h1 style={s.heading}>
          Your browser isn&apos;t compatible
        </h1>
        <p style={s.subheading}>
          This application uses modern web standards that your current browser
          doesn&apos;t support. To get the best experience, please upgrade to one
          of the browsers below.
        </p>

        <hr style={s.divider} />

        {/* Why we require this */}
        <div style={s.infoBox}>
          <svg style={s.infoIcon} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <p style={s.infoText}>
            We require <strong>Chrome 105+</strong>, <strong>Firefox 110+</strong>,{" "}
            <strong>Edge 105+</strong> or <strong>Safari 16.4+</strong> for proper rendering
            of our UI, security features, and layout engine. Older browsers cannot display
            the interface correctly.
          </p>
        </div>

        {/* Browser download cards */}
        <p style={s.sectionLabel}>Download a supported browser</p>

        <div style={s.browserGrid}>
          {BROWSERS.map((b) => (
            <a
              key={b.name}
              href={b.href}
              target="_blank"
              rel="noopener noreferrer"
              className="ub-browser-card"
              data-recommended={b.recommended ? "true" : "false"}
              style={{
                ...s.browserCard,
                ...(b.recommended ? s.browserCardRecommended : {}),
              }}
            >
              <div style={{ flexShrink: 0 }}>{b.icon}</div>
              <div style={s.browserInfo}>
                <p style={s.browserName}>{b.name}</p>
                <p style={s.browserVersion}>Version {b.version}</p>
              </div>
              {b.recommended && (
                <span style={s.recommendedBadge}>Recommended</span>
              )}
              {!b.recommended && (
                <svg
                  style={s.arrowIcon}
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M6 3l5 5-5 5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </a>
          ))}
        </div>

        {/* Footer */}
        <div style={s.footer}>
          Already updated?{" "}
          <Link href="/" style={s.footerLink}>
            Try again
          </Link>{" "}
          &nbsp;·&nbsp; Need help?{" "}
          <a href="mailto:support@example.com" style={s.footerLink}>
            Contact support
          </a>
        </div>
      </main>

      {/* Attribution */}
      <p
        style={{
          marginTop: "24px",
          fontSize: "12px",
          color: "#cbd5e1",
        }}
      >
        &copy; {new Date().getFullYear()} ListingApp. All rights reserved.
      </p>
    </div>
  );
}
