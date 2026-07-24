import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // base box
          "flex h-10 w-full rounded-md border-[1.5px] border-gray-300 bg-white px-3 py-2 text-base text-gray-900",
          // placeholder
          "placeholder:text-gray-400",
          // focus
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/25 focus-visible:border-blue-500",
          // disabled
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50",
          // file input
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-gray-900",
          // hide native reveal/clear icons so LaInput's custom toggle/clear buttons are the only ones shown
          "[&::-ms-reveal]:hidden [&::-ms-clear]:hidden [&::-webkit-credentials-auto-fill-button]:hidden",
          // smooth transitions on the states above
          "transition-colors",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };