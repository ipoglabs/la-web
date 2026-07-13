import type { MockListing } from "@/lib/mock/mock-listing-schema";
import { SELLERS, img, daysAgo, hrsAgo } from "./sellers";

// ── for_sale ──────────────────────────────────────────────────────────────────
export const SG_PETS_FOR_SALE: MockListing[] = [
  {
    id: "pet-sg-sale-01", href: "/listings/pet-sg-sale-01", advId: "34001",
    images: [{ src: img(1), alt: "Poodle puppy" }],
    priceLabel: "S$3,800",
    title: "Toy Poodle Puppies \u2014 AVS Licensed Breeder, Vaccinated",
    detailsLabel: "DOG \u2022 TOY POODLE \u2022 8 WEEKS OLD",
    locationLabel: "Yishun, Singapore",
    postedAt: hrsAgo(3),
    description: "<p>AVS-licensed breeder offering <strong>Toy Poodle puppies</strong>, 8 weeks old, microchipped and first vaccination done. Hypoallergenic coat, ideal for apartment living.</p>",
    keyDetails: [
      { key: "Breed",       value: "Toy Poodle"   },
      { key: "Age",         value: "8 weeks"      },
      { key: "Microchipped",value: "Yes"          },
    ],
    goodToKnow: [
      { key: "Licence", value: "AVS licensed breeder" },
    ],
    coordinates: { lat: 1.4304, lng: 103.8354 },
    seller: SELLERS.sgKennelClub,
  },
  {
    id: "pet-sg-sale-02", href: "/listings/pet-sg-sale-02", advId: "34002",
    images: [{ src: img(2), alt: "Corgi puppy" }],
    priceLabel: "S$4,200",
    title: "Corgi Puppies \u2014 Health Certified, HDB-Approved Size",
    detailsLabel: "DOG \u2022 CORGI \u2022 10 WEEKS OLD",
    locationLabel: "Yishun, Singapore",
    postedAt: daysAgo(1),
    description: "<p>Health-certified <strong>Corgi puppies</strong> from an AVS-licensed kennel, HDB-approved breed size. Vaccination card and health certificate provided.</p>",
    keyDetails: [
      { key: "Breed", value: "Corgi"   },
      { key: "Age",   value: "10 weeks" },
    ],
    goodToKnow: [
      { key: "HDB Approved", value: "Yes, within size limit" },
    ],
    coordinates: { lat: 1.4304, lng: 103.8354 },
    seller: SELLERS.sgKennelClub,
  },
];

// ── adoption ──────────────────────────────────────────────────────────────────
export const SG_PETS_ADOPTION: MockListing[] = [
  {
    id: "pet-sg-adopt-01", href: "/listings/pet-sg-adopt-01", advId: "34011",
    images: [{ src: img(3), alt: "Rescued dog" }],
    priceLabel: "S$150 adoption fee",
    title: "Rescued Mixed-Breed Dog \u2014 2 Years, Friendly & House-Trained",
    detailsLabel: "DOG \u2022 MIXED BREED \u2022 2 YEARS",
    locationLabel: "Sungei Tengah, Singapore",
    postedAt: hrsAgo(6),
    description: "<p>Rescued and rehabilitated mixed-breed dog, fully house-trained, great with children. Sterilised and vaccinated \u2014 adoption fee covers medical costs.</p>",
    keyDetails: [
      { key: "Breed",      value: "Mixed Breed" },
      { key: "Age",        value: "2 years"      },
      { key: "Sterilised", value: "Yes"          },
    ],
    goodToKnow: [
      { key: "Home Check", value: "Required before adoption" },
    ],
    coordinates: { lat: 1.3736, lng: 103.7010 },
    seller: SELLERS.spcaShelterSG,
  },
  {
    id: "pet-sg-adopt-02", href: "/listings/pet-sg-adopt-02", advId: "34012",
    images: [{ src: img(4), alt: "Rescued cat" }],
    priceLabel: "S$100 adoption fee",
    title: "Rescued Kitten \u2014 4 Months, Litter-Trained, Playful",
    detailsLabel: "CAT \u2022 DOMESTIC MIX \u2022 4 MONTHS",
    locationLabel: "Sungei Tengah, Singapore",
    postedAt: daysAgo(2),
    description: "<p>Playful rescued kitten, litter-trained and comfortable with other pets. Vaccinated and dewormed.</p>",
    keyDetails: [
      { key: "Breed", value: "Domestic Mix" },
      { key: "Age",   value: "4 months"     },
    ],
    goodToKnow: [
      { key: "Home Check", value: "Required before adoption" },
    ],
    coordinates: { lat: 1.3736, lng: 103.7010 },
    seller: SELLERS.spcaShelterSG,
  },
];

// ── service ───────────────────────────────────────────────────────────────────
export const SG_PETS_SERVICE: MockListing[] = [
  {
    id: "pet-sg-svc-01", href: "/listings/pet-sg-svc-01", advId: "34021",
    images: [{ src: img(5), alt: "Pet grooming" }],
    priceLabel: "S$65", priceSuffix: "/ session",
    title: "Home Pet Grooming \u2014 Bath, Trim & Nail Clipping",
    detailsLabel: "GROOMING \u2022 HOME VISIT \u2022 SINGAPORE",
    locationLabel: "Novena, Singapore",
    postedAt: hrsAgo(8),
    description: "<p>Full grooming session at your doorstep \u2014 bath, haircut, nail clipping, and ear cleaning for dogs and cats.</p>",
    keyDetails: [
      { key: "Service Type", value: "Grooming" },
      { key: "Coverage",     value: "Island-wide home visits" },
    ],
    goodToKnow: [
      { key: "Duration", value: "45-60 minutes" },
    ],
    coordinates: { lat: 1.3204, lng: 103.8438 },
    seller: SELLERS.vetCareSG,
  },
  {
    id: "pet-sg-svc-02", href: "/listings/pet-sg-svc-02", advId: "34022",
    images: [{ src: img(6), alt: "Vet home visit" }],
    priceLabel: "S$80", priceSuffix: "/ visit",
    title: "Veterinary House Call \u2014 Vaccination & General Check-up",
    detailsLabel: "VETERINARY \u2022 HOME VISIT \u2022 SINGAPORE",
    locationLabel: "Novena, Singapore",
    postedAt: daysAgo(1),
    description: "<p>Registered veterinarian available for house calls covering vaccinations, general health check-ups, and minor treatments.</p>",
    keyDetails: [
      { key: "Service Type", value: "Veterinary care" },
    ],
    goodToKnow: [
      { key: "Emergency", value: "Not for emergencies" },
    ],
    coordinates: { lat: 1.3204, lng: 103.8438 },
    seller: SELLERS.vetCareSG,
  },
];

// ── accessories ───────────────────────────────────────────────────────────────
export const SG_PETS_ACCESSORIES: MockListing[] = [
  {
    id: "pet-sg-acc-01", href: "/listings/pet-sg-acc-01", advId: "34031",
    images: [{ src: img(7), alt: "Dog crate" }],
    priceLabel: "S$85",
    title: "Large Dog Crate \u2014 Foldable, With Tray, Like New",
    detailsLabel: "ACCESSORIES \u2022 CRATE \u2022 LARGE",
    locationLabel: "Bukit Timah, Singapore",
    postedAt: hrsAgo(10),
    description: "<p>Foldable large dog crate with removable tray, suitable for breeds up to 30kg. Used for 2 months only, excellent condition.</p>",
    keyDetails: [
      { key: "Item",      value: "Dog crate, large" },
      { key: "Condition", value: "Like new"          },
    ],
    goodToKnow: [
      { key: "Delivery", value: "Island-wide delivery available" },
    ],
    coordinates: { lat: 1.3294, lng: 103.8021 },
    seller: SELLERS.petMartSG,
  },
  {
    id: "pet-sg-acc-02", href: "/listings/pet-sg-acc-02", advId: "34032",
    images: [{ src: img(8), alt: "Cat tree" }],
    priceLabel: "S$70",
    title: "Cat Tree Tower \u2014 4-Tier, Scratching Posts Included",
    detailsLabel: "ACCESSORIES \u2022 CAT TREE \u2022 4-TIER",
    locationLabel: "Bukit Timah, Singapore",
    postedAt: daysAgo(2),
    description: "<p>4-tier cat tree tower with sisal scratching posts and hammock. Sturdy build, ideal for multi-cat households.</p>",
    keyDetails: [
      { key: "Item", value: "Cat tree, 4-tier" },
    ],
    goodToKnow: [
      { key: "Delivery", value: "Island-wide delivery available" },
    ],
    coordinates: { lat: 1.3294, lng: 103.8021 },
    seller: SELLERS.petMartSG,
  },
];

// ── lost_found ────────────────────────────────────────────────────────────────
export const SG_PETS_LOST_FOUND: MockListing[] = [
  {
    id: "pet-sg-lost-01", href: "/listings/pet-sg-lost-01", advId: "34041",
    images: [{ src: img(9), alt: "Lost dog" }],
    priceLabel: "Reward S$300",
    title: "LOST: Beagle Dog \u2014 Near Tampines Street 81",
    detailsLabel: "LOST \u2022 BEAGLE \u2022 TAMPINES",
    locationLabel: "Tampines, Singapore",
    postedAt: hrsAgo(5),
    description: "<p>Our Beagle went missing near Tampines Street 81 during an evening walk. Wearing a red collar with tag. Reward offered for safe return.</p>",
    keyDetails: [
      { key: "Breed",     value: "Beagle" },
      { key: "Last Seen", value: "Tampines Street 81" },
    ],
    goodToKnow: [
      { key: "Reward",  value: "S$300 for safe return" },
      { key: "Contact", value: "Message via LokalAds"  },
    ],
    coordinates: { lat: 1.3496, lng: 103.9568 },
    seller: SELLERS.individualPetOwnerSG,
  },
  {
    id: "pet-sg-lost-02", href: "/listings/pet-sg-lost-02", advId: "34042",
    images: [{ src: img(1), alt: "Found cat" }],
    priceLabel: "No reward \u2014 reunite only",
    title: "FOUND: Grey Tabby Cat \u2014 Near Tampines Central",
    detailsLabel: "FOUND \u2022 TABBY CAT \u2022 TAMPINES CENTRAL",
    locationLabel: "Tampines, Singapore",
    postedAt: daysAgo(1),
    description: "<p>Found a friendly grey tabby cat near Tampines Central. No collar, appears well-fed and used to people. Looking for the owner.</p>",
    keyDetails: [
      { key: "Type",       value: "Grey tabby cat" },
      { key: "Found Near", value: "Tampines Central" },
    ],
    goodToKnow: [
      { key: "Contact", value: "Message via LokalAds" },
    ],
    coordinates: { lat: 1.3496, lng: 103.9568 },
    seller: SELLERS.individualPetOwnerSG,
  },
];

// ── wanted ────────────────────────────────────────────────────────────────────
export const SG_PETS_WANTED: MockListing[] = [
  {
    id: "pet-sg-want-01", href: "/listings/pet-sg-want-01", advId: "34051",
    images: [{ src: img(2), alt: "Wanted puppy" }],
    priceLabel: "Budget S$2,500",
    title: "WANTED: Small Breed Puppy \u2014 Pomeranian or Shih Tzu Preferred",
    detailsLabel: "WANTED \u2022 SMALL BREED \u2022 SINGAPORE",
    locationLabel: "Tampines, Singapore",
    postedAt: hrsAgo(14),
    description: "<p>Family looking for a small breed puppy, preferably Pomeranian or Shih Tzu, vaccinated and from a healthy litter. Budget up to S$2,500.</p>",
    keyDetails: [
      { key: "Budget",           value: "Up to S$2,500" },
      { key: "Breed Preference", value: "Pomeranian / Shih Tzu" },
    ],
    goodToKnow: [
      { key: "Timeline", value: "Within 1 month" },
    ],
    coordinates: { lat: 1.3496, lng: 103.9568 },
    seller: SELLERS.individualPetOwnerSG,
  },
  {
    id: "pet-sg-want-02", href: "/listings/pet-sg-want-02", advId: "34052",
    images: [{ src: img(3), alt: "Wanted pet sitter" }],
    priceLabel: "Budget S$40/day",
    title: "WANTED: Pet Sitter \u2014 2 Weeks While We\u2019re Traveling",
    detailsLabel: "WANTED \u2022 PET SITTING \u2022 SINGAPORE",
    locationLabel: "Tampines, Singapore",
    postedAt: daysAgo(3),
    description: "<p>Looking for a reliable pet sitter to care for our dog for 2 weeks while we travel. Daily walks and feeding required.</p>",
    keyDetails: [
      { key: "Budget",   value: "S$40/day approx." },
      { key: "Duration", value: "2 weeks"          },
    ],
    goodToKnow: [
      { key: "Contact", value: "Message via LokalAds" },
    ],
    coordinates: { lat: 1.3496, lng: 103.9568 },
    seller: SELLERS.individualPetOwnerSG,
  },
];
