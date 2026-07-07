import type { TimelineEvent } from "@/components/timeline/Timeline";

export const TIMELINE_EVENTS: TimelineEvent[] = [
  // 2026
  {
    id: "21",
    year: 2026,
    date: "May 2026",
    type: "release",
    tag: "v6.0",
    title: "Timeline Component",
    description:
      "A living record of everything shipped — lazy-loading right-sheet with 5 years of history.",
    points: [
      "Right-side sheet built on Radix Dialog with spring animation",
      "IntersectionObserver lazy-loads 6 events per batch",
      "Stats strip, colour-coded legend, year pill dividers",
    ],
  },
  {
    id: "20",
    year: 2026,
    date: "Jan 2026",
    type: "feature",
    title: "Phone Number Input",
    description:
      "Full-feature international phone input: flag picker, dial codes, country filter.",
    points: [
      "Flag SVGs + searchable country picker overlay",
      "Controlled & uncontrolled modes, onlyCountries filter",
      "Formats number live as user types",
    ],
  },

  // 2025
  {
    id: "19",
    year: 2025,
    date: "Nov 2025",
    type: "feature",
    title: "Private Profile Settings",
    description:
      "Authenticated settings page: public info, contact, location, account controls, danger zone.",
    points: [
      "iOS-settings layout: floating section labels, stacked field rows",
      "Contact rows with individual Edit buttons",
      "Danger zone wired to delete-account eligibility flow",
    ],
  },
  {
    id: "18",
    year: 2025,
    date: "Jul 2025",
    type: "release",
    tag: "v5.0",
    title: "Performance Release",
    description:
      "Full audit and optimisation pass. Core Web Vitals all green. Bundle size −40%.",
    points: [
      "LCP under 1.2s on mobile 4G",
      "Removed 3 unused dependencies",
      "Image loading lazy-deferred across all listing cards",
    ],
  },
  {
    id: "17",
    year: 2025,
    date: "Mar 2025",
    type: "feature",
    title: "Public Profile",
    description:
      "Full public profile: avatar, stats, listings/reviews/contact tabs, revealable contact.",
    points: [
      "Listings tab with active/closed filter and pagination",
      "Star rating breakdown with per-review voting",
      "Contact reveal with masked → unmasked toggle",
    ],
  },

  // 2024
  {
    id: "16",
    year: 2024,
    date: "Dec 2024",
    type: "release",
    tag: "v4.0",
    title: "Login & Auth Overhaul",
    description:
      "Unified email/phone login, radio-toggle UI, live validation, password reveal, toast feedback.",
    points: [
      "Single card supports email and phone via radio toggle",
      "Live field validation with inline error messages",
      "Toast notification on successful login",
    ],
  },
  {
    id: "15",
    year: 2024,
    date: "Sep 2024",
    type: "milestone",
    title: "50K Users",
    description: "Fifty thousand users. The platform had earned its place.",
    points: [
      "25% month-on-month growth over prior quarter",
      "NPS score hit 68 — highest ever recorded",
    ],
  },
  {
    id: "14",
    year: 2024,
    date: "Jun 2024",
    type: "feature",
    title: "Chat System",
    description:
      "Mobile-first classifieds chat: threads, block/delete, ad context, input sanitisation.",
    points: [
      "Conversation list with unread dots, time-range tabs",
      "Block & delete with confirm dialogs",
      "Input sanitised against HTML injection and SQL patterns",
    ],
  },
  {
    id: "13",
    year: 2024,
    date: "Feb 2024",
    type: "feature",
    title: "Delete Account Journey",
    description:
      "3-stage guided flow: eligibility check → feedback reasons → review & permanent deletion.",
    points: [
      "Eligibility API gate before entering the flow",
      "Multi-select reason chips + optional free-text",
      "Acknowledgement checkbox before final irreversible action",
    ],
  },

  // 2023
  {
    id: "12",
    year: 2023,
    date: "Oct 2023",
    type: "release",
    tag: "v3.0",
    title: "Component Library",
    description:
      "Toggle groups, responsive dialogs, collapsible panels shipped as reusable primitives.",
    points: [
      "Compound toggle: single/multi-select, mandatory, disabled items",
      "Responsive dialog: bottom sheet on mobile, centered on desktop",
      "Scroll-to-accept pattern for terms content",
    ],
  },
  {
    id: "11",
    year: 2023,
    date: "Jun 2023",
    type: "launch",
    title: "Design System",
    description:
      "Foundational design system launched: tokens, atoms, type scale, component library.",
    points: [
      "Inter Variable + Inter Display self-hosted fonts",
      "Full token set: color, radius, shadow, spacing",
      "Live type scale reference page",
    ],
  },
  {
    id: "10",
    year: 2023,
    date: "Apr 2023",
    type: "milestone",
    title: "10K Events Processed",
    description:
      "Platform hit 10,000 processed events — listings, matches, and verifications.",
  },
  {
    id: "9",
    year: 2023,
    date: "Jan 2023",
    type: "feature",
    title: "Rich Text Editor",
    description:
      "Custom contentEditable composer: bold, italic, lists, blockquote, live preview pane.",
    points: [
      "Toolbar: bold, italic, underline, strikethrough, H2, blockquote, lists",
      "Active state via queryCommandState for inline formats",
      "Side-by-side live preview with shared prose styles",
    ],
  },

  // 2022
  {
    id: "8",
    year: 2022,
    date: "Nov 2022",
    type: "feature",
    title: "Email OTP Verification",
    description:
      "Email-based OTP flow added alongside phone. maskMode prop for privacy-first display.",
    points: [
      "Three mask modes: full, local-first, partial",
      "Mirrors phone OTP patterns — same hooks and widgets",
      "Resend timer with 30s cooldown",
    ],
  },
  {
    id: "7",
    year: 2022,
    date: "Aug 2022",
    type: "release",
    tag: "v2.0",
    title: "Mobile Redesign",
    description:
      "Mobile-first overhaul — new navigation patterns, card layouts, full responsive system.",
    points: [
      "Bottom-sheet navigation on mobile",
      "Full Tailwind v4 migration",
      "shadcn CSS variable theming system",
    ],
  },
  {
    id: "6",
    year: 2022,
    date: "May 2022",
    type: "milestone",
    title: "1,000 Users",
    description: "One thousand users onboarded. Growth organic, entirely word of mouth.",
  },
  {
    id: "5",
    year: 2022,
    date: "Feb 2022",
    type: "feature",
    title: "Country Detection",
    description:
      "IP-based detection with middleware gate, manual fallback overlay, and 30-day cookie.",
    points: [
      "ipinfo.io fetch with 5s AbortController timeout",
      "Edge middleware sets countryPending cookie",
      "Manual overlay as fallback — no route accessible until resolved",
    ],
  },

  // 2021
  {
    id: "4",
    year: 2021,
    date: "Sep 2021",
    type: "release",
    tag: "v1.0",
    title: "Public Launch",
    description:
      "Opened to the public. Core property listing flow fully operational.",
    points: [
      "Phone OTP verification on registration",
      "Property listing create, edit, close",
      "Basic search and category browse",
    ],
  },
  {
    id: "3",
    year: 2021,
    date: "Jun 2021",
    type: "milestone",
    title: "First 100 Users",
    description:
      "Crossed 100 active users. Early validation that the product had legs.",
  },
  {
    id: "2",
    year: 2021,
    date: "Mar 2021",
    type: "release",
    tag: "v0.1",
    title: "Beta Launch",
    description:
      "Private beta opens to first testers. Phone OTP verification module shipped.",
    points: [
      "6-digit OTP with auto-submit on last digit",
      "Up to 3 verified numbers per user",
      "Country dial code overlay with native select",
    ],
  },
  {
    id: "1",
    year: 2021,
    date: "Jan 2021",
    type: "launch",
    title: "Platform Founded",
    description:
      "The first line of code. A blank canvas and a bold idea.",
  },
];
