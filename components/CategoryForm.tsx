import React, { useState, useEffect } from 'react';
import { MenuCategory, Language } from '../types';
import { t } from '../utils/translations';

interface CategoryFormProps {
    category: MenuCategory | null;
    restaurantId: string;
    onClose: () => void;
    onSave: (category: Omit<MenuCategory, 'id' | 'restaurantId'>) => void;
    language: Language;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ category, restaurantId, onClose, onSave, language }) => {
    const [nameEn, setNameEn] = useState('');
    const [nameFa, setNameFa] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        if (category) {
            setNameEn(category.name.en);
            setNameFa(category.name.fa);
            setImageUrl(category.imageUrl);
        } else {
            setNameEn('');
            setNameFa('');
            setImageUrl('');
        }
    }, [category]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            name: { en: nameEn, fa: nameFa },
            imageUrl,
        });
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full" onClick={(e) => e.stopPropagation()} dir={language === 'fa' ? 'rtl' : 'ltr'}>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 border-b">
                        <h2 className="text-2xl font-bold text-gray-800">{category ? t('editCategory', language) : t('addNewCategory', language)}</h2>
                    </div>
                    <div className="p-6 space-y-4">
                        {/* Name fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">{t('englishName', language)}</label>
                                <input type="text" value={nameEn} onChange={e => setNameEn(e.target.value)} className="form-input" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">{t('persianName', language)}</label>
                                <input type="text" value={nameFa} onChange={e => setNameFa(e.target.value)} className="form-input" required dir="rtl" />
                            </div>
                        </div>
                        {/* Image URL */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">{t('imageUrl', language)}</label>
                             <div className="flex items-center gap-2">
                                <input 
                                    type="text" 
                                    value={imageUrl} 
                                    onChange={e => setImageUrl(e.target.value)} 
                                    className="form-input" 
                                    placeholder={t('pasteImageUrlPlaceholder', language)}
                                />
                                 {/* In a real app, an upload button would go here */}
                            </div>
                            {imageUrl && <img src={imageUrl} alt="preview" className="mt-2 h-32 w-full object-cover rounded-md"/>}
                        </div>
                    </div>
                    <div className="p-4 bg-gray-50 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 px-5 py-2 rounded-lg font-semibold hover:bg-gray-300">{t('cancel', language)}</button>
                        <button type="submit" className="bg-purple-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-purple-700">{t('saveChanges', language)}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CategoryForm;
