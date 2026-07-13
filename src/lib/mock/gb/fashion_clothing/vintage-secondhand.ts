import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── vintage_secondhand ─────────────────────────────────────────────────────────
export const FASHION_VINTAGE: MockListing[] = [
  {
    id: "fash-vin-01", href: "/listings/fash-vin-01", advId: "19071",
    images: [{ src: img(2), alt: "Vintage Levi 501s" }],
    priceLabel: "£55",
    title: "Vintage Levi's 501 Jeans — W32 L30, Stonewash Blue, 1990s Deadstock",
    detailsLabel: "VINTAGE • DEADSTOCK • LEVI 501S",
    locationLabel: "Portobello, London",
    postedAt: hrsAgo(3),
    description: "<p>Rare <strong>1990s deadstock Levi's 501 jeans</strong> in classic stonewash blue. W32 L30 — never worn, original tags attached, button-fly intact. Red tab, single stitch — authentic vintage quality that cannot be replicated.</p>",
    keyDetails: [
      { key: "Brand",     value: "Levi's 501"               },
      { key: "Era",       value: "1990s deadstock"          },
      { key: "Size",      value: "W32 / L30"                },
      { key: "Condition", value: "Deadstock — tags on"      },
    ],
    goodToKnow: [
      { key: "Tags",       value: "Original tags attached"  },
      { key: "Authentication", value: "Red tab + single stitch" },
      { key: "Collection",  value: "Portobello Market W11"  },
      { key: "Postage",     value: "Available £4"           },
    ],
    coordinates: { lat: 51.5134, lng: -0.2063 },
    seller: SELLERS.fashionBtq,
  },
  {
    id: "fash-vin-02", href: "/listings/fash-vin-02", advId: "19072",
    images: [{ src: img(3), alt: "Vintage denim jacket" }],
    priceLabel: "£45",
    title: "Vintage Levi's Trucker Denim Jacket — M, Washed, 80s Style",
    detailsLabel: "VINTAGE • GOOD • DENIM JACKET",
    locationLabel: "Brick Lane, London",
    postedAt: daysAgo(2),
    description: "<p>Classic <strong>vintage Levi's Trucker denim jacket</strong> in that perfectly faded 80s wash. Men's Medium (fits true to size). Sourced from a specialist US dealer. Minor natural wear consistent with vintage character — no damage or repairs.</p>",
    keyDetails: [
      { key: "Brand",     value: "Levi's Trucker"          },
      { key: "Era",       value: "1980s vintage"           },
      { key: "Size",      value: "Men's Medium"            },
      { key: "Condition", value: "Good — natural vintage wear" },
    ],
    goodToKnow: [
      { key: "Source",    value: "US specialist dealer"    },
      { key: "Washed",    value: "Naturally faded wash"    },
      { key: "Collection", value: "Brick Lane E1"          },
      { key: "Postage",    value: "Available £5"           },
    ],
    coordinates: { lat: 51.5215, lng: -0.0710 },
    seller: SELLERS.fashionBtq,
  },
  {
    id: "fash-vin-03", href: "/listings/fash-vin-03", advId: "19073",
    images: [{ src: img(8), alt: "Reiss slim-fit suit" }],
    priceLabel: "£150",
    title: "Reiss Slim-Fit Suit — Navy, 40R Jacket / 34W Trousers, Worn Once",
    detailsLabel: "VINTAGE • EXCELLENT • MENS SUIT",
    locationLabel: "Canary Wharf, London",
    postedAt: daysAgo(1),
    description: "<p>Barely worn <strong>Reiss slim-fit suit</strong> in midnight navy. Jacket 40R, trousers 34W/30L. Dry-cleaned after single use. Perfect condition. RRP £450 — ideal for interviews, weddings, or formal events.</p>",
    keyDetails: [
      { key: "Brand",     value: "Reiss"           },
      { key: "Style",     value: "Slim fit"        },
      { key: "Size",      value: "40R / 34W"       },
      { key: "Condition", value: "Excellent"       },
    ],
    goodToKnow: [
      { key: "RRP",        value: "£450 (Reiss)"   },
      { key: "Cleaned",    value: "Dry-cleaned"    },
      { key: "Collection", value: "Canary Wharf"   },
      { key: "Offers",     value: "No offers"      },
    ],
    coordinates: { lat: 51.5055, lng: -0.0235 },
    seller: SELLERS.fashionPrivate,
  },
];

