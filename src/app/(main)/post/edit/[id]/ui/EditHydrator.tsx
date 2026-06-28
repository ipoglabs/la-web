// src/app/post/edit/[id]/ui/EditHydrator.tsx
"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { usePostFormStore, type PostFormState } from "@/app/post/store/postFormStore";

/** Minimal Post shape coming from your API */
type AnyPost = {
  id: string;
  name: string;
  description: string;
  images?: string[];
  category: string;
  subcategory: string;
  location?: { address?: string; lat?: number; lng?: number };
  seller_info?: { name: string; email: string; phone: string };
  // plus many optional fields (property/jobs/vehicles/pets/services etc.)
  [k: string]: any;
};

function toArray<T = string>(v: unknown): T[] {
  return Array.isArray(v) ? [...(v as T[])] : [];
}

/** Map API post -> PostFormState slice */
function toStoreShape(post: AnyPost): Partial<PostFormState> {
  const core: Partial<PostFormState> = {
    editMode: true,
    postId: post.id,
    category: post.category || "",
    subcategory: post.subcategory || "",
    name: post.name || "",
    description: post.description || "",
    images: toArray<string>(post.images), // store accepts (File | string)[]
    location: {
      address: post.location?.address || "",
      lat: post.location?.lat,
      lng: post.location?.lng,
    },
    sellerInfo: {
      name: post.seller_info?.name || "",
      email: post.seller_info?.email || "",
      phone: post.seller_info?.phone || "",
    },
    facilities: toArray<string>(post.facilities),
  };

  // Carry over optional fields from your schema
  const passthroughKeys = [
    // Property
    "propertyType","beds","baths","rentPrice","salePrice","deposit","amenities",
    "occupancy","gender_pref","builtup_area","carpet_area","floor","totalFloors",
    "furnishing","washrooms","pantry","parkingSpaces","maintenance","available_from",
    "leaseTerm","powerBackup","holidayType","guests","house_rules","rateNightly",
    "rateWeekly","rateMonthly","type","rent","preferred_tenants","rules","plot_area",
    "negotiable","ownership","age",
    // Wanted constraints
    "minBudget","maxBudget","minArea","preferred_locations",
    // Jobs
    "company","clientName","jobType","workMode","salary","hourlyRate","stipendType",
    "stipendAmount","startDate","endDate","duration","contractDuration","workingHours",
    "deadline","applyLink","projectType","budgetType","budgetAmount","experience",
    "skills","benefits","shifts","candidateName",
    // Vehicles
    "make","model","year","kms","fuelType","transmission","bodyType","color",
    "condition","ownerType","registrationNumber","insuranceValidTill","serviceHistory",
    "features","engineCapacity","seatingCapacity",
    // Pets
    "petName","petType","breed","ageText","gender","vaccination","size",
    "wantedPetType","breedPreference","agePreference","genderPreference","sizePreference",
    "budget","accessoryName","partsCategory","reportType","lastSeenLocation","lfDate",
    "serviceType","serviceProviderName","availability",
    // Services (new blocks)
    "educationType","subject","mode","qualification","price","cuisineType",
    "dietaryOptions","deliveryAvailable","providerName","consultationMode","rateType",
    "destination","packageDetails","agencyName","durationText","level","urgency",
  ] as const;

  for (const key of passthroughKeys) {
    const val = post[key];
    if (val !== undefined) {
      // shallow copy arrays to avoid shared refs
      (core as any)[key] = Array.isArray(val) ? [...val] : val;
    }
  }

  return core;
}

export default function EditHydrator({ post }: { post: AnyPost }) {
  const router = useRouter();
  const reset = usePostFormStore((s) => s.reset);
  const setField = usePostFormStore((s) => s.setField);
  const setBulk = usePostFormStore((s: any) => (s.setBulk as ((d: Partial<PostFormState>) => void) | undefined));

  // Prevent re-hydration loops if the parent re-renders
  const hydratedForId = useRef<string | null>(null);

  useEffect(() => {
    if (!post?.id) return;
    if (hydratedForId.current === post.id) return;

    // 1) Clean slate
    reset();

    // 2) Build payload
    const payload = toStoreShape(post);

    // 3) Hydrate store atomically if possible
    if (typeof setBulk === "function") {
      setBulk(payload);
    } else {
      Object.entries(payload).forEach(([k, v]) => setField(k, v as any));
    }

    hydratedForId.current = post.id;

    // 4) Navigate into the wizard in edit mode
    router.replace("/post/details?edit=1");
  }, [post.id, reset, setBulk, setField, router, post]);

  return null; // no UI — this component just hydrates then redirects
}
