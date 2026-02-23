"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "../components/PageHeader";
import PostFooter from "../components/PostFooter";
import { usePostFormStore } from "../store/postFormStore";

// your existing categories
import { categoryIN } from "@/static/data";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

type ComboItem = { value: string; label: string };

function Combobox({
  label,
  placeholder,
  value,
  onSelect,
  items,
  disabled,
}: {
  label?: string;
  placeholder?: string;
  value: string;
  onSelect: (value: string) => void;
  items: ComboItem[];
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const selected = items.find((i) => i.value === value)?.label ?? "";

  return (
    <div className="space-y-1">
      {label && <div className="text-sm text-muted-foreground">{label}</div>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={disabled}
          >
            <span className={cn("truncate", !selected && "text-muted-foreground")}>
              {selected || placeholder || "Select an option"}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent align="start" className="p-0 w-[var(--radix-popover-trigger-width)]">
          <Command shouldFilter={false}>
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {items.map((item) => (
                  <CommandItem
                    key={item.value}
                    value={item.label}
                    onSelect={() => {
                      onSelect(item.value);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn("mr-2 h-4 w-4", value === item.value ? "opacity-100" : "opacity-0")}
                    />
                    {item.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default function SelectCategoryClient() {
  const router = useRouter();
  const setField = usePostFormStore((s) => s.setField);

  const categories = useMemo(() => categoryIN.data, []);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);

  const currentCategory = categories.find((c) => c.id === selectedCategoryId) ?? null;
  const canContinue = Boolean(currentCategory && selectedSubCategory);

  const handleNext = () => {
    if (!canContinue) return;
    setField("category", currentCategory!.name);
    setField("subcategory", selectedSubCategory!);
    router.push("/post/details");
  };

  return (
    <main className="min-h-[calc(100vh-70px)] flex flex-col items-center justify-center bg-gray-50 p-8">
      <PageHeader
        title="Select a Category"
        description="Pick the category that matches your advertisement."
      />

      <div className="w-full max-w-xs space-y-4 mt-6">
        <Combobox
          label="Category"
          placeholder="Choose a category"
          value={selectedCategoryId?.toString() ?? ""}
          onSelect={(val) => {
            const id = Number(val);
            if (!Number.isNaN(id)) {
              setSelectedCategoryId(id);
              setSelectedSubCategory(null);
            }
          }}
          items={categories.map((c) => ({ value: String(c.id), label: c.name }))}
        />

        <Combobox
          label="Sub-category"
          placeholder={selectedCategoryId ? "Choose sub-category" : "Select category first"}
          disabled={!selectedCategoryId}
          value={selectedSubCategory ?? ""}
          onSelect={(val) => setSelectedSubCategory(val)}
          items={(currentCategory?.items ?? []).map((s) => ({
            value: s.itemName,
            label: s.itemName,
          }))}
        />
      </div>

      <div className="w-full max-w-xl mt-10">
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
