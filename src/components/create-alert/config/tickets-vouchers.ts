import type { MainCategory } from "../types";

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
          options: [
            { label: "Music / Concert", value: "music"     },
            { label: "Theatre",         value: "theatre"   },
            { label: "Comedy",          value: "comedy"    },
            { label: "Festival",        value: "festival"  },
            { label: "Exhibition",      value: "exhibition"},
            { label: "Other",           value: "other"     },
          ],
        },
        {
          id: "date_scope",
          label: "When",
          type: "toggle",
          singleSelect: true,
          options: [
            { label: "Any",        value: "any"     },
            { label: "This Week",  value: "week"    },
            { label: "This Month", value: "month"   },
            { label: "3 Months+",  value: "3months" },
          ],
        },
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
          options: [
            { label: "Football",   value: "football"  },
            { label: "Cricket",    value: "cricket"   },
            { label: "Tennis",     value: "tennis"    },
            { label: "F1 / Motorsport", value: "f1"  },
            { label: "Boxing / MMA",    value: "boxing"},
            { label: "Rugby",      value: "rugby"     },
            { label: "Other",      value: "other"     },
          ],
        },
        {
          id: "date_scope",
          label: "When",
          type: "toggle",
          singleSelect: true,
          options: [
            { label: "Any",        value: "any"     },
            { label: "This Week",  value: "week"    },
            { label: "This Month", value: "month"   },
            { label: "3 Months+",  value: "3months" },
          ],
        },
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
          options: [
            { label: "Fashion",     value: "fashion"     },
            { label: "Electronics", value: "electronics" },
            { label: "Food & Drink",value: "food"        },
            { label: "Beauty",      value: "beauty"      },
            { label: "Travel",      value: "travel"      },
            { label: "Gaming",      value: "gaming"      },
            { label: "General",     value: "general"     },
          ],
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
          options: [
            { label: "Adventure",  value: "adventure" },
            { label: "Spa & Wellness", value: "spa"   },
            { label: "Fine Dining",value: "dining"    },
            { label: "Driving",    value: "driving"   },
            { label: "Cooking",    value: "cooking"   },
            { label: "Creative",   value: "creative"  },
            { label: "Other",      value: "other"     },
          ],
        },
      ],
    },
    {
      id: "travel_vouchers",
      label: "Travel Vouchers",
      icon: "plane",
      filters: [
        {
          id: "destination",
          label: "Destination",
          type: "toggle",
          singleSelect: true,
          options: [
            { label: "Any",           value: "any"           },
            { label: "Domestic",      value: "domestic"      },
            { label: "Europe",        value: "europe"        },
            { label: "Worldwide",     value: "worldwide"     },
          ],
        },
        {
          id: "voucher_type",
          label: "Type",
          type: "toggle",
          options: [
            { label: "Hotel",    value: "hotel"    },
            { label: "Flight",   value: "flight"   },
            { label: "Package",  value: "package"  },
            { label: "Car Hire", value: "car_hire" },
            { label: "Other",    value: "other"    },
          ],
        },
      ],
    },
  ],
};
