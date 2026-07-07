// src/components/FormField.tsx
"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { usePostFormStore } from "@/app/post/store/postFormStore";

type Props = {
  label: string;
  field: string; // key in store
  type?: "text" | "number" | "email" | "tel" | "date" | "textarea";
  placeholder?: string;
};

export default function FormField({ label, field, type = "text", placeholder }: Props) {
  const { [field]: value, setField } = usePostFormStore();

  return (
    <div className="space-y-2">
      <Label htmlFor={field}>{label}</Label>
      {type === "textarea" ? (
        <Textarea
          id={field}
          value={value || ""}
          placeholder={placeholder}
          onChange={(e) => setField(field, e.target.value)}
        />
      ) : (
        <Input
          id={field}
          type={type}
          value={value || ""}
          placeholder={placeholder}
          onChange={(e) => setField(field, e.target.value)}
        />
      )}
    </div>
  );
}
