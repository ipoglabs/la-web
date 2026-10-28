import type { FilterConfig, FilterOption, MainCategory } from "../types";

// Option values are the Musical Instruments forms' (posting/form-schema/defaults/musical-instruments.ts):
// each sub's Type is `itemType`; guitars also save a `brand` from a list
// (lib/postFilterQuery.ts MUSICAL_FORM_FILTERS).

const opts = (entries: [string, string][]): FilterOption[] => entries.map(([value, label]) => ({ label, value }));

const condition: FilterConfig = {
  id: "condition",
  label: "Condition",
  type: "toggle",
  options: opts([["new", "Brand New"], ["like-new", "Like New"], ["lightly-used", "Lightly Used"], ["used", "Well Used"], ["heavily-used", "Heavily Used"], ["for-parts", "For Parts / Not Working"]]),
};

const delivery: FilterConfig = {
  id: "delivery",
  label: "Delivery",
  type: "toggle",
  singleSelect: true,
  options: opts([["delivery", "Delivery available"]]),
};

const type = (id: string, entries: [string, string][]): FilterConfig => ({ id, label: "Type", type: "toggle", options: opts(entries) });

export const musicalInstruments: MainCategory = {
  id: "musical_instruments",
  label: "Musical Instruments",
  description: "Guitars, keyboards, drums, DJ gear, and accessories.",
  icon: "music",
  iconBg: "bg-purple-100",
  iconColor: "text-purple-600",
  subcategories: [
    {
      id: "guitars_bass",
      label: "Guitars & Bass",
      icon: "guitar",
      filters: [
        type("guitar_type", [["electric", "Electric Guitar"], ["acoustic", "Acoustic Guitar"], ["electro_acoustic", "Electro-Acoustic"], ["classical", "Classical / Nylon"], ["bass", "Bass Guitar"], ["ukulele", "Ukulele"], ["amp", "Amp"], ["other", "Other"]]),
        {
          id: "brand",
          label: "Brand",
          type: "toggle",
          options: opts([["fender", "Fender"], ["squier", "Squier"], ["gibson", "Gibson"], ["epiphone", "Epiphone"], ["yamaha", "Yamaha"], ["ibanez", "Ibanez"], ["prs", "PRS"], ["martin", "Martin"], ["taylor", "Taylor"], ["cort", "Cort"], ["gretsch", "Gretsch"], ["other", "Other"]]),
        },
        {
          id: "left_handed",
          label: "Left-handed",
          type: "toggle",
          singleSelect: true,
          options: opts([["yes", "Left-handed only"]]),
        },
        condition,
        delivery,
      ],
    },
    {
      id: "keyboards_piano",
      label: "Keyboards & Piano",
      icon: "piano",
      filters: [
        type("keyboard_type", [["digital", "Digital Piano"], ["stage", "Stage Piano"], ["keyboard", "Portable Keyboard"], ["synth", "Synthesiser"], ["midi", "MIDI Controller"], ["acoustic_piano", "Acoustic Piano"], ["organ", "Organ"], ["harmonium", "Harmonium"], ["accordion", "Accordion"], ["other", "Other"]]),
        {
          id: "keys",
          label: "Keys",
          type: "toggle",
          options: opts([["25", "25–37"], ["49", "49"], ["61", "61"], ["76", "73–76"], ["88", "88"]]),
        },
        condition,
        delivery,
      ],
    },
    {
      id: "drums_percussion",
      label: "Drums & Percussion",
      icon: "drum",
      filters: [
        type("drum_type", [["acoustic", "Acoustic Kit"], ["electronic", "Electronic Kit"], ["snare", "Snare"], ["cymbals", "Cymbals"], ["hardware", "Hardware & Pedals"], ["cajon", "Cajon"], ["bongos", "Bongos, Congas & Djembe"], ["indian", "Tabla, Dholak & Mridangam"], ["other", "Other"]]),
        condition,
        delivery,
      ],
    },
    {
      id: "dj_audio_gear",
      label: "DJ & Audio Gear",
      icon: "headphones",
      filters: [
        type("dj_type", [["controller", "DJ Controller"], ["turntable", "Turntables"], ["mixer", "Mixer"], ["media_player", "CDJ / Media Player"], ["speakers", "PA & Speakers"], ["monitors", "Studio Monitors"], ["interface", "Audio Interface"], ["mics", "Microphones"], ["headphones", "Headphones"], ["other", "Other"]]),
        condition,
        delivery,
      ],
    },
    {
      id: "wind_brass_strings",
      label: "Wind, Brass & Strings",
      icon: "music",
      filters: [
        type("instrument_type", [["violin", "Violin / Viola"], ["cello", "Cello / Double Bass"], ["flute", "Flute"], ["clarinet", "Clarinet"], ["saxophone", "Saxophone"], ["trumpet", "Trumpet / Cornet"], ["trombone", "Trombone & Low Brass"], ["bansuri", "Bansuri & Shehnai"], ["sitar", "Sitar, Veena & Sarod"], ["other", "Other"]]),
        {
          id: "size",
          label: "Size",
          type: "toggle",
          options: opts([["4/4", "4/4 (full)"], ["3/4", "3/4"], ["1/2", "1/2"], ["1/4", "1/4"], ["1/8", "1/8 or smaller"]]),
        },
        condition,
        delivery,
      ],
    },
    {
      id: "accessories",
      label: "Accessories",
      icon: "package",
      filters: [
        type("accessory_type", [["strings", "Strings & Reeds"], ["pedals", "Pedals & Effects"], ["cases", "Cases & Bags"], ["stands", "Stands & Mounts"], ["cables", "Cables & Leads"], ["tuners", "Tuners & Metronomes"], ["sheet_music", "Sheet Music & Books"], ["other", "Other"]]),
        {
          id: "for_instrument",
          label: "For",
          type: "toggle",
          options: opts([["guitar", "Guitar & Bass"], ["keys", "Keyboard & Piano"], ["drums", "Drums"], ["strings", "Orchestral Strings"], ["wind", "Wind & Brass"], ["dj", "DJ & Studio"], ["general", "Any / General"]]),
        },
        condition,
        delivery,
      ],
    },
  ],
};
