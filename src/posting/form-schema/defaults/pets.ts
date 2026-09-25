// Default "Pets" post-form schemas — mirror components/form/pet/*.

import type { FormFieldDef, FormSection } from "../types";
import { basics, pairs } from "./shared";

const PET_TYPES = pairs([
  ["dog", "Dog"],
  ["cat", "Cat"],
  ["bird", "Bird"],
  ["fish", "Fish"],
  ["rabbit", "Rabbit"],
  ["other", "Other"],
]);
const SIZES = pairs([
  ["small", "Small"],
  ["medium", "Medium"],
  ["large", "Large"],
]);

const petProfile: FormFieldDef[] = [
  { key: "petType", type: "select", label: "Pet Type", required: true, options: PET_TYPES },
  { key: "breed", type: "text", label: "Breed", width: "half" },
  { key: "age", type: "text", label: "Age", placeholder: "e.g. 3 months", width: "half" },
  { key: "gender", type: "select", label: "Gender", options: pairs([["male", "Male"], ["female", "Female"]]) },
  { key: "size", type: "select", label: "Size", options: SIZES },
  {
    key: "vaccination",
    type: "select",
    label: "Vaccination",
    options: pairs([["vaccinated", "Vaccinated"], ["partial", "Partially Vaccinated"], ["not_vaccinated", "Not Vaccinated"]]),
  },
];

export const PETS_SUBCATEGORIES = ["For Sale", "Adoption", "Pet Care", "Accessories", "Lost & Found", "Wanted"];

export function petsSections(subcategory: string): FormSection[] | null {
  switch (subcategory) {
    case "For Sale":
      return [
        basics,
        { title: "Pet", fields: [...petProfile, { key: "price", type: "currency", label: "Price", required: true, min: 1, width: "half" }] },
      ];

    case "Adoption":
      return [
        basics,
        {
          title: "Pet",
          fields: [
            { key: "petName", type: "text", label: "Pet Name", width: "half" },
            ...petProfile,
            { key: "price", type: "currency", label: "Adoption Fee", min: 0, width: "half" },
          ],
        },
      ];

    case "Pet Care":
      return [
        basics,
        {
          title: "Service",
          fields: [
            {
              key: "serviceType",
              type: "select",
              label: "Service Type",
              required: true,
              options: pairs([["grooming", "Grooming"], ["training", "Training"], ["boarding", "Boarding"], ["walking", "Walking"], ["vet", "Vet"], ["other", "Other"]]),
            },
            { key: "petType", type: "select", label: "Pet Type", options: PET_TYPES },
            { key: "serviceProviderName", type: "text", label: "Service Provider Name", width: "half" },
            { key: "experience", type: "text", label: "Experience", placeholder: "e.g. 5 years", width: "half" },
            { key: "availability", type: "text", label: "Availability", required: true, width: "half" },
            { key: "price", type: "currency", label: "Price", required: true, min: 1, width: "half" },
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
              key: "partsCategory",
              type: "select",
              label: "Category",
              required: true,
              options: pairs([["food", "Food"], ["toys", "Toys"], ["bedding", "Bedding"], ["grooming", "Grooming"], ["cage", "Cage / Tank"], ["others", "Others"]]),
            },
            { key: "brand", type: "text", label: "Brand", width: "half" },
            { key: "condition", type: "select", label: "Condition", options: pairs([["new", "New"], ["gentlyUsed", "Gently Used"], ["used", "Used"]]) },
            { key: "price", type: "currency", label: "Price", required: true, min: 1, width: "half" },
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
            { key: "breed", type: "text", label: "Breed", width: "half" },
            { key: "color", type: "text", label: "Color", width: "half" },
            { key: "lfDate", type: "date", label: "Last Seen / Found Date", required: true, width: "half" },
            { key: "lastSeenLocation", type: "text", label: "Last Seen Location", required: true },
          ],
        },
      ];

    case "Wanted":
      return [
        basics,
        {
          title: "Looking For",
          fields: [
            { key: "wantedPetType", type: "select", label: "Type of Pet Wanted", required: true, options: PET_TYPES },
            { key: "breedPreference", type: "text", label: "Breed Preference", width: "half" },
            { key: "agePreference", type: "text", label: "Preferred Age", width: "half" },
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
