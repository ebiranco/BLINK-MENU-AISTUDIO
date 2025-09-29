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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, id: category?.id || '' });
  };

  return (
    <>
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-[60] p-4" onClick={onClose} dir={language === 'fa' ? 'rtl' : 'ltr'}>
      <div 
        className="bg-white/90 backdrop-blur-lg border border-white/20 rounded-xl shadow-2xl max-w-lg w-full text-gray-800"
        onClick={e => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b border-black/10">
            <h2 className="text-2xl font-bold">{category ? t('editCategory', language) : t('addNewCategory', language)}</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">{t('persianName', language)}</label>
                    <input type="text" value={formData.name.fa} onChange={(e) => handleTranslatableChange(e, 'name', 'fa')} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">{t('englishName', language)}</label>
                    <input type="text" value={formData.name.en} onChange={(e) => handleTranslatableChange(e, 'name', 'en')} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" required />
                </div>
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700">{t('imageUrl', language)}</label>
                <div className="mt-1 flex items-center gap-4">
                    <img
                        src={formData.imageUrl || 'https://via.placeholder.com/150/EEEEEE/808080?Text=No+Image'}
                        alt="Category Preview"
                        className="w-24 h-24 object-cover rounded-md bg-gray-100 border"
                    />
                    <div className="flex flex-col gap-2">
                        <input
                            type="file"
                            id="category-image-upload"
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                        <label
                            htmlFor="category-image-upload"
                            className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 text-center"
                        >
                            {t('changeImage', language)}
                        </label>
                        <button
                            type="button"
                            onClick={() => alert("Please use the AI Studio tab in the main dashboard for advanced image generation.")}
                            className="bg-purple-100 text-purple-700 py-2 px-3 rounded-md text-sm font-medium hover:bg-purple-200"
                        >
                            {t('generateWithAI', language)}
                        </button>
                    </div>
                </div>
                <input
                    type="text"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    className="mt-2 block w-full border-gray-300 rounded-md shadow-sm p-2 text-sm text-gray-600 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={t('pasteImageUrlPlaceholder', language)}
                />
            </div>
          </div>
          <div className="p-4 bg-black/5 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 px-5 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
              {t('cancel', language)}
            </button>
            <button type="submit" className="btn-animated-gradient bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2 rounded-lg font-semibold hover:opacity-90">
              {t('saveChanges', language)}
            </button>
          </div>
        </form>
      </div>
    </div>
    </>
  );
};

export default CategoryForm;