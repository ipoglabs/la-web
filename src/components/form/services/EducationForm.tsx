"use client";

import React, { useRef, useState } from "react";
import { usePostFormStore } from "@/app/(main)/post/store/postFormStore";
import FormField from "@/components/form/fields/FormField";
import { ToggleButtonGroup, ToggleGroupButton } from "@/components/toggle-group/CompoundToggleGroup";
import { useCountryConfig } from "@/lib/hooks/useCountryConfig";
import { toast } from "sonner";

export default function EducationForm() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const { countryConfig } = useCountryConfig();
  const currency = countryConfig.currency;
  const setField = usePostFormStore((s) => s.setField);

  const store = usePostFormStore();

  const name = store.name ?? "";
  const price = (store as any).price ?? "";
  const educationType = (store as any).educationType ?? "";
  const subject = (store as any).subject ?? "";
  const mode = (store as any).mode ?? "";
  const qualification = (store as any).qualification ?? "";
  const availability = (store as any).availability ?? "";
  const description = store.description ?? "";
  const sellerInfo = store.sellerInfo ?? {};

  const [errors, setErrors] = useState<Record<string, string>>({});

  const isPositive = (v: unknown) => {
    if (!v) return false;
    const n = Number(v);
    return Number.isFinite(n) && n > 0;
  };

  const dispatchValidated = (ok: boolean) => {
    window.dispatchEvent(
      new CustomEvent("postform:validated", { detail: { ok } })
    );
  };

  const scrollToFirstError = (mapped: Record<string, string>) => {
    const first = Object.keys(mapped)[0];
    if (!first) return;
    const el = formRef.current?.querySelector<HTMLElement>(
      `[name="${first}"]`
    );
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    el?.focus?.();
  };

  const handlePrice = (v: string) => {
    setField("price", v);
    setField("salePrice", v); // keep consistent with new backend model
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const mapped: Record<string, string> = {};

    if (!name.trim()) mapped.name = "Service title is required";
    if (!educationType) mapped.educationType = "Education type required";
    if (!isPositive(price)) mapped.price = "Valid price required";

    setErrors(mapped);

    if (Object.keys(mapped).length > 0) {
      scrollToFirstError(mapped);
      toast.error("Please fix highlighted fields");
      dispatchValidated(false);
      return;
    }

    setField("name", name.trim());
    setField("description", description.trim());

    setErrors({});
    dispatchValidated(true);
  };

  const setSeller = (k: "name" | "email" | "phone", v?: string) => {
    const cur = sellerInfo || {};
    setField("sellerInfo", { ...cur, [k]: v ?? "" });
  };

  return (
    <form
      ref={formRef}
      data-post-form="true"
      onSubmit={onSubmit}
      className="max-w-3xl mx-auto my-6 space-y-6"
    >
      <h2 className="text-2xl font-bold">Post Education Service</h2>

      <FormField
        label="Service Title"
        field="name"
        value={name}
        onChange={(v) => setField("name", v)}
        required
      />

      <ToggleButtonGroup title="Education Type" singleSelect value={educationType ? [educationType] : []} onChange={(v) => setField("educationType", v[0] ?? "")}>
        <ToggleGroupButton value="tutoring">Tutoring</ToggleGroupButton>
        <ToggleGroupButton value="coaching">Coaching</ToggleGroupButton>
        <ToggleGroupButton value="online">Online</ToggleGroupButton>
        <ToggleGroupButton value="school">School</ToggleGroupButton>
        <ToggleGroupButton value="language">Language</ToggleGroupButton>
        <ToggleGroupButton value="professional">Professional</ToggleGroupButton>
      </ToggleButtonGroup>

      <FormField
        label="Subject / Course"
        field="subject"
        value={subject}
        onChange={(v) => setField("subject", v)}
      />

      <ToggleButtonGroup title="Mode" singleSelect value={mode ? [mode] : []} onChange={(v) => setField("mode", v[0] ?? "")}>
        <ToggleGroupButton value="offline">Offline</ToggleGroupButton>
        <ToggleGroupButton value="online">Online</ToggleGroupButton>
        <ToggleGroupButton value="both">Both</ToggleGroupButton>
      </ToggleButtonGroup>

      <FormField
        label="Qualification"
        field="qualification"
        value={qualification}
        onChange={(v) => setField("qualification", v)}
      />

      <div className="grid grid-cols-3 gap-4">
        <FormField
          label="Experience (years)"
          field="experience"
          type="number"
          onChange={(v) => setField("experience", v)}
        />
        <FormField
          label="Availability"
          field="availability"
          value={availability}
          onChange={(v) => setField("availability", v)}
        />
        <FormField
          label={`Fees / Price (${currency})`}
          field="price"
          type="number"
          value={price}
          onChange={(v) => handlePrice(String(v))}
          required
        />
      </div>

      <FormField
        label="Description"
        field="description"
        type="textarea"
        value={description}
        onChange={(v) => setField("description", v)}
      />

      {/* Contact */}
      {/* <div className="grid grid-cols-3 gap-4 border-t pt-6">
        <input
          className="border rounded px-3 py-2"
          placeholder="Name"
          value={sellerInfo?.name ?? ""}
          onChange={(e) => setSeller("name", e.target.value)}
          required
        />
        <input
          className="border rounded px-3 py-2"
          placeholder="Email"
          value={sellerInfo?.email ?? ""}
          onChange={(e) => setSeller("email", e.target.value)}
          required
        />
        <input
          className="border rounded px-3 py-2"
          placeholder="Phone"
          value={sellerInfo?.phone ?? ""}
          onChange={(e) => setSeller("phone", e.target.value)}
          required
        />
      </div> */}

      <button type="submit" className="sr-only" />
    </form>
  );
}
