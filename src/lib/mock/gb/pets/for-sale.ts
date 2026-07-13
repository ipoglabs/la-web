import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── for_sale ──────────────────────────────────────────────────────────────────
export const PETS_FOR_SALE: MockListing[] = [
  {
    id: "pet-sale-01", href: "/listings/pet-sale-01", advId: "60001",
    images: [{ src: img(1), alt: "Golden Retriever puppy" }],
    priceLabel: "£1,200",
    title: "KC Reg Golden Retriever Puppies — 2 Girls Left, Ready Now",
    detailsLabel: "DOG • PUPPY • GOLDEN RETRIEVER",
    locationLabel: "Chessington, Surrey",
    postedAt: hrsAgo(3),
    description: "<p>Beautiful <strong>KC Registered Golden Retriever puppies</strong> — 2 girls remaining from a litter of 6. Both parents health-tested (hip/elbow/eyes). Microchipped, first vaccinations, vet-checked, and Puppy Pack included.</p>",
    keyDetails: [
      { key: "Breed",       value: "Golden Retriever"     },
      { key: "Age",         value: "8 weeks — ready now"  },
      { key: "Sex",         value: "2 females available"  },
      { key: "KC Reg",      value: "Yes — pedigree"       },
    ],
    goodToKnow: [
      { key: "Health Tests",  value: "Hips, elbows, eyes" },
      { key: "Vaccinated",    value: "First vaccines done" },
      { key: "Microchipped",  value: "Yes"                },
      { key: "Viewing",       value: "By appointment only" },
    ],
    coordinates: { lat: 51.3594, lng: -0.3005 },
    seller: SELLERS.pawsLove,
  },
  {
    id: "pet-sale-02", href: "/listings/pet-sale-02", advId: "60002",
    images: [{ src: img(2), alt: "Bengal kittens" }],
    priceLabel: "£800",
    title: "TICA Registered Bengal Kittens — Rosetted, Stunning Markings",
    detailsLabel: "CAT • KITTEN • BENGAL",
    locationLabel: "Croydon, Surrey",
    postedAt: hrsAgo(6),
    description: "<p>Striking <strong>TICA Registered Bengal kittens</strong> — rosetted marbling, golden and brown coats. Raised with children and other cats. Both parents on premises — F4 generation. Vaccinated, microchipped, and vet-checked.</p>",
    keyDetails: [
      { key: "Breed",      value: "Bengal (F4)"       },
      { key: "Age",        value: "11 weeks"          },
      { key: "TICA Reg",   value: "Yes"               },
      { key: "Pattern",    value: "Rosetted"          },
    ],
    goodToKnow: [
      { key: "Vaccinated",   value: "Yes — course done"    },
      { key: "Microchipped", value: "Yes"                  },
      { key: "Both Parents", value: "On premises to view"  },
      { key: "Viewing",      value: "By appointment only"  },
    ],
    coordinates: { lat: 51.3762, lng: -0.0982 },
    seller: SELLERS.pawsLove,
  },
  {
    id: "pet-sale-03", href: "/listings/pet-sale-03", advId: "60003",
    images: [{ src: img(3), alt: "Bearded dragon lizard" }],
    priceLabel: "£180",
    title: "Bearded Dragon + Full Vivarium Setup — 2yr Male, Tame & Handleable",
    detailsLabel: "REPTILE • ADULT • BEARDED DRAGON",
    locationLabel: "Lewisham, London",
    postedAt: daysAgo(2),
    description: "<p>Selling <strong>'Sunny'</strong>, a 2-year-old male bearded dragon with complete 4ft vivarium setup. Full UVB lighting, basking lamp, thermostat, hides, and 3 months' worth of food included. Fully tame and loves handling.</p>",
    keyDetails: [
      { key: "Animal",   value: "Bearded Dragon, male" },
      { key: "Age",      value: "2 years"              },
      { key: "Includes", value: "4ft vivarium + all kit" },
      { key: "Tame",     value: "Yes — loves handling"  },
    ],
    goodToKnow: [
      { key: "Reason",     value: "Relocating abroad"       },
      { key: "Food",       value: "3 months supply included" },
      { key: "Collection", value: "Lewisham, SE13"          },
      { key: "Viewing",    value: "Welcome, by arrangement" },
    ],
    coordinates: { lat: 51.4613, lng: -0.0116 },
    seller: SELLERS.dave,
  },
];

