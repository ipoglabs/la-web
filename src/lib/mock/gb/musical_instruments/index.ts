import type { MockListing } from "../../mock-listing-schema";
export { MUSIC_GUITARS }     from './guitars-bass';
export { MUSIC_KEYBOARDS }   from './keyboards-piano';
export { MUSIC_DRUMS }       from './drums-percussion';
export { MUSIC_DJ }          from './dj-audio-gear';
export { MUSIC_WIND }        from './wind-brass-strings';
export { MUSIC_ACCESSORIES } from './accessories';

import { MUSIC_GUITARS }     from './guitars-bass';
import { MUSIC_KEYBOARDS }   from './keyboards-piano';
import { MUSIC_DRUMS }       from './drums-percussion';
import { MUSIC_DJ }          from './dj-audio-gear';
import { MUSIC_WIND }        from './wind-brass-strings';
import { MUSIC_ACCESSORIES } from './accessories';

export const ALL_MUSICAL_INSTRUMENTS_LISTINGS: MockListing[] = [
  ...MUSIC_GUITARS,
  ...MUSIC_KEYBOARDS,
  ...MUSIC_DRUMS,
  ...MUSIC_DJ,
  ...MUSIC_WIND,
  ...MUSIC_ACCESSORIES,
];

export const GB_ALL_MUSICAL_INSTRUMENTS_LISTINGS: MockListing[] = ALL_MUSICAL_INSTRUMENTS_LISTINGS;
export const GB_MUSICAL_INSTRUMENTS_SUBCATEGORY_MAP: Record<string, MockListing[]> = {
  guitars_bass: MUSIC_GUITARS,
  keyboards_piano: MUSIC_KEYBOARDS,
  drums_percussion: MUSIC_DRUMS,
  dj_audio_gear: MUSIC_DJ,
  wind_brass_strings: MUSIC_WIND,
  accessories: MUSIC_ACCESSORIES,
};
