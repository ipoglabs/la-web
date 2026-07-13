import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── vinyl_records ──────────────────────────────────────────────────────────────
export const MEDIA_VINYL: MockListing[] = [
  {
    id: "media-vinyl-01", href: "/listings/media-vinyl-01", advId: "21011",
    images: [{ src: img(4), alt: "Classic rock vinyl LP collection" }],
    priceLabel: "£180",
    title: "Vinyl LP Collection — 120 Classic Rock & Soul Albums, 1960s–80s",
    detailsLabel: "VINYL • CLASSIC ROCK • SOUL • JOB LOT",
    locationLabel: "Portobello, London",
    postedAt: daysAgo(2),
    description: "<p>Job lot of <strong>120 original LP vinyl records</strong> — classic rock and soul from the 1960s–80s. Includes Fleetwood Mac, Led Zeppelin, Marvin Gaye, Aretha Franklin, and many more. Condition G+ to VG+. Full list available on request.</p>",
    keyDetails: [
      { key: "Qty",       value: "120 LPs"                  },
      { key: "Genre",     value: "Classic rock + soul"      },
      { key: "Era",       value: "1960s–1980s"              },
      { key: "Condition", value: "G+ to VG+ mixed"          },
    ],
    goodToKnow: [
      { key: "Highlights", value: "Fleetwood Mac, Led Zeppelin, Marvin Gaye" },
      { key: "Full list",  value: "Available on request"    },
      { key: "Collection", value: "Portobello W11"          },
      { key: "Delivery",   value: "Not available"           },
    ],
    coordinates: { lat: 51.5134, lng: -0.2063 },
    seller: SELLERS.mediaPrivate,
  },
  {
    id: "media-vinyl-02", href: "/listings/media-vinyl-02", advId: "21012",
    images: [{ src: img(5), alt: "Sade Diamond Life LP" }],
    priceLabel: "£25",
    title: "Sade — Diamond Life (1984) Original UK CBS Press, VG+",
    detailsLabel: "VINYL • SOUL • SADE • ORIGINAL PRESS",
    locationLabel: "Brixton, London",
    postedAt: hrsAgo(3),
    description: "<p>Original 1984 UK CBS pressing of <strong>Sade 'Diamond Life'</strong> (Cat: CBLP 26044). Plays VG+ — mild surface noise on first bars of Side A only. Sleeve VG with light shelf wear. Inner sleeve clean. One of the finest debut albums ever made.</p>",
    keyDetails: [
      { key: "Artist",    value: "Sade"                     },
      { key: "Album",     value: "Diamond Life (1984)"       },
      { key: "Press",     value: "Original UK CBS"           },
      { key: "Condition", value: "VG+ (plays clean)"        },
    ],
    goodToKnow: [
      { key: "Cat. No.",   value: "CBLP 26044"              },
      { key: "Surface",    value: "Mild noise Side A only"  },
      { key: "Sleeve",     value: "VG — light shelf wear"   },
      { key: "Postage",    value: "Available £4 (padded)"   },
    ],
    coordinates: { lat: 51.4612, lng: -0.1149 },
    seller: SELLERS.mediaPrivate,
  },
  {
    id: "media-vinyl-03", href: "/listings/media-vinyl-03", advId: "21013",
    images: [{ src: img(6), alt: "Northern Soul 45rpm collection" }],
    priceLabel: "£350",
    title: "Northern Soul 45rpm Singles — 200 Originals, Tamla/Atlantic/Stax",
    detailsLabel: "VINYL • NORTHERN SOUL • 45s • COLLECTION",
    locationLabel: "Dalston, London",
    postedAt: daysAgo(4),
    description: "<p>Serious <strong>200-piece Northern Soul 45rpm collection</strong> built over 20 years — all original UK pressings, mostly Tamla Motown, Atlantic, Stax, and small UK labels. Condition VG to M-. Full Excel inventory with grades available. Serious buyers only.</p>",
    keyDetails: [
      { key: "Format",    value: "45rpm singles × 200"       },
      { key: "Genre",     value: "Northern Soul"             },
      { key: "Labels",    value: "Tamla, Atlantic, Stax, UK minor" },
      { key: "Condition", value: "VG to M- (see list)"       },
    ],
    goodToKnow: [
      { key: "Inventory",  value: "Full Excel list + grades" },
      { key: "Viewings",   value: "By appointment"          },
      { key: "Collection", value: "Dalston E8"              },
      { key: "Delivery",   value: "Insured post available"  },
    ],
    coordinates: { lat: 51.5478, lng: -0.0759 },
    seller: SELLERS.collectorsDesk,
  },
];
