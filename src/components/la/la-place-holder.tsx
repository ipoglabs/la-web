import React from "react";

export interface LaPlaceHolderProps {
  title: string;
  error?: string;
  type?:
    | "text-input"
    | "drop-down"
    | "text-area"
    | "amount-input"
    | "date-input";
  className?: string;
}

// Common style definitions
const titleLabel = "block text-sm font-semibold text-gray-700 mb-2";
const inputBaseContainer =
  "rounded-md border-[1.5px] border-gray-900/28 bg-gray-100/80 p-2 flex items-center min-h-[40px]";
const inputBaseContent =
  "w-full flex items-center justify-between text-sm text-gray-800 font-normal";

export default function LaPlaceHolder({
  title,
  error,
  type = "text-input",
  className,
}: LaPlaceHolderProps) {
  return (
    <div className={`w-full${className ? ` ${className}` : ""}`}>
      {/* Title Label */}
      <label className={titleLabel}>
        {type === "amount-input" ? <span>{title} (£)</span> : title}
      </label>

      {/* Text Input Placeholder UX */}
      {type === "text-input" && (
        <div className={inputBaseContainer}>
          <div className={inputBaseContent}>
            <span>Enter value</span>
          </div>
        </div>
      )}

      {/* Drop Down Placeholder UX */}
      {type === "drop-down" && (
        <div className={inputBaseContainer}>
          <div className={inputBaseContent}>
            <span>Select an option</span>
            <svg
              className="w-4 h-4 text-gray-500 ml-2"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      )}

      {/* Date Input Placeholder UX */}
      {type === "date-input" && (
        <div className={inputBaseContainer}>
          <div className={inputBaseContent}>
            <span>Select date</span>
            {/* Solid calendar icon */}
            <svg
              className="w-4 h-4 text-gray-500 ml-2"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M6 2a1 1 0 00-1 1v1H5a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2h-.001V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 2V3h8v1H6zm10 2v10a1 1 0 01-1 1H5a1 1 0 01-1-1V6h12zm-2 3a1 1 0 10-2 0 1 1 0 002 0zm-4 0a1 1 0 10-2 0 1 1 0 002 0zm4 3a1 1 0 10-2 0 1 1 0 002 0zm-4 0a1 1 0 10-2 0 1 1 0 002 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      )}

      {/* Text Area Placeholder UX */}
      {type === "text-area" && (
        <div className={`${inputBaseContainer} min-h-[120px]`}>
          <div className={inputBaseContent}>
            <span>Enter value</span>
          </div>
        </div>
      )}

      {/* Amount Input Placeholder UX */}
      {type === "amount-input" && (
        <div className={inputBaseContainer}>
          <div className={inputBaseContent}>
            <span>Enter amount</span>
          </div>
        </div>
      )}
      {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
    </div>
  );
}
