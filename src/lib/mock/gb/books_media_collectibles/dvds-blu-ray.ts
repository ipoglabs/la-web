import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── dvds_blu_ray ───────────────────────────────────────────────────────────────
export const MEDIA_DVDS: MockListing[] = [
  {
    id: "media-dvd-01", href: "/listings/media-dvd-01", advId: "21021",
    images: [{ src: img(7), alt: "Marvel MCU Blu-ray box set" }],
    priceLabel: "£45",
    title: "Marvel Cinematic Universe Phases 1–3 Complete Blu-ray Box Set — 23 Films",
    detailsLabel: "BLU-RAY • MARVEL • COMPLETE COLLECTION",
    locationLabel: "Hackney, London",
    postedAt: daysAgo(1),
    description: "<p>Complete <strong>Marvel Cinematic Universe Phases 1–3 Blu-ray box set</strong> — all 23 films from Iron Man (2008) to Avengers: Endgame. MCU 10th Anniversary collection. All discs play perfectly; outer box has light shelf wear only.</p>",
    keyDetails: [
      { key: "Films",     value: "23 — Phases 1–3"          },
      { key: "Format",    value: "Blu-ray"                  },
      { key: "Box",       value: "MCU 10th Anniversary"     },
      { key: "Condition", value: "Excellent — all play"     },
    ],
    goodToKnow: [
      { key: "Discs",      value: "All present + play"      },
      { key: "Box wear",   value: "Light shelf wear only"   },
      { key: "Postage",    value: "Available £5"            },
      { key: "Collection", value: "Hackney E8"              },
    ],
    coordinates: { lat: 51.5478, lng: -0.0759 },
    seller: SELLERS.quickSell,
  },
  {
    id: "media-dvd-02", href: "/listings/media-dvd-02", advId: "21022",
    images: [{ src: img(8), alt: "Breaking Bad Blu-ray box sets" }],
    priceLabel: "£30",
    title: "Breaking Bad + Better Call Saul Complete Series — Blu-ray Box Sets",
    detailsLabel: "BLU-RAY • DRAMA • BREAKING BAD • BCS",
    locationLabel: "Wimbledon, London",
    postedAt: daysAgo(2),
    description: "<p>Complete <strong>Breaking Bad (5 seasons) + Better Call Saul (6 seasons) Blu-ray box sets</strong>. Sony Pictures UK official editions. All 11 season boxes, all discs immaculate. Selling as a pair only — the greatest TV saga ever made.</p>",
    keyDetails: [
      { key: "Series",    value: "Breaking Bad + BCS"        },
      { key: "Format",    value: "Blu-ray"                  },
      { key: "Seasons",   value: "BB × 5 + BCS × 6"         },
      { key: "Condition", value: "Immaculate discs"         },
    ],
    goodToKnow: [
      { key: "Editions",   value: "Sony UK official"        },
      { key: "Bundle",     value: "Both series together"    },
      { key: "Postage",    value: "Available £5"            },
      { key: "Collection", value: "Wimbledon SW19"          },
    ],
    coordinates: { lat: 51.4213, lng: -0.2062 },
    seller: SELLERS.alice,
  },
  {
    id: "media-dvd-03", href: "/listings/media-dvd-03", advId: "21023",
    images: [{ src: img(9), alt: "Classic film DVD job lot" }],
    priceLabel: "£60",
    title: "Classic Film DVD Collection — 150 Titles Mixed Genres, All Play",
    detailsLabel: "DVD • JOB LOT • MIXED GENRES",
    locationLabel: "Stratford, London",
    postedAt: daysAgo(3),
    description: "<p>Job lot of <strong>150 DVD titles</strong> — classics, world cinema, comedy, and thrillers. Includes Criterion Collection and BFI releases alongside mainstream titles. Every disc tested and plays. Full list available. Ideal for market traders or film buffs.</p>",
    keyDetails: [
      { key: "Quantity",  value: "150 DVDs"                 },
      { key: "Genres",    value: "Mixed — all tested"       },
      { key: "Includes",  value: "Criterion, BFI + studio"  },
      { key: "Condition", value: "All play"                 },
    ],
    goodToKnow: [
      { key: "Full list",  value: "Available on request"    },
      { key: "Tested",     value: "Yes — every disc"        },
      { key: "Collection", value: "Stratford E15"           },
      { key: "Delivery",   value: "Not available"           },
    ],
    coordinates: { lat: 51.5428, lng: -0.0019 },
    seller: SELLERS.marketStall,
  },
];
