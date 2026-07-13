import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── collectibles_memorabilia ────────────────────────────────────────────────────
export const MEDIA_COLLECTIBLES: MockListing[] = [
  {
    id: "media-coll-01", href: "/listings/media-coll-01", advId: "21041",
    images: [{ src: img(4), alt: "Royal Mint 50p coin collection" }],
    priceLabel: "£45",
    title: "Royal Mint 50p Complete Collection — All 66 Designs in Lighthouse Album",
    detailsLabel: "COLLECTIBLES • COINS • ROYAL MINT",
    locationLabel: "Richmond, London",
    postedAt: daysAgo(3),
    description: "<p>Complete <strong>Royal Mint 50p circulated collection — all 66 unique designs</strong> including the rare Kew Gardens, full 2012 Olympic sports set, all Beatrix Potter issues, and releases to 2025. Housed in a purpose-made Lighthouse coin album.</p>",
    keyDetails: [
      { key: "Collection", value: "All 66 unique 50p designs" },
      { key: "Includes",   value: "Kew Gardens + Olympics + Potter" },
      { key: "Album",      value: "Lighthouse coin album"     },
      { key: "Condition",  value: "Circulated — all present"  },
    ],
    goodToKnow: [
      { key: "Kew Gardens", value: "Included (circulated)"   },
      { key: "Complete",    value: "All 66 designs to 2025"  },
      { key: "Postage",     value: "Insured post £5"         },
      { key: "Collection",  value: "Richmond TW9"            },
    ],
    coordinates: { lat: 51.4613, lng: -0.3037 },
    seller: SELLERS.mediaPrivate,
  },
  {
    id: "media-coll-02", href: "/listings/media-coll-02", advId: "21042",
    images: [{ src: img(5), alt: "1966 World Cup memorabilia" }],
    priceLabel: "£180",
    title: "1966 World Cup Final Programme + England Memorabilia — 8-Item Collection",
    detailsLabel: "COLLECTIBLES • SPORTS MEMORABILIA • 1966 WC",
    locationLabel: "Islington, London",
    postedAt: daysAgo(5),
    description: "<p>Rare <strong>1966 World Cup Final programme</strong> (England vs West Germany, Wembley, 30 July 1966) plus 7 supporting items: squad photo, 2 cigarette card sets, pennant, and 3 group-stage programmes. Inherited from my grandfather's collection.</p>",
    keyDetails: [
      { key: "Key item",  value: "1966 WC Final programme"   },
      { key: "Items",     value: "8 total"                   },
      { key: "Includes",  value: "Final + group programmes, pennant, cards" },
      { key: "Condition", value: "Good for age"              },
    ],
    goodToKnow: [
      { key: "Provenance", value: "Family collection"        },
      { key: "Viewing",    value: "Welcome — by appointment" },
      { key: "Collection", value: "Islington N1"             },
      { key: "Postage",    value: "Insured only — contact first" },
    ],
    coordinates: { lat: 51.5369, lng: -0.1027 },
    seller: SELLERS.collectorsDesk,
  },
  {
    id: "media-coll-03", href: "/listings/media-coll-03", advId: "21043",
    images: [{ src: img(6), alt: "LEGO Millennium Falcon 10179" }],
    priceLabel: "£580",
    title: "LEGO Star Wars Millennium Falcon 10179 — Retired, 100% Complete, Box",
    detailsLabel: "COLLECTIBLES • LEGO • STAR WARS • RETIRED",
    locationLabel: "Wimbledon, London",
    postedAt: daysAgo(2),
    description: "<p>The legendary <strong>LEGO UCS Millennium Falcon 10179</strong> — retired set, 5,197 pieces. Built once, carefully disassembled, all bags re-sorted and labelled. All minifigs present. Box in good condition. BrickLink average complete: £900+.</p>",
    keyDetails: [
      { key: "Set",       value: "LEGO 10179 Millennium Falcon" },
      { key: "Pieces",    value: "5,197 — 100% complete"     },
      { key: "Minifigs",  value: "All present"               },
      { key: "Condition", value: "Built once, re-sorted"     },
    ],
    goodToKnow: [
      { key: "Retired",      value: "No longer produced"      },
      { key: "BrickLink avg", value: "£900+ complete"         },
      { key: "Instructions", value: "All books present"       },
      { key: "Collection",   value: "Wimbledon SW19"          },
    ],
    coordinates: { lat: 51.4213, lng: -0.2062 },
    seller: SELLERS.collectorsDesk,
  },
];
