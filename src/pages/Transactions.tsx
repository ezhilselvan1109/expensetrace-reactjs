import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, ArrowUpDown, TrendingUp, TrendingDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTransactions, useDeleteTransaction } from '../hooks/useTransactions';
import { TransactionFilters, TRANSACTION_TYPES } from '../types/transaction';
import CategoryIcon from '../components/CategoryIcon';

function Transactions() {
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [filters, setFilters] = useState<TransactionFilters>({});
  const [searchTerm, setSearchTerm] = useState('');

  const { data: transactionsData, isLoading } = useTransactions(currentPage, pageSize, {
    ...filters,
    search: searchTerm
  });
  const deleteTransaction = useDeleteTransaction();

  const handleDeleteTransaction = async (id: string, description: string) => {
    if (window.confirm(`Are you sure you want to delete "${description}" transaction?`)) {
      try {
        await deleteTransaction.mutateAsync(id);
      } catch (error) {
        console.error('Failed to delete transaction:', error);
      }
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(0);
    setFilters(prev => ({ ...prev, search: searchTerm }));
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const formatDateTime = (date: string, time: any) => {
    // const dateObj = new Date(date);
    // const timeStr = `${time.hour.toString().padStart(2, '0')}:${time.minute.toString().padStart(2, '0')}`;
    return {
      date: "2025-07-19",
      time: "11:10"
    };
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case '1': // Expense
        return <TrendingDown className="w-5 h-5 text-red-600" />;
      case '2': // Income
        return <TrendingUp className="w-5 h-5 text-green-600" />;
      case '3': // Transfer
        return <ArrowUpDown className="w-5 h-5 text-blue-600" />;
      default:
        return <ArrowUpDown className="w-5 h-5 text-gray-600" />;
    }
  };

  const getAmountColor = (type: string) => {
    switch (type) {
      case '1': // Expense
        return 'text-red-600';
      case '2': // Income
        return 'text-green-600';
      case '3': // Transfer
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="h-12 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  console.log('Transactions data:', transactionsData);
  const transactions = transactionsData?.content || [];
  const totalPages = transactionsData?.totalPages || 0;
  const totalElements = transactionsData?.totalElements || 0;

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-600 mt-1">Track all your financial transactions</p>
        </div>
        <div className="sm:justify-self-end">
          <Link
            to="/transactions/add"
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Transaction
          </Link>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            All Transactions ({totalElements})
          </h2>
        </div>

        {transactions.length === 0 ? (
          <div className="p-8 text-center">
            <ArrowUpDown className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No transactions yet
            </h3>
            <p className="text-gray-500 mb-4">
              Start tracking your finances by adding your first transaction
            </p>
            <Link
              to="/transactions/add"
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Transaction
            </Link>
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-200">
              {transactions.map((transaction) => {
                const { date, time } = formatDateTime(transaction.date, transaction.time);
                return (
                  <div key={transaction.id} className="p-4 sm:p-6 flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1 min-w-0">
                      <div className="flex-shrink-0">
                        {transaction.category ? (
                          <CategoryIcon
                            icon={transaction.category.icon}
                            color={transaction.category.color}
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                            {getTransactionIcon(transaction.type)}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <p className="font-medium text-gray-900 truncate">
                            {transaction.description}
                          </p>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {TRANSACTION_TYPES[transaction.type]}
                          </span>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-sm text-gray-500">
                          <span>{date} at {time}</span>
                          {transaction.category && (
                            <span className="hidden sm:inline">• {transaction.category.name}</span>
                          )}
                          {transaction.account && (
                            <span className="hidden sm:inline">• {transaction.account.name}</span>
                          )}
                          {transaction.type === '3' && transaction.toAccount && (
                            <span className="hidden sm:inline">→ {transaction.toAccount.name}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className={`font-semibold ${getAmountColor(transaction.type)}`}>
                          {transaction.type === '1' ? '-' : transaction.type === '2' ? '+' : ''}
                          {formatCurrency(transaction.amount)}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/transactions/edit/${transaction.id}`}
                          className="p-2 text-gray-400 hover:text-indigo-600 transition-colors rounded-md hover:bg-gray-50"
                        >
                          <Edit className="w-5 h-5" />
                        </Link>
                        <button
                          onClick={() => handleDeleteTransaction(transaction.id, transaction.description)}
                          disabled={deleteTransaction.isPending}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50 rounded-md hover:bg-gray-50"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {(
              <div className="p-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements} transactions
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                      disabled={currentPage === 0}
                      className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    <span className="px-3 py-2 text-sm font-medium">
                      Page {currentPage + 1} of {totalPages}
                    </span>

                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                      disabled={currentPage >= totalPages - 1}
                      className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Transactions;