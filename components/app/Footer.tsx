import React from 'react';
import AppVersion from './Version';
import { FooterProps } from '@/props';

const Footer: React.FC<FooterProps> = ({ startYear, companyName }) => {
  const currentYear = new Date().getFullYear();
  
  const getCopyrightYears = () => {
    if (startYear && startYear < currentYear) {
      return `${startYear}-${currentYear}`;
    }
    return currentYear.toString();
  };

  return (
    <footer className="bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 py-4 relative z-30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="mb-2 sm:mb-0 order-2 sm:order-1">
            <AppVersion />
          </div>
          <div className="order-1 sm:order-2">
            <p className="text-sm sm:text-base">
              &copy; Copyright {getCopyrightYears()} {companyName}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;