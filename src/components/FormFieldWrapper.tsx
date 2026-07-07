import React from "react";

interface FormFieldWrapperProps {
  children: React.ReactNode;
  className?: string;
  showFocusWithin?: boolean;
}

export function FormFieldWrapper({
  children,
  className,
  showFocusWithin = true,
}: FormFieldWrapperProps) {
  const highlightClasses = showFocusWithin
    ? [
        "relative",
        "before:absolute before:top-0 before:left-0 before:h-full before:w-1 before:bg-blue-600 before:rounded-tl before:rounded-bl before:scale-y-100 before:origin-left before:opacity-0 before:pointer-events-none before:-translate-x-3",
        "focus-within:before:opacity-100 focus-within:before:scale-y-100",
      ]
    : ["relative"];
  return (
    <div
      className={[...highlightClasses, className ? className : "mb-4"]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}
