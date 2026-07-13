import type { MockListing } from "../../mock-listing-schema";
export { MEDIA_BOOKS }        from './books-comics';
export { MEDIA_VINYL }        from './vinyl-records';
export { MEDIA_DVDS }         from './dvds-blu-ray';
export { MEDIA_BOARDGAMES }   from './board-games-puzzles';
export { MEDIA_COLLECTIBLES } from './collectibles-memorabilia';

import { MEDIA_BOOKS }        from './books-comics';
import { MEDIA_VINYL }        from './vinyl-records';
import { MEDIA_DVDS }         from './dvds-blu-ray';
import { MEDIA_BOARDGAMES }   from './board-games-puzzles';
import { MEDIA_COLLECTIBLES } from './collectibles-memorabilia';

export const ALL_BOOKS_MEDIA_COLLECTIBLES_LISTINGS: MockListing[] = [
  ...MEDIA_BOOKS,
  ...MEDIA_VINYL,
  ...MEDIA_DVDS,
  ...MEDIA_BOARDGAMES,
  ...MEDIA_COLLECTIBLES,
];

export const GB_ALL_BOOKS_MEDIA_COLLECTIBLES_LISTINGS: MockListing[] = ALL_BOOKS_MEDIA_COLLECTIBLES_LISTINGS;
export const GB_BOOKS_MEDIA_COLLECTIBLES_SUBCATEGORY_MAP: Record<string, MockListing[]> = {
  books_comics: MEDIA_BOOKS,
  vinyl_records: MEDIA_VINYL,
  dvds_blu_ray: MEDIA_DVDS,
  board_games_puzzles: MEDIA_BOARDGAMES,
  collectibles_memorabilia: MEDIA_COLLECTIBLES,
};
