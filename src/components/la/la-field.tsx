/**
 * LaField — la design system field wrapper
 * Extends: components/ui/field
 *
 * Unified label + input + hint + error in one component.
 * Wires htmlFor → input id automatically via `name` prop.
 *
 * Adds:
 *   - `label`    — field label text
 *   - `hint`     — helper text below input
 *   - `error`    — error message (shown red, overrides hint)
 *   - `required` — appends * to label
 */
import * as React from "react";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field";
import { cn } from "@/lib/utils";

export interface LaFieldProps {
  name: string;
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}

function LaField({
  name,
  label,
  hint,
  error,
  required,
  className,
  children,
}: LaFieldProps) {
  return (
    <Field className={cn(className)}>
      {label && (
        <FieldLabel htmlFor={name}>
          {label}
          {required && <span className="ml-0.5 text-red-500">*</span>}
        </FieldLabel>
      )}

      {/* Clone child to inject id + aria attributes */}
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        return React.cloneElement(child as React.ReactElement<Record<string, unknown>>, {
          id: name,
          "aria-describedby": error
            ? `${name}-error`
            : hint
            ? `${name}-hint`
            : undefined,
          "aria-invalid": error ? true : undefined,
        });
      })}

      {error ? (
        <p id={`${name}-error`} className="text-xs font-medium text-red-500" role="alert">
          {error}
        </p>
      ) : hint ? (
        <FieldDescription id={`${name}-hint`}>{hint}</FieldDescription>
      ) : null}
    </Field>
  );
}

export { LaField, FieldGroup as LaFieldGroup };
