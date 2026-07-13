import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── child_family ───────────────────────────────────────────────────────────────
export const COMMUNITY_CHILD_FAMILY: MockListing[] = [
  {
    id: "comm-child-01", href: "/listings/comm-child-01", advId: "80041",
    images: [{ src: img(7), alt: "Playgroup" }],
    priceLabel: "£2",
    priceSuffix: "/ session",
    title: "Baby & Toddler Playgroup — Tues & Thurs Mornings, Tooting",
    detailsLabel: "CHILD & FAMILY • PLAYGROUP • TOOTING",
    locationLabel: "Tooting, London",
    postedAt: daysAgo(1),
    description: "<p>Friendly <strong>baby and toddler playgroup</strong> running Tuesday and Thursday mornings (9:30–11:30am) at St Nicholas Church Hall, Tooting. Ages 0–4 years. Tea/coffee for parents, toys, crafts, and singing. Only £2 per session.</p>",
    keyDetails: [
      { key: "For",       value: "Ages 0–4 years"          },
      { key: "Days",      value: "Tues & Thurs mornings"   },
      { key: "Time",      value: "9:30am – 11:30am"        },
      { key: "Cost",      value: "£2 per session"          },
    ],
    goodToKnow: [
      { key: "Venue",     value: "St Nicholas Church Hall" },
      { key: "Includes",  value: "Toys, crafts, singing"  },
      { key: "Parents",   value: "Tea/coffee provided"    },
      { key: "No Booking", value: "Just turn up!"         },
    ],
    coordinates: { lat: 51.4275, lng: -0.1670 },
    seller: SELLERS.communityMgr,
  },
  {
    id: "comm-child-02", href: "/listings/comm-child-02", advId: "80042",
    images: [{ src: img(8), alt: "After school club" }],
    priceLabel: "£12",
    priceSuffix: "/ session",
    title: "After-School Art Club — Ages 5–11, Fridays, Lewisham",
    detailsLabel: "CHILD & FAMILY • ART CLUB • LEWISHAM",
    locationLabel: "Lewisham, London",
    postedAt: daysAgo(1),
    description: "<p>Creative <strong>after-school art club</strong> for children aged 5–11 every Friday 3:30–5:00pm at Lewisham Arts Centre. Painting, collage, sculpture, and digital art. Led by a qualified primary art teacher. Limited spaces — book ahead.</p>",
    keyDetails: [
      { key: "For",      value: "Ages 5–11"             },
      { key: "Day",      value: "Every Friday"           },
      { key: "Time",     value: "3:30pm – 5:00pm"        },
      { key: "Cost",     value: "£12 per session"        },
    ],
    goodToKnow: [
      { key: "Venue",    value: "Lewisham Arts Centre"   },
      { key: "Spaces",   value: "Max 12 per session"     },
      { key: "Teacher",  value: "Qualified primary art"  },
      { key: "Booking",  value: "Essential — message us" },
    ],
    coordinates: { lat: 51.4613, lng: -0.0116 },
    seller: SELLERS.communityMgr,
  },
  {
    id: "comm-child-03", href: "/listings/comm-child-03", advId: "80043",
    images: [{ src: img(9), alt: "Single parents support group" }],
    priceLabel: "FREE",
    title: "Single Parents Support Group — Monthly Meet, Clapham",
    detailsLabel: "CHILD & FAMILY • SUPPORT GROUP • CLAPHAM",
    locationLabel: "Clapham, London",
    postedAt: daysAgo(3),
    description: "<p>Informal <strong>support group for single parents</strong> meeting on the last Saturday of each month at Clapham Library (10am–12pm). Share experiences, get advice, and meet others in the same situation. Free crèche available while you attend.</p>",
    keyDetails: [
      { key: "For",     value: "Single parents"         },
      { key: "When",    value: "Last Sat of month"      },
      { key: "Time",    value: "10:00am – 12:00pm"      },
      { key: "Cost",    value: "FREE"                  },
    ],
    goodToKnow: [
      { key: "Crèche",   value: "Free while you attend"  },
      { key: "Venue",    value: "Clapham Library, SW4"   },
      { key: "No Booking", value: "Just come along"      },
      { key: "Contact",  value: "Message for more info" },
    ],
    coordinates: { lat: 51.4624, lng: -0.1380 },
    seller: SELLERS.communityMgr,
  },
];

