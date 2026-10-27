// Default "Travel & Stays" post-form schemas.
//
// Option values are what the Travel & Stays search filters match
// (components/create-alert/config/travel-stays.ts, lib/postFilterQuery.ts
// TRAVEL_FORM_FILTERS). Each sub's Type is `itemType` (Holiday Rentals: the
// `stayType`; Travel Services: `serviceType`). Every price is `salePrice`, the
// field listing prices and the price filter read, with Price Per as
// `priceUnit` for the card suffix ("/ night", "/ person").
//
// Rules sellers must know are in the hints: Singapore homes can't be let for
// under 3 months, Scottish short lets need a licence number in the ad, and UK
// packages with flights need ATOL protection.

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
const multi = (key: string, label: string, entries: [string, string][], extra: Partial<FormFieldDef> = {}): FormFieldDef => ({
  key,
  type: "multiselect",
  label,
  options: pairs(entries),
  ...extra,
});
const text = (key: string, label: string, placeholder?: string): FormFieldDef => ({ key, type: "text", label, placeholder, width: "half" });
const number = (key: string, label: string, extra: Partial<FormFieldDef> = {}): FormFieldDef => ({ key, type: "number", label, min: 1, width: "half", ...extra });
const provider = (label: string, required = false): FormFieldDef => ({ key: "providerName", type: "text", label, required, width: "half" });

/** What a stay offers — the Must Have filter's values. */
const AMENITIES: [string, string][] = [
  ["wifi", "Wi-Fi"], ["ac", "Air Conditioning"], ["parking", "Parking"], ["kitchen", "Kitchen"], ["pool", "Pool"],
  ["hot_tub", "Hot Tub"], ["washer", "Washing Machine"], ["breakfast", "Breakfast"], ["pets", "Pet Friendly"],
];
const amenities = multi("amenities", "Amenities", AMENITIES);

/** Licences tour operators and agents hold in each market. */
const TRAVEL_LICENCE: Record<string, [string, string]> = {
  IN: ["IATA / Ministry of Tourism Approval", "If you hold one."],
  GB: ["ATOL / ABTA Number", "Packages that include flights must be ATOL protected."],
  SG: ["STB Travel Agent Licence No.", "Travel agents selling packages need an STB licence."],
};
const travelLicence = (country: string): FormFieldDef => {
  const [label, hint] = TRAVEL_LICENCE[country] ?? TRAVEL_LICENCE.GB;
  return { key: "travelLicence", type: "text", label, hint, width: "half" };
};

const RENTAL_HINT: Record<string, string> = {
  SG: "Homes in Singapore can't be let for under 3 months; list overseas holiday homes or longer stays.",
  GB: "Scottish short lets: add your short-term let licence number below.",
};

const priceSection = (units: [string, string][], required = true, label = "Price"): FormSection => ({
  title: "Price",
  fields: [
    { key: "salePrice", type: "currency", label, required, min: 0, width: "half", ...(required ? {} : { hint: "Leave empty for Price on request." }) },
    select("priceUnit", "Price Per", units, { required: true }),
  ],
});

/** Graded condition scale (Carousell / Gumtree style), as the other marketplace categories. */
const CONDITION_SCALE: [string, string][] = [
  ["new", "Brand New"],
  ["like-new", "Like New"],
  ["lightly-used", "Lightly Used"],
  ["used", "Well Used"],
  ["heavily-used", "Heavily Used"],
];

export function travelStaysSections(subcategory: string, country: string): FormSection[] | null {
  switch (subcategory) {
    case "Holiday Rentals":
      return [
        basics,
        {
          title: "Stay",
          fields: [
            select("stayType", "Property Type", [["apartment", "Apartment"], ["villa", "Villa"], ["cottage", "Cottage / House"], ["room", "Private Room"], ["caravan", "Caravan / Lodge"], ["other", "Other"]], { required: true, hint: RENTAL_HINT[country] }),
            number("bedrooms", "Bedrooms", { min: 0, required: true }),
            number("guests", "Sleeps", { max: 100 }),
            multi("stayLengths", "Lets", [["nightly", "Nightly"], ["weekend", "Weekends"], ["weekly", "Weekly"], ["monthly", "Monthly"]], { required: true }),
            number("minNights", "Minimum Stay (nights)"),
            text("availability", "Available", "e.g. July–September"),
            amenities,
            provider("Host / Agency Name"),
            ...(country === "GB" ? [text("stLicence", "Short-term Let Licence No.", "Scotland only")] : []),
          ],
        },
        priceSection([["night", "Per night"], ["week", "Per week"], ["month", "Per month"]]),
      ];

    case "Hotels & Guesthouses":
      return [
        basics,
        {
          title: "Stay",
          fields: [
            select("itemType", "Type", [["hotel", "Hotel"], ["guesthouse", "Guesthouse"], ["bnb", "B&B"], ["hostel", "Hostel"], ["homestay", "Homestay"], ["serviced", "Serviced Apartment"], ["resort", "Resort"], ["other", "Other"]], { required: true }),
            select("starRating", "Star Rating", [["5", "5★"], ["4", "4★"], ["3", "3★"], ["2", "2★"], ["1", "1★"], ["unrated", "Not rated"]]),
            multi("roomTypes", "Rooms", [["single", "Single"], ["double", "Double"], ["twin", "Twin"], ["family", "Family"], ["dorm", "Dorm Bed"], ["suite", "Suite"]]),
            { key: "freeCancellation", type: "select", label: "Free Cancellation", options: YES_NO, width: "half" },
            amenities,
            provider("Hotel / Guesthouse Name", true),
          ],
        },
        priceSection([["night", "Per night"], ["week", "Per week"], ["month", "Per month"]]),
      ];

    case "Tour Packages":
      return [
        basics,
        {
          title: "Tour",
          fields: [
            { key: "destination", type: "text", label: "Destination", required: true, width: "half" },
            select("tripScope", "Domestic / International", [["domestic", "Domestic"], ["international", "International"]], { required: true }),
            select("tourType", "Tour Type", [["group", "Group"], ["private", "Private"], ["self", "Self-guided"]], { required: true }),
            number("durationDays", "Days", { required: true }),
            text("departures", "Departure Dates", "e.g. Monthly, or Mar–Apr 2027"),
            multi("inclusions", "Includes", [["flights", "Flights"], ["hotels", "Hotels"], ["meals", "Meals"], ["guide", "Guide"], ["transfers", "Transfers"], ["activities", "Activities & Entry"], ["visa", "Visa"]]),
            { key: "packageDetails", type: "textarea", label: "Itinerary" },
            provider("Tour Operator", true),
            travelLicence(country),
          ],
        },
        priceSection([["person", "Per person"], ["group", "Per group"], ["from", "Starting from"]]),
      ];

    case "Staycations & Day Trips":
      return [
        basics,
        {
          title: "Getaway",
          fields: [
            select("itemType", "Type", [["resort", "Resort / Hotel Stay"], ["glamping", "Glamping"], ["cottage", "Cottage / Cabin"], ["boat", "Boat / Houseboat"], ["spa", "Spa Retreat"], ["daytrip", "Day Trip"], ["other", "Other"]], { required: true }),
            multi("setting", "Setting", [["beach", "Beach"], ["mountains", "Mountains"], ["city", "City"], ["nature", "Countryside & Nature"], ["lake", "Lakes & Rivers"], ["themepark", "Theme Park"]], { required: true }),
            number("nights", "Nights", { min: 0, hint: "0 for a day trip." }),
            number("guests", "For (people)", { max: 100 }),
            multi("inclusions", "Includes", [["breakfast", "Breakfast"], ["meals", "All Meals"], ["spa", "Spa"], ["pool", "Pool"], ["activities", "Activities"], ["transport", "Transport"]]),
            { key: "amenities", type: "multiselect", label: "Good For", options: pairs([["pets", "Pet Friendly"], ["hot_tub", "Hot Tub"], ["parking", "Parking"]]) },
            provider("Host / Venue Name"),
          ],
        },
        priceSection([["package", "Per package"], ["night", "Per night"], ["person", "Per person"]]),
      ];

    case "Travel Services":
      return [
        basics,
        {
          title: "Service",
          fields: [
            select("serviceType", "Service", [["visa", "Visa Assistance"], ["insurance", "Travel Insurance"], ["transfer", "Airport Transfer"], ["car_hire", "Car Hire"], ["tickets", "Ticket Booking"], ["guide", "Tour Guide"], ["itinerary", "Itinerary Planning"], ["other", "Other"]], { required: true }),
            text("countries", "Countries Covered", "e.g. Schengen, US, UK"),
            select("consultationMode", "Mode", [["inperson", "In-person"], ["online", "Online"], ["both", "Both"]]),
            provider("Agency Name", true),
            travelLicence(country),
          ],
        },
        priceSection([["application", "Per application"], ["person", "Per person"], ["trip", "Per trip"], ["day", "Per day"], ["year", "Per year"], ["from", "Starting from"], ["quote", "Price on request"]], false),
      ];

    case "Travel Accessories":
      return [
        basics,
        {
          title: "Item",
          fields: [
            select("itemType", "Type", [["suitcase", "Suitcases & Luggage"], ["backpack", "Travel Backpacks"], ["bags", "Duffels & Bags"], ["packing", "Packing Cubes & Organisers"], ["electronics", "Adaptors & Power Banks"], ["comfort", "Pillows & Comfort"], ["other", "Other"]], { required: true }),
            select("condition", "Condition", CONDITION_SCALE, { required: true }),
            text("brand", "Brand"),
            text("size", "Size / Capacity", "e.g. 55cm, 40L"),
            { key: "cabinSize", type: "select", label: "Cabin Size", options: YES_NO, width: "half" },
          ],
        },
        {
          title: "Price & Delivery",
          fields: [
            { key: "salePrice", type: "currency", label: "Price", required: true, min: 1, width: "half" },
            { key: "negotiable", type: "select", label: "Negotiable", options: YES_NO, width: "half" },
            multi("dealMethod", "Deal Method", [["meetup", "Meet-up / Collection"], ["delivery", "Delivery / Courier"]]),
          ],
        },
      ];

    default:
      return null;
  }
}
