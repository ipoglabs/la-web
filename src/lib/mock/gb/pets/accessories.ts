import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── accessories ───────────────────────────────────────────────────────────────
export const PETS_ACCESSORIES: MockListing[] = [
  {
    id: "pet-acc-01", href: "/listings/pet-acc-01", advId: "60031",
    images: [{ src: img(6), alt: "Dog crate" }],
    priceLabel: "£45",
    title: "Large Dog Crate 42\" — Heavy Duty, Removable Tray, Like New",
    detailsLabel: "PET ACCESSORIES • LIKE NEW • DOG CRATE",
    locationLabel: "Enfield, London",
    postedAt: daysAgo(1),
    description: "<p>Sturdy <strong>42-inch heavy-duty dog crate</strong> with removable plastic tray and dual door entry (front and side). Used for a few months during puppy training — dog now too sociable for crating. Very clean condition.</p>",
    keyDetails: [
      { key: "Item",      value: "42\" dog crate"          },
      { key: "Material",  value: "Heavy-duty steel"        },
      { key: "Doors",     value: "Front + side entry"      },
      { key: "Condition", value: "Like new — lightly used" },
    ],
    goodToKnow: [
      { key: "Tray",       value: "Removable, included" },
      { key: "Folds",      value: "Yes — flat fold"     },
      { key: "Collection", value: "Enfield, N18"        },
      { key: "Postage",    value: "Not available"       },
    ],
    coordinates: { lat: 51.6524, lng: -0.0742 },
    seller: SELLERS.petShop,
  },
  {
    id: "pet-acc-02", href: "/listings/pet-acc-02", advId: "60032",
    images: [{ src: img(7), alt: "Cat tree and scratcher" }],
    priceLabel: "£55",
    title: "Tall Cat Tree & Scratcher — 170cm, Multi-Level, Like New",
    detailsLabel: "PET ACCESSORIES • LIKE NEW • CAT TREE",
    locationLabel: "Highbury, London",
    postedAt: hrsAgo(5),
    description: "<p>Sturdy <strong>170cm multi-level cat tree</strong> with 3 platforms, 2 hammocks, sisal scratching posts, and dangling toys. Used for 4 months by one cat. Minimal wear — some light scratch marks on sisal only.</p>",
    keyDetails: [
      { key: "Item",      value: "Cat tree + scratcher"    },
      { key: "Height",    value: "170cm"                   },
      { key: "Features",  value: "3 platforms, 2 hammocks" },
      { key: "Condition", value: "Like new"                },
    ],
    goodToKnow: [
      { key: "Scratching",  value: "Sisal posts"             },
      { key: "Age",         value: "4 months use"            },
      { key: "Collection",  value: "Highbury, N5"            },
      { key: "Dismantle",   value: "Yes — for transport"     },
    ],
    coordinates: { lat: 51.5520, lng: -0.0990 },
    seller: SELLERS.petShop,
  },
  {
    id: "pet-acc-03", href: "/listings/pet-acc-03", advId: "60033",
    images: [{ src: img(8), alt: "Fish tank aquarium" }],
    priceLabel: "£120",
    title: "Juwel Lido 120 Aquarium + Full Setup — Filter, Light, Stand",
    detailsLabel: "PET ACCESSORIES • GOOD • FISH TANK",
    locationLabel: "Ealing, London",
    postedAt: daysAgo(2),
    description: "<p>Complete <strong>Juwel Lido 120 litre aquarium</strong> including internal filter, LED lighting, heater, thermometer, gravel, and wooden stand. Used 2 years for tropical fish. Thoroughly cleaned and ready to go.</p>",
    keyDetails: [
      { key: "Item",      value: "Juwel Lido 120"            },
      { key: "Volume",    value: "120 litres"                },
      { key: "Includes",  value: "Filter, light, heater, stand" },
      { key: "Condition", value: "Good — fully cleaned"      },
    ],
    goodToKnow: [
      { key: "Collection", value: "Ealing, W5 — essential"  },
      { key: "Delivery",   value: "Not available"           },
      { key: "Help",       value: "Help loading available"  },
      { key: "Gravel",     value: "Included"               },
    ],
    coordinates: { lat: 51.5130, lng: -0.3016 },
    seller: SELLERS.petShop,
  },
];

