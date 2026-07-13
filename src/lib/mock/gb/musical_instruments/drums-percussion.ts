import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── drums_percussion ───────────────────────────────────────────────────────────
export const MUSIC_DRUMS: MockListing[] = [
  {
    id: "music-drum-01", href: "/listings/music-drum-01", advId: "20021",
    images: [{ src: img(7), alt: "Pearl Export drum kit" }],
    priceLabel: "£280",
    title: "Pearl Export EXX 5-Piece Shell Pack — Rock Sizes, New Remo Heads",
    detailsLabel: "DRUMS • ACOUSTIC • PEARL EXPORT",
    locationLabel: "Croydon, London",
    postedAt: daysAgo(2),
    description: "<p><strong>Pearl Export EXX 5-piece shell pack</strong> in jet black — 22\" bass, 10\"/12\" rack toms, 16\" floor tom, 14\" snare. New Remo Ambassador heads fitted throughout. Hardware, cymbals, and stool NOT included. Solid reliable kit.</p>",
    keyDetails: [
      { key: "Brand",     value: "Pearl Export EXX"         },
      { key: "Sizes",     value: "22/10/12/16/14\""         },
      { key: "Heads",     value: "New Remo Ambassador"      },
      { key: "Condition", value: "Good — shells solid"      },
    ],
    goodToKnow: [
      { key: "Note",       value: "Shells only — no hw/cymbals" },
      { key: "Colour",     value: "Jet black wrap"          },
      { key: "Vehicle",    value: "Large van needed"        },
      { key: "Collection", value: "Croydon CR0"             },
    ],
    coordinates: { lat: 51.3762, lng: -0.0982 },
    seller: SELLERS.musicPrivate,
  },
  {
    id: "music-drum-02", href: "/listings/music-drum-02", advId: "20022",
    images: [{ src: img(8), alt: "Roland TD-07 electronic drums" }],
    priceLabel: "£450",
    title: "Roland TD-07DMK V-Drums Electronic Kit — Mesh Snare, Bluetooth, Throne",
    detailsLabel: "DRUMS • ELECTRONIC • ROLAND V-DRUMS",
    locationLabel: "Islington, London",
    postedAt: hrsAgo(5),
    description: "<p>Compact <strong>Roland TD-07DMK electronic drum kit</strong> — 10\" mesh snare, hi-hat controller, 3 × 8\" cymbal pads, and TD-07 module with Bluetooth and USB MIDI. Ideal for flat/apartment practice — very low noise. Includes Roland drum throne.</p>",
    keyDetails: [
      { key: "Brand",     value: "Roland TD-07DMK"          },
      { key: "Snare",     value: "10\" mesh head"           },
      { key: "Module",    value: "TD-07 with Bluetooth"     },
      { key: "Condition", value: "Excellent"                },
    ],
    goodToKnow: [
      { key: "Bluetooth",  value: "Audio + USB MIDI"        },
      { key: "Throne",     value: "Roland — included"       },
      { key: "Ideal",      value: "Flat practice — quiet"   },
      { key: "Collection", value: "Islington N1"            },
    ],
    coordinates: { lat: 51.5369, lng: -0.1027 },
    seller: SELLERS.dave,
  },
  {
    id: "music-drum-03", href: "/listings/music-drum-03", advId: "20023",
    images: [{ src: img(9), alt: "Zildjian A Custom cymbals" }],
    priceLabel: "£220",
    title: "Zildjian A Custom Cymbal Pack — 14\" HH + 16\" Crash + 20\" Ride",
    detailsLabel: "DRUMS • CYMBALS • ZILDJIAN A CUSTOM",
    locationLabel: "Hackney, London",
    postedAt: daysAgo(1),
    description: "<p>Pro-quality <strong>Zildjian A Custom cymbal set</strong>: 14\" hi-hats (top + bottom), 16\" A Custom Medium crash, 20\" A Custom ride. Bright, cutting projection. 2 years stage use. No cracks or keyholing. Sold together as a set.</p>",
    keyDetails: [
      { key: "Hi-Hats",  value: "14\" A Custom"             },
      { key: "Crash",    value: "16\" A Custom Medium"       },
      { key: "Ride",     value: "20\" A Custom"              },
      { key: "Condition", value: "Good — no cracks"         },
    ],
    goodToKnow: [
      { key: "Keyholing",  value: "None"                    },
      { key: "Stage use",  value: "2 years"                 },
      { key: "Bundle",     value: "All 4 pieces together"   },
      { key: "Collection", value: "Hackney E8"              },
    ],
    coordinates: { lat: 51.5478, lng: -0.0759 },
    seller: SELLERS.musicPrivate,
  },
];
