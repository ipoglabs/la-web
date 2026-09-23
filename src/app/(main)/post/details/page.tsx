"use client";

import React, { useMemo, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { toast } from "sonner";

import PageHeader from "../components/PageHeader";
import PostFooter from "../components/PostFooter";

import { usePostFormStore } from "../store/postFormStore";
import { useWizardGuard } from "../wizard/guard";
import { normalizeCategory } from "@/posting/config/normalize";
import { validatePost } from "@/posting/validation/validatePost";
import { useAuthStore } from "@/store/authStore";
import { LaChip } from "@/components/la/la-chip";


// ✅ CATEGORY NORMALIZATION
// Keys are the exact `label` strings from src/config/categories/ — the single
// source of truth shared with the landing page and Create Alert. "For Sale"
// no longer exists there (split into the 13 categories below); the 8 direct
// carry-overs keep their original form-building alias so posting/config/*
// and the existing form folders don't need renaming.
const categoryAlias: Record<string, string> = {
  Property: "property",
  Jobs: "job",
  Vehicles: "vehicles",
  Services: "services",
  Pets: "pet",
  Business: "business",
  Community: "community",
  "Special Offers": "specialOffers",

  // Categories promoted out of the old "For Sale" bucket — each gets its own
  // namespace here (so identically-worded subcategories across categories,
  // e.g. "Accessories", can't collide) but reuses an existing form component
  // via a "folder/Form" value in formMapping below.
  "Baby & Kids": "babyKids",
  "Books, Media & Collectibles": "booksMediaCollectibles",
  Education: "education",
  "Electronics & Tech": "electronicsTech",
  "Fashion & Clothing": "fashionClothing",
  "Food & Dining": "foodDining",
  "Free & Giveaway": "freeGiveaway",
  "Health & Beauty": "healthBeauty",
  "Home & Furniture": "homeFurniture",
  "Musical Instruments": "musicalInstruments",
  "Sports & Outdoors": "sportsOutdoors",
  "Tickets & Vouchers": "ticketsVouchers",
  "Travel & Stays": "travelStays",
};


// ✅ FULL FORM MAPPING (MERGED + FIXED)
// Values are either a bare form name (resolved under the category's own
// folder, e.g. "property/BuyForm") or an explicit "folder/Form" path — used
// below to point a promoted category at an existing form it reuses without
// duplicating it (see importKey in DetailsPage).
const formMapping: Record<string, Record<string, string>> = {
  property: {
    "To Buy": "BuyForm",
    "To Rent": "RentForm",
    Commercial: "CommercialForm",
    "For Students": "ForStudentForm",
    "Holiday Rental": "HolidayRentalForm",
    "Room Rental": "RoomRentalForm",
    "Land for Sale / Lease": "PropertySaleForm",
    "New Projects / Off-Plan": "NewProjectsForm",
    Wanted: "WantedForm",
  },

  job: {
    "Full Time": "FulltimeForm",
    "Part Time": "ParttimeForm",
    Freelance: "FreelanceForm", // ✅ match your file
    Internship: "InternshipForm",
    "Temporary / Seasonal": "TemptoaryForm",
    Wanted: "WantedForm",
  },

  vehicles: {
    Cars: "CarForm",
    Motorcycle: "MotorCycleForm",
    Van: "VanForm",
    Truck: "TruckForm",
    "Parts & Accessories": "PartsForm",
    Boats: "BoatForm",
    "Electric Vehicles": "ElectricVehicleForm",
    Wanted: "WantedForm",
  },

  services: {
    "Home Services": "HomeServicesForm",
    "Business Services": "BusinessServicesForm",
    "Health & Fitness": "HealthForm",
    Tutoring: "TutoringForm",
    "Education & Learning": "EducationForm",
    "Travel & Tourism": "TravelForm",
    "Food & Dining": "FoodServicesForm",
    "Technology & Gadgets": "TechnologyForm",
    "Other Services": "OtherServicesForm",
    "Creative Services": "CreativeServicesForm",
    Wanted: "WantedForm",
  },

  pet: {
    "For Sale": "ForSaleForm",
    Adoption: "AdoptionForm",
    "Pet Care": "ServiceForm",
    Accessories: "AccessoriesForm",
    "Lost & Found": "LostAndFoundForm",
    Wanted: "WantedForm",
  },

  business: {
    "Business For Sale / Lease": "SaleForm",
    "B2B Service": "B2BServiceForm",
    "B2C Service": "B2CServiceForm",
    "Freelance Contractors": "FreelanceForm",
    "Partnership Opportunities": "PartnershipForm",
    "Equipment & Supplies": "EquipmentForm",
    "Startup Support": "Start-upForm",
    "Training Opportunities": "TrainingForm",
    "Franchise Opportunities": "FranchiseForm",
    "Business Events": "BusinessForm",
    "Financial Services": "FinancialForm",
    Miscellaneous: "MiscellaneousForm",
    Wanted: "WantedForm",
  },

  community: {
    "Lost & Found": "LostForm",
    Events: "EventsForm",
    Classes: "ClassesForm",
    "Volunteering & Charity": "VolunteeringForm",
    "Classes & Courses": "CoursesForm",
    Announcement: "AnnouncementForm",
    "Child & Family Activities": "ActivitiesForm",
    "General / Others": "GeneralForm",
    "Rideshare & Carpool": "RideshareForm",
    Wanted: "WantedForm",
  },

  specialOffers: {
    "Banking & Finance": "BankingForm",
    "Travel & Tourism": "TravelForm",
    "Retail & Shopping": "RetailForm",
    "Food & Dining": "FoodForm",
    "Electronics & Gadgets": "ElectronicsForm",
    "Health & Wellness": "HealthForm",
    "Education & Learning": "EducationForm",
    "Holiday & Seasonal Offers": "HolidayForm",
    Entertainment: "EntertainmentForm",
    "Home & Living": "HomeForm",
    Automotive: "AutomotiveForm",
    Miscellaneous: "MiscellaneousForm",
  },

  // ── Categories promoted from the old "For Sale" bucket ──────────────────
  // No dedicated forms exist yet for these finer-grained subcategories, so
  // every subcategory in a given category reuses that category's closest
  // existing form (all under components/form/forsale or components/form/services).
  babyKids: {
    "Toys & Games": "forsale/KidsForm",
    "Baby Gear & Equipment": "forsale/KidsForm",
    "Baby & Kids Clothing": "forsale/KidsForm",
    "Childcare & Nurseries": "forsale/KidsForm",
    "School Supplies & Books": "forsale/KidsForm",
    "Kids Classes & Activities": "forsale/KidsForm",
  },

  booksMediaCollectibles: {
    "Books & Comics": "forsale/MediaForm",
    "Vinyl Records": "forsale/MediaForm",
    "DVDs & Blu-ray": "forsale/MediaForm",
    "Board Games & Puzzles": "forsale/MediaForm",
    "Collectibles & Memorabilia": "forsale/MediaForm",
  },

  education: {
    "Tutors & Coaching": "services/EducationForm",
    "Online Courses": "services/EducationForm",
    "Study Materials": "services/EducationForm",
    "Schools & Colleges": "services/EducationForm",
    "Language Classes": "services/EducationForm",
  },

  electronicsTech: {
    "Mobile Phones & Tablets": "forsale/ElectronicsForm",
    "Laptops & Computers": "forsale/ElectronicsForm",
    "TVs & Audio": "forsale/ElectronicsForm",
    Gaming: "forsale/ElectronicsForm",
    "Cameras & Photography": "forsale/ElectronicsForm",
    "Computer Parts & Components": "forsale/ElectronicsForm",
    "Wearables & Smart Devices": "forsale/ElectronicsForm",
    "Tech Accessories": "forsale/ElectronicsForm",
  },

  fashionClothing: {
    "Men's Clothing": "forsale/FashionForm",
    "Women's Clothing": "forsale/FashionForm",
    "Traditional & Ethnic Wear": "forsale/FashionForm",
    "Shoes & Footwear": "forsale/FashionForm",
    "Bags & Accessories": "forsale/FashionForm",
    "Jewellery & Watches": "forsale/FashionForm",
    "Designer & Luxury": "forsale/FashionForm",
    "Vintage & Preloved": "forsale/FashionForm",
  },

  foodDining: {
    "Home Cooked Meals": "services/FoodServicesForm",
    "Catering Services": "services/FoodServicesForm",
    "Tiffin Services": "services/FoodServicesForm",
    "Restaurant Deals": "services/FoodServicesForm",
    "Cloud Kitchens": "services/FoodServicesForm",
    "Baked Goods & Desserts": "services/FoodServicesForm",
  },

  freeGiveaway: {
    Furniture: "forsale/MiscellaneousForm",
    Clothing: "forsale/MiscellaneousForm",
    Electronics: "forsale/MiscellaneousForm",
    Food: "forsale/MiscellaneousForm",
    "Kids Items": "forsale/MiscellaneousForm",
    General: "forsale/MiscellaneousForm",
  },

  healthBeauty: {
    "Fitness Classes & Training": "forsale/HealthForm",
    "Salons & Spas": "forsale/HealthForm",
    "Medical & Therapy": "forsale/HealthForm",
    "Beauty Products": "forsale/HealthForm",
    "Wellness & Nutrition": "forsale/HealthForm",
    "Mental Health & Counselling": "forsale/HealthForm",
  },

  homeFurniture: {
    "Sofas & Seating": "forsale/FurnitureForm",
    "Beds & Bedroom": "forsale/FurnitureForm",
    "Tables, Desks & Dining": "forsale/FurnitureForm",
    "Kitchen & Appliances": "forsale/FurnitureForm",
    "Storage & Shelving": "forsale/FurnitureForm",
    "Home Decor & Accessories": "forsale/FurnitureForm",
    "Garden & Outdoor": "forsale/FurnitureForm",
    "DIY, Tools & Hardware": "forsale/FurnitureForm",
  },

  musicalInstruments: {
    "Guitars & Bass": "forsale/HobiesForm",
    "Keyboards & Piano": "forsale/HobiesForm",
    "Drums & Percussion": "forsale/HobiesForm",
    "DJ & Audio Gear": "forsale/HobiesForm",
    "Wind, Brass & Strings": "forsale/HobiesForm",
    Accessories: "forsale/HobiesForm",
  },

  sportsOutdoors: {
    "Fitness Equipment": "forsale/SportsForm",
    "Team Sports": "forsale/SportsForm",
    "Outdoor & Adventure": "forsale/SportsForm",
    "Water Sports": "forsale/SportsForm",
    "Sportswear & Footwear": "forsale/SportsForm",
    "Fitness Classes & Coaching": "forsale/SportsForm",
  },

  ticketsVouchers: {
    "Event Tickets": "forsale/MiscellaneousForm",
    "Sport Tickets": "forsale/MiscellaneousForm",
    "Gift Cards": "forsale/MiscellaneousForm",
    "Experience Days": "forsale/MiscellaneousForm",
    "Travel Vouchers": "forsale/MiscellaneousForm",
  },

  travelStays: {
    "Holiday Rentals": "services/TravelForm",
    "Hotels & Guesthouses": "services/TravelForm",
    "Tour Packages": "services/TravelForm",
    "Staycations & Day Trips": "services/TravelForm",
    "Travel Services": "services/TravelForm",
    "Travel Accessories": "services/TravelForm",
  },
};


export default function DetailsPage() {
  useWizardGuard("details");

  const router = useRouter();

  const category = usePostFormStore((s) => s.category);
  const subcategory = usePostFormStore((s) => s.subcategory);
  const setField = usePostFormStore((s) => s.setField);

  const user = useAuthStore((s) => s.user);

 // ✅ AUTO-FILL SELLER (SAFE MERGE — FINAL FIX)
useEffect(() => {
  if (!user) return;

  const existing = usePostFormStore.getState().sellerInfo;

  const fullName =
    user.fullName ||
    [user.firstName, user.lastName].filter(Boolean).join(" ").trim();

  setField("sellerInfo", {
    name: existing?.name || fullName,
    email: existing?.email || user.email,

    // 🔥 FIX: DO NOT OVERRIDE EXISTING
    phone:
      existing?.phone ||
      user.primaryNumber ||
      user.secondaryNumber1 ||
      "",
  });
}, [user, setField]);

  // ✅ IMPORT KEY (FIXED)
  const importKey = useMemo(() => {
    if (!category || !subcategory) return null;

    const normalizedCategory =
      categoryAlias[category] || normalizeCategory(category);

    const subFormName = formMapping[normalizedCategory]?.[subcategory];
    if (!subFormName) return null;

    // Promoted categories point straight at the existing form they reuse
    // (e.g. "forsale/ElectronicsForm"); everything else resolves under its
    // own category folder as before.
    return subFormName.includes("/")
      ? subFormName
      : `${normalizedCategory}/${subFormName}`;
  }, [category, subcategory]);

  const SpecificForm = useMemo(() => {
    if (!importKey) return null;

    return dynamic(() => import(`@/components/form/${importKey}`), {
      ssr: false,
      loading: () => <p>Loading form...</p>,
    });
  }, [importKey]);

  const handleNext = useCallback(() => {
    if (!category || !subcategory) {
      toast.error("Category or subcategory missing.");
      return;
    }

    const store = usePostFormStore.getState();

    const errors = validatePost(
      normalizeCategory(category),
      subcategory.toLowerCase(),
      store
    );

    if (Object.keys(errors).length > 0) {
      toast.error(Object.values(errors)[0]);
      return;
    }

    router.push("/post/upload-photo");
  }, [category, subcategory, router]);

  return (
    <>

      <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
        <PageHeader title="Advertisement Details" />

        {category && subcategory && (
          <div className="w-full max-w-xl flex justify-center mb-4">
            <LaChip label={`${category} › ${subcategory}`} />
          </div>
        )}

        <div className="w-full max-w-xl mt-4">
          {SpecificForm ? <SpecificForm /> : <p>No form found</p>}

          <PostFooter
            showBack
            showNext
            onNext={handleNext}
            onBack={() => router.push("/post/select-category")}
          />
        </div>
      </main>
    </>
  );
}
