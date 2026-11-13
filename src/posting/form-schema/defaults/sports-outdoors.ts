// Default "Sports & Outdoors" post-form schemas.
//
// Option values are what the Sports & Outdoors search filters match
// (components/create-alert/config/sports-outdoors.ts, lib/postFilterQuery.ts
// SPORTS_FORM_FILTERS). Each sub's Type is `itemType`; Team Sports also asks
// the `sport`, Outdoor and Water Sports the `activity`. Items save the price
// as `salePrice`, the field listing prices and the price filter read; coaching
// adds Price Per as `priceUnit` for the card suffix.
//
// Bikes ask frame and wheel size, as Gumtree, OLX and Carousell buyers search
// on them; bulky gym kit asks whether the buyer must collect.

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
const text = (key: string, label: string, placeholder?: string): FormFieldDef => ({ key, type: "text", label, placeholder, width: "half" });
const yesNo = (key: string, label: string, extra: Partial<FormFieldDef> = {}): FormFieldDef => ({ key, type: "select", label, options: YES_NO, width: "half", ...extra });
const itemType = (entries: [string, string][], extra: Partial<FormFieldDef> = {}): FormFieldDef => select("itemType", "Type", entries, { required: true, ...extra });

/** Graded condition scale (Carousell / Gumtree style), as the other marketplace categories. */
const CONDITION_SCALE: [string, string][] = [
  ["new", "Brand New"],
  ["like-new", "Like New"],
  ["lightly-used", "Lightly Used"],
  ["used", "Well Used"],
  ["heavily-used", "Heavily Used"],
];
const condition = select("condition", "Condition", CONDITION_SCALE, { required: true });
const brand = text("brand", "Brand");
const model = text("model", "Model");
const size = (placeholder: string) => text("size", "Size", placeholder);

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

/** Bike sizes, asked only when the item is a bike. */
const bikeFields: FormFieldDef[] = [
  select("bikeType", "Bike Type", [["mountain", "Mountain"], ["road", "Road"], ["hybrid", "Hybrid / City"], ["gravel", "Gravel"], ["bmx", "BMX"], ["folding", "Folding"], ["electric", "Electric"], ["kids", "Kids"], ["other", "Other"]], { required: true, showWhen: { field: "itemType", in: ["bike"] } }),
  { ...text("frameSize", "Frame Size", "e.g. Medium, 54cm, 17\""), showWhen: { field: "itemType", in: ["bike"] } },
  select("wheelSize", "Wheel Size", [["20", "20\" or smaller"], ["24", "24\""], ["26", "26\""], ["27.5", "27.5\" / 650b"], ["29", "29\" / 700c"]], { showWhen: { field: "itemType", in: ["bike"] } }),
];

/** Examples in each market's own terms (LTA is UK-only; Singapore shops size shoes in US sizes). */
const EXAMPLES: Record<string, { teamSize: string; wearSize: string; coachQual: string }> = {
  IN: { teamSize: "e.g. UK 8, Size 5 ball, SH bat", wearSize: "e.g. UK 8, M, 32", coachQual: "e.g. NIS certified, ACE / K11 PT" },
  GB: { teamSize: "e.g. UK 10, Size 5 ball, Harrow", wearSize: "e.g. UK 9, M, Size 8", coachQual: "e.g. Level 3 PT, LTA Level 3, NASM" },
  SG: { teamSize: "e.g. US 9, Size 5 ball", wearSize: "e.g. US 9, M, EU 42", coachQual: "e.g. NROC registered, ACE CPT" },
};

export function sportsOutdoorsSections(subcategory: string, country = "GB"): FormSection[] | null {
  const ex = EXAMPLES[country] ?? EXAMPLES.GB;
  switch (subcategory) {
    case "Fitness Equipment":
      return forSale("Equipment", [
        itemType([["weights", "Weights & Dumbbells"], ["bench", "Bench / Rack"], ["home_gym", "Home Gym / Multi-gym"], ["treadmill", "Treadmill"], ["bike", "Exercise Bike"], ["rower", "Rowing Machine"], ["cross_trainer", "Cross Trainer"], ["yoga", "Yoga & Pilates"], ["accessories", "Bands & Accessories"], ["other", "Other"]], { width: "full" }),
        condition,
        brand,
        model,
        text("weight", "Weight / Load", "e.g. 2 × 25kg, max 150kg"),
        yesNo("collectionOnly", "Buyer Must Collect", { hint: "Heavy or bulky items that can't be posted." }),
      ]);

    case "Team Sports":
      return forSale("Item", [
        select("sport", "Sport", [["football", "Football"], ["cricket", "Cricket"], ["basketball", "Basketball"], ["rugby", "Rugby"], ["hockey", "Hockey"], ["tennis", "Tennis"], ["badminton", "Badminton"], ["table_tennis", "Table Tennis"], ["golf", "Golf"], ["netball", "Netball / Volleyball"], ["other", "Other"]], { required: true }),
        itemType([["bat_racket", "Bat / Racket / Club"], ["ball", "Balls"], ["footwear", "Boots & Shoes"], ["protective", "Pads & Protection"], ["kit", "Kit & Clothing"], ["goals_nets", "Goals, Nets & Hoops"], ["bags", "Bags"], ["bundle", "Bundle / Full Kit"], ["other", "Other"]]),
        condition,
        brand,
        size(ex.teamSize),
      ]);

    case "Outdoor & Adventure":
      return forSale("Gear", [
        select("activity", "Activity", [["hiking", "Hiking & Trekking"], ["camping", "Camping"], ["climbing", "Climbing"], ["cycling", "Cycling"], ["running", "Running"], ["fishing", "Fishing"], ["skating", "Skates & Scooters"], ["winter", "Ski & Snow"], ["other", "Other"]], { required: true }),
        itemType([["tent", "Tent & Shelter"], ["sleeping", "Sleeping Bag & Mat"], ["backpack", "Backpack"], ["cooking", "Stove & Cooking"], ["bike", "Bike"], ["bike_parts", "Bike Parts & Accessories"], ["clothing", "Clothing & Footwear"], ["climbing_gear", "Ropes & Climbing Gear"], ["fishing_gear", "Rods & Tackle"], ["other", "Other"]]),
        ...bikeFields,
        condition,
        brand,
        model,
        text("capacity", "Size / Capacity", "e.g. 4-person, 60L, -7°C"),
      ]);

    case "Water Sports":
      return forSale("Gear", [
        select("activity", "Activity", [["swimming", "Swimming"], ["surfing", "Surfing"], ["paddleboarding", "Paddleboarding"], ["kayaking", "Kayaking & Canoeing"], ["diving", "Diving & Snorkelling"], ["sailing", "Sailing & Windsurfing"], ["other", "Other"]], { required: true }),
        itemType([["board", "Board"], ["kayak", "Kayak / Canoe"], ["paddle", "Paddle"], ["wetsuit", "Wetsuit & Swimwear"], ["safety", "Life Jacket & Safety"], ["diving_gear", "Mask, Fins & Dive Gear"], ["other", "Other"]]),
        condition,
        brand,
        size("e.g. 10'8\", Men's MS, 2-person"),
        yesNo("inflatable", "Inflatable"),
      ]);

    case "Sportswear & Footwear":
      return forSale("Item", [
        select("gender", "For", [["men", "Men"], ["women", "Women"], ["kids", "Kids"], ["unisex", "Unisex"]], { required: true }),
        itemType([["shoes", "Running & Training Shoes"], ["boots", "Boots & Cleats"], ["tops", "Tops & T-shirts"], ["bottoms", "Leggings, Shorts & Bottoms"], ["sports_bra", "Sports Bras"], ["outerwear", "Jackets & Hoodies"], ["swimwear", "Swimwear"], ["bundle", "Bundle"], ["other", "Other"]]),
        condition,
        size(ex.wearSize),
        brand,
      ]);

    case "Fitness Classes & Coaching":
      return [
        basics,
        {
          title: "Coaching",
          fields: [
            itemType([["pt", "Personal Training"], ["group", "Group Class / Bootcamp"], ["sports", "Sports Coaching"], ["running", "Running Coach"], ["yoga", "Yoga & Pilates"], ["martial", "Martial Arts & Boxing"], ["swimming", "Swimming Lessons"], ["other", "Other"]], { width: "full" }),
            select("consultationMode", "Mode", [["inperson", "In-person"], ["online", "Online"], ["both", "Both"]], { required: true }),
            multi("levels", "Levels", [["beginner", "Beginner"], ["intermediate", "Intermediate"], ["advanced", "Advanced"]]),
            yesNo("freeTrial", "Free Trial Session"),
            { key: "qualification", type: "text", label: "Qualifications", placeholder: ex.coachQual, width: "half" },
            text("providerName", "Coach / Gym Name"),
            text("availability", "Days & Times", "e.g. Weekday mornings"),
          ],
        },
        {
          title: "Price",
          fields: [
            { key: "salePrice", type: "currency", label: "Fee", required: true, min: 0, width: "half" },
            select("priceUnit", "Price Per", [["session", "Per session"], ["hour", "Per hour"], ["class", "Per class"], ["month", "Per month"], ["package", "Per package"], ["course", "Per course"]], { required: true }),
          ],
        },
      ];

    default:
      return null;
  }
}
