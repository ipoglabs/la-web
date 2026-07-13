import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── announcement ──────────────────────────────────────────────────────────────
export const COMMUNITY_ANNOUNCEMENT: MockListing[] = [
  {
    id: "comm-ann-01", href: "/listings/comm-ann-01", advId: "80031",
    images: [{ src: img(6), alt: "Road closure sign" }],
    priceLabel: "FREE",
    title: "Road Closure Notice — Brixton Road, 5–7 Jul, Gas Works",
    detailsLabel: "ANNOUNCEMENT • INFO • BRIXTON",
    locationLabel: "Brixton, London",
    postedAt: hrsAgo(6),
    description: "<p><strong>Notice to residents:</strong> Brixton Road (between Acre Lane and Stockwell Road) will be closed on 5–7 July 2026 (8am–6pm daily) for essential gas main works. Diversions via Coldharbour Lane. Allow extra travel time.</p>",
    keyDetails: [
      { key: "Closure",   value: "Brixton Road (partial)"  },
      { key: "Dates",     value: "5–7 July 2026"           },
      { key: "Hours",     value: "8:00am – 6:00pm"         },
      { key: "Reason",    value: "Gas main replacement"    },
    ],
    goodToKnow: [
      { key: "Diversion", value: "Via Coldharbour Lane"   },
      { key: "Buses",     value: "Temporary stops in place" },
      { key: "Info",      value: "TfL / Lambeth Council"  },
      { key: "Emergency", value: "999 if gas smell"       },
    ],
    coordinates: { lat: 51.4613, lng: -0.1144 },
    seller: SELLERS.localCouncil,
  },
  {
    id: "comm-ann-02", href: "/listings/comm-ann-02", advId: "80032",
    images: [{ src: img(7), alt: "Planning application notice" }],
    priceLabel: "FREE",
    title: "Planning Application Notice — 27 Elm Park Road, SE15 — Rear Extension",
    detailsLabel: "ANNOUNCEMENT • PLANNING • PECKHAM",
    locationLabel: "Peckham, London",
    postedAt: daysAgo(1),
    description: "<p><strong>Southwark Council planning application</strong> ref: 26/AP/1234. Application for a single-storey rear extension and loft conversion at 27 Elm Park Road SE15. Consultation period ends 10 July 2026. Comments via Southwark planning portal.</p>",
    keyDetails: [
      { key: "Application", value: "26/AP/1234"            },
      { key: "Address",     value: "27 Elm Park Road SE15" },
      { key: "Proposal",    value: "Rear ext. + loft conv." },
      { key: "Deadline",    value: "10 July 2026"          },
    ],
    goodToKnow: [
      { key: "Comments", value: "Via Southwark portal"   },
      { key: "Decision", value: "Expected Aug 2026"      },
      { key: "Contact",  value: "planning@southwark.gov.uk" },
      { key: "Ref",      value: "Quote 26/AP/1234"       },
    ],
    coordinates: { lat: 51.4741, lng: -0.0686 },
    seller: SELLERS.localCouncil,
  },
  {
    id: "comm-ann-03", href: "/listings/comm-ann-03", advId: "80033",
    images: [{ src: img(8), alt: "Recycling centre notice" }],
    priceLabel: "FREE",
    title: "Recycling Centre Holiday Hours — Lambeth Civic Amenity, July Bank Hol",
    detailsLabel: "ANNOUNCEMENT • INFO • LAMBETH",
    locationLabel: "Lambeth, London",
    postedAt: daysAgo(2),
    description: "<p>Lambeth Civic Amenity Site will operate on <strong>reduced hours</strong> during the July bank holiday weekend (26–28 July 2026). Saturday and Sunday: 8am–2pm only. Monday (Bank Holiday): CLOSED. Please plan your visits accordingly.</p>",
    keyDetails: [
      { key: "Site",    value: "Lambeth Civic Amenity"    },
      { key: "Sat/Sun", value: "8:00am – 2:00pm only"     },
      { key: "Mon BH",  value: "CLOSED"                  },
      { key: "Dates",   value: "26–28 July 2026"          },
    ],
    goodToKnow: [
      { key: "Items",   value: "No commercial waste"      },
      { key: "ID",      value: "Lambeth residents only"   },
      { key: "Info",    value: "lambeth.gov.uk/recycling" },
      { key: "Contact", value: "0800 234 567"             },
    ],
    coordinates: { lat: 51.4613, lng: -0.1144 },
    seller: SELLERS.localCouncil,
  },
];

