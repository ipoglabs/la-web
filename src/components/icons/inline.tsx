import * as React from "react";

export function IconEye({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" aria-hidden="true" focusable="false">
      <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 5c5 0 9 3.5 9 7s-4 7-9 7-9-3.5-9-7 4-7 9-7z" />
      <circle cx="12" cy="12" r="2.5" strokeWidth="1.5" />
    </svg>
  );
}

export function IconEyeOff({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" aria-hidden="true" focusable="false">
      <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M10.58 10.58A3 3 0 0013.42 13.42" />
      <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M9.88 5.58A11.97 11.97 0 0112 5c5 0 9 3.5 9 7s-4 7-9 7a11.97 11.97 0 01-2.12-.18" />
    </svg>
  );
}
