import React from 'react';

interface PropertySectionProps {
  title: string;
  children: React.ReactNode;
}

const PropertySection: React.FC<PropertySectionProps> = ({ title, children }) => {
  return (
    <div className="mb-6">
      <h3 className="text-base font-medium text-gray-900 mb-3">
        {title}
      </h3>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
};

export default PropertySection;