// Default "Pets" post-form schemas.
//
// Option values are what the Pets search filters match
// (components/create-alert/config/pets.ts, lib/postFilterQuery.ts
// PETS_FORM_FILTERS). Prices are `salePrice`, the field listing prices and the
// price filter read; Wanted keeps `budget`, which its price filter reads.

import type { FormFieldDef, FormSection } from "../types";
import { basics, pairs, YES_NO } from "./shared";

/** Pet types, matching the Animal / For Animal filters. */
const PET_TYPES = pairs([
  ["dog", "Dog"],
  ["cat", "Cat"],
  ["bird", "Bird"],
  ["fish", "Fish"],
  ["rabbit", "Rabbit"],
  ["reptile", "Reptile"],
  ["small", "Small Animal"],
  ["other", "Other"],
]);
const SIZES = pairs([
  ["small", "Small"],
  ["medium", "Medium"],
  ["large", "Large"],
]);
/** Age groups, matching the Age filter. */
const AGE_GROUPS: [string, string][] = [
  ["baby", "Baby (under 6 months)"],
  ["young", "Young (6 months–2 years)"],
  ["adult", "Adult (2–7 years)"],
  ["senior", "Senior (7+ years)"],
];
const YES_NO_UNKNOWN = pairs([["yes", "Yes"], ["no", "No"], ["unknown", "Unknown"]]);

const salePrice = (label: string, required: boolean): FormFieldDef => ({
  key: "salePrice",
  type: "currency",
  label,
  required,
  min: required ? 1 : 0,
  width: "half",
});
const listedBy = (entries: [string, string][], required = true): FormFieldDef => ({
  key: "listedBy",
  type: "select",
  label: "Listed By",
  required,
  options: pairs(entries),
});
const yesNo = (key: string, label: string): FormFieldDef => ({ key, type: "select", label, options: YES_NO, width: "half" });

/** The animal itself — shared by For Sale and Adoption. */
const petProfile: FormFieldDef[] = [
  { key: "petType", type: "select", label: "Pet Type", required: true, options: PET_TYPES },
  { key: "breed", type: "text", label: "Breed", width: "half" },
  { key: "breedType", type: "select", label: "Breed Type", options: pairs([["pure", "Pure Breed"], ["mixed", "Mixed Breed"]]), width: "half" },
  { key: "ageGroup", type: "select", label: "Age Group", options: pairs(AGE_GROUPS) },
  { key: "age", type: "text", label: "Exact Age", placeholder: "e.g. 10 weeks", width: "half" },
  { key: "gender", type: "select", label: "Gender", options: pairs([["male", "Male"], ["female", "Female"]]), width: "half" },
  { key: "size", type: "select", label: "Size", options: SIZES },
  {
    key: "vaccination",
    type: "select",
    label: "Vaccination",
    options: pairs([["vaccinated", "Vaccinated"], ["partial", "Partially Vaccinated"], ["not_vaccinated", "Not Vaccinated"]]),
  },
  yesNo("microchipped", "Microchipped"),
  yesNo("neutered", "Neutered / Spayed"),
];

/** Breeders need a council licence in GB and an AVS licence in SG. */
const breederLicence = (country: string): FormFieldDef[] =>
  country === "GB" || country === "SG"
    ? [{ key: "licenceNo", type: "text", label: "Breeder Licence No.", placeholder: country === "GB" ? "Council licence number" : "AVS licence number", width: "half" }]
    : [];

export const PETS_SUBCATEGORIES = ["For Sale", "Adoption", "Pet Care", "Accessories", "Lost & Found", "Wanted"];

export function petsSections(subcategory: string, country: string): FormSection[] | null {
  switch (subcategory) {
    case "For Sale":
      return [
        basics,
        {
          title: "Pet",
          fields: [
            listedBy([["owner", "Owner"], ["breeder", "Breeder"], ["shop", "Pet Shop"]]),
            ...petProfile,
            yesNo("papers", "Registered / Papers"),
            ...breederLicence(country),
            { key: "readyDate", type: "date", label: "Ready to Leave", immediateOption: "Ready now", width: "half" },
            { key: "available", type: "number", label: "Available", hint: "How many from this litter", min: 1, max: 20, width: "half" },
            salePrice("Price", true),
          ],
        },
      ];

    case "Adoption":
      return [
        basics,
        {
          title: "Pet",
          fields: [
            listedBy([["owner", "Owner"], ["rescue", "Rescue / Shelter"]]),
            { key: "petName", type: "text", label: "Pet Name", width: "half" },
            ...petProfile,
            yesNo("houseTrained", "House-trained"),
            {
              key: "goodWith",
              type: "multiselect",
              label: "Good With",
              options: pairs([["children", "Children"], ["dogs", "Dogs"], ["cats", "Cats"], ["other_pets", "Other pets"]]),
            },
            salePrice("Adoption Fee", false),
          ],
        },
      ];

    case "Pet Care":
      return [
        basics,
        {
          title: "Service",
          fields: [
            listedBy([["individual", "Individual"], ["business", "Business"]]),
            {
              key: "serviceType",
              type: "select",
              label: "Service Type",
              required: true,
              options: pairs([
                ["grooming", "Grooming"],
                ["boarding", "Boarding"],
                ["sitting", "Pet Sitting"],
                ["walking", "Walking"],
                ["training", "Training"],
                ["vet", "Vet"],
                ["transport", "Transport"],
                ["other", "Other"],
              ]),
            },
            { key: "forAnimals", type: "multiselect", label: "For Animals", options: PET_TYPES },
            { key: "serviceMode", type: "multiselect", label: "Service Mode", options: pairs([["walkin", "Walk-in"], ["homevisit", "Home Visit"]]) },
            { key: "serviceProviderName", type: "text", label: "Service Provider Name", width: "half" },
            {
              key: "experience",
              type: "select",
              label: "Years of Experience",
              options: pairs([["0-1", "Under 1 year"], ["1-3", "1–3 years"], ["3-5", "3–5 years"], ["5-10", "5–10 years"], ["10+", "10+ years"]]),
            },
            { key: "availability", type: "text", label: "Availability", placeholder: "e.g. Mon–Sat, 9am–6pm", width: "half" },
            salePrice("Price", true),
            {
              key: "priceUnit",
              type: "select",
              label: "Price Per",
              options: pairs([["session", "Per session"], ["hour", "Per hour"], ["night", "Per night"], ["walk", "Per walk"], ["visit", "Per visit"], ["from", "Starting from"]]),
              width: "half",
            },
            yesNo("insured", "Insured"),
            ...(country === "GB"
              ? [{ key: "licenceNo", type: "text", label: "Licence No.", placeholder: "Council licence number", width: "half" } satisfies FormFieldDef]
              : []),
          ],
        },
      ];

    case "Accessories":
      return [
        basics,
        {
          title: "Item",
          fields: [
            {
              key: "accessoryCategory",
              type: "select",
              label: "Category",
              required: true,
              options: pairs([
                ["food", "Food & Treats"],
                ["toys", "Toys"],
                ["bedding", "Bedding"],
                ["housing", "Cage & Housing"],
                ["aquarium", "Aquarium & Tank"],
                ["clothing", "Clothing"],
                ["health", "Health & Care"],
                ["grooming", "Grooming"],
                ["travel", "Travel & Carry"],
                ["other", "Other"],
              ]),
            },
            { key: "forAnimals", type: "multiselect", label: "For Animal", required: true, options: PET_TYPES },
            { key: "brand", type: "text", label: "Brand", width: "half" },
            { key: "size", type: "select", label: "Size", options: [...SIZES, { value: "xl", label: "Extra Large" }] },
            { key: "condition", type: "select", label: "Condition", options: pairs([["new", "New"], ["like_new", "Like New"], ["used", "Used"]]) },
            listedBy([["individual", "Individual"], ["shop", "Pet Shop"]], false),
            salePrice("Price", true),
          ],
        },
      ];

    case "Lost & Found":
      return [
        basics,
        {
          title: "Report",
          fields: [
            { key: "reportType", type: "select", label: "Report Type", required: true, options: pairs([["lost", "Lost"], ["found", "Found"]]) },
            { key: "petType", type: "select", label: "Pet Type", required: true, options: PET_TYPES },
            { key: "petName", type: "text", label: "Pet Name", placeholder: "Name it answers to", width: "half" },
            { key: "breed", type: "text", label: "Breed", width: "half" },
            { key: "color", type: "text", label: "Color", width: "half" },
            { key: "gender", type: "select", label: "Gender", options: pairs([["male", "Male"], ["female", "Female"], ["unknown", "Unknown"]]) },
            { key: "size", type: "select", label: "Size", options: SIZES },
            { key: "microchipped", type: "select", label: "Microchipped", options: YES_NO_UNKNOWN },
            { key: "lfDate", type: "date", label: "Last Seen / Found Date", required: true, width: "half" },
            { key: "lastSeenLocation", type: "text", label: "Last Seen / Found Location", required: true },
            { key: "reward", type: "currency", label: "Reward", min: 0, width: "half" },
          ],
        },
      ];

    case "Wanted":
      return [
        basics,
        {
          title: "Looking For",
          fields: [
            {
              key: "lookingTo",
              type: "select",
              label: "Looking To",
              required: true,
              options: pairs([["buy", "Buy"], ["adopt", "Adopt"], ["stud", "Stud / Mate"], ["care", "Pet Care"], ["accessories", "Accessories"]]),
            },
            { key: "wantedPetType", type: "select", label: "Pet Type", required: true, options: PET_TYPES },
            { key: "breedPreference", type: "text", label: "Breed Preference", width: "half" },
            { key: "breedType", type: "select", label: "Breed Type", options: pairs([["pure", "Pure Breed"], ["mixed", "Mixed Breed"], ["any", "Any"]]), width: "half" },
            { key: "agePreference", type: "select", label: "Preferred Age", options: pairs([...AGE_GROUPS, ["any", "Any"]]) },
            { key: "genderPreference", type: "select", label: "Gender Preference", options: pairs([["male", "Male"], ["female", "Female"], ["any", "Any"]]) },
            { key: "sizePreference", type: "select", label: "Size Preference", options: [...SIZES, { value: "any", label: "Any" }] },
            { key: "budget", type: "currency", label: "Budget", min: 0, width: "half" },
          ],
        },
      ];

    default:
      return null;
  }
}
