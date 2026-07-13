import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── sofas_seating ──────────────────────────────────────────────────────────────
export const HOME_SOFAS: MockListing[] = [
  {
    id: "home-sofa-01", href: "/listings/home-sofa-01", advId: "18001",
    images: [{ src: img(1), alt: "Corner sofa" }],
    priceLabel: "£1,200",
    title: "DFS Grey Corner Sofa — L-Shape, 5-Seat, Excellent Condition",
    detailsLabel: "SOFAS & SEATING • EXCELLENT • CORNER SOFA",
    locationLabel: "Bromley, London",
    postedAt: hrsAgo(3),
    description: "<p>Stunning <strong>DFS large L-shaped corner sofa</strong> in mid-grey fabric (5-seat configuration). Left-hand chaise. Removable seat cushion covers — all washed. Purchased 2024, barely used spare room. Non-smoking, pet-free home.</p>",
    keyDetails: [
      { key: "Brand",     value: "DFS (large L-shape)"      },
      { key: "Config",    value: "5-seat LH chaise"         },
      { key: "Colour",    value: "Mid-grey fabric"          },
      { key: "Condition", value: "Excellent — 2024"         },
    ],
    goodToKnow: [
      { key: "Smoke Free", value: "Yes"                     },
      { key: "Pet Free",   value: "Yes"                     },
      { key: "Dismantle",  value: "Yes — for doorways"      },
      { key: "Collection", value: "Bromley — van needed"    },
    ],
    coordinates: { lat: 51.4059, lng: 0.0152 },
    seller: SELLERS.homePrivate,
  },
  {
    id: "home-sofa-02", href: "/listings/home-sofa-02", advId: "18002",
    images: [{ src: img(2), alt: "IKEA KIVIK sofa and armchair" }],
    priceLabel: "£650",
    title: "IKEA KIVIK 3-Seat Sofa + Armchair — Light Grey, Good Cond.",
    detailsLabel: "SOFAS & SEATING • GOOD • SOFA SET",
    locationLabel: "Hammersmith, London",
    postedAt: daysAgo(1),
    description: "<p>Well-maintained <strong>IKEA KIVIK 3-seater sofa + matching armchair</strong> in light grey. Removable/washable covers. Bought 2023, moving and no longer needed. Non-smoking, no pet home.</p>",
    keyDetails: [
      { key: "Item",      value: "3-seat sofa + armchair" },
      { key: "Brand",     value: "IKEA KIVIK"             },
      { key: "Colour",    value: "Light grey"             },
      { key: "Condition", value: "Good — minor wear"      },
    ],
    goodToKnow: [
      { key: "Age",        value: "3 years"           },
      { key: "Pet Free",   value: "Yes"               },
      { key: "Smoke Free", value: "Yes"               },
      { key: "Collection", value: "Hammersmith only"  },
    ],
    coordinates: { lat: 51.4921, lng: -0.2233 },
    seller: SELLERS.homePrivate,
  },
  {
    id: "home-sofa-03", href: "/listings/home-sofa-03", advId: "18003",
    images: [{ src: img(3), alt: "JL 2-seater compact sofa" }],
    priceLabel: "£290",
    title: "John Lewis Hendricks 2-Seater Sofa — Mustard Velvet, 155cm, Excellent",
    detailsLabel: "SOFAS & SEATING • EXCELLENT • 2-SEATER",
    locationLabel: "Shoreditch, London",
    postedAt: daysAgo(1),
    description: "<p>John Lewis <strong>Hendricks 2-seater compact sofa</strong> in mustard yellow velvet. 155cm wide — perfect for smaller flats and studios. Excellent condition — 2 years, non-smoking, no pets. Moving into a studio.</p>",
    keyDetails: [
      { key: "Brand",    value: "John Lewis Hendricks"       },
      { key: "Size",     value: "2-seat, 155cm wide"         },
      { key: "Colour",   value: "Mustard velvet"             },
      { key: "Condition", value: "Excellent — 2 years"      },
    ],
    goodToKnow: [
      { key: "Smoke Free", value: "Yes"                     },
      { key: "Pet Free",   value: "Yes"                     },
      { key: "Dismantle", value: "Legs only"                },
      { key: "Collection", value: "Shoreditch E1"           },
    ],
    coordinates: { lat: 51.5267, lng: -0.0818 },
    seller: SELLERS.homePrivate,
  },
];

