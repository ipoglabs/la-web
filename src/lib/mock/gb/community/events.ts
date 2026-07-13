import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── events ────────────────────────────────────────────────────────────────────
export const COMMUNITY_EVENTS: MockListing[] = [
  {
    id: "comm-event-01", href: "/listings/comm-event-01", advId: "80011",
    images: [{ src: img(3), alt: "Street festival" }],
    priceLabel: "FREE",
    title: "Brixton Community Summer Fair — 12 Jul, Live Music + Food Market",
    detailsLabel: "EVENT • FREE • IN-PERSON",
    locationLabel: "Brixton, London",
    postedAt: daysAgo(1),
    description: "<p>Join us for the <strong>Brixton Community Summer Fair</strong> on Saturday 12 July 2026, 11am–6pm at Windrush Square. Free entry. Live music stages, 40+ food stalls, crafts, kids' zone, and community organisations. All welcome!</p>",
    keyDetails: [
      { key: "Date",      value: "Sat 12 July 2026"      },
      { key: "Time",      value: "11:00am – 6:00pm"      },
      { key: "Location",  value: "Windrush Square, SW2"  },
      { key: "Entry",     value: "FREE"                  },
    ],
    goodToKnow: [
      { key: "Activities", value: "Music, food, crafts, kids" },
      { key: "Stalls",     value: "40+ food & craft traders" },
      { key: "Accessible", value: "Wheelchair accessible"    },
      { key: "Transport",  value: "Brixton tube/rail"        },
    ],
    coordinates: { lat: 51.4613, lng: -0.1144 },
    seller: SELLERS.localCouncil,
  },
  {
    id: "comm-event-02", href: "/listings/comm-event-02", advId: "80012",
    images: [{ src: img(4), alt: "Community cinema" }],
    priceLabel: "£5",
    priceSuffix: "/ ticket",
    title: "Outdoor Cinema Night — The Dark Knight, Rooftop Peckham, 19 Jul",
    detailsLabel: "EVENT • £5 • IN-PERSON",
    locationLabel: "Peckham, London",
    postedAt: daysAgo(2),
    description: "<p><strong>Outdoor rooftop cinema night</strong> at Bold Tendencies, Peckham. Screening: The Dark Knight (2008). Bring a blanket. Fully licensed bar and food stalls open from 7pm. Film starts at dusk (~9:15pm).</p>",
    keyDetails: [
      { key: "Date",     value: "Sun 19 July 2026"    },
      { key: "Time",     value: "Bar 7pm, film ~9:15" },
      { key: "Location", value: "Bold Tendencies, SE15" },
      { key: "Ticket",   value: "£5 — book online"   },
    ],
    goodToKnow: [
      { key: "Film",     value: "The Dark Knight (2008)" },
      { key: "Age",      value: "12A certificate"        },
      { key: "Blankets", value: "Recommended"            },
      { key: "Bar",      value: "Licensed bar on-site"   },
    ],
    coordinates: { lat: 51.4741, lng: -0.0686 },
    seller: SELLERS.communityMgr,
  },
  {
    id: "comm-event-03", href: "/listings/comm-event-03", advId: "80013",
    images: [{ src: img(5), alt: "Language exchange meetup" }],
    priceLabel: "FREE",
    title: "Weekly Language Exchange Meetup — English / Spanish / French, Soho",
    detailsLabel: "EVENT • FREE • IN-PERSON",
    locationLabel: "Soho, London",
    postedAt: daysAgo(3),
    description: "<p>Friendly <strong>language exchange meetup</strong> every Wednesday evening (7–9pm) at a Soho bar. Practise your English, Spanish, or French with native speakers. All levels welcome — just show up! Typically 30–50 attendees from 20+ countries.</p>",
    keyDetails: [
      { key: "Date",      value: "Every Wednesday"       },
      { key: "Time",      value: "7:00pm – 9:00pm"        },
      { key: "Location",  value: "Soho, Central London"  },
      { key: "Entry",     value: "FREE"                  },
    ],
    goodToKnow: [
      { key: "Languages",  value: "English, Spanish, French" },
      { key: "Levels",     value: "All levels welcome"       },
      { key: "Attendees",  value: "30–50 per week"           },
      { key: "No Booking", value: "Just turn up"             },
    ],
    coordinates: { lat: 51.5134, lng: -0.1310 },
    seller: SELLERS.communityMgr,
  },
];

