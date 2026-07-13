import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── general_free ──────────────────────────────────────────────────────────────
export const FREE_GENERAL: MockListing[] = [
  {
    id: "free-gen-01", href: "/listings/free-gen-01", advId: "23051",
    images: [{ src: img(1), alt: "Moving boxes stack" }],
    priceLabel: "Free",
    title: "Moving Boxes 25 Medium/Large — FREE Collection Islington, By Friday",
    detailsLabel: "FREE • GENERAL • MOVING BOXES",
    locationLabel: "Islington, London",
    postedAt: hrsAgo(2),
    description: "<p>Free <strong>25 used moving boxes</strong> — mix of medium (40×30×30cm) and large (60×40×40cm). Just moved in, all boxes empty and clean. Will be recycled if not collected by Friday. Take all or as many as you need.</p>",
    keyDetails: [
      { key: "Qty",       value: "25 boxes"                  },
      { key: "Sizes",     value: "Medium + large"            },
      { key: "Condition", value: "Used once — clean"         },
      { key: "Urgency",   value: "By Friday"                 },
    ],
    goodToKnow: [
      { key: "Price",      value: "FREE — take all or some"  },
      { key: "Deadline",   value: "Recycled after Friday"    },
      { key: "Collection", value: "Islington N1"             },
      { key: "Contact",    value: "Message for address"      },
    ],
    coordinates: { lat: 51.5369, lng: -0.1027 },
    seller: SELLERS.giveawayPrivate,
  },
  {
    id: "free-gen-02", href: "/listings/free-gen-02", advId: "23052",
    images: [{ src: img(2), alt: "Bags of garden topsoil" }],
    priceLabel: "Free",
    title: "Garden Topsoil/Compost Mix — 10 Bags ~20L Each, FREE Collection Streatham",
    detailsLabel: "FREE • GENERAL • GARDEN SOIL",
    locationLabel: "Streatham, London",
    postedAt: daysAgo(2),
    description: "<p>Free <strong>10 bags of garden topsoil and compost</strong> (50/50 mix, ~20 litres per bag) — leftover from a landscaping project. Ideal for raised beds, borders, or pots. Left on the driveway — no need to knock, just take.</p>",
    keyDetails: [
      { key: "Items",     value: "10 bags topsoil/compost"   },
      { key: "Mix",       value: "50/50 topsoil + compost"   },
      { key: "Volume",    value: "~20 litres per bag"        },
      { key: "Access",    value: "On driveway — just take"   },
    ],
    goodToKnow: [
      { key: "Price",      value: "FREE"                     },
      { key: "Ideal for",  value: "Raised beds, pots, borders" },
      { key: "No knock",   value: "Take from driveway"       },
      { key: "Collection", value: "Streatham SW16"           },
    ],
    coordinates: { lat: 51.4280, lng: -0.1318 },
    seller: SELLERS.giveawayPrivate,
  },
  {
    id: "free-gen-03", href: "/listings/free-gen-03", advId: "23053",
    images: [{ src: img(3), alt: "Reader's Digest encyclopaedia set" }],
    priceLabel: "Free",
    title: "Reader's Digest Great Encyclopaedia 1975 — Complete 20-Volume Set, FREE",
    detailsLabel: "FREE • GENERAL • ENCYCLOPAEDIA",
    locationLabel: "Chiswick, London",
    postedAt: daysAgo(1),
    description: "<p>Free <strong>Reader's Digest Great Encyclopaedia 1975</strong> — complete 20-volume set in matching dark blue hardcovers. Excellent condition for age. A fascinating period piece and reference resource. Would suit a school, library, or vintage book collector.</p>",
    keyDetails: [
      { key: "Item",      value: "Reader's Digest Encyclopaedia" },
      { key: "Year",      value: "1975"                       },
      { key: "Volumes",   value: "20 — complete set"          },
      { key: "Condition", value: "Excellent for age"          },
    ],
    goodToKnow: [
      { key: "Price",      value: "FREE"                     },
      { key: "Ideal for",  value: "School, library, book lovers" },
      { key: "Postage",    value: "Not available — too heavy" },
      { key: "Collection", value: "Chiswick W4"              },
    ],
    coordinates: { lat: 51.4927, lng: -0.2613 },
    seller: SELLERS.giveawayPrivate,
  },
];
