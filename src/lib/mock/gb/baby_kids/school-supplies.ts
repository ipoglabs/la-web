import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── school_supplies ────────────────────────────────────────────────────────────
export const BABY_SCHOOL_SUPPLIES: MockListing[] = [
  {
    id: "baby-school-01", href: "/listings/baby-school-01", advId: "15041",
    images: [{ src: img(7), alt: "School uniform bundle" }],
    priceLabel: "£20",
    title: "School Uniform Bundle Age 5-6 — 15 Items, Excellent Condition",
    detailsLabel: "SCHOOL SUPPLIES • EXCELLENT • AGE 5-6",
    locationLabel: "Richmond, London",
    postedAt: daysAgo(1),
    description: "<p>Complete <strong>school uniform bundle</strong> for a child aged 5–6. Includes: 5 shirts, 3 trousers, 3 polo shirts, PE kit, and 2 jumpers. All washed and in excellent condition — child changed school. John Lewis / M&S brands.</p>",
    keyDetails: [
      { key: "Quantity",  value: "15 items (full bundle)"  },
      { key: "Age",       value: "5–6 years"               },
      { key: "Includes",  value: "Uniform + PE kit"        },
      { key: "Condition", value: "Excellent"               },
    ],
    goodToKnow: [
      { key: "Brands",     value: "John Lewis, M&S"        },
      { key: "Washed",     value: "Yes"                    },
      { key: "Collection", value: "Richmond, TW9"          },
      { key: "Postage",    value: "Available (£5)"         },
    ],
    coordinates: { lat: 51.4613, lng: -0.3037 },
    seller: SELLERS.babyShop,
  },
  {
    id: "baby-school-02", href: "/listings/baby-school-02", advId: "15042",
    images: [{ src: img(8), alt: "School backpack and lunchbox" }],
    priceLabel: "£28",
    title: "Kids School Backpack + Lunchbox + Water Bottle Set — NEW, Dinosaur Print",
    detailsLabel: "SCHOOL SUPPLIES • NEW • BACKPACK SET",
    locationLabel: "Islington, London",
    postedAt: hrsAgo(3),
    description: "<p>Brand new, tagged <strong>school backpack + matching lunchbox + water bottle set</strong> in dinosaur print. Unwanted duplicate gift. Backpack has padded straps and name-label pocket. Age 3–7. All BPA-free.</p>",
    keyDetails: [
      { key: "Set",       value: "Backpack + lunchbox + bottle" },
      { key: "Print",     value: "Dinosaur (gender-neutral)"   },
      { key: "Age",       value: "3–7 years"                   },
      { key: "Condition", value: "Brand new, still tagged"     },
    ],
    goodToKnow: [
      { key: "BPA Free",   value: "Yes — all items"          },
      { key: "Collection", value: "Islington, N1"            },
      { key: "Postage",    value: "Available (£4.50 tracked)" },
      { key: "Gift",       value: "Still in gift packaging"  },
    ],
    coordinates: { lat: 51.5369, lng: -0.1027 },
    seller: SELLERS.alice,
  },
  {
    id: "baby-school-03", href: "/listings/baby-school-03", advId: "15043",
    images: [{ src: img(9), alt: "Kids stationery set" }],
    priceLabel: "£15",
    title: "Premium Kids Stationery Set — Colouring Pencils, Ruler, Scissors, Craft",
    detailsLabel: "SCHOOL SUPPLIES • NEW • STATIONERY",
    locationLabel: "Online (UK-wide)",
    postedAt: daysAgo(1),
    description: "<p>Beautiful boxed <strong>premium kids stationery set</strong> — 48 Faber-Castell colouring pencils, metal ruler, safety scissors, glue stick, eraser, and sharpener, all in a magnetic lid keepsake box. Perfect for back-to-school or a gift.</p>",
    keyDetails: [
      { key: "Includes",  value: "48 pencils + full set"   },
      { key: "Brand",     value: "Faber-Castell (pencils)" },
      { key: "Box",       value: "Magnetic lid keepsake"  },
      { key: "Condition", value: "New, in box"            },
    ],
    goodToKnow: [
      { key: "Delivery",  value: "UK-wide free over £20"  },
      { key: "Age",       value: "Suitable 5+"            },
      { key: "Gift Wrap",  value: "Available on request"  },
      { key: "Quantity",  value: "10 sets available"      },
    ],
    coordinates: { lat: 51.5134, lng: -0.1310 },
    seller: SELLERS.babyShop,
  },
];

