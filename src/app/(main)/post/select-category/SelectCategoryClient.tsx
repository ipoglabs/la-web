"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PageHeader from "../components/PageHeader";
import PostFooter from "../components/PostFooter";
import { usePostFormStore } from "../store/postFormStore";

import { CATEGORIES, type CategoryItem } from "@/config/categories";
import { resolveCardColor, resolveCardIcon } from "@/config/categories/visuals";

import { LaButton } from "@/components/la/la-button";
import { ToggleButtonGroup, ToggleGroupButton } from "@/components/toggle-group/CompoundToggleGroup";
import { ChevronLeft, ChevronRight, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SelectCategoryClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // "new=1" is only set by the "+ POST" nav link (src/app/(main)/post/page.tsx) —
  // never by the wizard's own "Back" navigation — so a stale category/subcategory
  // left over from a previous draft doesn't make a brand-new post jump straight
  // to the sub-category screen instead of the category grid.
  const isFreshEntry = searchParams.get("new") === "1";

  const setField = usePostFormStore((s) => s.setField);
  const reset = usePostFormStore((s) => s.reset);

  const categories = useMemo(() => CATEGORIES, []);

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(() => {
    if (isFreshEntry) return null;
    const { category } = usePostFormStore.getState();
    if (!category) return null;
    return CATEGORIES.find((c) => c.label === category)?.id ?? null;
  });
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(() => {
    if (isFreshEntry) return null;
    const { subcategory } = usePostFormStore.getState();
    return subcategory || null;
  });

  // Clear the leftover draft in the store to match — keeps sellerInfo.
  useEffect(() => {
    if (isFreshEntry) reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentCategory = categories.find((c) => c.id === selectedCategoryId) ?? null;
  const canContinue = Boolean(currentCategory && selectedSubCategory);

  /* ---------------- CATEGORY CHANGE (KEY FIX) ---------------- */

  const handleCategorySelect = async (cat: CategoryItem) => {
    // 🧠 Skip if same category
    if (selectedCategoryId === cat.id) return;

    // 🔥 Only ask confirm if data already exists
    const store = usePostFormStore.getState();
    const hasData =
      store.name ||
      store.description ||
      store.imageRefs.length > 0 ||
      store.location?.address;

    if (hasData) {
      const confirmReset = confirm(
        "Changing category will clear all entered details. Continue?"
      );
      if (!confirmReset) return;
    }

    // 🔥 RESET STORE (keeps sellerInfo)
    await reset();

    setSelectedCategoryId(cat.id);
    setSelectedSubCategory(null);
  };

  const handleResetCategory = () => {
    setSelectedCategoryId(null);
    setSelectedSubCategory(null);
  };

  /* ---------------- NEXT ---------------- */

  const handleNext = () => {
    if (!canContinue) return;

    setField("category", currentCategory!.label);
    setField("subcategory", selectedSubCategory!);

    router.push("/post/details");
  };

  return (
    <main className="min-h-[calc(100vh-70px)] flex flex-col bg-gray-50">
      <div className="flex-1 flex flex-col items-center px-4 pt-8 pb-6">
        <PageHeader
          title="Select a Category"
          description="Pick the category that matches your advertisement."
        />

        <div className="w-full max-w-xl mt-4">
          {/* ── Phase A: no selection yet — icon card grid ── */}
          {!currentCategory && (
            <div className="flex flex-col items-center gap-4">
              <p className="text-base font-semibold text-slate-700 text-center">Select a category</p>
              <div className="grid grid-cols-3 gap-3 w-full">
                {categories.map((cat) => {
                  const CatIcon = resolveCardIcon(cat.cardIcon) ?? LayoutGrid;
                  const style = resolveCardColor(cat.color);
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleCategorySelect(cat)}
                      className="relative bg-white rounded-2xl border border-slate-300 px-2 pt-4 pb-3 flex flex-col items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1 active:scale-[0.97] transition-transform"
                    >
                      <ChevronRight className="absolute top-2 right-2 w-3 h-3 text-slate-400" />

                      <div className={cn("w-12 h-12 rounded-full flex items-center justify-center shrink-0", style.header)}>
                        <CatIcon className="w-6 h-6 text-white" />
                      </div>

                      <p className="w-full text-center text-sm font-bold text-slate-900 leading-tight">{cat.label}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Phase B: category chosen — chip + sub-category ── */}
          {currentCategory && (
            <div className="flex flex-col gap-6">
              {/* Selected category chip — tap to go back */}
              <div className="flex justify-center">
                <LaButton
                  intent="ghost"
                  size="big"
                  onClick={handleResetCategory}
                  className="gap-1.5 bg-sky-600 text-white border border-sky-700 hover:bg-sky-700"
                >
                  <ChevronLeft className="h-4 w-4" />
                  {currentCategory.label}
                </LaButton>
              </div>

              <div className="flex flex-col gap-3">
                <p className="text-base font-semibold text-slate-700 text-center">
                  Which type of {currentCategory.label}?
                </p>
                <ToggleButtonGroup
                  singleSelect
                  requireSelection
                  value={selectedSubCategory ? [selectedSubCategory] : []}
                  onChange={(vals) => setSelectedSubCategory(vals[0] ?? null)}
                  className="gap-0"
                >
                  <div className="w-full flex flex-wrap justify-center gap-2.5">
                    {currentCategory.subcategories.map((s) => (
                      <ToggleGroupButton key={s.id} value={s.label} size="default">
                        {s.label}
                      </ToggleGroupButton>
                    ))}
                  </div>
                </ToggleButtonGroup>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="w-full max-w-xl mx-auto px-4">
        <PostFooter
          step="select-category"
          showBack={false}
          showCancel={true}
          showNext={true}
          showSubmit={false}
          isNextDisabled={!canContinue}
          onNext={handleNext}
          onCancel={() => window.history.back()}
        />
      </div>
    </main>
  );
}
