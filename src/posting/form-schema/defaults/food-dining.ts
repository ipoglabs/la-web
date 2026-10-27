// Default "Food & Dining" post-form schemas.
//
// Option values are what the Food & Dining search filters match
// (components/create-alert/config/food-dining.ts, lib/postFilterQuery.ts
// FOOD_FORM_FILTERS). Every sub asks the cuisines as `cuisines` (each
// market's own list), dietary as `dietaryOptions`, and how food reaches the
// buyer as `dealMethod` (collection / delivery). The price is `salePrice`,
// the field listing prices and the price filter read, with Price Per as
// `priceUnit` for the card suffix.
//
// Food sellers need a licence or registration in each market (FSSAI in
// India, council registration in the UK, SFA in Singapore — home-based
// businesses there are exempt), and UK buyers look for the Food Hygiene
// Rating, so the kitchen section asks for them.

import type { FormFieldDef, FormSection } from "../types";
import { basics, pairs, YES_NO } from "./shared";
import { DEAL_TYPES } from "./specialOffers";

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

/** Cuisines each market's buyers search for, in its own words — the Cuisine filter's values. */
export const CUISINES: Record<string, [string, string][]> = {
  IN: [["north_indian", "North Indian"], ["south_indian", "South Indian"], ["mughlai", "Mughlai / Biryani"], ["chinese", "Chinese / Indo-Chinese"], ["japanese", "Japanese"], ["korean", "Korean"], ["thai", "Thai"], ["western", "Continental"], ["american", "American / Burgers"], ["italian", "Italian"], ["middle_eastern", "Middle Eastern"], ["mexican", "Mexican"], ["fusion", "Fusion"], ["other", "Other"]],
  GB: [["indian", "Indian"], ["chinese", "Chinese"], ["japanese", "Japanese"], ["korean", "Korean"], ["thai", "Thai"], ["british", "British"], ["american", "American / BBQ"], ["italian", "Italian"], ["middle_eastern", "Middle Eastern"], ["african_caribbean", "African & Caribbean"], ["eastern_european", "Eastern European"], ["mexican", "Mexican"], ["fusion", "Fusion"], ["other", "Other"]],
  SG: [["chinese", "Chinese"], ["malay", "Malay"], ["indian", "Indian"], ["peranakan", "Peranakan"], ["japanese", "Japanese"], ["korean", "Korean"], ["thai", "Thai"], ["western", "Western"], ["american", "American / Burgers"], ["italian", "Italian"], ["middle_eastern", "Middle Eastern"], ["mexican", "Mexican"], ["fusion", "Fusion"], ["other", "Other"]],
};

/** Dietary options each market uses — the Dietary filter's values. */
export const DIETARY: Record<string, [string, string][]> = {
  IN: [["veg", "Vegetarian"], ["vegan", "Vegan"], ["nonveg", "Non-Vegetarian"], ["jain", "Jain"], ["eggless", "Eggless"], ["halal", "Halal"], ["gluten_free", "Gluten-Free"]],
  GB: [["veg", "Vegetarian"], ["vegan", "Vegan"], ["nonveg", "Contains Meat / Fish"], ["halal", "Halal"], ["gluten_free", "Gluten-Free"]],
  SG: [["veg", "Vegetarian"], ["vegan", "Vegan"], ["nonveg", "Contains Meat / Fish"], ["eggless", "Eggless"], ["halal", "Halal"], ["gluten_free", "Gluten-Free"]],
};

/** The 14 allergens UK law requires food sellers to declare. */
const ALLERGENS: [string, string][] = [
  ["gluten", "Gluten"], ["crustaceans", "Crustaceans"], ["eggs", "Eggs"], ["fish", "Fish"], ["peanuts", "Peanuts"], ["soya", "Soya"], ["milk", "Milk"],
  ["nuts", "Tree Nuts"], ["celery", "Celery"], ["mustard", "Mustard"], ["sesame", "Sesame"], ["sulphites", "Sulphites"], ["lupin", "Lupin"], ["molluscs", "Molluscs"],
];

/** Delivery apps each market's cloud kitchens sell through — the Order On filter's values. */
export const DELIVERY_APPS: Record<string, [string, string][]> = {
  IN: [["swiggy", "Swiggy"], ["zomato", "Zomato"], ["direct", "Order Direct"]],
  GB: [["deliveroo", "Deliveroo"], ["ubereats", "Uber Eats"], ["justeat", "Just Eat"], ["direct", "Order Direct"]],
  SG: [["grabfood", "GrabFood"], ["foodpanda", "foodpanda"], ["deliveroo", "Deliveroo"], ["direct", "Order Direct"]],
};

const LICENCE_LABEL: Record<string, [string, string]> = {
  IN: ["FSSAI Licence / Registration No.", "Required to sell food in India."],
  GB: ["Council Food Business Registration", "Food businesses register free with their local council."],
  SG: ["SFA Licence No.", "Leave empty if you're a home-based business (no licence needed)."],
};

const cuisines = (country: string, required = true): FormFieldDef => multi("cuisines", "Cuisine", CUISINES[country] ?? CUISINES.GB, { required });
const dietary = (country: string, required = false): FormFieldDef => multi("dietaryOptions", "Dietary", DIETARY[country] ?? DIETARY.GB, { required });
const allergens = multi("allergens", "Contains Allergens", ALLERGENS, { hint: "Tick every allergen in any dish you sell." });
const mealType = (entries: [string, string][] = [["breakfast", "Breakfast"], ["lunch", "Lunch"], ["dinner", "Dinner"], ["snacks", "Snacks"]]): FormFieldDef =>
  multi("mealType", "Meals", entries);
const dealMethod = multi("dealMethod", "Collection / Delivery", [["collection", "Collection / Pickup"], ["delivery", "Delivery"]], { required: true });
const orderNotice = text("orderNotice", "Order Notice", "e.g. Order by 6pm for next day");
const availability = text("availability", "Days & Times", "e.g. Mon–Sat, 12pm–9pm");

/** Who cooks it: name, licence, and (UK) the Food Hygiene Rating. */
const kitchen = (country: string, nameLabel: string, extra: FormFieldDef[] = []): FormSection => {
  const [licence, hint] = LICENCE_LABEL[country] ?? LICENCE_LABEL.GB;
  return {
    title: "Kitchen",
    fields: [
      { key: "providerName", type: "text", label: nameLabel, required: true, width: "half" },
      { key: "foodLicence", type: "text", label: licence, hint, width: "half" },
      ...(country === "GB"
        ? [select("hygieneRating", "Food Hygiene Rating", [["5", "5 – Very Good"], ["4", "4 – Good"], ["3", "3 – Generally Satisfactory"], ["2", "2 – Improvement Necessary"], ["1", "1 – Major Improvement Necessary"], ["0", "0 – Urgent Improvement Necessary"], ["awaiting", "Awaiting Inspection"]])]
        : []),
      ...extra,
    ],
  };
};

const priceSection = (units: [string, string][], required = true, label = "Price"): FormSection => ({
  title: "Price",
  fields: [
    { key: "salePrice", type: "currency", label, required, min: 0, width: "half", ...(required ? {} : { hint: "Leave empty for Price on request." }) },
    select("priceUnit", "Price Per", units),
  ],
});

export function foodDiningSections(subcategory: string, country: string): FormSection[] | null {
  switch (subcategory) {
    case "Home Cooked Meals":
      return [
        basics,
        { title: "Food", fields: [cuisines(country), dietary(country, true), mealType(), allergens] },
        kitchen(country, "Kitchen Name", [orderNotice, availability, dealMethod]),
        priceSection([["meal", "Per meal"], ["plate", "Per plate"], ["order", "Per order"], ["from", "Starting from"]]),
      ];

    case "Catering Services":
      return [
        basics,
        {
          title: "Catering",
          fields: [
            multi("eventTypes", "Events", [["wedding", "Weddings"], ["corporate", "Corporate"], ["birthday", "Birthdays"], ["party", "Private Parties"], ["religious", "Religious & Festive"], ["other", "Other"]], { required: true }),
            multi("serviceStyle", "Service Style", [["buffet", "Buffet"], ["plated", "Plated / Sit-down"], ["boxed", "Boxed Meals"], ["live", "Live Counters"], ["food_truck", "Food Truck / Van"], ["drop_off", "Drop-off"]]),
            { key: "minGuests", type: "number", label: "Guests From", min: 1, width: "half" },
            { key: "maxGuests", type: "number", label: "Guests Up To", min: 1, gteField: "minGuests", width: "half" },
            cuisines(country),
            dietary(country),
            { key: "staffIncluded", type: "select", label: "Service Staff Included", options: YES_NO, width: "half" },
            allergens,
          ],
        },
        kitchen(country, "Caterer Name", [{ ...orderNotice, label: "Booking Notice", placeholder: "e.g. 2 weeks" }]),
        priceSection([["person", "Per person"], ["event", "Per event"], ["from", "Starting from"], ["quote", "Price on request"]], false),
      ];

    case "Tiffin Services":
      return [
        basics,
        {
          title: "Plan",
          fields: [
            multi("plans", "Plans", [["oneoff", "Trial / One-off"], ["daily", "Daily"], ["weekly", "Weekly"], ["monthly", "Monthly"]], { required: true }),
            mealType([["breakfast", "Breakfast"], ["lunch", "Lunch"], ["dinner", "Dinner"]]),
            cuisines(country),
            dietary(country, true),
            text("deliveryDays", "Delivery Days", "e.g. Mon–Sat"),
            text("deliveryArea", "Delivery Area", "e.g. Andheri, Bandra"),
            allergens,
          ],
        },
        kitchen(country, "Kitchen Name", [dealMethod]),
        priceSection([["meal", "Per meal"], ["day", "Per day"], ["week", "Per week"], ["month", "Per month"]]),
      ];

    case "Restaurant Deals":
      return [
        basics,
        {
          title: "Restaurant",
          fields: [
            { key: "providerName", type: "text", label: "Restaurant Name", required: true, width: "half" },
            cuisines(country),
            dietary(country),
          ],
        },
        {
          title: "Deal",
          fields: [
            select("dealType", "Deal Type", DEAL_TYPES, { required: true, width: "full", display: "dropdown" }),
            { key: "discountPct", type: "number", label: "Discount", unit: "% off", min: 1, max: 100, width: "half", hint: "Leave empty if the deal isn't a percentage off." },
            { key: "salePrice", type: "currency", label: "Deal Price", min: 0, width: "half" },
            { key: "originalPrice", type: "currency", label: "Was", min: 0, width: "half" },
            mealType([["breakfast", "Breakfast"], ["brunch", "Brunch"], ["lunch", "Lunch"], ["dinner", "Dinner"], ["drinks", "Drinks"]]),
            text("validDays", "Valid Days & Times", "e.g. Mon–Fri, 12–3pm"),
            { key: "bookingRequired", type: "select", label: "Booking Needed", options: YES_NO, width: "half" },
            { key: "deadline", type: "date", label: "Valid Until", required: true, width: "half" },
            { key: "website", type: "text", label: "Website / Booking Link", placeholder: "https://", format: "url" },
          ],
        },
      ];

    case "Cloud Kitchens":
      return [
        basics,
        {
          title: "Food",
          fields: [
            cuisines(country),
            dietary(country),
            multi("deliveryApps", "Order On", DELIVERY_APPS[country] ?? DELIVERY_APPS.GB, { required: true }),
            text("deliveryArea", "Delivery Area", "e.g. Bethnal Green, Hackney"),
            allergens,
          ],
        },
        kitchen(country, "Brand Name", [{ ...availability, label: "Opening Hours" }]),
        priceSection([["from", "Starting from"], ["item", "Per dish"], ["meal", "Per meal"]], true, "Dishes From"),
      ];

    case "Baked Goods & Desserts":
      return [
        basics,
        {
          title: "Bakes",
          fields: [
            select("itemType", "Type", [["cakes", "Cakes"], ["cupcakes", "Cupcakes"], ["bread", "Bread"], ["cookies", "Cookies & Biscuits"], ["pastries", "Pastries"], ["brownies", "Brownies & Traybakes"], ["desserts", "Desserts"], ["savoury", "Savoury Bakes"], ["other", "Other"]], { required: true, width: "full" }),
            { key: "customOrders", type: "select", label: "Custom Orders", options: YES_NO, width: "half" },
            dietary(country),
            allergens,
          ],
        },
        kitchen(country, "Bakery / Baker Name", [orderNotice, dealMethod]),
        priceSection([["item", "Per item"], ["kg", "Per kg"], ["box", "Per box"], ["dozen", "Per dozen"], ["from", "Starting from"]]),
      ];

    default:
      return null;
  }
}
