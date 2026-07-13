import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── guitars_bass ──────────────────────────────────────────────────────────────
export const MUSIC_GUITARS: MockListing[] = [
  {
    id: "music-guitar-01", href: "/listings/music-guitar-01", advId: "20001",
    images: [{ src: img(1), alt: "Fender Stratocaster" }],
    priceLabel: "£450",
    title: "Fender Player Stratocaster — 3-Colour Sunburst, Maple, Locking Tuners",
    detailsLabel: "GUITAR • ELECTRIC • FENDER • PLAYER SERIES",
    locationLabel: "Hackney, London",
    postedAt: daysAgo(1),
    description: "<p>Excellent <strong>Fender Player Series Stratocaster</strong> in 3-Colour Sunburst with Maple neck. Upgraded Fender locking tuners fitted, recently set up by a luthier — plays beautifully. Light play wear on body only, frets at 90%.</p>",
    keyDetails: [
      { key: "Brand",       value: "Fender Player Stratocaster"  },
      { key: "Colour",      value: "3-Colour Sunburst"           },
      { key: "Fingerboard", value: "Maple"                       },
      { key: "Condition",   value: "Excellent — frets 90%"       },
    ],
    goodToKnow: [
      { key: "Mods",       value: "Locking tuners"               },
      { key: "Setup",      value: "Recent luthier setup"         },
      { key: "Includes",   value: "Gig bag"                      },
      { key: "Collection", value: "Hackney E8"                   },
    ],
    coordinates: { lat: 51.5478, lng: -0.0759 },
    seller: SELLERS.musicPrivate,
  },
  {
    id: "music-guitar-02", href: "/listings/music-guitar-02", advId: "20002",
    images: [{ src: img(2), alt: "Martin D-10E acoustic guitar" }],
    priceLabel: "£320",
    title: "Martin D-10E Acoustic-Electric — Sitka Spruce, Fishman MXT, Hard Case",
    detailsLabel: "GUITAR • ACOUSTIC-ELECTRIC • MARTIN",
    locationLabel: "Richmond, London",
    postedAt: daysAgo(2),
    description: "<p>Beautiful <strong>Martin D-10E acoustic-electric</strong> with Sitka spruce top and sapele back/sides. Fishman MXT pickup system. Bought new 18 months ago — gigged lightly, always stored in case. Upgrading to full-size dreadnought.</p>",
    keyDetails: [
      { key: "Brand",    value: "Martin D-10E"             },
      { key: "Top",      value: "Sitka spruce"             },
      { key: "Pickup",   value: "Fishman MXT"              },
      { key: "Condition", value: "Excellent — 18 months"  },
    ],
    goodToKnow: [
      { key: "Case",       value: "Original hard case"     },
      { key: "Age",        value: "18 months"              },
      { key: "Reason",     value: "Upgrading"              },
      { key: "Collection", value: "Richmond TW9"           },
    ],
    coordinates: { lat: 51.4613, lng: -0.3037 },
    seller: SELLERS.dave,
  },
  {
    id: "music-guitar-03", href: "/listings/music-guitar-03", advId: "20003",
    images: [{ src: img(3), alt: "Yamaha Pacifica starter bundle" }],
    priceLabel: "£180",
    title: "Yamaha Pacifica 112V Starter Bundle — 15W Amp + Cable + Stand + Tuner",
    detailsLabel: "GUITAR • STARTER BUNDLE • YAMAHA",
    locationLabel: "Islington, London",
    postedAt: hrsAgo(3),
    description: "<p>Complete <strong>beginner guitar bundle</strong>: Yamaha Pacifica 112V (Sonic Blue, like new), 15W practice amp, lead cable, guitar stand, clip tuner, and strap. Everything needed to plug in and play today. Perfect first guitar setup.</p>",
    keyDetails: [
      { key: "Guitar",    value: "Yamaha Pacifica 112V"    },
      { key: "Amp",       value: "15W practice amp"        },
      { key: "Colour",    value: "Sonic Blue"              },
      { key: "Condition", value: "Like new"                },
    ],
    goodToKnow: [
      { key: "Includes",   value: "Amp + cable + stand + tuner + strap" },
      { key: "Ideal for",  value: "Complete beginners"     },
      { key: "Collection", value: "Islington N1"           },
      { key: "Delivery",   value: "Available locally £10"  },
    ],
    coordinates: { lat: 51.5369, lng: -0.1027 },
    seller: SELLERS.musicStore,
  },
];
