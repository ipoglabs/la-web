"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import PageHeader from "../components/PageHeader";
import PostFooter from "../components/PostFooter";

import { usePostFormStore } from "../store/postFormStore";
import { useWizardGuard } from "../wizard/guard";
import { useAuthStore } from "@/store/authStore";
import { LaChip } from "@/components/la/la-chip";
import { useCountryConfig } from "@/lib/hooks/useCountryConfig";
import { usePostFormSchema } from "@/lib/hooks/usePostFormSchema";
import { validateAgainstSchema } from "@/posting/form-schema/validate";
import DynamicPostForm, { DynamicPostFormSkeleton } from "./DynamicPostForm";

// One DB-driven form for every category (post/details/DynamicPostForm.tsx);
// its fields come from the category/subcategory/country schema in the DB.

export default function DetailsPage() {
  useWizardGuard("details");

  const router = useRouter();

  const category = usePostFormStore((s) => s.category);
  const subcategory = usePostFormStore((s) => s.subcategory);
  const setField = usePostFormStore((s) => s.setField);

  const user = useAuthStore((s) => s.user);

  const { countryCode, countryConfig } = useCountryConfig();
  const {
    schema,
    loading: schemaLoading,
    error: schemaError,
  } = usePostFormSchema(
    category,
    subcategory,
    countryCode.toUpperCase()
  );
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const clearFieldError = useCallback((key: string) => {
    setFieldErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

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

  const handleNext = useCallback(() => {
    if (!category || !subcategory) {
      toast.error("Category or subcategory missing.");
      return;
    }

    const store = usePostFormStore.getState();

    if (!schema) {
      toast.error("Form is still loading. Please try again.");
      return;
    }
    const schemaErrors = validateAgainstSchema(
      schema,
      store as unknown as Record<string, unknown>
    );
    setFieldErrors(schemaErrors);
    const firstKey = Object.keys(schemaErrors)[0];
    if (firstKey) {
      toast.error("Please fix the highlighted fields.");
      document
        .querySelector<HTMLElement>(`[data-field="${firstKey}"]`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      document.getElementById(firstKey)?.focus({ preventScroll: true });
      return;
    }
    router.push("/post/upload-photo");
  }, [category, subcategory, router, schema]);

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
          {schemaLoading ? (
            <DynamicPostFormSkeleton />
          ) : schema ? (
            <DynamicPostForm
              schema={schema}
              currencySymbol={countryConfig.currencySymbol}
              errors={fieldErrors}
              onFieldChange={clearFieldError}
            />
          ) : (
            <p className="text-sm text-rose-600">
              {schemaError ?? "No form found for this subcategory."}
            </p>
          )}

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
