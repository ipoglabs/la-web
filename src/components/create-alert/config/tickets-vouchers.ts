import type { FilterConfig, FilterOption, MainCategory } from "../types";

// Option values are the Tickets & Vouchers forms' (posting/form-schema/defaults/tickets-vouchers.ts):
// each sub's kind is `itemType`; When reads the Event Date
// (lib/postFilterQuery.ts TICKETS_FORM_FILTERS, buildTicketsClauses).

const opts = (entries: [string, string][]): FilterOption[] => entries.map(([value, label]) => ({ label, value }));

const when: FilterConfig = {
  id: "date_scope",
  label: "When",
  type: "toggle",
  singleSelect: true,
  options: opts([["any", "Any"], ["week", "Next 7 Days"], ["month", "Next 30 Days"], ["3months", "Next 3 Months"]]),
};

const seating: FilterConfig = {
  id: "seating",
  label: "Seating",
  type: "toggle",
  options: opts([["standing", "Standing"], ["seated", "Seated"], ["hospitality", "VIP / Hospitality"]]),
};

const official: FilterConfig = {
  id: "transfer",
  label: "Ticket Type",
  type: "toggle",
  singleSelect: true,
  options: opts([["official", "Official app transfer only"]]),
};

export const ticketsVouchers: MainCategory = {
  id: "tickets_vouchers",
  label: "Tickets & Vouchers",
  description: "Event tickets, sport tickets, gift cards, and experience days.",
  icon: "ticket",
  iconBg: "bg-rose-100",
  iconColor: "text-rose-600",
  subcategories: [
    {
      id: "event_tickets",
      label: "Event Tickets",
      icon: "calendar",
      filters: [
        {
          id: "event_type",
          label: "Event Type",
          type: "toggle",
          options: opts([["music", "Music / Concert"], ["festival", "Festival"], ["theatre", "Theatre & Musicals"], ["comedy", "Comedy"], ["exhibition", "Exhibition"], ["family", "Kids & Family"], ["other", "Other"]]),
        },
        when,
        seating,
        official,
      ],
    },
    {
      id: "sport_tickets",
      label: "Sport Tickets",
      icon: "trophy",
      filters: [
        {
          id: "sport",
          label: "Sport",
          type: "toggle",
          options: opts([["football", "Football"], ["cricket", "Cricket"], ["tennis", "Tennis"], ["f1", "F1 / Motorsport"], ["boxing", "Boxing / MMA"], ["rugby", "Rugby"], ["other", "Other"]]),
        },
        when,
        seating,
        official,
      ],
    },
    {
      id: "gift_cards",
      label: "Gift Cards",
      icon: "gift",
      filters: [
        {
          id: "retailer_type",
          label: "Retailer",
          type: "toggle",
          options: opts([["fashion", "Fashion"], ["electronics", "Electronics"], ["food", "Food & Drink"], ["beauty", "Beauty"], ["travel", "Travel"], ["gaming", "Gaming"], ["entertainment", "Cinema & Entertainment"], ["general", "General / Shopping"]]),
        },
        {
          id: "format",
          label: "Format",
          type: "toggle",
          options: opts([["digital", "Digital code"], ["physical", "Physical card"]]),
        },
      ],
    },
    {
      id: "experience_days",
      label: "Experience Days",
      icon: "star",
      filters: [
        {
          id: "activity",
          label: "Activity",
          type: "toggle",
          options: opts([["adventure", "Adventure"], ["flying", "Flying & Ballooning"], ["driving", "Driving"], ["spa", "Spa & Wellness"], ["dining", "Fine Dining"], ["cooking", "Cooking"], ["creative", "Creative"], ["other", "Other"]]),
        },
        {
          id: "for_people",
          label: "For",
          type: "toggle",
          options: opts([["1", "1 person"], ["2", "2 people"], ["group", "Family / Group"]]),
        },
      ],
    },
    {
      id: "travel_vouchers",
      label: "Travel Vouchers",
      icon: "plane",
      filters: [
        {
          id: "voucher_type",
          label: "Type",
          type: "toggle",
          options: opts([["hotel", "Hotel"], ["flight", "Flight"], ["rail", "Rail"], ["package", "Package Holiday"], ["car_hire", "Car Hire"], ["other", "Other"]]),
        },
        {
          id: "destination",
          label: "Where",
          type: "toggle",
          options: opts([["domestic", "Domestic"], ["short_haul", "Short-haul / Regional"], ["worldwide", "Worldwide / Any route"]]),
        },
      ],
    },
  ],
};
