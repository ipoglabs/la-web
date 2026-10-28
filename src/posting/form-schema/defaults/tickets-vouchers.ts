// Default "Tickets & Vouchers" post-form schemas.
//
// Option values are what the Tickets & Vouchers search filters match
// (components/create-alert/config/tickets-vouchers.ts, lib/postFilterQuery.ts
// TICKETS_FORM_FILTERS). Each sub's kind (event type, sport, retailer,
// activity, voucher type) is `itemType`. Items save the price as `salePrice`,
// the field listing prices and the price filter read.
//
// Tickets ask the event date, so past events drop out of search, and vouchers
// a Valid Until, so expired ones do. UK law (Consumer Rights Act 2015 s.90)
// requires a ticket reseller to give the face value and the seat, so both are
// required in the UK; football tickets there may only be resold through the
// club (Criminal Justice and Public Order Act 1994 s.166), which the Sport
// field's hint says.

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
const text = (key: string, label: string, placeholder?: string, extra: Partial<FormFieldDef> = {}): FormFieldDef => ({ key, type: "text", label, placeholder, width: "half", ...extra });
const yesNo = (key: string, label: string, extra: Partial<FormFieldDef> = {}): FormFieldDef => ({ key, type: "select", label, options: YES_NO, width: "half", ...extra });
const itemType = (label: string, entries: [string, string][]): FormFieldDef => select("itemType", label, entries, { required: true, width: "full" });
const shownFor = (values: string[]) => ({ showWhen: { field: "itemType", in: values } });

const salePrice = (label = "Asking Price", extra: Partial<FormFieldDef> = {}): FormFieldDef => ({ key: "salePrice", type: "currency", label, required: true, min: 1, width: "half", ...extra });
const faceValue = (label: string, extra: Partial<FormFieldDef> = {}): FormFieldDef => ({ key: "faceValue", type: "currency", label, min: 0, width: "half", ...extra });
const validUntil: FormFieldDef = { key: "deadline", type: "date", label: "Valid Until", width: "half", hint: "Leave blank if it never expires." };

const EVENT_TYPES: [string, string][] = [["music", "Music / Concert"], ["festival", "Festival"], ["theatre", "Theatre & Musicals"], ["comedy", "Comedy"], ["exhibition", "Exhibition"], ["family", "Kids & Family"], ["other", "Other"]];
const SPORTS: [string, string][] = [["football", "Football"], ["cricket", "Cricket"], ["tennis", "Tennis"], ["f1", "F1 / Motorsport"], ["boxing", "Boxing / MMA"], ["rugby", "Rugby"], ["other", "Other"]];
const RETAILERS: [string, string][] = [["fashion", "Fashion"], ["electronics", "Electronics"], ["food", "Food & Drink"], ["beauty", "Beauty"], ["travel", "Travel"], ["gaming", "Gaming"], ["entertainment", "Cinema & Entertainment"], ["general", "General / Shopping"]];
const ACTIVITIES: [string, string][] = [["adventure", "Adventure"], ["flying", "Flying & Ballooning"], ["driving", "Driving"], ["spa", "Spa & Wellness"], ["dining", "Fine Dining"], ["cooking", "Cooking"], ["creative", "Creative"], ["other", "Other"]];
const TRAVEL_TYPES: [string, string][] = [["hotel", "Hotel"], ["flight", "Flight"], ["rail", "Rail"], ["package", "Package Holiday"], ["car_hire", "Car Hire"], ["other", "Other"]];

/** Event and sport tickets: when, where, how many, which seats, how they're handed over. */
function ticketSections(kind: FormFieldDef, country: string): FormSection[] {
  const uk = country === "GB";
  return [
    basics,
    {
      title: "Tickets",
      fields: [
        kind,
        { key: "startDate", type: "date", label: "Event Date", required: true, width: "half" },
        { key: "endDate", type: "date", label: "Last Day", width: "half", hint: "Festivals and multi-day events.", ...shownFor(["festival", "tennis", "cricket", "f1"]) },
        text("venue", "Venue", "e.g. O2 Arena, London", { required: true }),
        { key: "quantity", type: "number", label: "Number of Tickets", required: true, min: 1, width: "half" },
        select("seating", "Seating", [["standing", "Standing"], ["seated", "Seated"], ["hospitality", "VIP / Hospitality"]], { required: true }),
        text("seatDetails", "Block / Row / Seat", "e.g. Block 112, Row K, Seats 5–6", uk ? { required: true, hint: "UK law requires the block, row and seat (or standing area) of resold tickets." } : {}),
        select("transferMethod", "Ticket Type", [["official", "Official app transfer (Ticketmaster, AXS…)"], ["eticket", "E-ticket (PDF / mobile)"], ["paper", "Paper ticket"], ["other", "Other"]], { required: true }),
        text("restrictions", "Restrictions", "e.g. ID must match, 18+", { width: "full" }),
      ],
    },
    {
      title: "Price",
      fields: [
        faceValue("Face Value (per ticket)", uk ? { required: true, min: 1, hint: "UK law requires resellers to show the face value." } : {}),
        salePrice("Asking Price (per ticket)"),
        yesNo("negotiable", "Negotiable"),
      ],
    },
  ];
}

/** Gift cards, experiences and travel: who it's with, what it's worth, how long it lasts. */
function voucherSections(title: string, fields: FormFieldDef[], value: FormFieldDef): FormSection[] {
  return [
    basics,
    { title, fields },
    { title: "Price", fields: [value, salePrice(), yesNo("negotiable", "Negotiable")] },
  ];
}

export function ticketsVouchersSections(subcategory: string, country: string): FormSection[] | null {
  switch (subcategory) {
    case "Event Tickets":
      return ticketSections(itemType("Event Type", EVENT_TYPES), country);

    case "Sport Tickets":
      return ticketSections(
        {
          ...itemType("Sport", SPORTS),
          ...(country === "GB" ? { hint: "Football tickets can only be resold through the club's official ticket exchange (UK law)." } : {}),
        },
        country,
      );

    case "Gift Cards":
      return voucherSections(
        "Gift Card",
        [
          text("brand", "Store / Brand", "e.g. John Lewis, Amazon", { required: true }),
          select("itemType", "Retailer Type", RETAILERS, { required: true }),
          select("format", "Format", [["digital", "Digital code"], ["physical", "Physical card"]], { required: true }),
          validUntil,
        ],
        faceValue("Card Balance", { required: true, min: 1 }),
      );

    case "Experience Days":
      return voucherSections(
        "Experience",
        [
          itemType("Activity", ACTIVITIES),
          text("providerName", "Provider", "e.g. Virgin Experience Days"),
          select("forPeople", "For", [["1", "1 person"], ["2", "2 people"], ["group", "Family / Group"]], { required: true }),
          select("format", "Voucher", [["e_voucher", "E-voucher / code"], ["physical", "Physical voucher"], ["booking", "Booking in my name"]]),
          validUntil,
        ],
        faceValue("Original Price"),
      );

    case "Travel Vouchers":
      return voucherSections(
        "Voucher",
        [
          itemType("Type", TRAVEL_TYPES),
          text("providerName", "Airline / Hotel / Operator", "e.g. British Airways, Eurostar", { required: true }),
          select("destination", "Where", [["domestic", "Domestic"], ["short_haul", "Short-haul / Regional"], ["worldwide", "Worldwide / Any route"]]),
          { key: "startDate", type: "date", label: "Travel Date", width: "half", hint: "For a booking on a fixed date." },
          validUntil,
          yesNo("nameChange", "Name Change Allowed", { hint: "Whether the booking can be moved to the buyer's name.", ...shownFor(["flight", "rail", "package"]) }),
          select("format", "Voucher", [["e_voucher", "E-voucher / credit"], ["physical", "Physical voucher"], ["booking", "Booking in my name"]]),
        ],
        faceValue("Original Value"),
      );

    default:
      return null;
  }
}
