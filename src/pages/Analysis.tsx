import { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  BarChart3
} from 'lucide-react';
import { useFormatters } from '../hooks/useFormatters';
import { useAnalysisSummary, AnalysisParams } from '../hooks/useAnalysis';
import DateRangeModal from '../components/DateRangeModal';

const tabs = ['Week', 'Month', 'Year', 'Custom'];

const getWeekDates = (date: Date) => {
  const startOfWeek = new Date(date);
  const day = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - day;
  startOfWeek.setDate(diff);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  return { start: startOfWeek, end: endOfWeek };
};

function Analysis() {
  const { formatCurrency } = useFormatters();
  const [activeTab, setActiveTab] = useState(1);
  const [isDateRangeModalOpen, setIsDateRangeModalOpen] = useState(false);

  const currentDate = new Date();
  const [currentWeek, setCurrentWeek] = useState(currentDate);
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  const [customParams, setCustomParams] = useState<Partial<AnalysisParams>>({});
  const [customDisplayText, setCustomDisplayText] = useState('Custom');

  // ✅ Parse YYYY-MM-DD correctly
  const formatDisplayDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return date.toLocaleDateString();
  };

  const getAnalysisParams = (): AnalysisParams => {
    switch (activeTab) {
      case 0: {
        // ✅ Week uses from/to instead of date+month+year
        const { start, end } = getWeekDates(currentWeek);
        const format = (d: Date) => d.toISOString().split('T')[0]; // YYYY-MM-DD
        return {
          type: 1,
          from: format(start),
          to: format(end),
        };
      }
      case 1:
        return {
          type: 2,
          month: currentMonth,
          year: currentYear,
        };
      case 2:
        return {
          type: 3,
          year: currentYear,
        };
      case 3:
        return {
          type: customParams.type === 'all' ? 'all' : 4,
          ...customParams,
        };
      default:
        return {
          type: 2,
          month: currentMonth,
          year: currentYear,
        };
    }
  };

  const { data: analysisData, isLoading, isFetching } = useAnalysisSummary(getAnalysisParams());

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(newWeek.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeek(newWeek);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (currentMonth === 1) {
        setCurrentMonth(12);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 12) {
        setCurrentMonth(1);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  const navigateYear = (direction: 'prev' | 'next') => {
    setCurrentYear(currentYear + (direction === 'next' ? 1 : -1));
  };

  const handleCustomDateRange = (params: Partial<AnalysisParams>) => {
    setActiveTab(3); // ✅ switch to Custom tab only after modal confirm
    setCustomParams(params);

    if (params.type === 'all') {
      setCustomDisplayText('All Time');
    } else if (params.type === 4 && params.from && params.to) {
      setCustomDisplayText(`${formatDisplayDate(params.from)} - ${formatDisplayDate(params.to)}`);
    } else {
      setCustomDisplayText('Custom Range');
    }
  };

  const getDisplayText = () => {
    switch (activeTab) {
      case 0: {
        const { start, end } = getWeekDates(currentWeek);
        return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
      }
      case 1: {
        const monthNames = [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return `${monthNames[currentMonth - 1]} ${currentYear}`;
      }
      case 2:
        return currentYear.toString();
      case 3:
        return customDisplayText;
      default:
        return '';
    }
  };

  const balance = (analysisData?.income || 0) - (analysisData?.spending || 0);
  const showMainLoading = isLoading && !analysisData;
  const showCustomLoading = activeTab === 3 && (isFetching);

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Analysis</h1>
        <p className="text-sm text-gray-500">Detailed insights into your spending patterns</p>
      </div>

      {/* Tabs */}
      <div className="flex justify-evenly gap-2 bg-gray-100 rounded-full p-1 sm:w-fit mb-6">
        {tabs.map((tab, index) => {
          const active = activeTab === index;
          return (
            <button
              key={tab}
              onClick={() => {
                if (index === 3) {
                  // ✅ Custom tab -> open modal instead of switching immediately
                  setIsDateRangeModalOpen(true);
                } else {
                  setActiveTab(index);
                }
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${active
                ? 'bg-white shadow text-gray-900'
                : 'text-gray-500 hover:text-gray-900'
                }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Date Navigation */}
      <div className={`bg-white rounded-xl shadow p-4 mb-6 flex items-center justify-between ${showCustomLoading ? 'opacity-50' : ''}`}>
        <button
          onClick={() => {
            if (activeTab === 0) navigateWeek('prev');
            else if (activeTab === 1) navigateMonth('prev');
            else if (activeTab === 2) navigateYear('prev');
          }}
          disabled={activeTab === 3}
          className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>

        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-900">{getDisplayText()}</h2>
          <p className="text-sm text-gray-500">{tabs[activeTab]} Analysis</p>
        </div>

        <button
          onClick={() => {
            if (activeTab === 0) navigateWeek('next');
            else if (activeTab === 1) navigateMonth('next');
            else if (activeTab === 2) navigateYear('next');
          }}
          disabled={activeTab === 3}
          className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Summary Cards */}
      {showMainLoading ? (
        <div className="grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className={`grid gap-4 sm:grid-cols-3 transition-opacity ${showCustomLoading ? 'opacity-50' : ''}`}>
          <div className="bg-white rounded-xl shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Spending</p>
                <p className="text-xl font-bold text-red-600">
                  {formatCurrency(analysisData?.spending || 0)}
                </p>
              </div>
              <div className="bg-red-100 rounded-full p-3">
                <TrendingDown className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Income</p>
                <p className="text-xl font-bold text-green-600">
                  {formatCurrency(analysisData?.income || 0)}
                </p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Balance</p>
                <p className={`text-xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {balance >= 0 ? '+' : ''}{formatCurrency(Math.abs(balance))}
                </p>
              </div>
              <div className={`rounded-full p-3 ${balance >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                <DollarSign className={`h-5 w-5 ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`} />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={`space-y-6 sm:space-y-8 transition-opacity ${showCustomLoading ? 'opacity-50' : ''}`}>
        {/* Statistics Section */}
        <div
          className={`bg-white rounded-xl shadow p-4 sm:p-6 ${isFetching && !showCustomLoading ? "relative" : ""
            }`}
        >
          {isFetching && !showCustomLoading && (
            <div className="absolute top-2 right-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
            </div>
          )}

          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
            Statistics
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Transactions */}
            <div className="bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition p-4 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-full bg-indigo-100">
                    <BarChart3 className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h4 className="text-sm font-medium text-gray-700">Transactions</h4>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                <span className="text-2xl font-bold text-gray-900">{analysisData?.numberOfTransactions || 0}</span> Total transactions
              </p>
            </div>

            {/* Average Spending */}
            <div className="bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition p-4 flex flex-col">
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Average Spending
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs text-gray-600">Per Day</span>
                  <span className="text-sm font-semibold text-red-600">
                    {formatCurrency(analysisData?.averageSpendingPerDay || 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-600">Per Transaction</span>
                  <span className="text-sm font-semibold text-red-600">
                    {formatCurrency(analysisData?.averageSpendingPerTransaction || 0)}
                  </span>
                </div>
              </div>
            </div>

            {/* Average Income */}
            <div className="bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition p-4 flex flex-col">
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Average Income
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs text-gray-600">Per Day</span>
                  <span className="text-sm font-semibold text-green-600">
                    {formatCurrency(analysisData?.averageIncomePerDay || 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-600">Per Transaction</span>
                  <span className="text-sm font-semibold text-green-600">
                    {formatCurrency(analysisData?.averageIncomePerTransaction || 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Date Range Modal */}
      <DateRangeModal
        isOpen={isDateRangeModalOpen}
        onClose={() => setIsDateRangeModalOpen(false)}
        onApply={handleCustomDateRange}
      />
    </div>
  );
}

export default Analysis;