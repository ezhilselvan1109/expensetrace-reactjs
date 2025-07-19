import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useCreateCategory, useUpdateCategory, useCategories } from '../hooks/useCategories';
import { CreateCategoryData, CATEGORY_COLORS, CATEGORY_ICONS } from '../types/category';
import CategoryIcon from '../components/CategoryIcon';

const tabs = ['Expense', 'Income'];

interface FormData {
  name: string;
  type: number;
  color: string;
  icon: string;
}

function CategoryForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  
  const [activeTab, setActiveTab] = useState(0);
  const [selectedColor, setSelectedColor] = useState('blue');
  const [selectedIcon, setSelectedIcon] = useState('utensils');
  
  const { data: categories } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      name: '',
      type: 1,
      color: 'blue',
      icon: 'utensils'
    }
  });

  const watchedType = watch('type');

  // Load existing category data for editing
  useEffect(() => {
    if (isEditing && categories) {
      const category = categories.find(c => c.id === id);
      if (category) {
        setValue('name', category.name);
        setValue('type', category.type);
        setValue('color', category.color);
        setValue('icon', category.icon);
        setActiveTab(category.type === 1 ? 0 : 1);
        setSelectedColor(category.color);
        setSelectedIcon(category.icon);
      }
    }
  }, [isEditing, categories, id, setValue]);

  // Update form type when tab changes
  useEffect(() => {
    const newType = activeTab === 0 ? 1 : 2;
    setValue('type', newType);
  }, [activeTab, setValue]);

  // Update form values when selections change
  useEffect(() => {
    setValue('color', selectedColor);
  }, [selectedColor, setValue]);

  useEffect(() => {
    setValue('icon', selectedIcon);
  }, [selectedIcon, setValue]);

  const onSubmit = async (data: FormData) => {
    try {
      if (isEditing && id) {
        await updateCategory.mutateAsync({ id, data });
      } else {
        await createCategory.mutateAsync(data);
      }
    } catch (error) {
      console.error('Failed to save category:', error);
    }
  };

  const isPending = createCategory.isPending || updateCategory.isPending;

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto">
      <div className="mb-8">
        <button
          onClick={() => navigate('/categories')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Categories
        </button>
        <h1 className="text-3xl font-bold text-gray-900">
          {isEditing ? 'Edit Category' : 'Add Category'}
        </h1>
        <p className="text-gray-600 mt-1">
          {isEditing ? 'Update category details' : 'Create a new category for your expenses or income'}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Category Name */}
        <div className="bg-white rounded-lg shadow p-6">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Category Name
          </label>
          <input
            {...register('name', { required: 'Category name is required' })}
            type="text"
            id="name"
            placeholder="Enter category name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Category Type */}
        <div className="bg-white rounded-lg shadow p-6">
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Category Type
          </label>
          <div className="flex bg-gray-100 rounded-full p-1 max-w-xs">
            {tabs.map((tab, index) => {
              const active = activeTab === index;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(index)}
                  className={`flex-1 text-sm font-medium rounded-full py-2 transition-all duration-200 ${
                    active
                      ? "bg-white shadow text-black"
                      : "text-gray-500 hover:text-black"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        {/* Color Selection */}
        <div className="bg-white rounded-lg shadow p-6">
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Color
          </label>
          <div className="grid grid-cols-5 sm:grid-cols-8 gap-3">
            {CATEGORY_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setSelectedColor(color)}
                className={`relative w-10 h-10 rounded-full border-2 transition-all ${
                  selectedColor === color
                    ? 'border-gray-900 scale-110'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <CategoryIcon 
                  icon="circle" 
                  color={color} 
                  size="sm" 
                  className="w-full h-full border-0" 
                />
                {selectedColor === color && (
                  <Check className="absolute inset-0 w-4 h-4 text-white m-auto" />
                )}
              </button>
            ))}
          </div>
          <p className="mt-2 text-sm text-gray-500 capitalize">
            Selected: {selectedColor}
          </p>
        </div>

        {/* Icon Selection */}
        <div className="bg-white rounded-lg shadow p-6">
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Icon
          </label>
          <div className="space-y-6">
            {Object.entries(CATEGORY_ICONS).map(([group, icons]) => (
              <div key={group}>
                <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                  <span className="mr-2">{group === 'Food' ? '🍽️' : group === 'Travel' ? '✈️' : '🛒'}</span>
                  {group}
                </h3>
                <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
                  {icons.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setSelectedIcon(icon)}
                      className={`p-2 rounded-lg border-2 transition-all ${
                        selectedIcon === icon
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <CategoryIcon 
                        icon={icon} 
                        color={selectedColor} 
                        size="sm" 
                        className="mx-auto"
                      />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="bg-white rounded-lg shadow p-6">
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Preview
          </label>
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <CategoryIcon icon={selectedIcon} color={selectedColor} />
            <div>
              <p className="font-medium text-gray-900">
                {watch('name') || 'Category Name'}
              </p>
              <p className="text-sm text-gray-500">
                {watchedType === 1 ? 'Expense' : 'Income'} • {selectedColor}
              </p>
            </div>
          </div>
        </div>

        {/* Error Messages */}
        {(createCategory.error || updateCategory.error) && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="text-sm text-red-600">
              {createCategory.error?.message || updateCategory.error?.message || 'Failed to save category'}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={isPending}
            className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isPending ? 'Saving...' : isEditing ? 'Update Category' : 'Create Category'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/categories')}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default CategoryForm;