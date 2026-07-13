import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── mobile_tablets ─────────────────────────────────────────────────────────────
export const TECH_MOBILE: MockListing[] = [
  {
    id: "tech-mob-01", href: "/listings/tech-mob-01", advId: "17001",
    images: [{ src: img(1), alt: "iPhone 16 Pro" }],
    priceLabel: "£850",
    title: "iPhone 16 Pro 256GB — Natural Titanium, Unlocked, Face ID, Boxed",
    detailsLabel: "MOBILE • EXCELLENT • IPHONE 16 PRO",
    locationLabel: "Canary Wharf, London",
    postedAt: hrsAgo(1),
    description: "<p>Immaculate <strong>iPhone 16 Pro 256GB</strong> in Natural Titanium. Unlocked to all networks. 99% battery health, always used with case and screen protector (both included). Original box with all accessories.</p>",
    keyDetails: [
      { key: "Model",     value: "iPhone 16 Pro 256GB"      },
      { key: "Colour",    value: "Natural Titanium"         },
      { key: "Network",   value: "Unlocked (all networks)"  },
      { key: "Battery",   value: "99% health"               },
    ],
    goodToKnow: [
      { key: "Case",       value: "Apple Silicone included" },
      { key: "Screen",     value: "Tempered glass fitted"   },
      { key: "Box",        value: "Original + all cables"   },
      { key: "Collection", value: "Canary Wharf E14"        },
    ],
    coordinates: { lat: 51.5055, lng: -0.0235 },
    seller: SELLERS.techPrivate,
  },
  {
    id: "tech-mob-02", href: "/listings/tech-mob-02", advId: "17002",
    images: [{ src: img(2), alt: "Samsung Galaxy Tab" }],
    priceLabel: "£380",
    title: "Samsung Galaxy Tab S9 FE — 128GB, Wi-Fi, Graphite, Like New",
    detailsLabel: "TABLET • LIKE NEW • SAMSUNG",
    locationLabel: "Hackney, London",
    postedAt: hrsAgo(4),
    description: "<p>Like-new <strong>Samsung Galaxy Tab S9 FE 128GB</strong> in Graphite. Wi-Fi only, Android 14. S Pen included. Used for note-taking for one term — now have iPad. Original box, Samsung cover folio, and charger all included.</p>",
    keyDetails: [
      { key: "Model",     value: "Samsung Galaxy Tab S9 FE" },
      { key: "Storage",   value: "128GB (expandable)"       },
      { key: "S Pen",     value: "Included"                 },
      { key: "Condition", value: "Like new"                 },
    ],
    goodToKnow: [
      { key: "Box",        value: "Original box"            },
      { key: "Cover",      value: "Samsung folio included"  },
      { key: "Collection", value: "Hackney E8"              },
      { key: "Postage",    value: "£8 insured"              },
    ],
    coordinates: { lat: 51.5465, lng: -0.0554 },
    seller: SELLERS.techPrivate,
  },
  {
    id: "tech-mob-03", href: "/listings/tech-mob-03", advId: "17003",
    images: [{ src: img(3), alt: "Google Pixel 7" }],
    priceLabel: "£220",
    title: "Google Pixel 7 128GB — Obsidian, Unlocked, Excellent, 94% Battery",
    detailsLabel: "MOBILE • EXCELLENT • GOOGLE PIXEL 7",
    locationLabel: "Lewisham, London",
    postedAt: daysAgo(1),
    description: "<p>Excellent <strong>Google Pixel 7 128GB</strong> in Obsidian — unlocked to all networks, 94% battery health, always case-protected. Google Care+ still active. Original box and charger. Upgrading to Pixel 9.</p>",
    keyDetails: [
      { key: "Model",    value: "Google Pixel 7 128GB"      },
      { key: "Colour",   value: "Obsidian"                  },
      { key: "Network",  value: "Unlocked (all networks)"   },
      { key: "Battery",  value: "94% health"               },
    ],
    goodToKnow: [
      { key: "Google Care", value: "Still active"          },
      { key: "Case",        value: "Google case included"  },
      { key: "Box",         value: "Original + charger"    },
      { key: "Collection",  value: "Lewisham SE13"         },
    ],
    coordinates: { lat: 51.4613, lng: -0.0116 },
    seller: SELLERS.techPrivate,
  },
];

