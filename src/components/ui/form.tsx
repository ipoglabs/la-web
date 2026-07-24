import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import {
  Controller,
  useFormContext,
  type FieldValues,
  type UseFormReturn,
  type Path,
} from "react-hook-form";

// Form context provider
export const Form = React.forwardRef<HTMLFormElement, React.FormHTMLAttributes<HTMLFormElement>>(
  function Form({ children, ...props }, ref) {
    return <form ref={ref} {...props}>{children}</form>;
  }
);

// FormField: Connects RHF control to a field
export function FormField<TFieldValues extends FieldValues = FieldValues>({
  name,
  control,
  render,
}: {
  name: Path<TFieldValues>;
  control: UseFormReturn<TFieldValues>["control"];
  render: (props: any) => React.ReactNode;
}) {
  return <Controller name={name} control={control} render={render as any} />;
}

// FormItem: Wrapper for a field
export function FormItem({ children }: { children: React.ReactNode }) {
  return <div className="space-y-2">{children}</div>;
}

// FormLabel: Label for a field
export function FormLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-sm font-medium text-gray-700">
      {children}
    </label>
  );
}

// FormControl: Wrapper for input
export function FormControl({ children }: { children: React.ReactNode }) {
  return <Slot>{children}</Slot>;
}

// FormDescription: Helper text
export function FormDescription({ children }: { children: React.ReactNode }) {
  return <p className="text-xs text-gray-500">{children}</p>;
}

// FormMessage: Validation error message
export function FormMessage() {
  const form = useFormContext();
  // If form context is missing, do not render anything
  if (!form) return null;
  const { formState } = form;
  // This is a simplified version; you may want to customize error display
  return formState.errors && Object.keys(formState.errors).length > 0 ? (
    <p className="text-xs text-red-500">
      {formState.errors[Object.keys(formState.errors)[0]]?.message as string}
    </p>
  ) : null;
}