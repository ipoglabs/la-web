// src/app/post/details/page.tsx
"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { usePostFormStore } from "../store/postFormStore";
import { Button } from "@/components/ui/button";
import AppHeader from "@/app/components/AppHeader/appHeader";
import AppFooter from "@/app/components/AppFooter/appFooter";

// ✅ alias mapping (UI name → formMapping key)
const categoryAlias: Record<string, string> = {
  "Property": "property",
  "Jobs": "job",
  "Vehicles": "vehicles",
  "Services": "services",
  "Pets": "pet",
  "For Sale": "forsale",
  "Business": "business",
  "Community & Events": "community",
  "Special Offers": "specialOffers",
};

// ✅ map subcategory to exact file name
const formMapping: Record<string, Record<string, string>> = {
  property: {
    "To Buy": "BuyForm",
    "To Rent": "RentForm",
    "Commercial": "CommercialForm",
    "For Students": "ForStudentForm",
    "Holiday Rental": "HolidayRental",
    "Room Rental": "RoomRentalForm",
    "Land for Sale/Lease": "SaleForm",
    "Wanted": "WantedForm",
  },
  job: {
    "Full Time": "FulltimeForm",
    "Part Time": "ParttimeForm",
    "Freelance": "FreelanceForm",
    "Internship": "InternshipForm",
    "Temptoary & Sesonal": "TemptoaryForm",
    "Wanted": "WantedForm",
  },
  vehicles: {
    "Car": "CarForm",
    "Motorcycle": "MotorCycleForm",
    "Van": "VanForm",
    "Truck": "TruckForm",
    "Parts & Accessories": "PartsForm",
    "Wanted": "WantedForm",
  },
  services: {
    "Home Services": "HomeServicesForm",
    "Business Services": "BusinessServicesForm",
    "Health & Fitness": "HealthForm",
    "Tutoring": "TutoringForm",
    "Education & Learning": "EducationForm",
    "Travel & Tourism": "TravelForm",
    "Food & Dining": "FoodServicesForm",
    "Technology & Gadgets": "TechnologyForm",
    "Other Services": "OtherServicesForm",
    "Wanted": "WantedForm",
  },
  pet: {
    "For Sale": "ForSaleForm",
    "Adoption": "AdoptionForm",
    "Service": "ServiceForm",
    "Accessories": "AccessoriesForm",
    "Lost & Found": "LostAndFoundForm",
    "Wanted": "WantedForm",
  },
  forsale: {
    "Electronics": "ElectronicsForm",
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
    "Miscellaneous": "MiscellaneousForm",
    "Wanted": "WantedForm",
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
    "Miscellaneous": "MiscellaneousForm",
    "Wanted": "WantedForm",
  },
  community: {
    "Lost & Found": "LostForm",
    "Events": "EventsForm",
    "Classes": "ClassesForm",
    "Volunteering & Charity": "VolunteeringForm",
    "Classes & Courses": "CoursesForm",
    "Announcement": "AnnouncementForm",
    "Child & Family Activities": "ActivitiesForm",
    "General / Others": "GeneralForm",
    "Wanted": "WantedForm",
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
    "Entertainment": "EntertainmentForm",
    "Home & Living": "HomeForm",
    "Automotive": "AutomotiveForm",
    "Miscellaneous": "MiscellaneousForm",
  },
};

export default function PostFormTemplate() {
  const router = useRouter();

  // ✅ Only subscribe to the two fields you actually need here
  const category = usePostFormStore((s) => s.category);
  const subcategory = usePostFormStore((s) => s.subcategory);

  // Build a stable import key that only changes when category/subcategory change
  const importKey = useMemo(() => {
    if (!category || !subcategory) return null;
    const normalizedCategory = categoryAlias[category] || category.toLowerCase();
    const subFormName = formMapping[normalizedCategory]?.[subcategory];
    return subFormName ? `${normalizedCategory}/${subFormName}` : null;
  }, [category, subcategory]);

  // ✅ Memoize the dynamic import. It won't recreate the component on every render/keystroke
  const SpecificForm = useMemo(() => {
    if (!importKey) return null;
    return dynamic(
      () => import(`@/app/components/form/${importKey}`),
      {
        ssr: false,
        loading: () => <p className="text-center text-gray-500">Loading form...</p>,
      }
    );
  }, [importKey]);

  const handleNext = () => {
    router.push("/post/upload-photo");
  };

  return (
    <>
      <AppHeader />
      <main className="px-4 py-10 md:py-16 bg-white min-h-screen">
        <form
          onSubmit={(e) => e.preventDefault()}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.target as HTMLElement).tagName !== "TEXTAREA") {
              e.preventDefault();
            }
          }}
          className="space-y-6 max-w-xl mx-auto"
        >
          <h2 className="text-2xl font-semibold mb-4">Post Details</h2>

          <div className="text-gray-600 text-sm space-y-1">
            <p><strong>Category:</strong> {category}</p>
            <p><strong>Subcategory:</strong> {subcategory}</p>
          </div>

          {/* Render the memoized form */}
          {SpecificForm ? <SpecificForm /> : null}

          <Button type="button" className="w-full" onClick={handleNext}>
            Next
          </Button>
        </form>
      </main>
      <AppFooter />
    </>
  );
}
