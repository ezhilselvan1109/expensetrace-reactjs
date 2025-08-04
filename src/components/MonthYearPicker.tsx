import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface MonthYearPickerProps {
  month: number;
  year: number;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
  label?: string;
  required?: boolean;
  className?: string;
  minYear?: number;
  maxYear?: number;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function MonthYearPicker({
  month,
  year,
  onMonthChange,
  onYearChange,
  label,
  required = false,
  className = '',
  minYear = 2020,
  maxYear = 2030
}: MonthYearPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'month' | 'year'>('month');

  const handleMonthSelect = (selectedMonth: number) => {
    onMonthChange(selectedMonth);
    setIsOpen(false);
  };

  const handleYearSelect = (selectedYear: number) => {
    onYearChange(selectedYear);
    setViewMode('month');
  };

  const navigateYear = (direction: 'prev' | 'next') => {
    const newYear = direction === 'prev' ? year - 1 : year + 1;
    if (newYear >= minYear && newYear <= maxYear) {
      onYearChange(newYear);
    }
  };

  const formatDisplayValue = () => {
    return `${MONTHS[month - 1]} ${year}`;
  };

  const generateYearRange = () => {
    const years = [];
    for (let y = minYear; y <= maxYear; y++) {
      years.push(y);
    }
    return years;
  };

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-left flex items-center justify-between"
      >
        <span className="text-gray-900">
          {formatDisplayValue()}
        </span>
        <Calendar className="w-5 h-5 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 p-4 min-w-[280px]">
          {viewMode === 'month' ? (
            <>
              {/* Month View Header */}
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={() => navigateYear('prev')}
                  className="p-1 hover:bg-gray-100 rounded-md"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                
                <button
                  type="button"
                  onClick={() => setViewMode('year')}
                  className="text-lg font-semibold text-gray-900 hover:text-indigo-600"
                >
                  {year}
                </button>
                
                <button
                  type="button"
                  onClick={() => navigateYear('next')}
                  className="p-1 hover:bg-gray-100 rounded-md"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Months Grid */}
              <div className="grid grid-cols-3 gap-2">
                {MONTHS.map((monthName, index) => (
                  <button
                    key={monthName}
                    type="button"
                    onClick={() => handleMonthSelect(index + 1)}
                    className={`p-2 text-sm rounded-md transition-colors ${
                      month === index + 1
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {monthName.slice(0, 3)}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              {/* Year View Header */}
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={() => setViewMode('month')}
                  className="text-lg font-semibold text-gray-900 hover:text-indigo-600"
                >
                  Select Year
                </button>
              </div>

              {/* Years Grid */}
              <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                {generateYearRange().map((yearOption) => (
                  <button
                    key={yearOption}
                    type="button"
                    onClick={() => handleYearSelect(yearOption)}
                    className={`p-2 text-sm rounded-md transition-colors ${
                      year === yearOption
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {yearOption}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Footer */}
          <div className="flex justify-end mt-4 pt-3 border-t border-gray-200">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setViewMode('month');
              }}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}