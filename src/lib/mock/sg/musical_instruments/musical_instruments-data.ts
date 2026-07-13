import type { MockListing } from "@/lib/mock/mock-listing-schema";
import { SELLERS, img, daysAgo, hrsAgo } from "./sellers";

// ── guitars_bass ──────────────────────────────────────────────────────────
export const SG_MUSIC_GUITARS_BASS: MockListing[] = [
  {
    id: "music-sg-guitar-01", href: "/listings/music-sg-guitar-01", advId: "47001",
    images: [{ src: img(9), alt: "Acoustic guitar" }],
    priceLabel: "S$160",
    title: "Acoustic Guitar \u2014 Solid Top, Includes Gig Bag",
    detailsLabel: "GUITARS & BASS \u2022 ACOUSTIC \u2022 SINGAPORE",
    locationLabel: "Bras Basah, Singapore",
    postedAt: hrsAgo(3),
    description: "<p>Solid top acoustic guitar with warm tone, includes padded gig bag for transport.</p>",
    keyDetails: [
      { key: "Top", value: "Solid wood" },
    ],
    goodToKnow: [
      { key: "Includes", value: "Gig bag" },
    ],
    coordinates: { lat: 1.2977, lng: 103.8508 },
    seller: SELLERS.guitarsSG,
  },
  {
    id: "music-sg-guitar-02", href: "/listings/music-sg-guitar-02", advId: "47002",
    images: [{ src: img(1), alt: "Electric bass guitar" }],
    priceLabel: "S$300",
    title: "4-String Electric Bass Guitar \u2014 With Amp",
    detailsLabel: "GUITARS & BASS \u2022 BASS \u2022 SINGAPORE",
    locationLabel: "Bras Basah, Singapore",
    postedAt: daysAgo(1),
    description: "<p>4-string electric bass guitar bundled with a practice amplifier, great for beginners.</p>",
    keyDetails: [
      { key: "Strings", value: "4" },
    ],
    goodToKnow: [
      { key: "Includes", value: "Amplifier" },
    ],
    coordinates: { lat: 1.2977, lng: 103.8508 },
    seller: SELLERS.guitarsSG,
  },
];

// ── keyboards_piano ──────────────────────────────────────────────────────────
export const SG_MUSIC_KEYBOARDS_PIANO: MockListing[] = [
  {
    id: "music-sg-keys-01", href: "/listings/music-sg-keys-01", advId: "47011",
    images: [{ src: img(2), alt: "Digital piano" }],
    priceLabel: "S$650",
    title: "88-Key Digital Piano \u2014 Weighted Keys, Stand Included",
    detailsLabel: "KEYBOARDS & PIANO \u2022 DIGITAL PIANO \u2022 SINGAPORE",
    locationLabel: "Novena, Singapore",
    postedAt: hrsAgo(5),
    description: "<p>88-key weighted digital piano with realistic touch response, includes matching stand.</p>",
    keyDetails: [
      { key: "Keys", value: "88, weighted" },
    ],
    goodToKnow: [
      { key: "Includes", value: "Stand" },
    ],
    coordinates: { lat: 1.3204, lng: 103.8437 },
    seller: SELLERS.keyboardsSG,
  },
  {
    id: "music-sg-keys-02", href: "/listings/music-sg-keys-02", advId: "47012",
    images: [{ src: img(3), alt: "Portable keyboard" }],
    priceLabel: "S$190",
    title: "61-Key Portable Keyboard \u2014 200 Tones, Built-in Speakers",
    detailsLabel: "KEYBOARDS & PIANO \u2022 KEYBOARD \u2022 SINGAPORE",
    locationLabel: "Novena, Singapore",
    postedAt: daysAgo(2),
    description: "<p>61-key portable keyboard with 200 built-in tones and speakers, great for beginners.</p>",
    keyDetails: [
      { key: "Keys", value: "61" },
    ],
    goodToKnow: [
      { key: "Tones", value: "200" },
    ],
    coordinates: { lat: 1.3204, lng: 103.8437 },
    seller: SELLERS.keyboardsSG,
  },
];

// ── drums_percussion ──────────────────────────────────────────────────────────
export const SG_MUSIC_DRUMS_PERCUSSION: MockListing[] = [
  {
    id: "music-sg-drums-01", href: "/listings/music-sg-drums-01", advId: "47021",
    images: [{ src: img(4), alt: "Drum kit" }],
    priceLabel: "S$780",
    title: "5-Piece Drum Kit \u2014 Includes Cymbals & Throne",
    detailsLabel: "DRUMS & PERCUSSION \u2022 DRUM KIT \u2022 SINGAPORE",
    locationLabel: "Geylang, Singapore",
    postedAt: hrsAgo(7),
    description: "<p>Complete 5-piece drum kit with cymbals and drummer's throne included.</p>",
    keyDetails: [
      { key: "Pieces", value: "5" },
    ],
    goodToKnow: [
      { key: "Includes", value: "Cymbals + throne" },
    ],
    coordinates: { lat: 1.3181, lng: 103.8837 },
    seller: SELLERS.drumsSG,
  },
  {
    id: "music-sg-drums-02", href: "/listings/music-sg-drums-02", advId: "47022",
    images: [{ src: img(5), alt: "Tabla set" }],
    priceLabel: "S$120",
    title: "Traditional Tabla Set \u2014 Sheesham Wood, With Bag",
    detailsLabel: "DRUMS & PERCUSSION \u2022 TABLA \u2022 SINGAPORE",
    locationLabel: "Geylang, Singapore",
    postedAt: daysAgo(1),
    description: "<p>Traditional tabla set made of sheesham wood, includes carrying bag.</p>",
    keyDetails: [
      { key: "Material", value: "Sheesham wood" },
    ],
    goodToKnow: [
      { key: "Includes", value: "Carry bag" },
    ],
    coordinates: { lat: 1.3181, lng: 103.8837 },
    seller: SELLERS.drumsSG,
  },
];

// ── dj_audio_gear ──────────────────────────────────────────────────────────
export const SG_MUSIC_DJ_AUDIO_GEAR: MockListing[] = [
  {
    id: "music-sg-dj-01", href: "/listings/music-sg-dj-01", advId: "47031",
    images: [{ src: img(6), alt: "DJ controller" }],
    priceLabel: "S$480",
    title: "2-Channel DJ Controller \u2014 With Software License",
    detailsLabel: "DJ & AUDIO GEAR \u2022 CONTROLLER \u2022 SINGAPORE",
    locationLabel: "Clarke Quay, Singapore",
    postedAt: hrsAgo(2),
    description: "<p>2-channel DJ controller with included DJ software license, great for beginners and semi-pros.</p>",
    keyDetails: [
      { key: "Channels", value: "2" },
    ],
    goodToKnow: [
      { key: "Software", value: "License included" },
    ],
    coordinates: { lat: 1.2884, lng: 103.8465 },
    seller: SELLERS.djAudioSG,
  },
  {
    id: "music-sg-dj-02", href: "/listings/music-sg-dj-02", advId: "47032",
    images: [{ src: img(7), alt: "PA speaker" }],
    priceLabel: "S$340",
    title: "Active PA Speaker \u2014 1000W, Bluetooth Enabled",
    detailsLabel: "DJ & AUDIO GEAR \u2022 SPEAKER \u2022 SINGAPORE",
    locationLabel: "Clarke Quay, Singapore",
    postedAt: daysAgo(2),
    description: "<p>1000W active PA speaker with Bluetooth connectivity, ideal for events and gigs.</p>",
    keyDetails: [
      { key: "Power", value: "1000W" },
    ],
    goodToKnow: [
      { key: "Connectivity", value: "Bluetooth" },
    ],
    coordinates: { lat: 1.2884, lng: 103.8465 },
    seller: SELLERS.djAudioSG,
  },
];

// ── wind_brass_strings ──────────────────────────────────────────────────────────
export const SG_MUSIC_WIND_BRASS_STRINGS: MockListing[] = [
  {
    id: "music-sg-wind-01", href: "/listings/music-sg-wind-01", advId: "47041",
    images: [{ src: img(8), alt: "Violin" }],
    priceLabel: "S$180",
    title: "4/4 Size Violin \u2014 With Bow & Case",
    detailsLabel: "WIND, BRASS & STRINGS \u2022 VIOLIN \u2022 SINGAPORE",
    locationLabel: "Serangoon, Singapore",
    postedAt: hrsAgo(9),
    description: "<p>Full size 4/4 violin with bow and hard case, suitable for students and intermediate players.</p>",
    keyDetails: [
      { key: "Size", value: "4/4" },
    ],
    goodToKnow: [
      { key: "Includes", value: "Bow + case" },
    ],
    coordinates: { lat: 1.3554, lng: 103.8679 },
    seller: SELLERS.windBrassSG,
  },
  {
    id: "music-sg-wind-02", href: "/listings/music-sg-wind-02", advId: "47042",
    images: [{ src: img(9), alt: "Flute" }],
    priceLabel: "S$65",
    title: "Bansuri Flute \u2014 Bamboo, Professional Grade",
    detailsLabel: "WIND, BRASS & STRINGS \u2022 FLUTE \u2022 SINGAPORE",
    locationLabel: "Serangoon, Singapore",
    postedAt: daysAgo(1),
    description: "<p>Professional grade bamboo bansuri flute, well-tuned and suitable for performances.</p>",
    keyDetails: [
      { key: "Material", value: "Bamboo" },
    ],
    goodToKnow: [
      { key: "Grade", value: "Professional" },
    ],
    coordinates: { lat: 1.3554, lng: 103.8679 },
    seller: SELLERS.windBrassSG,
  },
];

// ── accessories ──────────────────────────────────────────────────────────────
export const SG_MUSIC_ACCESSORIES: MockListing[] = [
  {
    id: "music-sg-acc-01", href: "/listings/music-sg-acc-01", advId: "47051",
    images: [{ src: img(1), alt: "Guitar strings pack" }],
    priceLabel: "S$25",
    title: "Guitar Strings Pack \u2014 Light Gauge, Set of 3",
    detailsLabel: "ACCESSORIES \u2022 STRINGS \u2022 SINGAPORE",
    locationLabel: "Bugis, Singapore",
    postedAt: hrsAgo(11),
    description: "<p>Set of 3 light gauge guitar string packs, suitable for acoustic and electric guitars.</p>",
    keyDetails: [
      { key: "Sets", value: "3" },
    ],
    goodToKnow: [
      { key: "Gauge", value: "Light" },
    ],
    coordinates: { lat: 1.3006, lng: 103.8559 },
    seller: SELLERS.instrumentAccessoriesSG,
  },
  {
    id: "music-sg-acc-02", href: "/listings/music-sg-acc-02", advId: "47052",
    images: [{ src: img(2), alt: "Instrument case" }],
    priceLabel: "S$60",
    title: "Hard Shell Guitar Case \u2014 Padded Interior, Fits Dreadnought",
    detailsLabel: "ACCESSORIES \u2022 CASE \u2022 SINGAPORE",
    locationLabel: "Bugis, Singapore",
    postedAt: daysAgo(1),
    description: "<p>Hard shell guitar case with padded interior, fits dreadnought-size acoustic guitars.</p>",
    keyDetails: [
      { key: "Fits", value: "Dreadnought size" },
    ],
    goodToKnow: [
      { key: "Interior", value: "Padded" },
    ],
    coordinates: { lat: 1.3006, lng: 103.8559 },
    seller: SELLERS.instrumentAccessoriesSG,
  },
];
