import { RESOURCE_CATEGORIES } from "./resourceData";

interface ResourceCategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
}

export function ResourceCategoryFilter({
  selectedCategory,
  onSelectCategory,
}: ResourceCategoryFilterProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
      <div className="bg-white rounded-2xl shadow-sm p-3 border border-stone-200/80 flex items-center justify-start md:justify-center gap-2 overflow-x-auto no-scrollbar">
        {RESOURCE_CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => onSelectCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? "bg-brand-coral text-white shadow-sm"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200/70 hover:text-stone-900"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}
