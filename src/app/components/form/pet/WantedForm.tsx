// src/app/components/form/pets/WantedForm.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePostFormStore } from "@/app/post/store/postFormStore";
import FormField from "@/app/components/form/fields/FormField";
import SelectField from "@/app/components/form/fields/SelectField";
import { toast } from "sonner";

export default function PetWantedForm() {
  const formRef = useRef<HTMLFormElement | null>(null);

  const store = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);

  const category = store.category;
  const subcategory = store.subcategory;

  const name = store.name ?? "";
  const description = store.description ?? "";

  const wantedPetType = (store as any).wantedPetType ?? "";
  const breedPreference = (store as any).breedPreference ?? "";
  const agePreference = (store as any).agePreference ?? "";
  const genderPreference = (store as any).genderPreference ?? "";
  const sizePreference = (store as any).sizePreference ?? "";

  const price =
    (store as any).price ??
    (store as any).budget ??
    store.salePrice ??
    "";

  const preferredLocations =
    (store as any).preferred_locations ?? [];

  const location = store.location ?? {};
  const sellerInfo = store.sellerInfo ?? {};

  const [errors, setErrors] =
    useState<Record<string, string>>({});

  const [locationsText, setLocationsText] = useState(
    Array.isArray(preferredLocations)
      ? preferredLocations.join(", ")
      : ""
  );

  // preset category/subcategory
  useEffect(() => {
    if (!category) setField("category", "Pets");
    if (!subcategory)
      setField("subcategory", "Wanted");
  }, [category, subcategory, setField]);

  const isPositive = (v: unknown) => {
    if (!v) return true; // optional
    const n = Number(v);
    return Number.isFinite(n) && n >= 0;
  };

  const dispatchValidated = (ok: boolean) => {
    window.dispatchEvent(
      new CustomEvent("postform:validated", {
        detail: { ok },
      })
    );
  };

  const scrollToFirstError = (
    mapped: Record<string, string>
  ) => {
    const first = Object.keys(mapped)[0];
    if (!first) return;

    const el =
      formRef.current?.querySelector<HTMLElement>(
        `[name="${first}"]`
      );

    el?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    el?.focus?.();
  };

  const handlePrice = (v: string) => {
    setField("price", v);
    setField("salePrice", v);
  };

  const commitPreferredLocations = () => {
    const arr = locationsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    setField("preferred_locations", arr);
  };

  const setSeller = (
    k: "name" | "email" | "phone",
    v?: string
  ) => {
    const cur = sellerInfo || {};
    setField("sellerInfo", {
      ...cur,
      [k]: v ?? "",
    });
  };

  const setLoc = (address?: string) => {
    const cur = location || {};
    setField("location", {
      ...cur,
      address: address ?? "",
    });
  };

  const onSubmit = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const mapped: Record<string, string> = {};

    if (!name.trim())
      mapped.name = "Title required";

    if (!wantedPetType)
      mapped.wantedPetType =
        "Pet type required";

    if (!isPositive(price))
      mapped.price = "Invalid budget";

    if (!sellerInfo?.name?.trim())
      mapped.sellerName =
        "Contact name required";

    if (!sellerInfo?.phone?.trim())
      mapped.sellerPhone =
        "Phone required";

    setErrors(mapped);

    if (Object.keys(mapped).length > 0) {
      scrollToFirstError(mapped);
      toast.error(
        "Please fix highlighted fields"
      );
      dispatchValidated(false);
      return;
    }

    // persist cleaned values
    setField("name", name.trim());
    setField(
      "description",
      description.trim()
    );

    commitPreferredLocations();

    setErrors({});
    dispatchValidated(true);
  };

  return (
    <form
      ref={formRef}
      data-post-form="true"
      onSubmit={onSubmit}
      className="space-y-6 max-w-3xl mx-auto"
    >
      <h2 className="text-2xl font-semibold text-center">
        Pet Wanted
      </h2>

      <FormField
        label="Title"
        field="name"
        value={name}
        onChange={(v) =>
          setField("name", v)
        }
        required
      />

      <FormField
        label="Additional Information"
        field="description"
        type="textarea"
        value={description}
        onChange={(v) =>
          setField("description", v)
        }
      />

      {/* Wanted Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectField
          label="Type of Pet Wanted"
          field="wantedPetType"
          value={wantedPetType}
          onChange={(v) =>
            setField("wantedPetType", v)
          }
          options={[
            { value: "dog", label: "Dog" },
            { value: "cat", label: "Cat" },
            { value: "bird", label: "Bird" },
            { value: "rabbit", label: "Rabbit" },
            { value: "others", label: "Others" },
          ]}
          required
        />

        <FormField
          label="Breed Preference"
          field="breedPreference"
          value={breedPreference}
          onChange={(v) =>
            setField("breedPreference", v)
          }
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FormField
          label="Preferred Age"
          field="agePreference"
          value={agePreference}
          onChange={(v) =>
            setField("agePreference", v)
          }
        />

        <SelectField
          label="Gender Preference"
          field="genderPreference"
          value={genderPreference}
          onChange={(v) =>
            setField(
              "genderPreference",
              v
            )
          }
          options={[
            { value: "male", label: "Male" },
            { value: "female", label: "Female" },
            { value: "any", label: "Any" },
          ]}
        />

        <SelectField
          label="Size Preference"
          field="sizePreference"
          value={sizePreference}
          onChange={(v) =>
            setField(
              "sizePreference",
              v
            )
          }
          options={[
            { value: "small", label: "Small" },
            { value: "medium", label: "Medium" },
            { value: "large", label: "Large" },
            { value: "any", label: "Any" },
          ]}
        />
      </div>

      {/* Locations & Budget */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">
            Preferred Locations
          </label>
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Comma separated"
            value={locationsText}
            onChange={(e) =>
              setLocationsText(
                e.target.value
              )
            }
            onBlur={
              commitPreferredLocations
            }
          />
        </div>

        <FormField
          label="Budget (₹)"
          field="price"
          type="number"
          value={price}
          onChange={(v) =>
            handlePrice(String(v))
          }
        />
      </div>

      {/* Primary Location */}
      <input
        name="location"
        className="border rounded px-3 py-2 w-full"
        placeholder="Primary Location"
        value={location?.address ?? ""}
        onChange={(e) =>
          setLoc(e.target.value)
        }
      />

      {/* Contact */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t pt-6">
        <input
          name="sellerName"
          className="border rounded px-3 py-2"
          placeholder="Contact Name"
          value={sellerInfo?.name ?? ""}
          onChange={(e) =>
            setSeller("name", e.target.value)
          }
          required
        />
        <input
          name="sellerPhone"
          className="border rounded px-3 py-2"
          type="tel"
          placeholder="Phone"
          value={sellerInfo?.phone ?? ""}
          onChange={(e) =>
            setSeller("phone", e.target.value)
          }
          required
        />
        <input
          name="sellerEmail"
          className="border rounded px-3 py-2"
          type="email"
          placeholder="Email"
          value={sellerInfo?.email ?? ""}
          onChange={(e) =>
            setSeller("email", e.target.value)
          }
        />
      </div> */}

      <button
        type="submit"
        className="sr-only"
      />
    </form>
  );
}