// Default "Books, Media & Collectibles" post-form schemas.
//
// Option values are what the Books, Media & Collectibles search filters match
// (components/create-alert/config/books-media-collectibles.ts,
// lib/postFilterQuery.ts BOOKS_FORM_FILTERS). Books, vinyl and films save a
// `genre`; board games and collectibles an `itemType`. Items save the price
// as `salePrice`, the field listing prices and the price filter read.
//
// Vinyl is graded on the Goldmine scale (Mint to Good), record and sleeve
// separately, as record buyers expect; everything else uses the same graded
// scale as the other marketplace categories. Books ask the language, with
// each market's own list.

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

/** Graded condition scale (Carousell / Gumtree style), as the other marketplace categories. */
const CONDITION_SCALE: [string, string][] = [
  ["new", "Brand New"],
  ["like-new", "Like New"],
  ["lightly-used", "Lightly Used"],
  ["used", "Well Used"],
  ["heavily-used", "Heavily Used"],
];
const condition = select("condition", "Condition", CONDITION_SCALE, { required: true });

/** Goldmine record grading, best to worst. */
const VINYL_GRADES: [string, string][] = [
  ["mint", "Mint (M)"],
  ["near-mint", "Near Mint (NM)"],
  ["vg-plus", "Very Good Plus (VG+)"],
  ["vg", "Very Good (VG)"],
  ["good-plus", "Good Plus (G+)"],
  ["good", "Good (G) or worse"],
];

const LANGUAGES: Record<string, [string, string][]> = {
  IN: [["english", "English"], ["hindi", "Hindi"], ["marathi", "Marathi"], ["tamil", "Tamil"], ["telugu", "Telugu"], ["bengali", "Bengali"], ["malayalam", "Malayalam"], ["kannada", "Kannada"], ["other", "Other"]],
  GB: [["english", "English"], ["other", "Other"]],
  SG: [["english", "English"], ["chinese", "Chinese"], ["malay", "Malay"], ["tamil", "Tamil"], ["other", "Other"]],
};

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

const howMany = { key: "quantity", type: "number", label: "Number of Items", min: 1, width: "half", hint: "For bundles and job lots." } satisfies FormFieldDef;

export function booksMediaSections(subcategory: string, country: string): FormSection[] | null {
  switch (subcategory) {
    case "Books & Comics":
      return forSale("Book", [
        select("genre", "Type", [["fiction", "Fiction"], ["nonfiction", "Non-Fiction"], ["comics", "Comics & Graphic Novels"], ["manga", "Manga"], ["kids", "Children's"], ["academic", "Textbooks & Study Guides"], ["other", "Other"]], { required: true, width: "full" }),
        text("authorArtist", "Author", "e.g. Terry Pratchett"),
        select("format", "Format", [["paperback", "Paperback"], ["hardback", "Hardback"], ["issues", "Single Issues"], ["set", "Box Set / Collection"]]),
        select("language", "Language", LANGUAGES[country] ?? LANGUAGES.IN),
        howMany,
        condition,
      ]);

    case "Vinyl Records":
      return forSale("Record", [
        select("genre", "Genre", [["rock", "Rock"], ["pop", "Pop"], ["rnb", "Soul, R&B & Funk"], ["jazz", "Jazz & Blues"], ["electronic", "Electronic & Dance"], ["hiphop", "Hip-Hop"], ["classical", "Classical"], ["indian", "Bollywood & Indian"], ["other", "Other"]], { required: true }),
        text("authorArtist", "Artist", "e.g. Sade"),
        select("format", "Format", [["lp", "LP / Album"], ["single", "7\" Single"], ["twelve", "12\" Single / EP"], ["box", "Box Set"], ["collection", "Collection / Job Lot"]], { required: true }),
        select("pressing", "Pressing", [["original", "Original Pressing"], ["reissue", "Reissue"], ["mixed", "Mixed"]]),
        howMany,
        select("condition", "Record Grade", VINYL_GRADES, { required: true, hint: "Goldmine scale. For a collection, the typical grade." }),
        select("sleeveGrade", "Sleeve Grade", VINYL_GRADES),
      ]);

    case "DVDs & Blu-ray":
      return forSale("Film / Series", [
        select("format", "Format", [["dvd", "DVD"], ["bluray", "Blu-ray"], ["4k", "4K UHD"], ["mixed", "Mixed"]], { required: true }),
        select("genre", "Genre", [["action", "Action & Adventure"], ["comedy", "Comedy"], ["drama", "Drama"], ["scifi", "Sci-Fi & Fantasy"], ["horror", "Horror & Thriller"], ["kids", "Kids & Family"], ["tv", "TV Series"], ["world", "World Cinema"], ["other", "Other"]], { required: true }),
        howMany,
        condition,
      ]);

    case "Board Games & Puzzles":
      return forSale("Game", [
        select("itemType", "Type", [["board_game", "Board Game"], ["card_game", "Card Game"], ["rpg", "RPG & Miniatures"], ["puzzle", "Jigsaw Puzzle"], ["other", "Other"]], { required: true }),
        text("brand", "Publisher / Brand", "e.g. Kosmos, Ravensburger"),
        select("players", "Players", [["1", "Solo"], ["2", "2"], ["2_4", "2–4"], ["4up", "4+"]], shownFor(["board_game", "card_game", "rpg"])),
        select("pieces", "Pieces", [["under500", "Under 500"], ["500", "500"], ["1000", "1000"], ["1500plus", "1500+"]], shownFor(["puzzle"])),
        text("ageGroup", "Age", "e.g. 10+"),
        yesNo("complete", "All Pieces Included", { required: true }),
        condition,
      ]);

    case "Collectibles & Memorabilia":
      return forSale("Item", [
        select("itemType", "Type", [["sports", "Sports Memorabilia"], ["music", "Music Memorabilia"], ["film", "Film & TV"], ["coins", "Coins & Notes"], ["stamps", "Stamps"], ["cards", "Trading Cards"], ["toys", "Toys & LEGO"], ["art", "Art & Prints"], ["other", "Other"]], { required: true, width: "full" }),
        text("era", "Year / Era", "e.g. 1966, 1980s"),
        yesNo("authenticated", "Certificate of Authenticity"),
        howMany,
        condition,
      ]);

    default:
      return null;
  }
}
