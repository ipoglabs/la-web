import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── computer_parts ──────────────────────────────────────────────────────────────
export const TECH_PARTS: MockListing[] = [
  {
    id: "tech-parts-01", href: "/listings/tech-parts-01", advId: "17051",
    images: [{ src: img(8), alt: "GPU" }],
    priceLabel: "£380",
    title: "NVIDIA RTX 3080 10GB FE — Excellent, Low Fan Hours, Founders Ed.",
    detailsLabel: "COMPUTER PARTS • EXCELLENT • GPU",
    locationLabel: "Lewisham, London",
    postedAt: daysAgo(2),
    description: "<p>Founders Edition <strong>NVIDIA RTX 3080 10GB</strong> — excellent condition, minimal use at low temps (under-volted at all times). Runs cool and quiet. Original box. Upgrading to 4080 — no longer needed.</p>",
    keyDetails: [
      { key: "Part",      value: "NVIDIA RTX 3080 10GB FE" },
      { key: "VRAM",      value: "10GB GDDR6X"             },
      { key: "Condition", value: "Excellent"               },
      { key: "Box",       value: "Original box"            },
    ],
    goodToKnow: [
      { key: "Temps",      value: "Always undervolted"     },
      { key: "Fan Hours",  value: "Low — quiet operation"  },
      { key: "Reason",     value: "Upgrading to RTX 4080"  },
      { key: "Collection", value: "Lewisham SE13"          },
    ],
    coordinates: { lat: 51.4613, lng: -0.0116 },
    seller: SELLERS.techSeller,
  },
  {
    id: "tech-parts-02", href: "/listings/tech-parts-02", advId: "17052",
    images: [{ src: img(9), alt: "DDR5 RAM" }],
    priceLabel: "£75",
    title: "Corsair Vengeance DDR5 32GB Kit (2×16GB) 5600MHz — New, Sealed",
    detailsLabel: "COMPUTER PARTS • NEW • RAM",
    locationLabel: "Islington, London",
    postedAt: daysAgo(1),
    description: "<p>Brand new, sealed <strong>Corsair Vengeance DDR5 32GB kit</strong> (2×16GB, 5600MHz, CL36). Bought for a build that changed spec to AMD. Compatible with Intel 12th/13th/14th gen and DDR5 AM5.</p>",
    keyDetails: [
      { key: "Spec",      value: "32GB (2×16GB) DDR5"      },
      { key: "Speed",     value: "5600 MHz CL36"           },
      { key: "Brand",     value: "Corsair Vengeance"       },
      { key: "Condition", value: "New, sealed"             },
    ],
    goodToKnow: [
      { key: "Compat.",   value: "Intel 12/13/14th + AM5" },
      { key: "Postage",   value: "£4 tracked"             },
      { key: "Collection", value: "Islington N1"           },
      { key: "Reason",    value: "Build spec changed"      },
    ],
    coordinates: { lat: 51.5369, lng: -0.1027 },
    seller: SELLERS.techSeller,
  },
  {
    id: "tech-parts-03", href: "/listings/tech-parts-03", advId: "17053",
    images: [{ src: img(1), alt: "Samsung NVMe SSD" }],
    priceLabel: "£55",
    title: "Samsung 990 Pro 2TB NVMe M.2 SSD — PCIe 4.0, New in Box",
    detailsLabel: "COMPUTER PARTS • NEW • SSD",
    locationLabel: "Shoreditch, London",
    postedAt: hrsAgo(5),
    description: "<p>Brand new, sealed <strong>Samsung 990 Pro 2TB PCIe 4.0 NVMe M.2 SSD</strong>. Sequential read 7,450 MB/s. Unopened retail box — bought as a spare but no longer needed. Includes Samsung heat spreader sticker.</p>",
    keyDetails: [
      { key: "Brand",     value: "Samsung 990 Pro"         },
      { key: "Capacity",  value: "2TB"                    },
      { key: "Interface", value: "PCIe 4.0 NVMe M.2"      },
      { key: "Speed",     value: "7,450 MB/s read"        },
    ],
    goodToKnow: [
      { key: "Condition", value: "New, sealed retail"     },
      { key: "Postage",   value: "Tracked 48hr"           },
      { key: "Warranty",  value: "5-year Samsung"         },
      { key: "Collection", value: "Shoreditch E1"         },
    ],
    coordinates: { lat: 51.5267, lng: -0.0818 },
    seller: SELLERS.techSeller,
  },
];

