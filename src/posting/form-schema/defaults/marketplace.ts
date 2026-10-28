// Default post-form schemas for the categories promoted out of the old
// "For Sale" bucket (Books, Media & Collectibles, Tickets & Vouchers). Their old
// forms were borrowed from other categories and most of what
// they collected was never saved; these give each category its own fields.
//
// Field choices follow what the leading classifieds in our markets ask for
// in the same categories — OLX (IN), Gumtree (GB), Carousell (SG): a graded
// condition scale, a deal method (meet-up / delivery), brand/model for goods,
// size/colour for fashion, specs for phones and laptops.

import type { FormFieldDef, FormSection } from "../types";
import { basics, pairs, YES_NO } from "./shared";

/** Graded condition scale (Carousell / Gumtree style). "new", "like-new" and
 *  "used" keep the values older posts already store. */
const CONDITION_SCALE: [string, string][] = [
  ["new", "Brand New"],
  ["like-new", "Like New"],
  ["lightly-used", "Lightly Used"],
  ["used", "Well Used"],
  ["heavily-used", "Heavily Used"],
];

// ── Reusable fields ──────────────────────────────────────────────────────────
const price = (label = "Price", required = true): FormFieldDef => ({
  key: "price",
  type: "currency",
  label,
  required,
  min: required ? 1 : 0,
  width: "half",
});
const negotiable: FormFieldDef = { key: "negotiable", type: "select", label: "Negotiable", options: YES_NO, width: "half" };
const brand: FormFieldDef = { key: "brand", type: "text", label: "Brand", width: "half" };
const condition = (extra: [string, string][] = []): FormFieldDef => ({
  key: "condition",
  type: "select",
  label: "Condition",
  required: true,
  options: pairs([...CONDITION_SCALE, ...extra]),
});
const providerName: FormFieldDef = { key: "providerName", type: "text", label: "Business / Provider Name", width: "half" };
const ageGroup: FormFieldDef = { key: "ageGroup", type: "text", label: "Age Group", placeholder: "e.g. 3-5 years", width: "half" };

const dealMethod: FormFieldDef = {
  key: "dealMethod",
  type: "multiselect",
  label: "Deal Method",
  options: pairs([["meetup", "Meet-up / Collection"], ["delivery", "Delivery / Courier"]]),
};

/** An item for sale. */
const item = (title: string, fields: FormFieldDef[]): FormSection[] => [
  basics,
  { title, fields },
  { title: "Price & Delivery", fields: [price(), negotiable, dealMethod] },
];

// ── Categories ───────────────────────────────────────────────────────────────
type Builder = (subcategory: string) => FormSection[] | null;

const booksMedia: Builder = (sub) => {
  const extra: Record<string, FormFieldDef[]> = {
    "Books & Comics": [{ key: "authorArtist", type: "text", label: "Author", width: "half" }, { key: "genre", type: "text", label: "Genre", width: "half" }],
    "Vinyl Records": [{ key: "authorArtist", type: "text", label: "Artist", width: "half" }, { key: "genre", type: "text", label: "Genre", width: "half" }],
    "DVDs & Blu-ray": [{ key: "genre", type: "text", label: "Genre", width: "half" }],
    "Board Games & Puzzles": [brand, ageGroup],
    "Collectibles & Memorabilia": [{ key: "era", type: "text", label: "Year / Era", placeholder: "e.g. 1960s", width: "half" }],
  };
  return extra[sub] ? item("Item", [condition([["collectible", "Collectible"]]), ...extra[sub]]) : null;
};

const tickets: Builder = (sub) => {
  const faceValue: FormFieldDef = { key: "faceValue", type: "currency", label: "Face Value", min: 0, width: "half" };
  const quantity: FormFieldDef = { key: "quantity", type: "number", label: "Quantity", min: 1, width: "half" };
  switch (sub) {
    case "Event Tickets":
    case "Sport Tickets":
      return [
        basics,
        {
          title: "Tickets",
          fields: [
            { key: "startDate", type: "date", label: "Event Date", required: true, width: "half" },
            { key: "venue", type: "text", label: "Venue", width: "half" },
            quantity,
            { key: "seatDetails", type: "text", label: "Seat / Section", width: "half" },
            faceValue,
            price("Asking Price"),
          ],
        },
      ];
    case "Gift Cards":
    case "Experience Days":
    case "Travel Vouchers":
      return [
        basics,
        {
          title: "Voucher",
          fields: [
            sub === "Gift Cards" ? { key: "brand", type: "text", label: "Store / Brand", required: true, width: "half" } : providerName,
            { key: "deadline", type: "date", label: "Valid Until", width: "half" },
            faceValue,
            price("Asking Price"),
          ],
        },
      ];
    default:
      return null;
  }
};

export const MARKETPLACE_BUILDERS: Record<string, Builder> = {
  "Books, Media & Collectibles": booksMedia,
  "Tickets & Vouchers": tickets,
};
