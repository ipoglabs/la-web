import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── keyboards_piano ────────────────────────────────────────────────────────────
export const MUSIC_KEYBOARDS: MockListing[] = [
  {
    id: "music-keys-01", href: "/listings/music-keys-01", advId: "20011",
    images: [{ src: img(4), alt: "Roland RD-88 stage piano" }],
    priceLabel: "£550",
    title: "Roland RD-88 Stage Piano — 88-Key Progressive Hammer, Bluetooth, Soft Case",
    detailsLabel: "KEYBOARD • STAGE PIANO • ROLAND",
    locationLabel: "Wimbledon, London",
    postedAt: daysAgo(3),
    description: "<p>Pristine <strong>Roland RD-88 stage piano</strong> — 88 fully weighted Progressive Hammer keys, superb acoustic piano and EP sounds, Bluetooth audio and MIDI. 2 years old, home use only. Includes Roland soft carry case. Moving abroad.</p>",
    keyDetails: [
      { key: "Brand",     value: "Roland RD-88"             },
      { key: "Keys",      value: "88 — Progressive Hammer"  },
      { key: "Sounds",    value: "Piano, EP, organs, synths" },
      { key: "Condition", value: "Excellent — 2 years"      },
    ],
    goodToKnow: [
      { key: "Bluetooth",  value: "Audio + MIDI"            },
      { key: "Case",       value: "Roland soft bag included" },
      { key: "Reason",     value: "Moving abroad"           },
      { key: "Collection", value: "Wimbledon SW19"          },
    ],
    coordinates: { lat: 51.4213, lng: -0.2062 },
    seller: SELLERS.musicPrivate,
  },
  {
    id: "music-keys-02", href: "/listings/music-keys-02", advId: "20012",
    images: [{ src: img(5), alt: "Yamaha P-125 digital piano" }],
    priceLabel: "£220",
    title: "Yamaha P-125 Digital Piano — 88-Key GHC, L-85 Stand + Sustain Pedal",
    detailsLabel: "KEYBOARD • DIGITAL PIANO • YAMAHA",
    locationLabel: "Clapham, London",
    postedAt: daysAgo(1),
    description: "<p>Like-new <strong>Yamaha P-125 88-key digital piano</strong> with GHC weighted keys. Used for Grade 3 exam prep — daughter has moved to a grand piano. Includes L-85 stand, sustain pedal, and original box. Perfect starter to intermediate instrument.</p>",
    keyDetails: [
      { key: "Brand",     value: "Yamaha P-125"             },
      { key: "Keys",      value: "88 — GHC weighted"        },
      { key: "Voices",    value: "24 (10 piano tones)"      },
      { key: "Condition", value: "Like new"                 },
    ],
    goodToKnow: [
      { key: "Includes",   value: "L-85 stand + sustain pedal" },
      { key: "Box",        value: "Original"                },
      { key: "Grade",      value: "Ideal for Grade 1–5"     },
      { key: "Collection", value: "Clapham SW4"             },
    ],
    coordinates: { lat: 51.4614, lng: -0.1380 },
    seller: SELLERS.alice,
  },
  {
    id: "music-keys-03", href: "/listings/music-keys-03", advId: "20013",
    images: [{ src: img(6), alt: "Nord Stage 3 88" }],
    priceLabel: "£1,800",
    title: "Nord Stage 3 88 — Fully Weighted, Piano + Organ + Synth, Flight Case",
    detailsLabel: "KEYBOARD • PROFESSIONAL • NORD",
    locationLabel: "Shoreditch, London",
    postedAt: hrsAgo(6),
    description: "<p>Immaculate <strong>Nord Stage 3 88</strong> — full triple-section instrument: Grand Piano (Nord Piano Library), Organ (B3/Vox/Farfisa emulations), and Synth (A1 engine). Used on a single album session. Custom flight case included. RRP £3,399.</p>",
    keyDetails: [
      { key: "Brand",     value: "Nord Stage 3 88"          },
      { key: "Sections",  value: "Piano + Organ + Synth"    },
      { key: "Keys",      value: "88 fully weighted"        },
      { key: "Condition", value: "Immaculate"               },
    ],
    goodToKnow: [
      { key: "RRP",        value: "£3,399"                  },
      { key: "Case",       value: "Custom flight case"      },
      { key: "Manuals",    value: "Printed + USB card"      },
      { key: "Collection", value: "Shoreditch E1"           },
    ],
    coordinates: { lat: 51.5267, lng: -0.0818 },
    seller: SELLERS.musicStore,
  },
];
