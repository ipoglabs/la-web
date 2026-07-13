import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── laptops_computers ──────────────────────────────────────────────────────────
export const TECH_LAPTOPS: MockListing[] = [
  {
    id: "tech-lap-01", href: "/listings/tech-lap-01", advId: "17011",
    images: [{ src: img(3), alt: "Dell XPS 15" }],
    priceLabel: "£1,200",
    title: "Dell XPS 15 9530 — i9, 32GB RAM, 1TB NVMe, RTX 4060, OLED",
    detailsLabel: "LAPTOP • EXCELLENT • DELL XPS 15",
    locationLabel: "Soho, London",
    postedAt: hrsAgo(3),
    description: "<p>Powerhouse <strong>Dell XPS 15 9530</strong> — Intel Core i9-13900H, 32GB DDR5, 1TB NVMe SSD, NVIDIA RTX 4060, and 15.6-inch OLED touchscreen. Used for creative work — perfect condition, no scratches. Includes Dell sleeve bag.</p>",
    keyDetails: [
      { key: "CPU",       value: "i9-13900H"               },
      { key: "RAM",       value: "32GB DDR5"               },
      { key: "Storage",   value: "1TB NVMe SSD"            },
      { key: "GPU",       value: "NVIDIA RTX 4060"         },
    ],
    goodToKnow: [
      { key: "Display",    value: "15.6\" OLED touchscreen" },
      { key: "Bag",        value: "Dell sleeve included"    },
      { key: "Battery",    value: "Calibrated, good life"   },
      { key: "Collection", value: "Soho W1 — no postage"   },
    ],
    coordinates: { lat: 51.5134, lng: -0.1310 },
    seller: SELLERS.techPrivate,
  },
  {
    id: "tech-lap-02", href: "/listings/tech-lap-02", advId: "17012",
    images: [{ src: img(2), alt: "MacBook Pro 14 M3 Pro" }],
    priceLabel: "£1,100",
    title: "MacBook Pro 14\" M3 Pro — 18GB RAM, 512GB SSD, Space Black",
    detailsLabel: "LAPTOP • LIKE NEW • APPLE",
    locationLabel: "Kensington, London",
    postedAt: hrsAgo(2),
    description: "<p>Barely used <strong>MacBook Pro 14-inch M3 Pro</strong> in Space Black. 18GB unified memory, 512GB SSD, 120Hz ProMotion display. Purchased Jan 2026, full warranty remaining. AppleCare+ transferable.</p>",
    keyDetails: [
      { key: "Make / Model",  value: "Apple MacBook Pro 14\"" },
      { key: "Chip",          value: "M3 Pro (11-core CPU)"   },
      { key: "RAM / Storage", value: "18GB / 512GB SSD"       },
      { key: "Condition",     value: "Like new (minor desk use)" },
    ],
    goodToKnow: [
      { key: "Warranty",   value: "AppleCare+ to Jan 2028" },
      { key: "Box",        value: "Original box, all docs"  },
      { key: "Charger",    value: "140W USB-C included"     },
      { key: "Collection", value: "Kensington only"         },
    ],
    coordinates: { lat: 51.5006, lng: -0.1932 },
    seller: SELLERS.quickSell,
  },
  {
    id: "tech-lap-03", href: "/listings/tech-lap-03", advId: "17013",
    images: [{ src: img(3), alt: "Lenovo IdeaPad" }],
    priceLabel: "£280",
    title: "Lenovo IdeaPad 5 15-inch — Ryzen 5, 16GB RAM, 512GB SSD, FHD IPS",
    detailsLabel: "LAPTOP • EXCELLENT • LENOVO",
    locationLabel: "Walthamstow, London",
    postedAt: daysAgo(1),
    description: "<p>Immaculate <strong>Lenovo IdeaPad 5 15-inch</strong> — AMD Ryzen 5 5500U, 16GB DDR4, 512GB SSD, 15.6-inch Full HD IPS display. Perfect student or everyday laptop. Used 4 months — reason: upgrading to MacBook.</p>",
    keyDetails: [
      { key: "CPU",      value: "AMD Ryzen 5 5500U"         },
      { key: "RAM",      value: "16GB DDR4"                 },
      { key: "Storage",  value: "512GB SSD"                 },
      { key: "Display",  value: "15.6\" FHD IPS"            },
    ],
    goodToKnow: [
      { key: "Battery",    value: "8hr+ life"              },
      { key: "Box",        value: "Original + charger"     },
      { key: "Collection", value: "Walthamstow E17"        },
      { key: "Postage",    value: "Available (£8)"          },
    ],
    coordinates: { lat: 51.5860, lng: -0.0207 },
    seller: SELLERS.techPrivate,
  },
];

