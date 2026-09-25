// Default "Special Offers" post-form schemas.
// Every offer shares the price / discount / validity block; each subcategory
// adds the handful of fields specific to it.

import { getVehicleConfig } from "@/config/vehicle";
import type { FormFieldDef, FormSection } from "../types";
import { basics, opts, pairs } from "./shared";

const offerTerms = (extra: FormFieldDef[] = []): FormSection => ({
  title: "Offer",
  fields: [
    { key: "price", type: "currency", label: "Offer Price", min: 0, width: "half" },
    { key: "discount", type: "text", label: "Discount / Deal", placeholder: "e.g. 20% off", width: "half" },
    { key: "couponCode", type: "text", label: "Coupon Code", width: "half" },
    { key: "deadline", type: "date", label: "Valid Until", width: "half" },
    ...extra,
    { key: "website", type: "text", label: "Website / Booking Link", placeholder: "https://" },
    { key: "terms", type: "textarea", label: "Terms & Conditions" },
  ],
});

const provider = (label = "Provider / Business Name"): FormFieldDef => ({ key: "providerName", type: "text", label, width: "half" });
const condition: FormFieldDef = { key: "condition", type: "select", label: "Condition", options: pairs([["new", "New"], ["used", "Used"], ["refurbished", "Refurbished"]]) };
const delivery: FormFieldDef = { key: "deliveryOption", type: "select", label: "Delivery Option", options: pairs([["pickup", "Pickup"], ["delivery", "Delivery"], ["both", "Both"]]) };
const mode: FormFieldDef = { key: "mode", type: "select", label: "Mode", options: pairs([["online", "Online"], ["offline", "In Person"], ["hybrid", "Hybrid"]]) };

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
  switch (subcategory) {
    case "Banking & Finance":
      return [
        basics,
        {
          title: "Deal",
          fields: [
            {
              key: "dealType",
              type: "select",
              label: "Deal Type",
              required: true,
              options: pairs([["loan", "Loan"], ["credit-card", "Credit Card"], ["investment", "Investment"], ["insurance", "Insurance"], ["savings", "Savings"], ["other", "Other"]]),
            },
            provider("Bank / Financial Institution"),
            { key: "interestRate", type: "text", label: "Interest Rate / Returns", width: "half" },
            { key: "tenure", type: "text", label: "Tenure", width: "half" },
            { key: "minBudget", type: "currency", label: "Minimum Amount", min: 0, width: "half" },
            { key: "maxBudget", type: "currency", label: "Maximum Amount", min: 0, gteField: "minBudget", width: "half" },
            { key: "eligibility", type: "textarea", label: "Eligibility Criteria" },
            { key: "documents", type: "textarea", label: "Required Documents" },
          ],
        },
        offerTerms(),
      ];

    case "Travel & Tourism":
      return [
        basics,
        {
          title: "Trip",
          fields: [
            {
              key: "tourType",
              type: "select",
              label: "Tour Type",
              options: pairs([["domestic", "Domestic"], ["international", "International"], ["adventure", "Adventure"], ["cruise", "Cruise"], ["honeymoon", "Honeymoon"], ["other", "Other"]]),
            },
            { key: "destination", type: "text", label: "Destination", width: "half" },
            { key: "durationText", type: "text", label: "Duration", placeholder: "e.g. 5 nights", width: "half" },
            { key: "startDate", type: "date", label: "Start Date", width: "half" },
            { key: "endDate", type: "date", label: "End Date", width: "half" },
            { key: "accommodation", type: "select", label: "Accommodation", options: pairs([["hotel", "Hotel"], ["resort", "Resort"], ["hostel", "Hostel"], ["camp", "Camp"], ["other", "Other"]]) },
            { key: "transport", type: "select", label: "Transport", options: pairs([["flight", "Flight"], ["train", "Train"], ["bus", "Bus"], ["cruise", "Cruise"], ["own", "Own Transport"]]) },
            { key: "packageDetails", type: "textarea", label: "Itinerary / Inclusions" },
            provider("Agency Name"),
          ],
        },
        offerTerms(),
      ];

    case "Retail & Shopping":
      return [
        basics,
        {
          title: "Product",
          fields: [
            { key: "brand", type: "text", label: "Brand", width: "half" },
            { key: "model", type: "text", label: "Model", width: "half" },
            { key: "size", type: "text", label: "Size / Dimensions", width: "half" },
            { key: "color", type: "text", label: "Color", width: "half" },
            condition,
            delivery,
            { key: "returnPolicy", type: "text", label: "Return Policy" },
          ],
        },
        offerTerms(),
      ];

    case "Food & Dining":
      return [
        basics,
        {
          title: "Venue",
          fields: [
            {
              key: "foodCategory",
              type: "select",
              label: "Category",
              options: pairs([["restaurant", "Restaurant"], ["cafe", "Cafe"], ["delivery", "Delivery"], ["catering", "Catering"], ["streetfood", "Street Food"], ["other", "Other"]]),
            },
            provider("Restaurant / Business Name"),
            { key: "cuisineType", type: "text", label: "Cuisine Type", width: "half" },
            { key: "openingHours", type: "text", label: "Opening Hours", width: "half" },
            { key: "deliveryAvailable", type: "select", label: "Delivery", options: pairs([["yes", "Yes"], ["no", "No"], ["thirdparty", "Via Delivery Apps"]]) },
          ],
        },
        offerTerms(),
      ];

    case "Electronics & Gadgets":
      return [
        basics,
        {
          title: "Product",
          fields: [
            {
              key: "productType",
              type: "select",
              label: "Product Type",
              options: pairs([["mobile", "Mobile"], ["laptop", "Laptop"], ["tv", "TV"], ["camera", "Camera"], ["audio", "Audio"], ["accessories", "Accessories"], ["other", "Other"]]),
            },
            { key: "brand", type: "text", label: "Brand", width: "half" },
            { key: "model", type: "text", label: "Model", width: "half" },
            condition,
            { key: "warranty", type: "text", label: "Warranty", width: "half" },
          ],
        },
        offerTerms(),
      ];

    case "Health & Wellness":
      return [
        basics,
        {
          title: "Service",
          fields: [
            {
              key: "serviceType",
              type: "select",
              label: "Category",
              options: pairs([["fitness", "Fitness"], ["nutrition", "Nutrition"], ["mental-health", "Mental Health"], ["wellness-products", "Wellness Products"], ["therapy", "Therapy"], ["other", "Other"]]),
            },
            provider("Provider Name"),
            { key: "qualification", type: "text", label: "Certifications", width: "half" },
            { key: "consultationMode", type: "select", label: "Mode", options: pairs([["online", "Online"], ["in-person", "In Person"], ["both", "Both"]]) },
          ],
        },
        offerTerms(),
      ];

    case "Education & Learning":
      return [
        basics,
        {
          title: "Course",
          fields: [
            {
              key: "educationType",
              type: "select",
              label: "Education Category",
              options: pairs([["school", "School"], ["college", "College"], ["vocational", "Vocational"], ["online-course", "Online Course"], ["other", "Other"]]),
            },
            provider("Institution / Provider"),
            { key: "durationText", type: "text", label: "Duration", width: "half" },
            mode,
          ],
        },
        offerTerms(),
      ];

    case "Holiday & Seasonal Offers":
      return [
        basics,
        {
          title: "Offer",
          fields: [
            {
              key: "offerCategory",
              type: "select",
              label: "Category",
              options: pairs([["holiday-packages", "Holiday Packages"], ["seasonal-sale", "Seasonal Sale"], ["special-offers", "Special Offers"], ["other", "Other"]]),
            },
            provider(),
            { key: "startDate", type: "date", label: "Starts", width: "half" },
            { key: "endDate", type: "date", label: "Ends", width: "half" },
          ],
        },
        offerTerms(),
      ];

    case "Entertainment":
      return [
        basics,
        {
          title: "Event",
          fields: [
            { key: "eventType", type: "select", label: "Event Type", options: pairs([["concert", "Concert"], ["movie", "Movie"], ["theater", "Theatre"], ["festival", "Festival"], ["other", "Other"]]) },
            provider("Organiser"),
            { key: "startDate", type: "date", label: "Event Date", width: "half" },
            { key: "workingHours", type: "text", label: "Timings", placeholder: "e.g. 7pm – 10pm", width: "half" },
            { key: "ageRestriction", type: "select", label: "Age Restriction", options: pairs([["all", "All Ages"], ["13+", "13+"], ["18+", "18+"], ["21+", "21+"]]) },
          ],
        },
        offerTerms(),
      ];

    case "Home & Living":
      return [
        basics,
        {
          title: "Product",
          fields: [
            {
              key: "productType",
              type: "select",
              label: "Category",
              options: pairs([["furniture", "Furniture"], ["home-decor", "Home Decor"], ["appliances", "Appliances"], ["kitchenware", "Kitchenware"], ["other", "Other"]]),
            },
            { key: "brand", type: "text", label: "Brand", width: "half" },
            { key: "material", type: "text", label: "Material", width: "half" },
            { key: "dimensions", type: "text", label: "Dimensions", width: "half" },
            { key: "warranty", type: "text", label: "Warranty", width: "half" },
            condition,
            delivery,
          ],
        },
        offerTerms(),
      ];

    case "Automotive": {
      const c = getVehicleConfig(country);
      return [
        basics,
        {
          title: "Vehicle",
          fields: [
            { key: "vehicleType", type: "select", label: "Vehicle Type", options: pairs([["car", "Car"], ["motorcycle", "Motorcycle"], ["truck", "Truck"], ["van", "Van"]]) },
            { key: "make", type: "text", label: "Make", width: "half" },
            { key: "model", type: "text", label: "Model", width: "half" },
            { key: "year", type: "number", label: "Year", width: "half" },
            { key: "kms", type: "number", label: "KMs Driven", unit: "km", min: 0, width: "half" },
            { key: "condition", type: "select", label: "Condition", options: opts(["New", "Used", "Certified Pre-Owned"]) },
            { key: "fuelType", type: "select", label: "Fuel Type", options: c.carFuelTypes },
          ],
        },
        offerTerms(),
      ];
    }

    case "Miscellaneous":
      return [
        basics,
        {
          title: "Item",
          fields: [
            { key: "brand", type: "text", label: "Brand", width: "half" },
            { key: "model", type: "text", label: "Model", width: "half" },
            condition,
            delivery,
          ],
        },
        offerTerms(),
      ];

    default:
      return null;
  }
}
