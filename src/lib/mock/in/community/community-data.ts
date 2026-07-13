import type { MockListing } from "@/lib/mock/mock-listing-schema";
import { SELLERS, img, daysAgo, hrsAgo } from "./sellers";

// ── lost_found ────────────────────────────────────────────────────────────────
export const IN_COMMUNITY_LOST_FOUND: MockListing[] = [
  {
    id: "community-in-lostfound-01", href: "/listings/community-in-lostfound-01", advId: "26001",
    images: [{ src: img(1), alt: "Lost wallet" }],
    priceLabel: "Free",
    title: "Lost Brown Leather Wallet Near Vasant Kunj Metro Station",
    detailsLabel: "LOST & FOUND \u2022 WALLET \u2022 DELHI",
    locationLabel: "Vasant Kunj, Delhi",
    postedAt: hrsAgo(3),
    description: "<p>Lost a brown leather wallet near Vasant Kunj Metro Station on Tuesday evening. Contains ID cards and a few photographs of sentimental value. Reward offered.</p>",
    keyDetails: [
      { key: "Item",     value: "Brown leather wallet" },
      { key: "Location", value: "Vasant Kunj Metro"     },
    ],
    goodToKnow: [
      { key: "Reward", value: "\u20b91,000 offered" },
    ],
    coordinates: { lat: 28.5244, lng: 77.1591 },
    seller: SELLERS.neighbourhoodWatch,
  },
  {
    id: "community-in-lostfound-02", href: "/listings/community-in-lostfound-02", advId: "26002",
    images: [{ src: img(2), alt: "Found dog" }],
    priceLabel: "Free",
    title: "Found Golden Retriever Near Kothrud \u2014 Looking for Owner",
    detailsLabel: "LOST & FOUND \u2022 PET \u2022 PUNE",
    locationLabel: "Kothrud, Pune",
    postedAt: daysAgo(1),
    description: "<p>Found a friendly golden retriever wandering near Kothrud without a collar tag. Currently being cared for. Please contact if this is your pet.</p>",
    keyDetails: [
      { key: "Animal",   value: "Golden Retriever" },
      { key: "Found At", value: "Kothrud"          },
    ],
    goodToKnow: [
      { key: "Condition", value: "Healthy, no visible injuries" },
    ],
    coordinates: { lat: 18.5074, lng: 73.8077 },
    seller: SELLERS.familySupportCircle,
  },
];

// ── events ────────────────────────────────────────────────────────────────────
export const IN_COMMUNITY_EVENTS: MockListing[] = [
  {
    id: "community-in-events-01", href: "/listings/community-in-events-01", advId: "26011",
    images: [{ src: img(3), alt: "Diwali mela" }],
    priceLabel: "Free entry",
    title: "Diwali Mela 2025 \u2014 Food Stalls, Music & Fireworks",
    detailsLabel: "EVENT \u2022 FESTIVAL \u2022 PUNE",
    locationLabel: "Koregaon Park, Pune",
    postedAt: hrsAgo(5),
    description: "<p>Annual Diwali Mela with food stalls from local vendors, live music performances, and a fireworks display. Free entry for all residents.</p>",
    keyDetails: [
      { key: "Date",  value: "2 Nov 2025, 5 PM" },
      { key: "Venue", value: "Koregaon Park grounds" },
    ],
    goodToKnow: [
      { key: "Parking", value: "Available at community hall" },
    ],
    coordinates: { lat: 18.5362, lng: 73.8938 },
    seller: SELLERS.puneEventsCollective,
  },
  {
    id: "community-in-events-02", href: "/listings/community-in-events-02", advId: "26012",
    images: [{ src: img(4), alt: "Marathon" }],
    priceLabel: "\u20b9500 registration",
    title: "Weekend Community Marathon \u2014 5K & 10K Categories",
    detailsLabel: "EVENT \u2022 SPORTS \u2022 PUNE",
    locationLabel: "Koregaon Park, Pune",
    postedAt: daysAgo(2),
    description: "<p>Community-organised marathon with 5K and 10K categories, open to all ages. Registration includes a t-shirt and refreshments.</p>",
    keyDetails: [
      { key: "Categories", value: "5K & 10K" },
      { key: "Date",       value: "16 Nov 2025, 6 AM" },
    ],
    goodToKnow: [
      { key: "Includes", value: "T-shirt + refreshments" },
    ],
    coordinates: { lat: 18.5362, lng: 73.8938 },
    seller: SELLERS.puneEventsCollective,
  },
];

// ── volunteering ──────────────────────────────────────────────────────────────
export const IN_COMMUNITY_VOLUNTEERING: MockListing[] = [
  {
    id: "community-in-volunteer-01", href: "/listings/community-in-volunteer-01", advId: "26021",
    images: [{ src: img(5), alt: "Volunteers cleaning park" }],
    priceLabel: "Volunteer opportunity",
    title: "Weekend Park Clean-Up Drive \u2014 Volunteers Needed",
    detailsLabel: "VOLUNTEERING \u2022 ENVIRONMENT \u2022 BENGALURU",
    locationLabel: "Indiranagar, Bengaluru",
    postedAt: hrsAgo(8),
    description: "<p>Join our weekend clean-up drive at the neighbourhood park. Gloves and bags provided. All ages welcome, great for families.</p>",
    keyDetails: [
      { key: "Date",     value: "Every Saturday, 7 AM" },
      { key: "Provided", value: "Gloves & bags"        },
    ],
    goodToKnow: [
      { key: "Sign-up", value: "Not required, just show up" },
    ],
    coordinates: { lat: 12.9716, lng: 77.6412 },
    seller: SELLERS.ngoVolunteerHub,
  },
  {
    id: "community-in-volunteer-02", href: "/listings/community-in-volunteer-02", advId: "26022",
    images: [{ src: img(6), alt: "Volunteers teaching" }],
    priceLabel: "Volunteer opportunity",
    title: "Weekend Tutors Needed for Underprivileged Children",
    detailsLabel: "VOLUNTEERING \u2022 EDUCATION \u2022 BENGALURU",
    locationLabel: "Indiranagar, Bengaluru",
    postedAt: daysAgo(1),
    description: "<p>Looking for weekend volunteer tutors to teach basic maths and English to underprivileged children at our community centre.</p>",
    keyDetails: [
      { key: "Commitment", value: "2 hours/weekend" },
      { key: "Subjects",   value: "Maths & English"  },
    ],
    goodToKnow: [
      { key: "Training", value: "Orientation session provided" },
    ],
    coordinates: { lat: 12.9716, lng: 77.6412 },
    seller: SELLERS.ngoVolunteerHub,
  },
];

// ── announcement ──────────────────────────────────────────────────────────────
export const IN_COMMUNITY_ANNOUNCEMENT: MockListing[] = [
  {
    id: "community-in-announce-01", href: "/listings/community-in-announce-01", advId: "26031",
    images: [{ src: img(7), alt: "Water supply notice" }],
    priceLabel: "Notice",
    title: "Water Supply Disruption Notice \u2014 Banjara Hills, 12 Nov",
    detailsLabel: "ANNOUNCEMENT \u2022 UTILITY \u2022 HYDERABAD",
    locationLabel: "Banjara Hills, Hyderabad",
    postedAt: hrsAgo(2),
    description: "<p>Water supply will be temporarily disrupted in Banjara Hills area on 12 Nov due to pipeline maintenance work. Expected restoration by evening.</p>",
    keyDetails: [
      { key: "Date",     value: "12 Nov 2025" },
      { key: "Duration", value: "8 AM \u2013 6 PM"  },
    ],
    goodToKnow: [
      { key: "Contact", value: "Local water board helpline" },
    ],
    coordinates: { lat: 17.4126, lng: 78.4483 },
    seller: SELLERS.generalNoticeBoard,
  },
  {
    id: "community-in-announce-02", href: "/listings/community-in-announce-02", advId: "26032",
    images: [{ src: img(8), alt: "Society AGM" }],
    priceLabel: "Notice",
    title: "Residents' Society Annual General Meeting \u2014 20 Nov",
    detailsLabel: "ANNOUNCEMENT \u2022 SOCIETY \u2022 HYDERABAD",
    locationLabel: "Banjara Hills, Hyderabad",
    postedAt: daysAgo(3),
    description: "<p>Annual General Meeting of the residents' welfare society scheduled for 20 Nov. All residents encouraged to attend and vote on budget items.</p>",
    keyDetails: [
      { key: "Date",  value: "20 Nov 2025, 6 PM" },
      { key: "Venue", value: "Community Hall"    },
    ],
    goodToKnow: [
      { key: "Agenda", value: "Budget approval & elections" },
    ],
    coordinates: { lat: 17.4126, lng: 78.4483 },
    seller: SELLERS.generalNoticeBoard,
  },
];

// ── child_family ──────────────────────────────────────────────────────────────
export const IN_COMMUNITY_CHILD_FAMILY: MockListing[] = [
  {
    id: "community-in-childfamily-01", href: "/listings/community-in-childfamily-01", advId: "26041",
    images: [{ src: img(9), alt: "Parenting support group" }],
    priceLabel: "Free to join",
    title: "New Parents Support Group \u2014 Meets Every Sunday",
    detailsLabel: "CHILD & FAMILY \u2022 SUPPORT GROUP \u2022 PUNE",
    locationLabel: "Kothrud, Pune",
    postedAt: hrsAgo(10),
    description: "<p>A support group for new parents to share experiences, tips, and support each other. Meets every Sunday at the community centre.</p>",
    keyDetails: [
      { key: "Meets",   value: "Every Sunday, 10 AM" },
      { key: "Format",  value: "In-person + WhatsApp group" },
    ],
    goodToKnow: [
      { key: "Childcare", value: "Play area available on-site" },
    ],
    coordinates: { lat: 18.5074, lng: 73.8077 },
    seller: SELLERS.familySupportCircle,
  },
  {
    id: "community-in-childfamily-02", href: "/listings/community-in-childfamily-02", advId: "26042",
    images: [{ src: img(1), alt: "Babysitting exchange" }],
    priceLabel: "Free to join",
    title: "Neighbourhood Babysitting Exchange Circle",
    detailsLabel: "CHILD & FAMILY \u2022 BABYSITTING \u2022 PUNE",
    locationLabel: "Kothrud, Pune",
    postedAt: daysAgo(2),
    description: "<p>A trusted circle of local families exchanging babysitting favours on a rotating basis \u2014 no money involved, just mutual help.</p>",
    keyDetails: [
      { key: "Members", value: "12 families currently" },
    ],
    goodToKnow: [
      { key: "Vetting", value: "Introduction meeting required" },
    ],
    coordinates: { lat: 18.5074, lng: 73.8077 },
    seller: SELLERS.familySupportCircle,
  },
];

// ── general_others ────────────────────────────────────────────────────────────
export const IN_COMMUNITY_GENERAL_OTHERS: MockListing[] = [
  {
    id: "community-in-general-01", href: "/listings/community-in-general-01", advId: "26051",
    images: [{ src: img(2), alt: "Book club" }],
    priceLabel: "Free to join",
    title: "Monthly Book Club \u2014 New Members Welcome",
    detailsLabel: "GENERAL \u2022 BOOK CLUB \u2022 CHENNAI",
    locationLabel: "Adyar, Chennai",
    postedAt: hrsAgo(14),
    description: "<p>Friendly monthly book club meeting at a local cafe to discuss a chosen book. New members always welcome, no commitment required.</p>",
    keyDetails: [
      { key: "Meets",  value: "First Saturday of the month" },
      { key: "Genre",  value: "Rotates monthly"             },
    ],
    goodToKnow: [
      { key: "Current Book", value: "Announced on WhatsApp group" },
    ],
    coordinates: { lat: 13.0067, lng: 80.2206 },
    seller: SELLERS.residentAnnouncer,
  },
  {
    id: "community-in-general-02", href: "/listings/community-in-general-02", advId: "26052",
    images: [{ src: img(3), alt: "Carpool group" }],
    priceLabel: "Free to join",
    title: "Office Carpool Group \u2014 Adyar to OMR Route",
    detailsLabel: "GENERAL \u2022 CARPOOL \u2022 CHENNAI",
    locationLabel: "Adyar, Chennai",
    postedAt: daysAgo(4),
    description: "<p>Looking for more members to join our daily carpool group along the Adyar to OMR route. Split fuel costs, reduce your commute stress.</p>",
    keyDetails: [
      { key: "Route",     value: "Adyar to OMR" },
      { key: "Timing",    value: "8 AM & 6 PM daily" },
    ],
    goodToKnow: [
      { key: "Cost Split", value: "Equal among members" },
    ],
    coordinates: { lat: 13.0067, lng: 80.2206 },
    seller: SELLERS.residentAnnouncer,
  },
];
