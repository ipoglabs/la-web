import type { MockListing } from "@/lib/mock/mock-listing-schema";
import { SELLERS, img, daysAgo, hrsAgo } from "./sellers";
// ─────────────────────────────────────────────────────────────────────────────
export const SG_PROPERTY_HOLIDAY: MockListing[] = [
  {
    id: "prop-sg-hol-01", href: "/listings/prop-sg-hol-01", advId: "30501",
    images: [
      { src: img(8), alt: "Sentosa villa" },
      { src: img(9), alt: "Private pool"   },
    ],
    priceLabel: "S$450", priceSuffix: "/ night",
    title: "Waterfront Villa — Private Pool & Berth, Sentosa Cove",
    detailsLabel: "4 BEDS • 4 BATHS • VILLA",
    locationLabel: "Sentosa Cove",
    postedAt: hrsAgo(8),
    description: "<p>Luxurious <strong>waterfront villa</strong> with a private infinity pool and yacht berth in exclusive Sentosa Cove. Four en-suite bedrooms and a rooftop entertaining deck.</p><p>Minutes from Quayside Isle's restaurants and Sentosa's beaches — a rare short-stay option in one of Singapore's most exclusive enclaves.</p>",
    keyDetails: [
      { key: "Max Guests", value: "8"                 },
      { key: "Min Stay",   value: "2 nights"          },
      { key: "Check-In",   value: "From 15:00"        },
      { key: "Check-Out",  value: "By 11:00"          },
      { key: "Pool",       value: "Private infinity"  },
      { key: "Sentosa Pass", value: "Provided for stay" },
    ],
    goodToKnow: [
      { key: "Wi-Fi",        value: "Included"       },
      { key: "Parking",      value: "Private, 2 cars" },
      { key: "Housekeeping", value: "Daily"           },
      { key: "Cleaning Fee", value: "S$150 per stay"  },
    ],
    coordinates: { lat: 1.2494, lng: 103.8303 },
    seller: SELLERS.huatProperty,
  },
  {
    id: "prop-sg-hol-02", href: "/listings/prop-sg-hol-02", advId: "30502",
    images: [
      { src: img(1), alt: "Marina Bay apartment" },
    ],
    priceLabel: "S$280", priceSuffix: "/ night",
    title: "Serviced Apartment — Marina Bay Skyline Views",
    detailsLabel: "1 BED • 1 BATH • SERVICED APARTMENT",
    locationLabel: "Marina Bay",
    postedAt: daysAgo(2),
    description: "<p>Fully serviced <strong>1-bedroom apartment</strong> with sweeping views of the Marina Bay skyline and access to a rooftop infinity pool.</p><p>Steps from Marina Bay Sands, the Esplanade, and Raffles Place MRT — ideal for business travellers and short stays.</p>",
    keyDetails: [
      { key: "Max Guests", value: "2"              },
      { key: "Min Stay",   value: "1 night"         },
      { key: "Check-In",   value: "From 14:00"     },
      { key: "Check-Out",  value: "By 11:00"       },
      { key: "Pool",       value: "Rooftop infinity" },
    ],
    goodToKnow: [
      { key: "Wi-Fi",        value: "Included"      },
      { key: "Housekeeping", value: "Daily"          },
      { key: "Service Fee",  value: "10% of stay"    },
      { key: "Parking",      value: "Valet, extra cost" },
    ],
    coordinates: { lat: 1.2807, lng: 103.8547 },
    seller: SELLERS.era,
  },
];
