import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── home_decor ──────────────────────────────────────────────────────────────────
export const HOME_DECOR: MockListing[] = [
  {
    id: "home-decor-01", href: "/listings/home-decor-01", advId: "18051",
    images: [{ src: img(7), alt: "Large wall art" }],
    priceLabel: "£120",
    title: "Large Abstract Canvas Print — 120×80cm, Framed, Ochre & Teal",
    detailsLabel: "HOME DECOR • EXCELLENT • WALL ART",
    locationLabel: "Islington, London",
    postedAt: daysAgo(1),
    description: "<p>Statement <strong>large abstract canvas print</strong> (120×80cm) in warm ochre, teal, and charcoal. Custom-framed in natural oak. Purchased from a London gallery — selling to redecorate. Perfect condition, no fading.</p>",
    keyDetails: [
      { key: "Size",      value: "120 × 80 cm"              },
      { key: "Frame",     value: "Natural oak gallery frame" },
      { key: "Colours",   value: "Ochre, teal, charcoal"    },
      { key: "Condition", value: "Perfect — no fading"      },
    ],
    goodToKnow: [
      { key: "Hanging",    value: "D-ring fixings on back"  },
      { key: "Collection", value: "Islington N1"            },
      { key: "Delivery",   value: "Available locally £15"   },
      { key: "Postage",    value: "Not suitable — canvas"   },
    ],
    coordinates: { lat: 51.5369, lng: -0.1027 },
    seller: SELLERS.homeStore,
  },
  {
    id: "home-decor-02", href: "/listings/home-decor-02", advId: "18052",
    images: [{ src: img(8), alt: "Botanical prints" }],
    priceLabel: "£45",
    title: "Set of 3 Botanical Framed A3 Prints — White Box Frames, Ready to Hang",
    detailsLabel: "HOME DECOR • EXCELLENT • FRAMED PRINTS",
    locationLabel: "Battersea, London",
    postedAt: daysAgo(1),
    description: "<p>Set of 3 <strong>A3 botanical framed prints</strong> in matching white box frames — ferns, tropical leaf, and palm. Contemporary Scandi style. Purchased from Urban Outfitters — excellent condition, barely hung.</p>",
    keyDetails: [
      { key: "Set",       value: "3 prints (A3)"            },
      { key: "Frames",    value: "White box frame"          },
      { key: "Style",     value: "Botanical / Scandi"       },
      { key: "Condition", value: "Excellent"                },
    ],
    goodToKnow: [
      { key: "Hooks",      value: "D-ring on back"          },
      { key: "Bundle",     value: "All 3 together only"     },
      { key: "Collection", value: "Battersea SW11"          },
      { key: "Postage",    value: "Available (£8)"          },
    ],
    coordinates: { lat: 51.4796, lng: -0.1481 },
    seller: SELLERS.alice,
  },
  {
    id: "home-decor-03", href: "/listings/home-decor-03", advId: "18053",
    images: [{ src: img(9), alt: "Brass table lamps" }],
    priceLabel: "£85",
    title: "Pair of Vintage Brass Table Lamps — Rewired, New Cream Drum Shades",
    detailsLabel: "HOME DECOR • EXCELLENT • TABLE LAMPS",
    locationLabel: "Notting Hill, London",
    postedAt: daysAgo(2),
    description: "<p>Beautiful pair of <strong>1960s-style solid brass table lamps</strong> (35cm base height), professionally rewired to UK standard, with new cream drum fabric shades. Sold as a pair. Perfect mid-century modern accent.</p>",
    keyDetails: [
      { key: "Style",    value: "Vintage brass, 1960s"      },
      { key: "Height",   value: "35cm base"                 },
      { key: "Shades",   value: "New cream drum"            },
      { key: "Rewired",  value: "UK standard"               },
    ],
    goodToKnow: [
      { key: "Pair",       value: "Sold together only"      },
      { key: "Bulbs",      value: "E27 max 40W"             },
      { key: "Collection", value: "Notting Hill W11"        },
      { key: "Postage",    value: "Available (£12)"         },
    ],
    coordinates: { lat: 51.5134, lng: -0.2063 },
    seller: SELLERS.marketStall,
  },
];

