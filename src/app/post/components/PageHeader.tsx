import React from "react";

interface PageHeaderProps {
  title: string;
  description: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, description }) => (
  <div className="w-full flex flex-col items-center">
    <h1 className="text-3xl font-normal mb-2 text-gray-900">{title}</h1>
    <p className="text-gray-800 mb-6 text-base max-w-xl text-center font-light">
      {description}
    </p>
  </div>
);

export default PageHeader;
