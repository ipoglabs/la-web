import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── wind_brass_strings ─────────────────────────────────────────────────────────
export const MUSIC_WIND: MockListing[] = [
  {
    id: "music-wind-01", href: "/listings/music-wind-01", advId: "20041",
    images: [{ src: img(4), alt: "Yamaha YFL-222 student flute" }],
    priceLabel: "£160",
    title: "Yamaha YFL-222 Student Flute — Silver-Plated, Offset G, Hard Case",
    detailsLabel: "WIND • FLUTE • YAMAHA",
    locationLabel: "Chiswick, London",
    postedAt: daysAgo(2),
    description: "<p>Excellent condition <strong>Yamaha YFL-222 student flute</strong> — silver-plated nickel body, offset G key, split E mechanism. Used by my daughter to Grade 5 before upgrading. Regular serviced. Includes original hard case and polishing cloth.</p>",
    keyDetails: [
      { key: "Brand",     value: "Yamaha YFL-222"           },
      { key: "Material",  value: "Silver-plated nickel"     },
      { key: "Keys",      value: "Offset G, split E"        },
      { key: "Condition", value: "Excellent — serviced"     },
    ],
    goodToKnow: [
      { key: "Grade",      value: "Ideal Grade 1–6"         },
      { key: "Case",       value: "Original hard case"      },
      { key: "Extras",     value: "Cleaning cloth included" },
      { key: "Collection", value: "Chiswick W4"             },
    ],
    coordinates: { lat: 51.4927, lng: -0.2613 },
    seller: SELLERS.alice,
  },
  {
    id: "music-wind-02", href: "/listings/music-wind-02", advId: "20042",
    images: [{ src: img(5), alt: "Conn-Selmer Bb clarinet" }],
    priceLabel: "£95",
    title: "Conn-Selmer Prelude CL711 Bb Clarinet — Like New, 3 Months Use",
    detailsLabel: "WIND • CLARINET • CONN-SELMER",
    locationLabel: "Wimbledon, London",
    postedAt: daysAgo(1),
    description: "<p>Like-new <strong>Conn-Selmer Prelude CL711 Bb clarinet</strong> — ABS body, nickel-plated keys. Used by my son for 3 months at school before switching to trumpet. Includes original case, two Vandoren reeds, and cork grease.</p>",
    keyDetails: [
      { key: "Brand",     value: "Conn-Selmer Prelude CL711" },
      { key: "Body",      value: "ABS resin"                 },
      { key: "Keys",      value: "Nickel-plated"             },
      { key: "Condition", value: "Like new — 3 months"       },
    ],
    goodToKnow: [
      { key: "Includes",   value: "Case + reeds + cork grease" },
      { key: "Age",        value: "3 months"                },
      { key: "Collection", value: "Wimbledon SW19"          },
      { key: "Postage",    value: "Available £5"            },
    ],
    coordinates: { lat: 51.4213, lng: -0.2062 },
    seller: SELLERS.dave,
  },
  {
    id: "music-wind-03", href: "/listings/music-wind-03", advId: "20043",
    images: [{ src: img(6), alt: "3/4 student violin outfit" }],
    priceLabel: "£75",
    title: "3/4 Student Violin Outfit — Bow, Shoulder Rest, Rosin, Case, Set Up",
    detailsLabel: "STRINGS • VIOLIN • 3/4 STUDENT OUTFIT",
    locationLabel: "Islington, London",
    postedAt: hrsAgo(8),
    description: "<p>Complete <strong>3/4 student violin outfit</strong> for a child aged 7–10 (approx). Solid spruce top, maple back and sides. Includes Brazilwood bow, shoulder rest, rosin, and oblong foam case. Bridge adjusted by our in-house luthier — ready to play.</p>",
    keyDetails: [
      { key: "Size",       value: "3/4"                     },
      { key: "Top",        value: "Solid spruce"            },
      { key: "Bow",        value: "Brazilwood"              },
      { key: "Condition",  value: "Good — luthier set up"   },
    ],
    goodToKnow: [
      { key: "Age range",  value: "Approx 7–10 years"       },
      { key: "Includes",   value: "Bow + rosin + shoulder rest + case" },
      { key: "Setup",      value: "Bridge adjusted"         },
      { key: "Collection", value: "Islington N1"            },
    ],
    coordinates: { lat: 51.5369, lng: -0.1027 },
    seller: SELLERS.musicStore,
  },
];
