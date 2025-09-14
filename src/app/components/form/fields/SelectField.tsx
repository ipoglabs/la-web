"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { usePostFormStore } from "@/app/post/store/postFormStore";

type Option = { value: string; label?: string };

type Props = {
  label: string;
  field: string;           // key in the store
  placeholder?: string;
  options: Option[];
  required?: boolean;      // UI-only; shadcn Select doesn’t enforce
};

export default function SelectField({
  label,
  field,
  placeholder = "Select…",
  options,
}: Props) {
  const value = usePostFormStore((s) => s[field]);
  const setField = usePostFormStore((s) => s.setField);

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select value={value ?? ""} onValueChange={(val) => setField(field, val)}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label ?? opt.value}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
