// src/posting/config/categories/specialOffers.ts
import type { FieldSpec } from "./types";

const offerCommon: FieldSpec[] = [
  { key: "description", type: "string", label: "Offer Details" },
  { key: "deadline", type: "date", label: "Valid Until" },
];

export const specialOffersConfig: Record<string, FieldSpec[]> = {
  banking: offerCommon,
  travel: [
    { key: "destination", type: "string", label: "Destination" },
    { key: "packageDetails", type: "string", label: "Package Details" },
    { key: "durationText", type: "string", label: "Duration" },
    { key: "price", type: "currency", label: "Price (₹)" },
    ...offerCommon,
  ],
  retail: offerCommon,
  food: offerCommon,
  electronics: offerCommon,
  health: offerCommon,
  education: offerCommon,
  holiday: offerCommon,
  entertainment: offerCommon,
  home: offerCommon,
  automotive: offerCommon,
  misc: offerCommon,
};
