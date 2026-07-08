import type { CategoryItem } from "./types";

export const musicalInstruments: CategoryItem = {
  id: "musical_instruments",
  label: "Musical Instruments",
  description: "Guitars, keyboards, drums, DJ gear, and accessories.",
  color: "orange",
  cardIcon: "music-note",
  subcategories: [
  { id: "guitars_bass", label: "Guitars & Bass" },
  { id: "keyboards_piano", label: "Keyboards & Piano" },
  { id: "drums_percussion", label: "Drums & Percussion" },
  { id: "dj_audio_gear", label: "DJ & Audio Gear" },
  { id: "wind_brass_strings", label: "Wind, Brass & Strings" },
  { id: "accessories", label: "Accessories" },
  ],
};