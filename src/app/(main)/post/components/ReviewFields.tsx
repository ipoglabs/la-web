import React from "react";

interface ReviewFieldsProps {
  title: string;
  value: string | string[];
  type?: "text" | "bullets";
}

// Simple review field display for text or bullets
const ReviewFields: React.FC<ReviewFieldsProps> = ({
  title,
  value,
  type = "text",
}) => {
  let content;
  if (type === "text") {
    content = (
      <span
        dangerouslySetInnerHTML={{
          __html: String(value).replace(/\n/g, "<br />"),
        }}
      />
    );
  } else if (type === "bullets") {
    content = (
      <ul className="list-disc pl-5 text-gray-600 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
        {Array.isArray(value) ? (
          value.map((v, i) => <li key={i}>{v}</li>)
        ) : (
          <li>{value}</li>
        )}
      </ul>
    );
  }

  return (
    <div className="mb-3.5">
      <div className="font-semibold text-sm text-gray-700 mb-1">{title}</div>
      <div className="font-normal text-sm text-gray-600">{content}</div>
    </div>
  );
};

export default ReviewFields;
