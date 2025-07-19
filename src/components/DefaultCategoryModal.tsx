import { useState } from 'react';
import { X, Search } from 'lucide-react';
import { Category } from '../types/category';
import { useSetDefaultCategory } from '../hooks/useCategories';
import CategoryIcon from './CategoryIcon';

interface DefaultCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  type: number;
  currentDefault?: Category;
}

export default function DefaultCategoryModal({ 
  isOpen, 
  onClose, 
  categories, 
  type,
  currentDefault 
}: DefaultCategoryModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const setDefaultCategory = useSetDefaultCategory();

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectCategory = async (category: Category) => {
    try {
      await setDefaultCategory.mutateAsync({ id: category.id, type });
      onClose();
    } catch (error) {
      console.error('Failed to set default category:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Select Default {type === 1 ? 'Expense' : 'Income'} Category
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {filteredCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleSelectCategory(category)}
                disabled={setDefaultCategory.isPending}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg border transition-colors ${
                  currentDefault?.id === category.id
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                } disabled:opacity-50`}
              >
                <CategoryIcon icon={category.icon} color={category.color} size="sm" />
                <span className="font-medium text-gray-900">{category.name}</span>
                {currentDefault?.id === category.id && (
                  <span className="ml-auto text-sm text-indigo-600 font-medium">Current</span>
                )}
              </button>
            ))}
          </div>

          {filteredCategories.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No categories found matching "{searchTerm}"
            </div>
          )}
        </div>

        <div className="p-4 border-t">
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors font-medium"
            >
              Set Default
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}