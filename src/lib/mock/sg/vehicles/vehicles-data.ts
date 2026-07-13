import type { MockListing } from "@/lib/mock/mock-listing-schema";
import { SELLERS, img, daysAgo, hrsAgo } from "./sellers";

// ── cars ──────────────────────────────────────────────────────────────────────
export const SG_VEHICLES_CARS: MockListing[] = [
  {
    id: "veh-sg-car-01", href: "/listings/veh-sg-car-01", advId: "31001",
    images: [{ src: img(1), alt: "Toyota Corolla Altis" }, { src: img(2), alt: "Interior" }],
    priceLabel: "S$88,800",
    title: "2021 Toyota Corolla Altis 1.6A \u2014 COE till 2031, Low Mileage",
    detailsLabel: "2021 \u2022 32,000 KM \u2022 PETROL",
    locationLabel: "Bishan, Singapore",
    postedAt: hrsAgo(3),
    description: "<p>Well-kept <strong>2021 Toyota Corolla Altis 1.6A</strong>, COE valid till 2031. Full agent service history, Toyota Safety Sense, and no accident record. Ideal first car with low road tax.</p><p>Genuine reason for sale \u2014 upgrading to a bigger family car.</p>",
    keyDetails: [
      { key: "Make / Model", value: "Toyota Corolla Altis 1.6A" },
      { key: "Year",         value: "2021"                       },
      { key: "Mileage",      value: "32,000 km"                  },
      { key: "COE Expiry",   value: "2031"                        },
      { key: "Transmission", value: "CVT Automatic"               },
    ],
    goodToKnow: [
      { key: "Owners",      value: "1st Owner"           },
      { key: "Road Tax",    value: "Paid till Dec 2026"  },
      { key: "In-Vehicle Unit", value: "Fitted"           },
      { key: "Loan",        value: "Bank loan available" },
    ],
    coordinates: { lat: 1.3508, lng: 103.8485 },
    seller: SELLERS.weiJie,
  },
  {
    id: "veh-sg-car-02", href: "/listings/veh-sg-car-02", advId: "31002",
    images: [{ src: img(3), alt: "Honda Vezel" }, { src: img(4), alt: "Side profile" }],
    priceLabel: "S$112,000",
    title: "2022 Honda Vezel Hybrid e:HEV \u2014 COE till 2032, Agent Unit",
    detailsLabel: "2022 \u2022 18,000 KM \u2022 HYBRID",
    locationLabel: "Ubi Avenue, Singapore",
    postedAt: daysAgo(1),
    description: "<p>Immaculate <strong>2022 Honda Vezel Hybrid e:HEV</strong>, parallel-import agent unit with COE till 2032. Honda Sensing safety suite, panoramic glass roof, and full workshop records. LTA inspection passed.</p>",
    keyDetails: [
      { key: "Make / Model", value: "Honda Vezel e:HEV Hybrid" },
      { key: "Year",         value: "2022"                     },
      { key: "Mileage",      value: "18,000 km"                },
      { key: "COE Expiry",   value: "2032"                      },
      { key: "Transmission", value: "e-CVT"                     },
    ],
    goodToKnow: [
      { key: "Owners",   value: "1st Owner (agent unit)" },
      { key: "Road Tax", value: "Paid till Mar 2027"     },
      { key: "Inspection", value: "LTA passed, latest report" },
      { key: "Loan",     value: "Available"              },
    ],
    coordinates: { lat: 1.3298, lng: 103.8925 },
    seller: SELLERS.sgCarMart,
  },
];

// ── motorcycle ────────────────────────────────────────────────────────────────
export const SG_VEHICLES_MOTORCYCLE: MockListing[] = [
  {
    id: "veh-sg-moto-01", href: "/listings/veh-sg-moto-01", advId: "31011",
    images: [{ src: img(5), alt: "Honda CB400" }],
    priceLabel: "S$11,800",
    title: "2020 Honda CB400 Super Four \u2014 Class 2A, COE till 2030",
    detailsLabel: "2020 \u2022 12,000 KM \u2022 PETROL",
    locationLabel: "Sin Ming, Singapore",
    postedAt: hrsAgo(5),
    description: "<p>Well-maintained <strong>2020 Honda CB400 Super Four</strong>, popular Class 2A option. COE valid till 2030, LTA inspection due only next year. Genuine mileage, no modifications beyond a slip-on exhaust.</p>",
    keyDetails: [
      { key: "Make / Model", value: "Honda CB400 Super Four" },
      { key: "Year",         value: "2020"                    },
      { key: "Mileage",      value: "12,000 km"               },
      { key: "COE Expiry",   value: "2030"                     },
      { key: "Licence Class", value: "Class 2A"                },
    ],
    goodToKnow: [
      { key: "Owners",     value: "1st Owner"          },
      { key: "Road Tax",   value: "Paid till Nov 2026"  },
      { key: "Inspection", value: "Due 2027"            },
    ],
    coordinates: { lat: 1.3556, lng: 103.8373 },
    seller: SELLERS.bikeHub,
  },
  {
    id: "veh-sg-moto-02", href: "/listings/veh-sg-moto-02", advId: "31012",
    images: [{ src: img(6), alt: "Yamaha NMAX" }],
    priceLabel: "S$8,900",
    title: "2022 Yamaha NMAX 155 \u2014 Scooter, Class 2B, Low Mileage",
    detailsLabel: "2022 \u2022 6,500 KM \u2022 PETROL",
    locationLabel: "Sin Ming, Singapore",
    postedAt: daysAgo(2),
    description: "<p>Popular <strong>2022 Yamaha NMAX 155</strong> maxi-scooter, Class 2B, ideal for daily commute across the island. Smart key, ABS, and underseat storage. Well maintained with full service records.</p>",
    keyDetails: [
      { key: "Make / Model", value: "Yamaha NMAX 155" },
      { key: "Year",         value: "2022"             },
      { key: "Mileage",      value: "6,500 km"         },
      { key: "Licence Class", value: "Class 2B"         },
    ],
    goodToKnow: [
      { key: "Owners",   value: "1st Owner"         },
      { key: "Road Tax", value: "Paid till Jan 2027" },
    ],
    coordinates: { lat: 1.3556, lng: 103.8373 },
    seller: SELLERS.bikeHub,
  },
];

// ── van ───────────────────────────────────────────────────────────────────────
export const SG_VEHICLES_VAN: MockListing[] = [
  {
    id: "veh-sg-van-01", href: "/listings/veh-sg-van-01", advId: "31021",
    images: [{ src: img(7), alt: "Toyota Hiace" }, { src: img(8), alt: "Cargo interior" }],
    priceLabel: "S$68,000",
    title: "2021 Toyota Hiace Panel Van \u2014 Class 3 Vocational Licence Needed",
    detailsLabel: "2021 \u2022 45,000 KM \u2022 DIESEL",
    locationLabel: "Woodlands, Singapore",
    postedAt: daysAgo(3),
    description: "<p>Fleet-maintained <strong>2021 Toyota Hiace panel van</strong>, suited for SME logistics or courier operations. Regular servicing at authorised workshop, LTA inspection up to date, and road tax current.</p>",
    keyDetails: [
      { key: "Make / Model", value: "Toyota Hiace Panel Van" },
      { key: "Year",         value: "2021"                   },
      { key: "Mileage",      value: "45,000 km"              },
      { key: "Licence Req.", value: "Class 3 (vocational)"   },
    ],
    goodToKnow: [
      { key: "Road Tax",   value: "Paid till Feb 2027" },
      { key: "Inspection", value: "Passed, valid"       },
      { key: "Loan",       value: "Commercial loan available" },
    ],
    coordinates: { lat: 1.4382, lng: 103.7891 },
    seller: SELLERS.logisticsFleet,
  },
  {
    id: "veh-sg-van-02", href: "/listings/veh-sg-van-02", advId: "31022",
    images: [{ src: img(9), alt: "Maxus V80" }],
    priceLabel: "S$54,500",
    title: "2020 Maxus V80 High Roof Van \u2014 Well Maintained, Single Fleet Use",
    detailsLabel: "2020 \u2022 68,000 KM \u2022 DIESEL",
    locationLabel: "Woodlands, Singapore",
    postedAt: daysAgo(5),
    description: "<p>Reliable <strong>2020 Maxus V80 high-roof van</strong>, used for a single fleet operation. High cargo volume, side-loading door, and reversing camera. Good tyre condition throughout.</p>",
    keyDetails: [
      { key: "Make / Model", value: "Maxus V80 High Roof" },
      { key: "Year",         value: "2020"                 },
      { key: "Mileage",      value: "68,000 km"            },
    ],
    goodToKnow: [
      { key: "Road Tax",   value: "Paid till Oct 2026" },
      { key: "Inspection", value: "Valid"               },
    ],
    coordinates: { lat: 1.4382, lng: 103.7891 },
    seller: SELLERS.logisticsFleet,
  },
];

// ── truck ─────────────────────────────────────────────────────────────────────
export const SG_VEHICLES_TRUCK: MockListing[] = [
  {
    id: "veh-sg-truck-01", href: "/listings/veh-sg-truck-01", advId: "31031",
    images: [{ src: img(1), alt: "Isuzu NKR lorry" }],
    priceLabel: "S$62,000",
    title: "2019 Isuzu NKR 3-Tonne Lorry \u2014 Class 4 Licence, Fleet Serviced",
    detailsLabel: "2019 \u2022 1,20,000 KM \u2022 DIESEL",
    locationLabel: "Woodlands, Singapore",
    postedAt: daysAgo(4),
    description: "<p>Well-serviced <strong>2019 Isuzu NKR 3-tonne lorry</strong>, ideal for goods transport across Singapore. Aluminium canopy body, tail-gate lifter, and up-to-date LTA inspection.</p>",
    keyDetails: [
      { key: "Make / Model", value: "Isuzu NKR 3-Tonne" },
      { key: "Year",         value: "2019"               },
      { key: "Mileage",      value: "1,20,000 km"        },
      { key: "Licence Req.", value: "Class 4"            },
    ],
    goodToKnow: [
      { key: "Road Tax",   value: "Paid till Dec 2026" },
      { key: "Inspection", value: "Valid"               },
    ],
    coordinates: { lat: 1.4382, lng: 103.7891 },
    seller: SELLERS.logisticsFleet,
  },
  {
    id: "veh-sg-truck-02", href: "/listings/veh-sg-truck-02", advId: "31032",
    images: [{ src: img(2), alt: "Hino 300 flatbed" }],
    priceLabel: "S$71,500",
    title: "2020 Hino 300 Flatbed Lorry \u2014 Well Maintained, Ready for Use",
    detailsLabel: "2020 \u2022 88,000 KM \u2022 DIESEL",
    locationLabel: "Woodlands, Singapore",
    postedAt: daysAgo(6),
    description: "<p>Solid <strong>2020 Hino 300 flatbed lorry</strong>, previously used for construction materials transport. Good tyre tread remaining, functional hydraulic tailgate, and clean engine bay.</p>",
    keyDetails: [
      { key: "Make / Model", value: "Hino 300 Flatbed" },
      { key: "Year",         value: "2020"               },
      { key: "Mileage",      value: "88,000 km"          },
    ],
    goodToKnow: [
      { key: "Road Tax",   value: "Paid till Sep 2026" },
      { key: "Inspection", value: "Valid"               },
    ],
    coordinates: { lat: 1.4382, lng: 103.7891 },
    seller: SELLERS.logisticsFleet,
  },
];

// ── boats ─────────────────────────────────────────────────────────────────────
export const SG_VEHICLES_BOATS: MockListing[] = [
  {
    id: "veh-sg-boat-01", href: "/listings/veh-sg-boat-01", advId: "31041",
    images: [{ src: img(3), alt: "Leisure yacht" }],
    priceLabel: "S$185,000",
    title: "32ft Leisure Yacht \u2014 Twin Engine, Berthed at Sentosa Cove",
    detailsLabel: "32FT \u2022 TWIN ENGINE \u2022 MARINA BERTH INCLUDED",
    locationLabel: "One\u2019 15 Marina, Sentosa Cove",
    postedAt: daysAgo(2),
    description: "<p>Well-maintained <strong>32ft leisure yacht</strong> with twin diesel engines, flybridge, and a spacious salon. Currently berthed at One\u2019 15 Marina \u2014 berth transfer negotiable with sale. MPA registration in order.</p>",
    keyDetails: [
      { key: "Length",  value: "32 ft"             },
      { key: "Engine",  value: "Twin diesel"       },
      { key: "Berth",   value: "One\u2019 15 Marina, Sentosa" },
    ],
    goodToKnow: [
      { key: "Registration", value: "MPA registered"    },
      { key: "Condition",    value: "Well maintained"   },
      { key: "Berth Transfer", value: "Negotiable"        },
    ],
    coordinates: { lat: 1.2494, lng: 103.8303 },
    seller: SELLERS.marinaYachts,
  },
  {
    id: "veh-sg-boat-02", href: "/listings/veh-sg-boat-02", advId: "31042",
    images: [{ src: img(4), alt: "Jet ski" }],
    priceLabel: "S$14,500",
    title: "2021 Sea-Doo GTI 130 Jet Ski \u2014 Low Hours, Trailer Included",
    detailsLabel: "2021 \u2022 40 HOURS \u2022 PETROL",
    locationLabel: "One\u2019 15 Marina, Sentosa Cove",
    postedAt: daysAgo(3),
    description: "<p>Low-hours <strong>2021 Sea-Doo GTI 130 jet ski</strong>, ideal for weekend leisure. Comes with a road trailer, fitted cover, and life jackets. MPA registration transferable.</p>",
    keyDetails: [
      { key: "Engine Hours", value: "40 hours"       },
      { key: "Engine",       value: "Rotax 1.0L, 130HP" },
      { key: "Trailer",      value: "Included"        },
    ],
    goodToKnow: [
      { key: "Registration", value: "MPA registered, transferable" },
      { key: "Condition",    value: "Excellent"        },
    ],
    coordinates: { lat: 1.2494, lng: 103.8303 },
    seller: SELLERS.marinaYachts,
  },
];

// ── parts_accessories ─────────────────────────────────────────────────────────
export const SG_VEHICLES_PARTS: MockListing[] = [
  {
    id: "veh-sg-parts-01", href: "/listings/veh-sg-parts-01", advId: "31051",
    images: [{ src: img(5), alt: "Car alloy rims" }],
    priceLabel: "S$680",
    title: "17-Inch OEM Alloy Rims Set of 4 \u2014 Fits Honda Civic/Vezel",
    detailsLabel: "ALLOYS \u2022 17 INCH \u2022 SET OF 4",
    locationLabel: "Bukit Batok, Singapore",
    postedAt: daysAgo(2),
    description: "<p>Genuine OEM <strong>17-inch alloy rims</strong> compatible with Honda Civic and Vezel. No dents or cracks, tyres at 65% tread remaining. Island-wide delivery available.</p>",
    keyDetails: [
      { key: "Part Type", value: "Alloy rims \u00d7 4" },
      { key: "Fits",      value: "Honda Civic / Vezel" },
      { key: "Size",      value: "17\" 7J"             },
    ],
    goodToKnow: [
      { key: "Condition", value: "Excellent, no damage" },
      { key: "Delivery",  value: "Island-wide available" },
    ],
    coordinates: { lat: 1.3496, lng: 103.7492 },
    seller: SELLERS.autoPartsSG,
  },
  {
    id: "veh-sg-parts-02", href: "/listings/veh-sg-parts-02", advId: "31052",
    images: [{ src: img(6), alt: "Car battery" }],
    priceLabel: "S$150",
    title: "Amaron 55Ah Maintenance-Free Battery \u2014 New, 2-Year Warranty",
    detailsLabel: "BATTERY \u2022 55AH \u2022 MAINTENANCE-FREE",
    locationLabel: "Bukit Batok, Singapore",
    postedAt: daysAgo(1),
    description: "<p>Brand-new <strong>Amaron 55Ah maintenance-free battery</strong>, suitable for most compact and mid-size cars. Full warranty card included \u2014 same-day installation available on request.</p>",
    keyDetails: [
      { key: "Part Type", value: "Car battery, 55Ah" },
      { key: "Warranty",  value: "2 years"            },
    ],
    goodToKnow: [
      { key: "Condition",     value: "New, sealed"      },
      { key: "Installation",  value: "Same-day, on request" },
    ],
    coordinates: { lat: 1.3496, lng: 103.7492 },
    seller: SELLERS.autoPartsSG,
  },
];

// ── wanted ────────────────────────────────────────────────────────────────────
export const SG_VEHICLES_WANTED: MockListing[] = [
  {
    id: "veh-sg-want-01", href: "/listings/veh-sg-want-01", advId: "31061",
    images: [{ src: img(7), alt: "Wanted sedan" }],
    priceLabel: "Up to S$90,000",
    title: "WANTED: Fuel-Efficient Sedan \u2014 COE Above 5 Years Remaining",
    detailsLabel: "WANTED \u2022 SEDAN \u2022 LONG COE",
    locationLabel: "Singapore",
    postedAt: hrsAgo(7),
    description: "<p>Looking for a <strong>fuel-efficient sedan</strong> with COE having at least 5 years remaining. Budget up to S$90,000. Prefer hybrid or low-mileage petrol \u2014 cash ready, quick decision.</p>",
    keyDetails: [
      { key: "Budget",     value: "Up to S$90,000" },
      { key: "Body Type",  value: "Sedan"          },
      { key: "COE Remaining", value: "5+ years preferred" },
    ],
    goodToKnow: [
      { key: "Cash Buyer", value: "Yes \u2014 immediate" },
      { key: "Timeline",   value: "Within 2 weeks"  },
    ],
    coordinates: { lat: 1.3521, lng: 103.8198 },
    seller: SELLERS.weiJie,
  },
  {
    id: "veh-sg-want-02", href: "/listings/veh-sg-want-02", advId: "31062",
    images: [{ src: img(8), alt: "Wanted scooter" }],
    priceLabel: "Up to S$9,000",
    title: "WANTED: Class 2B Scooter \u2014 Low Mileage, Recent COE Renewal",
    detailsLabel: "WANTED \u2022 SCOOTER \u2022 CLASS 2B",
    locationLabel: "Singapore",
    postedAt: hrsAgo(12),
    description: "<p>Seeking a <strong>Class 2B scooter</strong> with low mileage and a recently renewed COE. Budget up to S$9,000. Ready to view and complete transfer quickly.</p>",
    keyDetails: [
      { key: "Budget",       value: "Up to S$9,000" },
      { key: "Licence Class", value: "Class 2B"       },
    ],
    goodToKnow: [
      { key: "Cash Buyer", value: "Yes" },
      { key: "Timeline",   value: "ASAP" },
    ],
    coordinates: { lat: 1.3521, lng: 103.8198 },
    seller: SELLERS.bikeHub,
  },
];
