import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── jewellery_watches ──────────────────────────────────────────────────────────
export const FASHION_JEWELLERY: MockListing[] = [
  {
    id: "fash-jew-01", href: "/listings/fash-jew-01", advId: "19051",
    images: [{ src: img(9), alt: "Rolex Datejust" }],
    priceLabel: "£8,200",
    title: "Rolex Datejust 41 — Stainless Steel, Jubilee Bracelet, 2022, Box & Papers",
    detailsLabel: "JEWELLERY & WATCHES • EXCELLENT • ROLEX",
    locationLabel: "Mayfair, London",
    postedAt: hrsAgo(2),
    description: "<p>Stunning <strong>2022 Rolex Datejust 41 (Ref. 126300)</strong> in oystersteel with jubilee bracelet and white dial. Box and all papers present. Serviced by an authorised dealer in 2025. Open to sensible offers from genuine buyers.</p>",
    keyDetails: [
      { key: "Brand",     value: "Rolex Datejust 41"        },
      { key: "Reference", value: "126300"                   },
      { key: "Year",      value: "2022"                     },
      { key: "Condition", value: "Excellent"                },
    ],
    goodToKnow: [
      { key: "Box & Papers", value: "Complete"              },
      { key: "Service",      value: "AD serviced 2025"      },
      { key: "Viewing",      value: "In-person, secure only" },
      { key: "Escrow",       value: "Open to escrow service" },
    ],
    coordinates: { lat: 51.5107, lng: -0.1471 },
    seller: SELLERS.fashionBtq,
  },
  {
    id: "fash-jew-02", href: "/listings/fash-jew-02", advId: "19052",
    images: [{ src: img(1), alt: "Pandora bracelet" }],
    priceLabel: "£120",
    title: "Pandora Sterling Silver Charm Bracelet + 12 Charms — All Authentic",
    detailsLabel: "JEWELLERY & WATCHES • GOOD • PANDORA",
    locationLabel: "Chiswick, London",
    postedAt: daysAgo(1),
    description: "<p>Complete <strong>Pandora sterling silver charm bracelet with 12 charms</strong> — mix of classic and limited edition pieces including ALE bear, letter charms, family charms, and heart clasp. Receipts for 8 charms. Original Pandora pouch.</p>",
    keyDetails: [
      { key: "Brand",     value: "Pandora"                  },
      { key: "Item",      value: "Bracelet + 12 charms"      },
      { key: "Material",  value: "Sterling silver (ALE 925)" },
      { key: "Condition", value: "Good"                     },
    ],
    goodToKnow: [
      { key: "Auth.",      value: "Receipts for 8 charms"  },
      { key: "Pouch",      value: "Pandora pouch included" },
      { key: "Size",       value: "19cm bracelet"          },
      { key: "Collection", value: "Chiswick W4"            },
    ],
    coordinates: { lat: 51.4927, lng: -0.2613 },
    seller: SELLERS.alice,
  },
  {
    id: "fash-jew-03", href: "/listings/fash-jew-03", advId: "19053",
    images: [{ src: img(2), alt: "Tissot watch" }],
    priceLabel: "£295",
    title: "Tissot Everytime Swissmatic 38mm — Silver Dial, Automatic, Like New",
    detailsLabel: "JEWELLERY & WATCHES • LIKE NEW • TISSOT",
    locationLabel: "Canary Wharf, London",
    postedAt: hrsAgo(4),
    description: "<p>Like-new <strong>Tissot Everytime Swissmatic automatic watch</strong> — 38mm stainless steel case, silver/white dial, leather strap. Purchased Jan 2026 — upgrading to a dressier watch. 5 months old, box and papers complete.</p>",
    keyDetails: [
      { key: "Brand",     value: "Tissot Everytime Swissmatic" },
      { key: "Size",      value: "38mm"                        },
      { key: "Movement",  value: "Automatic"                   },
      { key: "Condition", value: "Like new"                    },
    ],
    goodToKnow: [
      { key: "Box & Papers", value: "Complete"               },
      { key: "Age",          value: "5 months"               },
      { key: "Strap",        value: "Original leather"       },
      { key: "Collection",   value: "Canary Wharf E14"       },
    ],
    coordinates: { lat: 51.5055, lng: -0.0235 },
    seller: SELLERS.dave,
  },
];

