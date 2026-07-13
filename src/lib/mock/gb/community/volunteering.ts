import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── volunteering ──────────────────────────────────────────────────────────────
export const COMMUNITY_VOLUNTEERING: MockListing[] = [
  {
    id: "comm-vol-01", href: "/listings/comm-vol-01", advId: "80021",
    images: [{ src: img(5), alt: "Food bank volunteers" }],
    priceLabel: "Free / Volunteer",
    title: "Volunteers Needed — Local Food Bank, Weekend Shifts, Lambeth",
    detailsLabel: "VOLUNTEERING • FOOD BANK • LAMBETH",
    locationLabel: "Stockwell, London",
    postedAt: hrsAgo(4),
    description: "<p>Lambeth Food Bank is urgently seeking <strong>volunteers</strong> for weekend distribution shifts. Tasks: sort donations, pack food parcels, and assist with distribution. No experience needed — full training given. DBS check provided free.</p>",
    keyDetails: [
      { key: "Role",          value: "Food Bank Volunteer"   },
      { key: "Commitment",    value: "1× weekend shift/month" },
      { key: "Location",      value: "Stockwell, SW9"        },
      { key: "Training",      value: "Provided free"         },
    ],
    goodToKnow: [
      { key: "DBS",        value: "Free DBS check provided" },
      { key: "Age",        value: "18+ for standard shifts" },
      { key: "Under 18",   value: "With adult, 15+"         },
      { key: "Sign Up",    value: "Message to register"     },
    ],
    coordinates: { lat: 51.4730, lng: -0.1221 },
    seller: SELLERS.localCouncil,
  },
  {
    id: "comm-vol-02", href: "/listings/comm-vol-02", advId: "80022",
    images: [{ src: img(6), alt: "Park litter pick" }],
    priceLabel: "Free / Volunteer",
    title: "Community Litter Pick — Brockwell Park, Every 2nd Sunday",
    detailsLabel: "VOLUNTEERING • ENVIRONMENT • BRIXTON",
    locationLabel: "Brixton / Herne Hill, London",
    postedAt: daysAgo(2),
    description: "<p>Join our friendly <strong>community litter-picking group</strong> at Brockwell Park every second Sunday morning (9:30–11am). All equipment provided. Great way to meet neighbours and give back to the local green space. Dogs welcome!</p>",
    keyDetails: [
      { key: "Role",       value: "Litter picking volunteer" },
      { key: "When",       value: "Every 2nd Sunday"         },
      { key: "Time",       value: "9:30am – 11:00am"         },
      { key: "Location",   value: "Brockwell Park, SE24"     },
    ],
    goodToKnow: [
      { key: "Equipment",  value: "Gloves + bags provided"  },
      { key: "Dogs",       value: "Welcome on leads"        },
      { key: "No Booking", value: "Just turn up"            },
      { key: "Contact",    value: "Message for next date"   },
    ],
    coordinates: { lat: 51.4540, lng: -0.1068 },
    seller: SELLERS.communityMgr,
  },
  {
    id: "comm-vol-03", href: "/listings/comm-vol-03", advId: "80023",
    images: [{ src: img(7), alt: "Digital skills volunteer" }],
    priceLabel: "Free / Volunteer",
    title: "Digital Inclusion Volunteer Needed — Help Seniors Get Online, Hackney",
    detailsLabel: "VOLUNTEERING • DIGITAL • HACKNEY",
    locationLabel: "Hackney, London",
    postedAt: daysAgo(3),
    description: "<p>Age UK Hackney is recruiting <strong>digital inclusion volunteers</strong> to help older residents with smartphones, tablets, and online services (banking, NHS, shopping). 2-hour weekly sessions in sheltered housing schemes. Training and DBS provided.</p>",
    keyDetails: [
      { key: "Role",       value: "Digital inclusion helper" },
      { key: "Commitment", value: "2 hrs/week"               },
      { key: "Location",   value: "Various Hackney schemes" },
      { key: "Training",   value: "Provided free"            },
    ],
    goodToKnow: [
      { key: "DBS",       value: "Free DBS check provided" },
      { key: "Age",       value: "18+ only"                },
      { key: "Skills",    value: "Basic digital skills req." },
      { key: "Sign Up",   value: "Message to apply"        },
    ],
    coordinates: { lat: 51.5478, lng: -0.0759 },
    seller: SELLERS.localCouncil,
  },
];

