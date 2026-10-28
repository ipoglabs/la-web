// Default "Musical Instruments" post-form schemas.
//
// Option values are what the Musical Instruments search filters match
// (components/create-alert/config/musical-instruments.ts, lib/postFilterQuery.ts
// MUSICAL_FORM_FILTERS). Each sub's Type is `itemType`; guitars also pick a
// Brand from a list so the Brand filter can match it. Items save the price as
// `salePrice`, the field listing prices and the price filter read.
//
// Types include the Indian instruments OLX India sellers list (harmonium,
// tabla, bansuri, sitar). Keyboards ask the number of keys, orchestral strings
// the size, as buyers (and parents buying for a child) search on them.

import type { FormFieldDef, FormSection } from "../types";
import { basics, pairs, YES_NO } from "./shared";

const select = (key: string, label: string, entries: [string, string][], extra: Partial<FormFieldDef> = {}): FormFieldDef => ({
  key,
  type: "select",
  label,
  options: pairs(entries),
  width: "half",
  ...extra,
});
const multi = (key: string, label: string, entries: [string, string][], extra: Partial<FormFieldDef> = {}): FormFieldDef => ({
  key,
  type: "multiselect",
  label,
  options: pairs(entries),
  ...extra,
});
const text = (key: string, label: string, placeholder?: string, extra: Partial<FormFieldDef> = {}): FormFieldDef => ({ key, type: "text", label, placeholder, width: "half", ...extra });
const yesNo = (key: string, label: string, extra: Partial<FormFieldDef> = {}): FormFieldDef => ({ key, type: "select", label, options: YES_NO, width: "half", ...extra });
const shownFor = (values: string[]) => ({ showWhen: { field: "itemType", in: values } });
const itemType = (entries: [string, string][], extra: Partial<FormFieldDef> = {}): FormFieldDef => select("itemType", "Type", entries, { required: true, width: "full", ...extra });

/** Graded condition scale (Carousell / Gumtree style), as the other marketplace
 *  categories, plus For Parts for faulty kit. */
const CONDITION_SCALE: [string, string][] = [
  ["new", "Brand New"],
  ["like-new", "Like New"],
  ["lightly-used", "Lightly Used"],
  ["used", "Well Used"],
  ["heavily-used", "Heavily Used"],
  ["for-parts", "For Parts / Not Working"],
];
const condition = select("condition", "Condition", CONDITION_SCALE, { required: true });
const brand = text("brand", "Brand");
const model = text("model", "Model");

/** Things for sale: price, negotiable, meet-up or delivery. */
const forSale = (title: string, fields: FormFieldDef[]): FormSection[] => [
  basics,
  { title, fields },
  {
    title: "Price & Delivery",
    fields: [
      { key: "salePrice", type: "currency", label: "Price", required: true, min: 1, width: "half" },
      yesNo("negotiable", "Negotiable"),
      multi("dealMethod", "Deal Method", [["meetup", "Meet-up / Collection"], ["delivery", "Delivery / Courier"]]),
    ],
  },
];

const GUITAR_TYPES: [string, string][] = [["electric", "Electric Guitar"], ["acoustic", "Acoustic Guitar"], ["electro_acoustic", "Electro-Acoustic"], ["classical", "Classical / Nylon"], ["bass", "Bass Guitar"], ["ukulele", "Ukulele"], ["amp", "Amp"], ["other", "Other"]];
const GUITARS = ["electric", "acoustic", "electro_acoustic", "classical", "bass", "ukulele"];
const KEYBOARD_TYPES: [string, string][] = [["digital", "Digital Piano"], ["stage", "Stage Piano"], ["keyboard", "Portable Keyboard"], ["synth", "Synthesiser"], ["midi", "MIDI Controller"], ["acoustic_piano", "Acoustic Piano"], ["organ", "Organ"], ["harmonium", "Harmonium"], ["accordion", "Accordion"], ["other", "Other"]];
const DRUM_TYPES: [string, string][] = [["acoustic", "Acoustic Kit"], ["electronic", "Electronic Kit"], ["snare", "Snare"], ["cymbals", "Cymbals"], ["hardware", "Hardware & Pedals"], ["cajon", "Cajon"], ["bongos", "Bongos, Congas & Djembe"], ["indian", "Tabla, Dholak & Mridangam"], ["other", "Other"]];
const DJ_TYPES: [string, string][] = [["controller", "DJ Controller"], ["turntable", "Turntables"], ["mixer", "Mixer"], ["media_player", "CDJ / Media Player"], ["speakers", "PA & Speakers"], ["monitors", "Studio Monitors"], ["interface", "Audio Interface"], ["mics", "Microphones"], ["headphones", "Headphones"], ["other", "Other"]];
const WIND_TYPES: [string, string][] = [["violin", "Violin / Viola"], ["cello", "Cello / Double Bass"], ["flute", "Flute"], ["clarinet", "Clarinet"], ["saxophone", "Saxophone"], ["trumpet", "Trumpet / Cornet"], ["trombone", "Trombone & Low Brass"], ["bansuri", "Bansuri & Shehnai"], ["sitar", "Sitar, Veena & Sarod"], ["other", "Other"]];
const ACCESSORY_TYPES: [string, string][] = [["strings", "Strings & Reeds"], ["pedals", "Pedals & Effects"], ["cases", "Cases & Bags"], ["stands", "Stands & Mounts"], ["cables", "Cables & Leads"], ["tuners", "Tuners & Metronomes"], ["sheet_music", "Sheet Music & Books"], ["other", "Other"]];

export function musicalInstrumentsSections(subcategory: string): FormSection[] | null {
  switch (subcategory) {
    case "Guitars & Bass":
      return forSale("Instrument", [
        itemType(GUITAR_TYPES),
        select("brand", "Brand", [["fender", "Fender"], ["squier", "Squier"], ["gibson", "Gibson"], ["epiphone", "Epiphone"], ["yamaha", "Yamaha"], ["ibanez", "Ibanez"], ["prs", "PRS"], ["martin", "Martin"], ["taylor", "Taylor"], ["cort", "Cort"], ["gretsch", "Gretsch"], ["other", "Other"]], { required: true, display: "dropdown" }),
        { ...text("otherBrand", "Brand Name"), showWhen: { field: "brand", in: ["other"] } },
        model,
        select("strings", "Strings", [["4", "4"], ["5", "5"], ["6", "6"], ["7", "7+"], ["12", "12"]], shownFor(GUITARS)),
        yesNo("leftHanded", "Left-handed", shownFor(GUITARS)),
        condition,
        text("included", "Comes With", "e.g. Hard case, strap, amp"),
      ]);

    case "Keyboards & Piano":
      return forSale("Instrument", [
        itemType(KEYBOARD_TYPES),
        brand,
        model,
        select("keys", "Keys", [["25", "25–37"], ["49", "49"], ["61", "61"], ["76", "73–76"], ["88", "88"]], shownFor(["digital", "stage", "keyboard", "synth", "midi", "acoustic_piano", "organ"])),
        yesNo("weighted", "Weighted Keys", shownFor(["digital", "stage", "keyboard", "synth", "midi"])),
        text("reeds", "Reeds / Octaves", "e.g. Double reed, 3.5 octave", shownFor(["harmonium", "accordion"])),
        condition,
        yesNo("collectionOnly", "Buyer Must Collect", { hint: "Pianos and organs that can't be posted.", ...shownFor(["acoustic_piano", "organ"]) }),
      ]);

    case "Drums & Percussion":
      return forSale("Instrument", [
        itemType(DRUM_TYPES),
        brand,
        model,
        text("pieces", "Pieces / Sizes", "e.g. 5-piece, 22\" bass, 14\" snare"),
        condition,
      ]);

    case "DJ & Audio Gear":
      return forSale("Equipment", [
        itemType(DJ_TYPES),
        brand,
        model,
        condition,
      ]);

    case "Wind, Brass & Strings":
      return forSale("Instrument", [
        itemType(WIND_TYPES),
        brand,
        model,
        select("size", "Size", [["4/4", "4/4 (full)"], ["3/4", "3/4"], ["1/2", "1/2"], ["1/4", "1/4"], ["1/8", "1/8 or smaller"]], shownFor(["violin", "cello"])),
        text("pitch", "Key / Pitch", "e.g. Bb, Eb alto, C scale", shownFor(["flute", "clarinet", "saxophone", "trumpet", "trombone", "bansuri"])),
        condition,
      ]);

    case "Accessories":
      return forSale("Accessory", [
        itemType(ACCESSORY_TYPES),
        select("forInstrument", "For", [["guitar", "Guitar & Bass"], ["keys", "Keyboard & Piano"], ["drums", "Drums"], ["strings", "Orchestral Strings"], ["wind", "Wind & Brass"], ["dj", "DJ & Studio"], ["general", "Any / General"]], { required: true }),
        brand,
        condition,
      ]);

    default:
      return null;
  }
}
