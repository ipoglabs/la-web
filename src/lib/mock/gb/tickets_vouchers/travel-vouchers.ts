import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── travel_vouchers ───────────────────────────────────────────────────────────
export const TICKETS_TRAVEL: MockListing[] = [
  {
    id: "tick-trav-01", href: "/listings/tick-trav-01", advId: "22041",
    images: [{ src: img(1), alt: "Eurostar return tickets" }],
    priceLabel: "£180",
    title: "Eurostar London–Paris Return × 2 — Standard Premier, 10/14 Jul 2026",
    detailsLabel: "TRAVEL VOUCHER • EUROSTAR • LONDON–PARIS",
    locationLabel: "London",
    postedAt: hrsAgo(2),
    description: "<p>Two <strong>Eurostar Standard Premier return tickets</strong> — London St Pancras → Paris Gare du Nord, 10 July outward, 14 July return 2026. Plans changed. Eurostar allows name changes for ~£30 fee. £180 each face value.</p>",
    keyDetails: [
      { key: "Route",     value: "London St Pancras → Paris" },
      { key: "Class",     value: "Standard Premier"          },
      { key: "Dates",     value: "10 Jul out / 14 Jul return" },
      { key: "Qty",       value: "× 2"                       },
    ],
    goodToKnow: [
      { key: "Name change", value: "~£30 via Eurostar"       },
      { key: "Reason",     value: "Plans changed"            },
      { key: "Pair",       value: "Selling together"         },
      { key: "Contact",    value: "Message for booking ref"  },
    ],
    coordinates: { lat: 51.5074, lng: -0.1278 },
    seller: SELLERS.ticketPrivate,
  },
  {
    id: "tick-trav-02", href: "/listings/tick-trav-02", advId: "22042",
    images: [{ src: img(2), alt: "British Airways eVoucher" }],
    priceLabel: "£250",
    title: "British Airways Travel eVoucher — £300 Credit, Any Route, No Expiry",
    detailsLabel: "TRAVEL VOUCHER • BRITISH AIRWAYS • £300",
    locationLabel: "London",
    postedAt: daysAgo(1),
    description: "<p>British Airways <strong>eVoucher with £300 credit</strong> — issued as COVID-19 cancellation compensation in 2022. Fully valid with no expiry, redeemable on any BA route worldwide. Selling below face value as I now use Avios points exclusively.</p>",
    keyDetails: [
      { key: "Provider",  value: "British Airways"           },
      { key: "Balance",   value: "£300"                      },
      { key: "Valid on",  value: "Any BA route worldwide"    },
      { key: "Expiry",    value: "None"                      },
    ],
    goodToKnow: [
      { key: "Origin",     value: "COVID-19 cancellation comp." },
      { key: "Transfer",   value: "BA can reissue to buyer"  },
      { key: "Reason",     value: "Using Avios instead"      },
      { key: "Contact",    value: "Verify with BA before payment" },
    ],
    coordinates: { lat: 51.5074, lng: -0.1278 },
    seller: SELLERS.dave,
  },
  {
    id: "tick-trav-03", href: "/listings/tick-trav-03", advId: "22043",
    images: [{ src: img(3), alt: "Premier Inn 3-night break voucher" }],
    priceLabel: "£160",
    title: "Premier Inn 3-Night Break Voucher — Any UK Hotel, Breakfast for 2",
    detailsLabel: "TRAVEL VOUCHER • PREMIER INN • 3 NIGHTS",
    locationLabel: "London",
    postedAt: daysAgo(2),
    description: "<p><strong>Premier Inn 3-night flexible voucher</strong> — valid at any UK Premier Inn hotel, flexible dates, includes breakfast for 2 per night. Valid to December 2027. Purchased for a staycation that fell through due to family illness.</p>",
    keyDetails: [
      { key: "Hotel",     value: "Premier Inn — any UK"      },
      { key: "Nights",    value: "3 (flexible dates)"        },
      { key: "Breakfast", value: "For 2 per night"           },
      { key: "Expiry",    value: "December 2027"             },
    ],
    goodToKnow: [
      { key: "Flexible",   value: "Any UK hotel + dates"     },
      { key: "Transfer",   value: "Transferable voucher"     },
      { key: "Reason",     value: "Family illness cancelled" },
      { key: "Delivery",   value: "PDF voucher"              },
    ],
    coordinates: { lat: 51.5074, lng: -0.1278 },
    seller: SELLERS.quickSell,
  },
];
