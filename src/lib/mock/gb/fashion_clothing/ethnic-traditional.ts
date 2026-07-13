import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── ethnic_traditional ─────────────────────────────────────────────────────────
export const FASHION_ETHNIC: MockListing[] = [
  {
    id: "fash-eth-01", href: "/listings/fash-eth-01", advId: "19021",
    images: [{ src: img(5), alt: "Saree" }],
    priceLabel: "£85",
    title: "Kanjivaram Silk Saree — Deep Blue & Gold Zari, Excellent Condition",
    detailsLabel: "ETHNIC & TRADITIONAL • EXCELLENT • SAREE",
    locationLabel: "Southall, London",
    postedAt: daysAgo(1),
    description: "<p>Exquisite <strong>Kanjivaram pure silk saree</strong> in deep blue with rich gold zari border and pallu. Worn once for a wedding — dry-cleaned and stored in original tissue. Blouse piece included (unstitched).</p>",
    keyDetails: [
      { key: "Type",      value: "Kanjivaram Silk Saree"    },
      { key: "Colour",    value: "Deep blue + gold zari"    },
      { key: "Blouse",    value: "Unstitched piece included" },
      { key: "Condition", value: "Excellent — worn once"    },
    ],
    goodToKnow: [
      { key: "Dry-cleaned", value: "Yes"                    },
      { key: "Storage",    value: "Original tissue box"     },
      { key: "Collection", value: "Southall UB1"            },
      { key: "Postage",    value: "Available — insured"     },
    ],
    coordinates: { lat: 51.5117, lng: -0.3756 },
    seller: SELLERS.fashionBtq,
  },
  {
    id: "fash-eth-02", href: "/listings/fash-eth-02", advId: "19022",
    images: [{ src: img(6), alt: "Nigerian Agbada" }],
    priceLabel: "£45",
    title: "Men's Nigerian Agbada 3-Piece Set — Navy & Gold Embroidery, Size L",
    detailsLabel: "ETHNIC & TRADITIONAL • EXCELLENT • AGBADA",
    locationLabel: "Peckham, London",
    postedAt: daysAgo(1),
    description: "<p>Beautiful 3-piece <strong>Nigerian Agbada</strong> in deep navy with gold embroidery — flowing outer robe, under-gown, and trousers. Men's Large. Worn once to a traditional wedding. Hand-washed and pressed.</p>",
    keyDetails: [
      { key: "Garment",   value: "Agbada 3-piece"           },
      { key: "Colour",    value: "Navy + gold embroidery"   },
      { key: "Size",      value: "Men's Large"              },
      { key: "Condition", value: "Excellent — worn once"   },
    ],
    goodToKnow: [
      { key: "Washed",     value: "Hand-washed + pressed"  },
      { key: "Occasion",   value: "Traditional wedding"    },
      { key: "Collection", value: "Peckham SE15"           },
      { key: "Postage",    value: "Available (£5)"          },
    ],
    coordinates: { lat: 51.4741, lng: -0.0686 },
    seller: SELLERS.fashionBtq,
  },
  {
    id: "fash-eth-03", href: "/listings/fash-eth-03", advId: "19023",
    images: [{ src: img(7), alt: "Embroidered abaya" }],
    priceLabel: "£65",
    title: "Embroidered Occasion Abaya — Black + Rose Gold, Size M (UK 10-12)",
    detailsLabel: "ETHNIC & TRADITIONAL • EXCELLENT • ABAYA",
    locationLabel: "Whitechapel, London",
    postedAt: daysAgo(2),
    description: "<p>Elegant <strong>occasion abaya</strong> in black crepe with rose gold hand-embroidered floral detail on cuffs and hem. Maxi length, size M (UK 10–12). Worn once. Dry-cleaned and pressed. Perfect for Eid or a wedding.</p>",
    keyDetails: [
      { key: "Style",     value: "Embroidered abaya"         },
      { key: "Colour",    value: "Black + rose gold"         },
      { key: "Size",      value: "M (UK 10–12)"              },
      { key: "Length",    value: "Maxi"                     },
    ],
    goodToKnow: [
      { key: "Occasion",   value: "Eid / wedding guest"     },
      { key: "Cleaned",    value: "Dry-cleaned"             },
      { key: "Collection", value: "Whitechapel E1"          },
      { key: "Postage",    value: "Available (£5)"          },
    ],
    coordinates: { lat: 51.5194, lng: -0.0627 },
    seller: SELLERS.fashionBtq,
  },
];

