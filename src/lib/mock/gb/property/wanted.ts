import type { MockListing } from "../../mock-listing-schema";
import { SELLERS, img, daysAgo, hrsAgo } from "./sellers";
// ─────────────────────────────────────────────────────────────────────────────
export const PROPERTY_WANTED: MockListing[] = [
  {
    id: "prop-want-01", href: "/listings/prop-want-01", advId: "10701",
    images: [
      { src: img(5), alt: "Wanted — 2-bed flat" },
    ],
    priceLabel: "Up to £500,000",
    title: "WANTED: 2-Bed Flat in Zone 2 — Cash Buyer, Quick Completion",
    detailsLabel: "2 BEDS • APARTMENT OR FLAT",
    locationLabel: "East London (preferred)",
    postedAt: hrsAgo(6),
    description: "<p><strong>Cash buyer</strong> seeking a 2-bedroom flat or apartment in Zone 2. Budget up to £500,000 — willing to consider renovation projects. No mortgage required; solicitor and survey ready to instruct immediately.</p><p>Open to most East London boroughs: Hackney, Tower Hamlets, Newham, Southwark. Can exchange and complete within 4 weeks if title is clean.</p>",
    keyDetails: [
      { key: "Max Budget",  value: "£500,000"          },
      { key: "Timeline",    value: "4 weeks exchange"  },
      { key: "Finance",     value: "Cash — no mortgage"},
      { key: "Chain Free",  value: "Yes"               },
      { key: "Projects",    value: "Welcome"           },
    ],
    goodToKnow: [
      { key: "Buyer Status", value: "Cash, no chain"       },
      { key: "Solicitor",    value: "Instructed"           },
      { key: "Survey",       value: "Surveyor on standby"  },
      { key: "Decision",     value: "Within 48 hours"      },
      { key: "Contact",      value: "Respond via LokalAds" },
    ],
    coordinates: { lat: 51.5277, lng: -0.0124 },
    seller: SELLERS.james,
  },
  {
    id: "prop-want-02", href: "/listings/prop-want-02", advId: "10702",
    images: [
      { src: img(6), alt: "Wanted — family home" },
    ],
    priceLabel: "Up to £800,000",
    title: "WANTED: 4-Bed Family Home — Good School Catchment Essential",
    detailsLabel: "4 BEDS • DETACHED OR SEMI-DETACHED",
    locationLabel: "South West London",
    postedAt: daysAgo(2),
    description: "<p>Family of 5 <strong>urgently seeking a 4+ bedroom home</strong> in South West London. Budget firm at £800,000. School catchment is the primary requirement — Sheen, Richmond, Wimbledon, or Kingston preferred.</p><p>Mortgage offer in principle obtained, no property to sell. Can move to a tight timescale to suit the seller.</p>",
    keyDetails: [
      { key: "Max Budget",       value: "£800,000"                        },
      { key: "Timeline",         value: "ASAP"                            },
      { key: "Finance",          value: "Mortgage — offer in principle"   },
      { key: "Chain Free",       value: "Yes"                             },
      { key: "School Catchment", value: "Essential"                       },
    ],
    goodToKnow: [
      { key: "Buyer Status", value: "No chain"                   },
      { key: "Mortgage",     value: "Offer in principle"         },
      { key: "Flexibility",  value: "Can suit seller's dates"    },
      { key: "Decision",     value: "Quick"                      },
      { key: "Contact",      value: "Respond via LokalAds"       },
    ],
    coordinates: { lat: 51.4213, lng: -0.2062 },
    seller: SELLERS.james,
  },
  {
    id: "prop-want-03", href: "/listings/prop-want-03", advId: "10703",
    images: [
      { src: img(7), alt: "Wanted — bungalow" },
    ],
    priceLabel: "Up to £400,000",
    title: "WANTED: Bungalow for Elderly Relative — Step-Free, Single Storey",
    detailsLabel: "2–3 BEDS • BUNGALOW",
    locationLabel: "Surrey or South London",
    postedAt: daysAgo(4),
    description: "<p>Seeking a <strong>single-storey bungalow</strong> for an elderly relative requiring step-free access throughout. 2 or 3 bedrooms, level garden preferred. Budget up to £400,000.</p><p>Surrey (Sutton, Cheam, Epsom) or South London boroughs considered. Cash purchase — no chain, flexible on completion date.</p>",
    keyDetails: [
      { key: "Max Budget",    value: "£400,000"             },
      { key: "Timeline",      value: "Flexible"             },
      { key: "Finance",       value: "Cash — mortgage free" },
      { key: "Chain Free",    value: "Yes"                  },
      { key: "Accessibility", value: "Step-free essential"  },
    ],
    goodToKnow: [
      { key: "Buyer Status",  value: "Cash, no chain"         },
      { key: "Flexibility",   value: "Completion date flex"   },
      { key: "Accessibility", value: "Step-free essential"    },
      { key: "Garden",        value: "Level garden preferred" },
      { key: "Contact",       value: "Respond via LokalAds"   },
    ],
    coordinates: { lat: 51.3605, lng: -0.1945 },
    seller: SELLERS.alice,
  },
];
