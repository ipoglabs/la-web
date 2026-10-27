// Default "Health & Beauty" post-form schemas.
//
// Option values are what the Health & Beauty search filters match
// (components/create-alert/config/health-beauty.ts, lib/postFilterQuery.ts
// HEALTH_FORM_FILTERS). Each sub's Type is `itemType` (Salons & Spas offer
// several services, so theirs is the `services` list); how a service is
// given is `consultationMode` (in-person / online / both). The price is
// `salePrice`, the field listing prices and the price filter read; a service
// priced per job picks "Price on request" and leaves it empty. Who a service
// is for is `suitableFor`, a free first session `freeTrial`, and the languages
// a practitioner speaks `languages` (each market's own list).

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
const text = (key: string, label: string, placeholder?: string): FormFieldDef => ({ key, type: "text", label, placeholder, width: "half" });
const itemType = (entries: [string, string][]): FormFieldDef => select("itemType", "Type", entries, { required: true, width: "full" });

const providerName = text("providerName", "Business / Provider Name");
const qualification = text("qualification", "Qualifications / Registration", "e.g. HCPC registered");
const availability = text("availability", "Availability", "e.g. Mon–Sat, 9am–6pm");
const mode = select("consultationMode", "Mode", [["inperson", "In-person"], ["online", "Online"], ["both", "Both"]], { required: true });
const homeVisits: FormFieldDef = { key: "homeVisits", type: "select", label: "Home Visits", options: YES_NO, width: "half" };
const freeTrial: FormFieldDef = { key: "freeTrial", type: "select", label: "Free Trial / First Session", options: YES_NO, width: "half" };
const suitableFor = select("suitableFor", "Suitable For", [["all", "Everyone"], ["women", "Women only"], ["men", "Men only"]]);

/** Languages practitioners speak in each market — the Language filter's values. */
export const LANGUAGES: Record<string, [string, string][]> = {
  IN: [["english", "English"], ["hindi", "Hindi"], ["tamil", "Tamil"], ["telugu", "Telugu"], ["kannada", "Kannada"], ["malayalam", "Malayalam"], ["bengali", "Bengali"], ["marathi", "Marathi"], ["gujarati", "Gujarati"], ["other", "Other"]],
  GB: [["english", "English"], ["polish", "Polish"], ["urdu", "Urdu"], ["punjabi", "Punjabi"], ["hindi", "Hindi"], ["bengali", "Bengali"], ["arabic", "Arabic"], ["other", "Other"]],
  SG: [["english", "English"], ["mandarin", "Mandarin"], ["malay", "Malay"], ["tamil", "Tamil"], ["cantonese", "Cantonese"], ["hokkien", "Hokkien"], ["other", "Other"]],
};
const languages = (country: string): FormFieldDef => ({ key: "languages", type: "multiselect", label: "Languages Spoken", options: pairs(LANGUAGES[country] ?? LANGUAGES.GB) });

/** A service someone offers: what it is, how it's given, its price and what the price covers. */
const service = (fields: FormFieldDef[], units: [string, string][]): FormSection[] => [
  basics,
  { title: "Service", fields: [...fields, mode, providerName, qualification, availability] },
  {
    title: "Price",
    fields: [
      { key: "salePrice", type: "currency", label: "Price", min: 0, width: "half", hint: "Leave empty for Price on request." },
      select("priceUnit", "Price Per", [...units, ["from", "Starting from"], ["quote", "Price on request"]]),
      freeTrial,
    ],
  },
];

/** Beauty products are mostly sold sealed or barely opened. */
const PRODUCT_CONDITION: [string, string][] = [
  ["new", "New, Sealed"],
  ["like-new", "Opened, Unused"],
  ["lightly-used", "Lightly Used"],
  ["used", "Well Used"],
];

export function healthBeautySections(subcategory: string, country: string): FormSection[] | null {
  switch (subcategory) {
    case "Fitness Classes & Training":
      return service(
        [itemType([["gym", "Gym"], ["yoga", "Yoga"], ["pilates", "Pilates"], ["crossfit", "CrossFit"], ["pt", "Personal Trainer"], ["group", "Group Classes"], ["martial_arts", "Martial Arts"], ["dance", "Dance Fitness"], ["other", "Other"]]), suitableFor],
        [["month", "Per month"], ["class", "Per class"], ["session", "Per session"], ["package", "Per package"]],
      );

    case "Salons & Spas":
      return service(
        [
          { key: "services", type: "multiselect", label: "Services", required: true, options: pairs([["hair", "Hair"], ["nails", "Nails"], ["lashes_brows", "Lashes & Brows"], ["waxing", "Waxing & Threading"], ["makeup", "Makeup"], ["skincare", "Facials & Skincare"], ["massage", "Massage"], ["spa", "Spa Packages"], ["bridal", "Bridal & Mehndi"], ["tattoo", "Tattoo & Piercing"], ["other", "Other"]]) },
          suitableFor,
          homeVisits,
        ],
        [["session", "Per session"], ["hour", "Per hour"], ["package", "Per package"]],
      );

    case "Medical & Therapy":
      return service(
        [itemType([["doctor", "GP / Doctor"], ["dentist", "Dentist"], ["physio", "Physiotherapy"], ["health_check", "Health Checks"], ["eye", "Eye Care"], ["podiatry", "Podiatry / Chiropody"], ["specialist", "Specialist"], ["other", "Other"]]), homeVisits, languages(country)],
        [["visit", "Per visit"], ["session", "Per session"], ["package", "Per package"]],
      );

    case "Wellness & Nutrition":
      return service(
        [itemType([["meditation", "Meditation & Mindfulness"], ["nutrition", "Nutrition & Diet"], ["massage", "Massage Therapy"], ["ayurveda", "Ayurveda & Traditional"], ["acupuncture", "Acupuncture"], ["reiki", "Reiki & Energy Healing"], ["retreat", "Retreats"], ["other", "Other"]]), suitableFor],
        [["session", "Per session"], ["class", "Per class"], ["package", "Per package"], ["person", "Per person"]],
      );

    case "Mental Health & Counselling":
      return service(
        [itemType([["counselling", "Counselling"], ["therapy", "Psychotherapy"], ["coaching", "Life Coaching"], ["support_group", "Support Group"], ["other", "Other"]]), languages(country)],
        [["session", "Per session"], ["hour", "Per hour"], ["package", "Per package"]],
      );

    case "Beauty Products":
      return [
        basics,
        {
          title: "Product",
          fields: [
            itemType([["skincare", "Skincare"], ["makeup", "Makeup"], ["fragrance", "Fragrance"], ["haircare", "Haircare"], ["hair_tools", "Hair Tools & Devices"], ["bath_body", "Bath & Body"], ["nails", "Nails"], ["mens", "Men's Grooming"], ["other", "Other"]]),
            select("condition", "Condition", PRODUCT_CONDITION, { required: true }),
            text("brand", "Brand"),
            { key: "expiryDate", type: "date", label: "Expiry Date", width: "half" },
            { key: "receipt", type: "select", label: "Receipt Available", options: YES_NO, width: "half" },
          ],
        },
        {
          title: "Price & Delivery",
          fields: [
            { key: "salePrice", type: "currency", label: "Price", required: true, min: 1, width: "half" },
            { key: "negotiable", type: "select", label: "Negotiable", options: YES_NO, width: "half" },
            { key: "dealMethod", type: "multiselect", label: "Deal Method", options: pairs([["meetup", "Meet-up / Collection"], ["delivery", "Delivery / Courier"]]) },
          ],
        },
      ];

    default:
      return null;
  }
}
