import type { MainCategory } from "../types";

export const travelStays: MainCategory = {
  id: "travel_stays",
  label: "Travel & Stays",
  description: "Holiday rentals, tour packages, and local staycations.",
  icon: "plane",
  iconBg: "bg-cyan-100",
  iconColor: "text-cyan-600",
  subcategories: [
    {
      id: "holiday_rentals",
      label: "Holiday Rentals",
      icon: "home",
      filters: [
        {
          id: "property_type",
          label: "Property Type",
          type: "toggle",
          options: [
            { label: "Apartment", value: "apartment" },
            { label: "Villa",     value: "villa"      },
            { label: "Cottage",   value: "cottage"    },
            { label: "Room",      value: "room"       },
            { label: "Other",     value: "other"      },
          ],
        },
        {
          id: "duration",
          label: "Duration",
          type: "toggle",
          singleSelect: true,
          options: [
            { label: "Any",     value: "any"     },
            { label: "Weekend", value: "weekend" },
            { label: "Weekly",  value: "weekly"  },
            { label: "Monthly", value: "monthly" },
          ],
        },
      ],
    },
    {
      id: "hotels_guesthouses",
      label: "Hotels & Guesthouses",
      icon: "building",
      filters: [
        {
          id: "star_rating",
          label: "Star Rating",
          type: "toggle",
          options: [
            { label: "1★", value: "1" },
            { label: "2★", value: "2" },
            { label: "3★", value: "3" },
            { label: "4★", value: "4" },
            { label: "5★", value: "5" },
          ],
        },
      ],
    },
    {
      id: "tour_packages",
      label: "Tour Packages",
      icon: "map",
      filters: [
        {
          id: "tour_type",
          label: "Tour Type",
          type: "toggle",
          options: [
            { label: "Group",   value: "group"   },
            { label: "Private", value: "private" },
            { label: "Self-guided", value: "self" },
          ],
        },
        {
          id: "destination",
          label: "Destination",
          type: "toggle",
          options: [
            { label: "Domestic",       value: "domestic"       },
            { label: "International",  value: "international"  },
          ],
        },
      ],
    },
    {
      id: "staycations",
      label: "Staycations & Day Trips",
      icon: "sun",
      filters: [
        {
          id: "activity",
          label: "Activity",
          type: "toggle",
          options: [
            { label: "Beach",      value: "beach"      },
            { label: "Mountains",  value: "mountains"  },
            { label: "City",       value: "city"       },
            { label: "Nature",     value: "nature"     },
            { label: "Theme Park", value: "themepark"  },
          ],
        },
      ],
    },
    {
      id: "travel_services",
      label: "Travel Services",
      icon: "globe",
      filters: [
        {
          id: "service_type",
          label: "Service",
          type: "toggle",
          options: [
            { label: "Visa Assistance",  value: "visa"       },
            { label: "Travel Insurance", value: "insurance"  },
            { label: "Airport Transfer", value: "transfer"   },
            { label: "Car Hire",         value: "car_hire"   },
          ],
        },
      ],
    },
    {
      id: "travel_accessories",
      label: "Travel Accessories",
      icon: "luggage",
      filters: [
        {
          id: "condition",
          label: "Condition",
          type: "toggle",
          singleSelect: true,
          options: [
            { label: "Any",  value: "any"  },
            { label: "New",  value: "new"  },
            { label: "Used", value: "used" },
          ],
        },
      ],
    },
  ],
};
