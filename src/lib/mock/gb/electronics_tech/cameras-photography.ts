import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── cameras_photography ────────────────────────────────────────────────────────
export const TECH_CAMERAS: MockListing[] = [
  {
    id: "tech-cam-01", href: "/listings/tech-cam-01", advId: "17041",
    images: [{ src: img(7), alt: "Sony A7 IV camera" }],
    priceLabel: "£2,100",
    title: "Sony A7 IV Mirrorless + 28-70mm Kit Lens — 3,200 Shutter Acts",
    detailsLabel: "CAMERAS • EXCELLENT • SONY A7 IV",
    locationLabel: "Shoreditch, London",
    postedAt: hrsAgo(5),
    description: "<p>Excellent condition <strong>Sony A7 IV mirrorless camera</strong> with 28-70mm F/3.5-5.6 OSS kit lens. Only 3,200 shutter actuations. Comes with 2 batteries, dual charger, 128GB Sony CFexpress card, UV filter, and Think Tank bag.</p>",
    keyDetails: [
      { key: "Camera",     value: "Sony A7 IV (ILCE-7M4)"   },
      { key: "Lens",       value: "28-70mm F3.5-5.6 OSS"    },
      { key: "Shutter",    value: "3,200 actuations"         },
      { key: "Condition",  value: "Excellent"                },
    ],
    goodToKnow: [
      { key: "Batteries",  value: "2× NP-FZ100"             },
      { key: "Card",       value: "128GB Sony CFexpress"     },
      { key: "Bag",        value: "Think Tank bag"           },
      { key: "Collection", value: "Shoreditch E1"            },
    ],
    coordinates: { lat: 51.5245, lng: -0.0789 },
    seller: SELLERS.techSeller,
  },
  {
    id: "tech-cam-02", href: "/listings/tech-cam-02", advId: "17042",
    images: [{ src: img(8), alt: "Godox flash kit" }],
    priceLabel: "£280",
    title: "Godox AD200Pro Flash + Strip Softbox + C-Stand — Portable Studio Kit",
    detailsLabel: "CAMERAS • EXCELLENT • FLASH KIT",
    locationLabel: "Hackney, London",
    postedAt: hrsAgo(3),
    description: "<p>Complete portable studio lighting kit — <strong>Godox AD200Pro TTL flash (200Ws)</strong>, 60×90cm strip softbox (Bowens mount), C-stand with arm. TTL for Sony, Canon, and Nikon. 1000 full-power shots per charge.</p>",
    keyDetails: [
      { key: "Flash",    value: "Godox AD200Pro 200Ws TTL"  },
      { key: "Modifier", value: "60×90cm strip softbox"     },
      { key: "Stand",    value: "C-stand + arm"             },
      { key: "Battery",  value: "1000 shots/charge"        },
    ],
    goodToKnow: [
      { key: "TTL",       value: "Sony/Canon/Nikon"         },
      { key: "Reason",    value: "Upgrading to AD400"       },
      { key: "Collection", value: "Hackney E8"             },
      { key: "Delivery", value: "Available (£15)"          },
    ],
    coordinates: { lat: 51.5478, lng: -0.0759 },
    seller: SELLERS.techSeller,
  },
  {
    id: "tech-cam-03", href: "/listings/tech-cam-03", advId: "17043",
    images: [{ src: img(9), alt: "Canon mirrorless" }],
    priceLabel: "£350",
    title: "Canon EOS M50 Mark II + 15-45mm + 55-200mm Twin Lens Kit — Like New",
    detailsLabel: "CAMERAS • LIKE NEW • CANON M50 II",
    locationLabel: "Chiswick, London",
    postedAt: daysAgo(2),
    description: "<p>Like-new <strong>Canon EOS M50 Mark II with twin lens kit</strong> (15–45mm + 55–200mm). Flip screen, 4K video, eye-tracking AF. Under 2,000 shutter actuations. Upgrading to full-frame. Original box, all accessories.</p>",
    keyDetails: [
      { key: "Camera",    value: "Canon EOS M50 II"          },
      { key: "Lenses",    value: "15-45mm + 55-200mm"        },
      { key: "Actuations", value: "Under 2,000"             },
      { key: "Video",     value: "4K 25fps"                  },
    ],
    goodToKnow: [
      { key: "Screen",    value: "Flip + touch"             },
      { key: "Box",       value: "Original + all cables"    },
      { key: "Collection", value: "Chiswick W4"             },
      { key: "Reason",    value: "Upgrading to full-frame"  },
    ],
    coordinates: { lat: 51.4927, lng: -0.2613 },
    seller: SELLERS.techPrivate,
  },
];

