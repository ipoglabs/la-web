import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── board_games_puzzles ────────────────────────────────────────────────────────
export const MEDIA_BOARDGAMES: MockListing[] = [
  {
    id: "media-game-01", href: "/listings/media-game-01", advId: "21031",
    images: [{ src: img(1), alt: "Catan board game" }],
    priceLabel: "£45",
    title: "Catan Base Game + 5–6 Player Extension + Seafarers Expansion",
    detailsLabel: "BOARD GAMES • CATAN • STRATEGY",
    locationLabel: "Chiswick, London",
    postedAt: daysAgo(1),
    description: "<p>Catan 5th edition base game plus <strong>5–6 Player Extension and Seafarers expansion</strong>. All cards sleeved, all pieces accounted for, insert trays immaculate. Selling because the group moved on to heavier strategy games.</p>",
    keyDetails: [
      { key: "Games",     value: "Catan + Seafarers + 5–6 ext." },
      { key: "Edition",   value: "5th edition base"           },
      { key: "Sleeved",   value: "Yes — all cards"            },
      { key: "Condition", value: "Excellent — complete"       },
    ],
    goodToKnow: [
      { key: "Players",    value: "3–6 with extension"        },
      { key: "All pieces", value: "Checked complete"          },
      { key: "Postage",    value: "Available £6"              },
      { key: "Collection", value: "Chiswick W4"               },
    ],
    coordinates: { lat: 51.4927, lng: -0.2613 },
    seller: SELLERS.alice,
  },
  {
    id: "media-game-02", href: "/listings/media-game-02", advId: "21032",
    images: [{ src: img(2), alt: "Gloomhaven Jaws of the Lion" }],
    priceLabel: "£35",
    title: "Gloomhaven: Jaws of the Lion + Forgotten Circles Expansion",
    detailsLabel: "BOARD GAMES • GLOOMHAVEN • DUNGEON CRAWLER",
    locationLabel: "Hackney, London",
    postedAt: daysAgo(2),
    description: "<p><strong>Gloomhaven: Jaws of the Lion</strong> (standalone, played to completion once — all stickers placed) plus the <strong>Forgotten Circles</strong> expansion (unpunched). Great entry to the Gloomhaven universe. All components present.</p>",
    keyDetails: [
      { key: "Games",     value: "JotL (standalone) + Forgotten Circles" },
      { key: "JotL",      value: "Completed — stickers placed" },
      { key: "FC",        value: "Unpunched"                  },
      { key: "Condition", value: "Very good"                  },
    ],
    goodToKnow: [
      { key: "Stickers",   value: "All placed in JotL"        },
      { key: "Envelopes",  value: "All opened in JotL"        },
      { key: "Postage",    value: "Available £5"              },
      { key: "Collection", value: "Hackney E8"                },
    ],
    coordinates: { lat: 51.5478, lng: -0.0759 },
    seller: SELLERS.dave,
  },
  {
    id: "media-game-03", href: "/listings/media-game-03", advId: "21033",
    images: [{ src: img(3), alt: "Wasgij puzzle collection" }],
    priceLabel: "£40",
    title: "Wasgij 1000-Piece Puzzles × 12 — All Sealed, Mixed Editions",
    detailsLabel: "PUZZLES • WASGIJ • 1000-PIECE",
    locationLabel: "Kingston, London",
    postedAt: daysAgo(4),
    description: "<p>Collection of <strong>12 sealed Wasgij 1000-piece jigsaw puzzles</strong> — various editions including Original, Mystery, and Destiny. All factory sealed. Job lot — selling as a group only. Great gift or lockdown entertainment.</p>",
    keyDetails: [
      { key: "Puzzles",   value: "12 × 1000-piece"           },
      { key: "Brand",     value: "Wasgij"                    },
      { key: "Types",     value: "Original, Mystery, Destiny" },
      { key: "Condition", value: "All factory sealed"        },
    ],
    goodToKnow: [
      { key: "Sealed",     value: "Factory sealed — all 12"  },
      { key: "Bundle",     value: "All 12 together"          },
      { key: "Postage",    value: "Not available — heavy"    },
      { key: "Collection", value: "Kingston KT1"             },
    ],
    coordinates: { lat: 51.4085, lng: -0.3064 },
    seller: SELLERS.quickSell,
  },
];
