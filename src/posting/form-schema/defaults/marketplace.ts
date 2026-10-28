// Default post-form schemas for the categories promoted out of the old
// "For Sale" bucket that haven't had their own review yet (Tickets &
// Vouchers). The others now have their own defaults/<category>.ts.

import type { FormFieldDef, FormSection } from "../types";
import { basics } from "./shared";

// ── Reusable fields ──────────────────────────────────────────────────────────
const price = (label = "Price", required = true): FormFieldDef => ({
  key: "price",
  type: "currency",
  label,
  required,
  min: required ? 1 : 0,
  width: "half",
});
const providerName: FormFieldDef = { key: "providerName", type: "text", label: "Business / Provider Name", width: "half" };

// ── Categories ───────────────────────────────────────────────────────────────
type Builder = (subcategory: string) => FormSection[] | null;

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
  "Tickets & Vouchers": tickets,
};
