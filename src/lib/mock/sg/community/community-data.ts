import type { MockListing } from "@/lib/mock/mock-listing-schema";
import { SELLERS, img, daysAgo, hrsAgo } from "./sellers";

// ── lost_found ────────────────────────────────────────────────────────────────
export const SG_COMMUNITY_LOST_FOUND: MockListing[] = [
  {
    id: "community-sg-lostfound-01", href: "/listings/community-sg-lostfound-01", advId: "36001",
    images: [{ src: img(1), alt: "Lost wallet" }],
    priceLabel: "Free",
    title: "Lost Brown Leather Wallet Near Bishan MRT Station",
    detailsLabel: "LOST & FOUND \u2022 WALLET \u2022 SINGAPORE",
    locationLabel: "Bishan, Singapore",
    postedAt: hrsAgo(3),
    description: "<p>Lost a brown leather wallet near Bishan MRT Station on Tuesday evening. Contains ID cards and a few photographs of sentimental value. Reward offered.</p>",
    keyDetails: [
      { key: "Item",     value: "Brown leather wallet" },
      { key: "Location", value: "Bishan MRT"           },
    ],
    goodToKnow: [
      { key: "Reward", value: "S$50 offered" },
    ],
    coordinates: { lat: 1.3508, lng: 103.8486 },
    seller: SELLERS.neighbourhoodWatchSG,
  },
  {
    id: "community-sg-lostfound-02", href: "/listings/community-sg-lostfound-02", advId: "36002",
    images: [{ src: img(2), alt: "Found dog" }],
    priceLabel: "Free",
    title: "Found Golden Retriever Near Yishun \u2014 Looking for Owner",
    detailsLabel: "LOST & FOUND \u2022 PET \u2022 SINGAPORE",
    locationLabel: "Yishun, Singapore",
    postedAt: daysAgo(1),
    description: "<p>Found a friendly golden retriever wandering near Yishun without a collar tag. Currently being cared for. Please contact if this is your pet.</p>",
    keyDetails: [
      { key: "Animal",   value: "Golden Retriever" },
      { key: "Found At", value: "Yishun"          },
    ],
    goodToKnow: [
      { key: "Condition", value: "Healthy, no visible injuries" },
    ],
    coordinates: { lat: 1.4304, lng: 103.8354 },
    seller: SELLERS.familySupportCircleSG,
  },
];

// ── events ────────────────────────────────────────────────────────────────────
export const SG_COMMUNITY_EVENTS: MockListing[] = [
  {
    id: "community-sg-events-01", href: "/listings/community-sg-events-01", advId: "36011",
    images: [{ src: img(3), alt: "Deepavali celebration" }],
    priceLabel: "Free entry",
    title: "Deepavali Community Celebration \u2014 Food Stalls, Music & Lights",
    detailsLabel: "EVENT \u2022 FESTIVAL \u2022 SINGAPORE",
    locationLabel: "Tampines, Singapore",
    postedAt: hrsAgo(5),
    description: "<p>Annual Deepavali celebration with food stalls from local vendors, live music performances, and a light display. Free entry for all residents.</p>",
    keyDetails: [
      { key: "Date",  value: "2 Nov 2025, 5 PM" },
      { key: "Venue", value: "Tampines Community Plaza" },
    ],
    goodToKnow: [
      { key: "Parking", value: "Available at nearby carpark" },
    ],
    coordinates: { lat: 1.3496, lng: 103.9568 },
    seller: SELLERS.eventsCollectiveSG,
  },
  {
    id: "community-sg-events-02", href: "/listings/community-sg-events-02", advId: "36012",
    images: [{ src: img(4), alt: "Marathon" }],
    priceLabel: "S$15 registration",
    title: "Weekend Community Run \u2014 5K & 10K Categories",
    detailsLabel: "EVENT \u2022 SPORTS \u2022 SINGAPORE",
    locationLabel: "Tampines, Singapore",
    postedAt: daysAgo(2),
    description: "<p>Community-organised run with 5K and 10K categories, open to all ages. Registration includes a t-shirt and refreshments.</p>",
    keyDetails: [
      { key: "Categories", value: "5K & 10K" },
      { key: "Date",       value: "16 Nov 2025, 6 AM" },
    ],
    goodToKnow: [
      { key: "Includes", value: "T-shirt + refreshments" },
    ],
    coordinates: { lat: 1.3496, lng: 103.9568 },
    seller: SELLERS.eventsCollectiveSG,
  },
];

// ── volunteering ──────────────────────────────────────────────────────────────
export const SG_COMMUNITY_VOLUNTEERING: MockListing[] = [
  {
    id: "community-sg-volunteer-01", href: "/listings/community-sg-volunteer-01", advId: "36021",
    images: [{ src: img(5), alt: "Volunteers cleaning park" }],
    priceLabel: "Volunteer opportunity",
    title: "Weekend Park Clean-Up Drive \u2014 Volunteers Needed",
    detailsLabel: "VOLUNTEERING \u2022 ENVIRONMENT \u2022 SINGAPORE",
    locationLabel: "Novena, Singapore",
    postedAt: hrsAgo(8),
    description: "<p>Join our weekend clean-up drive at the neighbourhood park. Gloves and bags provided. All ages welcome, great for families.</p>",
    keyDetails: [
      { key: "Date",     value: "Every Saturday, 7 AM" },
      { key: "Provided", value: "Gloves & bags"        },
    ],
    goodToKnow: [
      { key: "Sign-up", value: "Not required, just show up" },
    ],
    coordinates: { lat: 1.3204, lng: 103.8437 },
    seller: SELLERS.ngoVolunteerHubSG,
  },
  {
    id: "community-sg-volunteer-02", href: "/listings/community-sg-volunteer-02", advId: "36022",
    images: [{ src: img(6), alt: "Volunteers teaching" }],
    priceLabel: "Volunteer opportunity",
    title: "Weekend Tutors Needed for Underprivileged Children",
    detailsLabel: "VOLUNTEERING \u2022 EDUCATION \u2022 SINGAPORE",
    locationLabel: "Novena, Singapore",
    postedAt: daysAgo(1),
    description: "<p>Looking for weekend volunteer tutors to teach basic maths and English to underprivileged children at our community centre.</p>",
    keyDetails: [
      { key: "Commitment", value: "2 hours/weekend" },
      { key: "Subjects",   value: "Maths & English"  },
    ],
    goodToKnow: [
      { key: "Training", value: "Orientation session provided" },
    ],
    coordinates: { lat: 1.3204, lng: 103.8437 },
    seller: SELLERS.ngoVolunteerHubSG,
  },
];

// ── announcement ──────────────────────────────────────────────────────────────
export const SG_COMMUNITY_ANNOUNCEMENT: MockListing[] = [
  {
    id: "community-sg-announce-01", href: "/listings/community-sg-announce-01", advId: "36031",
    images: [{ src: img(7), alt: "Water supply notice" }],
    priceLabel: "Notice",
    title: "Water Supply Disruption Notice \u2014 Bukit Timah, 12 Nov",
    detailsLabel: "ANNOUNCEMENT \u2022 UTILITY \u2022 SINGAPORE",
    locationLabel: "Bukit Timah, Singapore",
    postedAt: hrsAgo(2),
    description: "<p>Water supply will be temporarily disrupted in Bukit Timah area on 12 Nov due to pipeline maintenance work. Expected restoration by evening.</p>",
    keyDetails: [
      { key: "Date",     value: "12 Nov 2025" },
      { key: "Duration", value: "8 AM \u2013 6 PM"  },
    ],
    goodToKnow: [
      { key: "Contact", value: "PUB helpline" },
    ],
    coordinates: { lat: 1.3294, lng: 103.8021 },
    seller: SELLERS.generalNoticeBoardSG,
  },
  {
    id: "community-sg-announce-02", href: "/listings/community-sg-announce-02", advId: "36032",
    images: [{ src: img(8), alt: "Estate AGM" }],
    priceLabel: "Notice",
    title: "Residents' Committee Annual General Meeting \u2014 20 Nov",
    detailsLabel: "ANNOUNCEMENT \u2022 ESTATE \u2022 SINGAPORE",
    locationLabel: "Bukit Timah, Singapore",
    postedAt: daysAgo(3),
    description: "<p>Annual General Meeting of the residents' committee scheduled for 20 Nov. All residents encouraged to attend and vote on budget items.</p>",
    keyDetails: [
      { key: "Date",  value: "20 Nov 2025, 6 PM" },
      { key: "Venue", value: "Community Hall"    },
    ],
    goodToKnow: [
      { key: "Agenda", value: "Budget approval & elections" },
    ],
    coordinates: { lat: 1.3294, lng: 103.8021 },
    seller: SELLERS.generalNoticeBoardSG,
  },
];

// ── child_family ──────────────────────────────────────────────────────────────
export const SG_COMMUNITY_CHILD_FAMILY: MockListing[] = [
  {
    id: "community-sg-childfamily-01", href: "/listings/community-sg-childfamily-01", advId: "36041",
    images: [{ src: img(9), alt: "Parenting support group" }],
    priceLabel: "Free to join",
    title: "New Parents Support Group \u2014 Meets Every Sunday",
    detailsLabel: "CHILD & FAMILY \u2022 SUPPORT GROUP \u2022 SINGAPORE",
    locationLabel: "Yishun, Singapore",
    postedAt: hrsAgo(10),
    description: "<p>A support group for new parents to share experiences, tips, and support each other. Meets every Sunday at the community centre.</p>",
    keyDetails: [
      { key: "Meets",  value: "Every Sunday, 10 AM" },
      { key: "Format", value: "In-person + WhatsApp group" },
    ],
    goodToKnow: [
      { key: "Childcare", value: "Play area available on-site" },
    ],
    coordinates: { lat: 1.4304, lng: 103.8354 },
    seller: SELLERS.familySupportCircleSG,
  },
  {
    id: "community-sg-childfamily-02", href: "/listings/community-sg-childfamily-02", advId: "36042",
    images: [{ src: img(1), alt: "Babysitting exchange" }],
    priceLabel: "Free to join",
    title: "Neighbourhood Babysitting Exchange Circle",
    detailsLabel: "CHILD & FAMILY \u2022 BABYSITTING \u2022 SINGAPORE",
    locationLabel: "Yishun, Singapore",
    postedAt: daysAgo(2),
    description: "<p>A trusted circle of local families exchanging babysitting favours on a rotating basis \u2014 no money involved, just mutual help.</p>",
    keyDetails: [
      { key: "Members", value: "10 families currently" },
    ],
    goodToKnow: [
      { key: "Vetting", value: "Introduction meeting required" },
    ],
    coordinates: { lat: 1.4304, lng: 103.8354 },
    seller: SELLERS.familySupportCircleSG,
  },
];

// ── general_others ────────────────────────────────────────────────────────────
export const SG_COMMUNITY_GENERAL_OTHERS: MockListing[] = [
  {
    id: "community-sg-general-01", href: "/listings/community-sg-general-01", advId: "36051",
    images: [{ src: img(2), alt: "Book club" }],
    priceLabel: "Free to join",
    title: "Monthly Book Club \u2014 New Members Welcome",
    detailsLabel: "GENERAL \u2022 BOOK CLUB \u2022 SINGAPORE",
    locationLabel: "Toa Payoh, Singapore",
    postedAt: hrsAgo(14),
    description: "<p>Friendly monthly book club meeting at a local cafe to discuss a chosen book. New members always welcome, no commitment required.</p>",
    keyDetails: [
      { key: "Meets", value: "First Saturday of the month" },
      { key: "Genre", value: "Rotates monthly"             },
    ],
    goodToKnow: [
      { key: "Current Book", value: "Announced on WhatsApp group" },
    ],
    coordinates: { lat: 1.3343, lng: 103.8563 },
    seller: SELLERS.residentAnnouncerSG,
  },
  {
    id: "community-sg-general-02", href: "/listings/community-sg-general-02", advId: "36052",
    images: [{ src: img(3), alt: "Carpool group" }],
    priceLabel: "Free to join",
    title: "Office Carpool Group \u2014 Toa Payoh to Raffles Place Route",
    detailsLabel: "GENERAL \u2022 CARPOOL \u2022 SINGAPORE",
    locationLabel: "Toa Payoh, Singapore",
    postedAt: daysAgo(4),
    description: "<p>Looking for more members to join our daily carpool group along the Toa Payoh to Raffles Place route. Split fuel costs, reduce your commute stress.</p>",
    keyDetails: [
      { key: "Route",  value: "Toa Payoh to Raffles Place" },
      { key: "Timing", value: "8 AM & 6 PM daily" },
    ],
    goodToKnow: [
      { key: "Cost Split", value: "Equal among members" },
    ],
    coordinates: { lat: 1.3343, lng: 103.8563 },
    seller: SELLERS.residentAnnouncerSG,
  },
];
