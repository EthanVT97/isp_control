
import React, { ReactNode } from 'react';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  children?: ReactNode; // For optional buttons or extra info on the right
}

const SectionTitle: React.FC<SectionTitleProps> = ({ title, subtitle, children }) => {
  return (
    <div className="mb-6 pb-3 border-b border-gray-300 flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
      {children && <div>{children}</div>}
    </div>
  );
};

export default SectionTitle;
