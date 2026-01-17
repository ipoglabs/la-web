"use client";

import React, { useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { usePostFormStore } from "../store/postFormStore";
import PageHeader from "../components/PageHeader";
import PostFooter from "../components/PostFooter";

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

const formMapping: Record<string, Record<string, string>> = {
  property: {
    "To Buy": "BuyForm",
    "To Rent": "RentForm",
    Commercial: "CommercialForm",
    "For Students": "ForStudentForm",
    "Holiday Rental": "HolidayRental",
    "Room Rental": "RoomRentalForm",
    "Land for Sale/Lease": "SaleForm",
    Wanted: "WantedForm",
  },
  job: {
    "Full Time": "FulltimeForm",
    "Part Time": "ParttimeForm",
    Freelance: "FreelanceForm",
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

export default function PostFormTemplate() {
  const router = useRouter();

  const category = usePostFormStore((s) => s.category);
  const subcategory = usePostFormStore((s) => s.subcategory);

  const importKey = useMemo(() => {
    if (!category || !subcategory) return null;
    const normalizedCategory = categoryAlias[category] || category.toLowerCase();
    const subFormName = formMapping[normalizedCategory]?.[subcategory];
    return subFormName ? `${normalizedCategory}/${subFormName}` : null;
  }, [category, subcategory]);

  const SpecificForm = useMemo(() => {
    if (!importKey) return null;
    return dynamic(() => import(`@/app/components/form/${importKey}`), {
      ssr: false,
      loading: () => (
        <p className="text-center text-gray-500">Loading form...</p>
      ),
    });
  }, [importKey]);

  // ✅ Listen to all validation events (generic + legacy)
  useEffect(() => {
    const onValidated = (e: Event) => {
      const ok = (e as CustomEvent).detail?.ok === true;
      if (ok) router.push("/post/upload-photo");
    };

    const events = [
      "postform:validated",
      "roomrentalform:validated",
      "buyform:validated",
      "commercialform:validated",
      // add more legacy events here if any older forms emit them
    ];

    events.forEach((ev) =>
      window.addEventListener(ev, onValidated as EventListener)
    );
    return () =>
      events.forEach((ev) =>
        window.removeEventListener(ev, onValidated as EventListener)
      );
  }, [router]);

  // ✅ Best practice "Next": submit whichever form is currently rendered
  const handleNext = useCallback(() => {
    // recommended: add data-post-form="true" on each subform <form>
    const marked = document.querySelector(
      'form[data-post-form="true"]'
    ) as HTMLFormElement | null;

    // fallback for older forms without the attribute
    const fallback =
      (document.getElementById("roomRentalForm") as HTMLFormElement | null) ||
      (document.getElementById("buyForm") as HTMLFormElement | null) ||
      (document.getElementById("commercialForm") as HTMLFormElement | null) ||
      (document.getElementById("postForm") as HTMLFormElement | null);

    const form = marked || fallback;
    if (!form) return;

    if (
      "requestSubmit" in form &&
      typeof (form as any).requestSubmit === "function"
    ) {
      (form as any).requestSubmit();
    } else {
      form.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
    }
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
      <PageHeader
        title="Advertisement Details"
        description="Tell us more about your advertisement. Fill in the main details so potential buyers or viewers know exactly what you’re offering."
      />

      <div className="w-full max-w-xl mt-4">
        <div className="text-gray-600 text-sm space-y-1 mb-6">
          <p>
            <strong>Category:</strong> {category || "-"}
          </p>
          <p>
            <strong>Subcategory:</strong> {subcategory || "-"}
          </p>
        </div>

        {SpecificForm ? <SpecificForm /> : null}

        <div className="mt-8">
          <PostFooter
            showBack
            showNext
            showSubmit={false}
            basePath="/post"
            steps={["select-category", "details", "upload-photo", "pick-location", "preview"]}
            onNext={handleNext}
          />
        </div>
      </div>
    </main>
  );
}
