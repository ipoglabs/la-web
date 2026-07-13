import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── wanted ────────────────────────────────────────────────────────────────────
export const PETS_WANTED: MockListing[] = [
  {
    id: "pet-want-01", href: "/listings/pet-want-01", advId: "60051",
    images: [{ src: img(8), alt: "Wanted puppy" }],
    priceLabel: "Budget: £500",
    title: "WANTED: Small Dog — Shih Tzu / Cavalier / Bichon, Family Home",
    detailsLabel: "WANTED • DOG • SMALL BREED",
    locationLabel: "South West London",
    postedAt: daysAgo(1),
    description: "<p>Loving family looking to adopt or purchase a small dog — Shih Tzu, Cavalier King Charles Spaniel, or Bichon Frise. Budget up to £500. Prepared to consider rescue or rehome. Children aged 6 and 8 in home.</p>",
    keyDetails: [
      { key: "Breed",    value: "Shih Tzu / Cavalier / Bichon" },
      { key: "Budget",   value: "Up to £500"                   },
      { key: "Children", value: "Yes — ages 6 and 8"           },
      { key: "Garden",   value: "Enclosed garden available"    },
    ],
    goodToKnow: [
      { key: "Rescue",    value: "Open to adoption"        },
      { key: "Experience", value: "Previous dog owners"    },
      { key: "Timing",    value: "Ready immediately"       },
      { key: "Contact",   value: "Message via LokalAds"   },
    ],
    coordinates: { lat: 51.4613, lng: -0.2313 },
    seller: SELLERS.alice,
  },
  {
    id: "pet-want-02", href: "/listings/pet-want-02", advId: "60052",
    images: [{ src: img(9), alt: "Wanted rabbit" }],
    priceLabel: "Budget: £50",
    title: "WANTED: Rehome Rabbit — Single or Pair, Outdoor Setup Ready",
    detailsLabel: "WANTED • RABBIT • EAST LONDON",
    locationLabel: "Stratford, London",
    postedAt: daysAgo(2),
    description: "<p>Family looking to rehome a rabbit or bonded pair. We have a large outdoor hutch and enclosed run ready. Children aged 9 and 11 very excited. Happy to pay a small rehoming fee. Previous rabbit owners.</p>",
    keyDetails: [
      { key: "Animal",   value: "Rabbit (any breed)"       },
      { key: "Budget",   value: "Up to £50 rehoming fee"   },
      { key: "Setup",    value: "Hutch + run ready"         },
      { key: "Children", value: "Ages 9 and 11"             },
    ],
    goodToKnow: [
      { key: "Experience", value: "Previous rabbit owners" },
      { key: "Garden",     value: "Enclosed garden"        },
      { key: "Timing",     value: "Ready immediately"      },
      { key: "Contact",    value: "Message via LokalAds"   },
    ],
    coordinates: { lat: 51.5415, lng: 0.0043 },
    seller: SELLERS.dave,
  },
  {
    id: "pet-want-03", href: "/listings/pet-want-03", advId: "60053",
    images: [{ src: img(1), alt: "Wanted fish tank" }],
    priceLabel: "Budget: £150",
    title: "WANTED: Second-Hand Aquarium Setup — 60L+, Tropical, London",
    detailsLabel: "WANTED • AQUARIUM • NORTH LONDON",
    locationLabel: "North London",
    postedAt: daysAgo(1),
    description: "<p>Looking for a <strong>second-hand tropical aquarium setup</strong> — 60 litres or larger. Must include filter and heater. Buying for a 10-year-old who is passionate about fishkeeping. Budget £150 including collection.</p>",
    keyDetails: [
      { key: "Item",    value: "Tropical aquarium 60L+"  },
      { key: "Budget", value: "£150 inc. collection"     },
      { key: "Must",   value: "Filter + heater included" },
      { key: "Area",   value: "North London preferred"   },
    ],
    goodToKnow: [
      { key: "Collection", value: "Can collect by car"   },
      { key: "Timing",     value: "ASAP"                 },
      { key: "Condition",  value: "Good condition req."  },
      { key: "Contact",    value: "Message via LokalAds" },
    ],
    coordinates: { lat: 51.5650, lng: -0.1022 },
    seller: SELLERS.alice,
  },
];

