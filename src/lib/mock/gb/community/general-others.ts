import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── general_others ─────────────────────────────────────────────────────────────
export const COMMUNITY_GENERAL: MockListing[] = [
  {
    id: "comm-gen-01", href: "/listings/comm-gen-01", advId: "80051",
    images: [{ src: img(8), alt: "Neighbours" }],
    priceLabel: "FREE",
    title: "Free Soil & Compost — Garden Clearance, Must Collect Streatham",
    detailsLabel: "GENERAL • FREE • STREATHAM",
    locationLabel: "Streatham, London",
    postedAt: hrsAgo(3),
    description: "<p>Giving away approximately <strong>10 bags of garden soil and compost</strong> from a recent garden clearance. Mix of topsoil and homemade compost — great for vegetable beds. Must collect — bags not supplied, bring your own or a trailer.</p>",
    keyDetails: [
      { key: "Item",      value: "Garden soil & compost"  },
      { key: "Quantity",  value: "~10 bags worth"         },
      { key: "Collection", value: "Must collect"          },
      { key: "Cost",      value: "FREE"                   },
    ],
    goodToKnow: [
      { key: "Bags",      value: "Not supplied — bring own" },
      { key: "Loading",   value: "Help available"           },
      { key: "Timing",    value: "Weekend collection pref." },
      { key: "Contact",   value: "Message to arrange"       },
    ],
    coordinates: { lat: 51.4269, lng: -0.1248 },
    seller: SELLERS.alice,
  },
  {
    id: "comm-gen-02", href: "/listings/comm-gen-02", advId: "80052",
    images: [{ src: img(9), alt: "Skill share" }],
    priceLabel: "FREE",
    title: "Skill Share: Will Teach Guitar, Learn Spanish in Return — Hackney",
    detailsLabel: "GENERAL • SKILL SHARE • HACKNEY",
    locationLabel: "Hackney, London",
    postedAt: daysAgo(1),
    description: "<p>Looking to <strong>swap skills</strong> — I can teach beginner/intermediate acoustic guitar (10+ years playing) in exchange for Spanish conversation practice. Happy to meet weekly in Hackney. Completely free — just mutual time and enthusiasm!</p>",
    keyDetails: [
      { key: "Offering",  value: "Guitar lessons (beg/int)" },
      { key: "Seeking",   value: "Spanish conversation"     },
      { key: "Location",  value: "Hackney, E8"              },
      { key: "Cost",      value: "FREE — skill swap only"   },
    ],
    goodToKnow: [
      { key: "Frequency", value: "Weekly, 1 hour each way" },
      { key: "Level",     value: "Beginner Spanish ok"     },
      { key: "Format",    value: "In person or café"        },
      { key: "Contact",   value: "Message to arrange"      },
    ],
    coordinates: { lat: 51.5478, lng: -0.0759 },
    seller: SELLERS.dave,
  },
  {
    id: "comm-gen-03", href: "/listings/comm-gen-03", advId: "80053",
    images: [{ src: img(1), alt: "Neighbour notice" }],
    priceLabel: "FREE",
    title: "Parking Space Swap Needed — Islington Resident, NCP to Residential",
    detailsLabel: "GENERAL • NOTICE • ISLINGTON",
    locationLabel: "Islington, London",
    postedAt: daysAgo(2),
    description: "<p>Islington resident currently in NCP looking to <strong>swap or sublet a residential parking permit space</strong>. Happy to pay a reasonable monthly fee. Need something near Upper Street / Angel area. Any leads massively appreciated.</p>",
    keyDetails: [
      { key: "Seeking",   value: "Residential parking space" },
      { key: "Area",      value: "Upper Street / Angel, N1"  },
      { key: "Budget",    value: "Reasonable monthly fee"    },
      { key: "Timing",    value: "ASAP"                      },
    ],
    goodToKnow: [
      { key: "Type",     value: "Any — driveway / garage"   },
      { key: "Vehicle",  value: "Standard hatchback"        },
      { key: "Contact",  value: "Message via LokalAds"      },
      { key: "Swap",     value: "NCP permit avail. to swap" },
    ],
    coordinates: { lat: 51.5369, lng: -0.1027 },
    seller: SELLERS.alice,
  },
];

