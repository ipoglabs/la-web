import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── designer_luxury ────────────────────────────────────────────────────────────
export const FASHION_DESIGNER: MockListing[] = [
  {
    id: "fash-des-01", href: "/listings/fash-des-01", advId: "19061",
    images: [{ src: img(1), alt: "Burberry trench" }],
    priceLabel: "£650",
    title: "Burberry Westminster Heritage Trench Coat — Honey, 14R, Excellent",
    detailsLabel: "DESIGNER LUXURY • EXCELLENT • BURBERRY",
    locationLabel: "Belgravia, London",
    postedAt: daysAgo(1),
    description: "<p>Iconic <strong>Burberry Westminster Heritage trench coat</strong> in honey, size UK 14 Regular. Double-breasted, gabardine cotton, detachable tartan lining. In excellent condition — dry-cleaned and stored. Burberry dust bag and receipt included.</p>",
    keyDetails: [
      { key: "Brand",     value: "Burberry Westminster"     },
      { key: "Colour",    value: "Honey"                    },
      { key: "Size",      value: "UK 14 Regular"            },
      { key: "Condition", value: "Excellent"                },
    ],
    goodToKnow: [
      { key: "Lining",     value: "Tartan, detachable"      },
      { key: "Cleaned",    value: "Dry-cleaned"             },
      { key: "Dust Bag",   value: "Burberry included"       },
      { key: "Receipt",    value: "Available"               },
    ],
    coordinates: { lat: 51.4952, lng: -0.1441 },
    seller: SELLERS.fashionBtq,
  },
  {
    id: "fash-des-02", href: "/listings/fash-des-02", advId: "19062",
    images: [{ src: img(7), alt: "Gucci Dionysus shoulder bag" }],
    priceLabel: "£480",
    title: "Gucci Dionysus Small Shoulder Bag — Dusty Pink, Like New",
    detailsLabel: "DESIGNER LUXURY • LIKE NEW • GUCCI",
    locationLabel: "Chelsea, London",
    postedAt: hrsAgo(5),
    description: "<p>Authentic <strong>Gucci Dionysus Small Shoulder Bag</strong> in dusty pink GG Supreme canvas. Used twice — perfect condition, zero scratches on hardware. Dust bag, cards, and receipt included.</p>",
    keyDetails: [
      { key: "Brand",     value: "Gucci"                  },
      { key: "Style",     value: "Dionysus Small"         },
      { key: "Material",  value: "GG Supreme canvas"      },
      { key: "Condition", value: "Like new — used twice"  },
    ],
    goodToKnow: [
      { key: "Authentication", value: "Receipt + cards incl."   },
      { key: "Dust Bag",       value: "Included"                },
      { key: "Offers",         value: "Open to sensible offers" },
      { key: "Collection",     value: "Chelsea preferred"        },
    ],
    coordinates: { lat: 51.4876, lng: -0.1749 },
    seller: SELLERS.fashionPrivate,
  },
  {
    id: "fash-des-03", href: "/listings/fash-des-03", advId: "19063",
    images: [{ src: img(8), alt: "Hermès Twilly" }],
    priceLabel: "£95",
    title: "Hermès Twilly Silk Scarf — Neon Jungle, Orange, New in Box",
    detailsLabel: "DESIGNER LUXURY • NEW • HERMÈS",
    locationLabel: "South Kensington, London",
    postedAt: daysAgo(1),
    description: "<p>Brand new, boxed <strong>Hermès Twilly</strong> in Neon Jungle print (orange/pink) — never unwrapped. Original Hermès orange box and ribbon intact. Purchased as a gift. The iconic Twilly works on bag handles, hair, or wrist. RRP £120.</p>",
    keyDetails: [
      { key: "Brand",     value: "Hermès Twilly"            },
      { key: "Print",     value: "Neon Jungle"              },
      { key: "Colour",    value: "Orange / pink"            },
      { key: "Condition", value: "New — in orange box"     },
    ],
    goodToKnow: [
      { key: "RRP",        value: "£120"                   },
      { key: "Box",        value: "Hermès orange box + ribbon" },
      { key: "Auth.",      value: "Receipt available"       },
      { key: "Collection", value: "South Kensington SW7"   },
    ],
    coordinates: { lat: 51.4954, lng: -0.1774 },
    seller: SELLERS.fashionPrivate,
  },
];

