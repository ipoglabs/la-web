import type { MockListing } from "@/lib/mock/mock-listing-schema";
import { SELLERS, img, daysAgo, hrsAgo } from "./sellers";

// ── event_tickets ──────────────────────────────────────────────────────────
export const IN_TICKETS_EVENT_TICKETS: MockListing[] = [
  {
    id: "tickets-in-event-01", href: "/listings/tickets-in-event-01", advId: "39001",
    images: [{ src: img(5), alt: "Concert ticket" }],
    priceLabel: "\u20b93,500",
    title: "2 Concert Tickets \u2014 Front Row, Live Music Festival",
    detailsLabel: "EVENT TICKETS \u2022 CONCERT \u2022 MUMBAI",
    locationLabel: "Bandra Kurla Complex, Mumbai",
    postedAt: hrsAgo(1),
    description: "<p>2 front row tickets to a live music festival, transferable e-tickets.</p>",
    keyDetails: [
      { key: "Tickets", value: "2" },
    ],
    goodToKnow: [
      { key: "Transferable", value: "Yes" },
    ],
    coordinates: { lat: 19.0662, lng: 72.8681 },
    seller: SELLERS.eventTicketsIndia,
  },
  {
    id: "tickets-in-event-02", href: "/listings/tickets-in-event-02", advId: "39002",
    images: [{ src: img(6), alt: "Comedy show ticket" }],
    priceLabel: "\u20b91,200",
    title: "Comedy Show Ticket \u2014 Single Entry, Standup Night",
    detailsLabel: "EVENT TICKETS \u2022 COMEDY \u2022 MUMBAI",
    locationLabel: "Bandra Kurla Complex, Mumbai",
    postedAt: daysAgo(1),
    description: "<p>Single entry ticket to a standup comedy night, valid for this weekend.</p>",
    keyDetails: [
      { key: "Entry", value: "Single" },
    ],
    goodToKnow: [
      { key: "Validity", value: "This weekend" },
    ],
    coordinates: { lat: 19.0662, lng: 72.8681 },
    seller: SELLERS.eventTicketsIndia,
  },
];

// ── sport_tickets ──────────────────────────────────────────────────────────
export const IN_TICKETS_SPORT_TICKETS: MockListing[] = [
  {
    id: "tickets-in-sport-01", href: "/listings/tickets-in-sport-01", advId: "39011",
    images: [{ src: img(7), alt: "Cricket match tickets" }],
    priceLabel: "\u20b95,000",
    title: "2 Cricket Match Tickets \u2014 Premium Stand",
    detailsLabel: "SPORT TICKETS \u2022 CRICKET \u2022 BENGALURU",
    locationLabel: "M Chinnaswamy Stadium, Bengaluru",
    postedAt: hrsAgo(3),
    description: "<p>2 premium stand tickets for an upcoming cricket match, great view of the pitch.</p>",
    keyDetails: [
      { key: "Tickets", value: "2" },
    ],
    goodToKnow: [
      { key: "Stand", value: "Premium" },
    ],
    coordinates: { lat: 12.9789, lng: 77.5993 },
    seller: SELLERS.sportTicketsIndia,
  },
  {
    id: "tickets-in-sport-02", href: "/listings/tickets-in-sport-02", advId: "39012",
    images: [{ src: img(8), alt: "Football match ticket" }],
    priceLabel: "\u20b91,500",
    title: "Football League Match Ticket \u2014 Single Entry",
    detailsLabel: "SPORT TICKETS \u2022 FOOTBALL \u2022 BENGALURU",
    locationLabel: "M Chinnaswamy Stadium, Bengaluru",
    postedAt: daysAgo(2),
    description: "<p>Single entry ticket to a local football league match, valid this month.</p>",
    keyDetails: [
      { key: "Entry", value: "Single" },
    ],
    goodToKnow: [
      { key: "Validity", value: "This month" },
    ],
    coordinates: { lat: 12.9789, lng: 77.5993 },
    seller: SELLERS.sportTicketsIndia,
  },
];

// ── gift_cards ──────────────────────────────────────────────────────────────
export const IN_TICKETS_GIFT_CARDS: MockListing[] = [
  {
    id: "tickets-in-gift-01", href: "/listings/tickets-in-gift-01", advId: "39021",
    images: [{ src: img(9), alt: "Shopping gift card" }],
    priceLabel: "\u20b91,800",
    title: "\u20b92,000 Shopping Mall Gift Card \u2014 10% Off",
    detailsLabel: "GIFT CARDS \u2022 SHOPPING \u2022 DELHI",
    locationLabel: "Connaught Place, Delhi",
    postedAt: hrsAgo(5),
    description: "<p>Unused \u20b92,000 shopping mall gift card, selling at a 10% discount, valid for 1 year.</p>",
    keyDetails: [
      { key: "Face Value", value: "\u20b92,000" },
    ],
    goodToKnow: [
      { key: "Discount", value: "10% off" },
    ],
    coordinates: { lat: 28.6315, lng: 77.2195 },
    seller: SELLERS.giftCardsIndia,
  },
  {
    id: "tickets-in-gift-02", href: "/listings/tickets-in-gift-02", advId: "39022",
    images: [{ src: img(1), alt: "Restaurant gift card" }],
    priceLabel: "\u20b9900",
    title: "\u20b91,000 Restaurant Gift Card \u2014 Fine Dining Chain",
    detailsLabel: "GIFT CARDS \u2022 DINING \u2022 DELHI",
    locationLabel: "Connaught Place, Delhi",
    postedAt: daysAgo(1),
    description: "<p>Unused \u20b91,000 gift card for a fine dining restaurant chain, valid at all locations.</p>",
    keyDetails: [
      { key: "Face Value", value: "\u20b91,000" },
    ],
    goodToKnow: [
      { key: "Validity", value: "All locations" },
    ],
    coordinates: { lat: 28.6315, lng: 77.2195 },
    seller: SELLERS.giftCardsIndia,
  },
];

// ── experience_days ──────────────────────────────────────────────────────────
export const IN_TICKETS_EXPERIENCE_DAYS: MockListing[] = [
  {
    id: "tickets-in-exp-01", href: "/listings/tickets-in-exp-01", advId: "39031",
    images: [{ src: img(2), alt: "Hot air balloon experience" }],
    priceLabel: "\u20b98,500",
    title: "Hot Air Balloon Ride Voucher \u2014 2 Persons, Sunrise Slot",
    detailsLabel: "EXPERIENCE DAYS \u2022 ADVENTURE \u2022 BENGALURU",
    locationLabel: "MG Road, Bengaluru",
    postedAt: hrsAgo(7),
    description: "<p>Voucher for a sunrise hot air balloon ride for 2 persons, valid for 6 months.</p>",
    keyDetails: [
      { key: "Persons", value: "2" },
    ],
    goodToKnow: [
      { key: "Validity", value: "6 months" },
    ],
    coordinates: { lat: 12.9758, lng: 77.6045 },
    seller: SELLERS.experienceDaysIndia,
  },
  {
    id: "tickets-in-exp-02", href: "/listings/tickets-in-exp-02", advId: "39032",
    images: [{ src: img(3), alt: "Spa day voucher" }],
    priceLabel: "\u20b93,200",
    title: "Spa Day Voucher \u2014 Full Body Massage & Facial",
    detailsLabel: "EXPERIENCE DAYS \u2022 WELLNESS \u2022 BENGALURU",
    locationLabel: "MG Road, Bengaluru",
    postedAt: daysAgo(1),
    description: "<p>Spa day voucher including full body massage and facial treatment, valid for 3 months.</p>",
    keyDetails: [
      { key: "Includes", value: "Massage + facial" },
    ],
    goodToKnow: [
      { key: "Validity", value: "3 months" },
    ],
    coordinates: { lat: 12.9758, lng: 77.6045 },
    seller: SELLERS.experienceDaysIndia,
  },
];

// ── travel_vouchers ──────────────────────────────────────────────────────────
export const IN_TICKETS_TRAVEL_VOUCHERS: MockListing[] = [
  {
    id: "tickets-in-travel-01", href: "/listings/tickets-in-travel-01", advId: "39041",
    images: [{ src: img(4), alt: "Hotel voucher" }],
    priceLabel: "\u20b96,500",
    title: "2-Night Hotel Stay Voucher \u2014 4-Star Resort, Goa",
    detailsLabel: "TRAVEL VOUCHERS \u2022 HOTEL \u2022 MUMBAI",
    locationLabel: "Andheri West, Mumbai",
    postedAt: hrsAgo(9),
    description: "<p>Voucher for a 2-night stay at a 4-star resort in Goa, valid for 1 year, breakfast included.</p>",
    keyDetails: [
      { key: "Nights", value: "2" },
    ],
    goodToKnow: [
      { key: "Includes", value: "Breakfast" },
    ],
    coordinates: { lat: 19.1197, lng: 72.8397 },
    seller: SELLERS.travelVouchersIndia,
  },
  {
    id: "tickets-in-travel-02", href: "/listings/tickets-in-travel-02", advId: "39042",
    images: [{ src: img(5), alt: "Flight voucher" }],
    priceLabel: "\u20b94,000",
    title: "\u20b95,000 Flight Booking Voucher \u2014 Domestic Routes",
    detailsLabel: "TRAVEL VOUCHERS \u2022 FLIGHT \u2022 MUMBAI",
    locationLabel: "Andheri West, Mumbai",
    postedAt: daysAgo(2),
    description: "<p>Discounted \u20b95,000 flight booking voucher valid for domestic routes, expires in 8 months.</p>",
    keyDetails: [
      { key: "Face Value", value: "\u20b95,000" },
    ],
    goodToKnow: [
      { key: "Expiry", value: "8 months" },
    ],
    coordinates: { lat: 19.1197, lng: 72.8397 },
    seller: SELLERS.travelVouchersIndia,
  },
];
