import type { MockListing } from "@/lib/mock/mock-listing-schema";
import { SELLERS, img, daysAgo, hrsAgo } from "./sellers";
// ─────────────────────────────────────────────────────────────────────────────
export const IN_PROPERTY_HOLIDAY: MockListing[] = [
  {
    id: "prop-in-hol-01", href: "/listings/prop-in-hol-01", advId: "20501",
    images: [
      { src: img(1), alt: "Villa pool"    },
      { src: img(2), alt: "Villa exterior" },
    ],
    priceLabel: "₹8,000", priceSuffix: "/ night",
    title: "Private Pool Villa — Steps from Calangute Beach",
    detailsLabel: "3 BEDS • 3 BATHS • VILLA",
    locationLabel: "Calangute, Goa",
    postedAt: hrsAgo(9),
    description: "<p>Breezy <strong>3-bedroom villa</strong> with a private plunge pool and garden, a 5-minute walk from Calangute Beach. Fully air-conditioned with a caretaker and daily housekeeping included.</p><p>Close to Baga's nightlife and Candolim's restaurants — ideal for families or groups travelling together.</p>",
    keyDetails: [
      { key: "Max Guests", value: "6"                  },
      { key: "Min Stay",   value: "2 nights"           },
      { key: "Check-In",   value: "From 14:00"         },
      { key: "Check-Out",  value: "By 11:00"           },
      { key: "Pool",       value: "Private, unheated"  },
      { key: "Caretaker",  value: "On-site"            },
    ],
    goodToKnow: [
      { key: "Wi-Fi",         value: "Included"      },
      { key: "Parking",       value: "Private, 2 cars" },
      { key: "Housekeeping",  value: "Daily"          },
      { key: "Cleaning Fee",  value: "₹1,500 per stay" },
      { key: "Pets",          value: "Not allowed"    },
    ],
    coordinates: { lat: 15.5439, lng: 73.7553 },
    seller: SELLERS.rajesh,
  },
  {
    id: "prop-in-hol-02", href: "/listings/prop-in-hol-02", advId: "20502",
    images: [
      { src: img(3), alt: "Mountain cottage" },
    ],
    priceLabel: "₹4,500", priceSuffix: "/ night",
    title: "Cosy Wooden Cottage — Mountain Views, Bonfire Included",
    detailsLabel: "2 BEDS • 2 BATHS • COTTAGE",
    locationLabel: "Old Manali, Himachal Pradesh",
    postedAt: daysAgo(2),
    description: "<p>Charming <strong>wooden cottage</strong> overlooking the Beas River and surrounding pine forests. Wood-fired heater, private balcony, and a nightly bonfire included in peak season.</p><p>10 minutes' walk to Old Manali's cafés and Hidimba Temple — a favourite base for trekkers and backpackers.</p>",
    keyDetails: [
      { key: "Max Guests", value: "4"           },
      { key: "Min Stay",   value: "1 night"      },
      { key: "Check-In",   value: "From 12:00"  },
      { key: "Check-Out",  value: "By 10:00"    },
      { key: "Heating",    value: "Wood-fired"   },
      { key: "Caretaker",  value: "On-call"      },
    ],
    goodToKnow: [
      { key: "Wi-Fi",        value: "Limited — mountain area" },
      { key: "Parking",      value: "Free, on-site"           },
      { key: "Bonfire",      value: "Included (season)"       },
      { key: "Meals",        value: "On request, extra cost"  },
      { key: "Pets",         value: "Allowed on request"      },
    ],
    coordinates: { lat: 32.2432, lng: 77.1892 },
    seller: SELLERS.priya,
  },
];
