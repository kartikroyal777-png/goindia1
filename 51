import React from 'react';
import { motion } from 'framer-motion';
import { Castle, Waves, Palmtree, Building, Trees, Mountain, Utensils, ShoppingBag } from 'lucide-react';
import { Category } from '../../types';

interface CategoryBarProps {
  categories: Category[];
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string | null) => void;
}

const CategoryBar: React.FC<CategoryBarProps> = ({ 
  categories, 
  selectedCategory, 
  onCategorySelect 
}) => {
  const getIcon = (iconName: string) => {
    const icons: { [key: string]: React.ElementType } = {
      castle: Castle,
      waves: Waves,
      palmtree: Palmtree,
      building: Building,
      trees: Trees,
      mountain: Mountain,
      utensils: Utensils,
      'shopping-bag': ShoppingBag,
    };
    return icons[iconName] || Building;
  };

  return (
    <div className="px-4 py-3">
      <div className="flex space-x-3 overflow-x-auto scrollbar-hide">
        {/* All Categories Button */}
        <motion.button
          onClick={() => onCategorySelect(null)}
          className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
            selectedCategory === null
              ? 'bg-orange-500 text-white shadow-lg shadow-orange-200'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          All
        </motion.button>

        {categories.map((category) => {
          const Icon = getIcon(category.icon);
          const isSelected = selectedCategory === category.id;
          
          return (
            <motion.button
              key={category.id}
              onClick={() => onCategorySelect(category.id)}
              className={`flex-shrink-0 flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                isSelected
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-base">{category.emoji}</span>
              <span>{category.name}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryBar;
