import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── electronics_free ──────────────────────────────────────────────────────────
export const FREE_ELECTRONICS: MockListing[] = [
  {
    id: "free-elec-01", href: "/listings/free-elec-01", advId: "23021",
    images: [{ src: img(1), alt: "Sony Trinitron CRT television" }],
    priceLabel: "Free",
    title: "Sony Trinitron 28\" CRT TV — Fully Working, Remote Included, FREE Croydon",
    detailsLabel: "FREE • ELECTRONICS • CRT TV • SONY",
    locationLabel: "Croydon, London",
    postedAt: hrsAgo(5),
    description: "<p>Free <strong>Sony Trinitron 28\" CRT television</strong> — picture and sound perfect, remote control included. Popular with retro gaming enthusiasts and film fans who prefer the classic CRT look. Very heavy — 2 people needed to collect.</p>",
    keyDetails: [
      { key: "Item",      value: "Sony Trinitron 28\" CRT"   },
      { key: "Working",   value: "Yes — picture + sound"     },
      { key: "Remote",    value: "Included"                  },
      { key: "Weight",    value: "Heavy — 2 people needed"   },
    ],
    goodToKnow: [
      { key: "Price",      value: "FREE"                     },
      { key: "Ideal for",  value: "Retro gaming, film fans"  },
      { key: "Collection", value: "Ground floor — Croydon CR0" },
      { key: "Urgency",    value: "This weekend preferred"   },
    ],
    coordinates: { lat: 51.3762, lng: -0.0982 },
    seller: SELLERS.giveawayPrivate,
  },
  {
    id: "free-elec-02", href: "/listings/free-elec-02", advId: "23022",
    images: [{ src: img(2), alt: "Dell OptiPlex desktop PC" }],
    priceLabel: "Free",
    title: "Dell OptiPlex 7010 Desktop — Spares or Repairs, i5 + 8GB RAM, FREE Shoreditch",
    detailsLabel: "FREE • ELECTRONICS • DESKTOP PC • DELL",
    locationLabel: "Shoreditch, London",
    postedAt: daysAgo(1),
    description: "<p>Free <strong>Dell OptiPlex 7010 desktop PC</strong> — powers on but fails to boot past POST (likely HDD failure). Intel Core i5-3470, 8GB RAM. Good for parts or a quick fix. No HDD or OS disc included. Collection Shoreditch E1.</p>",
    keyDetails: [
      { key: "Item",      value: "Dell OptiPlex 7010"        },
      { key: "CPU",       value: "Intel Core i5-3470"        },
      { key: "RAM",       value: "8GB"                       },
      { key: "Fault",     value: "POST fail — likely HDD"    },
    ],
    goodToKnow: [
      { key: "Price",      value: "FREE"                     },
      { key: "No HDD",     value: "Not included"             },
      { key: "Ideal for",  value: "Parts / repair project"   },
      { key: "Collection", value: "Shoreditch E1"            },
    ],
    coordinates: { lat: 51.5267, lng: -0.0818 },
    seller: SELLERS.giveawayPrivate,
  },
  {
    id: "free-elec-03", href: "/listings/free-elec-03", advId: "23023",
    images: [{ src: img(3), alt: "Epson printer" }],
    priceLabel: "Free",
    title: "Epson XP-3105 Printer — Works Fine, No Inks, FREE Collection Clapham",
    detailsLabel: "FREE • ELECTRONICS • PRINTER • EPSON",
    locationLabel: "Clapham, London",
    postedAt: hrsAgo(6),
    description: "<p>Free <strong>Epson Expression Home XP-3105 printer</strong> — prints, scans, and copies wirelessly. Works perfectly, just no ink cartridges. Upgrading to a laser printer. Compatible inks cost ~£8 on Amazon. Collection Clapham SW4.</p>",
    keyDetails: [
      { key: "Item",      value: "Epson XP-3105"             },
      { key: "Functions", value: "Print + scan + copy"       },
      { key: "Wi-Fi",     value: "Yes — wireless"            },
      { key: "Ink",       value: "None included"             },
    ],
    goodToKnow: [
      { key: "Price",      value: "FREE"                     },
      { key: "Inks",       value: "~£8 compatible on Amazon" },
      { key: "Reason",     value: "Upgrading to laser"       },
      { key: "Collection", value: "Clapham SW4"              },
    ],
    coordinates: { lat: 51.4614, lng: -0.1380 },
    seller: SELLERS.giveawayPrivate,
  },
];
