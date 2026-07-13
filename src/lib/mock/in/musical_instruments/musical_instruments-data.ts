import type { MockListing } from "@/lib/mock/mock-listing-schema";
import { SELLERS, img, daysAgo, hrsAgo } from "./sellers";

// ── guitars_bass ──────────────────────────────────────────────────────────
export const IN_MUSIC_GUITARS_BASS: MockListing[] = [
  {
    id: "music-in-guitar-01", href: "/listings/music-in-guitar-01", advId: "37001",
    images: [{ src: img(9), alt: "Acoustic guitar" }],
    priceLabel: "\u20b96,500",
    title: "Acoustic Guitar \u2014 Solid Top, Includes Gig Bag",
    detailsLabel: "GUITARS & BASS \u2022 ACOUSTIC \u2022 KOLKATA",
    locationLabel: "Park Street, Kolkata",
    postedAt: hrsAgo(3),
    description: "<p>Solid top acoustic guitar with warm tone, includes padded gig bag for transport.</p>",
    keyDetails: [
      { key: "Top", value: "Solid wood" },
    ],
    goodToKnow: [
      { key: "Includes", value: "Gig bag" },
    ],
    coordinates: { lat: 22.5535, lng: 88.3529 },
    seller: SELLERS.guitarsIndia,
  },
  {
    id: "music-in-guitar-02", href: "/listings/music-in-guitar-02", advId: "37002",
    images: [{ src: img(1), alt: "Electric bass guitar" }],
    priceLabel: "\u20b912,000",
    title: "4-String Electric Bass Guitar \u2014 With Amp",
    detailsLabel: "GUITARS & BASS \u2022 BASS \u2022 KOLKATA",
    locationLabel: "Park Street, Kolkata",
    postedAt: daysAgo(1),
    description: "<p>4-string electric bass guitar bundled with a practice amplifier, great for beginners.</p>",
    keyDetails: [
      { key: "Strings", value: "4" },
    ],
    goodToKnow: [
      { key: "Includes", value: "Amplifier" },
    ],
    coordinates: { lat: 22.5535, lng: 88.3529 },
    seller: SELLERS.guitarsIndia,
  },
];

// ── keyboards_piano ──────────────────────────────────────────────────────────
export const IN_MUSIC_KEYBOARDS_PIANO: MockListing[] = [
  {
    id: "music-in-keys-01", href: "/listings/music-in-keys-01", advId: "37011",
    images: [{ src: img(2), alt: "Digital piano" }],
    priceLabel: "\u20b928,000",
    title: "88-Key Digital Piano \u2014 Weighted Keys, Stand Included",
    detailsLabel: "KEYBOARDS & PIANO \u2022 DIGITAL PIANO \u2022 CHENNAI",
    locationLabel: "Adyar, Chennai",
    postedAt: hrsAgo(5),
    description: "<p>88-key weighted digital piano with realistic touch response, includes matching stand.</p>",
    keyDetails: [
      { key: "Keys", value: "88, weighted" },
    ],
    goodToKnow: [
      { key: "Includes", value: "Stand" },
    ],
    coordinates: { lat: 13.0012, lng: 80.2565 },
    seller: SELLERS.keyboardsIndia,
  },
  {
    id: "music-in-keys-02", href: "/listings/music-in-keys-02", advId: "37012",
    images: [{ src: img(3), alt: "Portable keyboard" }],
    priceLabel: "\u20b98,500",
    title: "61-Key Portable Keyboard \u2014 200 Tones, Built-in Speakers",
    detailsLabel: "KEYBOARDS & PIANO \u2022 KEYBOARD \u2022 CHENNAI",
    locationLabel: "Adyar, Chennai",
    postedAt: daysAgo(2),
    description: "<p>61-key portable keyboard with 200 built-in tones and speakers, great for beginners.</p>",
    keyDetails: [
      { key: "Keys", value: "61" },
    ],
    goodToKnow: [
      { key: "Tones", value: "200" },
    ],
    coordinates: { lat: 13.0012, lng: 80.2565 },
    seller: SELLERS.keyboardsIndia,
  },
];

// ── drums_percussion ──────────────────────────────────────────────────────────
export const IN_MUSIC_DRUMS_PERCUSSION: MockListing[] = [
  {
    id: "music-in-drums-01", href: "/listings/music-in-drums-01", advId: "37021",
    images: [{ src: img(4), alt: "Drum kit" }],
    priceLabel: "\u20b935,000",
    title: "5-Piece Drum Kit \u2014 Includes Cymbals & Throne",
    detailsLabel: "DRUMS & PERCUSSION \u2022 DRUM KIT \u2022 MUMBAI",
    locationLabel: "Andheri East, Mumbai",
    postedAt: hrsAgo(7),
    description: "<p>Complete 5-piece drum kit with cymbals and drummer's throne included.</p>",
    keyDetails: [
      { key: "Pieces", value: "5" },
    ],
    goodToKnow: [
      { key: "Includes", value: "Cymbals + throne" },
    ],
    coordinates: { lat: 19.1197, lng: 72.8697 },
    seller: SELLERS.drumsIndia,
  },
  {
    id: "music-in-drums-02", href: "/listings/music-in-drums-02", advId: "37022",
    images: [{ src: img(5), alt: "Tabla set" }],
    priceLabel: "\u20b95,500",
    title: "Traditional Tabla Set \u2014 Sheesham Wood, With Bag",
    detailsLabel: "DRUMS & PERCUSSION \u2022 TABLA \u2022 MUMBAI",
    locationLabel: "Andheri East, Mumbai",
    postedAt: daysAgo(1),
    description: "<p>Traditional tabla set made of sheesham wood, includes carrying bag.</p>",
    keyDetails: [
      { key: "Material", value: "Sheesham wood" },
    ],
    goodToKnow: [
      { key: "Includes", value: "Carry bag" },
    ],
    coordinates: { lat: 19.1197, lng: 72.8697 },
    seller: SELLERS.drumsIndia,
  },
];

// ── dj_audio_gear ──────────────────────────────────────────────────────────
export const IN_MUSIC_DJ_AUDIO_GEAR: MockListing[] = [
  {
    id: "music-in-dj-01", href: "/listings/music-in-dj-01", advId: "37031",
    images: [{ src: img(6), alt: "DJ controller" }],
    priceLabel: "\u20b922,000",
    title: "2-Channel DJ Controller \u2014 With Software License",
    detailsLabel: "DJ & AUDIO GEAR \u2022 CONTROLLER \u2022 MUMBAI",
    locationLabel: "Bandra, Mumbai",
    postedAt: hrsAgo(2),
    description: "<p>2-channel DJ controller with included DJ software license, great for beginners and semi-pros.</p>",
    keyDetails: [
      { key: "Channels", value: "2" },
    ],
    goodToKnow: [
      { key: "Software", value: "License included" },
    ],
    coordinates: { lat: 19.0596, lng: 72.8295 },
    seller: SELLERS.djAudioIndia,
  },
  {
    id: "music-in-dj-02", href: "/listings/music-in-dj-02", advId: "37032",
    images: [{ src: img(7), alt: "PA speaker" }],
    priceLabel: "\u20b915,000",
    title: "Active PA Speaker \u2014 1000W, Bluetooth Enabled",
    detailsLabel: "DJ & AUDIO GEAR \u2022 SPEAKER \u2022 MUMBAI",
    locationLabel: "Bandra, Mumbai",
    postedAt: daysAgo(2),
    description: "<p>1000W active PA speaker with Bluetooth connectivity, ideal for events and gigs.</p>",
    keyDetails: [
      { key: "Power", value: "1000W" },
    ],
    goodToKnow: [
      { key: "Connectivity", value: "Bluetooth" },
    ],
    coordinates: { lat: 19.0596, lng: 72.8295 },
    seller: SELLERS.djAudioIndia,
  },
];

// ── wind_brass_strings ──────────────────────────────────────────────────────────
export const IN_MUSIC_WIND_BRASS_STRINGS: MockListing[] = [
  {
    id: "music-in-wind-01", href: "/listings/music-in-wind-01", advId: "37041",
    images: [{ src: img(8), alt: "Violin" }],
    priceLabel: "\u20b98,000",
    title: "4/4 Size Violin \u2014 With Bow & Case",
    detailsLabel: "WIND, BRASS & STRINGS \u2022 VIOLIN \u2022 BENGALURU",
    locationLabel: "Fraser Town, Bengaluru",
    postedAt: hrsAgo(9),
    description: "<p>Full size 4/4 violin with bow and hard case, suitable for students and intermediate players.</p>",
    keyDetails: [
      { key: "Size", value: "4/4" },
    ],
    goodToKnow: [
      { key: "Includes", value: "Bow + case" },
    ],
    coordinates: { lat: 12.9989, lng: 77.6098 },
    seller: SELLERS.windBrassIndia,
  },
  {
    id: "music-in-wind-02", href: "/listings/music-in-wind-02", advId: "37042",
    images: [{ src: img(9), alt: "Flute" }],
    priceLabel: "\u20b93,200",
    title: "Bansuri Flute \u2014 Bamboo, Professional Grade",
    detailsLabel: "WIND, BRASS & STRINGS \u2022 FLUTE \u2022 BENGALURU",
    locationLabel: "Fraser Town, Bengaluru",
    postedAt: daysAgo(1),
    description: "<p>Professional grade bamboo bansuri flute, well-tuned and suitable for performances.</p>",
    keyDetails: [
      { key: "Material", value: "Bamboo" },
    ],
    goodToKnow: [
      { key: "Grade", value: "Professional" },
    ],
    coordinates: { lat: 12.9989, lng: 77.6098 },
    seller: SELLERS.windBrassIndia,
  },
];

// ── accessories ──────────────────────────────────────────────────────────────
export const IN_MUSIC_ACCESSORIES: MockListing[] = [
  {
    id: "music-in-acc-01", href: "/listings/music-in-acc-01", advId: "37051",
    images: [{ src: img(1), alt: "Guitar strings pack" }],
    priceLabel: "\u20b9450",
    title: "Guitar Strings Pack \u2014 Light Gauge, Set of 3",
    detailsLabel: "ACCESSORIES \u2022 STRINGS \u2022 DELHI",
    locationLabel: "Karol Bagh, Delhi",
    postedAt: hrsAgo(11),
    description: "<p>Set of 3 light gauge guitar string packs, suitable for acoustic and electric guitars.</p>",
    keyDetails: [
      { key: "Sets", value: "3" },
    ],
    goodToKnow: [
      { key: "Gauge", value: "Light" },
    ],
    coordinates: { lat: 28.6519, lng: 77.1909 },
    seller: SELLERS.instrumentAccessoriesIndia,
  },
  {
    id: "music-in-acc-02", href: "/listings/music-in-acc-02", advId: "37052",
    images: [{ src: img(2), alt: "Instrument case" }],
    priceLabel: "\u20b92,800",
    title: "Hard Shell Guitar Case \u2014 Padded Interior, Fits Dreadnought",
    detailsLabel: "ACCESSORIES \u2022 CASE \u2022 DELHI",
    locationLabel: "Karol Bagh, Delhi",
    postedAt: daysAgo(1),
    description: "<p>Hard shell guitar case with padded interior, fits dreadnought-size acoustic guitars.</p>",
    keyDetails: [
      { key: "Fits", value: "Dreadnought size" },
    ],
    goodToKnow: [
      { key: "Interior", value: "Padded" },
    ],
    coordinates: { lat: 28.6519, lng: 77.1909 },
    seller: SELLERS.instrumentAccessoriesIndia,
  },
];
