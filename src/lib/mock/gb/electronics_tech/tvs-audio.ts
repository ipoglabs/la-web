import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── tvs_audio ──────────────────────────────────────────────────────────────────
export const TECH_TV_AUDIO: MockListing[] = [
  {
    id: "tech-tv-01", href: "/listings/tech-tv-01", advId: "17021",
    images: [{ src: img(4), alt: "Sony Bravia soundbar" }],
    priceLabel: "£280",
    title: "Sony HT-A7000 Soundbar — 7.1.2ch, Dolby Atmos, Excellent",
    detailsLabel: "TV & AUDIO • EXCELLENT • SOUNDBAR",
    locationLabel: "Battersea, London",
    postedAt: daysAgo(1),
    description: "<p>Premium <strong>Sony HT-A7000 soundbar</strong> — 7.1.2ch, Dolby Atmos, DTS:X, 500W RMS. Bluetooth, Wi-Fi, HDMI eARC. Used for 1 year — immaculate. No sub or rear speakers (stand-alone). Original remote, HDMI cable, and wall mount kit.</p>",
    keyDetails: [
      { key: "Model",     value: "Sony HT-A7000"            },
      { key: "Channels",  value: "7.1.2 ch"                 },
      { key: "Power",     value: "500W RMS"                 },
      { key: "Formats",   value: "Dolby Atmos, DTS:X"       },
    ],
    goodToKnow: [
      { key: "Condition",  value: "Excellent — 1yr use"     },
      { key: "Includes",   value: "Remote, HDMI, wall kit"  },
      { key: "Collection", value: "Battersea SW11"          },
      { key: "Delivery",   value: "Local for £20"           },
    ],
    coordinates: { lat: 51.4796, lng: -0.1481 },
    seller: SELLERS.techSeller,
  },
  {
    id: "tech-tv-02", href: "/listings/tech-tv-02", advId: "17022",
    images: [{ src: img(5), alt: "Samsung 65 QLED TV" }],
    priceLabel: "£480",
    title: "Samsung 65\" 4K QLED TV — QN90A, 2023, Smart, Barely Used",
    detailsLabel: "TV & AUDIO • EXCELLENT • SAMSUNG TV",
    locationLabel: "Fulham, London",
    postedAt: hrsAgo(4),
    description: "<p>Stunning <strong>Samsung 65-inch QN90A QLED 4K TV</strong> from 2023. Neo Quantum processor, 120Hz, Dolby Atmos, and Object Tracking Sound. Moving abroad — must go. Wall mount bracket included.</p>",
    keyDetails: [
      { key: "Make / Model", value: "Samsung QN90A 65\" QLED" },
      { key: "Resolution",   value: "4K (3840×2160)"          },
      { key: "Features",     value: "120Hz, Dolby Atmos"      },
      { key: "Condition",    value: "Excellent — no marks"    },
    ],
    goodToKnow: [
      { key: "Box",        value: "Original box available" },
      { key: "Wall Mount", value: "Included"               },
      { key: "Remote",     value: "Solar remote included"  },
      { key: "Reason",     value: "Moving abroad"          },
    ],
    coordinates: { lat: 51.4752, lng: -0.2017 },
    seller: SELLERS.quickSell,
  },
  {
    id: "tech-tv-03", href: "/listings/tech-tv-03", advId: "17023",
    images: [{ src: img(6), alt: "Vinyl record collection" }],
    priceLabel: "£8–£25",
    priceSuffix: "/ record",
    title: "Vinyl Record Collection — 200+ LPs, Soul / Jazz / Classic Rock",
    detailsLabel: "TV & AUDIO • VINYL • MUSIC",
    locationLabel: "Notting Hill, London",
    postedAt: daysAgo(1),
    description: "<p>Curated collection of <strong>200+ vinyl LPs</strong> spanning soul, jazz, and classic rock. Mix of originals and quality reissues. Ranging from VG to Mint. Full list available on request — selling individually or as lot.</p>",
    keyDetails: [
      { key: "Quantity",  value: "200+ LPs"                  },
      { key: "Genres",    value: "Soul, Jazz, Classic Rock"  },
      { key: "Condition", value: "VG to Mint"                },
      { key: "Price",     value: "£8–£25 each"               },
    ],
    goodToKnow: [
      { key: "List",       value: "Full list on request"    },
      { key: "Bulk Buy",   value: "Discount available"      },
      { key: "Collection", value: "Notting Hill, W11"       },
      { key: "Postage",    value: "Available (padded)"      },
    ],
    coordinates: { lat: 51.5134, lng: -0.2063 },
    seller: SELLERS.marketStall,
  },
];

