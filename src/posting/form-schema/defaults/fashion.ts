// Default "Fashion & Clothing" post-form schemas.
//
// Option values are what the Fashion & Clothing search filters match
// (components/create-alert/config/fashion-clothing.ts, lib/postFilterQuery.ts
// FASHION_FORM_FILTERS). The price is `salePrice`, the field listing prices and
// the price filter read. Each sub's Type is `itemType`; For is `gender`
// (men / women / kids / unisex).

import type { FormFieldDef, FormSection } from "../types";
import { basics, pairs, YES_NO } from "./shared";

/** The marketplace's graded condition scale; fashion buyers say "New with Tags". */
const CONDITION_SCALE: [string, string][] = [
  ["new", "New with Tags"],
  ["like-new", "Like New"],
  ["lightly-used", "Lightly Used"],
  ["used", "Well Used"],
  ["heavily-used", "Heavily Used"],
];

const select = (key: string, label: string, entries: [string, string][], extra: Partial<FormFieldDef> = {}): FormFieldDef => ({
  key,
  type: "select",
  label,
  options: pairs(entries),
  width: "half",
  ...extra,
});
const text = (key: string, label: string, placeholder?: string): FormFieldDef => ({ key, type: "text", label, placeholder, width: "half" });
const itemType = (entries: [string, string][], label = "Type"): FormFieldDef => select("itemType", label, entries, { required: true, width: "full" });
const shownFor = (field: string, values: string[]) => ({ showWhen: { field, in: values } });

const condition = select("condition", "Condition", CONDITION_SCALE, { required: true });
const brand = text("brand", "Brand");
const colour = text("color", "Colour");
const forWhom = (entries: [string, string][], required = false) => select("gender", "For", entries, { required });
const MEN_WOMEN_UNISEX: [string, string][] = [["men", "Men"], ["women", "Women"], ["unisex", "Unisex"]];

/** Letter sizes for clothing; sarees and dupattas are free size. */
const clothingSize = (freeSize = false): FormFieldDef =>
  select("size", "Size", [
    ["xs", "XS"],
    ["s", "S"],
    ["m", "M"],
    ["l", "L"],
    ["xl", "XL"],
    ["xxl", "XXL"],
    ["3xl", "3XL"],
    ...(freeSize ? [["free", "Free Size"] as [string, string]] : []),
    ["mixed", "Mixed sizes"],
  ]);
const sizeDetails = (placeholder: string) => text("sizeDetails", "Size Details", placeholder);
const lotType = select("lotType", "Single or Bundle", [["single", "Single item"], ["bundle", "Bundle"]]);

const range = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => from + i);
/** Shoe sizes in each market's system: UK sizes in the UK and India, EU in Singapore. */
const SHOE_SIZES: Record<string, [string, string][]> = {
  GB: range(3, 13).map((n) => [`uk_${n}`, `UK ${n}`]),
  IN: range(3, 12).map((n) => [`uk_${n}`, `UK / India ${n}`]),
  SG: range(35, 46).map((n) => [`eu_${n}`, `EU ${n}`]),
};

/** Traditional wear each market lists. */
const ETHNIC_TYPES: Record<string, [string, string][]> = {
  IN: [["saree", "Saree"], ["kurta", "Kurta & Salwar"], ["lehenga", "Lehenga"], ["sherwani", "Sherwani"], ["other", "Other"]],
  GB: [["saree", "Saree"], ["kurta", "Kurta & Salwar"], ["lehenga", "Lehenga"], ["sherwani", "Sherwani"], ["abaya", "Abaya"], ["african", "African Wear"], ["other", "Other"]],
  SG: [["saree", "Saree"], ["kurta", "Kurta & Salwar"], ["kebaya", "Kebaya"], ["baju", "Baju Kurung"], ["cheongsam", "Cheongsam"], ["other", "Other"]],
};

/** Gold purity in each market's own marking. */
const GOLD_PURITY: Record<string, [string, string][]> = {
  IN: [["24k", "24K"], ["22k", "22K"], ["18k", "18K"], ["14k", "14K"]],
  GB: [["24k", "24ct"], ["22k", "22ct"], ["18k", "18ct"], ["14k", "14ct"], ["9k", "9ct"]],
  SG: [["999", "999"], ["916", "916"], ["750", "750"], ["585", "585"]],
};

const priceSection: FormSection = {
  title: "Price & Delivery",
  fields: [
    { key: "salePrice", type: "currency", label: "Price", required: true, min: 1, width: "half" },
    { key: "negotiable", type: "select", label: "Negotiable", options: YES_NO, width: "half" },
    { key: "dealMethod", type: "multiselect", label: "Deal Method", options: pairs([["meetup", "Meet-up / Collection"], ["delivery", "Delivery / Courier"]]) },
  ],
};

export function fashionSections(subcategory: string, country: string): FormSection[] | null {
  const item = (fields: FormFieldDef[]): FormSection[] => [basics, { title: "Item", fields }, priceSection];

  switch (subcategory) {
    case "Men's Clothing":
      return item([
        itemType([["tops", "T-Shirts & Tops"], ["shirts", "Shirts"], ["knitwear", "Knitwear"], ["bottoms", "Jeans & Trousers"], ["shorts", "Shorts"], ["jackets", "Jackets & Coats"], ["suits", "Suits & Blazers"], ["sport", "Sportswear"], ["other", "Other"]]),
        clothingSize(),
        sizeDetails("e.g. 40R, W32 L30"),
        lotType,
        condition,
        brand,
        colour,
        text("material", "Material"),
      ]);

    case "Women's Clothing":
      return item([
        itemType([["tops", "Tops & Blouses"], ["dresses", "Dresses"], ["skirts", "Skirts"], ["bottoms", "Jeans & Trousers"], ["knitwear", "Knitwear"], ["jackets", "Jackets & Coats"], ["workwear", "Workwear & Suits"], ["active", "Activewear"], ["other", "Other"]]),
        clothingSize(),
        sizeDetails("e.g. UK 12, EU 40"),
        lotType,
        condition,
        brand,
        colour,
        text("material", "Material"),
      ]);

    case "Traditional & Ethnic Wear":
      return item([
        itemType(ETHNIC_TYPES[country] ?? ETHNIC_TYPES.IN),
        forWhom([["women", "Women"], ["men", "Men"], ["kids", "Kids"]]),
        select("occasion", "Occasion", [["wedding", "Wedding"], ["festive", "Festive"], ["party", "Party"], ["everyday", "Everyday"]]),
        clothingSize(true),
        sizeDetails("e.g. Blouse 36, UK 10–12"),
        condition,
        text("material", "Fabric", "e.g. Banarasi silk"),
        colour,
        brand,
      ]);

    case "Shoes & Footwear":
      return item([
        itemType([["trainers", "Trainers & Sneakers"], ["boots", "Boots"], ["heels", "Heels"], ["flats", "Flats & Loafers"], ["sandals", "Sandals"], ["formal", "Formal"], ["sports", "Sports Shoes"], ["slippers", "Slippers"], ["other", "Other"]]),
        forWhom([["men", "Men"], ["women", "Women"], ["kids", "Kids"], ["unisex", "Unisex"]], true),
        select("shoeSize", "Shoe Size", SHOE_SIZES[country] ?? SHOE_SIZES.IN),
        sizeDetails("e.g. UK 5.5, EU 38.5"),
        condition,
        brand,
        colour,
        { key: "originalBox", type: "select", label: "Original Box", options: YES_NO, width: "half" },
      ]);

    case "Bags & Accessories":
      return item([
        itemType([
          ["handbag", "Handbag"],
          ["shoulder", "Shoulder & Crossbody"],
          ["tote", "Tote"],
          ["backpack", "Backpack"],
          ["wallet", "Wallets & Purses"],
          ["luggage", "Luggage & Travel Bags"],
          ["belt", "Belts"],
          ["sunglasses", "Sunglasses"],
          ["scarf", "Scarves & Hats"],
          ["other", "Other"],
        ]),
        select("material", "Material", [["leather", "Leather"], ["faux_leather", "Faux Leather"], ["canvas", "Canvas"], ["nylon", "Nylon & Fabric"], ["other", "Other"]]),
        forWhom(MEN_WOMEN_UNISEX),
        condition,
        brand,
        colour,
      ]);

    case "Jewellery & Watches":
      return item([
        itemType([["necklace", "Necklace"], ["earrings", "Earrings"], ["bracelet", "Bracelet"], ["ring", "Ring"], ["watch", "Watch"], ["set", "Jewellery Set"], ["other", "Other"]]),
        select("metal", "Metal", [["gold", "Gold"], ["silver", "Silver"], ["platinum", "Platinum"], ["steel", "Stainless Steel"], ["costume", "Fashion / Costume"], ["other", "Other"]]),
        select("goldPurity", "Gold Purity", GOLD_PURITY[country] ?? GOLD_PURITY.IN, shownFor("metal", ["gold"])),
        select("movement", "Movement", [["automatic", "Automatic"], ["quartz", "Quartz"], ["manual", "Manual"], ["smart", "Smartwatch"]], shownFor("itemType", ["watch"])),
        select("boxPapers", "Box & Papers", [["both", "Box and papers"], ["box", "Box only"], ["papers", "Papers only"], ["none", "Neither"]], shownFor("itemType", ["watch"])),
        forWhom(MEN_WOMEN_UNISEX),
        condition,
        brand,
      ]);

    case "Designer & Luxury":
      return item([
        itemType([["bag", "Bag"], ["clothing", "Clothing"], ["shoes", "Shoes"], ["watch", "Watch"], ["jewellery", "Jewellery"], ["accessories", "Accessories"]], "Category"),
        select("brand", "Designer", [
          ["lv", "Louis Vuitton"],
          ["gucci", "Gucci"],
          ["prada", "Prada"],
          ["chanel", "Chanel"],
          ["hermes", "Hermès"],
          ["dior", "Dior"],
          ["burberry", "Burberry"],
          ["rolex", "Rolex"],
          ["cartier", "Cartier"],
          ["other", "Other designer"],
        ], { required: true }),
        { ...text("otherBrand", "Designer Name", "e.g. Mulberry"), ...shownFor("brand", ["other"]) },
        select(
          "authenticity",
          "Proof of Authenticity",
          [["receipt", "Original receipt"], ["certificate", "Authenticity certificate"], ["authenticated", "Authenticated by a service"], ["none", "No proof"]],
          { required: true, hint: "Replicas and copies are removed." },
        ),
        { key: "included", type: "multiselect", label: "What's Included", options: pairs([["box", "Box"], ["dust_bag", "Dust bag"], ["receipt", "Receipt"], ["papers", "Cards & papers"]]) },
        forWhom(MEN_WOMEN_UNISEX),
        condition,
        text("size", "Size", "e.g. UK 14, 30 cm"),
        colour,
      ]);

    case "Vintage & Preloved":
      return item([
        select("era", "Era", [["pre70", "1970s & Earlier"], ["80s", "1980s"], ["90s", "1990s"], ["y2k", "2000s (Y2K)"], ["preloved", "Recent Preloved"]], { required: true }),
        select("itemType", "Type", [["clothing", "Clothing"], ["shoes", "Shoes"], ["bags", "Bags & Accessories"], ["jewellery", "Jewellery"]], { required: true }),
        forWhom(MEN_WOMEN_UNISEX),
        clothingSize(),
        sizeDetails("e.g. W32 L30"),
        condition,
        brand,
        colour,
      ]);

    default:
      return null;
  }
}
