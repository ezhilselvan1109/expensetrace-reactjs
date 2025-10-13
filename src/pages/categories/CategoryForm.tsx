import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  useCreateCategory,
  useUpdateCategory,
  useCategory,
} from "../../hooks/useCategories";
import {
  CATEGORY_COLORS,
  CATEGORY_ICONS,
  colorMap,
  iconTitle,
} from "../../types/category";
import CategoryIcon from "../../components/CategoryIcon";

const tabs = ["Expense", "Income"];

interface FormData {
  name: string;
  type: number;
  color: string;
  icon: string;
}

export default function CategoryForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [activeTab, setActiveTab] = useState(0);
  const [selectedColor, setSelectedColor] = useState("indigo");
  const [selectedIcon, setSelectedIcon] = useState("coffee");

  const { data: category, isLoading } = useCategory(id || "");
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: { name: "", type: 1, color: "indigo", icon: "coffee" },
  });

  const watchedType = watch("type");

  useEffect(() => {
    if (isEditing && category) {
      setValue("name", category.name);
      setValue("type", category.type);
      setValue("color", category.color);
      setValue("icon", category.icon);
      setActiveTab(category.type === 1 ? 0 : 1);
      setSelectedColor(category.color);
      setSelectedIcon(category.icon);
    }
  }, [isEditing, category, setValue]);

  useEffect(() => setValue("type", activeTab === 0 ? 1 : 2), [activeTab]);
  useEffect(() => setValue("color", selectedColor), [selectedColor]);
  useEffect(() => setValue("icon", selectedIcon), [selectedIcon]);

  const onSubmit = async (data: FormData) => {
    try {
      if (isEditing && id) await updateCategory.mutateAsync({ id, data });
      else await createCategory.mutateAsync(data);
      navigate("/categories");
    } catch (err) {
      console.error(err);
    }
  };

  const isPending = createCategory.isPending || updateCategory.isPending;

  if (isEditing && isLoading)
    return <div className="p-8 text-gray-500 animate-pulse">Loading...</div>;

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <button
            onClick={() => navigate("/categories")}
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mb-2 text-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Categories
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {isEditing ? "Edit Category" : "Add Category"}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {isEditing
              ? "Update category details"
              : "Create a new category for your expenses or income"}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category Name
              </label>
              <input
                {...register("name", { required: "Category name is required" })}
                type="text"
                placeholder="Ex: Food, Travel, Bills..."
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              />
              {errors.name && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Type
              </label>
              <div className="flex bg-gray-100 dark:bg-gray-800 rounded-full w-max p-1">
                {tabs.map((tab, idx) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(idx)}
                    className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                      activeTab === idx
                        ? "bg-indigo-600 text-white shadow"
                        : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Picker */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center justify-between">
                <span>Choose a Color</span>
                <span className="flex items-center gap-2 text-xs text-gray-500 capitalize">
                  Selected:
                  <span
                    className={`w-4 h-4 rounded-full ${colorMap[selectedColor]} border border-gray-200`}
                  ></span>
                  {selectedColor}
                </span>
              </label>

              <div className="grid grid-cols-8 sm:grid-cols-10 gap-3">
                {CATEGORY_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`relative w-10 h-10 rounded-full border-2 transition-all ${
                      selectedColor === color
                        ? `${colorMap[color]} ring-4 ring-indigo-300 scale-110`
                        : "border-transparent hover:scale-105 hover:shadow-sm"
                    }`}
                  >
                    <div className={`${colorMap[color]} w-full h-full rounded-full`} />
                    {selectedColor === color && (
                      <Check className="absolute inset-0 w-4 h-4 text-white m-auto drop-shadow" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Icon Picker */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Icon
              </label>

              {/* Icon Search */}
              <input
                type="text"
                placeholder="Search icon..."
                onChange={(e) => {
                  const query = e.target.value.toLowerCase();
                  document.querySelectorAll("[data-icon-name]").forEach((el) => {
                    const match = el
                      .getAttribute("data-icon-name")
                      ?.includes(query);
                    (el as HTMLElement).style.display = match ? "flex" : "none";
                  });
                }}
                className="w-full mb-4 px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-gray-100"
              />

              <div className="max-h-64 overflow-y-auto pr-1 space-y-5 rounded-xl bg-gray-50 dark:bg-gray-800 p-3 border border-gray-100 dark:border-gray-700">
                {Object.entries(CATEGORY_ICONS).map(([group, icons]) => (
                  <div key={group}>
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">
                      {iconTitle[group]}{group}
                    </h3>
                    <div className="grid grid-cols-6 gap-2">
                      {icons.map((icon) => (
                        <button
                          key={icon}
                          type="button"
                          data-icon-name={icon.toLowerCase()}
                          onClick={() => setSelectedIcon(icon)}
                          title={icon}
                          className={`relative p-2 rounded-full border-2 transition-all flex justify-center items-center group ${
                            selectedIcon === icon
                              ? `${colorMap[selectedColor]} bg-indigo-50 ring-4 ring-indigo-300 shadow-lg`
                              : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:shadow-sm"
                          }`}
                        >
                          <CategoryIcon
                            icon={icon}
                            color={selectedColor}
                            size="md"
                          />
                          <span className="absolute opacity-0 group-hover:opacity-100 bg-black text-white text-[10px] px-1.5 py-0.5 rounded-full top-11">
                            {icon}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Preview */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 flex flex-col items-center justify-center text-center border border-gray-200 dark:border-gray-700">
            <div className="p-6 rounded-full bg-gray-50 dark:bg-gray-900 shadow mb-4">
              <CategoryIcon icon={selectedIcon} color={selectedColor} size="lg" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              {watch("name") || "Category Name"}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {watchedType === 1 ? "Expense" : "Income"} • {selectedColor}
            </p>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-10">
          <button
            type="button"
            onClick={() => navigate("/categories")}
            className="flex-1 border border-gray-300 dark:border-gray-700 py-2.5 px-4 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition font-medium"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isPending}
            className="flex-1 bg-indigo-600 text-white py-2.5 px-4 rounded-xl hover:bg-indigo-700 transition font-medium shadow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending
              ? "Saving..."
              : isEditing
              ? "Update Category"
              : "Create Category"}
          </button>
        </div>
      </form>
    </div>
  );
}