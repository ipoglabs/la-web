import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── gyms_fitness ───────────────────────────────────────────────────────────────
export const HEALTH_GYMS: MockListing[] = [
  {
    id: "hb-gym-01", href: "/listings/hb-gym-01", advId: "12001",
    images: [{ src: img(1), alt: "Gym interior" }],
    priceLabel: "£29.99",
    priceSuffix: "/ mo",
    title: "Premium Gym Membership — 24/7 Access, 5 Locations, No Contract",
    detailsLabel: "GYM & FITNESS • PREMIUM • LONDON",
    locationLabel: "5 London Locations",
    postedAt: hrsAgo(1),
    description: "<p>Join our growing network of <strong>premium gyms</strong> across London — £29.99/month for 24/7 access to all 5 sites. Over 100 weekly classes, free weights to 200kg, saunas, and dedicated PT areas. Cancel anytime.</p>",
    keyDetails: [
      { key: "Price",      value: "£29.99/month"          },
      { key: "Access",     value: "24/7 all 5 locations"  },
      { key: "Classes",    value: "100+ per week"         },
      { key: "Contract",   value: "No contract"           },
    ],
    goodToKnow: [
      { key: "Joining Fee",  value: "Waived (limited time)" },
      { key: "Guest Pass",   value: "2 free/month"          },
      { key: "Sauna",        value: "All sites"             },
      { key: "App",          value: "Class booking via app" },
    ],
    coordinates: { lat: 51.5033, lng: -0.0195 },
    seller: SELLERS.gymPro,
  },
  {
    id: "hb-gym-02", href: "/listings/hb-gym-02", advId: "12002",
    images: [{ src: img(2), alt: "Yoga studio" }],
    priceLabel: "£75",
    priceSuffix: "/ mo",
    title: "Hot Yoga Studio — Unlimited Classes, 5 Styles, Battersea",
    detailsLabel: "GYM & FITNESS • YOGA • BATTERSEA",
    locationLabel: "Battersea, London",
    postedAt: hrsAgo(4),
    description: "<p>London's leading <strong>hot yoga studio</strong> in Battersea. £75/month for unlimited classes across 5 styles — Bikram, Vinyasa, Yin, Power, and Restorative. All levels welcome. Showers, towel hire, and mat storage available.</p>",
    keyDetails: [
      { key: "Style",     value: "Hot Yoga (5 styles)"    },
      { key: "Membership", value: "Unlimited, £75/month"  },
      { key: "Schedule",  value: "35 classes/week"        },
      { key: "Levels",    value: "All levels welcome"     },
    ],
    goodToKnow: [
      { key: "Intro Offer", value: "2 weeks unlimited £30" },
      { key: "Kit",         value: "Towels from £2/class"  },
      { key: "Parking",     value: "NCP nearby"            },
      { key: "Showers",     value: "On-site, complimentary" },
    ],
    coordinates: { lat: 51.4796, lng: -0.1481 },
    seller: SELLERS.gymPro,
  },
  {
    id: "hb-gym-03", href: "/listings/hb-gym-03", advId: "12003",
    images: [{ src: img(3), alt: "CrossFit box" }],
    priceLabel: "£120",
    priceSuffix: "/ mo",
    title: "CrossFit Box — Unlimited WODs, Olympic Lifting, Foundations Course",
    detailsLabel: "GYM & FITNESS • CROSSFIT • SHOREDITCH",
    locationLabel: "Shoreditch, London",
    postedAt: daysAgo(2),
    description: "<p>Fully equipped <strong>CrossFit affiliate box</strong> in Shoreditch. Unlimited WODs, Olympic lifting, gymnastics, and endurance workouts. All-levels Foundations course required for beginners. Community-driven atmosphere.</p>",
    keyDetails: [
      { key: "Style",       value: "CrossFit + Olympic lifting" },
      { key: "Membership",  value: "Unlimited, £120/mo"        },
      { key: "Schedule",    value: "6am–8pm weekdays + weekends" },
      { key: "Foundations", value: "Required for new members"   },
    ],
    goodToKnow: [
      { key: "Foundations", value: "4-class intro, £60"        },
      { key: "Coaches",     value: "CF-L2 certified"           },
      { key: "Equipment",   value: "Rogue + Assault Bike"      },
      { key: "Trial",       value: "Free drop-in first class"  },
    ],
    coordinates: { lat: 51.5267, lng: -0.0818 },
    seller: SELLERS.gymPro,
  },
];

