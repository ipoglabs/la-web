"use client";

import { useState } from "react";
import { useRouter, /* remove this if not used: useSearchParams */ } from "next/navigation";
import { usePostFormStore } from "../store/postFormStore"; // adjust if path differs
import { categoryIN } from "@/static/data";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";

export default function SelectCategoryClient() {
  const router = useRouter();
  const setField = usePostFormStore((s) => s.setField);

  // ✅ Do NOT call useSearchParams here unless you really need it.
  // If you DO need it, it's fine—this component is already inside Suspense (see page.tsx).

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);

  const categories = categoryIN.data;
  const currentCategory = categories.find((cat) => cat.id === selectedCategoryId);

  const handleContinue = () => {
    if (currentCategory && selectedSubCategory) {
      setField("category", currentCategory.name);
      setField("subcategory", selectedSubCategory);
      router.push("/post/details");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-lg shadow-xl border border-slate-200">
        <CardContent className="p-6 space-y-6">
          {/* Main Category */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-700">Main Category</p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between text-left">
                  {currentCategory?.name || "Choose a category"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full max-h-64 overflow-y-auto">
                {categories.map((cat) => (
                  <DropdownMenuCheckboxItem
                    key={cat.id}
                    checked={selectedCategoryId === cat.id}
                    onCheckedChange={() => {
                      setSelectedCategoryId(cat.id);
                      setSelectedSubCategory(null);
                    }}
                  >
                    {cat.name}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Sub-category */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-700">Sub-category</p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between text-left"
                  disabled={!selectedCategoryId}
                >
                  {selectedSubCategory || (!selectedCategoryId ? "Select category first" : "Choose Sub-category")}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full max-h-64 overflow-y-auto">
                {currentCategory?.items.map((sub) => (
                  <DropdownMenuCheckboxItem
                    key={sub.id}
                    checked={selectedSubCategory === sub.itemName}
                    onCheckedChange={() => setSelectedSubCategory(sub.itemName)}
                  >
                    {sub.itemName}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Continue */}
          <div className="pt-4 border-t border-slate-200">
            <Button className="w-full" disabled={!selectedCategoryId || !selectedSubCategory} onClick={handleContinue}>
              Continue
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
