/**
 * lib/mock/mock-listing-schema.ts
 *
 * Re-exports the canonical types from @/types/listing as their legacy
 * "Mock" aliases — all category data files import from here unchanged.
 *
 * The full schema, field rules, and integration notes live in:
 *   → types/listing.ts
 *
 * ─── FIELD MAPPING TO CONSUMERS ──────────────────────────────────────────────
 *  Listing field      │ LaThumbnailListingCard │ [listingId]/page.tsx
 *  ───────────────────┼────────────────────────┼──────────────────────────────
 *  priceLabel         │ priceLabel ✓           │ rename → `price` on destruct
 *  locationLabel      │ locationLabel ✓        │ rename → `location` on destruct
 *  keyDetails         │ —                      │ rename → `keyDetails2` on destruct
 *  id, href, images,  │                        │
 *  title, priceSuffix,│ all match directly ✓   │ all match directly ✓
 *  detailsLabel,      │                        │
 *  postedAt, status   │                        │
 * ─────────────────────────────────────────────────────────────────────────────
 */

import type { Listing, Seller } from "@/types/listing";

/** @deprecated Import Seller from "@/types/listing" directly. */
export type MockListingSeller = Seller;

/** @deprecated Import Listing from "@/types/listing" directly. */
export type MockListing = Listing;

// ─────────────────────────────────────────────────────────────────────────────
// SKELETON RULES (apply to all categories)
//
//  • Copy the relevant skeleton when adding a new listing
//  • Every field must be filled — no gaps, no undefined required fields
//  • seller must reference a named constant from the SELLERS pool in the
//    corresponding mock-listing-<category>.ts file — never inline
//  • images[0] = cover shown in the grid thumbnail
//  • postedAt = ISO 8601 string
//  • keyDetails keys must match the subcategory (not copied blindly from another)
//  • goodToKnow keys = factual policy / availability info only
// ─────────────────────────────────────────────────────────────────────────────

// ─── 1. PROPERTY ─────────────────────────────────────────────────────────────
// Subcategories: to_rent | to_buy | room_rental | for_students |
//                commercial | holiday_rental | land | wanted
// File: lib/mock/mock-listing-property.ts
// ─────────────────────────────────────────────────────────────────────────────
export const MOCK_PROPERTY_LISTING_SKELETON: MockListing = {

  // ── Identity ──────────────────────────────────────────────────────────────
  id:    "prop-TYPE-00",             // e.g. "prop-rent-01"
  href:  "/listings/prop-TYPE-00",   // always "/listings/<id>"
  advId: "00000",                    // 5-digit display Ad ID

  // ── Thumbnail card ────────────────────────────────────────────────────────
  images: [
    { src: "/img/img1.jpg", alt: "Cover photo"  },   // [0] = cover in grid
    { src: "/img/img2.jpg", alt: "Second photo" },
    { src: "/img/img3.jpg", alt: "Third photo"  },
  ],
  priceLabel:    "£0,000",           // formatted price with currency symbol
  priceSuffix:   "/ mo",            // "/ mo" | "/ wk" | "/ night" | omit for buy/sale/land
  title:         "Property Title — Key Features Summary",
  detailsLabel:  "3 BEDS • 2 BATHS • APARTMENT",     // ALL CAPS, "•" separator
  locationLabel: "Area, City",
  postedAt:      "2026-06-20T09:00:00Z",              // ISO 8601
  status:        "active",          // "active" | "closed" | "off-market"

  // ── Detail page ───────────────────────────────────────────────────────────
  description: [
    "<p>Opening paragraph — key property features, size, condition, highlights.</p>",
    "<p>Second paragraph — area context, transport links, nearby amenities.</p>",
    "<ul><li>Bullet feature 1</li><li>Bullet feature 2</li><li>Bullet feature 3</li></ul>",
  ].join("\n"),

  keyDetails: [
    { key: "Furnishing",       value: "Furnished"   },   // property-specific keys
    { key: "Security Deposit", value: "£0,000"      },
    { key: "Available From",   value: "Immediately" },
    { key: "Listed By",        value: "Owner"       },
    { key: "Pet Friendly",     value: "No"          },
  ],

  goodToKnow: [
    { key: "Available", value: "Immediately"  },
    { key: "Agent Fee", value: "No"           },
    { key: "Smoking",   value: "Not Allowed"  },
    { key: "Parking",   value: "Available"    },
    { key: "Security",  value: "24/7 CCTV"   },
  ],

  coordinates: { lat: 51.5074, lng: -0.1278 },         // realistic for locationLabel

  seller: {                                             // MUST use named SELLERS constant
    name: "Seller Name", role: "Owner", location: "Area, City",
    tagline: "Short seller tagline here",
    memberSince: "2024", activeListings: 1, lastActive: "1h ago",
    likes: "0", followers: "0", verified: false,
    cover: "/img/img1.jpg", avatar: "/img/img2.jpg",
  },
};

// ─── 2. VEHICLES ─────────────────────────────────────────────────────────────
// Subcategories: cars | motorcycle | van | truck | boats | parts | wanted
// File: lib/mock/mock-listing-vehicles.ts
// ─────────────────────────────────────────────────────────────────────────────
export const MOCK_VEHICLE_LISTING_SKELETON: MockListing = {

  // ── Identity ──────────────────────────────────────────────────────────────
  id:    "veh-TYPE-00",              // e.g. "veh-car-01"
  href:  "/listings/veh-TYPE-00",
  advId: "00000",

  // ── Thumbnail card ────────────────────────────────────────────────────────
  images: [
    { src: "/img/img1.jpg", alt: "Front view"  },    // [0] = cover in grid
    { src: "/img/img2.jpg", alt: "Side view"   },
    { src: "/img/img3.jpg", alt: "Interior"    },
    { src: "/img/img4.jpg", alt: "Engine bay"  },
  ],
  priceLabel:    "£0,000",           // for sale = no suffix; for rent = "/ day" | "/ mo"
  // priceSuffix omitted for standard sale listings
  title:         "Year Make Model — Trim Level, Key Feature",    // e.g. "2022 Ford Focus — ST-Line, Low Miles"
  detailsLabel:  "2022 • 45,000 MILES • DIESEL",                 // YEAR • MILEAGE • FUEL
  locationLabel: "Town, County",
  postedAt:      "2026-06-20T09:00:00Z",
  status:        "active",

  // ── Detail page ───────────────────────────────────────────────────────────
  description: [
    "<p>Opening paragraph — make, model, year, condition, main highlights.</p>",
    "<p>Second paragraph — ownership history, service record, reason for sale.</p>",
    "<ul><li>Key spec 1</li><li>Key spec 2</li><li>Key spec 3</li></ul>",
  ].join("\n"),

  keyDetails: [
    { key: "Make / Model",  value: "Make Model"    },   // vehicle-specific keys
    { key: "Year",          value: "2022"          },
    { key: "Mileage",       value: "45,000 miles"  },
    { key: "Fuel Type",     value: "Diesel"        },
    { key: "Transmission",  value: "Automatic"     },
    { key: "Body Type",     value: "Hatchback"     },
  ],

  goodToKnow: [
    { key: "Condition",      value: "Excellent"       },
    { key: "MOT Expiry",     value: "Jun 2027"        },
    { key: "Service Hist.",  value: "Full, 6 stamps"  },
    { key: "Owners",         value: "2"               },
    { key: "Part Exchange",  value: "Considered"      },
  ],

  coordinates: { lat: 51.5074, lng: -0.1278 },

  seller: {                                             // MUST use named SELLERS constant
    name: "Seller Name", role: "Owner", location: "Town, County",
    tagline: "Short seller tagline here",
    memberSince: "2024", activeListings: 1, lastActive: "1h ago",
    likes: "0", followers: "0", verified: false,
    cover: "/img/img1.jpg", avatar: "/img/img2.jpg",
  },
};

// ─── 3. JOBS ─────────────────────────────────────────────────────────────────
// Subcategories: full_time | part_time | freelance | internship
// File: lib/mock/mock-listing-jobs.ts
// ─────────────────────────────────────────────────────────────────────────────
export const MOCK_JOB_LISTING_SKELETON: MockListing = {

  // ── Identity ──────────────────────────────────────────────────────────────
  id:    "job-TYPE-00",              // e.g. "job-fulltime-01"
  href:  "/listings/job-TYPE-00",
  advId: "00000",

  // ── Thumbnail card ────────────────────────────────────────────────────────
  images: [
    { src: "/img/img1.jpg", alt: "Company logo or office" },  // [0] = cover in grid
  ],
  priceLabel:    "£00,000",          // annual salary — "£45,000" | "£20–25/hr" | "Competitive"
  priceSuffix:   "/ yr",            // "/ yr" | "/ hr" | "/ day" | omit if salary = "Competitive"
  title:         "Job Title — Company Name",                   // e.g. "Senior React Dev — Acme Ltd"
  detailsLabel:  "FULL TIME • REMOTE • SOFTWARE",              // CONTRACT • ARRANGEMENT • FIELD
  locationLabel: "City or Remote",
  postedAt:      "2026-06-20T09:00:00Z",
  status:        "active",

  // ── Detail page ───────────────────────────────────────────────────────────
  description: [
    "<p>Opening paragraph — role summary, team context, what you will be doing.</p>",
    "<p>Second paragraph — company background, culture, benefits.</p>",
    "<ul><li>Requirement 1</li><li>Requirement 2</li><li>Requirement 3</li></ul>",
  ].join("\n"),

  keyDetails: [
    { key: "Contract",    value: "Permanent"        },   // job-specific keys
    { key: "Hours",       value: "Full Time (40h)"  },
    { key: "Arrangement", value: "Hybrid"           },
    { key: "Start Date",  value: "ASAP"             },
    { key: "Experience",  value: "3+ years"         },
  ],

  goodToKnow: [
    { key: "Salary",       value: "£00,000 / yr"      },
    { key: "Visa Sponsor", value: "No"                },
    { key: "Equity",       value: "Not offered"       },
    { key: "Notice",       value: "1 month"           },
    { key: "Apply Via",    value: "LokalAds message"  },
  ],

  coordinates: { lat: 51.5074, lng: -0.1278 },         // office location (or central city if remote)

  seller: {                                             // MUST use named SELLERS constant
    name: "Recruiter / Company Name", role: "Recruiter", location: "City",
    tagline: "Short company or recruiter tagline",
    memberSince: "2024", activeListings: 1, lastActive: "1h ago",
    likes: "0", followers: "0", verified: false,
    cover: "/img/img1.jpg", avatar: "/img/img2.jpg",
  },
};

// ─── 4. SERVICES ─────────────────────────────────────────────────────────────
// Subcategories: home_services | tutoring | beauty | events | it_tech | ...
// File: lib/mock/mock-listing-services.ts
// ─────────────────────────────────────────────────────────────────────────────
export const MOCK_SERVICE_LISTING_SKELETON: MockListing = {

  // ── Identity ──────────────────────────────────────────────────────────────
  id:    "svc-TYPE-00",              // e.g. "svc-home-01"
  href:  "/listings/svc-TYPE-00",
  advId: "00000",

  // ── Thumbnail card ────────────────────────────────────────────────────────
  images: [
    { src: "/img/img1.jpg", alt: "Service photo"    },   // [0] = cover in grid
    { src: "/img/img2.jpg", alt: "Work sample"      },
  ],
  priceLabel:    "£00",              // "£50" | "From £25" | "POA"
  priceSuffix:   "/ hr",            // "/ hr" | "/ day" | "/ job" | "/ session"
  title:         "Service Title — Key Selling Point",          // e.g. "Certified Electrician — Same-Day Callouts"
  detailsLabel:  "HOME SERVICES • CERTIFIED • LONDON",         // CATEGORY • QUALIFIER • AREA
  locationLabel: "Area, City",
  postedAt:      "2026-06-20T09:00:00Z",
  status:        "active",

  // ── Detail page ───────────────────────────────────────────────────────────
  description: [
    "<p>Opening paragraph — what the service covers, who provides it, key credentials.</p>",
    "<p>Second paragraph — area coverage, availability, how to book.</p>",
    "<ul><li>Included service 1</li><li>Included service 2</li><li>Included service 3</li></ul>",
  ].join("\n"),

  keyDetails: [
    { key: "Service Type",  value: "Plumbing"           },   // service-specific keys
    { key: "Coverage",      value: "Greater London"     },
    { key: "Availability",  value: "Mon–Sat 8am–6pm"   },
    { key: "Response Time", value: "Same day"           },
    { key: "Qualifications",value: "Gas Safe Registered"},
  ],

  goodToKnow: [
    { key: "Call-Out Fee",  value: "£0 — free quote"   },
    { key: "Payment",       value: "Cash / Card / BACS" },
    { key: "Insurance",     value: "Fully insured"      },
    { key: "Reviews",       value: "4.9 ★ (120 reviews)"},
    { key: "Book Via",      value: "LokalAds message"   },
  ],

  coordinates: { lat: 51.5074, lng: -0.1278 },

  seller: {                                             // MUST use named SELLERS constant
    name: "Provider Name", role: "Service Provider", location: "Area, City",
    tagline: "Short provider tagline here",
    memberSince: "2024", activeListings: 1, lastActive: "1h ago",
    likes: "0", followers: "0", verified: false,
    cover: "/img/img1.jpg", avatar: "/img/img2.jpg",
  },
};
