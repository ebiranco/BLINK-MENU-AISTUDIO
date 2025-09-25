import React, { useState, useEffect } from 'react';
import { MenuItem, MenuCategory, Language, TranslatableString } from '../types';
import { t } from '../utils/translations';
import AIStudio from './AIStudio';

const initialFormState: Omit<MenuItem, 'id'> = {
    name: { en: '', fa: '' },
    description: { en: '', fa: '' },
    price: 0,
    prepTime: 0,
    imageUrl: '',
    allergens: [],
    isFavorite: false,
    categoryId: '',
};

interface MenuItemFormProps {
  item: MenuItem | null;
  onClose: () => void;
  onSave: (item: MenuItem) => void;
  categories: MenuCategory[];
  language: Language;
}

const MenuItemForm: React.FC<MenuItemFormProps> = ({ item, onClose, onSave, categories, language }) => {
  const [formData, setFormData] = useState<Omit<MenuItem, 'id'>>(initialFormState);
  const [isAiStudioOpen, setIsAiStudioOpen] = useState(false);
  const [aiTarget, setAiTarget] = useState<'name' | 'description' | null>(null);

  useEffect(() => {
    if (item) {
        const allergenStringEN = item.allergens.map(a => a.en).join(', ');
        const allergenStringFA = item.allergens.map(a => a.fa).join(', ');
        // @ts-ignore
        setFormData({ ...item, allergensEN: allergenStringEN, allergensFA: allergenStringFA });
    } else {
      setFormData(initialFormState);
    }
  }, [item]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
        setFormData(prev => ({ ...prev, [name]: e.target.checked }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleTranslatableChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: 'name' | 'description', lang: 'en' | 'fa') => {
    const { value } = e.target;
    setFormData(prev => ({
        ...prev,
        [field]: { ...prev[field], [lang]: value }
    }));
  };

  const handleAllergensChange = (e: React.ChangeEvent<HTMLInputElement>, lang: 'en' | 'fa') => {
    const { value } = e.target;
    const key = lang === 'en' ? 'allergensEN' : 'allergensFA';
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const allergensEN = (formData as any).allergensEN?.split(',').map((s: string) => s.trim()).filter(Boolean) || [];
    const allergensFA = (formData as any).allergensFA?.split(',').map((s: string) => s.trim()).filter(Boolean) || [];

    const allergens: TranslatableString[] = allergensEN.map((en: string, index: number) => ({
        en: en,
        fa: allergensFA[index] || en // fallback to english if persian not provided
    }));

    onSave({ ...formData, allergens, id: item?.id || 0 });
  };
  
  const handleAiGenerated = (text: string) => {
    if (aiTarget) {
      if(aiTarget === 'name'){
        setFormData(prev => ({...prev, name: { ...prev.name, fa: text }}));
      } else {
         setFormData(prev => ({...prev, description: { ...prev.description, fa: text }}));
      }
    }
    setIsAiStudioOpen(false);
    setAiTarget(null);
  }

  return (
    <>
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4" dir={language === 'fa' ? 'rtl' : 'ltr'}>
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        <form onSubmit={handleSubmit} className="flex flex-col flex-grow">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-800">{item ? t('editItem', language) : t('addNewItem', language)}</h2>
          </div>
          <div className="p-6 space-y-4 overflow-y-auto">
            {/* Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">{t('persianName', language)}</label>
                <div className="flex items-center gap-2">
                    <input type="text" value={formData.name.fa} onChange={(e) => handleTranslatableChange(e, 'name', 'fa')} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                    <button type="button" onClick={() => { setAiTarget('name'); setIsAiStudioOpen(true); }} className="p-2 bg-purple-100 text-purple-600 rounded-md">AI</button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">{t('englishName', language)}</label>
                <input type="text" value={formData.name.en} onChange={(e) => handleTranslatableChange(e, 'name', 'en')} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
              </div>
            </div>

            {/* Description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                 <label className="block text-sm font-medium text-gray-700">{t('persianDescription', language)}</label>
                 <div className="flex items-center gap-2">
                    <textarea value={formData.description.fa} onChange={(e) => handleTranslatableChange(e, 'description', 'fa')} rows={3} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                    <button type="button" onClick={() => { setAiTarget('description'); setIsAiStudioOpen(true); }} className="p-2 bg-purple-100 text-purple-600 rounded-md">AI</button>
                 </div>
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700">{t('englishDescription', language)}</label>
                 <textarea value={formData.description.en} onChange={(e) => handleTranslatableChange(e, 'description', 'en')} rows={3} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
               </div>
            </div>

            {/* Price, Category, Prep Time */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">{t('price', language)}</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">{t('category', language)}</label>
                <select name="categoryId" value={formData.categoryId} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required>
                  <option value="">Select a category</option>
                  {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name[language]}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">{t('preparationTime', language)}</label>
                <input type="number" name="prepTime" value={formData.prepTime} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
              </div>
            </div>
            
            {/* Image URL & Favorite */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">{t('imageUrl', language)}</label>
                    <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                </div>
                 <div className="flex items-center pt-6">
                    <input type="checkbox" id="isFavorite" name="isFavorite" checked={formData.isFavorite} onChange={handleChange} className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                    <label htmlFor="isFavorite" className="ml-2 block text-sm text-gray-900">{t('isFavorite', language)}</label>
                </div>
            </div>
            
            {/* Allergens */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">{t('persianAllergens', language)}</label>
                <input type="text" value={(formData as any).allergensFA || ''} onChange={(e) => handleAllergensChange(e, 'fa')} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">{t('englishAllergens', language)}</label>
                <input type="text" value={(formData as any).allergensEN || ''} onChange={(e) => handleAllergensChange(e, 'en')} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
              </div>
            </div>

          </div>
          <div className="p-4 bg-gray-50 flex justify-end gap-3 mt-auto">
            <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 px-5 py-2 rounded-lg font-semibold hover:bg-gray-300">
              {t('cancel', language)}
            </button>
            <button type="submit" className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700">
              {t('saveChanges', language)}
            </button>
          </div>
        </form>
      </div>
    </div>
    {isAiStudioOpen && <AIStudio 
      onClose={() => setIsAiStudioOpen(false)} 
      language={language}
      onGenerate={handleAiGenerated}
      context={aiTarget === 'name' ? `Generate a creative Persian name for a food item. English name is: ${formData.name.en}` : `Generate an appetizing Persian description for a food item. The item is ${formData.name.en}. The English description is: ${formData.description.en}`}
    />}
    </>
  );
};

export default MenuItemForm;
