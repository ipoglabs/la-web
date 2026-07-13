import type { MockListing } from "../../mock-listing-schema";
import { SELLERS, img, daysAgo, hrsAgo } from "./sellers";
// ─────────────────────────────────────────────────────────────────────────────
export const PROPERTY_LAND: MockListing[] = [
  {
    id: "prop-land-01", href: "/listings/prop-land-01", advId: "10601",
    images: [
      { src: img(2), alt: "Building plot" },
    ],
    priceLabel: "£280,000",
    title: "Residential Building Plot — Full PP for 3-Bed House, Services Connected",
    detailsLabel: "0.12 ACRES • FREEHOLD • PLANNING GRANTED",
    locationLabel: "Bromley, London",
    postedAt: daysAgo(1),
    description: "<p><strong>Serviced residential building plot</strong> with full planning permission granted for a 1,450 sq ft 3-bedroom detached house. All services — water, gas, electric, and drains — connected to the boundary.</p><p>Located on a quiet residential street in Bromley, a 10-minute walk from Bromley South mainline station (22 mins to Victoria).</p>",
    keyDetails: [
      { key: "Plot Size",    value: "0.12 acres"                },
      { key: "Planning",     value: "Full PP — 3-bed detached"  },
      { key: "Services",     value: "All connected to boundary" },
      { key: "Road Access",  value: "Adopted highway"           },
      { key: "Tenure",       value: "Freehold"                  },
    ],
    goodToKnow: [
      { key: "Planning Ref", value: "LBB/24/01234"           },
      { key: "Expires",      value: "3 years from grant"     },
      { key: "Services",     value: "Connected"              },
      { key: "Flood Zone",   value: "Zone 1 (low risk)"      },
      { key: "Site Survey",  value: "Available on request"   },
    ],
    coordinates: { lat: 51.4059, lng: 0.0152 },
    seller: SELLERS.james,
  },
  {
    id: "prop-land-02", href: "/listings/prop-land-02", advId: "10602",
    images: [
      { src: img(3), alt: "Agricultural land" },
    ],
    priceLabel: "£150,000",
    title: "12-Acre Agricultural Land — Equestrian Use Permitted",
    detailsLabel: "12 ACRES • FREEHOLD • AGRICULTURAL",
    locationLabel: "Guildford, Surrey",
    postedAt: daysAgo(4),
    description: "<p>Productive <strong>12-acre agricultural parcel</strong> in the Surrey Green Belt. Currently in grass/hay use with a field shelter and post-and-rail fencing. Equestrian use is expressly permitted under the title.</p><p>Good road access from a quiet B-road with a field gate; 20 minutes from Guildford town centre and the A3.</p>",
    keyDetails: [
      { key: "Plot Size",  value: "12 acres"              },
      { key: "Planning",   value: "Agricultural"          },
      { key: "Equestrian", value: "Permitted"             },
      { key: "Road Access",value: "B-road field gate"     },
      { key: "Tenure",     value: "Freehold"              },
    ],
    goodToKnow: [
      { key: "Flood Zone", value: "Zone 1"               },
      { key: "Green Belt", value: "Yes — Surrey"         },
      { key: "Fencing",    value: "Post and rail"        },
      { key: "Water",      value: "Trough connected"     },
      { key: "Survey",     value: "Available on request" },
    ],
    coordinates: { lat: 51.2362, lng: -0.5704 },
    seller: SELLERS.james,
  },
  {
    id: "prop-land-03", href: "/listings/prop-land-03", advId: "10603",
    images: [
      { src: img(4), alt: "Commercial development site" },
    ],
    priceLabel: "£620,000",
    title: "Commercial Development Site — 0.8 Acres, Outline PP for Mixed Use",
    detailsLabel: "0.8 ACRES • FREEHOLD • OUTLINE PP",
    locationLabel: "Croydon, London",
    postedAt: daysAgo(5),
    description: "<p>Strategic <strong>0.8-acre brownfield site</strong> in Croydon's regeneration zone with outline planning permission for a mixed-use scheme of up to 35,000 sq ft (offices, retail, and 12 residential units).</p><p>East Croydon mainline (12 mins to London Bridge) and the town's Enterprise Zone form part of one of London's most ambitious regeneration areas.</p>",
    keyDetails: [
      { key: "Plot Size",     value: "0.8 acres"                  },
      { key: "Planning",      value: "Outline PP — mixed use"      },
      { key: "GIA Potential", value: "Up to 35,000 sq ft"         },
      { key: "Road Access",   value: "Dual carriageway frontage"   },
      { key: "Tenure",        value: "Freehold"                    },
    ],
    goodToKnow: [
      { key: "Planning Ref", value: "LBC/24/05678"             },
      { key: "Enterprise",   value: "Croydon EZ"               },
      { key: "Site Survey",  value: "Phase 1 available"        },
      { key: "Services",     value: "All at boundary"          },
      { key: "Flood Zone",   value: "Zone 2 — FRA available"   },
    ],
    coordinates: { lat: 51.3762, lng: -0.0982 },
    seller: SELLERS.comm,
  },
];
