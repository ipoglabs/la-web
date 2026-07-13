import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── dj_audio_gear ──────────────────────────────────────────────────────────────
export const MUSIC_DJ: MockListing[] = [
  {
    id: "music-dj-01", href: "/listings/music-dj-01", advId: "20031",
    images: [{ src: img(1), alt: "Pioneer DDJ-800 controller" }],
    priceLabel: "£350",
    title: "Pioneer DDJ-800 2-Channel DJ Controller — Motorised Jogs, Like New",
    detailsLabel: "DJ GEAR • CONTROLLER • PIONEER",
    locationLabel: "Shoreditch, London",
    postedAt: daysAgo(2),
    description: "<p>Like-new <strong>Pioneer DDJ-800 2-channel professional DJ controller</strong> — motorised jog wheels, 16 performance pads, DVS-ready. Club-standard layout in portable form. Used for 6 home practice sessions only. Rekordbox DJ licence included.</p>",
    keyDetails: [
      { key: "Brand",     value: "Pioneer DDJ-800"          },
      { key: "Channels",  value: "2"                        },
      { key: "Jog",       value: "Motorised"                },
      { key: "Condition", value: "Like new — 6 uses"        },
    ],
    goodToKnow: [
      { key: "Software",   value: "Rekordbox DJ included"   },
      { key: "DVS",        value: "Ready (licence separate)"},
      { key: "Box",        value: "Original box + manual"   },
      { key: "Collection", value: "Shoreditch E1"           },
    ],
    coordinates: { lat: 51.5267, lng: -0.0818 },
    seller: SELLERS.musicPrivate,
  },
  {
    id: "music-dj-02", href: "/listings/music-dj-02", advId: "20032",
    images: [{ src: img(2), alt: "Technics SL-1200 turntables" }],
    priceLabel: "£650",
    title: "Technics SL-1200MK2 Pair + Vestax PMC-05 Pro III Mixer — Serviced 2024",
    detailsLabel: "DJ GEAR • VINYL SETUP • TECHNICS",
    locationLabel: "Brixton, London",
    postedAt: daysAgo(3),
    description: "<p>Classic <strong>Technics SL-1200MK2 turntable pair</strong> with Ortofon Concorde Mix cartridges + Vestax PMC-05 Pro III scratch mixer. Fully serviced 2024. The gold standard for vinyl DJing. Selling as complete setup — complete package only.</p>",
    keyDetails: [
      { key: "Decks",     value: "SL-1200MK2 × 2"           },
      { key: "Mixer",     value: "Vestax PMC-05 Pro III"     },
      { key: "Carts",     value: "Ortofon Concorde Mix × 2"  },
      { key: "Condition", value: "Good — serviced 2024"      },
    ],
    goodToKnow: [
      { key: "Service",    value: "Full motor service 2024"  },
      { key: "Bundle",     value: "Complete setup only"      },
      { key: "Vehicle",    value: "Large van needed"         },
      { key: "Collection", value: "Brixton SW9"              },
    ],
    coordinates: { lat: 51.4612, lng: -0.1149 },
    seller: SELLERS.musicPrivate,
  },
  {
    id: "music-dj-03", href: "/listings/music-dj-03", advId: "20033",
    images: [{ src: img(3), alt: "Focusrite Scarlett 2i2 Studio" }],
    priceLabel: "£120",
    title: "Focusrite Scarlett 2i2 Studio Gen 4 Bundle — Interface + Mic + Headphones",
    detailsLabel: "DJ GEAR • AUDIO INTERFACE • FOCUSRITE",
    locationLabel: "Stratford, London",
    postedAt: hrsAgo(4),
    description: "<p>Brand new, sealed <strong>Focusrite Scarlett 2i2 Studio Gen 4 bundle</strong>: 2i2 interface, CM25 MkIII condenser microphone, HP60 MkIII headphones, and XLR cable. Complete home studio starter kit. Unwanted gift. RRP £189.</p>",
    keyDetails: [
      { key: "Interface",  value: "Scarlett 2i2 Gen 4"      },
      { key: "Mic",        value: "CM25 MkIII condenser"    },
      { key: "Headphones", value: "HP60 MkIII"              },
      { key: "Condition",  value: "Brand new, sealed"       },
    ],
    goodToKnow: [
      { key: "RRP",        value: "£189"                    },
      { key: "Software",   value: "Pro Tools + Ableton incl." },
      { key: "Collection", value: "Stratford E15"           },
      { key: "Postage",    value: "Available £8"            },
    ],
    coordinates: { lat: 51.5428, lng: -0.0019 },
    seller: SELLERS.dave,
  },
];
