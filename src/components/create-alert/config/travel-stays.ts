import type { FilterConfig, FilterOption, MainCategory } from "../types";

// Option values are the Travel & Stays forms' (posting/form-schema/defaults/travel-stays.ts):
// each sub's Type is `itemType` (Holiday Rentals: `stayType`; Travel Services:
// `serviceType`). Bedrooms is a minimum; Must Have and Includes need every
// option picked (lib/postFilterQuery.ts TRAVEL_FORM_FILTERS, buildTravelClauses).

const opts = (entries: [string, string][]): FilterOption[] => entries.map(([value, label]) => ({ label, value }));

const mustHave: FilterConfig = {
  id: "amenities",
  label: "Must Have",
  type: "toggle",
  options: opts([["wifi", "Wi-Fi"], ["ac", "Air Conditioning"], ["parking", "Parking"], ["kitchen", "Kitchen"], ["pool", "Pool"], ["hot_tub", "Hot Tub"], ["breakfast", "Breakfast"], ["pets", "Pet Friendly"]]),
};

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
          options: opts([["apartment", "Apartment"], ["villa", "Villa"], ["cottage", "Cottage / House"], ["room", "Private Room"], ["caravan", "Caravan / Lodge"], ["other", "Other"]]),
        },
        {
          id: "bedrooms",
          label: "Bedrooms",
          type: "toggle",
          singleSelect: true,
          options: opts([["any", "Any"], ["1", "1+"], ["2", "2+"], ["3", "3+"], ["4", "4+"]]),
        },
        {
          id: "duration",
          label: "Lets",
          type: "toggle",
          singleSelect: true,
          options: opts([["any", "Any"], ["nightly", "Nightly"], ["weekend", "Weekends"], ["weekly", "Weekly"], ["monthly", "Monthly"]]),
        },
        mustHave,
      ],
    },
    {
      id: "hotels_guesthouses",
      label: "Hotels & Guesthouses",
      icon: "building",
      filters: [
        {
          id: "type",
          label: "Type",
          type: "toggle",
          options: opts([["hotel", "Hotel"], ["guesthouse", "Guesthouse"], ["bnb", "B&B"], ["hostel", "Hostel"], ["homestay", "Homestay"], ["serviced", "Serviced Apartment"], ["resort", "Resort"], ["other", "Other"]]),
        },
        {
          id: "star_rating",
          label: "Star Rating",
          type: "toggle",
          options: opts([["1", "1★"], ["2", "2★"], ["3", "3★"], ["4", "4★"], ["5", "5★"]]),
        },
        {
          id: "free_cancellation",
          label: "Free Cancellation",
          type: "toggle",
          singleSelect: true,
          options: opts([["yes", "Free cancellation"]]),
        },
        mustHave,
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
          options: opts([["group", "Group"], ["private", "Private"], ["self", "Self-guided"]]),
        },
        {
          id: "destination",
          label: "Destination",
          type: "toggle",
          singleSelect: true,
          options: opts([["domestic", "Domestic"], ["international", "International"]]),
        },
        {
          id: "includes",
          label: "Includes",
          type: "toggle",
          options: opts([["flights", "Flights"], ["hotels", "Hotels"], ["meals", "Meals"], ["guide", "Guide"], ["transfers", "Transfers"]]),
        },
      ],
    },
    {
      id: "staycations",
      label: "Staycations & Day Trips",
      icon: "sun",
      filters: [
        {
          id: "type",
          label: "Type",
          type: "toggle",
          options: opts([["resort", "Resort / Hotel Stay"], ["glamping", "Glamping"], ["cottage", "Cottage / Cabin"], ["boat", "Boat / Houseboat"], ["spa", "Spa Retreat"], ["daytrip", "Day Trip"], ["other", "Other"]]),
        },
        {
          id: "activity",
          label: "Setting",
          type: "toggle",
          options: opts([["beach", "Beach"], ["mountains", "Mountains"], ["city", "City"], ["nature", "Countryside & Nature"], ["lake", "Lakes & Rivers"], ["themepark", "Theme Park"]]),
        },
        {
          id: "pets",
          label: "Pets",
          type: "toggle",
          singleSelect: true,
          options: opts([["pets", "Pet friendly"]]),
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
          options: opts([["visa", "Visa Assistance"], ["insurance", "Travel Insurance"], ["transfer", "Airport Transfer"], ["car_hire", "Car Hire"], ["tickets", "Ticket Booking"], ["guide", "Tour Guide"], ["itinerary", "Itinerary Planning"], ["other", "Other"]]),
        },
      ],
    },
    {
      id: "travel_accessories",
      label: "Travel Accessories",
      icon: "luggage",
      filters: [
        {
          id: "type",
          label: "Type",
          type: "toggle",
          options: opts([["suitcase", "Suitcases & Luggage"], ["backpack", "Travel Backpacks"], ["bags", "Duffels & Bags"], ["packing", "Packing Cubes & Organisers"], ["electronics", "Adaptors & Power Banks"], ["comfort", "Pillows & Comfort"], ["other", "Other"]]),
        },
        {
          id: "condition",
          label: "Condition",
          type: "toggle",
          options: opts([["new", "Brand New"], ["like-new", "Like New"], ["lightly-used", "Lightly Used"], ["used", "Well Used"], ["heavily-used", "Heavily Used"]]),
        },
        {
          id: "cabin_size",
          label: "Cabin Size",
          type: "toggle",
          singleSelect: true,
          options: opts([["yes", "Cabin size"]]),
        },
        {
          id: "delivery",
          label: "Delivery",
          type: "toggle",
          singleSelect: true,
          options: opts([["delivery", "Delivery available"]]),
        },
      ],
    },
  ],
};
