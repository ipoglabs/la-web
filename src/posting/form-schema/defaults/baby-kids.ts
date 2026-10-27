// Default "Baby & Kids" post-form schemas.
//
// Option values are what the Baby & Kids search filters match
// (components/create-alert/config/baby-kids.ts, lib/postFilterQuery.ts
// BABY_FORM_FILTERS). Each sub's Type is `itemType` (Childcare: `careType`;
// Classes: `activityType`), the age it suits `ageGroup` (one band for things,
// several `ages` for childcare and classes). Items save the price as
// `salePrice`, the field listing prices and the price filter read; services
// add Price Per as `priceUnit` for the card suffix.
//
// Childcare asks what each market's parents check first: Ofsted (UK), ECDA
// (Singapore), a background check and paediatric first aid. Car seats ask
// the safety standard and whether the seat has been in an accident, since
// second-hand seats are only safe with a known history.

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
const itemType = (entries: [string, string][], extra: Partial<FormFieldDef> = {}): FormFieldDef => select("itemType", "Type", entries, { required: true, width: "full", ...extra });

/** Age bands for toys, books and services — the Age filter's values. */
export const AGE_BANDS: [string, string][] = [["0_2", "0–2 yrs"], ["3_5", "3–5 yrs"], ["6_9", "6–9 yrs"], ["10plus", "10+ yrs"]];
/** Clothing ages, as shops size them — the clothing Age filter's values. */
const CLOTHING_AGES: [string, string][] = [["infant", "0–12 months"], ["toddler", "1–3 yrs"], ["young", "4–7 yrs"], ["older", "8–14 yrs"]];

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

const CHILDCARE_CHECKS: Record<string, { registration: [string, string]; check: string }> = {
  GB: { registration: ["Ofsted URN", "Childminders and nurseries caring for under-8s must register with Ofsted."], check: "Enhanced DBS Check" },
  IN: { registration: ["Registration / Licence (if any)", "e.g. state registration for a daycare centre."], check: "Police Verification" },
  SG: { registration: ["ECDA Licence No.", "Childcare centres must be licensed by ECDA."], check: "Background Checked" },
};

/** A service for children: who runs it, which ages, its price and what the price covers. */
const service = (fields: FormFieldDef[], units: [string, string][]): FormSection[] => [
  basics,
  { title: "Service", fields },
  {
    title: "Price",
    fields: [
      { key: "salePrice", type: "currency", label: "Fee", required: true, min: 0, width: "half" },
      select("priceUnit", "Price Per", units, { required: true }),
    ],
  },
];
const ages = multi("ages", "Ages", AGE_BANDS, { required: true });
const providerName = text("providerName", "Provider / Business Name");
const availability = text("availability", "Days & Times", "e.g. Mon–Fri, 8am–6pm");

export function babyKidsSections(subcategory: string, country: string): FormSection[] | null {
  switch (subcategory) {
    case "Toys & Games":
      return forSale("Toy", [
        itemType([["building", "Building & LEGO"], ["dolls_figures", "Dolls & Figures"], ["educational", "Educational"], ["board_games", "Board Games & Puzzles"], ["outdoor", "Outdoor & Ride-on"], ["baby_toddler", "Baby & Toddler"], ["electronic", "Electronic & Video"], ["soft", "Soft Toys"], ["other", "Other"]]),
        select("ageGroup", "Age", AGE_BANDS, { required: true }),
        condition,
        brand,
        yesNo("complete", "Complete (all pieces)"),
      ]);

    case "Baby Gear & Equipment":
      return forSale("Gear", [
        itemType([["pram", "Pram / Stroller"], ["car_seat", "Car Seat"], ["cot", "Cot / Crib / Moses Basket"], ["high_chair", "High Chair"], ["monitor", "Baby Monitor"], ["carrier", "Baby Carrier"], ["bath_changing", "Bath & Changing"], ["feeding", "Feeding & Bottles"], ["safety", "Safety Gates & Proofing"], ["play", "Bouncers & Play"], ["other", "Other"]]),
        condition,
        brand,
        text("model", "Model"),
        select("carSeatStandard", "Safety Standard", [["r129", "i-Size (R129)"], ["r44", "R44/04"], ["other", "Other / Not sure"]], { showWhen: { field: "itemType", in: ["car_seat"] } }),
        yesNo("accidentFree", "Never in an Accident", { required: true, hint: "Only sell a used car seat if you know its full history.", showWhen: { field: "itemType", in: ["car_seat"] } }),
        text("ageRange", "Suitable For", "e.g. Birth to 4 years"),
      ]);

    case "Baby & Kids Clothing":
      return forSale("Clothing", [
        itemType([["bundle", "Bundle"], ["tops", "Tops & T-shirts"], ["bottoms", "Trousers & Shorts"], ["dresses", "Dresses & Skirts"], ["outerwear", "Coats & Jackets"], ["sleepwear", "Sleepwear"], ["traditional", "Traditional & Festive"], ["shoes", "Shoes"], ["other", "Other"]]),
        select("ageGroup", "Age", CLOTHING_AGES, { required: true }),
        select("gender", "For", [["boy", "Boy"], ["girl", "Girl"], ["unisex", "Unisex"]], { required: true }),
        condition,
        text("size", "Size", "e.g. 3–4 years, 9–12 months"),
        brand,
      ]);

    case "School Supplies & Books":
      return forSale("Item", [
        itemType([["uniform", "School Uniform"], ["bags", "Bags & Lunchboxes"], ["stationery", "Stationery"], ["books", "Books & Textbooks"], ["other", "Other"]]),
        select("ageGroup", "Age", AGE_BANDS),
        condition,
        brand,
        text("school", "School / Grade", "e.g. Class 5, Year 2"),
      ]);

    case "Childcare & Nurseries": {
      const { registration: [regLabel, regHint], check } = CHILDCARE_CHECKS[country] ?? CHILDCARE_CHECKS.GB;
      return service(
        [
          select("careType", "Care Type", [["nursery", "Nursery / Daycare"], ["childminder", "Childminder"], ["nanny", "Nanny / Au Pair"], ["babysitting", "Babysitting"], ["afterschool", "After School"], ["holiday", "Holiday Care"]], { required: true, width: "full" }),
          ages,
          multi("hours", "Hours", [["fullday", "Full Day"], ["halfday", "Half Day"], ["evenings", "Evenings"], ["weekends", "Weekends"], ["overnight", "Overnight"]]),
          providerName,
          availability,
          { key: "registration", type: "text", label: regLabel, hint: regHint, width: "half" },
          yesNo("backgroundCheck", check),
          yesNo("firstAid", "Paediatric First Aid"),
          { key: "qualification", type: "text", label: "Qualifications", placeholder: "e.g. Level 3 Early Years", width: "half" },
        ],
        [["hour", "Per hour"], ["day", "Per day"], ["week", "Per week"], ["month", "Per month"], ["session", "Per session"]],
      );
    }

    case "Kids Classes & Activities":
      return service(
        [
          select("activityType", "Activity", [["sports", "Sports"], ["swimming", "Swimming"], ["arts", "Arts & Crafts"], ["music", "Music"], ["dance", "Dance"], ["coding", "Coding & STEM"], ["academic", "Tuition & Academic"], ["camps", "Holiday Camps"], ["other", "Other"]], { required: true, width: "full" }),
          ages,
          select("consultationMode", "Mode", [["inperson", "In-person"], ["online", "Online"], ["both", "Both"]], { required: true }),
          yesNo("freeTrial", "Free Trial Class"),
          providerName,
          availability,
          { key: "qualification", type: "text", label: "Coach / Teacher Qualifications", placeholder: "e.g. FA Level 1, STA", width: "half" },
          yesNo("backgroundCheck", CHILDCARE_CHECKS[country]?.check ?? CHILDCARE_CHECKS.GB.check),
        ],
        [["class", "Per class"], ["session", "Per session"], ["month", "Per month"], ["term", "Per term"], ["course", "Per course"], ["week", "Per week"]],
      );

    default:
      return null;
  }
}
