import type { MainCategory } from "../types";

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
          label: "Genre",
          type: "toggle",
          options: [
            { label: "Fiction",      value: "fiction"     },
            { label: "Non-Fiction",  value: "nonfiction"  },
            { label: "Comics / Manga",value: "comics"     },
            { label: "Kids",         value: "kids"        },
            { label: "Academic",     value: "academic"    },
            { label: "Other",        value: "other"       },
          ],
        },
        {
          id: "condition",
          label: "Condition",
          type: "toggle",
          singleSelect: true,
          options: [
            { label: "Any",      value: "any"      },
            { label: "New",      value: "new"      },
            { label: "Like New", value: "like_new" },
            { label: "Good",     value: "good"     },
            { label: "Fair",     value: "fair"     },
          ],
        },
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
          options: [
            { label: "Pop",        value: "pop"        },
            { label: "Rock",       value: "rock"       },
            { label: "Jazz",       value: "jazz"       },
            { label: "Classical",  value: "classical"  },
            { label: "Electronic", value: "electronic" },
            { label: "R&B / Soul", value: "rnb"        },
            { label: "Other",      value: "other"      },
          ],
        },
        {
          id: "condition",
          label: "Condition",
          type: "toggle",
          singleSelect: true,
          options: [
            { label: "Any",      value: "any"      },
            { label: "Mint",     value: "mint"     },
            { label: "Good",     value: "good"     },
            { label: "Fair",     value: "fair"     },
          ],
        },
      ],
    },
    {
      id: "dvds_blu_ray",
      label: "DVDs & Blu-ray",
      icon: "film",
      filters: [
        {
          id: "genre",
          label: "Genre",
          type: "toggle",
          options: [
            { label: "Action",   value: "action"   },
            { label: "Comedy",   value: "comedy"   },
            { label: "Drama",    value: "drama"    },
            { label: "Sci-Fi",   value: "scifi"    },
            { label: "Horror",   value: "horror"   },
            { label: "Kids",     value: "kids"     },
            { label: "Other",    value: "other"    },
          ],
        },
        {
          id: "format",
          label: "Format",
          type: "toggle",
          options: [
            { label: "DVD",     value: "dvd"     },
            { label: "Blu-ray", value: "bluray"  },
            { label: "4K UHD",  value: "4k"      },
          ],
        },
        {
          id: "condition",
          label: "Condition",
          type: "toggle",
          singleSelect: true,
          options: [
            { label: "Any",      value: "any"      },
            { label: "New",      value: "new"      },
            { label: "Like New", value: "like_new" },
            { label: "Good",     value: "good"     },
          ],
        },
      ],
    },
    {
      id: "board_games_puzzles",
      label: "Board Games & Puzzles",
      icon: "puzzle",
      filters: [
        {
          id: "players",
          label: "Players",
          type: "toggle",
          options: [
            { label: "2 players",  value: "2"    },
            { label: "2–4 players", value: "2_4"  },
            { label: "4+ players", value: "4up"  },
          ],
        },
        {
          id: "condition",
          label: "Condition",
          type: "toggle",
          singleSelect: true,
          options: [
            { label: "Any",       value: "any"      },
            { label: "Complete",  value: "complete" },
            { label: "Incomplete",value: "incomplete"},
          ],
        },
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
          options: [
            { label: "Sports",   value: "sports"   },
            { label: "Music",    value: "music"    },
            { label: "Film / TV",value: "film"     },
            { label: "Coins",    value: "coins"    },
            { label: "Stamps",   value: "stamps"   },
            { label: "Art",      value: "art"      },
            { label: "Other",    value: "other"    },
          ],
        },
        {
          id: "condition",
          label: "Condition",
          type: "toggle",
          singleSelect: true,
          options: [
            { label: "Any",      value: "any"      },
            { label: "Mint",     value: "mint"     },
            { label: "Good",     value: "good"     },
            { label: "Fair",     value: "fair"     },
          ],
        },
      ],
    },
  ],
};
