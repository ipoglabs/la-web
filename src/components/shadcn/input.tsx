import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          [
            "flex h-10 w-full rounded-sm border-[1.5px] border-gray-700/50 bg-gray-50 px-3 py-2 text-base font-normal text-gray-900 placeholder:text-gray-400",
            "focus-visible:bg-yellow-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:ring-offset-1",
            "disabled:cursor-not-allowed disabled:opacity-50",
            className,
          ]
            .filter(Boolean)
            .join(" ")
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
