import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── adoption ──────────────────────────────────────────────────────────────────
export const PETS_ADOPTION: MockListing[] = [
  {
    id: "pet-adopt-01", href: "/listings/pet-adopt-01", advId: "60011",
    images: [{ src: img(3), alt: "Rescue greyhound" }],
    priceLabel: "Donation",
    title: "Rescue Greyhound — Gentle Giant, 3 Yrs, House Trained, Ready",
    detailsLabel: "DOG • ADULT • GREYHOUND",
    locationLabel: "Battersea, London",
    postedAt: daysAgo(2),
    description: "<p>Meet <strong>Archie</strong>, a gentle 3-year-old greyhound looking for his forever home. House trained, great with adults and older children. Loves sofa snoozes and short walks. Home check required before adoption.</p>",
    keyDetails: [
      { key: "Animal",    value: "Dog — Greyhound"       },
      { key: "Age",       value: "3 years"               },
      { key: "Sex",       value: "Male, neutered"        },
      { key: "Condition", value: "Healthy, vaccinated"   },
    ],
    goodToKnow: [
      { key: "Home Check",  value: "Required"              },
      { key: "Children",    value: "Older children (8+)"   },
      { key: "Other Dogs",  value: "Cat-tested (individual)" },
      { key: "Adoption Fee", value: "Donation to rescue"   },
    ],
    coordinates: { lat: 51.4796, lng: -0.1481 },
    seller: SELLERS.pawsRescue,
  },
  {
    id: "pet-adopt-02", href: "/listings/pet-adopt-02", advId: "60012",
    images: [{ src: img(4), alt: "Rescue tabby cat" }],
    priceLabel: "£75",
    priceSuffix: "(adoption fee)",
    title: "Tabby Cat for Adoption — 2 Yr Old Female, Neutered, Vaccinated",
    detailsLabel: "CAT • ADULT • TABBY",
    locationLabel: "Hackney, London",
    postedAt: daysAgo(1),
    description: "<p>Lovely <strong>2-year-old female tabby cat</strong> looking for a quiet home. Neutered, vaccinated, microchipped, and flea/worm treated. Independent but affectionate once settled. No young children preferred.</p>",
    keyDetails: [
      { key: "Animal",   value: "Cat — Tabby"     },
      { key: "Age",      value: "2 years"         },
      { key: "Sex",      value: "Female, neutered" },
      { key: "Health",   value: "Fully vaccinated" },
    ],
    goodToKnow: [
      { key: "Home Check",    value: "Required"            },
      { key: "Children",      value: "No young children"   },
      { key: "Indoor/Outdoor", value: "Outdoor access pref." },
      { key: "Adoption Fee",  value: "£75 covers costs"   },
    ],
    coordinates: { lat: 51.5465, lng: -0.0554 },
    seller: SELLERS.pawsRescue,
  },
  {
    id: "pet-adopt-03", href: "/listings/pet-adopt-03", advId: "60013",
    images: [{ src: img(5), alt: "Rescue rabbits" }],
    priceLabel: "£30",
    priceSuffix: "(adoption fee)",
    title: "Bonded Rabbit Pair for Adoption — Neutered, Vaccinated, Hutch Avail.",
    detailsLabel: "SMALL ANIMAL • RABBIT • BONDED PAIR",
    locationLabel: "Croydon, London",
    postedAt: daysAgo(3),
    description: "<p>Adorable <strong>bonded rabbit pair</strong> (Lola + Biscuit) looking for a home together. Both neutered, vaccinated, and microchipped. Previous owner downsizing. Large wooden hutch and run available separately for £40.</p>",
    keyDetails: [
      { key: "Animals",  value: "2 rabbits (bonded pair)" },
      { key: "Age",      value: "1.5 years"              },
      { key: "Sex",      value: "Female + male, neutered" },
      { key: "Health",   value: "Vaccinated, chipped"    },
    ],
    goodToKnow: [
      { key: "Must Stay Together", value: "Bonded pair"          },
      { key: "Hutch",              value: "Available +£40"        },
      { key: "Home Check",         value: "Required"             },
      { key: "Adoption Fee",       value: "£30 covers vet costs"  },
    ],
    coordinates: { lat: 51.3762, lng: -0.0982 },
    seller: SELLERS.pawsRescue,
  },
];

