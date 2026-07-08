import type { CategoryItem } from "./types";

export const booksMediaCollectibles: CategoryItem = {
  id: "books_media_collectibles",
  label: "Books, Media & Collectibles",
  description: "Books, vinyl, DVDs, board games, and memorabilia.",
  color: "amber",
  cardIcon: "book-open",
  subcategories: [
  { id: "books_comics", label: "Books & Comics" },
  { id: "vinyl_records", label: "Vinyl Records" },
  { id: "dvds_blu_ray", label: "DVDs & Blu-ray" },
  { id: "board_games_puzzles", label: "Board Games & Puzzles" },
  { id: "collectibles_memorabilia", label: "Collectibles & Memorabilia" },
  ],
};