
import React from 'react';
import { PlusIcon } from './Icons';

interface HeaderProps {
  onAddRecord: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onAddRecord }) => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <h1 className="text-2xl font-bold text-gray-900">
            Poultry Farm Ledger
          </h1>
          <button
            onClick={onAddRecord}
            className="hidden sm:inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusIcon className="w-5 h-5 mr-2 -ml-1" />
            New Record
          </button>
        </div>
      </div>
    </header>
  );
};
