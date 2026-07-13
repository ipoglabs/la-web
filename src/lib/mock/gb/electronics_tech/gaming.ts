import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── gaming ──────────────────────────────────────────────────────────────────────
export const TECH_GAMING: MockListing[] = [
  {
    id: "tech-game-01", href: "/listings/tech-game-01", advId: "17031",
    images: [{ src: img(5), alt: "PS5 console" }],
    priceLabel: "£320",
    title: "PlayStation 5 Disc Edition — 2 Controllers, 5 Games, Excellent",
    detailsLabel: "GAMING • EXCELLENT • PS5",
    locationLabel: "Islington, London",
    postedAt: hrsAgo(2),
    description: "<p>Great condition <strong>PlayStation 5 Disc Edition</strong> with 2 DualSense controllers (white + midnight black) and 5 games: Spider-Man 2, God of War Ragnarök, GT7, Hogwarts Legacy, and Elden Ring. All original cables and stand.</p>",
    keyDetails: [
      { key: "Console",   value: "PS5 Disc Edition"           },
      { key: "Controllers", value: "2 DualSense"              },
      { key: "Games",     value: "5 disc games included"      },
      { key: "Condition", value: "Excellent"                  },
    ],
    goodToKnow: [
      { key: "Games",      value: "Spider-Man 2, GoW, GT7 +" },
      { key: "Cables",     value: "All original"              },
      { key: "Collection", value: "Islington N1"              },
      { key: "Firm Price", value: "No offers — firm"          },
    ],
    coordinates: { lat: 51.5369, lng: -0.1027 },
    seller: SELLERS.techPrivate,
  },
  {
    id: "tech-game-02", href: "/listings/tech-game-02", advId: "17032",
    images: [{ src: img(6), alt: "Gaming PC" }],
    priceLabel: "£1,450",
    title: "Custom Gaming PC — Ryzen 7 7700X, RTX 4070 Ti, 32GB DDR5, 2TB",
    detailsLabel: "GAMING • EXCELLENT • GAMING PC",
    locationLabel: "Stratford, London",
    postedAt: daysAgo(1),
    description: "<p>Custom-built <strong>high-performance gaming PC</strong>: AMD Ryzen 7 7700X, RTX 4070 Ti Super 16GB, 32GB Corsair DDR5, 2TB NVMe, Lian Li O11 Dynamic case, 360mm AIO. Runs everything on Ultra 4K. 1 year old — parts under warranty.</p>",
    keyDetails: [
      { key: "CPU",    value: "AMD Ryzen 7 7700X"         },
      { key: "GPU",    value: "RTX 4070 Ti Super 16GB"    },
      { key: "RAM",    value: "32GB Corsair DDR5"         },
      { key: "Storage", value: "2TB NVMe"                 },
    ],
    goodToKnow: [
      { key: "Case",       value: "Lian Li O11 Dynamic"  },
      { key: "Cooling",    value: "360mm AIO"             },
      { key: "Warranty",   value: "Parts under warranty"  },
      { key: "Collection", value: "Stratford E15"         },
    ],
    coordinates: { lat: 51.5428, lng: -0.0019 },
    seller: SELLERS.techSeller,
  },
  {
    id: "tech-game-03", href: "/listings/tech-game-03", advId: "17033",
    images: [{ src: img(7), alt: "Gaming chair" }],
    priceLabel: "£185",
    title: "Secretlab Titan EVO 2022 Gaming Chair — Regular, Mint Green SoftWeave",
    detailsLabel: "GAMING • EXCELLENT • GAMING CHAIR",
    locationLabel: "Stratford, London",
    postedAt: daysAgo(2),
    description: "<p>Excellent condition <strong>Secretlab Titan EVO 2022</strong> in Regular size (5'5\"&ndash;5'11\") in Mint Green SoftWeave fabric. Cold-cure foam, L-adapt lumbar, 4D armrests. Only 8 months of use. Moving to a standing desk setup.</p>",
    keyDetails: [
      { key: "Brand",    value: "Secretlab Titan EVO 2022" },
      { key: "Size",     value: "Regular (5'5\"\u20135'11\")"       },
      { key: "Material", value: "SoftWeave Mint Green"      },
      { key: "Condition", value: "Excellent — 8 months"    },
    ],
    goodToKnow: [
      { key: "Lumbar",    value: "L-adapt (built-in)"      },
      { key: "Armrests",  value: "4D adjustable"           },
      { key: "Collection", value: "Stratford E15"          },
      { key: "Delivery", value: "Man & van (own arrange)"  },
    ],
    coordinates: { lat: 51.5428, lng: -0.0019 },
    seller: SELLERS.techSeller,
  },
];

