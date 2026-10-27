// scripts/backfill-food-dining-seed-details.ts
// Run with: npx tsx --env-file=.env.local scripts/backfill-food-dining-seed-details.ts [--dry-run]
//
// One-off (2026-10-27): the Food & Dining seed posts have only a title, a
// description and a price, so the reworked search filters had nothing to
// match. This fills, from each ad's own text, what the reworked forms ask:
// Cuisine, Dietary, Meals, Collection / Delivery and Price Per everywhere;
// Events, Service Style and guests for caterers; Plans for tiffin; Deal Type
// and Valid Until for restaurant deals; Order On for cloud kitchens; Type and
// Custom Orders for bakes. Detail fields are only filled where empty, so it is
// safe to re-run.
//
// Most Singapore seeds were near copies of India's; they get a local detail in
// their text.

import mongoose from "mongoose";
import dbConnect from "../src/lib/db";
import Post from "../src/models/post";

interface SeedDetails {
  /** Post model paths the forms save top-level, filled where empty. */
  fields?: Record<string, unknown>;
  /** Everything else the forms save under `attributes`, filled where empty. */
  attributes?: Record<string, unknown>;
  /** Text swapped in the title and description. */
  text?: [string, string][];
}

const BOTH = ["collection", "delivery"];
const DELIVERY = ["delivery"];
const COLLECTION = ["collection"];
const VALID_UNTIL = new Date("2026-12-31T00:00:00Z");

// Values are the Food & Dining forms' (posting/form-schema/defaults/food-dining.ts).
const DETAILS: Record<string, SeedDetails> = {
  // ── Baked Goods & Desserts ──
  "food-bake-01": { attributes: { itemType: "cakes", customOrders: "yes", orderNotice: "Minimum 1 week", dealMethod: COLLECTION, priceUnit: "from" } },
  "food-bake-02": { attributes: { itemType: "bread", orderNotice: "Order by Wednesday for Friday", dealMethod: BOTH, priceUnit: "item" } },
  "food-bake-03": { attributes: { itemType: "brownies", customOrders: "no", allergens: ["gluten", "eggs", "milk"], dealMethod: DELIVERY, priceUnit: "box" } },
  "food-in-bakedgoods-01": { fields: { providerName: "Sweet Crumb Bakery" }, attributes: { itemType: "cakes", customOrders: "yes", orderNotice: "2 days", dealMethod: BOTH, priceUnit: "kg" } },
  "food-in-bakedgoods-02": { fields: { providerName: "Sweet Crumb Bakery" }, attributes: { itemType: "bread", dealMethod: BOTH, priceUnit: "item" } },
  "food-sg-bakedgoods-01": {
    fields: { providerName: "Sweet Crumb Bakery SG" },
    attributes: { itemType: "cakes", customOrders: "yes", orderNotice: "2 days", dealMethod: BOTH, priceUnit: "kg" },
    text: [["Order 2 days in advance.", "Order 2 days in advance. Collection from Joo Chiat or delivery islandwide."]],
  },
  "food-sg-bakedgoods-02": {
    fields: { providerName: "Sweet Crumb Bakery SG" },
    attributes: { itemType: "bread", dealMethod: BOTH, priceUnit: "item" },
    text: [["Baked daily in small batches.", "Baked daily in small batches at our Joo Chiat bakery."]],
  },

  // ── Catering Services ──
  "food-cater-01": {
    fields: { providerName: "Grand Feast Catering" },
    attributes: { eventTypes: ["wedding", "corporate", "party"], serviceStyle: ["buffet", "plated"], minGuests: 20, maxGuests: 500, staffIncluded: "yes", cuisines: ["british"], priceUnit: "person" },
  },
  "food-cater-02": {
    fields: { providerName: "Grand Feast Catering" },
    attributes: { eventTypes: ["party", "corporate", "other"], serviceStyle: ["food_truck"], minGuests: 50, maxGuests: 300, cuisines: ["american"], priceUnit: "event" },
  },
  "food-cater-03": {
    fields: { providerName: "Grand Feast Catering" },
    attributes: { eventTypes: ["corporate"], serviceStyle: ["boxed", "drop_off"], minGuests: 10, cuisines: ["british"], priceUnit: "person" },
  },
  "food-in-catering-01": {
    fields: { providerName: "Royal Caterers India", dietaryOptions: ["veg", "nonveg"] },
    attributes: { eventTypes: ["wedding"], serviceStyle: ["buffet"], minGuests: 200, staffIncluded: "yes", cuisines: ["north_indian", "south_indian", "chinese"], priceUnit: "person" },
  },
  "food-in-catering-02": {
    fields: { providerName: "Royal Caterers India", dietaryOptions: ["veg", "nonveg"] },
    attributes: { eventTypes: ["corporate"], serviceStyle: ["buffet"], minGuests: 50, cuisines: ["north_indian", "chinese"], priceUnit: "person" },
  },
  "food-sg-catering-01": {
    fields: { providerName: "Royal Caterers Singapore", dietaryOptions: ["halal"] },
    attributes: { eventTypes: ["wedding"], serviceStyle: ["buffet"], minGuests: 200, staffIncluded: "yes", cuisines: ["chinese", "malay", "indian"], priceUnit: "person" },
    text: [["Includes service staff and setup.", "Includes service staff and setup. Halal-certified menu available."]],
  },
  "food-sg-catering-02": {
    fields: { providerName: "Royal Caterers Singapore", dietaryOptions: ["veg", "nonveg"] },
    attributes: { eventTypes: ["corporate"], serviceStyle: ["buffet"], minGuests: 50, cuisines: ["chinese", "western"], priceUnit: "person" },
    text: [["with vegetarian and non-vegetarian options.", "with vegetarian and non-vegetarian options. Delivered islandwide and set up at your office or venue."]],
  },

  // ── Cloud Kitchens ──
  "food-cloud-01": { fields: { providerName: "Smash Burger Co", availability: "Daily, 12pm–10pm", dietaryOptions: ["nonveg"] }, attributes: { cuisines: ["american"], deliveryApps: ["ubereats", "deliveroo"], deliveryArea: "Bethnal Green", priceUnit: "from" } },
  "food-cloud-02": { fields: { providerName: "Tonkotsu Ramen Lab", availability: "Tue–Sun, 12pm–10pm", dietaryOptions: ["nonveg", "vegan"] }, attributes: { cuisines: ["japanese"], deliveryApps: ["deliveroo"], deliveryArea: "Islington", priceUnit: "from" } },
  "food-cloud-03": { fields: { providerName: "Vegan Vibes Kitchen", availability: "Wed–Sun, 12pm–9pm", dietaryOptions: ["vegan", "gluten_free"] }, attributes: { cuisines: ["african_caribbean"], deliveryApps: ["deliveroo", "ubereats"], priceUnit: "from" } },
  "food-in-cloudkitchen-01": { fields: { providerName: "FlavorFast Cloud Kitchen", dietaryOptions: ["nonveg"] }, attributes: { cuisines: ["mughlai"], deliveryApps: ["swiggy", "zomato"], priceUnit: "item" } },
  "food-in-cloudkitchen-02": { fields: { providerName: "FlavorFast Cloud Kitchen", dietaryOptions: ["nonveg"] }, attributes: { cuisines: ["mughlai", "north_indian"], deliveryApps: ["swiggy", "zomato"], priceUnit: "item" } },
  "food-sg-cloudkitchen-01": { fields: { providerName: "FlavorFast Cloud Kitchen SG", dietaryOptions: ["nonveg"] }, attributes: { cuisines: ["peranakan"], deliveryApps: ["grabfood", "foodpanda"], priceUnit: "item" } },
  "food-sg-cloudkitchen-02": { fields: { providerName: "FlavorFast Cloud Kitchen SG", dietaryOptions: ["nonveg"] }, attributes: { cuisines: ["malay"], deliveryApps: ["grabfood", "foodpanda"], priceUnit: "item" } },

  // ── Home Cooked Meals ──
  "food-home-01": { fields: { dietaryOptions: ["nonveg"] }, attributes: { cuisines: ["african_caribbean"], mealType: ["lunch", "dinner"], orderNotice: "Order by 6pm for next day", dealMethod: BOTH, priceUnit: "meal" } },
  "food-home-02": { fields: { dietaryOptions: ["veg"] }, attributes: { cuisines: ["indian"], mealType: ["lunch", "dinner"], dealMethod: COLLECTION, priceUnit: "meal" } },
  "food-home-03": { fields: { dietaryOptions: ["veg", "nonveg"] }, attributes: { cuisines: ["eastern_european"], mealType: ["lunch", "dinner"], orderNotice: "Order by 7pm for next day", dealMethod: COLLECTION, priceUnit: "meal" } },
  "food-in-homecooked-01": { fields: { providerName: "Lakshmi's Home Kitchen", dietaryOptions: ["veg"] }, attributes: { cuisines: ["south_indian"], mealType: ["lunch"], dealMethod: BOTH, priceUnit: "plate" } },
  "food-in-homecooked-02": { fields: { providerName: "Lakshmi's Home Kitchen", dietaryOptions: ["veg"] }, attributes: { cuisines: ["north_indian"], mealType: ["lunch", "dinner"], dealMethod: BOTH, priceUnit: "meal" } },
  "food-sg-homecooked-01": { fields: { providerName: "Mei's Home Kitchen", dietaryOptions: ["nonveg"] }, attributes: { cuisines: ["peranakan"], mealType: ["lunch", "dinner"], dealMethod: BOTH, priceUnit: "meal" } },
  "food-sg-homecooked-02": {
    fields: { providerName: "Mei's Home Kitchen", dietaryOptions: ["veg"] },
    attributes: { cuisines: ["indian"], mealType: ["lunch", "dinner"], dealMethod: BOTH, priceUnit: "meal" },
    text: [["dal, and steamed rice.", "dal, and steamed rice. Collection near Farrer Park MRT or delivery within 5 km."]],
  },

  // ── Restaurant Deals ──
  "food-rest-01": { fields: { deadline: VALID_UNTIL }, attributes: { cuisines: ["british"], dealType: "special_rate", mealType: ["lunch"], validDays: "Mon–Fri, 12–3pm" } },
  "food-rest-02": { fields: { deadline: VALID_UNTIL }, attributes: { cuisines: ["british"], dealType: "bundle", mealType: ["brunch", "drinks"], validDays: "Saturdays: 11am, 1pm, 3pm", bookingRequired: "yes" } },
  "food-rest-03": { fields: { deadline: VALID_UNTIL }, attributes: { cuisines: ["indian"], dealType: "special_rate", mealType: ["lunch", "dinner"], bookingRequired: "no" } },
  "food-in-restaurantdeals-01": { fields: { providerName: "Spice Route Restaurant", deadline: VALID_UNTIL }, attributes: { cuisines: ["north_indian"], dealType: "special_rate", mealType: ["lunch"], validDays: "Mon–Fri" } },
  "food-in-restaurantdeals-02": { fields: { providerName: "Spice Route Restaurant", deadline: VALID_UNTIL }, attributes: { cuisines: ["north_indian", "western"], dealType: "bundle", mealType: ["brunch"], validDays: "Sat–Sun" } },
  "food-sg-restaurantdeals-01": {
    fields: { providerName: "Spice Route Restaurant SG", deadline: VALID_UNTIL },
    attributes: { cuisines: ["indian"], dealType: "special_rate", mealType: ["lunch"], validDays: "Mon–Fri" },
    text: [["available Monday to Friday.", "available Monday to Friday at our Dempsey Hill restaurant."]],
  },
  "food-sg-restaurantdeals-02": {
    fields: { providerName: "Spice Route Restaurant SG", deadline: VALID_UNTIL },
    attributes: { cuisines: ["chinese", "western"], dealType: "bundle", mealType: ["brunch"], validDays: "Sat–Sun" },
    text: [["plus soft drinks.", "plus soft drinks. Dempsey Hill, booking recommended."]],
  },

  // ── Tiffin Services ──
  "food-tiffin-01": { fields: { dietaryOptions: ["veg"] }, attributes: { cuisines: ["indian"], plans: ["weekly", "monthly"], mealType: ["lunch"], deliveryDays: "Mon–Fri", deliveryArea: "Tower Hamlets, Newham", dealMethod: DELIVERY, priceUnit: "meal" } },
  "food-tiffin-02": { fields: { dietaryOptions: ["nonveg"] }, attributes: { cuisines: ["other"], plans: ["weekly"], mealType: ["lunch", "dinner"], deliveryDays: "Sunday evenings", dealMethod: DELIVERY, priceUnit: "meal" } },
  "food-tiffin-03": { fields: { dietaryOptions: ["halal", "nonveg"] }, attributes: { cuisines: ["african_caribbean"], plans: ["weekly", "monthly"], mealType: ["lunch"], deliveryDays: "Mon–Fri", deliveryArea: "Hackney, Stoke Newington", dealMethod: DELIVERY, priceUnit: "meal" } },
  "food-in-tiffin-01": { fields: { providerName: "Annapurna Tiffin Service", dietaryOptions: ["veg"] }, attributes: { cuisines: ["north_indian"], plans: ["monthly"], mealType: ["lunch"], deliveryDays: "Mon–Sat", dealMethod: DELIVERY, priceUnit: "month" } },
  "food-in-tiffin-02": { fields: { providerName: "Annapurna Tiffin Service", dietaryOptions: ["veg"] }, attributes: { cuisines: ["north_indian"], plans: ["monthly"], mealType: ["lunch", "dinner"], dealMethod: DELIVERY, priceUnit: "month" } },
  "food-sg-tiffin-01": {
    fields: { providerName: "Nutrition Bowl Delivery", dietaryOptions: ["nonveg"] },
    attributes: { cuisines: ["chinese"], plans: ["monthly"], mealType: ["lunch"], deliveryDays: "Mon–Fri", deliveryArea: "CBD, Raffles Place", dealMethod: DELIVERY, priceUnit: "month" },
    text: [["to your office, Monday to Friday.", "to your office in the CBD or Raffles Place, Monday to Friday."]],
  },
  "food-sg-tiffin-02": {
    fields: { providerName: "Nutrition Bowl Delivery", dietaryOptions: ["nonveg"] },
    attributes: { cuisines: ["fusion"], plans: ["monthly"], mealType: ["lunch", "dinner"], dealMethod: DELIVERY, priceUnit: "month" },
    text: [["based on your dietary goals.", "based on your dietary goals. Delivered islandwide."]],
  },
};

function isEmpty(value: unknown): boolean {
  return value == null || value === "" || (Array.isArray(value) && value.length === 0);
}

async function run() {
  const dryRun = process.argv.includes("--dry-run");
  await dbConnect();

  const posts = await Post.find({ category: "food_dining", adsId: { $in: Object.keys(DETAILS) } }).lean();
  const found = new Set(posts.map((p) => p.adsId));
  for (const id of Object.keys(DETAILS)) if (!found.has(id)) console.log(`${id}: no post`);

  for (const post of posts) {
    const id = post.adsId!;
    const details = DETAILS[id];
    const doc = post as unknown as Record<string, unknown>;
    const $set: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(details.fields ?? {})) {
      if (isEmpty(doc[key])) $set[key] = value;
    }
    for (const [key, value] of Object.entries(details.attributes ?? {})) {
      if (isEmpty(post.attributes?.[key])) $set[`attributes.${key}`] = value;
    }
    for (const key of ["name", "description"] as const) {
      const before = post[key] ?? "";
      // A swap whose result is already there was applied on an earlier run.
      const after = (details.text ?? []).reduce((s, [from, to]) => (s.includes(to) ? s : s.split(from).join(to)), before);
      if (after !== before) $set[key] = after;
    }

    if (!Object.keys($set).length) continue;
    console.log(`${id} (${post.country}): ${dryRun ? "would apply" : "applied"} ${JSON.stringify({ $set })}`);
    if (!dryRun) await Post.updateOne({ _id: post._id }, { $set });
  }

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
