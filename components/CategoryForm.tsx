import React, { useState, useEffect } from 'react';
import { MenuCategory, Language } from '../types';
import { t } from '../utils/translations';

interface CategoryFormProps {
  category: MenuCategory | null;
  onClose: () => void;
  onSave: (category: MenuCategory) => void;
  language: Language;
}

const initialFormState: Omit<MenuCategory, 'id'> = {
    name: { en: '', fa: '' },
    imageUrl: '',
};

const CategoryForm: React.FC<CategoryFormProps> = ({ category, onClose, onSave, language }) => {
  const [formData, setFormData] = useState<Omit<MenuCategory, 'id'>>(initialFormState);
  
  useEffect(() => {
    if (category) {
      setFormData({ name: category.name, imageUrl: category.imageUrl });
    } else {
      setFormData(initialFormState);
    }
  }, [category]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleTranslatableChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'name', lang: 'en' | 'fa') => {
    const { value } = e.target;
    setFormData(prev => ({
        ...prev,
        [field]: { ...prev[field], [lang]: value }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, id: category?.id || '' });
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4" dir={language === 'fa' ? 'rtl' : 'ltr'}>
      <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full">
        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-800">{category ? t('editCategory', language) : t('addNewCategory', language)}</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">{t('persianName', language)}</label>
                    <input type="text" value={formData.name.fa} onChange={(e) => handleTranslatableChange(e, 'name', 'fa')} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">{t('englishName', language)}</label>
                    <input type="text" value={formData.name.en} onChange={(e) => handleTranslatableChange(e, 'name', 'en')} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">{t('imageUrl', language)}</label>
                <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
            </div>
          </div>
          <div className="p-4 bg-gray-50 flex justify-end gap-3">
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
  );
};

export default CategoryForm;
