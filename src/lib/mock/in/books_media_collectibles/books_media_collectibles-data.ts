import type { MockListing } from "@/lib/mock/mock-listing-schema";
import { SELLERS, img, daysAgo, hrsAgo } from "./sellers";

// ── books_comics ──────────────────────────────────────────────────────────
export const IN_BOOKS_BOOKS_COMICS: MockListing[] = [
  {
    id: "books-in-books-01", href: "/listings/books-in-books-01", advId: "38001",
    images: [{ src: img(3), alt: "Novel collection" }],
    priceLabel: "\u20b91,200",
    title: "Classic Novel Collection \u2014 Set of 10 Paperbacks",
    detailsLabel: "BOOKS & COMICS \u2022 NOVELS \u2022 MUMBAI",
    locationLabel: "Flora Fountain, Mumbai",
    postedAt: hrsAgo(2),
    description: "<p>Set of 10 classic novel paperbacks in good condition, great starter collection.</p>",
    keyDetails: [
      { key: "Books", value: "10" },
    ],
    goodToKnow: [
      { key: "Format", value: "Paperback" },
    ],
    coordinates: { lat: 18.9351, lng: 72.8354 },
    seller: SELLERS.booksComicsIndia,
  },
  {
    id: "books-in-books-02", href: "/listings/books-in-books-02", advId: "38002",
    images: [{ src: img(4), alt: "Comic book bundle" }],
    priceLabel: "\u20b9800",
    title: "Comic Book Bundle \u2014 15 Issues, Superhero Series",
    detailsLabel: "BOOKS & COMICS \u2022 COMICS \u2022 MUMBAI",
    locationLabel: "Flora Fountain, Mumbai",
    postedAt: daysAgo(1),
    description: "<p>Bundle of 15 superhero comic book issues, well preserved condition.</p>",
    keyDetails: [
      { key: "Issues", value: "15" },
    ],
    goodToKnow: [
      { key: "Genre", value: "Superhero" },
    ],
    coordinates: { lat: 18.9351, lng: 72.8354 },
    seller: SELLERS.booksComicsIndia,
  },
];

// ── vinyl_records ──────────────────────────────────────────────────────────
export const IN_BOOKS_VINYL_RECORDS: MockListing[] = [
  {
    id: "books-in-vinyl-01", href: "/listings/books-in-vinyl-01", advId: "38011",
    images: [{ src: img(5), alt: "Vinyl record" }],
    priceLabel: "\u20b92,500",
    title: "Classic Rock Vinyl Record \u2014 Original Pressing, Near Mint",
    detailsLabel: "VINYL RECORDS \u2022 ROCK \u2022 DELHI",
    locationLabel: "Khan Market, Delhi",
    postedAt: hrsAgo(4),
    description: "<p>Original pressing classic rock vinyl record, near mint condition, collector's item.</p>",
    keyDetails: [
      { key: "Condition", value: "Near mint" },
    ],
    goodToKnow: [
      { key: "Pressing", value: "Original" },
    ],
    coordinates: { lat: 28.6004, lng: 77.2277 },
    seller: SELLERS.vinylIndia,
  },
  {
    id: "books-in-vinyl-02", href: "/listings/books-in-vinyl-02", advId: "38012",
    images: [{ src: img(6), alt: "Vinyl record player" }],
    priceLabel: "\u20b96,500",
    title: "Vintage Turntable \u2014 Belt Drive, Restored",
    detailsLabel: "VINYL RECORDS \u2022 TURNTABLE \u2022 DELHI",
    locationLabel: "Khan Market, Delhi",
    postedAt: daysAgo(2),
    description: "<p>Restored vintage belt-drive turntable, fully functional and cleaned.</p>",
    keyDetails: [
      { key: "Drive Type", value: "Belt drive" },
    ],
    goodToKnow: [
      { key: "Restored", value: "Yes" },
    ],
    coordinates: { lat: 28.6004, lng: 77.2277 },
    seller: SELLERS.vinylIndia,
  },
];

// ── dvds_blu_ray ──────────────────────────────────────────────────────────
export const IN_BOOKS_DVDS_BLU_RAY: MockListing[] = [
  {
    id: "books-in-dvd-01", href: "/listings/books-in-dvd-01", advId: "38021",
    images: [{ src: img(7), alt: "Blu-ray box set" }],
    priceLabel: "\u20b91,800",
    title: "Blu-ray Trilogy Box Set \u2014 Collector's Edition",
    detailsLabel: "DVDS & BLU-RAY \u2022 BOX SET \u2022 BENGALURU",
    locationLabel: "Brigade Road, Bengaluru",
    postedAt: hrsAgo(6),
    description: "<p>Collector's edition Blu-ray trilogy box set with special features and artwork.</p>",
    keyDetails: [
      { key: "Format", value: "Blu-ray" },
    ],
    goodToKnow: [
      { key: "Edition", value: "Collector's" },
    ],
    coordinates: { lat: 12.9716, lng: 77.6068 },
    seller: SELLERS.dvdIndia,
  },
  {
    id: "books-in-dvd-02", href: "/listings/books-in-dvd-02", advId: "38022",
    images: [{ src: img(8), alt: "DVD collection" }],
    priceLabel: "\u20b9900",
    title: "DVD Collection \u2014 20 Movies, Mixed Genres",
    detailsLabel: "DVDS & BLU-RAY \u2022 DVD \u2022 BENGALURU",
    locationLabel: "Brigade Road, Bengaluru",
    postedAt: daysAgo(1),
    description: "<p>Collection of 20 DVDs across mixed genres, all in working condition.</p>",
    keyDetails: [
      { key: "Movies", value: "20" },
    ],
    goodToKnow: [
      { key: "Condition", value: "Working" },
    ],
    coordinates: { lat: 12.9716, lng: 77.6068 },
    seller: SELLERS.dvdIndia,
  },
];

// ── board_games_puzzles ──────────────────────────────────────────────────────────
export const IN_BOOKS_BOARD_GAMES_PUZZLES: MockListing[] = [
  {
    id: "books-in-board-01", href: "/listings/books-in-board-01", advId: "38031",
    images: [{ src: img(9), alt: "Board game" }],
    priceLabel: "\u20b91,500",
    title: "Strategy Board Game \u2014 Complete Set, Ages 12+",
    detailsLabel: "BOARD GAMES & PUZZLES \u2022 BOARD GAME \u2022 PUNE",
    locationLabel: "Kalyani Nagar, Pune",
    postedAt: hrsAgo(8),
    description: "<p>Complete strategy board game set for ages 12 and up, all pieces included.</p>",
    keyDetails: [
      { key: "Age Group", value: "12+" },
    ],
    goodToKnow: [
      { key: "Completeness", value: "All pieces included" },
    ],
    coordinates: { lat: 18.5511, lng: 73.9010 },
    seller: SELLERS.boardGamesIndia,
  },
  {
    id: "books-in-board-02", href: "/listings/books-in-board-02", advId: "38032",
    images: [{ src: img(1), alt: "Jigsaw puzzle" }],
    priceLabel: "\u20b9600",
    title: "1000-Piece Jigsaw Puzzle \u2014 Scenic Landscape",
    detailsLabel: "BOARD GAMES & PUZZLES \u2022 PUZZLE \u2022 PUNE",
    locationLabel: "Kalyani Nagar, Pune",
    postedAt: daysAgo(1),
    description: "<p>1000-piece jigsaw puzzle featuring a scenic landscape image, unopened box.</p>",
    keyDetails: [
      { key: "Pieces", value: "1000" },
    ],
    goodToKnow: [
      { key: "Condition", value: "Unopened" },
    ],
    coordinates: { lat: 18.5511, lng: 73.9010 },
    seller: SELLERS.boardGamesIndia,
  },
];

// ── collectibles_memorabilia ──────────────────────────────────────────────────────────
export const IN_BOOKS_COLLECTIBLES_MEMORABILIA: MockListing[] = [
  {
    id: "books-in-collect-01", href: "/listings/books-in-collect-01", advId: "38041",
    images: [{ src: img(2), alt: "Vintage coin collection" }],
    priceLabel: "\u20b93,500",
    title: "Vintage Coin Collection \u2014 25 Coins, Album Included",
    detailsLabel: "COLLECTIBLES & MEMORABILIA \u2022 COINS \u2022 DELHI",
    locationLabel: "Sarojini Nagar, Delhi",
    postedAt: hrsAgo(10),
    description: "<p>Collection of 25 vintage coins from different eras, presented in a collector's album.</p>",
    keyDetails: [
      { key: "Coins", value: "25" },
    ],
    goodToKnow: [
      { key: "Includes", value: "Album" },
    ],
    coordinates: { lat: 28.5744, lng: 77.1993 },
    seller: SELLERS.collectiblesIndia,
  },
  {
    id: "books-in-collect-02", href: "/listings/books-in-collect-02", advId: "38042",
    images: [{ src: img(3), alt: "Sports memorabilia" }],
    priceLabel: "\u20b95,000",
    title: "Signed Cricket Bat \u2014 Framed, With Certificate",
    detailsLabel: "COLLECTIBLES & MEMORABILIA \u2022 SPORTS \u2022 DELHI",
    locationLabel: "Sarojini Nagar, Delhi",
    postedAt: daysAgo(2),
    description: "<p>Framed signed cricket bat with authenticity certificate, great collector's item.</p>",
    keyDetails: [
      { key: "Authentication", value: "Certificate included" },
    ],
    goodToKnow: [
      { key: "Framed", value: "Yes" },
    ],
    coordinates: { lat: 28.5744, lng: 77.1993 },
    seller: SELLERS.collectiblesIndia,
  },
];
