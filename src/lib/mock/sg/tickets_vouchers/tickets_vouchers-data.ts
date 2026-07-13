import type { MockListing } from "@/lib/mock/mock-listing-schema";
import { SELLERS, img, daysAgo, hrsAgo } from "./sellers";

// ── event_tickets ──────────────────────────────────────────────────────────
export const SG_TICKETS_EVENT_TICKETS: MockListing[] = [
  {
    id: "tickets-sg-event-01", href: "/listings/tickets-sg-event-01", advId: "49001",
    images: [{ src: img(5), alt: "Concert ticket" }],
    priceLabel: "S$90",
    title: "2 Concert Tickets \u2014 Front Row, Live Music Festival",
    detailsLabel: "EVENT TICKETS \u2022 CONCERT \u2022 SINGAPORE",
    locationLabel: "Marina Bay, Singapore",
    postedAt: hrsAgo(1),
    description: "<p>2 front row tickets to a live music festival, transferable e-tickets.</p>",
    keyDetails: [
      { key: "Tickets", value: "2" },
    ],
    goodToKnow: [
      { key: "Transferable", value: "Yes" },
    ],
    coordinates: { lat: 1.2818, lng: 103.8607 },
    seller: SELLERS.eventTicketsSG,
  },
  {
    id: "tickets-sg-event-02", href: "/listings/tickets-sg-event-02", advId: "49002",
    images: [{ src: img(6), alt: "Comedy show ticket" }],
    priceLabel: "S$35",
    title: "Comedy Show Ticket \u2014 Single Entry, Standup Night",
    detailsLabel: "EVENT TICKETS \u2022 COMEDY \u2022 SINGAPORE",
    locationLabel: "Marina Bay, Singapore",
    postedAt: daysAgo(1),
    description: "<p>Single entry ticket to a standup comedy night, valid for this weekend.</p>",
    keyDetails: [
      { key: "Entry", value: "Single" },
    ],
    goodToKnow: [
      { key: "Validity", value: "This weekend" },
    ],
    coordinates: { lat: 1.2818, lng: 103.8607 },
    seller: SELLERS.eventTicketsSG,
  },
];

// ── sport_tickets ──────────────────────────────────────────────────────────
export const SG_TICKETS_SPORT_TICKETS: MockListing[] = [
  {
    id: "tickets-sg-sport-01", href: "/listings/tickets-sg-sport-01", advId: "49011",
    images: [{ src: img(7), alt: "Football match tickets" }],
    priceLabel: "S$120",
    title: "2 Football Match Tickets \u2014 Premium Stand",
    detailsLabel: "SPORT TICKETS \u2022 FOOTBALL \u2022 SINGAPORE",
    locationLabel: "Kallang, Singapore",
    postedAt: hrsAgo(3),
    description: "<p>2 premium stand tickets for an upcoming football match, great view of the pitch.</p>",
    keyDetails: [
      { key: "Tickets", value: "2" },
    ],
    goodToKnow: [
      { key: "Stand", value: "Premium" },
    ],
    coordinates: { lat: 1.3033, lng: 103.8748 },
    seller: SELLERS.sportTicketsSG,
  },
  {
    id: "tickets-sg-sport-02", href: "/listings/tickets-sg-sport-02", advId: "49012",
    images: [{ src: img(8), alt: "Rugby match ticket" }],
    priceLabel: "S$40",
    title: "Rugby League Match Ticket \u2014 Single Entry",
    detailsLabel: "SPORT TICKETS \u2022 RUGBY \u2022 SINGAPORE",
    locationLabel: "Kallang, Singapore",
    postedAt: daysAgo(2),
    description: "<p>Single entry ticket to a local rugby league match, valid this month.</p>",
    keyDetails: [
      { key: "Entry", value: "Single" },
    ],
    goodToKnow: [
      { key: "Validity", value: "This month" },
    ],
    coordinates: { lat: 1.3033, lng: 103.8748 },
    seller: SELLERS.sportTicketsSG,
  },
];

// ── gift_cards ──────────────────────────────────────────────────────────────
export const SG_TICKETS_GIFT_CARDS: MockListing[] = [
  {
    id: "tickets-sg-gift-01", href: "/listings/tickets-sg-gift-01", advId: "49021",
    images: [{ src: img(9), alt: "Shopping gift card" }],
    priceLabel: "S$45",
    title: "S$50 Shopping Mall Gift Card \u2014 10% Off",
    detailsLabel: "GIFT CARDS \u2022 SHOPPING \u2022 SINGAPORE",
    locationLabel: "Orchard, Singapore",
    postedAt: hrsAgo(5),
    description: "<p>Unused S$50 shopping mall gift card, selling at a 10% discount, valid for 1 year.</p>",
    keyDetails: [
      { key: "Face Value", value: "S$50" },
    ],
    goodToKnow: [
      { key: "Discount", value: "10% off" },
    ],
    coordinates: { lat: 1.3048, lng: 103.8318 },
    seller: SELLERS.giftCardsSG,
  },
  {
    id: "tickets-sg-gift-02", href: "/listings/tickets-sg-gift-02", advId: "49022",
    images: [{ src: img(1), alt: "Restaurant gift card" }],
    priceLabel: "S$22",
    title: "S$25 Restaurant Gift Card \u2014 Fine Dining Chain",
    detailsLabel: "GIFT CARDS \u2022 DINING \u2022 SINGAPORE",
    locationLabel: "Orchard, Singapore",
    postedAt: daysAgo(1),
    description: "<p>Unused S$25 gift card for a fine dining restaurant chain, valid at all locations.</p>",
    keyDetails: [
      { key: "Face Value", value: "S$25" },
    ],
    goodToKnow: [
      { key: "Validity", value: "All locations" },
    ],
    coordinates: { lat: 1.3048, lng: 103.8318 },
    seller: SELLERS.giftCardsSG,
  },
];

// ── experience_days ──────────────────────────────────────────────────────────
export const SG_TICKETS_EXPERIENCE_DAYS: MockListing[] = [
  {
    id: "tickets-sg-exp-01", href: "/listings/tickets-sg-exp-01", advId: "49031",
    images: [{ src: img(2), alt: "Helicopter tour experience" }],
    priceLabel: "S$220",
    title: "Helicopter City Tour Voucher \u2014 2 Persons, 20 Minutes",
    detailsLabel: "EXPERIENCE DAYS \u2022 ADVENTURE \u2022 SINGAPORE",
    locationLabel: "Sentosa, Singapore",
    postedAt: hrsAgo(7),
    description: "<p>Voucher for a 20-minute helicopter city tour for 2 persons, valid for 6 months.</p>",
    keyDetails: [
      { key: "Persons", value: "2" },
    ],
    goodToKnow: [
      { key: "Validity", value: "6 months" },
    ],
    coordinates: { lat: 1.2494, lng: 103.8303 },
    seller: SELLERS.experienceDaysSG,
  },
  {
    id: "tickets-sg-exp-02", href: "/listings/tickets-sg-exp-02", advId: "49032",
    images: [{ src: img(3), alt: "Spa day voucher" }],
    priceLabel: "S$85",
    title: "Spa Day Voucher \u2014 Full Body Massage & Facial",
    detailsLabel: "EXPERIENCE DAYS \u2022 WELLNESS \u2022 SINGAPORE",
    locationLabel: "Sentosa, Singapore",
    postedAt: daysAgo(1),
    description: "<p>Spa day voucher including full body massage and facial treatment, valid for 3 months.</p>",
    keyDetails: [
      { key: "Includes", value: "Massage + facial" },
    ],
    goodToKnow: [
      { key: "Validity", value: "3 months" },
    ],
    coordinates: { lat: 1.2494, lng: 103.8303 },
    seller: SELLERS.experienceDaysSG,
  },
];

// ── travel_vouchers ──────────────────────────────────────────────────────────
export const SG_TICKETS_TRAVEL_VOUCHERS: MockListing[] = [
  {
    id: "tickets-sg-travel-01", href: "/listings/tickets-sg-travel-01", advId: "49041",
    images: [{ src: img(4), alt: "Hotel voucher" }],
    priceLabel: "S$180",
    title: "2-Night Hotel Stay Voucher \u2014 4-Star Resort, Bintan",
    detailsLabel: "TRAVEL VOUCHERS \u2022 HOTEL \u2022 SINGAPORE",
    locationLabel: "Raffles Place, Singapore",
    postedAt: hrsAgo(9),
    description: "<p>Voucher for a 2-night stay at a 4-star resort in Bintan, valid for 1 year, breakfast included.</p>",
    keyDetails: [
      { key: "Nights", value: "2" },
    ],
    goodToKnow: [
      { key: "Includes", value: "Breakfast" },
    ],
    coordinates: { lat: 1.2841, lng: 103.8515 },
    seller: SELLERS.travelVouchersSG,
  },
  {
    id: "tickets-sg-travel-02", href: "/listings/tickets-sg-travel-02", advId: "49042",
    images: [{ src: img(5), alt: "Flight voucher" }],
    priceLabel: "S$110",
    title: "S$150 Flight Booking Voucher \u2014 Regional Routes",
    detailsLabel: "TRAVEL VOUCHERS \u2022 FLIGHT \u2022 SINGAPORE",
    locationLabel: "Raffles Place, Singapore",
    postedAt: daysAgo(2),
    description: "<p>Discounted S$150 flight booking voucher valid for regional routes, expires in 8 months.</p>",
    keyDetails: [
      { key: "Face Value", value: "S$150" },
    ],
    goodToKnow: [
      { key: "Expiry", value: "8 months" },
    ],
    coordinates: { lat: 1.2841, lng: 103.8515 },
    seller: SELLERS.travelVouchersSG,
  },
];
