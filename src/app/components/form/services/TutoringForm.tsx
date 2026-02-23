"use client";

import React, { useRef, useState } from "react";
import { usePostFormStore } from "@/app/post/store/postFormStore";
import FormField from "@/app/components/form/fields/FormField";
import SelectField from "@/app/components/form/fields/SelectField";
import { toast } from "sonner";

export default function TutoringForm() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const store = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);

  const name = store.name ?? "";
  const subject = (store as any).subject ?? "";
  const level = (store as any).level ?? "";
  const mode = (store as any).mode ?? "";
  const qualification = (store as any).qualification ?? "";
  const availability = (store as any).availability ?? "";
  const price = (store as any).price ?? "";
  const description = store.description ?? "";

  const sellerInfo = store.sellerInfo ?? {};
  const location = store.location ?? {};

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
    setField("salePrice", v); // backend consistency
  };

  const setSeller = (k: "name" | "email" | "phone", v?: string) => {
    const cur = sellerInfo || {};
    setField("sellerInfo", { ...cur, [k]: v ?? "" });
  };

  const setLoc = (address?: string) => {
    const cur = location || {};
    setField("location", { ...cur, address: address ?? "" });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const mapped: Record<string, string> = {};

    if (!name.trim()) mapped.name = "Title required";
    if (!subject.trim()) mapped.subject = "Subject required";
    if (!level) mapped.level = "Level required";
    if (!mode) mapped.mode = "Mode required";
    if (!isPositive(price)) mapped.price = "Valid fee required";
    if (!availability.trim()) mapped.availability = "Availability required";

    if (!sellerInfo?.name?.trim())
      mapped.sellerName = "Contact name required";
    if (!sellerInfo?.email?.trim())
      mapped.sellerEmail = "Email required";
    if (!sellerInfo?.phone?.trim())
      mapped.sellerPhone = "Phone required";

    setErrors(mapped);

    if (Object.keys(mapped).length > 0) {
      scrollToFirstError(mapped);
      toast.error("Please fix highlighted fields");
      dispatchValidated(false);
      return;
    }

    // persist trimmed values
    setField("name", name.trim());
    setField("description", description.trim());

    setErrors({});
    dispatchValidated(true);
  };

  return (
    <form
      ref={formRef}
      data-post-form="true"
      onSubmit={onSubmit}
      className="max-w-3xl mx-auto my-8 space-y-6"
    >
      <h2 className="text-2xl font-semibold text-center">
        Tutoring Service
      </h2>

      {/* Title */}
      <FormField
        label="Title"
        field="name"
        value={name}
        onChange={(v) => setField("name", v)}
        required
      />

      {/* Subject */}
      <FormField
        label="Subject"
        field="subject"
        value={subject}
        onChange={(v) => setField("subject", v)}
        required
      />

      {/* Level */}
      <SelectField
        label="Level"
        field="level"
        value={level}
        onChange={(v) => setField("level", v)}
        options={[
          { value: "primary", label: "Primary" },
          { value: "secondary", label: "Secondary" },
          { value: "higher-secondary", label: "Higher Secondary" },
          { value: "college", label: "College / University" },
          { value: "competitive", label: "Competitive Exams" },
        ]}
      />

      {/* Mode */}
      <SelectField
        label="Mode"
        field="mode"
        value={mode}
        onChange={(v) => setField("mode", v)}
        options={[
          { value: "online", label: "Online" },
          { value: "offline", label: "Offline (In-person)" },
          { value: "both", label: "Both" },
        ]}
      />

      {/* Qualification */}
      <FormField
        label="Qualification"
        field="qualification"
        value={qualification}
        onChange={(v) => setField("qualification", v)}
      />

      {/* Experience / Availability / Fee */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
          label="Fee (₹)"
          field="price"
          type="number"
          value={price}
          onChange={(v) => handlePrice(String(v))}
          required
        />
      </div>

      {/* Location */}
      <input
        name="location"
        className="border rounded w-full px-3 py-2"
        placeholder="Location (if offline)"
        value={location?.address ?? ""}
        onChange={(e) => setLoc(e.target.value)}
      />

      {/* Description */}
      <FormField
        label="Additional Information"
        field="description"
        type="textarea"
        value={description}
        onChange={(v) => setField("description", v)}
      />

      {/* Contact */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t pt-6">
        <input
          name="sellerName"
          className="border rounded px-3 py-2"
          placeholder="Contact Name"
          value={sellerInfo?.name ?? ""}
          onChange={(e) => setSeller("name", e.target.value)}
          required
        />
        <input
          name="sellerEmail"
          className="border rounded px-3 py-2"
          type="email"
          placeholder="Email"
          value={sellerInfo?.email ?? ""}
          onChange={(e) => setSeller("email", e.target.value)}
          required
        />
        <input
          name="sellerPhone"
          className="border rounded px-3 py-2"
          type="tel"
          placeholder="Phone"
          value={sellerInfo?.phone ?? ""}
          onChange={(e) => setSeller("phone", e.target.value)}
          required
        />
      </div> */}

      {/* hidden submit for global Next flow */}
      <button type="submit" className="sr-only" />
    </form>
  );
}