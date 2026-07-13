import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── diy_tools ───────────────────────────────────────────────────────────────────
export const HOME_DIY: MockListing[] = [
  {
    id: "home-diy-01", href: "/listings/home-diy-01", advId: "18071",
    images: [{ src: img(9), alt: "DeWalt drill set" }],
    priceLabel: "£180",
    title: "DeWalt 18V XR Combi Drill + Impact Driver — 2 Batteries, TSTAK Box",
    detailsLabel: "DIY & TOOLS • EXCELLENT • DEWALT 18V",
    locationLabel: "Croydon, London",
    postedAt: daysAgo(1),
    description: "<p>Great condition <strong>DeWalt 18V XR brushless twin pack</strong> — DCD796 combi drill and DCF887 impact driver. 2×5Ah batteries, fast charger, and full TSTAK case. Used for a single renovation project — like new.</p>",
    keyDetails: [
      { key: "Brand",     value: "DeWalt 18V XR Brushless"  },
      { key: "Items",     value: "Combi drill + impact driver" },
      { key: "Batteries", value: "2× 5Ah"                   },
      { key: "Condition", value: "Excellent"                 },
    ],
    goodToKnow: [
      { key: "Case",       value: "TSTAK box included"      },
      { key: "Charger",    value: "Fast charger included"   },
      { key: "Bit Set",    value: "40-piece bit set incl."  },
      { key: "Collection", value: "Croydon CR0"             },
    ],
    coordinates: { lat: 51.3762, lng: -0.0982 },
    seller: SELLERS.homeStore,
  },
  {
    id: "home-diy-02", href: "/listings/home-diy-02", advId: "18072",
    images: [{ src: img(1), alt: "Kärcher pressure washer" }],
    priceLabel: "£120",
    title: "Kärcher K5 Full Control Pressure Washer + Patio Cleaner Attachment",
    detailsLabel: "DIY & TOOLS • GOOD • PRESSURE WASHER",
    locationLabel: "Richmond, London",
    postedAt: daysAgo(1),
    description: "<p><strong>Kärcher K5 Full Control pressure washer</strong> with patio cleaner and T-Racer surface cleaner attachments. 145 bar / 500L/hr. Good condition — some exterior surface marks but motor runs perfectly. 2 seasons of use.</p>",
    keyDetails: [
      { key: "Brand",     value: "Kärcher K5 Full Control" },
      { key: "Pressure",  value: "145 bar max"             },
      { key: "Flow",      value: "500 L/hr"                },
      { key: "Includes",  value: "Patio cleaner + T-Racer" },
    ],
    goodToKnow: [
      { key: "Condition", value: "Good — motor functional" },
      { key: "Marks",     value: "Some exterior surface"    },
      { key: "Collection", value: "Richmond TW9"           },
      { key: "Delivery",  value: "Not available"           },
    ],
    coordinates: { lat: 51.4613, lng: -0.3037 },
    seller: SELLERS.homePrivate,
  },
  {
    id: "home-diy-03", href: "/listings/home-diy-03", advId: "18073",
    images: [{ src: img(2), alt: "Bosch laser level" }],
    priceLabel: "£85",
    title: "Bosch GLL 3-80 CG Green Cross-Line Laser Level — Self-Levelling, Like New",
    detailsLabel: "DIY & TOOLS • LIKE NEW • LASER LEVEL",
    locationLabel: "Hackney, London",
    postedAt: hrsAgo(6),
    description: "<p>Like-new <strong>Bosch GLL 3-80 CG self-levelling 360° cross-line laser level</strong>. Green beam 4× brighter than red — 30m working range (120m with detector). Used for one kitchen tile job. Hard carry case + tripod adaptor included.</p>",
    keyDetails: [
      { key: "Model",     value: "Bosch GLL 3-80 CG"        },
      { key: "Range",     value: "30m (120m with detector)" },
      { key: "Beam",      value: "Green cross-line"         },
      { key: "Levelling", value: "Self-levelling"           },
    ],
    goodToKnow: [
      { key: "Case",       value: "Hard carry case"         },
      { key: "Tripod",     value: "Universal adaptor incl." },
      { key: "Batteries",  value: "AA included"             },
      { key: "Collection", value: "Hackney E8"              },
    ],
    coordinates: { lat: 51.5478, lng: -0.0759 },
    seller: SELLERS.dave,
  },
];

