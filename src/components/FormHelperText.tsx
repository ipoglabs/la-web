import { ReactNode } from "react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

interface FormHelperTextProps {
  children: ReactNode;
  icon?: React.ElementType;
  className?: string;
}

export function FormHelperText({
  children,
  className = "",
}: FormHelperTextProps) {
  return (
    <p
      className={`mb-4 flex items-center text-sm text-gray-700 italic font-light gap-1 ${className}`}
    >
      <InformationCircleIcon className="w-4 h-4" aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}
