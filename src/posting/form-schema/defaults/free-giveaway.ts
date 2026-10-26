// Default "Free & Giveaway" post-form schemas.
//
// Option values are what the Free & Giveaway search filters match
// (components/create-alert/config/free-giveaway.ts, lib/postFilterQuery.ts
// FREE_FORM_FILTERS). Nothing here has a price; cards show "Free". Best Before
// (Food) and Must Go By (the rest) share the `deadline` key: the ad drops out
// of search once that date has passed.

import type { FormFieldDef, FormSection } from "../types";
import { basics, pairs } from "./shared";

/** The marketplace's graded condition scale (defaults/marketplace.ts). */
const CONDITION_SCALE: [string, string][] = [
  ["new", "Brand New"],
  ["like-new", "Like New"],
  ["lightly-used", "Lightly Used"],
  ["used", "Well Used"],
  ["heavily-used", "Heavily Used"],
];

const condition = (required = true): FormFieldDef => ({ key: "condition", type: "select", label: "Condition", required, options: pairs(CONDITION_SCALE) });
const select = (key: string, label: string, entries: [string, string][], extra: Partial<FormFieldDef> = {}): FormFieldDef => ({
  key,
  type: "select",
  label,
  options: pairs(entries),
  ...extra,
});
const text = (key: string, label: string, placeholder: string): FormFieldDef => ({ key, type: "text", label, placeholder, width: "half" });
const mustGoBy: FormFieldDef = { key: "deadline", type: "date", label: "Must Go By", hint: "The ad comes down after this date.", width: "half" };
/** "Collection" is the UK word; India and Singapore say pickup. */
const pickup = (country: string): FormFieldDef =>
  text("availability", country === "GB" ? "Collection Times" : "Pickup Times", "e.g. Weekday evenings");

/** Strollers in India and Singapore, pushchairs in the UK. */
const GEAR_LABEL: Record<string, string> = { IN: "Strollers & Gear", GB: "Pushchairs & Gear", SG: "Strollers & Gear" };
/** Traditional dress in India and Singapore; the UK equivalent is occasion wear. */
const TRADITIONAL_LABEL: Record<string, string> = { IN: "Traditional Wear", GB: "Occasion Wear", SG: "Traditional Wear" };
const DIETARY: [string, string][] = [["vegetarian", "Vegetarian"], ["vegan", "Vegan"], ["halal", "Halal"], ["gluten_free", "Gluten-Free"]];
const DIETARY_IN: [string, string][] = [...DIETARY, ["jain", "Jain"], ["eggless", "Eggless"]];

export function freeGiveawaySections(subcategory: string, country: string): FormSection[] | null {
  const section = (fields: FormFieldDef[]): FormSection[] => [basics, { title: "Item", fields }];

  switch (subcategory) {
    case "Furniture":
      return section([
        select("itemType", "Item Type", [["seating", "Seating"], ["bed", "Bed & Mattress"], ["table", "Table & Desk"], ["storage", "Storage"], ["outdoor", "Outdoor & Garden"], ["other", "Other"]], { required: true }),
        condition(),
        text("dimensions", "Dimensions", "e.g. 200 × 90 cm"),
        text("collectionAccess", "Collection Access", "e.g. 2nd floor, no lift"),
        mustGoBy,
        pickup(country),
      ]);

    case "Clothing":
      return section([
        select("gender", "For", [["men", "Men"], ["women", "Women"], ["kids", "Kids"], ["unisex", "Unisex"]], { required: true, width: "half" }),
        select("clothingType", "Clothing Type", [
          ["tops", "Tops"],
          ["bottoms", "Bottoms"],
          ["dresses", "Dresses"],
          ["outerwear", "Outerwear"],
          ["shoes", "Shoes"],
          ["traditional", TRADITIONAL_LABEL[country] ?? TRADITIONAL_LABEL.IN],
          ["mixed", "Mixed Bundle"],
        ], { width: "half" }),
        text("size", "Size", "e.g. M/L, UK 14, Age 2–4"),
        select("lotType", "Single or Bundle", [["single", "Single item"], ["bundle", "Bundle"]], { width: "half" }),
        condition(),
        mustGoBy,
        pickup(country),
      ]);

    case "Electronics":
      return section([
        select("itemType", "Item Type", [
          ["phone", "Phone & Tablet"],
          ["laptop", "Laptop & PC"],
          ["tv", "TV & Monitor"],
          ["audio", "Audio & Speakers"],
          ["gaming", "Console & Games"],
          ["printer", "Printers & Accessories"],
          ["appliance", "Home & Kitchen Appliance"],
          ["other", "Other"],
        ], { required: true, hint: "Phones and computers: wipe your data and sign out of your accounts first." }),
        select("workingStatus", "Working Status", [["working", "Fully working"], ["partly", "Partly working"], ["parts", "Not working (for parts)"]], { required: true, width: "half" }),
        { ...condition(false), width: "half" },
        text("brand", "Brand", "e.g. Sony, Dell"),
        text("included", "What's Included", "e.g. Remote, charger, cables"),
        mustGoBy,
        pickup(country),
      ]);

    case "Food":
      return section([
        select("foodType", "Food Type", [["fresh", "Fresh Produce"], ["packaged", "Packaged"], ["cooked", "Cooked Meal"], ["baked", "Baked Goods"], ["other", "Other"]], {
          required: true,
          hint: "Homemade food: say when it was made. Never give away food past its Use By date.",
        }),
        { key: "dietary", type: "multiselect", label: "Dietary", options: pairs(country === "IN" ? DIETARY_IN : DIETARY) },
        text("allergens", "Allergens", "e.g. Contains nuts, dairy, eggs"),
        text("amount", "Amount", "e.g. 12 eggs, 3 portions"),
        { key: "deadline", type: "date", label: "Best Before", required: true, hint: "For cooked food, the day it must be eaten by.", width: "half" },
        select("collectionMethod", "Collection Method", [["arrange", "Arrange a time"], ["left_out", "Left out, help yourself"]], { width: "half" }),
        pickup(country),
      ]);

    case "Kids Items":
      return section([
        select("itemType", "Item Type", [
          ["toys", "Toys & Games"],
          ["gear", GEAR_LABEL[country] ?? GEAR_LABEL.IN],
          ["nursery", "Nursery & Feeding"],
          ["books", "Books"],
          ["clothing", "Clothing"],
          ["other", "Other"],
        ], { required: true, hint: "Car seats: only if it has never been in an accident." }),
        { key: "ageGroup", type: "multiselect", label: "Age Group", options: pairs([["0_2", "0–2 yrs"], ["3_5", "3–5 yrs"], ["6_12", "6–12 yrs"], ["12plus", "12+ yrs"]]) },
        condition(),
        mustGoBy,
        pickup(country),
      ]);

    case "General":
      return section([
        select("itemCategory", "Category", [
          ["household", "Household & Kitchen"],
          ["packing", "Moving & Packing"],
          ["books", "Books & Media"],
          ["tools", "Tools"],
          ["garden", "Garden"],
          ["diy", "DIY & Building"],
          ["hobbies", "Hobbies & Crafts"],
          ["other", "Other"],
        ], { required: true }),
        { ...condition(false), width: "half" },
        text("amount", "Amount", "e.g. 25 boxes, 10 bags"),
        mustGoBy,
        pickup(country),
      ]);

    default:
      return null;
  }
}
