import type { MockListing } from "@/lib/mock/mock-listing-schema";
import { SELLERS, img, daysAgo, hrsAgo } from "./sellers";

// ── books_comics ──────────────────────────────────────────────────────────
export const SG_BOOKS_BOOKS_COMICS: MockListing[] = [
  {
    id: "books-sg-books-01", href: "/listings/books-sg-books-01", advId: "48001",
    images: [{ src: img(3), alt: "Novel collection" }],
    priceLabel: "S$28",
    title: "Classic Novel Collection \u2014 Set of 10 Paperbacks",
    detailsLabel: "BOOKS & COMICS \u2022 NOVELS \u2022 SINGAPORE",
    locationLabel: "Bras Basah, Singapore",
    postedAt: hrsAgo(2),
    description: "<p>Set of 10 classic novel paperbacks in good condition, great starter collection.</p>",
    keyDetails: [
      { key: "Books", value: "10" },
    ],
    goodToKnow: [
      { key: "Format", value: "Paperback" },
    ],
    coordinates: { lat: 1.2977, lng: 103.8508 },
    seller: SELLERS.booksComicsSG,
  },
  {
    id: "books-sg-books-02", href: "/listings/books-sg-books-02", advId: "48002",
    images: [{ src: img(4), alt: "Comic book bundle" }],
    priceLabel: "S$18",
    title: "Comic Book Bundle \u2014 15 Issues, Superhero Series",
    detailsLabel: "BOOKS & COMICS \u2022 COMICS \u2022 SINGAPORE",
    locationLabel: "Bras Basah, Singapore",
    postedAt: daysAgo(1),
    description: "<p>Bundle of 15 superhero comic book issues, well preserved condition.</p>",
    keyDetails: [
      { key: "Issues", value: "15" },
    ],
    goodToKnow: [
      { key: "Genre", value: "Superhero" },
    ],
    coordinates: { lat: 1.2977, lng: 103.8508 },
    seller: SELLERS.booksComicsSG,
  },
];

// ── vinyl_records ──────────────────────────────────────────────────────────
export const SG_BOOKS_VINYL_RECORDS: MockListing[] = [
  {
    id: "books-sg-vinyl-01", href: "/listings/books-sg-vinyl-01", advId: "48011",
    images: [{ src: img(5), alt: "Vinyl record" }],
    priceLabel: "S$60",
    title: "Classic Rock Vinyl Record \u2014 Original Pressing, Near Mint",
    detailsLabel: "VINYL RECORDS \u2022 ROCK \u2022 SINGAPORE",
    locationLabel: "Tiong Bahru, Singapore",
    postedAt: hrsAgo(4),
    description: "<p>Original pressing classic rock vinyl record, near mint condition, collector's item.</p>",
    keyDetails: [
      { key: "Condition", value: "Near mint" },
    ],
    goodToKnow: [
      { key: "Pressing", value: "Original" },
    ],
    coordinates: { lat: 1.2857, lng: 103.8322 },
    seller: SELLERS.vinylSG,
  },
  {
    id: "books-sg-vinyl-02", href: "/listings/books-sg-vinyl-02", advId: "48012",
    images: [{ src: img(6), alt: "Vinyl record player" }],
    priceLabel: "S$150",
    title: "Vintage Turntable \u2014 Belt Drive, Restored",
    detailsLabel: "VINYL RECORDS \u2022 TURNTABLE \u2022 SINGAPORE",
    locationLabel: "Tiong Bahru, Singapore",
    postedAt: daysAgo(2),
    description: "<p>Restored vintage belt-drive turntable, fully functional and cleaned.</p>",
    keyDetails: [
      { key: "Drive Type", value: "Belt drive" },
    ],
    goodToKnow: [
      { key: "Restored", value: "Yes" },
    ],
    coordinates: { lat: 1.2857, lng: 103.8322 },
    seller: SELLERS.vinylSG,
  },
];

// ── dvds_blu_ray ──────────────────────────────────────────────────────────
export const SG_BOOKS_DVDS_BLU_RAY: MockListing[] = [
  {
    id: "books-sg-dvd-01", href: "/listings/books-sg-dvd-01", advId: "48021",
    images: [{ src: img(7), alt: "Blu-ray box set" }],
    priceLabel: "S$42",
    title: "Blu-ray Trilogy Box Set \u2014 Collector's Edition",
    detailsLabel: "DVDS & BLU-RAY \u2022 BOX SET \u2022 SINGAPORE",
    locationLabel: "Bugis, Singapore",
    postedAt: hrsAgo(6),
    description: "<p>Collector's edition Blu-ray trilogy box set with special features and artwork.</p>",
    keyDetails: [
      { key: "Format", value: "Blu-ray" },
    ],
    goodToKnow: [
      { key: "Edition", value: "Collector's" },
    ],
    coordinates: { lat: 1.3006, lng: 103.8559 },
    seller: SELLERS.dvdSG,
  },
  {
    id: "books-sg-dvd-02", href: "/listings/books-sg-dvd-02", advId: "48022",
    images: [{ src: img(8), alt: "DVD collection" }],
    priceLabel: "S$20",
    title: "DVD Collection \u2014 20 Movies, Mixed Genres",
    detailsLabel: "DVDS & BLU-RAY \u2022 DVD \u2022 SINGAPORE",
    locationLabel: "Bugis, Singapore",
    postedAt: daysAgo(1),
    description: "<p>Collection of 20 DVDs across mixed genres, all in working condition.</p>",
    keyDetails: [
      { key: "Movies", value: "20" },
    ],
    goodToKnow: [
      { key: "Condition", value: "Working" },
    ],
    coordinates: { lat: 1.3006, lng: 103.8559 },
    seller: SELLERS.dvdSG,
  },
];

// ── board_games_puzzles ──────────────────────────────────────────────────────────
export const SG_BOOKS_BOARD_GAMES_PUZZLES: MockListing[] = [
  {
    id: "books-sg-board-01", href: "/listings/books-sg-board-01", advId: "48031",
    images: [{ src: img(9), alt: "Board game" }],
    priceLabel: "S$35",
    title: "Strategy Board Game \u2014 Complete Set, Ages 12+",
    detailsLabel: "BOARD GAMES & PUZZLES \u2022 BOARD GAME \u2022 SINGAPORE",
    locationLabel: "Holland Village, Singapore",
    postedAt: hrsAgo(8),
    description: "<p>Complete strategy board game set for ages 12 and up, all pieces included.</p>",
    keyDetails: [
      { key: "Age Group", value: "12+" },
    ],
    goodToKnow: [
      { key: "Completeness", value: "All pieces included" },
    ],
    coordinates: { lat: 1.3113, lng: 103.7963 },
    seller: SELLERS.boardGamesSG,
  },
  {
    id: "books-sg-board-02", href: "/listings/books-sg-board-02", advId: "48032",
    images: [{ src: img(1), alt: "Jigsaw puzzle" }],
    priceLabel: "S$15",
    title: "1000-Piece Jigsaw Puzzle \u2014 Scenic Landscape",
    detailsLabel: "BOARD GAMES & PUZZLES \u2022 PUZZLE \u2022 SINGAPORE",
    locationLabel: "Holland Village, Singapore",
    postedAt: daysAgo(1),
    description: "<p>1000-piece jigsaw puzzle featuring a scenic landscape image, unopened box.</p>",
    keyDetails: [
      { key: "Pieces", value: "1000" },
    ],
    goodToKnow: [
      { key: "Condition", value: "Unopened" },
    ],
    coordinates: { lat: 1.3113, lng: 103.7963 },
    seller: SELLERS.boardGamesSG,
  },
];

// ── collectibles_memorabilia ──────────────────────────────────────────────────────────
export const SG_BOOKS_COLLECTIBLES_MEMORABILIA: MockListing[] = [
  {
    id: "books-sg-collect-01", href: "/listings/books-sg-collect-01", advId: "48041",
    images: [{ src: img(2), alt: "Vintage coin collection" }],
    priceLabel: "S$80",
    title: "Vintage Coin Collection \u2014 25 Coins, Album Included",
    detailsLabel: "COLLECTIBLES & MEMORABILIA \u2022 COINS \u2022 SINGAPORE",
    locationLabel: "Chinatown, Singapore",
    postedAt: hrsAgo(10),
    description: "<p>Collection of 25 vintage coins from different eras, presented in a collector's album.</p>",
    keyDetails: [
      { key: "Coins", value: "25" },
    ],
    goodToKnow: [
      { key: "Includes", value: "Album" },
    ],
    coordinates: { lat: 1.2838, lng: 103.8433 },
    seller: SELLERS.collectiblesSG,
  },
  {
    id: "books-sg-collect-02", href: "/listings/books-sg-collect-02", advId: "48042",
    images: [{ src: img(3), alt: "Sports memorabilia" }],
    priceLabel: "S$120",
    title: "Signed Cricket Bat \u2014 Framed, With Certificate",
    detailsLabel: "COLLECTIBLES & MEMORABILIA \u2022 SPORTS \u2022 SINGAPORE",
    locationLabel: "Chinatown, Singapore",
    postedAt: daysAgo(2),
    description: "<p>Framed signed cricket bat with authenticity certificate, great collector's item.</p>",
    keyDetails: [
      { key: "Authentication", value: "Certificate included" },
    ],
    goodToKnow: [
      { key: "Framed", value: "Yes" },
    ],
    coordinates: { lat: 1.2838, lng: 103.8433 },
    seller: SELLERS.collectiblesSG,
  },
];
