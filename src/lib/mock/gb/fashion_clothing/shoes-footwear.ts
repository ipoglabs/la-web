import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── shoes_footwear ─────────────────────────────────────────────────────────────
export const FASHION_SHOES: MockListing[] = [
  {
    id: "fash-shoe-01", href: "/listings/fash-shoe-01", advId: "19031",
    images: [{ src: img(6), alt: "Jordan 1 Retro" }],
    priceLabel: "£220",
    title: "Air Jordan 1 Retro High OG 'Bred Toe' — UK9, VNDS, Box",
    detailsLabel: "SHOES & FOOTWEAR • VNDS • JORDANS",
    locationLabel: "Hackney, London",
    postedAt: hrsAgo(1),
    description: "<p><strong>Nike Air Jordan 1 Retro High OG 'Bred Toe'</strong> in UK9/US10/EU44. VNDS (very near dead stock) — worn twice in clean indoor settings. Original box, extra red laces, and bag. No creasing, sole clean.</p>",
    keyDetails: [
      { key: "Brand",     value: "Nike Air Jordan 1 High OG" },
      { key: "Colourway", value: "Bred Toe"                  },
      { key: "Size",      value: "UK 9 / EU 44"              },
      { key: "Condition", value: "VNDS — worn twice"         },
    ],
    goodToKnow: [
      { key: "Box",       value: "Original box included"     },
      { key: "Laces",     value: "Extra red laces"           },
      { key: "Sole",      value: "Clean — no yellowing"      },
      { key: "Collection", value: "Hackney E8"               },
    ],
    coordinates: { lat: 51.5465, lng: -0.0554 },
    seller: SELLERS.fashionPrivate,
  },
  {
    id: "fash-shoe-02", href: "/listings/fash-shoe-02", advId: "19032",
    images: [{ src: img(7), alt: "Manolo Blahnik heels" }],
    priceLabel: "£280",
    title: "Manolo Blahnik BB Pumps — Nude Satin, Size 38.5, Excellent",
    detailsLabel: "SHOES & FOOTWEAR • EXCELLENT • MANOLO BLAHNIK",
    locationLabel: "Mayfair, London",
    postedAt: daysAgo(1),
    description: "<p>Classic <strong>Manolo Blahnik BB 105mm slingback pumps</strong> in nude satin, size EU 38.5 / UK 5.5. Worn to 2 events — professionally cleaned. Original box and dust bags. A timeless investment piece.</p>",
    keyDetails: [
      { key: "Brand",     value: "Manolo Blahnik BB 105mm"  },
      { key: "Style",     value: "Slingback pump"           },
      { key: "Size",      value: "EU 38.5 / UK 5.5"         },
      { key: "Condition", value: "Excellent — 2 wears"      },
    ],
    goodToKnow: [
      { key: "Cleaned",    value: "Professionally cleaned"  },
      { key: "Box",        value: "Original + dust bags"    },
      { key: "Collection", value: "Mayfair W1"              },
      { key: "Postage",    value: "Insured (£9)"            },
    ],
    coordinates: { lat: 51.5107, lng: -0.1471 },
    seller: SELLERS.fashionBtq,
  },
  {
    id: "fash-shoe-03", href: "/listings/fash-shoe-03", advId: "19033",
    images: [{ src: img(8), alt: "New Balance 990v5" }],
    priceLabel: "£65",
    title: "New Balance 990v5 Made in USA — Marblehead Grey, UK 8, Like New",
    detailsLabel: "SHOES & FOOTWEAR • LIKE NEW • NEW BALANCE",
    locationLabel: "Richmond, London",
    postedAt: daysAgo(2),
    description: "<p>Near-new <strong>New Balance 990v5 Made in USA</strong> in Marblehead grey. UK 8 / EU 42. Worn 4 times on city walks. No creasing or outsole wear. Original box, extra laces. Bought wrong size after wearing them in.</p>",
    keyDetails: [
      { key: "Brand",     value: "New Balance 990v5 MiUSA"  },
      { key: "Colour",    value: "Marblehead grey"          },
      { key: "Size",      value: "UK 8 / EU 42"             },
      { key: "Condition", value: "Like new — 4 wears"       },
    ],
    goodToKnow: [
      { key: "Box",        value: "Original + extra laces" },
      { key: "Sole",       value: "No wear visible"        },
      { key: "Collection", value: "Richmond TW9"           },
      { key: "Postage",    value: "Available (£6 tracked)" },
    ],
    coordinates: { lat: 51.4613, lng: -0.3037 },
    seller: SELLERS.dave,
  },
];

