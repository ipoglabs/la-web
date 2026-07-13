import type { MockListing } from "@/lib/mock/mock-listing-schema";
import { SELLERS, img, daysAgo, hrsAgo } from "./sellers";

// ── cars ──────────────────────────────────────────────────────────────────────
export const IN_VEHICLES_CARS: MockListing[] = [
  {
    id: "veh-in-car-01", href: "/listings/veh-in-car-01", advId: "21001",
    images: [{ src: img(1), alt: "Hyundai Creta" }, { src: img(2), alt: "Interior" }],
    priceLabel: "\u20b911.2 Lakh",
    title: "2022 Hyundai Creta SX(O) Diesel \u2014 Single Owner, 28,000 KM",
    detailsLabel: "2022 \u2022 28,000 KM \u2022 DIESEL",
    locationLabel: "Koramangala, Bengaluru",
    postedAt: hrsAgo(3),
    description: "<p>Well-maintained <strong>2022 Hyundai Creta SX(O)</strong> diesel automatic, single owner, all service records with authorised Hyundai workshop. Panoramic sunroof, ventilated seats, and BlueLink connected car tech.</p><p>Fresh RC transfer ready. No accident history \u2014 genuine buyers only, no brokers.</p>",
    keyDetails: [
      { key: "Make / Model", value: "Hyundai Creta SX(O)"  },
      { key: "Year",         value: "2022"                  },
      { key: "KM Driven",    value: "28,000 km"             },
      { key: "Fuel Type",    value: "Diesel"                },
      { key: "Transmission", value: "Automatic (Torque)"    },
    ],
    goodToKnow: [
      { key: "Owners",        value: "1st Owner"            },
      { key: "Insurance",     value: "Comprehensive till 2027" },
      { key: "RC Status",     value: "Clear, transfer ready" },
      { key: "Fastag",        value: "Included"             },
      { key: "Finance",       value: "Available via 3rd party" },
    ],
    coordinates: { lat: 12.9352, lng: 77.6245 },
    seller: SELLERS.vikram,
  },
  {
    id: "veh-in-car-02", href: "/listings/veh-in-car-02", advId: "21002",
    images: [{ src: img(3), alt: "Maruti Suzuki Baleno" }, { src: img(4), alt: "Side view" }],
    priceLabel: "\u20b96.8 Lakh",
    title: "2021 Maruti Suzuki Baleno Alpha \u2014 Petrol, 35,000 KM, RTO Verified",
    detailsLabel: "2021 \u2022 35,000 KM \u2022 PETROL",
    locationLabel: "OMR, Chennai",
    postedAt: daysAgo(1),
    description: "<p>Dealer-certified <strong>2021 Maruti Suzuki Baleno Alpha</strong>, petrol manual. 200-point inspection completed, RTO NOC verified, and 1-year warranty included. Smart Play infotainment and auto climate control.</p>",
    keyDetails: [
      { key: "Make / Model", value: "Maruti Suzuki Baleno Alpha" },
      { key: "Year",         value: "2021"                       },
      { key: "KM Driven",    value: "35,000 km"                  },
      { key: "Fuel Type",    value: "Petrol"                     },
      { key: "Transmission", value: "Manual"                     },
    ],
    goodToKnow: [
      { key: "Owners",     value: "2nd Owner"           },
      { key: "Warranty",   value: "1 year dealer warranty" },
      { key: "RC Status",  value: "Clear, RTO NOC verified" },
      { key: "Test Drive", value: "Available at showroom"  },
      { key: "Exchange",   value: "Old car exchange accepted" },
    ],
    coordinates: { lat: 12.9010, lng: 80.2279 },
    seller: SELLERS.deepakMotors,
  },
];

// ── motorcycle ────────────────────────────────────────────────────────────────
export const IN_VEHICLES_MOTORCYCLE: MockListing[] = [
  {
    id: "veh-in-moto-01", href: "/listings/veh-in-moto-01", advId: "21011",
    images: [{ src: img(5), alt: "Royal Enfield Classic 350" }],
    priceLabel: "\u20b91.35 Lakh",
    title: "2022 Royal Enfield Classic 350 \u2014 Stealth Black, 8,000 KM",
    detailsLabel: "2022 \u2022 8,000 KM \u2022 PETROL",
    locationLabel: "Kothrud, Pune",
    postedAt: hrsAgo(6),
    description: "<p>Showroom-condition <strong>2022 Royal Enfield Classic 350</strong> in Stealth Black. Dual-channel ABS, all authorised service done at RE workshop. Genuine accessories: crash guard, saddle stay, and touring seat.</p>",
    keyDetails: [
      { key: "Make / Model", value: "Royal Enfield Classic 350" },
      { key: "Year",         value: "2022"                      },
      { key: "KM Driven",    value: "8,000 km"                  },
      { key: "Engine CC",    value: "349cc single-cylinder"     },
      { key: "ABS",          value: "Dual-channel"              },
    ],
    goodToKnow: [
      { key: "Owners",     value: "1st Owner"                },
      { key: "Insurance",  value: "Comprehensive till 2026"   },
      { key: "RC Status",  value: "Clear"                     },
      { key: "Accessories",value: "Crash guard, touring seat" },
    ],
    coordinates: { lat: 18.5074, lng: 73.8077 },
    seller: SELLERS.royalBikes,
  },
  {
    id: "veh-in-moto-02", href: "/listings/veh-in-moto-02", advId: "21012",
    images: [{ src: img(6), alt: "TVS Jupiter scooter" }],
    priceLabel: "\u20b955,000",
    title: "2023 TVS Jupiter 125 \u2014 Scooter, 5,200 KM, Like New",
    detailsLabel: "2023 \u2022 5,200 KM \u2022 PETROL",
    locationLabel: "Kothrud, Pune",
    postedAt: daysAgo(2),
    description: "<p>Barely-used <strong>2023 TVS Jupiter 125</strong> scooter, ideal for daily city commute. External fuel fill, mobile charging port, and USB-C connectivity. Single owner, all papers in order.</p>",
    keyDetails: [
      { key: "Make / Model", value: "TVS Jupiter 125" },
      { key: "Year",         value: "2023"             },
      { key: "KM Driven",    value: "5,200 km"         },
      { key: "Engine CC",    value: "124.8cc"          },
      { key: "Mileage",      value: "~50 kmpl"         },
    ],
    goodToKnow: [
      { key: "Owners",    value: "1st Owner"    },
      { key: "Insurance", value: "Valid till 2026" },
      { key: "RC Status", value: "Clear"        },
    ],
    coordinates: { lat: 18.5074, lng: 73.8077 },
    seller: SELLERS.royalBikes,
  },
];

// ── van ───────────────────────────────────────────────────────────────────────
export const IN_VEHICLES_VAN: MockListing[] = [
  {
    id: "veh-in-van-01", href: "/listings/veh-in-van-01", advId: "21021",
    images: [{ src: img(7), alt: "Maruti Eeco" }, { src: img(8), alt: "Cargo area" }],
    priceLabel: "\u20b94.6 Lakh",
    title: "2021 Maruti Suzuki Eeco Cargo \u2014 5-Seater, Fleet Maintained",
    detailsLabel: "2021 \u2022 62,000 KM \u2022 PETROL",
    locationLabel: "Narol, Ahmedabad",
    postedAt: daysAgo(3),
    description: "<p>Fleet-maintained <strong>2021 Maruti Eeco Cargo</strong> van, ideal for small business delivery or tour operators. Regular servicing at authorised centre, good tyre condition, and roadworthy fitness certificate valid.</p>",
    keyDetails: [
      { key: "Make / Model", value: "Maruti Suzuki Eeco Cargo" },
      { key: "Year",         value: "2021"                      },
      { key: "KM Driven",    value: "62,000 km"                 },
      { key: "Seating",      value: "5-seater cargo"             },
      { key: "Fuel Type",    value: "Petrol"                     },
    ],
    goodToKnow: [
      { key: "Fitness Cert.", value: "Valid till 2027" },
      { key: "Permit",        value: "Commercial, transferable" },
      { key: "RC Status",     value: "Clear"           },
      { key: "Finance",       value: "Available"       },
    ],
    coordinates: { lat: 23.0032, lng: 72.6296 },
    seller: SELLERS.ashokaFleet,
  },
  {
    id: "veh-in-van-02", href: "/listings/veh-in-van-02", advId: "21022",
    images: [{ src: img(9), alt: "Tempo Traveller" }],
    priceLabel: "\u20b98.9 Lakh",
    title: "2020 Force Tempo Traveller 12-Seater \u2014 Tour Spec, Pushback Seats",
    detailsLabel: "2020 \u2022 1,10,000 KM \u2022 DIESEL",
    locationLabel: "Narol, Ahmedabad",
    postedAt: daysAgo(4),
    description: "<p>Tour-operator spec <strong>2020 Force Tempo Traveller</strong>, 12-seater with pushback recliner seats, LCD screen, and roof-mounted AC. All-India tourist permit valid. Well maintained fleet vehicle.</p>",
    keyDetails: [
      { key: "Make / Model", value: "Force Tempo Traveller 12-Seater" },
      { key: "Year",         value: "2020"                            },
      { key: "KM Driven",    value: "1,10,000 km"                     },
      { key: "Seating",      value: "12 pushback seats"                },
      { key: "Fuel Type",    value: "Diesel"                           },
    ],
    goodToKnow: [
      { key: "Permit",    value: "All-India Tourist Permit" },
      { key: "Fitness",   value: "Valid till 2026"          },
      { key: "AC",        value: "Roof-mounted, working"    },
      { key: "RC Status", value: "Clear"                    },
    ],
    coordinates: { lat: 23.0032, lng: 72.6296 },
    seller: SELLERS.ashokaFleet,
  },
];

// ── truck ─────────────────────────────────────────────────────────────────────
export const IN_VEHICLES_TRUCK: MockListing[] = [
  {
    id: "veh-in-truck-01", href: "/listings/veh-in-truck-01", advId: "21031",
    images: [{ src: img(1), alt: "Tata 407 truck" }],
    priceLabel: "\u20b96.2 Lakh",
    title: "2019 Tata 407 Gold \u2014 Mini Truck, Single Owner, All Papers Clear",
    detailsLabel: "2019 \u2022 1,80,000 KM \u2022 DIESEL",
    locationLabel: "Narol, Ahmedabad",
    postedAt: daysAgo(5),
    description: "<p>Reliable <strong>2019 Tata 407 Gold mini truck</strong>, single owner, used for local goods transport. Fresh tyres fitted, National Permit valid, and RTO fitness certificate up to date.</p>",
    keyDetails: [
      { key: "Make / Model", value: "Tata 407 Gold" },
      { key: "Year",         value: "2019"           },
      { key: "KM Driven",    value: "1,80,000 km"    },
      { key: "GVW",          value: "4,900 kg"       },
      { key: "Fuel Type",    value: "Diesel"         },
    ],
    goodToKnow: [
      { key: "Permit",   value: "National Permit valid"   },
      { key: "Fitness",  value: "Valid till 2026"         },
      { key: "RC Status",value: "Clear, single owner"     },
      { key: "Finance",  value: "Available"               },
    ],
    coordinates: { lat: 23.0032, lng: 72.6296 },
    seller: SELLERS.ashokaFleet,
  },
  {
    id: "veh-in-truck-02", href: "/listings/veh-in-truck-02", advId: "21032",
    images: [{ src: img(2), alt: "Ashok Leyland Dost" }],
    priceLabel: "\u20b93.8 Lakh",
    title: "2020 Ashok Leyland Dost+ \u2014 Pickup, Well Maintained",
    detailsLabel: "2020 \u2022 95,000 KM \u2022 DIESEL",
    locationLabel: "Narol, Ahmedabad",
    postedAt: daysAgo(6),
    description: "<p>Well-maintained <strong>2020 Ashok Leyland Dost+</strong> pickup, ideal for small trade goods movement. Good tyre condition, regularly serviced, and ready for immediate transfer.</p>",
    keyDetails: [
      { key: "Make / Model", value: "Ashok Leyland Dost+" },
      { key: "Year",         value: "2020"                },
      { key: "KM Driven",    value: "95,000 km"           },
      { key: "GVW",          value: "1,655 kg payload"    },
      { key: "Fuel Type",    value: "Diesel"               },
    ],
    goodToKnow: [
      { key: "Permit",   value: "State Permit valid" },
      { key: "Fitness",  value: "Valid till 2027"     },
      { key: "RC Status",value: "Clear"               },
    ],
    coordinates: { lat: 23.0032, lng: 72.6296 },
    seller: SELLERS.ashokaFleet,
  },
];

// ── boats ─────────────────────────────────────────────────────────────────────
export const IN_VEHICLES_BOATS: MockListing[] = [
  {
    id: "veh-in-boat-01", href: "/listings/veh-in-boat-01", advId: "21041",
    images: [{ src: img(3), alt: "Kerala houseboat" }],
    priceLabel: "\u20b932 Lakh",
    title: "2-Bedroom Kerala Houseboat \u2014 Alleppey Backwaters, Fully Fitted",
    detailsLabel: "2 BEDROOM \u2022 BACKWATER \u2022 TOURISM READY",
    locationLabel: "Alleppey, Kerala",
    postedAt: daysAgo(4),
    description: "<p>Traditional <strong>Kettuvallam-style houseboat</strong> with 2 air-conditioned bedrooms, upper deck seating, and fully equipped kitchen. Currently operating tourist charters on Alleppey backwaters \u2014 sold with existing tourism licence.</p>",
    keyDetails: [
      { key: "Type",        value: "Kettuvallam houseboat" },
      { key: "Bedrooms",    value: "2, air-conditioned"    },
      { key: "Capacity",    value: "4 guests + 2 crew"     },
      { key: "Hull",        value: "Coir rope, bamboo, teak" },
    ],
    goodToKnow: [
      { key: "Licence",   value: "Kerala Tourism registered" },
      { key: "Condition", value: "Operational, well maintained" },
      { key: "Mooring",   value: "Alleppey jetty included"  },
    ],
    coordinates: { lat: 9.4981, lng: 76.3388 },
    seller: SELLERS.alleppeyHouseboats,
  },
  {
    id: "veh-in-boat-02", href: "/listings/veh-in-boat-02", advId: "21042",
    images: [{ src: img(4), alt: "Fishing boat" }],
    priceLabel: "\u20b93.4 Lakh",
    title: "22ft Fibreglass Fishing Boat \u2014 With Yamaha 25HP Outboard",
    detailsLabel: "22FT \u2022 FIBREGLASS \u2022 OUTBOARD ENGINE",
    locationLabel: "Alleppey, Kerala",
    postedAt: daysAgo(7),
    description: "<p>Sturdy <strong>22ft fibreglass fishing boat</strong> with Yamaha 25HP outboard motor, ice box, and net storage. Well suited for coastal fishing or backwater transport. Registered with local fisheries department.</p>",
    keyDetails: [
      { key: "Length",  value: "22 ft"                 },
      { key: "Hull",    value: "Fibreglass"             },
      { key: "Engine",  value: "Yamaha 25HP outboard"   },
      { key: "Capacity",value: "6 persons + gear"       },
    ],
    goodToKnow: [
      { key: "Registration", value: "Fisheries dept. registered" },
      { key: "Condition",    value: "Good, recently serviced"    },
    ],
    coordinates: { lat: 9.4981, lng: 76.3388 },
    seller: SELLERS.alleppeyHouseboats,
  },
];

// ── parts_accessories ─────────────────────────────────────────────────────────
export const IN_VEHICLES_PARTS: MockListing[] = [
  {
    id: "veh-in-parts-01", href: "/listings/veh-in-parts-01", advId: "21051",
    images: [{ src: img(5), alt: "Alloy wheels" }],
    priceLabel: "\u20b912,500",
    title: "15-Inch Alloy Wheels Set of 4 \u2014 Fits Maruti Swift/Baleno",
    detailsLabel: "ALLOYS \u2022 15 INCH \u2022 SET OF 4",
    locationLabel: "Kashmere Gate, Delhi",
    postedAt: daysAgo(2),
    description: "<p>Genuine <strong>15-inch alloy wheel set</strong> compatible with Maruti Swift, Baleno, and similar hatchbacks. No cracks or kerb damage \u2014 sold with nearly-new tyres at 80% tread.</p>",
    keyDetails: [
      { key: "Part Type", value: "Alloy wheels \u00d7 4" },
      { key: "Fits",      value: "Maruti Swift / Baleno" },
      { key: "Size",      value: "15\" 6J"               },
      { key: "OEM / Aftermarket", value: "Aftermarket, branded" },
    ],
    goodToKnow: [
      { key: "Condition", value: "Excellent, no damage" },
      { key: "Shipping",  value: "Pan-India courier available" },
    ],
    coordinates: { lat: 28.6667, lng: 77.2273 },
    seller: SELLERS.autoPartsHub,
  },
  {
    id: "veh-in-parts-02", href: "/listings/veh-in-parts-02", advId: "21052",
    images: [{ src: img(6), alt: "Car battery" }],
    priceLabel: "\u20b94,200",
    title: "Exide 65Ah Car Battery \u2014 New, Sealed, 3-Year Warranty",
    detailsLabel: "BATTERY \u2022 65AH \u2022 SEALED MAINTENANCE-FREE",
    locationLabel: "Kashmere Gate, Delhi",
    postedAt: daysAgo(1),
    description: "<p>Brand-new sealed <strong>Exide 65Ah maintenance-free battery</strong> suitable for most sedans and SUVs. Full manufacturer warranty card included \u2014 genuine dealer stock, not grey-market.</p>",
    keyDetails: [
      { key: "Part Type", value: "Car battery, 65Ah"  },
      { key: "Brand",     value: "Exide"              },
      { key: "Warranty",  value: "3 years manufacturer"},
    ],
    goodToKnow: [
      { key: "Condition", value: "New, sealed" },
      { key: "Old Battery Exchange", value: "Accepted for discount" },
    ],
    coordinates: { lat: 28.6667, lng: 77.2273 },
    seller: SELLERS.autoPartsHub,
  },
];

// ── wanted ────────────────────────────────────────────────────────────────────
export const IN_VEHICLES_WANTED: MockListing[] = [
  {
    id: "veh-in-want-01", href: "/listings/veh-in-want-01", advId: "21061",
    images: [{ src: img(7), alt: "Wanted hatchback" }],
    priceLabel: "Up to \u20b96 Lakh",
    title: "WANTED: Petrol Hatchback \u2014 Single Owner, Under 40,000 KM",
    detailsLabel: "WANTED \u2022 HATCHBACK \u2022 PETROL",
    locationLabel: "Bengaluru",
    postedAt: hrsAgo(9),
    description: "<p>Looking for a <strong>petrol hatchback</strong> in good condition, single owner preferred, under 40,000 km. Budget up to \u20b96 lakh. Cash-ready, can complete RC transfer immediately.</p>",
    keyDetails: [
      { key: "Budget",    value: "Up to \u20b96 Lakh" },
      { key: "Body Type", value: "Hatchback"      },
      { key: "KM Driven", value: "< 40,000 preferred" },
      { key: "Fuel",      value: "Petrol"         },
    ],
    goodToKnow: [
      { key: "Cash Buyer", value: "Yes \u2014 immediate" },
      { key: "Timeline",   value: "Within 2 weeks"   },
    ],
    coordinates: { lat: 12.9716, lng: 77.5946 },
    seller: SELLERS.vikram,
  },
  {
    id: "veh-in-want-02", href: "/listings/veh-in-want-02", advId: "21062",
    images: [{ src: img(8), alt: "Wanted commuter bike" }],
    priceLabel: "Up to \u20b975,000",
    title: "WANTED: 125cc Commuter Bike \u2014 Good Mileage, Clear Papers",
    detailsLabel: "WANTED \u2022 COMMUTER BIKE \u2022 125CC",
    locationLabel: "Pune",
    postedAt: hrsAgo(14),
    description: "<p>Need a <strong>125cc commuter motorcycle</strong> with good fuel economy for daily office commute. Budget up to \u20b975,000. Papers must be clear with valid insurance.</p>",
    keyDetails: [
      { key: "Budget",    value: "Up to \u20b975,000" },
      { key: "Engine CC", value: "125cc"          },
      { key: "Mileage",   value: "> 45 kmpl preferred" },
    ],
    goodToKnow: [
      { key: "Cash Buyer", value: "Yes" },
      { key: "Timeline",   value: "ASAP" },
    ],
    coordinates: { lat: 18.5204, lng: 73.8567 },
    seller: SELLERS.royalBikes,
  },
];
