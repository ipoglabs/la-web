import type { CategoryItem } from "./types";

export const ticketsVouchers: CategoryItem = {
  id: "tickets_vouchers",
  label: "Tickets & Vouchers",
  description: "Event tickets, sport tickets, gift cards, and experience days.",
  color: "violet",
  cardIcon: "ticket",
  subcategories: [
  { id: "event_tickets", label: "Event Tickets" },
  { id: "sport_tickets", label: "Sport Tickets" },
  { id: "gift_cards", label: "Gift Cards" },
  { id: "experience_days", label: "Experience Days" },
  { id: "travel_vouchers", label: "Travel Vouchers" },
  ],
};