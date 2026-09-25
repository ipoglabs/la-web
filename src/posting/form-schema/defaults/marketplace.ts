// Default post-form schemas for the categories promoted out of the old
// "For Sale" bucket (Electronics & Tech, Fashion & Clothing, …). Their old
// forms were borrowed from components/form/forsale|services and most of what
// they collected was never saved; these give each category its own fields.
//
// Field choices follow what the leading classifieds in our markets ask for
// in the same categories — OLX (IN), Gumtree (GB), Carousell (SG): a graded
// condition scale, a deal method (meet-up / delivery), brand/model for goods,
// size/colour for fashion, specs for phones and laptops.

import type { FormFieldDef, FormSection } from "../types";
import { basics, opts, pairs, YES_NO } from "./shared";

/** Graded condition scale (Carousell / Gumtree style). "new", "like-new" and
 *  "used" keep the values older posts already store. */
const CONDITION_SCALE: [string, string][] = [
  ["new", "Brand New"],
  ["like-new", "Like New"],
  ["lightly-used", "Lightly Used"],
  ["used", "Well Used"],
  ["heavily-used", "Heavily Used"],
];

// ── Reusable fields ──────────────────────────────────────────────────────────
const price = (label = "Price", required = true): FormFieldDef => ({
  key: "price",
  type: "currency",
  label,
  required,
  min: required ? 1 : 0,
  width: "half",
});
const negotiable: FormFieldDef = { key: "negotiable", type: "select", label: "Negotiable", options: YES_NO, width: "half" };
const brand: FormFieldDef = { key: "brand", type: "text", label: "Brand", width: "half" };
const model: FormFieldDef = { key: "model", type: "text", label: "Model", width: "half" };
const material: FormFieldDef = { key: "material", type: "text", label: "Material", width: "half" };
const color: FormFieldDef = { key: "color", type: "text", label: "Color", width: "half" };
const size: FormFieldDef = { key: "size", type: "text", label: "Size", width: "half" };
const warranty: FormFieldDef = {
  key: "warranty",
  type: "select",
  label: "Warranty",
  options: pairs([["no", "No Warranty"], ["under-warranty", "Under Warranty"], ["extended", "Extended Warranty"]]),
};
const condition = (extra: [string, string][] = []): FormFieldDef => ({
  key: "condition",
  type: "select",
  label: "Condition",
  required: true,
  options: pairs([...CONDITION_SCALE, ...extra]),
});
const availability: FormFieldDef = { key: "availability", type: "text", label: "Availability", placeholder: "e.g. Mon–Sat, 9am–6pm", width: "half" };
const providerName: FormFieldDef = { key: "providerName", type: "text", label: "Business / Provider Name", width: "half" };
const qualification: FormFieldDef = { key: "qualification", type: "text", label: "Qualification", width: "half" };
const mode: FormFieldDef = { key: "mode", type: "select", label: "Mode", options: pairs([["online", "Online"], ["offline", "In Person"], ["both", "Both"]]) };
const ageGroup: FormFieldDef = { key: "ageGroup", type: "text", label: "Age Group", placeholder: "e.g. 3-5 years", width: "half" };

const dealMethod: FormFieldDef = {
  key: "dealMethod",
  type: "multiselect",
  label: "Deal Method",
  options: pairs([["meetup", "Meet-up / Collection"], ["delivery", "Delivery / Courier"]]),
};

/** An item for sale. */
const item = (title: string, fields: FormFieldDef[]): FormSection[] => [
  basics,
  { title, fields },
  { title: "Price & Delivery", fields: [price(), negotiable, dealMethod] },
];

/** A service someone offers. */
const service = (fields: FormFieldDef[], priceLabel = "Price"): FormSection[] => [
  basics,
  { title: "Service", fields: [providerName, ...fields, availability, price(priceLabel)] },
];

// ── Categories ───────────────────────────────────────────────────────────────
type Builder = (subcategory: string) => FormSection[] | null;

const babyKids: Builder = (sub) => {
  switch (sub) {
    case "Toys & Games":
    case "Baby Gear & Equipment":
    case "School Supplies & Books":
      return item("Item", [condition(), brand, ageGroup]);
    case "Baby & Kids Clothing":
      return item("Item", [condition(), brand, size, ageGroup, { key: "gender", type: "select", label: "For", options: pairs([["boy", "Boy"], ["girl", "Girl"], ["unisex", "Unisex"]]) }]);
    case "Childcare & Nurseries":
    case "Kids Classes & Activities":
      return service([ageGroup, qualification], "Fee");
    default:
      return null;
  }
};

const booksMedia: Builder = (sub) => {
  const extra: Record<string, FormFieldDef[]> = {
    "Books & Comics": [{ key: "authorArtist", type: "text", label: "Author", width: "half" }, { key: "genre", type: "text", label: "Genre", width: "half" }],
    "Vinyl Records": [{ key: "authorArtist", type: "text", label: "Artist", width: "half" }, { key: "genre", type: "text", label: "Genre", width: "half" }],
    "DVDs & Blu-ray": [{ key: "genre", type: "text", label: "Genre", width: "half" }],
    "Board Games & Puzzles": [brand, ageGroup],
    "Collectibles & Memorabilia": [{ key: "era", type: "text", label: "Year / Era", placeholder: "e.g. 1960s", width: "half" }],
  };
  return extra[sub] ? item("Item", [condition([["collectible", "Collectible"]]), ...extra[sub]]) : null;
};

const education: Builder = (sub) => {
  switch (sub) {
    case "Tutors & Coaching":
    case "Language Classes":
      return service([{ key: "subject", type: "text", label: sub === "Language Classes" ? "Language" : "Subject", required: true, width: "half" }, { key: "level", type: "text", label: "Level", width: "half" }, qualification, mode], "Fee");
    case "Online Courses":
      return service([{ key: "subject", type: "text", label: "Course Topic", required: true, width: "half" }, { key: "durationText", type: "text", label: "Duration", width: "half" }, qualification], "Fee");
    case "Schools & Colleges":
      return service([{ key: "educationType", type: "select", label: "Type", options: pairs([["school", "School"], ["college", "College"], ["university", "University"], ["vocational", "Vocational"], ["other", "Other"]]) }, { key: "qualification", type: "text", label: "Board / Affiliation", width: "half" }], "Fees");
    case "Study Materials":
      return item("Item", [condition(), { key: "subject", type: "text", label: "Subject / Exam", width: "half" }]);
    default:
      return null;
  }
};

const electronics: Builder = (sub) => {
  const known = ["Mobile Phones & Tablets", "Laptops & Computers", "TVs & Audio", "Gaming", "Cameras & Photography", "Computer Parts & Components", "Wearables & Smart Devices", "Tech Accessories"];
  if (!known.includes(sub)) return null;
  const storage: FormFieldDef = { key: "storage", type: "text", label: "Storage", placeholder: "e.g. 128 GB", width: "half" };
  const ram: FormFieldDef = { key: "ram", type: "text", label: "RAM", placeholder: "e.g. 8 GB", width: "half" };
  const specs: Record<string, FormFieldDef[]> = {
    "Mobile Phones & Tablets": [storage, ram, color],
    "Laptops & Computers": [{ key: "processor", type: "text", label: "Processor", placeholder: "e.g. Intel i5 / Apple M2", width: "half" }, ram, storage, { key: "screenSize", type: "text", label: "Screen Size", placeholder: "e.g. 14 inch", width: "half" }],
    "TVs & Audio": [{ key: "screenSize", type: "text", label: "Screen Size", placeholder: "e.g. 55 inch", width: "half" }],
    Gaming: [{ key: "platform", type: "select", label: "Platform", options: opts(["PlayStation", "Xbox", "Nintendo", "PC", "Other"]) }],
  };
  return item("Item", [brand, model, ...(specs[sub] ?? []), condition([["for-parts", "For Parts / Not Working"]]), warranty]);
};

const fashion: Builder = (sub) => {
  const known = ["Men's Clothing", "Women's Clothing", "Traditional & Ethnic Wear", "Shoes & Footwear", "Bags & Accessories", "Jewellery & Watches", "Designer & Luxury", "Vintage & Preloved"];
  if (!known.includes(sub)) return null;
  const sized = !["Bags & Accessories", "Jewellery & Watches"].includes(sub);
  const gendered = !["Men's Clothing", "Women's Clothing"].includes(sub);
  const forWhom: FormFieldDef = { key: "gender", type: "select", label: "For", options: pairs([["male", "Men"], ["female", "Women"], ["unisex", "Unisex"]]) };
  return item("Item", [condition(), brand, ...(sized ? [size] : []), color, material, ...(gendered ? [forWhom] : [])]);
};

const foodDining: Builder = (sub) => {
  const food: FormFieldDef[] = [
    { key: "cuisineType", type: "text", label: "Cuisine", width: "half" },
    { key: "dietaryOptions", type: "multiselect", label: "Dietary Options", options: opts(["Vegetarian", "Vegan", "Non-Vegetarian", "Halal", "Jain", "Gluten-Free"]) },
    { key: "deliveryAvailable", type: "select", label: "Delivery Available", options: YES_NO },
  ];
  switch (sub) {
    case "Home Cooked Meals":
    case "Catering Services":
    case "Tiffin Services":
    case "Cloud Kitchens":
    case "Baked Goods & Desserts":
      return service(food);
    case "Restaurant Deals":
      return [
        basics,
        {
          title: "Deal",
          fields: [
            providerName,
            ...food.slice(0, 1),
            { key: "discount", type: "text", label: "Discount / Deal", placeholder: "e.g. 20% off", width: "half" },
            { key: "deadline", type: "date", label: "Valid Until", width: "half" },
            price("Deal Price", false),
          ],
        },
      ];
    default:
      return null;
  }
};

const freeGiveaway: Builder = (sub) => {
  const known = ["Furniture", "Clothing", "Electronics", "Food", "Kids Items", "General"];
  if (!known.includes(sub)) return null;
  const pickup: FormFieldDef = { key: "availability", type: "text", label: "Pickup Availability", placeholder: "e.g. Weekday evenings" };
  return [
    basics,
    {
      title: "Item",
      fields: sub === "Food"
        ? [{ key: "deadline", type: "date", label: "Best Before", required: true, width: "half" }, pickup]
        : [condition(), pickup],
    },
  ];
};

const healthBeauty: Builder = (sub) => {
  switch (sub) {
    case "Fitness Classes & Training":
    case "Salons & Spas":
    case "Medical & Therapy":
    case "Wellness & Nutrition":
    case "Mental Health & Counselling":
      return service([qualification, { key: "consultationMode", type: "select", label: "Mode", options: pairs([["online", "Online"], ["in-person", "In Person"], ["both", "Both"]]) }]);
    case "Beauty Products":
      return item("Product", [brand, { key: "productType", type: "text", label: "Product Type", placeholder: "e.g. Skincare, Fragrance", width: "half" }, condition()]);
    default:
      return null;
  }
};

const homeFurniture: Builder = (sub) => {
  const known = ["Sofas & Seating", "Beds & Bedroom", "Tables, Desks & Dining", "Kitchen & Appliances", "Storage & Shelving", "Home Decor & Accessories", "Garden & Outdoor", "DIY, Tools & Hardware"];
  if (!known.includes(sub)) return null;
  const appliance = ["Kitchen & Appliances", "DIY, Tools & Hardware"].includes(sub);
  return item("Item", [condition(), brand, material, { key: "dimensions", type: "text", label: "Dimensions", placeholder: "e.g. 180 x 90 x 75 cm", width: "half" }, ...(appliance ? [warranty] : [])]);
};

const musical: Builder = (sub) => {
  const known = ["Guitars & Bass", "Keyboards & Piano", "Drums & Percussion", "DJ & Audio Gear", "Wind, Brass & Strings", "Accessories"];
  return known.includes(sub) ? item("Instrument", [brand, model, condition([["vintage", "Vintage"]])]) : null;
};

const sports: Builder = (sub) => {
  switch (sub) {
    case "Fitness Equipment":
    case "Team Sports":
    case "Outdoor & Adventure":
    case "Water Sports":
      return item("Item", [condition(), brand, { key: "productType", type: "text", label: "Type", placeholder: "e.g. Treadmill, Cricket Bat", width: "half" }]);
    case "Sportswear & Footwear":
      return item("Item", [condition(), brand, size]);
    case "Fitness Classes & Coaching":
      return service([qualification, { key: "subject", type: "text", label: "Sport / Activity", width: "half" }, { key: "level", type: "text", label: "Level", width: "half" }], "Fee");
    default:
      return null;
  }
};

const tickets: Builder = (sub) => {
  const faceValue: FormFieldDef = { key: "faceValue", type: "currency", label: "Face Value", min: 0, width: "half" };
  const quantity: FormFieldDef = { key: "quantity", type: "number", label: "Quantity", min: 1, width: "half" };
  switch (sub) {
    case "Event Tickets":
    case "Sport Tickets":
      return [
        basics,
        {
          title: "Tickets",
          fields: [
            { key: "startDate", type: "date", label: "Event Date", required: true, width: "half" },
            { key: "venue", type: "text", label: "Venue", width: "half" },
            quantity,
            { key: "seatDetails", type: "text", label: "Seat / Section", width: "half" },
            faceValue,
            price("Asking Price"),
          ],
        },
      ];
    case "Gift Cards":
    case "Experience Days":
    case "Travel Vouchers":
      return [
        basics,
        {
          title: "Voucher",
          fields: [
            sub === "Gift Cards" ? { key: "brand", type: "text", label: "Store / Brand", required: true, width: "half" } : providerName,
            { key: "deadline", type: "date", label: "Valid Until", width: "half" },
            faceValue,
            price("Asking Price"),
          ],
        },
      ];
    default:
      return null;
  }
};

const travel: Builder = (sub) => {
  switch (sub) {
    case "Holiday Rentals":
    case "Hotels & Guesthouses":
      return [
        basics,
        {
          title: "Stay",
          fields: [
            providerName,
            { key: "guests", type: "number", label: "Max Guests", min: 1, max: 100, width: "half" },
            { key: "rateNightly", type: "currency", label: "Price per Night", required: true, min: 1, width: "half" },
            { key: "amenities", type: "multiselect", label: "Amenities", options: opts(["Wi-Fi", "Air Conditioning", "Parking", "Breakfast", "Pool", "Kitchen", "Pet Friendly"]) },
          ],
        },
      ];
    case "Tour Packages":
    case "Staycations & Day Trips":
      return [
        basics,
        {
          title: "Package",
          fields: [
            { key: "destination", type: "text", label: "Destination", required: true, width: "half" },
            { key: "durationText", type: "text", label: "Duration", placeholder: "e.g. 3 nights / 4 days", width: "half" },
            { key: "packageDetails", type: "textarea", label: "Inclusions" },
            { key: "agencyName", type: "text", label: "Agency Name", width: "half" },
            price("Price per Person"),
          ],
        },
      ];
    case "Travel Services":
      return [
        basics,
        {
          title: "Service",
          fields: [
            { key: "serviceType", type: "select", label: "Service Type", options: pairs([["visa", "Visa"], ["tickets", "Ticket Booking"], ["transport", "Transport / Cab"], ["guide", "Guide"], ["insurance", "Travel Insurance"], ["other", "Other"]]) },
            { key: "agencyName", type: "text", label: "Agency Name", width: "half" },
            price("Price", false),
          ],
        },
      ];
    case "Travel Accessories":
      return item("Item", [condition(), brand]);
    default:
      return null;
  }
};

export const MARKETPLACE_BUILDERS: Record<string, Builder> = {
  "Baby & Kids": babyKids,
  "Books, Media & Collectibles": booksMedia,
  Education: education,
  "Electronics & Tech": electronics,
  "Fashion & Clothing": fashion,
  "Food & Dining": foodDining,
  "Free & Giveaway": freeGiveaway,
  "Health & Beauty": healthBeauty,
  "Home & Furniture": homeFurniture,
  "Musical Instruments": musical,
  "Sports & Outdoors": sports,
  "Tickets & Vouchers": tickets,
  "Travel & Stays": travel,
};
