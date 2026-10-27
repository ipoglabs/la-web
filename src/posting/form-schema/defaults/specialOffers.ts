// Default "Special Offers" post-form schemas.
//
// Option values are what the Special Offers search filters match
// (components/create-alert/config/special-offers.ts, lib/postFilterQuery.ts
// SPECIAL_OFFERS_FORM_FILTERS). Every sub saves what the offer is for as
// `itemType`, the kind of deal as `dealType`, where it is redeemed as
// `redemption` and the percentage off as `discountPct` (the Min Discount
// filter). The offer price is `salePrice`, the field listing prices and the
// price filter read; an offer with no price (cashback, free trial) leaves it
// empty. Who can use it is `offerFor`; when an upcoming offer starts is
// `offerStarts` (the card shows it until then).

import type { FormFieldDef, FormSection } from "../types";
import { basics, pairs } from "./shared";

const select = (key: string, label: string, entries: [string, string][], extra: Partial<FormFieldDef> = {}): FormFieldDef => ({
  key,
  type: "select",
  label,
  options: pairs(entries),
  width: "half",
  ...extra,
});
const multi = (key: string, label: string, entries: [string, string][]): FormFieldDef => ({ key, type: "multiselect", label, options: pairs(entries) });
const text = (key: string, label: string, placeholder?: string): FormFieldDef => ({ key, type: "text", label, placeholder, width: "half" });
const itemType = (label: string, entries: [string, string][]): FormFieldDef => select("itemType", label, entries, { required: true, width: "full" });
const provider = (label = "Business Name"): FormFieldDef => text("providerName", label);

/** Kinds of deal — the Deal Type filter's values. */
export const DEAL_TYPES: [string, string][] = [
  ["pct_off", "% Off"],
  ["flat_off", "Flat Amount Off"],
  ["bogo", "Buy 1 Get 1"],
  ["bundle", "Bundle"],
  ["flash", "Flash Sale"],
  ["cashback", "Cashback"],
  ["voucher", "Voucher / Coupon"],
  ["free_gift", "Free Gift"],
  ["free_trial", "Free Trial"],
  ["free_delivery", "Free Delivery"],
  ["special_rate", "Special Rate"],
  ["tradein", "Trade-in / Exchange"],
  ["instalments", "0% Instalments"],
];

/** Who can use an offer — the Who Can Use It filter's values. */
export const OFFER_FOR: [string, string][] = [
  ["all", "Everyone"],
  ["new", "New customers only"],
  ["members", "Members only"],
];

/** The deal itself — the same block on every offer. */
const offerSection: FormSection = {
  title: "Offer",
  fields: [
    select("dealType", "Deal Type", DEAL_TYPES, { required: true, width: "full", display: "dropdown" }),
    { key: "discountPct", type: "number", label: "Discount", unit: "% off", min: 1, max: 100, width: "half", hint: "Leave empty if the deal isn't a percentage off." },
    { key: "salePrice", type: "currency", label: "Offer Price", min: 0, width: "half", hint: "What the buyer pays, if the offer has a price." },
    { key: "originalPrice", type: "currency", label: "Was", min: 0, width: "half" },
    { key: "minSpend", type: "currency", label: "Minimum Spend", min: 0, width: "half", hint: "Leave empty if there is none." },
    select("redemption", "Redeem At", [["instore", "In-store"], ["online", "Online"], ["both", "Both"]], { required: true }),
    select("offerFor", "Who Can Use It", OFFER_FOR, { required: true }),
    { key: "couponCode", type: "text", label: "Coupon Code", width: "half" },
    { key: "offerStarts", type: "date", label: "Starts On", width: "half", hint: "Only for an offer that hasn't started yet." },
    { key: "deadline", type: "date", label: "Valid Until", required: true, width: "half" },
    { key: "website", type: "text", label: "Website / Booking Link", placeholder: "https://", format: "url" },
    { key: "terms", type: "textarea", label: "Terms & Conditions" },
  ],
};

const IN_PERSON_ONLINE_HYBRID: [string, string][] = [["inperson", "In-person"], ["online", "Online"], ["hybrid", "Hybrid"]];

/** Occasions each market celebrates, in its own words. */
const OCCASIONS: Record<string, [string, string][]> = {
  IN: [["diwali", "Diwali"], ["eid", "Eid"], ["christmas", "Christmas"], ["newyear", "New Year"], ["national", "Independence Day"], ["valentines", "Valentine's"], ["backtoschool", "Back to School"], ["summer", "Summer Sale"], ["midyear", "Mid-Year Sale"], ["yearend", "Year-End Sale"], ["other", "Other"]],
  GB: [["christmas", "Christmas"], ["newyear", "New Year"], ["blackfriday", "Black Friday"], ["easter", "Easter"], ["eid", "Eid"], ["diwali", "Diwali"], ["cny", "Chinese New Year"], ["valentines", "Valentine's"], ["backtoschool", "Back to School"], ["summer", "Summer Sale"], ["midyear", "Mid-Year Sale"], ["yearend", "Year-End Sale"], ["other", "Other"]],
  SG: [["cny", "Chinese New Year"], ["eid", "Hari Raya"], ["diwali", "Deepavali"], ["christmas", "Christmas"], ["newyear", "New Year"], ["national", "National Day"], ["valentines", "Valentine's"], ["backtoschool", "Back to School"], ["summer", "Great Singapore Sale"], ["midyear", "Mid-Year Sale"], ["yearend", "Year-End Sale"], ["other", "Other"]],
};

export const SPECIAL_OFFERS_SUBCATEGORIES = [
  "Banking & Finance",
  "Travel & Tourism",
  "Retail & Shopping",
  "Food & Dining",
  "Electronics & Gadgets",
  "Health & Wellness",
  "Education & Learning",
  "Holiday & Seasonal Offers",
  "Entertainment",
  "Home & Living",
  "Automotive",
  "Miscellaneous",
];

export function specialOffersSections(subcategory: string, country: string): FormSection[] | null {
  const offer = (title: string, fields: FormFieldDef[]): FormSection[] => [basics, { title, fields }, offerSection];

  switch (subcategory) {
    case "Banking & Finance":
      return offer("Product", [
        itemType("Product", [["credit_card", "Credit Card"], ["loan", "Loan"], ["insurance", "Insurance"], ["savings", "Savings Account"], ["investment", "Investment"], ["current_account", "Current / Business Account"], ["other", "Other"]]),
        provider("Bank / Financial Institution"),
        text("interestRate", "Interest Rate / Returns", "e.g. 5.2% AER"),
        text("tenure", "Tenure", "e.g. 24 months"),
        { key: "minBudget", type: "currency", label: "Minimum Amount", min: 0, width: "half" },
        { key: "maxBudget", type: "currency", label: "Maximum Amount", min: 0, gteField: "minBudget", width: "half" },
        { key: "eligibility", type: "textarea", label: "Eligibility Criteria" },
        { key: "documents", type: "textarea", label: "Required Documents" },
      ]);

    case "Travel & Tourism":
      return offer("Trip", [
        itemType("Type", [["flights", "Flights"], ["hotels", "Hotels"], ["packages", "Holiday Packages"], ["activities", "Activities & Tours"], ["car_rental", "Car Rental"], ["cruise", "Cruise"], ["other", "Other"]]),
        text("destination", "Destination"),
        text("durationText", "Duration", "e.g. 5 nights"),
        { key: "startDate", type: "date", label: "Travel From", width: "half" },
        { key: "endDate", type: "date", label: "Travel To", width: "half" },
        { key: "packageDetails", type: "textarea", label: "What's Included" },
        provider("Agency / Airline / Hotel"),
      ]);

    case "Retail & Shopping":
      return offer("Shop", [
        itemType("Category", [["fashion", "Fashion"], ["electronics", "Electronics"], ["home", "Home & Living"], ["beauty", "Beauty"], ["sports", "Sports"], ["kids", "Kids"], ["groceries", "Groceries"], ["other", "Other"]]),
        provider("Store / Brand"),
        text("returnPolicy", "Return Policy"),
      ]);

    case "Food & Dining":
      return offer("Venue", [
        itemType("Cuisine", [["local", "Local"], ["asian", "Asian"], ["western", "Western"], ["fusion", "Fusion"], ["fast_food", "Fast Food"], ["cafe", "Café"], ["buffet", "Buffet"], ["other", "Other"]]),
        multi("mealType", "Available For", [["dinein", "Dine-in"], ["takeaway", "Takeaway"], ["delivery", "Delivery"]]),
        provider("Restaurant / Business Name"),
        text("openingHours", "Opening Hours", "e.g. Mon–Fri 12pm–3pm"),
      ]);

    case "Electronics & Gadgets":
      return offer("Product", [
        itemType("Product", [["phone", "Phone"], ["laptop", "Laptop"], ["tv", "TV"], ["camera", "Camera"], ["gaming", "Gaming"], ["smart_home", "Smart Home"], ["audio", "Audio"], ["wearable", "Wearable"], ["other", "Other"]]),
        provider("Store / Brand"),
        text("brand", "Brand"),
        select("condition", "Condition", [["new", "New"], ["refurbished", "Refurbished"], ["used", "Used"]]),
        text("warranty", "Warranty", "e.g. 1 year"),
      ]);

    case "Health & Wellness":
      return offer("Service", [
        itemType("Type", [["gym", "Gym"], ["classes", "Yoga & Fitness Classes"], ["spa", "Spa & Massage"], ["salon", "Salon"], ["dental", "Dental"], ["optical", "Optical"], ["pharmacy", "Pharmacy"], ["medical", "Medical"], ["mental_health", "Mental Health"], ["other", "Other"]]),
        provider("Provider Name"),
        select("consultationMode", "Mode", [["in-person", "In Person"], ["online", "Online"], ["both", "Both"]]),
        text("qualification", "Certifications"),
      ]);

    case "Education & Learning":
      return offer("Course", [
        itemType("Category", [["languages", "Languages"], ["tech", "Tech & Coding"], ["arts", "Arts & Music"], ["professional", "Professional"], ["school", "School Subjects"], ["kids", "Kids Programs"], ["online", "Online Courses"], ["test_prep", "Test Prep"], ["other", "Other"]]),
        select("mode", "Format", IN_PERSON_ONLINE_HYBRID),
        provider("Institution / Provider"),
        text("durationText", "Duration", "e.g. 1 day, 12 months"),
      ]);

    case "Holiday & Seasonal Offers":
      return offer("Occasion", [
        select("occasion", "Occasion", OCCASIONS[country] ?? OCCASIONS.IN, { required: true }),
        select("itemType", "Category", [["shopping", "Shopping"], ["home", "Home & Garden"], ["travel", "Travel"], ["dining", "Dining"], ["entertainment", "Entertainment"], ["gifts", "Gifts"], ["other", "Other"]], { required: true }),
        provider(),
        { key: "startDate", type: "date", label: "Sale Starts", width: "half" },
      ]);

    case "Entertainment":
      return offer("Event", [
        itemType("Type", [["movies", "Movies"], ["concerts", "Concerts"], ["theatre", "Theatre & Shows"], ["theme_parks", "Theme Parks"], ["sports", "Sports Events"], ["gaming", "Gaming"], ["museum", "Museums & Attractions"], ["escape_room", "Escape Room"], ["streaming", "Streaming"], ["other", "Other"]]),
        select("mode", "Format", [["inperson", "In-person"], ["online", "Online"]]),
        provider("Organiser / Venue"),
        { key: "startDate", type: "date", label: "Event Date", width: "half" },
        text("workingHours", "Timings", "e.g. 7pm – 10pm"),
        select("ageRestriction", "Age Restriction", [["all", "All Ages"], ["13+", "13+"], ["18+", "18+"], ["21+", "21+"]]),
      ]);

    case "Home & Living":
      return offer("Product", [
        itemType("Category", [["furniture", "Furniture"], ["appliances", "Appliances"], ["decor", "Decor"], ["bedding", "Bedding"], ["kitchenware", "Kitchenware"], ["gardening", "Gardening"], ["smart_home", "Smart Home"], ["renovation", "Renovation"], ["cleaning", "Cleaning"], ["other", "Other"]]),
        provider("Store / Brand"),
        text("warranty", "Warranty"),
      ]);

    case "Automotive":
      return offer("Service", [
        itemType("Service", [["workshop", "Workshop & Servicing"], ["wash", "Car Wash & Detailing"], ["tyre", "Tyres & Rims"], ["insurance", "Insurance"], ["accessories", "Accessories"], ["ev_charging", "EV Charging"], ["vehicle", "Vehicle Purchase"], ["other", "Other"]]),
        multi("forVehicle", "For Vehicle", [["car", "Car"], ["motorcycle", "Motorcycle"], ["van", "Van"], ["truck", "Truck"]]),
        provider("Garage / Dealer"),
        { ...text("make", "Make"), showWhen: { field: "itemType", in: ["vehicle"] } },
        { ...text("model", "Model"), showWhen: { field: "itemType", in: ["vehicle"] } },
      ]);

    case "Miscellaneous":
      return offer("Offer Details", [
        itemType("Category", [["pet_care", "Pet Care"], ["printing", "Printing"], ["photography", "Photography"], ["gifts", "Gifts"], ["subscription", "Subscriptions"], ["other", "Other"]]),
        provider(),
      ]);

    default:
      return null;
  }
}
