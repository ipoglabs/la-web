import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── books_comics ──────────────────────────────────────────────────────────────
export const MEDIA_BOOKS: MockListing[] = [
  {
    id: "media-book-01", href: "/listings/media-book-01", advId: "21001",
    images: [{ src: img(1), alt: "Discworld book collection" }],
    priceLabel: "£95",
    title: "Terry Pratchett Discworld — Complete 41-Novel Set, Corgi Paperbacks",
    detailsLabel: "BOOKS • FICTION • TERRY PRATCHETT",
    locationLabel: "Chiswick, London",
    postedAt: daysAgo(2),
    description: "<p>Complete <strong>Terry Pratchett Discworld series — all 41 novels</strong> in matching Corgi paperback editions. Broadly good condition; a handful have cracked spines from love. Selling as a complete set only.</p>",
    keyDetails: [
      { key: "Series",    value: "Discworld — all 41"       },
      { key: "Author",    value: "Terry Pratchett"          },
      { key: "Format",    value: "Corgi paperback"          },
      { key: "Condition", value: "Good — loved"             },
    ],
    goodToKnow: [
      { key: "Set",        value: "All 41 together"         },
      { key: "Editions",   value: "Matching Corgi"          },
      { key: "Postage",    value: "Not available — too heavy" },
      { key: "Collection", value: "Chiswick W4"             },
    ],
    coordinates: { lat: 51.4927, lng: -0.2613 },
    seller: SELLERS.alice,
  },
  {
    id: "media-book-02", href: "/listings/media-book-02", advId: "21002",
    images: [{ src: img(2), alt: "GCSE and A-Level study books" }],
    priceLabel: "£35",
    title: "GCSE & A-Level Study Bundle — 18 Books: Maths, English, Sciences, History",
    detailsLabel: "BOOKS • EDUCATION • GCSE / A-LEVEL",
    locationLabel: "Wimbledon, London",
    postedAt: daysAgo(1),
    description: "<p>Bundle of <strong>18 CGP and Oxford Revision Guide books</strong> — GCSE Maths, English Language/Lit, Biology, Chemistry, Physics, and History, plus 3 A-Level Maths revision guides. Light pencil annotation only. Daughter just finished A-Levels.</p>",
    keyDetails: [
      { key: "Books",    value: "18 total"                  },
      { key: "Level",    value: "GCSE + A-Level"            },
      { key: "Subjects", value: "Maths, English, Sciences, History" },
      { key: "Condition", value: "Good — pencil only"       },
    ],
    goodToKnow: [
      { key: "Publishers", value: "CGP + Oxford"            },
      { key: "Marks",      value: "Pencil — erasable"       },
      { key: "Bundle",     value: "All 18 together"         },
      { key: "Postage",    value: "Available £6"            },
    ],
    coordinates: { lat: 51.4213, lng: -0.2062 },
    seller: SELLERS.alice,
  },
  {
    id: "media-book-03", href: "/listings/media-book-03", advId: "21003",
    images: [{ src: img(3), alt: "Star Wars Dark Horse comics" }],
    priceLabel: "£120",
    title: "Dark Horse Star Wars Comics — 60 Issues 1991–2004, Bagged & Boarded",
    detailsLabel: "COMICS • STAR WARS • DARK HORSE",
    locationLabel: "Brixton, London",
    postedAt: daysAgo(3),
    description: "<p>Collection of <strong>60 original Dark Horse Star Wars comics</strong> (1991–2004) — includes early Tales of the Jedi, X-Wing Rogue Squadron, and Crimson Empire. All bagged and boarded, stored flat. Mix of NM/VF copies. Full issue list available.</p>",
    keyDetails: [
      { key: "Publisher", value: "Dark Horse Comics"        },
      { key: "Issues",    value: "60 (1991–2004)"           },
      { key: "Includes",  value: "Tales of Jedi, X-Wing, Crimson Empire" },
      { key: "Condition", value: "NM/VF — bagged + boarded" },
    ],
    goodToKnow: [
      { key: "Storage",    value: "Bagged + boarded"        },
      { key: "Full list",  value: "Available on request"    },
      { key: "Collection", value: "Brixton SW2"             },
      { key: "Postage",    value: "Available £12 (tracked)" },
    ],
    coordinates: { lat: 51.4612, lng: -0.1149 },
    seller: SELLERS.collectorsDesk,
  },
];
