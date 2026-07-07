import type { MainCategory } from "../types";

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
        {
          id: "guitar_type",
          label: "Type",
          type: "toggle",
          options: [
            { label: "Electric",  value: "electric"  },
            { label: "Acoustic",  value: "acoustic"  },
            { label: "Bass",      value: "bass"      },
            { label: "Classical", value: "classical" },
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
      id: "keyboards_piano",
      label: "Keyboards & Piano",
      icon: "piano",
      filters: [
        {
          id: "keyboard_type",
          label: "Type",
          type: "toggle",
          options: [
            { label: "Digital Piano", value: "digital"    },
            { label: "Keyboard",      value: "keyboard"   },
            { label: "Synthesiser",   value: "synth"      },
            { label: "Accordion",     value: "accordion"  },
            { label: "Organ",         value: "organ"      },
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
      id: "drums_percussion",
      label: "Drums & Percussion",
      icon: "drum",
      filters: [
        {
          id: "drum_type",
          label: "Type",
          type: "toggle",
          options: [
            { label: "Acoustic Kit",   value: "acoustic"    },
            { label: "Electronic Kit", value: "electronic"  },
            { label: "Cajon",          value: "cajon"       },
            { label: "Bongos / Congas",value: "bongos"      },
            { label: "Other",          value: "other"       },
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
      id: "dj_audio_gear",
      label: "DJ & Audio Gear",
      icon: "headphones",
      filters: [
        {
          id: "dj_type",
          label: "Type",
          type: "toggle",
          options: [
            { label: "Turntable",  value: "turntable"  },
            { label: "Mixer",      value: "mixer"      },
            { label: "Controller", value: "controller" },
            { label: "Speakers",   value: "speakers"   },
            { label: "Headphones", value: "headphones" },
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
            { label: "New",      value: "new"      },
            { label: "Like New", value: "like_new" },
            { label: "Good",     value: "good"     },
            { label: "Fair",     value: "fair"     },
          ],
        },
      ],
    },
    {
      id: "wind_brass_strings",
      label: "Wind, Brass & Strings",
      icon: "music",
      filters: [
        {
          id: "instrument_type",
          label: "Type",
          type: "toggle",
          options: [
            { label: "Violin / Viola", value: "violin"     },
            { label: "Cello",          value: "cello"      },
            { label: "Flute",          value: "flute"      },
            { label: "Trumpet",        value: "trumpet"    },
            { label: "Saxophone",      value: "saxophone"  },
            { label: "Clarinet",       value: "clarinet"   },
            { label: "Other",          value: "other"      },
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
      id: "accessories",
      label: "Accessories",
      icon: "package",
      filters: [
        {
          id: "accessory_type",
          label: "Type",
          type: "toggle",
          options: [
            { label: "Strings / Reeds", value: "strings"   },
            { label: "Pedals / Effects",value: "pedals"    },
            { label: "Cases / Bags",    value: "cases"     },
            { label: "Stands",          value: "stands"    },
            { label: "Microphones",     value: "mics"      },
            { label: "Other",           value: "other"     },
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
  ],
};
