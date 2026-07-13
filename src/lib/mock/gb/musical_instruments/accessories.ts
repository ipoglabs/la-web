import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── music_accessories ──────────────────────────────────────────────────────────
export const MUSIC_ACCESSORIES: MockListing[] = [
  {
    id: "music-acc-01", href: "/listings/music-acc-01", advId: "20051",
    images: [{ src: img(7), alt: "ABRSM exam books" }],
    priceLabel: "£25",
    title: "ABRSM Piano Grade 1–5 Bundle — 12 Books: Pieces, Scales & Theory",
    detailsLabel: "ACCESSORIES • SHEET MUSIC • ABRSM",
    locationLabel: "Richmond, London",
    postedAt: daysAgo(3),
    description: "<p>Bundle of <strong>12 ABRSM piano books</strong> covering Grade 1–5 pieces, Grade 1–4 scales and arpeggios, and Grade 1–3 Music Theory workbooks. Lightly pencilled — all erasable. My daughter used them to complete Grade 5 with Merit.</p>",
    keyDetails: [
      { key: "Books",     value: "12 total"                 },
      { key: "Range",     value: "Grade 1–5 piano"          },
      { key: "Includes",  value: "Pieces + scales + theory" },
      { key: "Condition", value: "Good — light pencil marks" },
    ],
    goodToKnow: [
      { key: "Publisher",  value: "ABRSM official"          },
      { key: "Marks",      value: "Pencil only — erasable"  },
      { key: "Bundle",     value: "All 12 together"         },
      { key: "Postage",    value: "Available £4"            },
    ],
    coordinates: { lat: 51.4613, lng: -0.3037 },
    seller: SELLERS.alice,
  },
  {
    id: "music-acc-02", href: "/listings/music-acc-02", advId: "20052",
    images: [{ src: img(8), alt: "Hercules guitar stands" }],
    priceLabel: "£45",
    title: "Hercules Guitar Stand × 5 + Hercules Wall Mount × 3 — Studio Bundle",
    detailsLabel: "ACCESSORIES • GUITAR STANDS • HERCULES",
    locationLabel: "Hackney, London",
    postedAt: daysAgo(1),
    description: "<p>Bundle of <strong>5 Hercules GS414B auto-grip guitar stands</strong> and <strong>3 Hercules GSP38WB wall mount hangers</strong>. Studio downsizing. All work perfectly. Selling as one lot — ideal for rehearsal rooms or home studios.</p>",
    keyDetails: [
      { key: "Stands",      value: "5 × Hercules GS414B"    },
      { key: "Wall mounts", value: "3 × Hercules GSP38WB"   },
      { key: "Auto-grip",   value: "Yes — all stands"       },
      { key: "Condition",   value: "Good working order"     },
    ],
    goodToKnow: [
      { key: "Bundle",     value: "8 items together"        },
      { key: "Reason",     value: "Studio downsizing"       },
      { key: "Collection", value: "Hackney E8"              },
      { key: "Postage",    value: "Not available"           },
    ],
    coordinates: { lat: 51.5478, lng: -0.0759 },
    seller: SELLERS.musicPrivate,
  },
  {
    id: "music-acc-03", href: "/listings/music-acc-03", advId: "20053",
    images: [{ src: img(9), alt: "K&M orchestra music stands" }],
    priceLabel: "£35",
    title: "K&M 101 Orchestra Music Stands × 2 — Wide Desk, Adjustable, Carry Bag",
    detailsLabel: "ACCESSORIES • MUSIC STANDS • K&M",
    locationLabel: "Chelsea, London",
    postedAt: hrsAgo(6),
    description: "<p>Pair of <strong>K&M 101 professional orchestra music stands</strong> — all-metal, 52cm wide desk, height adjustable 76–128cm. The gigging standard for classical and session musicians. Light age marks only. Includes K&M carry bag for both.</p>",
    keyDetails: [
      { key: "Brand",     value: "K&M 101 Orchestra"        },
      { key: "Quantity",  value: "2 stands"                 },
      { key: "Desk",      value: "52cm wide"                },
      { key: "Condition", value: "Good — light marks"       },
    ],
    goodToKnow: [
      { key: "Height",     value: "76–128cm adjustable"     },
      { key: "Carry bag",  value: "K&M bag for both"        },
      { key: "Bundle",     value: "Pair together only"      },
      { key: "Collection", value: "Chelsea SW3"             },
    ],
    coordinates: { lat: 51.4876, lng: -0.1749 },
    seller: SELLERS.alice,
  },
];
