import type { FilterConfig, FilterOption, MainCategory } from "../types";

// Option values are the Books, Media & Collectibles forms' (posting/form-schema/defaults/books-media.ts):
// books, vinyl and films save a `genre`, board games and collectibles an
// `itemType`; vinyl's Condition is the Goldmine record grade
// (lib/postFilterQuery.ts BOOKS_FORM_FILTERS).

const opts = (entries: [string, string][]): FilterOption[] => entries.map(([value, label]) => ({ label, value }));

const condition: FilterConfig = {
  id: "condition",
  label: "Condition",
  type: "toggle",
  options: opts([["new", "Brand New"], ["like-new", "Like New"], ["lightly-used", "Lightly Used"], ["used", "Well Used"], ["heavily-used", "Heavily Used"]]),
};

const delivery: FilterConfig = {
  id: "delivery",
  label: "Delivery",
  type: "toggle",
  singleSelect: true,
  options: opts([["delivery", "Delivery available"]]),
};

export const booksMediaCollectibles: MainCategory = {
  id: "books_media_collectibles",
  label: "Books, Media & Collectibles",
  description: "Books, vinyl, DVDs, board games, and memorabilia.",
  icon: "book-open",
  iconBg: "bg-amber-100",
  iconColor: "text-amber-600",
  subcategories: [
    {
      id: "books_comics",
      label: "Books & Comics",
      icon: "book",
      filters: [
        {
          id: "genre",
          label: "Type",
          type: "toggle",
          options: opts([["fiction", "Fiction"], ["nonfiction", "Non-Fiction"], ["comics", "Comics & Graphic Novels"], ["manga", "Manga"], ["kids", "Children's"], ["academic", "Textbooks & Study Guides"], ["other", "Other"]]),
        },
        condition,
        delivery,
      ],
    },
    {
      id: "vinyl_records",
      label: "Vinyl Records",
      icon: "disc",
      filters: [
        {
          id: "genre",
          label: "Genre",
          type: "toggle",
          options: opts([["rock", "Rock"], ["pop", "Pop"], ["rnb", "Soul, R&B & Funk"], ["jazz", "Jazz & Blues"], ["electronic", "Electronic & Dance"], ["hiphop", "Hip-Hop"], ["classical", "Classical"], ["indian", "Bollywood & Indian"], ["other", "Other"]]),
        },
        {
          id: "format",
          label: "Format",
          type: "toggle",
          options: opts([["lp", "LP / Album"], ["single", "7\" Single"], ["twelve", "12\" Single / EP"], ["box", "Box Set"], ["collection", "Collection / Job Lot"]]),
        },
        {
          id: "pressing",
          label: "Pressing",
          type: "toggle",
          singleSelect: true,
          options: opts([["original", "Original pressings"]]),
        },
        {
          id: "condition",
          label: "Record Grade",
          type: "toggle",
          options: opts([["mint", "Mint (M)"], ["near-mint", "Near Mint (NM)"], ["vg-plus", "Very Good Plus (VG+)"], ["vg", "Very Good (VG)"], ["good-plus", "Good Plus (G+)"], ["good", "Good (G) or worse"]]),
        },
        delivery,
      ],
    },
    {
      id: "dvds_blu_ray",
      label: "DVDs & Blu-ray",
      icon: "film",
      filters: [
        {
          id: "format",
          label: "Format",
          type: "toggle",
          options: opts([["dvd", "DVD"], ["bluray", "Blu-ray"], ["4k", "4K UHD"], ["mixed", "Mixed"]]),
        },
        {
          id: "genre",
          label: "Genre",
          type: "toggle",
          options: opts([["action", "Action & Adventure"], ["comedy", "Comedy"], ["drama", "Drama"], ["scifi", "Sci-Fi & Fantasy"], ["horror", "Horror & Thriller"], ["kids", "Kids & Family"], ["tv", "TV Series"], ["world", "World Cinema"], ["other", "Other"]]),
        },
        condition,
        delivery,
      ],
    },
    {
      id: "board_games_puzzles",
      label: "Board Games & Puzzles",
      icon: "puzzle",
      filters: [
        {
          id: "item_type",
          label: "Type",
          type: "toggle",
          options: opts([["board_game", "Board Game"], ["card_game", "Card Game"], ["rpg", "RPG & Miniatures"], ["puzzle", "Jigsaw Puzzle"], ["other", "Other"]]),
        },
        {
          id: "players",
          label: "Players",
          type: "toggle",
          options: opts([["1", "Solo"], ["2", "2"], ["2_4", "2–4"], ["4up", "4+"]]),
        },
        {
          id: "complete",
          label: "Complete",
          type: "toggle",
          singleSelect: true,
          options: opts([["yes", "All pieces included"]]),
        },
        condition,
        delivery,
      ],
    },
    {
      id: "collectibles_memorabilia",
      label: "Collectibles & Memorabilia",
      icon: "trophy",
      filters: [
        {
          id: "item_type",
          label: "Type",
          type: "toggle",
          options: opts([["sports", "Sports Memorabilia"], ["music", "Music Memorabilia"], ["film", "Film & TV"], ["coins", "Coins & Notes"], ["stamps", "Stamps"], ["cards", "Trading Cards"], ["toys", "Toys & LEGO"], ["art", "Art & Prints"], ["other", "Other"]]),
        },
        {
          id: "authenticated",
          label: "Authenticated",
          type: "toggle",
          singleSelect: true,
          options: opts([["yes", "With certificate"]]),
        },
        condition,
        delivery,
      ],
    },
  ],
};
