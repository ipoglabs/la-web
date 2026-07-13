import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── wanted ────────────────────────────────────────────────────────────────────
export const SERVICES_WANTED: MockListing[] = [
  {
    id: "svc-want-01", href: "/listings/svc-want-01", advId: "40091",
    images: [{ src: img(5), alt: "Seeking service" }],
    priceLabel: "Budget: £2,000",
    title: "SEEKING: Local Garden Landscaper — Small Urban Garden, ASAP",
    detailsLabel: "WANTED • GARDENING • SOUTH LONDON",
    locationLabel: "Clapham, London",
    postedAt: hrsAgo(7),
    description: "<p>Homeowner in Clapham looking for a <strong>local garden landscaper / designer</strong> to transform a 20ft×15ft urban back garden. Budget around £2,000. Looking for quotes — must have photos of previous work.</p>",
    keyDetails: [
      { key: "Service Needed", value: "Garden landscaping"    },
      { key: "Budget",         value: "Around £2,000"         },
      { key: "Area",           value: "20ft × 15ft garden"    },
      { key: "Timeline",       value: "Complete by Aug 2026"  },
    ],
    goodToKnow: [
      { key: "Portfolio",    value: "Required with quote"    },
      { key: "Insurance",    value: "Public liability req."  },
      { key: "Quotes",       value: "Up to 3 accepted"       },
      { key: "Contact",      value: "Message via LokalAds"   },
    ],
    coordinates: { lat: 51.4613, lng: -0.1357 },
    seller: SELLERS.alice,
  },
  {
    id: "svc-want-02", href: "/listings/svc-want-02", advId: "40092",
    images: [{ src: img(6), alt: "Dog walking in park" }],
    priceLabel: "Budget: £15",
    priceSuffix: "/ hr",
    title: "SEEKING: Reliable Dog Walker — 5 Days/Week, Dalston Area",
    detailsLabel: "WANTED • DOG WALKER • EAST LONDON",
    locationLabel: "Dalston, London",
    postedAt: daysAgo(1),
    description: "<p>Dog owner in Dalston seeking a <strong>reliable, experienced dog walker</strong> for a friendly 3-year-old Labrador. Mon–Fri midday 1-hour walk. Must be insured and happy to provide references and a trial walk.</p>",
    keyDetails: [
      { key: "Service Needed", value: "Dog walking"           },
      { key: "Budget",         value: "£15/hour"              },
      { key: "Schedule",       value: "Mon–Fri, midday"       },
      { key: "Location",       value: "Dalston, E8"           },
    ],
    goodToKnow: [
      { key: "Insurance",  value: "Public liability req."  },
      { key: "References", value: "Required"               },
      { key: "Meet",       value: "Trial walk first"        },
      { key: "Contact",    value: "Message via LokalAds"   },
    ],
    coordinates: { lat: 51.5478, lng: -0.0759 },
    seller: SELLERS.dave,
  },
  {
    id: "svc-want-03", href: "/listings/svc-want-03", advId: "40093",
    images: [{ src: img(7), alt: "Bridal makeup and hair" }],
    priceLabel: "Budget: £500",
    title: "SEEKING: Mobile Bridal Hair & Makeup — Wedding July 2026, Windsor",
    detailsLabel: "WANTED • BEAUTY SERVICES • WINDSOR",
    locationLabel: "Windsor, Berkshire",
    postedAt: daysAgo(2),
    description: "<p>Bride looking for an experienced <strong>mobile bridal hair and makeup artist</strong> for a wedding in Windsor on 12 July 2026. Party of 5 (bride + 4 bridesmaids). Trial session required. Please share portfolio with enquiry.</p>",
    keyDetails: [
      { key: "Service Needed", value: "Bridal hair & makeup"       },
      { key: "Budget",         value: "£500 total (5 people)"      },
      { key: "Date",           value: "12 July 2026, Windsor"      },
      { key: "Party Size",     value: "5 (bride + 4 bridesmaids)" },
    ],
    goodToKnow: [
      { key: "Trial",     value: "Required before booking"  },
      { key: "Portfolio", value: "Required with enquiry"    },
      { key: "Travel",    value: "Travel costs negotiable"  },
      { key: "Contact",   value: "Message via LokalAds"    },
    ],
    coordinates: { lat: 51.4837, lng: -0.6077 },
    seller: SELLERS.james,
  },
];

