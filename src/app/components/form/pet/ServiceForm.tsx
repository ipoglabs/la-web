// src/app/components/form/pets/ServiceForm.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePostFormStore } from "@/app/post/store/postFormStore";
import FormField from "@/app/components/form/fields/FormField";
import SelectField from "@/app/components/form/fields/SelectField";
import { toast } from "sonner";

export default function PetServiceForm() {
  const formRef = useRef<HTMLFormElement | null>(null);

  const store = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);

  const category = store.category;
  const subcategory = store.subcategory;

  const name = store.name ?? "";
  const description = store.description ?? "";

  const serviceType = (store as any).serviceType ?? "";
  const petType = (store as any).petType ?? "";
  const experience = (store as any).experience ?? "";
  const availability = (store as any).availability ?? "";
  const serviceProviderName =
    (store as any).serviceProviderName ?? "";

  const price =
    (store as any).price ?? store.salePrice ?? "";

  const location = store.location ?? {};
  const sellerInfo = store.sellerInfo ?? {};

  const [errors, setErrors] =
    useState<Record<string, string>>({});

  // preset category/subcategory
  useEffect(() => {
    if (!category) setField("category", "Pets");
    if (!subcategory)
      setField("subcategory", "Services");
  }, [category, subcategory, setField]);

  const isPositive = (v: unknown) => {
    if (!v) return false;
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
    setField("salePrice", v); // backend safe
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
      mapped.name = "Service title required";

    if (!serviceType)
      mapped.serviceType =
        "Service type required";

    if (!petType)
      mapped.petType = "Pet type required";

    if (!availability.trim())
      mapped.availability =
        "Availability required";

    if (!isPositive(price))
      mapped.price = "Invalid price";

    if (!location?.address?.trim())
      mapped.location = "Location required";

    if (!sellerInfo?.name?.trim())
      mapped.sellerName =
        "Contact name required";

    if (!sellerInfo?.phone?.trim())
      mapped.sellerPhone = "Phone required";

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
    setField(
      "serviceProviderName",
      serviceProviderName.trim()
    );

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
        Post a Pet Service
      </h2>

      {/* Title */}
      <FormField
        label="Service Title"
        field="name"
        value={name}
        onChange={(v) =>
          setField("name", v)
        }
        required
      />

      <FormField
        label="Service Description"
        field="description"
        type="textarea"
        value={description}
        onChange={(v) =>
          setField("description", v)
        }
      />

      {/* Service Type / Pet Type */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectField
          label="Service Type"
          field="serviceType"
          value={serviceType}
          onChange={(v) =>
            setField("serviceType", v)
          }
          options={[
            {
              value: "grooming",
              label: "Grooming",
            },
            {
              value: "training",
              label: "Training",
            },
            {
              value: "boarding",
              label: "Boarding",
            },
            {
              value: "walking",
              label: "Walking",
            },
            {
              value: "vet",
              label: "Veterinary",
            },
            {
              value: "other",
              label: "Other",
            },
          ]}
          required
        />

        <SelectField
          label="Pet Type"
          field="petType"
          value={petType}
          onChange={(v) =>
            setField("petType", v)
          }
          options={[
            { value: "dog", label: "Dog" },
            { value: "cat", label: "Cat" },
            { value: "bird", label: "Bird" },
            { value: "rabbit", label: "Rabbit" },
            { value: "other", label: "Other" },
          ]}
          required
        />
      </div>

      {/* Provider / Experience / Availability */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FormField
          label="Service Provider Name"
          field="serviceProviderName"
          value={serviceProviderName}
          onChange={(v) =>
            setField(
              "serviceProviderName",
              v
            )
          }
        />

        <FormField
          label="Experience (years)"
          field="experience"
          type="number"
          value={experience}
          onChange={(v) =>
            setField("experience", v)
          }
        />

        <FormField
          label="Availability"
          field="availability"
          value={availability}
          onChange={(v) =>
            setField("availability", v)
          }
          required
        />
      </div>

      {/* Price / Location */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          label="Price (₹)"
          field="price"
          type="number"
          value={price}
          onChange={(v) =>
            handlePrice(String(v))
          }
          required
        />

        <input
          name="location"
          className="border rounded px-3 py-2 w-full"
          placeholder="Location"
          value={location?.address ?? ""}
          onChange={(e) =>
            setLoc(e.target.value)
          }
        />
      </div>

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