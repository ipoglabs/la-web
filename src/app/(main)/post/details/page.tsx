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


// ✅ CATEGORY NORMALIZATION (FROM OLD)
const categoryAlias: Record<string, string> = {
  Property: "property",
  Jobs: "job",
  Vehicles: "vehicles",
  Services: "services",
  Pets: "pet",
  "For Sale": "forsale",
  Business: "business",
  "Community & Events": "community",
  "Special Offers": "specialOffers",
};


// ✅ FULL FORM MAPPING (MERGED + FIXED)
const formMapping: Record<string, Record<string, string>> = {
  property: {
    "To Buy": "BuyForm",
    "To Rent": "RentForm",
    Commercial: "CommercialForm",
    "For Students": "ForStudentForm",
    "Holiday Rental": "HolidayRentalForm",
    "Room Rental": "RoomRentalForm",
    "Land for Sale/Lease": "PropertySaleForm", // ✅ FIXED CASE
    Wanted: "WantedForm",
  },

  job: {
    "Full Time": "FulltimeForm",
    "Part Time": "ParttimeForm",
    Freelance: "FreelanceForm", // ✅ match your file
    Internship: "InternshipForm",
    "Temptoary & Sesonal": "TemptoaryForm",
    Wanted: "WantedForm",
  },

  vehicles: {
    Car: "CarForm",
    Motorcycle: "MotorCycleForm",
    Van: "VanForm",
    Truck: "TruckForm",
    "Parts & Accessories": "PartsForm",
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
    Wanted: "WantedForm",
  },

  pet: {
    "For Sale": "ForSaleForm",
    Adoption: "AdoptionForm",
    Service: "ServiceForm",
    Accessories: "AccessoriesForm",
    "Lost & Found": "LostAndFoundForm",
    Wanted: "WantedForm",
  },

  forsale: {
    Electronics: "ElectronicsForm",
    "Home & Furniture": "FurnitureForm",
    "Office Supplies": "OfficeSuppliesForm",
    "Fashion & Accessories": "FashionForm",
    "Sports & Fitness": "SportsForm",
    "Toys & Games": "GamesForm",
    "Book, music & Media": "MediaForm",
    "Baby & Kids": "KidsForm",
    "Health & Beauty": "HealthForm",
    "Garden & Outdoors": "GardenForm",
    "Hobies & Collections": "HobiesForm",
    Miscellaneous: "MiscellaneousForm",
    Wanted: "WantedForm",
  },

  business: {
    "Business for Sale/Lease": "SaleForm",
    "B2B Service": "B2BServiceForm",
    "B2C Service": "B2CServiceForm",
    "Freelance / Contractors": "FreelanceForm",
    "Partnership Opportunities": "PartnershipForm",
    "Equipment and Supplies": "EquipmentForm",
    "Start-up Support": "Start-upForm",
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
    Wanted: "WantedForm",
  },

  specialOffers: {
    "Banking & Financial Deals": "BankingForm",
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

    return subFormName
      ? `${normalizedCategory}/${subFormName}`
      : null;
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
        <PageHeader
          title="Advertisement Details"
          description="Fill in the main details."
        />

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
