import type { MockListing } from "@/lib/mock/mock-listing-schema";
import { SELLERS, img, daysAgo, hrsAgo } from "./sellers";

// ── for_sale ──────────────────────────────────────────────────────────────────
export const IN_PETS_FOR_SALE: MockListing[] = [
  {
    id: "pet-in-sale-01", href: "/listings/pet-in-sale-01", advId: "24001",
    images: [{ src: img(1), alt: "Labrador puppy" }],
    priceLabel: "\u20b925,000",
    title: "Labrador Retriever Puppies \u2014 KCI Registered, Vaccinated",
    detailsLabel: "DOG \u2022 LABRADOR \u2022 8 WEEKS OLD",
    locationLabel: "Sarjapur Road, Bengaluru",
    postedAt: hrsAgo(3),
    description: "<p>KCI-registered <strong>Labrador Retriever puppies</strong>, 8 weeks old, first vaccination done and dewormed. Both parents on-site, friendly temperament.</p>",
    keyDetails: [
      { key: "Breed",       value: "Labrador Retriever" },
      { key: "Age",         value: "8 weeks"            },
      { key: "Vaccination", value: "1st dose done"      },
    ],
    goodToKnow: [
      { key: "Registration", value: "KCI registered" },
      { key: "Delivery",     value: "Pickup preferred" },
    ],
    coordinates: { lat: 12.9010, lng: 77.6870 },
    seller: SELLERS.puppyLoveKennel,
  },
  {
    id: "pet-in-sale-02", href: "/listings/pet-in-sale-02", advId: "24002",
    images: [{ src: img(2), alt: "Golden Retriever puppy" }],
    priceLabel: "\u20b930,000",
    title: "Golden Retriever Puppies \u2014 Show Quality, Health Certified",
    detailsLabel: "DOG \u2022 GOLDEN RETRIEVER \u2022 10 WEEKS OLD",
    locationLabel: "Sarjapur Road, Bengaluru",
    postedAt: daysAgo(1),
    description: "<p>Show-quality <strong>Golden Retriever puppies</strong> from champion bloodline. Health certificate and vaccination card provided.</p>",
    keyDetails: [
      { key: "Breed", value: "Golden Retriever" },
      { key: "Age",   value: "10 weeks"          },
    ],
    goodToKnow: [
      { key: "Health Cert.", value: "Provided" },
    ],
    coordinates: { lat: 12.9010, lng: 77.6870 },
    seller: SELLERS.puppyLoveKennel,
  },
];

// ── adoption ──────────────────────────────────────────────────────────────────
export const IN_PETS_ADOPTION: MockListing[] = [
  {
    id: "pet-in-adopt-01", href: "/listings/pet-in-adopt-01", advId: "24011",
    images: [{ src: img(3), alt: "Indie dog rescue" }],
    priceLabel: "\u20b91,500 adoption fee",
    title: "Rescued Indie Dog \u2014 2 Years, Friendly & House-Trained",
    detailsLabel: "DOG \u2022 INDIE MIX \u2022 2 YEARS",
    locationLabel: "Vasant Kunj, Delhi",
    postedAt: hrsAgo(6),
    description: "<p>Rescued and rehabilitated <strong>Indie mix dog</strong>, fully house-trained, great with children. Sterilised and vaccinated \u2014 adoption fee covers medical costs.</p>",
    keyDetails: [
      { key: "Breed",      value: "Indie Mix"    },
      { key: "Age",        value: "2 years"      },
      { key: "Sterilised", value: "Yes"          },
    ],
    goodToKnow: [
      { key: "Home Check", value: "Required before adoption" },
    ],
    coordinates: { lat: 28.5244, lng: 77.1592 },
    seller: SELLERS.pawsShelterDelhi,
  },
  {
    id: "pet-in-adopt-02", href: "/listings/pet-in-adopt-02", advId: "24012",
    images: [{ src: img(4), alt: "Rescued cat" }],
    priceLabel: "\u20b91,000 adoption fee",
    title: "Rescued Kitten \u2014 4 Months, Litter-Trained, Playful",
    detailsLabel: "CAT \u2022 DOMESTIC MIX \u2022 4 MONTHS",
    locationLabel: "Vasant Kunj, Delhi",
    postedAt: daysAgo(2),
    description: "<p>Playful rescued kitten, litter-trained and comfortable with other pets. First vaccination done, dewormed.</p>",
    keyDetails: [
      { key: "Breed", value: "Domestic Mix" },
      { key: "Age",   value: "4 months"     },
    ],
    goodToKnow: [
      { key: "Home Check", value: "Required before adoption" },
    ],
    coordinates: { lat: 28.5244, lng: 77.1592 },
    seller: SELLERS.pawsShelterDelhi,
  },
];

// ── service ───────────────────────────────────────────────────────────────────
export const IN_PETS_SERVICE: MockListing[] = [
  {
    id: "pet-in-svc-01", href: "/listings/pet-in-svc-01", advId: "24021",
    images: [{ src: img(5), alt: "Pet grooming" }],
    priceLabel: "\u20b9899", priceSuffix: "/ session",
    title: "Home Pet Grooming \u2014 Bath, Trim & Nail Clipping",
    detailsLabel: "GROOMING \u2022 HOME VISIT \u2022 MUMBAI",
    locationLabel: "Bandra West, Mumbai",
    postedAt: hrsAgo(8),
    description: "<p>Full grooming session at your doorstep \u2014 bath, haircut, nail clipping, and ear cleaning for dogs and cats.</p>",
    keyDetails: [
      { key: "Service Type", value: "Grooming" },
      { key: "Coverage",     value: "Mumbai, home visits" },
    ],
    goodToKnow: [
      { key: "Duration", value: "45-60 minutes" },
    ],
    coordinates: { lat: 19.0596, lng: 72.8295 },
    seller: SELLERS.vetCareMumbai,
  },
  {
    id: "pet-in-svc-02", href: "/listings/pet-in-svc-02", advId: "24022",
    images: [{ src: img(6), alt: "Vet home visit" }],
    priceLabel: "\u20b9599", priceSuffix: "/ visit",
    title: "Veterinary Home Visit \u2014 Vaccination & General Check-up",
    detailsLabel: "VETERINARY \u2022 HOME VISIT \u2022 MUMBAI",
    locationLabel: "Bandra West, Mumbai",
    postedAt: daysAgo(1),
    description: "<p>Registered veterinarian available for home visits covering vaccinations, general health check-ups, and minor treatments.</p>",
    keyDetails: [
      { key: "Service Type", value: "Veterinary care" },
    ],
    goodToKnow: [
      { key: "Emergency", value: "Not for emergencies" },
    ],
    coordinates: { lat: 19.0596, lng: 72.8295 },
    seller: SELLERS.vetCareMumbai,
  },
];

// ── accessories ───────────────────────────────────────────────────────────────
export const IN_PETS_ACCESSORIES: MockListing[] = [
  {
    id: "pet-in-acc-01", href: "/listings/pet-in-acc-01", advId: "24031",
    images: [{ src: img(7), alt: "Dog crate" }],
    priceLabel: "\u20b93,200",
    title: "Large Dog Crate \u2014 Foldable, With Tray, Like New",
    detailsLabel: "ACCESSORIES \u2022 CRATE \u2022 LARGE",
    locationLabel: "Kothrud, Pune",
    postedAt: hrsAgo(10),
    description: "<p>Foldable large dog crate with removable tray, suitable for breeds up to 30kg. Used for 2 months only, excellent condition.</p>",
    keyDetails: [
      { key: "Item",  value: "Dog crate, large" },
      { key: "Condition", value: "Like new"     },
    ],
    goodToKnow: [
      { key: "Delivery", value: "Local delivery available" },
    ],
    coordinates: { lat: 18.5074, lng: 73.8077 },
    seller: SELLERS.petMartIndia,
  },
  {
    id: "pet-in-acc-02", href: "/listings/pet-in-acc-02", advId: "24032",
    images: [{ src: img(8), alt: "Cat tree" }],
    priceLabel: "\u20b92,500",
    title: "Cat Tree Tower \u2014 4-Tier, Scratching Posts Included",
    detailsLabel: "ACCESSORIES \u2022 CAT TREE \u2022 4-TIER",
    locationLabel: "Kothrud, Pune",
    postedAt: daysAgo(2),
    description: "<p>4-tier cat tree tower with sisal scratching posts and hammock. Sturdy build, ideal for multi-cat households.</p>",
    keyDetails: [
      { key: "Item", value: "Cat tree, 4-tier" },
    ],
    goodToKnow: [
      { key: "Delivery", value: "Local delivery available" },
    ],
    coordinates: { lat: 18.5074, lng: 73.8077 },
    seller: SELLERS.petMartIndia,
  },
];

// ── lost_found ────────────────────────────────────────────────────────────────
export const IN_PETS_LOST_FOUND: MockListing[] = [
  {
    id: "pet-in-lost-01", href: "/listings/pet-in-lost-01", advId: "24041",
    images: [{ src: img(9), alt: "Lost dog" }],
    priceLabel: "Reward \u20b95,000",
    title: "LOST: Beagle Dog \u2014 Near Indiranagar 100ft Road",
    detailsLabel: "LOST \u2022 BEAGLE \u2022 INDIRANAGAR",
    locationLabel: "Indiranagar, Bengaluru",
    postedAt: hrsAgo(5),
    description: "<p>Our Beagle went missing near 100ft Road, Indiranagar on evening walk. Wearing a red collar with tag. Reward offered for safe return.</p>",
    keyDetails: [
      { key: "Breed",     value: "Beagle" },
      { key: "Last Seen", value: "100ft Road, Indiranagar" },
    ],
    goodToKnow: [
      { key: "Reward", value: "\u20b95,000 for safe return" },
      { key: "Contact", value: "Message via LokalAds"       },
    ],
    coordinates: { lat: 12.9719, lng: 77.6412 },
    seller: SELLERS.individualPetOwner,
  },
  {
    id: "pet-in-lost-02", href: "/listings/pet-in-lost-02", advId: "24042",
    images: [{ src: img(1), alt: "Found cat" }],
    priceLabel: "No reward \u2014 reunite only",
    title: "FOUND: Grey Tabby Cat \u2014 Near HAL 2nd Stage",
    detailsLabel: "FOUND \u2022 TABBY CAT \u2022 HAL 2ND STAGE",
    locationLabel: "Indiranagar, Bengaluru",
    postedAt: daysAgo(1),
    description: "<p>Found a friendly grey tabby cat near HAL 2nd Stage. No collar, appears well-fed and used to people. Looking for the owner.</p>",
    keyDetails: [
      { key: "Type",      value: "Grey tabby cat" },
      { key: "Found Near",value: "HAL 2nd Stage"  },
    ],
    goodToKnow: [
      { key: "Contact", value: "Message via LokalAds" },
    ],
    coordinates: { lat: 12.9719, lng: 77.6412 },
    seller: SELLERS.individualPetOwner,
  },
];

// ── wanted ────────────────────────────────────────────────────────────────────
export const IN_PETS_WANTED: MockListing[] = [
  {
    id: "pet-in-want-01", href: "/listings/pet-in-want-01", advId: "24051",
    images: [{ src: img(2), alt: "Wanted puppy" }],
    priceLabel: "Budget \u20b915,000",
    title: "WANTED: Small Breed Puppy \u2014 Pug or Shih Tzu Preferred",
    detailsLabel: "WANTED \u2022 SMALL BREED \u2022 BENGALURU",
    locationLabel: "Indiranagar, Bengaluru",
    postedAt: hrsAgo(14),
    description: "<p>Family looking for a small breed puppy, preferably Pug or Shih Tzu, vaccinated and from a healthy litter. Budget up to \u20b915,000.</p>",
    keyDetails: [
      { key: "Budget", value: "Up to \u20b915,000" },
      { key: "Breed Preference", value: "Pug / Shih Tzu" },
    ],
    goodToKnow: [
      { key: "Timeline", value: "Within 1 month" },
    ],
    coordinates: { lat: 12.9719, lng: 77.6412 },
    seller: SELLERS.individualPetOwner,
  },
  {
    id: "pet-in-want-02", href: "/listings/pet-in-want-02", advId: "24052",
    images: [{ src: img(3), alt: "Wanted pet sitter" }],
    priceLabel: "Budget \u20b9500/day",
    title: "WANTED: Pet Sitter \u2014 2 Weeks While We\u2019re Traveling",
    detailsLabel: "WANTED \u2022 PET SITTING \u2022 BENGALURU",
    locationLabel: "Indiranagar, Bengaluru",
    postedAt: daysAgo(3),
    description: "<p>Looking for a reliable pet sitter to care for our dog for 2 weeks while we travel. Daily walks and feeding required.</p>",
    keyDetails: [
      { key: "Budget",   value: "\u20b9500/day approx." },
      { key: "Duration", value: "2 weeks"          },
    ],
    goodToKnow: [
      { key: "Contact", value: "Message via LokalAds" },
    ],
    coordinates: { lat: 12.9719, lng: 77.6412 },
    seller: SELLERS.individualPetOwner,
  },
];
