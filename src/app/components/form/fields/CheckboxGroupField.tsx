// src/app/components/form/fields/CheckboxGroupField.tsx
"use client";

import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { usePostFormStore } from "@/app/post/store/postFormStore";

type Props = {
  label: string;
  field: string;        // e.g. "facilities", "amenities", "rules"
  options: string[];
  cols?: 2 | 3;
};

export default function CheckboxGroupField({ label, field, options, cols = 3 }: Props) {
  const values: string[] = usePostFormStore((s) => (s as any)[field]) ?? [];
  const setField = usePostFormStore((s) => s.setField);

  const toggle = (opt: string, checked: boolean | string) => {
    const c = !!checked;
    const next = c ? [...values, opt] : values.filter((v) => v !== opt);
    setField(field, next);
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className={`grid grid-cols-2 md:grid-cols-${cols} gap-2`}>
        {options.map((opt, i) => (
          <label key={i} className="flex items-center space-x-2 cursor-pointer">
            <Checkbox
              id={`${field}_${i}`}
              checked={values.includes(opt)}
              onCheckedChange={(checked) => toggle(opt, checked)}
            />
            <span>{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
