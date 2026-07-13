import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── lost_found ─────────────────────────────────────────────────────────────────
export const PETS_LOST_FOUND: MockListing[] = [
  {
    id: "pet-lost-01", href: "/listings/pet-lost-01", advId: "60041",
    images: [{ src: img(7), alt: "Lost cat" }],
    priceLabel: "£200 Reward",
    title: "LOST CAT — Black & White Tom, Balham, Missing Since 24 Jun",
    detailsLabel: "LOST PET • CAT • BALHAM",
    locationLabel: "Balham, London",
    postedAt: hrsAgo(4),
    description: "<p>Our black and white tomcat <strong>'Oreo'</strong> has been missing since 24 June from Balham SW12. Neutered male, 3 years old. Blue collar, no tag. Microchipped — chip no. 985112345678. Please contact if seen.</p>",
    keyDetails: [
      { key: "Animal",    value: "Cat — male, neutered"   },
      { key: "Colour",    value: "Black and white"        },
      { key: "Missing",   value: "Since 24 June 2026"     },
      { key: "Chip",      value: "Yes — 985112345678"     },
    ],
    goodToKnow: [
      { key: "Reward",    value: "£200 for safe return"  },
      { key: "Collar",    value: "Blue collar, no tag"   },
      { key: "Area",      value: "Balham SW12"           },
      { key: "Contact",   value: "Message immediately"   },
    ],
    coordinates: { lat: 51.4430, lng: -0.1524 },
    seller: SELLERS.alice,
  },
  {
    id: "pet-lost-02", href: "/listings/pet-lost-02", advId: "60042",
    images: [{ src: img(8), alt: "Found dog" }],
    priceLabel: "FREE",
    title: "FOUND DOG — Small Brown Terrier Mix, Wandsworth Common, 25 Jun",
    detailsLabel: "FOUND PET • DOG • WANDSWORTH",
    locationLabel: "Wandsworth, London",
    postedAt: hrsAgo(6),
    description: "<p>Found a <strong>small brown terrier-mix</strong> on Wandsworth Common on 25 June, approx. 11am. No collar or tag. Friendly and well cared for. Currently safe with us — please contact if this is your dog. Will require proof of ownership.</p>",
    keyDetails: [
      { key: "Animal",   value: "Dog — small terrier mix" },
      { key: "Colour",   value: "Brown, short coat"       },
      { key: "Found",    value: "25 June 2026, 11am"      },
      { key: "Location", value: "Wandsworth Common SW18"  },
    ],
    goodToKnow: [
      { key: "Collar",    value: "None when found"         },
      { key: "Chip",      value: "Being scanned at vet"    },
      { key: "Proof",     value: "Ownership proof required" },
      { key: "Contact",   value: "Message via LokalAds"   },
    ],
    coordinates: { lat: 51.4562, lng: -0.1875 },
    seller: SELLERS.dave,
  },
  {
    id: "pet-lost-03", href: "/listings/pet-lost-03", advId: "60043",
    images: [{ src: img(9), alt: "Lost parrot" }],
    priceLabel: "£100 Reward",
    title: "LOST PARROT — African Grey, 'Monty', Islington, Missing 23 Jun",
    detailsLabel: "LOST PET • BIRD • ISLINGTON",
    locationLabel: "Islington, London",
    postedAt: daysAgo(3),
    description: "<p>Our beloved <strong>African Grey parrot 'Monty'</strong> flew out of an open window on 23 June in Islington. Very tame, speaks clearly, responds to his name. Ring on right leg — red band. Please call immediately if spotted.</p>",
    keyDetails: [
      { key: "Animal",  value: "African Grey Parrot"    },
      { key: "Name",    value: "Monty"                  },
      { key: "Missing", value: "Since 23 June 2026"     },
      { key: "Ring",    value: "Red band, right leg"    },
    ],
    goodToKnow: [
      { key: "Reward",   value: "£100 for safe return"  },
      { key: "Speaks",   value: "Talks clearly"         },
      { key: "Area",     value: "Islington N1"          },
      { key: "Contact",  value: "Message immediately"   },
    ],
    coordinates: { lat: 51.5369, lng: -0.1027 },
    seller: SELLERS.alice,
  },
];

