import React from 'react';
import { MenuCategory, Language } from '../types';
import { t } from '../utils/translations';

interface CategoryViewProps {
  categories: MenuCategory[];
  language: Language;
  onCategoryClick: (category: MenuCategory) => void;
}

const CategoryView: React.FC<CategoryViewProps> = ({ categories, language, onCategoryClick }) => {
  return (
    <div>
        <h1 className="text-3xl font-bold text-center mb-8 text-white">{t('pleaseSelectCategory', language)}</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {categories.map((category) => (
            <div
            key={category.id}
            className="relative rounded-xl overflow-hidden shadow-lg cursor-pointer group h-72 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            onClick={() => onCategoryClick(category)}
            >
            <img
                src={category.imageUrl}
                alt={category.name[language]}
                className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end justify-center p-6">
                <h2 className="text-white text-2xl font-bold tracking-wider text-center">
                {category.name[language]}
                </h2>
            </div>
            </div>
        ))}
        </div>
    </div>
  );
};

export default CategoryView;
